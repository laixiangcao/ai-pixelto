import { createPurchasesHelper } from "@repo/payments/lib/helper";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useQuery } from "@tanstack/react-query";

interface UsePurchasesOptions {
	organizationId?: string;
	enabled?: boolean;
}

export const usePurchases = ({
	organizationId,
	enabled = true,
}: UsePurchasesOptions = {}) => {
	const { data } = useQuery({
		...orpc.payments.listPurchases.queryOptions({
			input: {
				organizationId,
			},
		}),
		enabled,
	});

	const purchases = data?.purchases ?? [];

	const { activePlan, hasSubscription, hasPurchase } =
		createPurchasesHelper(purchases);

	return { purchases, activePlan, hasSubscription, hasPurchase };
};

export const useUserPurchases = (options?: { enabled?: boolean }) =>
	usePurchases({ enabled: options?.enabled });

export const useOrganizationPurchases = (
	organizationId: string,
	options?: { enabled?: boolean },
) => usePurchases({ organizationId, enabled: options?.enabled });
