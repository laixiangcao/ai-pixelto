import { type Config, config } from "@repo/config";
import type { PurchaseSchema } from "@repo/database";
import type { z } from "zod";

const plans = config.payments.plans as Config["payments"]["plans"];

type PlanId = keyof typeof config.payments.plans;
type PurchaseWithoutTimestamps = Omit<
	z.infer<typeof PurchaseSchema>,
	"createdAt" | "updatedAt"
>;

function getActivePlanFromPurchases(purchases?: PurchaseWithoutTimestamps[]) {
	const subscriptionPurchase = purchases?.find(
		(purchase) => purchase.type === "SUBSCRIPTION",
	);

	if (subscriptionPurchase) {
		const plan = Object.entries(plans).find(([_, plan]) =>
			plan.prices?.some(
				(price) => price.productId === subscriptionPurchase.productId,
			),
		);

		return {
			id: plan?.[0] as PlanId,
			price: plan?.[1].prices?.find(
				(price) => price.productId === subscriptionPurchase.productId,
			),
			status: subscriptionPurchase.status,
			purchaseId: subscriptionPurchase.id,
		};
	}

	const oneTimePurchase = purchases?.find(
		(purchase) => purchase.type === "ONE_TIME",
	);

	if (oneTimePurchase) {
		const plan = Object.entries(plans).find(([_, plan]) =>
			plan.prices?.some(
				(price) => price.productId === oneTimePurchase.productId,
			),
		);

		return {
			id: plan?.[0] as PlanId,
			price: plan?.[1].prices?.find(
				(price) => price.productId === oneTimePurchase.productId,
			),
			status: "active",
			purchaseId: oneTimePurchase.id,
		};
	}

	const freePlan = Object.entries(plans).find(([_, plan]) => plan.isFree);

	return freePlan
		? {
				id: freePlan[0] as PlanId,
				status: "active",
			}
		: null;
}

/**
 * 根据 productId (Stripe Price ID) 获取对应的 planId
 */
export function getPlanIdByProductId(productId: string): PlanId | null {
	const plan = Object.entries(plans).find(([_, plan]) =>
		plan.prices?.some((price) => price.productId === productId),
	);
	return plan ? (plan[0] as PlanId) : null;
}

/**
 * 获取计划的月度积分配额
 */
export function getPlanMonthlyCredits(planId: PlanId): number {
	const plan = plans[planId];
	if (!plan) {
		return 0;
	}
	return plan.credits?.monthly ?? 0;
}

/**
 * 计划级别映射（用于判断升级/降级）
 * 数值越大级别越高
 */
const PLAN_LEVEL: Record<string, number> = {
	free: 0,
	pro: 1,
	ultra: 2,
};

/**
 * 判断是否为升级（新计划级别 > 旧计划级别）
 */
export function isUpgrade(oldPlanId: PlanId, newPlanId: PlanId): boolean {
	const oldLevel = PLAN_LEVEL[oldPlanId] ?? 0;
	const newLevel = PLAN_LEVEL[newPlanId] ?? 0;
	return newLevel > oldLevel;
}

/**
 * 计算升级时应发放的差额积分
 * 返回值 > 0 表示应发放的积分数
 * 返回值 <= 0 表示无需发放（降级或相同计划）
 */
export function calculateUpgradeCreditsDiff(
	oldPlanId: PlanId,
	newPlanId: PlanId,
): number {
	if (!isUpgrade(oldPlanId, newPlanId)) {
		return 0;
	}
	const oldCredits = getPlanMonthlyCredits(oldPlanId);
	const newCredits = getPlanMonthlyCredits(newPlanId);
	return Math.max(0, newCredits - oldCredits);
}

export function createPurchasesHelper(purchases: PurchaseWithoutTimestamps[]) {
	const activePlan = getActivePlanFromPurchases(purchases);

	const hasSubscription = (planIds?: PlanId[] | PlanId) => {
		return (
			!!activePlan &&
			(Array.isArray(planIds)
				? planIds.includes(activePlan.id)
				: planIds === activePlan.id)
		);
	};

	const hasPurchase = (planId: PlanId) => {
		return !!purchases?.some((purchase) =>
			Object.entries(plans)
				.find(([id]) => id === planId)?.[1]
				.prices?.some(
					(price) => price.productId === purchase.productId,
				),
		);
	};

	return { activePlan, hasSubscription, hasPurchase };
}
