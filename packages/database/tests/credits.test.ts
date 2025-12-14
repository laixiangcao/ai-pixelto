import assert from "node:assert/strict";
import {
	planSpend,
	sortGrantsForSpend,
	totalAvailable,
} from "../prisma/queries/credits-helpers";

enum CreditType {
	DAILY_FREE = "DAILY_FREE",
	PURCHASED = "PURCHASED",
	SUBSCRIPTION = "SUBSCRIPTION",
	PROMOTIONAL = "PROMOTIONAL",
}

type GrantInput = {
	id: string;
	remainingAmount: number;
	expiresAt: Date | null;
	type: CreditType;
	createdAt: Date;
};

const makeGrant = (input: GrantInput) => ({ ...input });

const cases: Array<[string, () => void]> = [];

cases.push([
	"sortGrantsForSpend orders by expiry then type priority then createdAt",
	() => {
		const now = new Date("2024-12-09T00:00:00Z");
		const grants = [
			makeGrant({
				id: "purchased",
				remainingAmount: 10,
				expiresAt: null,
				type: CreditType.PURCHASED,
				createdAt: now,
			}),
			makeGrant({
				id: "subscription-late",
				remainingAmount: 10,
				expiresAt: new Date("2025-01-05T00:00:00Z"),
				type: CreditType.SUBSCRIPTION,
				createdAt: now,
			}),
			makeGrant({
				id: "subscription-early",
				remainingAmount: 10,
				expiresAt: new Date("2025-01-01T00:00:00Z"),
				type: CreditType.SUBSCRIPTION,
				createdAt: now,
			}),
			makeGrant({
				id: "daily",
				remainingAmount: 5,
				expiresAt: new Date("2024-12-09T23:59:59Z"),
				type: CreditType.DAILY_FREE,
				createdAt: now,
			}),
			makeGrant({
				id: "promo-same-expiry",
				remainingAmount: 5,
				expiresAt: new Date("2025-01-01T00:00:00Z"),
				type: CreditType.PROMOTIONAL,
				createdAt: new Date("2024-12-08T00:00:00Z"),
			}),
		];

		const sorted = sortGrantsForSpend(grants).map((g) => g.id);
		assert.deepEqual(sorted, [
			"daily",
			"subscription-early",
			"promo-same-expiry",
			"subscription-late",
			"purchased",
		]);
	},
]);

cases.push([
	"planSpend splits cost by FEFO and type priority",
	() => {
		const now = new Date("2024-12-09T00:00:00Z");
		const grants = [
			makeGrant({
				id: "daily",
				remainingAmount: 5,
				expiresAt: new Date("2024-12-09T23:59:59Z"),
				type: CreditType.DAILY_FREE,
				createdAt: now,
			}),
			makeGrant({
				id: "promo",
				remainingAmount: 3,
				expiresAt: new Date("2024-12-10T00:00:00Z"),
				type: CreditType.PROMOTIONAL,
				createdAt: now,
			}),
			makeGrant({
				id: "subscription",
				remainingAmount: 10,
				expiresAt: new Date("2024-12-15T00:00:00Z"),
				type: CreditType.SUBSCRIPTION,
				createdAt: now,
			}),
			makeGrant({
				id: "purchased",
				remainingAmount: 20,
				expiresAt: null,
				type: CreditType.PURCHASED,
				createdAt: now,
			}),
		];

		const { plan, available } = planSpend(grants, 12);
		assert.equal(available, 38);
		assert.deepEqual(plan, [
			{ grantId: "daily", amount: 5 },
			{ grantId: "promo", amount: 3 },
			{ grantId: "subscription", amount: 4 },
		]);
	},
]);

cases.push([
	"planSpend throws when insufficient credits",
	() => {
		const grants = [
			makeGrant({
				id: "tiny",
				remainingAmount: 1,
				expiresAt: null,
				type: CreditType.PURCHASED,
				createdAt: new Date("2024-12-09T00:00:00Z"),
			}),
		];

		assert.throws(
			() => planSpend(grants, 2),
			(error: unknown) =>
				error instanceof Error &&
				(error as Error & { code?: string }).code ===
					"INSUFFICIENT_CREDITS",
		);
	},
]);

cases.push([
	"totalAvailable sums remaining amounts",
	() => {
		const grants = [
			makeGrant({
				id: "a",
				remainingAmount: 1,
				expiresAt: null,
				type: CreditType.PURCHASED,
				createdAt: new Date("2024-12-09T00:00:00Z"),
			}),
			makeGrant({
				id: "b",
				remainingAmount: 2,
				expiresAt: null,
				type: CreditType.SUBSCRIPTION,
				createdAt: new Date("2024-12-09T00:00:00Z"),
			}),
		];

		assert.equal(totalAvailable(grants), 3);
	},
]);

let failed = false;
for (const [name, fn] of cases) {
	try {
		fn();
		console.log(`✓ ${name}`);
	} catch (error) {
		failed = true;
		console.error(`✗ ${name}`);
		console.error(error);
	}
}

if (failed) {
	process.exitCode = 1;
}
