import { db } from "../client";
import { CreditType, Prisma } from "../generated/client";
import { planSpend } from "./credits-helpers";

export class InvalidOwnerError extends Error {
	code = "INVALID_OWNER";

	constructor(
		message = "Exactly one of userId or organizationId is required",
	) {
		super(message);
		this.name = "InvalidOwnerError";
	}
}

type OwnerInput = {
	userId?: string;
	organizationId?: string | null;
};

function startOfDayUTC(date: Date) {
	return new Date(
		Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
	);
}

function endOfDayUTC(date: Date) {
	const end = startOfDayUTC(date);
	end.setUTCDate(end.getUTCDate() + 1);
	end.setUTCMilliseconds(end.getUTCMilliseconds() - 1);
	return end;
}

function addMonths(date: Date, months: number) {
	const d = new Date(
		Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
	);
	d.setUTCMonth(d.getUTCMonth() + months);
	return d;
}

function formatDateKey(date: Date) {
	return date.toISOString().slice(0, 10);
}

function resolveOwner({ userId, organizationId }: OwnerInput) {
	const hasUserId = Boolean(userId);
	const hasOrganizationId = Boolean(organizationId);

	if (hasUserId === hasOrganizationId) {
		throw new InvalidOwnerError();
	}

	return {
		ownerUserId: hasOrganizationId ? undefined : userId,
		ownerOrganizationId: hasOrganizationId
			? (organizationId as string)
			: undefined,
	};
}

export async function getCreditBalance({ userId, organizationId }: OwnerInput) {
	const { ownerUserId, ownerOrganizationId } = resolveOwner({
		userId,
		organizationId,
	});

	const { _sum } = await db.creditGrant.aggregate({
		where: {
			userId: ownerUserId,
			organizationId: ownerOrganizationId,
			OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
			remainingAmount: { gt: 0 },
		},
		_sum: {
			remainingAmount: true,
		},
	});

	return _sum.remainingAmount ?? 0;
}

export interface CreditDetailsResult {
	total: number;
	dailyFree: number;
	purchased: number;
	subscription: number;
	promotional: number;
	nextExpiry: Date | null;
}

export async function getCreditDetailsBalance({
	userId,
	organizationId,
}: OwnerInput): Promise<CreditDetailsResult> {
	const { ownerUserId, ownerOrganizationId } = resolveOwner({
		userId,
		organizationId,
	});

	const now = new Date();
	const baseWhere = {
		userId: ownerUserId,
		organizationId: ownerOrganizationId,
		OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
		remainingAmount: { gt: 0 },
	};

	const [
		dailyFreeSum,
		purchasedSum,
		subscriptionSum,
		promotionalSum,
		nextExpiryTx,
	] = await Promise.all([
		db.creditGrant.aggregate({
			where: { ...baseWhere, type: CreditType.DAILY_FREE },
			_sum: { remainingAmount: true },
		}),
		db.creditGrant.aggregate({
			where: { ...baseWhere, type: CreditType.PURCHASED },
			_sum: { remainingAmount: true },
		}),
		db.creditGrant.aggregate({
			where: { ...baseWhere, type: CreditType.SUBSCRIPTION },
			_sum: { remainingAmount: true },
		}),
		db.creditGrant.aggregate({
			where: { ...baseWhere, type: CreditType.PROMOTIONAL },
			_sum: { remainingAmount: true },
		}),
		db.creditGrant.findFirst({
			where: {
				userId: ownerUserId,
				organizationId: ownerOrganizationId,
				expiresAt: { not: null, gt: now },
				remainingAmount: { gt: 0 },
			},
			orderBy: { expiresAt: "asc" },
			select: { expiresAt: true },
		}),
	]);

	const dailyFree = dailyFreeSum._sum.remainingAmount ?? 0;
	const purchased = purchasedSum._sum.remainingAmount ?? 0;
	const subscription = subscriptionSum._sum.remainingAmount ?? 0;
	const promotional = promotionalSum._sum.remainingAmount ?? 0;
	const total = dailyFree + purchased + subscription + promotional;

	return {
		total,
		dailyFree,
		purchased,
		subscription,
		promotional,
		nextExpiry: nextExpiryTx?.expiresAt ?? null,
	};
}

export async function addCreditEntry({
	amount,
	reason,
	userId,
	organizationId,
	metadata,
	type = CreditType.PURCHASED,
	expiresAt,
	sourceRef,
}: {
	amount: number;
	reason?: string;
	userId?: string;
	organizationId?: string | null;
	metadata?: Prisma.InputJsonValue | null;
	type?: CreditType;
	expiresAt?: Date | null;
	sourceRef?: string | null;
}) {
	const { ownerUserId, ownerOrganizationId } = resolveOwner({
		userId,
		organizationId,
	});

	if (!Number.isInteger(amount) || amount <= 0) {
		throw new Error("Amount must be a positive integer");
	}

	return db.creditGrant.create({
		data: {
			amount,
			remainingAmount: amount,
			reason,
			userId: ownerUserId,
			organizationId: ownerOrganizationId,
			metadata: metadata ?? undefined,
			type,
			expiresAt: expiresAt ?? undefined,
			sourceRef: sourceRef ?? undefined,
		},
	});
}

export async function spendCreditsOrThrow({
	cost,
	reason,
	userId,
	organizationId,
	metadata,
	spendRef,
}: {
	cost: number;
	reason?: string;
	userId?: string;
	organizationId?: string | null;
	metadata?: Prisma.InputJsonValue | null;
	spendRef?: string | null;
}): Promise<{
	cost: number;
	allocations: SpendAllocation[];
}> {
	const { ownerUserId, ownerOrganizationId } = resolveOwner({
		userId,
		organizationId,
	});

	return db.$transaction(
		async (tx) => {
			const now = new Date();
			const grants = await tx.creditGrant.findMany({
				where: {
					userId: ownerUserId,
					organizationId: ownerOrganizationId,
					remainingAmount: { gt: 0 },
					OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
				},
				orderBy: [{ expiresAt: "asc" }, { createdAt: "asc" }],
			});

			const { plan } = planSpend(grants, cost);
			const grantById = new Map(grants.map((grant) => [grant.id, grant]));
			const allocations: SpendAllocation[] = [];

			for (const item of plan) {
				await tx.creditGrant.update({
					where: { id: item.grantId },
					data: {
						remainingAmount: { decrement: item.amount },
						updatedAt: new Date(),
					},
				});

				await tx.creditSpend.create({
					data: {
						grantId: item.grantId,
						amount: item.amount,
						reason,
						spendRef: spendRef ?? undefined,
						userId: ownerUserId,
						organizationId: ownerOrganizationId,
						metadata: metadata ?? undefined,
					},
				});

				const grant = grantById.get(item.grantId);
				if (grant) {
					allocations.push({
						grantId: item.grantId,
						amount: item.amount,
						type: grant.type,
						expiresAt: grant.expiresAt,
					});
				}
			}

			return { cost, allocations };
		},
		{ isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
	);
}

export type SpendAllocation = {
	grantId: string;
	amount: number;
	type: CreditType;
	expiresAt: Date | null;
};

export async function ensureDailyFreeGrant({
	userId,
	organizationId,
	amount,
	reason = "daily_free",
	date = new Date(),
	sourceRef,
}: OwnerInput & {
	amount: number;
	reason?: string;
	date?: Date;
	sourceRef?: string;
}) {
	if (amount <= 0) return null;

	const { ownerUserId, ownerOrganizationId } = resolveOwner({
		userId,
		organizationId,
	});

	const start = startOfDayUTC(date);
	const end = endOfDayUTC(date);

	return db.$transaction(async (tx) => {
		const existing = await tx.creditGrant.findFirst({
			where: {
				userId: ownerUserId,
				organizationId: ownerOrganizationId,
				type: CreditType.DAILY_FREE,
				expiresAt: { gte: start, lte: end },
			},
		});

		if (existing) return existing;

		return tx.creditGrant.create({
			data: {
				amount,
				remainingAmount: amount,
				type: CreditType.DAILY_FREE,
				expiresAt: end,
				reason,
				sourceRef: sourceRef ?? `daily-${formatDateKey(start)}`,
				userId: ownerUserId,
				organizationId: ownerOrganizationId,
			},
		});
	});
}

export async function ensureSubscriptionCycleGrant({
	userId,
	organizationId,
	amount,
	reason = "subscription_cycle",
	cycleAnchor,
	expiresInMonths = 1,
	sourceRefPrefix = "subscription",
}: OwnerInput & {
	amount: number;
	reason?: string;
	cycleAnchor: Date;
	expiresInMonths?: number;
	sourceRefPrefix?: string;
}) {
	if (amount <= 0) return null;

	const { ownerUserId, ownerOrganizationId } = resolveOwner({
		userId,
		organizationId,
	});

	const now = new Date();
	let cycleStart = startOfDayUTC(cycleAnchor);
	// 计算当前周期起点：以订阅开始日为锚点，每月递增，直到当前时间所在周期
	while (addMonths(cycleStart, 1) <= now) {
		cycleStart = addMonths(cycleStart, 1);
	}
	const cycleEnd = addMonths(cycleStart, expiresInMonths);
	const sourceRef = `${sourceRefPrefix}-${formatDateKey(cycleStart)}`;

	return db.$transaction(async (tx) => {
		const existing = await tx.creditGrant.findFirst({
			where: {
				userId: ownerUserId,
				organizationId: ownerOrganizationId,
				type: CreditType.SUBSCRIPTION,
				sourceRef,
			},
		});

		if (existing) return existing;

		return tx.creditGrant.create({
			data: {
				amount,
				remainingAmount: amount,
				type: CreditType.SUBSCRIPTION,
				expiresAt: cycleEnd,
				reason,
				sourceRef,
				userId: ownerUserId,
				organizationId: ownerOrganizationId,
			},
		});
	});
}

export async function ensurePromotionalGrant({
	userId,
	organizationId,
	amount,
	expiresAt,
	reason = "promotional",
	sourceRef,
}: OwnerInput & {
	amount: number;
	expiresAt: Date;
	reason?: string;
	sourceRef: string;
}) {
	if (amount <= 0) return null;

	const { ownerUserId, ownerOrganizationId } = resolveOwner({
		userId,
		organizationId,
	});

	return db.$transaction(async (tx) => {
		const existing = await tx.creditGrant.findFirst({
			where: {
				userId: ownerUserId,
				organizationId: ownerOrganizationId,
				sourceRef,
			},
		});

		if (existing) return existing;

		return tx.creditGrant.create({
			data: {
				amount,
				remainingAmount: amount,
				type: CreditType.PROMOTIONAL,
				expiresAt,
				reason,
				sourceRef,
				userId: ownerUserId,
				organizationId: ownerOrganizationId,
			},
		});
	});
}

/**
 * 幂等发放升级差额积分
 * 如果已存在相同 sourceRef 的积分，则跳过发放
 * 返回 { isNew: true, grant } 或 { isNew: false, grant }
 */
export async function ensureUpgradeCreditGrant({
	userId,
	organizationId,
	amount,
	expiresAt,
	sourceRef,
	reason = "upgrade_diff",
}: OwnerInput & {
	amount: number;
	expiresAt: Date;
	sourceRef: string;
	reason?: string;
}): Promise<{ isNew: boolean; grant: typeof CreditType } | null> {
	if (amount <= 0) {
		return null;
	}

	const { ownerUserId, ownerOrganizationId } = resolveOwner({
		userId,
		organizationId,
	});

	return db.$transaction(async (tx) => {
		// 幂等性检查：查找是否已存在相同 sourceRef 的积分
		const existing = await tx.creditGrant.findFirst({
			where: {
				userId: ownerUserId,
				organizationId: ownerOrganizationId,
				sourceRef,
			},
		});

		if (existing) {
			return {
				isNew: false,
				grant: existing as unknown as typeof CreditType,
			};
		}

		const grant = await tx.creditGrant.create({
			data: {
				amount,
				remainingAmount: amount,
				type: CreditType.SUBSCRIPTION,
				expiresAt,
				reason,
				sourceRef,
				userId: ownerUserId,
				organizationId: ownerOrganizationId,
			},
		});

		return { isNew: true, grant: grant as unknown as typeof CreditType };
	});
}

/**
 * 清理指定计划的当前周期订阅积分（用于升降级时）
 * 将旧计划的 SUBSCRIPTION 类型积分的 remainingAmount 清零
 * 包括：
 * - 订阅周期积分（sourceRef 以 subscription-{planId} 开头）
 * - 升级差额积分（sourceRef 以 upgrade-*-to-{planId} 开头）
 */
export async function invalidateSubscriptionGrantsForPlan({
	userId,
	organizationId,
	planId,
}: OwnerInput & {
	planId: string;
}) {
	const { ownerUserId, ownerOrganizationId } = resolveOwner({
		userId,
		organizationId,
	});

	const now = new Date();

	// 查找该计划当前有效的订阅积分
	// 包括：订阅周期积分 + 升级差额积分
	const grants = await db.creditGrant.findMany({
		where: {
			userId: ownerUserId,
			organizationId: ownerOrganizationId,
			type: CreditType.SUBSCRIPTION,
			remainingAmount: { gt: 0 },
			OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
			// 匹配 subscription-{planId}* 或 upgrade-*-to-{planId}-*
			sourceRef: {
				not: null,
			},
		},
	});

	// 过滤出与该计划相关的积分
	const relevantGrants = grants.filter((g) => {
		if (!g.sourceRef) {
			return false;
		}
		// 订阅周期积分：subscription-{planId}-*
		if (g.sourceRef.startsWith(`subscription-${planId}`)) {
			return true;
		}
		// 升级差额积分：upgrade-*-to-{planId}-*
		if (g.sourceRef.includes(`-to-${planId}-`)) {
			return true;
		}
		return false;
	});

	if (relevantGrants.length === 0) {
		return { invalidatedCount: 0, invalidatedAmount: 0 };
	}

	// 将所有匹配的积分清零
	const result = await db.creditGrant.updateMany({
		where: {
			id: { in: relevantGrants.map((g) => g.id) },
		},
		data: {
			remainingAmount: 0,
			updatedAt: new Date(),
		},
	});

	const invalidatedAmount = relevantGrants.reduce(
		(sum, g) => sum + g.remainingAmount,
		0,
	);

	return {
		invalidatedCount: result.count,
		invalidatedAmount,
	};
}

/**
 * 获取积分使用历史（消费记录）
 */
export async function getCreditSpendHistory({
	userId,
	organizationId,
	limit = 50,
	offset = 0,
}: OwnerInput & {
	limit?: number;
	offset?: number;
}) {
	const { ownerUserId, ownerOrganizationId } = resolveOwner({
		userId,
		organizationId,
	});

	const [spends, total] = await Promise.all([
		db.creditSpend.findMany({
			where: {
				userId: ownerUserId,
				organizationId: ownerOrganizationId,
			},
			orderBy: { createdAt: "desc" },
			take: limit,
			skip: offset,
			include: {
				grant: {
					select: {
						type: true,
						sourceRef: true,
					},
				},
			},
		}),
		db.creditSpend.count({
			where: {
				userId: ownerUserId,
				organizationId: ownerOrganizationId,
			},
		}),
	]);

	return {
		spends: spends.map((spend) => ({
			id: spend.id,
			amount: spend.amount,
			reason: spend.reason,
			spendRef: spend.spendRef,
			grantType: spend.grant.type,
			createdAt: spend.createdAt,
		})),
		total,
		hasMore: offset + spends.length < total,
	};
}

/**
 * 获取积分获取历史（发放记录）
 */
export async function getCreditGrantHistory({
	userId,
	organizationId,
	limit = 50,
	offset = 0,
}: OwnerInput & {
	limit?: number;
	offset?: number;
}) {
	const { ownerUserId, ownerOrganizationId } = resolveOwner({
		userId,
		organizationId,
	});

	const [grants, total] = await Promise.all([
		db.creditGrant.findMany({
			where: {
				userId: ownerUserId,
				organizationId: ownerOrganizationId,
			},
			orderBy: { createdAt: "desc" },
			take: limit,
			skip: offset,
		}),
		db.creditGrant.count({
			where: {
				userId: ownerUserId,
				organizationId: ownerOrganizationId,
			},
		}),
	]);

	return {
		grants: grants.map((grant) => ({
			id: grant.id,
			amount: grant.amount,
			remainingAmount: grant.remainingAmount,
			type: grant.type,
			reason: grant.reason,
			sourceRef: grant.sourceRef,
			expiresAt: grant.expiresAt,
			createdAt: grant.createdAt,
		})),
		total,
		hasMore: offset + grants.length < total,
	};
}

/**
 * 获取积分使用统计摘要
 */
export async function getCreditUsageSummary({
	userId,
	organizationId,
	days = 30,
}: OwnerInput & {
	days?: number;
}) {
	const { ownerUserId, ownerOrganizationId } = resolveOwner({
		userId,
		organizationId,
	});

	const startDate = new Date();
	startDate.setUTCDate(startDate.getUTCDate() - days);

	const [totalSpent, totalGranted, spendsByDay] = await Promise.all([
		// 总消费
		db.creditSpend.aggregate({
			where: {
				userId: ownerUserId,
				organizationId: ownerOrganizationId,
				createdAt: { gte: startDate },
			},
			_sum: { amount: true },
		}),
		// 总获取
		db.creditGrant.aggregate({
			where: {
				userId: ownerUserId,
				organizationId: ownerOrganizationId,
				createdAt: { gte: startDate },
			},
			_sum: { amount: true },
		}),
		// 按天统计消费
		db.creditSpend.groupBy({
			by: ["createdAt"],
			where: {
				userId: ownerUserId,
				organizationId: ownerOrganizationId,
				createdAt: { gte: startDate },
			},
			_sum: { amount: true },
		}),
	]);

	// 按天聚合
	const dailyUsage: Record<string, number> = {};
	for (const spend of spendsByDay) {
		const dateKey = spend.createdAt.toISOString().slice(0, 10);
		dailyUsage[dateKey] =
			(dailyUsage[dateKey] ?? 0) + (spend._sum.amount ?? 0);
	}

	return {
		totalSpent: totalSpent._sum.amount ?? 0,
		totalGranted: totalGranted._sum.amount ?? 0,
		dailyUsage: Object.entries(dailyUsage)
			.map(([date, amount]) => ({ date, amount }))
			.sort((a, b) => a.date.localeCompare(b.date)),
		period: {
			start: startDate.toISOString(),
			end: new Date().toISOString(),
			days,
		},
	};
}
