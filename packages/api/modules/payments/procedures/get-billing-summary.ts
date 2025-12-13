import { ORPCError, type } from "@orpc/server";
import { config, type Config } from "@repo/config";
import {
	ensureDailyFreeGrant,
	ensurePromotionalGrant,
	ensureSubscriptionCycleGrant,
	getCreditBalance,
	getCreditDetailsBalance,
	getPurchasesByOrganizationId,
	getPurchasesByUserId,
} from "@repo/database";
import { createPurchasesHelper } from "@repo/payments/lib/helper";
import { z } from "zod";
import { protectedProcedure } from "../../../orpc/procedures";
import { verifyOrganizationMembership } from "../../organizations/lib/membership";

export const getBillingSummary = protectedProcedure
	.route({
		method: "GET",
		path: "/payments/billing-summary",
		tags: ["Payments"],
		summary: "Get current plan and credit balance",
		description:
			"Return the active plan info and remaining credits for the current user or organization.",
	})
	.input(
		z.object({
			organizationId: z.string().nullable().optional(),
		}),
	)
	.output(
		type<{
			credits: number;
			creditDetails: {
				total: number;
				dailyFree: number;
				purchased: number;
				subscription: number;
				promotional: number;
				nextExpiry: string | null;
			};
			activePlan: ReturnType<typeof createPurchasesHelper>["activePlan"];
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

		const purchases = ownerOrganizationId
			? await getPurchasesByOrganizationId(ownerOrganizationId)
			: await getPurchasesByUserId(context.user.id);

		const { activePlan } = createPurchasesHelper(purchases);
		const ownerUserId = ownerOrganizationId ? undefined : context.user.id;

		// 懒发放：每日赠送（仅 Free 计划）
		const plans = config.payments.plans as unknown as Config["payments"]["plans"];
		const activePlanConfig = activePlan ? plans[activePlan.id] : plans.free;

		if (
			activePlan?.id === "free" &&
			(activePlanConfig?.credits?.daily ?? 0) > 0
		) {
			await ensureDailyFreeGrant({
				userId: ownerUserId,
				organizationId: ownerOrganizationId,
				amount: activePlanConfig.credits?.daily ?? 0,
			});
		}

		// 懒发放：订阅周期（月付或年付按月发放）
		if (
			activePlan?.price?.type === "recurring" &&
			(activePlanConfig?.credits?.monthly ?? 0) > 0
		) {
			const subscriptionPurchase =
				purchases.find(
					(purchase) =>
						purchase.id === activePlan.purchaseId &&
						purchase.type === "SUBSCRIPTION",
				) ??
				purchases.find((purchase) => purchase.type === "SUBSCRIPTION");

			const anchorDate = subscriptionPurchase?.createdAt ?? new Date();

			await ensureSubscriptionCycleGrant({
				userId: ownerUserId,
				organizationId: ownerOrganizationId,
				amount: activePlanConfig.credits?.monthly ?? 0,
				cycleAnchor: anchorDate,
				sourceRefPrefix: `subscription-${activePlan.id}`,
			});

			// 年付促销赠送（一次性），过期时间与年付周期对齐
			if (
				activePlan.price.interval === "year" &&
				(activePlanConfig?.credits?.promotionalBonus ?? 0) > 0 &&
				subscriptionPurchase
			) {
				const bonusExpiresAt = new Date(anchorDate);
				bonusExpiresAt.setUTCFullYear(bonusExpiresAt.getUTCFullYear() + 1);

				await ensurePromotionalGrant({
					userId: ownerUserId,
					organizationId: ownerOrganizationId,
					amount: activePlanConfig.credits?.promotionalBonus ?? 0,
					expiresAt: bonusExpiresAt,
					sourceRef: `promo-${activePlan.id}-${anchorDate.toISOString().slice(0, 10)}`,
				});
			}
		}

		const credits = await getCreditBalance({
			userId: ownerOrganizationId ? undefined : context.user.id,
			organizationId: ownerOrganizationId,
		});

		const creditDetailsRaw = await getCreditDetailsBalance({
			userId: ownerOrganizationId ? undefined : context.user.id,
			organizationId: ownerOrganizationId,
		});

		const creditDetails = {
			...creditDetailsRaw,
			nextExpiry: creditDetailsRaw.nextExpiry?.toISOString() ?? null,
		};

		return { credits, creditDetails, activePlan };
	});
