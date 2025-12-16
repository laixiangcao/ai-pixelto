import { config } from "@repo/config";
import { getBaseUrl } from "@repo/utils";
import type { Metadata } from "next";

const locales = Object.keys(config.i18n.locales);
const defaultLocale = config.i18n.defaultLocale;

/**
 * 生成带 locale 前缀的 URL 路径
 * 默认语言不添加前缀（SEO 最佳实践）
 */
export function getLocalePath(path: string, locale: string): string {
	// 默认语言不添加前缀
	if (locale === defaultLocale) {
		return path || "/";
	}
	return `/${locale}${path}`;
}

export interface GenerateSeoMetadataOptions {
	title: string;
	description: string;
	path: string;
	locale: string;
	image?: string;
	keywords?: string;
	type?: "website" | "article";
	publishedTime?: string;
	modifiedTime?: string;
	authors?: string[];
	noIndex?: boolean;
}

/**
 * 生成完整的 SEO 元数据，包括 Open Graph、Twitter Card 和 hreflang
 */
export function generateSeoMetadata(
	options: GenerateSeoMetadataOptions,
): Metadata {
	const {
		title,
		description,
		path,
		locale,
		image,
		keywords,
		type = "website",
		publishedTime,
		modifiedTime,
		authors,
		noIndex = false,
	} = options;

	const baseUrl = getBaseUrl();
	const localePath = getLocalePath(path, locale);
	const url = `${baseUrl}${localePath}`;
	const imageUrl = image?.startsWith("http")
		? image
		: `${baseUrl}${image || "/images/og-default.png"}`;

	// 生成所有语言版本的 URL（默认语言不带前缀）
	const languages: Record<string, string> = {};
	for (const loc of locales) {
		languages[loc] = `${baseUrl}${getLocalePath(path, loc)}`;
	}
	// x-default 指向默认语言（不带前缀）
	languages["x-default"] = `${baseUrl}${getLocalePath(path, defaultLocale)}`;

	const metadata: Metadata = {
		title,
		description,
		// keywords 对 Google 无效，但对百度等搜索引擎可能有用
		keywords: keywords ? keywords.split(",").map((k) => k.trim()) : undefined,
		alternates: {
			canonical: url,
			languages,
		},
		openGraph: {
			title,
			description,
			url,
			type,
			locale,
			siteName: config.appName,
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [imageUrl],
		},
	};

	// 文章类型添加额外信息
	if (type === "article" && metadata.openGraph) {
		const og = metadata.openGraph as Record<string, unknown>;
		if (publishedTime) {
			og.publishedTime = publishedTime;
		}
		if (modifiedTime) {
			og.modifiedTime = modifiedTime;
		}
		if (authors && authors.length > 0) {
			og.authors = authors;
		}
	}

	// 不索引的页面
	if (noIndex) {
		metadata.robots = {
			index: false,
			follow: false,
		};
	}

	return metadata;
}

/**
 * 生成 hreflang alternates 配置
 * @param path - 页面路径
 * @param locale - 当前语言
 * @param availableLocales - 可选，指定该页面可用的语言版本（用于部分多语言内容）
 */
export function generateAlternates(
	path: string,
	locale: string,
	availableLocales?: string[],
) {
	const baseUrl = getBaseUrl();
	const localePath = getLocalePath(path, locale);
	const url = `${baseUrl}${localePath}`;
	const targetLocales = availableLocales || locales;

	// 生成所有可用语言版本的 URL（默认语言不带前缀）
	const languages: Record<string, string> = {};
	for (const loc of targetLocales) {
		languages[loc] = `${baseUrl}${getLocalePath(path, loc)}`;
	}

	// x-default 指向默认语言，如果可用；否则指向第一个可用语言
	const defaultLoc = targetLocales.includes(defaultLocale)
		? defaultLocale
		: targetLocales[0];
	if (defaultLoc) {
		languages["x-default"] = `${baseUrl}${getLocalePath(path, defaultLoc)}`;
	}

	return {
		canonical: url,
		languages,
	};
}

// JSON-LD Schema 类型定义
export interface OrganizationSchema {
	"@context": "https://schema.org";
	"@type": "Organization";
	name: string;
	url: string;
	logo: string;
	description: string;
	sameAs?: string[];
}

export interface SoftwareApplicationSchema {
	"@context": "https://schema.org";
	"@type": "SoftwareApplication";
	name: string;
	applicationCategory: string;
	operatingSystem: string;
	description: string;
	offers: {
		"@type": "Offer";
		price: string;
		priceCurrency: string;
	};
}

export interface FAQPageSchema {
	"@context": "https://schema.org";
	"@type": "FAQPage";
	mainEntity: Array<{
		"@type": "Question";
		name: string;
		acceptedAnswer: {
			"@type": "Answer";
			text: string;
		};
	}>;
}

export interface ArticleSchema {
	"@context": "https://schema.org";
	"@type": "Article";
	headline: string;
	description: string;
	image?: string;
	datePublished?: string;
	dateModified?: string;
	author?: {
		"@type": "Person" | "Organization";
		name: string;
	};
}

export interface BreadcrumbListSchema {
	"@context": "https://schema.org";
	"@type": "BreadcrumbList";
	itemListElement: Array<{
		"@type": "ListItem";
		position: number;
		name: string;
		item: string;
	}>;
}

/**
 * 生成 Organization Schema
 */
export function generateOrganizationSchema(): OrganizationSchema {
	const baseUrl = getBaseUrl();

	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: config.appName,
		url: baseUrl,
		logo: `${baseUrl}/images/pixelto-logo.png`,
		description:
			"AI-powered image generation and editing platform. Turn text into stunning visuals in seconds.",
		sameAs: [
			config.contact.twitter,
			config.contact.discord,
			config.contact.telegram,
		].filter(Boolean),
	};
}

/**
 * 生成 SoftwareApplication Schema
 */
export function generateSoftwareApplicationSchema(): SoftwareApplicationSchema {
	return {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: `${config.appName} AI`,
		applicationCategory: "DesignApplication",
		operatingSystem: "Web",
		description:
			"AI-powered image generation and editing tool. Create stunning visuals from text prompts with premium AI models.",
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
		},
	};
}

/**
 * 生成 FAQPage Schema
 */
export function generateFAQPageSchema(
	faqs: Array<{ question: string; answer: string }>,
): FAQPageSchema {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.answer,
			},
		})),
	};
}

/**
 * 生成 Article Schema
 */
export function generateArticleSchema(article: {
	title: string;
	description: string;
	image?: string;
	publishedAt?: string;
	updatedAt?: string;
	author?: string;
}): ArticleSchema {
	const schema: ArticleSchema = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: article.title,
		description: article.description,
	};

	if (article.image) {
		schema.image = article.image;
	}
	if (article.publishedAt) {
		schema.datePublished = article.publishedAt;
	}
	if (article.updatedAt) {
		schema.dateModified = article.updatedAt;
	}
	if (article.author) {
		schema.author = {
			"@type": "Person",
			name: article.author,
		};
	}

	return schema;
}

/**
 * 生成 BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(
	breadcrumbs: Array<{ name: string; url: string }>,
): BreadcrumbListSchema {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: breadcrumbs.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	};
}
