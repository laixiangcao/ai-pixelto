import { ORPCError, type } from "@orpc/server";
import {
	getCreditGrantHistory,
	getCreditSpendHistory,
	getCreditUsageSummary,
} from "@repo/database";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";
import { verifyOrganizationMembership } from "../../organizations/lib/membership";

const CreditTypeEnum = z.enum([
	"DAILY_FREE",
	"PURCHASED",
	"SUBSCRIPTION",
	"PROMOTIONAL",
]);

export const getCreditUsage = protectedProcedure
	.route({
		method: "GET",
		path: "/payments/credit-usage",
		tags: ["Payments"],
		summary: "Get credit usage history",
		description:
			"Return credit spend history, grant history, and usage summary.",
	})
	.input(
		z.object({
			organizationId: z.string().nullable().optional(),
			type: z.enum(["spends", "grants", "summary"]).default("summary"),
			limit: z.number().min(1).max(100).default(50),
			offset: z.number().min(0).default(0),
			days: z.number().min(1).max(365).default(30),
		}),
	)
	.output(
		type<{
			spends?: {
				items: Array<{
					id: string;
					amount: number;
					reason: string | null;
					spendRef: string | null;
					grantType: z.infer<typeof CreditTypeEnum>;
					createdAt: string;
				}>;
				total: number;
				hasMore: boolean;
			};
			grants?: {
				items: Array<{
					id: string;
					amount: number;
					remainingAmount: number;
					type: z.infer<typeof CreditTypeEnum>;
					reason: string | null;
					sourceRef: string | null;
					expiresAt: string | null;
					createdAt: string;
				}>;
				total: number;
				hasMore: boolean;
			};
			summary?: {
				totalSpent: number;
				totalGranted: number;
				dailyUsage: Array<{ date: string; amount: number }>;
				period: {
					start: string;
					end: string;
					days: number;
				};
			};
		}>(),
	)
	.handler(async ({ input, context }) => {
		const ownerOrganizationId =
			input.organizationId ??
			context.session.activeOrganizationId ??
			null;

		if (ownerOrganizationId) {
			const membership = await verifyOrganizationMembership(
				ownerOrganizationId,
				context.user.id,
			);

			if (!membership) {
				throw new ORPCError("FORBIDDEN", {
					message: "You are not a member of this organization",
				});
			}
		}

		const ownerUserId = ownerOrganizationId ? undefined : context.user.id;

		const result: {
			spends?: {
				items: Array<{
					id: string;
					amount: number;
					reason: string | null;
					spendRef: string | null;
					grantType: z.infer<typeof CreditTypeEnum>;
					createdAt: string;
				}>;
				total: number;
				hasMore: boolean;
			};
			grants?: {
				items: Array<{
					id: string;
					amount: number;
					remainingAmount: number;
					type: z.infer<typeof CreditTypeEnum>;
					reason: string | null;
					sourceRef: string | null;
					expiresAt: string | null;
					createdAt: string;
				}>;
				total: number;
				hasMore: boolean;
			};
			summary?: {
				totalSpent: number;
				totalGranted: number;
				dailyUsage: Array<{ date: string; amount: number }>;
				period: {
					start: string;
					end: string;
					days: number;
				};
			};
		} = {};

		if (input.type === "spends" || input.type === "summary") {
			const spendsData = await getCreditSpendHistory({
				userId: ownerUserId,
				organizationId: ownerOrganizationId,
				limit: input.limit,
				offset: input.offset,
			});

			if (input.type === "spends") {
				result.spends = {
					items: spendsData.spends.map((spend) => ({
						...spend,
						createdAt: spend.createdAt.toISOString(),
					})),
					total: spendsData.total,
					hasMore: spendsData.hasMore,
				};
			}
		}

		if (input.type === "grants") {
			const grantsData = await getCreditGrantHistory({
				userId: ownerUserId,
				organizationId: ownerOrganizationId,
				limit: input.limit,
				offset: input.offset,
			});

			result.grants = {
				items: grantsData.grants.map((grant) => ({
					...grant,
					expiresAt: grant.expiresAt?.toISOString() ?? null,
					createdAt: grant.createdAt.toISOString(),
				})),
				total: grantsData.total,
				hasMore: grantsData.hasMore,
			};
		}

		if (input.type === "summary") {
			const summaryData = await getCreditUsageSummary({
				userId: ownerUserId,
				organizationId: ownerOrganizationId,
				days: input.days,
			});

			result.summary = summaryData;
		}

		return result;
	});
