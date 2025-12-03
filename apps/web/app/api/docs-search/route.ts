import { config } from "@repo/config";
import { createI18nSearchAPI } from "fumadocs-core/search/server";
import { docsSource } from "../../docs-source";

const ORAMA_LANGUAGE_MAP: Record<string, string> = {
	en: "english",
	de: "german",
	zh: "english",
};

const searchLocales = Object.keys(config.i18n.locales);

export const { GET } = createI18nSearchAPI("advanced", {
	i18n: {
		defaultLanguage: config.i18n.defaultLocale,
		languages: Array.from(new Set(searchLocales)),
	},
	localeMap: ORAMA_LANGUAGE_MAP,
	indexes: docsSource.getLanguages().flatMap((entry) =>
		entry.pages.map((page) => ({
			title: page.data.title,
			description: page.data.description,
			structuredData: page.data.structuredData,
			id: page.url,
			url: page.url,
			locale: entry.language,
		})),
	),
});
