import { getAllPosts } from "@marketing/blog/utils/lib/posts";
import { config } from "@repo/config";
import { getBaseUrl } from "@repo/utils";
import { getLocalePath } from "@shared/lib/seo";
import { allLegalPages } from "content-collections";
import type { MetadataRoute } from "next";

const baseUrl = getBaseUrl();
const locales = config.i18n.enabled
	? Object.keys(config.i18n.locales)
	: [config.i18n.defaultLocale];

// 静态营销页面（按优先级排序）
// 注意：changelog 和 docs 为 demo 页面，暂不收录
const staticMarketingPages = [
	{ path: "", priority: 1.0, changeFrequency: "weekly" as const },
	{ path: "/pricing", priority: 0.9, changeFrequency: "weekly" as const },
	{ path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
	{ path: "/contact", priority: 0.6, changeFrequency: "monthly" as const },
	{ path: "/blog", priority: 0.8, changeFrequency: "daily" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const posts = await getAllPosts();

	return [
		// 静态营销页面（默认语言不带前缀）
		...staticMarketingPages.flatMap((page) =>
			locales.map((locale) => ({
				url: new URL(getLocalePath(page.path, locale), baseUrl).href,
				lastModified: new Date(),
				changeFrequency: page.changeFrequency,
				priority: page.priority,
			})),
		),
		// 博客文章（默认语言不带前缀）
		...posts.map((post) => ({
			url: new URL(
				getLocalePath(`/blog/${post.path}`, post.locale),
				baseUrl,
			).href,
			lastModified: post.date ? new Date(post.date) : new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.7,
		})),
		// 法律页面（默认语言不带前缀）
		...allLegalPages.map((page) => ({
			url: new URL(
				getLocalePath(`/legal/${page.path}`, page.locale),
				baseUrl,
			).href,
			lastModified: new Date(),
			changeFrequency: "yearly" as const,
			priority: 0.3,
		})),
		// 注意：docs 页面为 demo，暂不收录
	];
}
