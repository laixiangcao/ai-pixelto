import { getActiveOrganization } from "@saas/auth/lib/server";
import { CreditUsage } from "@saas/payments/components/CreditUsage";
import { SettingsList } from "@saas/shared/components/SettingsList";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
	const t = await getTranslations();

	return {
		title: t("billing.menu.creditUsage"),
	};
}

export default async function OrganizationBillingCreditUsagePage({
	params,
}: {
	params: Promise<{ organizationSlug: string }>;
}) {
	const { organizationSlug } = await params;
	const organization = await getActiveOrganization(organizationSlug);

	if (!organization) {
		return notFound();
	}

	return (
		<SettingsList>
			<CreditUsage organizationId={organization.id} />
		</SettingsList>
	);
}
