import { orpc } from "@shared/lib/orpc-query-utils";
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";

type BillingSummaryQueryOptions = ReturnType<
	typeof orpc.payments.getBillingSummary.queryOptions
>;

type BillingSummaryResult = Awaited<
	ReturnType<BillingSummaryQueryOptions["queryFn"]>
>;

export const billingSummaryQueryKey = (organizationId?: string | null) =>
	orpc.payments.getBillingSummary.queryKey({
		input: { organizationId: organizationId ?? null },
	});

export const useBillingSummary = (
	organizationId?: string | null,
	options?: Partial<UseQueryOptions<BillingSummaryResult>>,
) =>
	useQuery({
		...orpc.payments.getBillingSummary.queryOptions({
			input: { organizationId: organizationId ?? null },
		}),
		...options,
	});
