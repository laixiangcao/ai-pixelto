import { getActiveOrganization } from "@saas/auth/lib/server";
import { OrganizationLogo } from "@saas/organizations/components/OrganizationLogo";
import { SettingsMenu } from "@saas/settings/components/SettingsMenu";
import { PageHeader } from "@saas/shared/components/PageHeader";
import { SidebarContentLayout } from "@saas/shared/components/SidebarContentLayout";
import { CreditCardIcon, LineChart } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { PropsWithChildren } from "react";

export default async function OrganizationBillingLayout({
	children,
	params,
}: PropsWithChildren<{
	params: Promise<{ organizationSlug: string }>;
}>) {
	const t = await getTranslations();
	const { organizationSlug } = await params;
	const organization = await getActiveOrganization(organizationSlug);

	if (!organization) {
		return notFound();
	}

	const billingBasePath = `/app/${organizationSlug}/billing`;

	const menuItems = [
		{
			title: t("billing.title"),
			avatar: (
				<OrganizationLogo
					name={organization.name}
					logoUrl={organization.logo}
				/>
			),
			items: [
				{
					title: t("billing.menu.billing"),
					href: billingBasePath,
					icon: <CreditCardIcon className="size-4 opacity-50" />,
				},
				{
					title: t("billing.menu.creditUsage"),
					href: `${billingBasePath}/credit-usage`,
					icon: <LineChart className="size-4 opacity-50" />,
				},
			],
		},
	];

	return (
		<>
			<PageHeader
				title={t("billing.title")}
				subtitle={t("billing.subtitle")}
			/>
			<SidebarContentLayout
				sidebar={<SettingsMenu menuItems={menuItems} />}
			>
				{children}
			</SidebarContentLayout>
		</>
	);
}
