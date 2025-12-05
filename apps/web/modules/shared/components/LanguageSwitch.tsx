"use client";

import { updateLocale } from "@i18n/lib/update-locale";
import { useLocalePathname, useLocaleRouter } from "@i18n/routing";
import { config } from "@repo/config";
import type { Locale } from "@repo/i18n";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import { ChevronDownIcon, GlobeIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";

const { locales } = config.i18n;

// Map locale codes to display labels
const localeLabels: Record<string, string> = {
	en: "English",
	zh: "中文",
	ja: "日本語",
	ko: "한국어",
};

export function LanguageSwitch({
	withLocaleInUrl = true,
}: {
	withLocaleInUrl?: boolean;
}) {
	const localeRouter = useLocaleRouter();
	const localePathname = useLocalePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentLocale = useLocale();
	const [value, setValue] = useState<string>(currentLocale);

	const currentLabel =
		localeLabels[currentLocale] || currentLocale.toUpperCase();

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
					aria-label="Language"
				>
					<GlobeIcon className="w-[18px] h-[18px]" />
					<span className="text-sm font-medium">{currentLabel}</span>
					<ChevronDownIcon className="w-3.5 h-3.5 opacity-60" />
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end">
				<DropdownMenuRadioGroup
					value={value}
					onValueChange={(newValue) => {
						setValue(newValue);

						if (withLocaleInUrl) {
							localeRouter.replace(
								`${localePathname}?${searchParams.toString()}`,
								{
									locale: newValue,
								},
							);
						} else {
							updateLocale(newValue as Locale);
							router.refresh();
						}
					}}
				>
					{Object.entries(locales).map(([locale, { label }]) => {
						return (
							<DropdownMenuRadioItem key={locale} value={locale}>
								{label}
							</DropdownMenuRadioItem>
						);
					})}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
