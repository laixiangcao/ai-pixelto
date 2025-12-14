import { GoogleGenAI } from "@google/genai";
import { ORPCError, type } from "@orpc/server";
import {
	addCreditEntry,
	InsufficientCreditsError,
	InvalidOwnerError,
	type SpendAllocation,
	spendCreditsOrThrow,
} from "@repo/database";
import { randomUUID } from "node:crypto";
import { protectedProcedure } from "../../../orpc/procedures";
import { verifyOrganizationMembership } from "../../organizations/lib/membership";

type ApiResponse<T> = {
	code: string;
	message: string;
	requestId: string;
	data: T | null;
};

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });
const IMAGE_MODELS: Record<
	string,
	{
		cost: number;
		active: boolean;
	}
> = {
	"gemini-2.5-flash-image": { cost: 4, active: true },
	"flux-context": { cost: 24, active: false },
	seedream: { cost: 12, active: false },
};
const DEFAULT_MODEL_ID = "gemini-2.5-flash-image";

const resolveRequestId = (headers?: Headers) =>
	headers?.get("x-request-id") ?? randomUUID();

const buildSuccess = <T>(requestId: string, data: T): ApiResponse<T> => ({
	code: "SUCCESS",
	message: "OK",
	requestId,
	data,
});

const buildError = (
	code: string,
	message: string,
	requestId: string,
	status?: number,
) =>
	new ORPCError(code, {
		status,
		message,
		data: {
			code,
			message,
			requestId,
			data: null,
		} satisfies ApiResponse<null>,
	});

export const editImage = protectedProcedure
	.route({
		method: "POST",
		path: "/ai/images/edit",
		tags: ["AI"],
		summary: "Edit an image with AI",
	})
	.input(
		type<{
			prompt: string;
			fileBase64: string;
			mimeType: string;
			modelId?: string;
			organizationId?: string | null;
		}>(),
	)
	.output(type<ApiResponse<{ imageBase64: string }>>())
	.handler(async ({ input, context }) => {
		const requestId = resolveRequestId(context.headers);

		if (!apiKey) {
			throw buildError(
				"GEMINI_API_KEY_MISSING",
				"GEMINI_API_KEY is not configured",
				requestId,
				500,
			);
		}

		const targetOrganizationId =
			input.organizationId ??
			context.session.activeOrganizationId ??
			null;

		const resolvedModelId =
			input.modelId && IMAGE_MODELS[input.modelId]
				? input.modelId
				: DEFAULT_MODEL_ID;
		const modelConfig =
			IMAGE_MODELS[resolvedModelId] ?? IMAGE_MODELS[DEFAULT_MODEL_ID];

		if (!modelConfig?.active) {
			throw buildError(
				"MODEL_UNAVAILABLE",
				"Selected model is not available",
				requestId,
				400,
			);
		}

		if (targetOrganizationId) {
			const membership = await verifyOrganizationMembership(
				targetOrganizationId,
				context.user.id,
			);

			if (!membership) {
				throw buildError(
					"FORBIDDEN_ORGANIZATION_ACCESS",
					"You are not a member of this organization",
					requestId,
					403,
				);
			}
		}

		const ownerOrganizationId = targetOrganizationId;
		const ownerUserId = ownerOrganizationId ? undefined : context.user.id;
		let spendCommitted = false;
		let spendAllocations: SpendAllocation[] = [];
		const spendRef = randomUUID();
		// 模型生成失败时补偿已扣除的积分，避免用户为失败请求付费
		const refundOnFailure = async () => {
			if (!spendCommitted || spendAllocations.length === 0) return;

			try {
				for (const allocation of spendAllocations) {
					await addCreditEntry({
						amount: allocation.amount,
						type: allocation.type,
						expiresAt: allocation.expiresAt ?? undefined,
						reason: "image_edit_refund",
						userId: ownerUserId,
						organizationId: ownerOrganizationId,
						metadata: {
							modelId: resolvedModelId,
							originalReason: "image_edit",
							spendRef,
							originalGrantId: allocation.grantId,
						},
					});
				}
			} catch (refundError) {
				console.error("生成失败后积分退款失败", {
					refundError,
					userId: ownerUserId,
					organizationId: ownerOrganizationId,
					modelId: resolvedModelId,
				});
			}
		};

		try {
			const spendResult = await spendCreditsOrThrow({
				cost: modelConfig.cost,
				reason: "image_edit",
				userId: ownerUserId,
				organizationId: ownerOrganizationId,
				metadata: {
					modelId: resolvedModelId,
					cost: modelConfig.cost,
					spendRef,
				},
				spendRef,
			});
			spendAllocations = spendResult.allocations;
			spendCommitted = true;
		} catch (error) {
			if (error instanceof InsufficientCreditsError) {
				throw buildError(
					"INSUFFICIENT_CREDITS",
					"Insufficient credits",
					requestId,
					402,
				);
			}
			if (error instanceof InvalidOwnerError) {
				throw buildError(
					"INVALID_CREDIT_OWNER",
					"A valid owner is required for credit operations",
					requestId,
					400,
				);
			}
			throw buildError(
				"CREDIT_DEDUCTION_FAILED",
				error instanceof Error
					? error.message
					: "Credit deduction failed",
				requestId,
				500,
			);
		}

		try {
			const response = await ai.models.generateContent({
				model: resolvedModelId,
				contents: {
					parts: [
						{
							inlineData: {
								data: input.fileBase64,
								mimeType: input.mimeType,
							},
						},
						{
							text: input.prompt || "Enhance this image",
						},
					],
				},
				config: {
					responseModalities: ["IMAGE"],
				},
			});

			const parts = response.candidates?.[0]?.content?.parts;
			const imageBase64 = parts?.find((part) => part.inlineData?.data)
				?.inlineData?.data;

			if (!imageBase64) {
				throw buildError(
					"NO_IMAGE_RETURNED",
					"No image returned from the model",
					requestId,
					500,
				);
			}

			return buildSuccess(requestId, { imageBase64 });
		} catch (error) {
			await refundOnFailure();
			if (error instanceof ORPCError) {
				throw error;
			}

			throw buildError(
				"IMAGE_GENERATION_FAILED",
				error instanceof Error
					? error.message
					: "Image generation failed",
				requestId,
				500,
			);
		}
	});
