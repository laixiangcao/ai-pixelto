import { SettingsMenu } from "@saas/settings/components/SettingsMenu";
import { PageHeader } from "@saas/shared/components/PageHeader";
import { SidebarContentLayout } from "@saas/shared/components/SidebarContentLayout";
import { CreditCardIcon, LineChart } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { PropsWithChildren } from "react";

export default async function BillingLayout({ children }: PropsWithChildren) {
	const t = await getTranslations();

	const menuItems = [
		{
			title: t("billing.title"),
			avatar: <CreditCardIcon className="size-4 opacity-50" />,
			items: [
				{
					title: t("billing.menu.billing"),
					href: "/app/billing",
					icon: <CreditCardIcon className="size-4 opacity-50" />,
				},
				{
					title: t("billing.menu.creditUsage"),
					href: "/app/billing/credit-usage",
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
