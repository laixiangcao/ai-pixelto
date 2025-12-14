import { CreditUsage } from "@saas/payments/components/CreditUsage";
import { SettingsList } from "@saas/shared/components/SettingsList";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: t("billing.menu.creditUsage"),
	};
}

export default async function BillingCreditUsagePage() {
	return (
		<SettingsList>
			<CreditUsage />
		</SettingsList>
	);
}
