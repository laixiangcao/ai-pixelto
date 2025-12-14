import type { config } from "@repo/config";
import { useTranslations } from "next-intl";

type ProductReferenceId = keyof (typeof config)["payments"]["plans"];

export function usePlanData() {
	const t = useTranslations();

	const planData: Record<
		ProductReferenceId,
		{
			title: string;
		}
	> = {
		free: {
			title: t("pricing.products.free.title"),
		},
		pro: {
			title: t("pricing.products.pro.title"),
		},
		ultra: {
			title: t("pricing.products.ultra.title"),
		},
	};

	return { planData };
}
