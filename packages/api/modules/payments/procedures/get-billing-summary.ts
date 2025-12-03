import { ORPCError, type } from "@orpc/server";
import {
	getCreditBalance,
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

		const credits = await getCreditBalance({
			userId: ownerOrganizationId ? undefined : context.user.id,
			organizationId: ownerOrganizationId,
		});

		return { credits, activePlan };
	});
