import { createCheckoutLink } from "./procedures/create-checkout-link";
import { createCustomerPortalLink } from "./procedures/create-customer-portal-link";
import { getBillingSummary } from "./procedures/get-billing-summary";
import { getCreditUsage } from "./procedures/get-credit-usage";
import { listPurchases } from "./procedures/list-purchases";

export const paymentsRouter = {
	createCheckoutLink,
	createCustomerPortalLink,
	getBillingSummary,
	getCreditUsage,
	listPurchases,
};
