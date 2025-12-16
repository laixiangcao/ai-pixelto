import { config } from "@repo/config";
import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: Object.keys(config.i18n.locales),
	defaultLocale: config.i18n.defaultLocale,
	localeCookie: {
		name: config.i18n.localeCookieName,
	},
	// "as-needed": 默认语言不显示前缀（如 /pricing），其他语言显示（如 /de/pricing）
	// 这是 SEO 最佳实践，避免默认语言 URL 冗余
	localePrefix: config.i18n.enabled ? "as-needed" : "never",
	localeDetection: config.i18n.enabled,
});

export const {
	Link: LocaleLink,
	redirect: localeRedirect,
	usePathname: useLocalePathname,
	useRouter: useLocaleRouter,
} = createNavigation(routing);
