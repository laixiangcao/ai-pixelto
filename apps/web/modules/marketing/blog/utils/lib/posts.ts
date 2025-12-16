import type { Post } from "@marketing/blog/types";
import { allPosts } from "content-collections";

export async function getAllPosts(): Promise<Post[]> {
	// ... add a custom loader here for your posts and map it to the post schema

	return Promise.resolve(allPosts);
}

export async function getPostBySlug(
	slug: string,
	options?: {
		locale?: string;
	},
): Promise<Post | null> {
	// ... add a custom loader here for your posts and map it to the post schema

	return Promise.resolve(
		allPosts.find(
			(post) =>
				post.path === slug &&
				(!options?.locale || post.locale === options.locale),
		) ?? null,
	);
}

/**
 * 获取指定文章可用的语言版本
 * @param slug - 文章路径
 * @returns 该文章存在的语言版本数组
 */
export function getPostAvailableLocales(slug: string): string[] {
	return allPosts.filter((post) => post.path === slug).map((post) => post.locale);
}
