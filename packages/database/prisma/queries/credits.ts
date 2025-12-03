import { db } from "../client";
import { Prisma } from "../generated/client";

export class InvalidOwnerError extends Error {
	code = "INVALID_OWNER";

	constructor(message = "Exactly one of userId or organizationId is required") {
		super(message);
		this.name = "InvalidOwnerError";
	}
}

export class InsufficientCreditsError extends Error {
	code = "INSUFFICIENT_CREDITS";

	constructor(message = "Insufficient credits") {
		super(message);
		this.name = "InsufficientCreditsError";
	}
}

export async function getCreditBalance({
	userId,
	organizationId,
}: {
	userId?: string;
	organizationId?: string | null;
}) {
	const { ownerUserId, ownerOrganizationId } = resolveOwner({
		userId,
		organizationId,
	});

	const { _sum } = await db.creditTransaction.aggregate({
		where: {
			userId: ownerUserId,
			organizationId: ownerOrganizationId,
		},
		_sum: {
			amount: true,
		},
	});

	return _sum.amount ?? 0;
}

export async function addCreditEntry({
	amount,
	reason,
	userId,
	organizationId,
	metadata,
}: {
	amount: number;
	reason?: string;
	userId?: string;
	organizationId?: string | null;
	metadata?: Prisma.InputJsonValue | null;
}) {
	const { ownerUserId, ownerOrganizationId } = resolveOwner({
		userId,
		organizationId,
	});

	if (amount === 0) {
		throw new Error("Amount cannot be zero");
	}

	return db.creditTransaction.create({
		data: {
			amount,
			reason,
			userId: ownerUserId,
			organizationId: ownerOrganizationId,
			metadata: metadata ?? undefined,
		},
	});
}

export async function spendCreditsOrThrow({
	cost,
	reason,
	userId,
	organizationId,
	metadata,
}: {
	cost: number;
	reason?: string;
	userId?: string;
	organizationId?: string | null;
	metadata?: Prisma.InputJsonValue | null;
}) {
	if (!Number.isInteger(cost) || cost <= 0) {
		throw new Error("Cost must be a positive integer");
	}

	const { ownerUserId, ownerOrganizationId } = resolveOwner({
		userId,
		organizationId,
	});

	return db.$transaction(
		async (tx) => {
			const balance =
				(
					await tx.creditTransaction.aggregate({
						where: {
							userId: ownerUserId,
							organizationId: ownerOrganizationId,
						},
						_sum: { amount: true },
					})
				)._sum.amount ?? 0;

			if (balance < cost) {
				throw new InsufficientCreditsError();
			}

			return tx.creditTransaction.create({
				data: {
					amount: -cost,
					reason,
					userId: ownerUserId,
					organizationId: ownerOrganizationId,
					metadata: metadata ?? undefined,
				},
			});
		},
		{ isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
	);
}

function resolveOwner({
	userId,
	organizationId,
}: {
	userId?: string;
	organizationId?: string | null;
}) {
	const hasUserId = Boolean(userId);
	const hasOrganizationId = Boolean(organizationId);

	if (hasUserId === hasOrganizationId) {
		throw new InvalidOwnerError();
	}

	return {
		ownerUserId: hasOrganizationId ? undefined : userId,
		ownerOrganizationId: hasOrganizationId ? (organizationId as string) : undefined,
	};
}
