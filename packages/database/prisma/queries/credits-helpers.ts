export type CreditTypeValue =
	| "DAILY_FREE"
	| "PURCHASED"
	| "SUBSCRIPTION"
	| "PROMOTIONAL";

export class InsufficientCreditsError extends Error {
	code = "INSUFFICIENT_CREDITS";

	constructor(message = "Insufficient credits") {
		super(message);
		this.name = "InsufficientCreditsError";
	}
}

export type GrantLike = {
	id: string;
	remainingAmount: number;
	expiresAt: Date | null;
	type: CreditTypeValue;
	createdAt: Date;
};

const TYPE_PRIORITY: Record<CreditTypeValue, number> = {
	DAILY_FREE: 4,
	SUBSCRIPTION: 3,
	PROMOTIONAL: 2,
	PURCHASED: 1,
};

export function sortGrantsForSpend(grants: GrantLike[]) {
	return [...grants].sort((a, b) => {
		const aExpires = a.expiresAt?.getTime() ?? Number.POSITIVE_INFINITY;
		const bExpires = b.expiresAt?.getTime() ?? Number.POSITIVE_INFINITY;
		if (aExpires !== bExpires) return aExpires - bExpires;

		const typeDiff = TYPE_PRIORITY[b.type] - TYPE_PRIORITY[a.type];
		if (typeDiff !== 0) return typeDiff;

		return a.createdAt.getTime() - b.createdAt.getTime();
	});
}

export function totalAvailable(grants: Pick<GrantLike, "remainingAmount">[]) {
	return grants.reduce((sum, grant) => sum + grant.remainingAmount, 0);
}

export function planSpend(grants: GrantLike[], cost: number) {
	if (!Number.isInteger(cost) || cost <= 0) {
		throw new Error("Cost must be a positive integer");
	}

	const sorted = sortGrantsForSpend(grants);
	const available = totalAvailable(sorted);

	if (available < cost) {
		throw new InsufficientCreditsError();
	}

	const plan: Array<{ grantId: string; amount: number }> = [];
	let remaining = cost;

	for (const grant of sorted) {
		if (remaining <= 0) break;
		const deduction = Math.min(grant.remainingAmount, remaining);
		plan.push({ grantId: grant.id, amount: deduction });
		remaining -= deduction;
	}

	return { plan, available };
}
