import { LocaleLink, localeRedirect } from "@i18n/routing";
import { PostContent } from "@marketing/blog/components/PostContent";
import {
	getPostAvailableLocales,
	getPostBySlug,
} from "@marketing/blog/utils/lib/posts";
import { getBaseUrl } from "@repo/utils";
import { JsonLd } from "@shared/components/JsonLd";
import { getActivePathFromUrlParam } from "@shared/lib/content";
import {
	generateAlternates,
	generateArticleSchema,
} from "@shared/lib/seo";
import Image from "next/image";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";

type Params = {
	path: string;
	locale: string;
};

export async function generateMetadata(props: { params: Promise<Params> }) {
	const params = await props.params;

	const { path } = params;

	const locale = await getLocale();
	const slug = getActivePathFromUrlParam(path);
	const post = await getPostBySlug(slug, { locale });

	if (!post) {
		return { title: "Blog Post" };
	}

	const baseUrl = getBaseUrl();
	const imageUrl = post.image
		? post.image.startsWith("http")
			? post.image
			: `${baseUrl}${post.image}`
		: undefined;

	// 获取该文章实际可用的语言版本，避免 Google 认为是重复内容
	const availableLocales = getPostAvailableLocales(slug);

	return {
		title: post.title,
		description: post.excerpt,
		alternates: generateAlternates(`/blog/${slug}`, locale, availableLocales),
		openGraph: {
			type: "article",
			title: post.title,
			description: post.excerpt,
			publishedTime: post.date,
			authors: post.authorName ? [post.authorName] : undefined,
			images: imageUrl
				? [
						{
							url: imageUrl,
							width: 1200,
							height: 630,
							alt: post.title,
						},
					]
				: [],
		},
		twitter: {
			card: "summary_large_image",
			title: post.title,
			description: post.excerpt,
			images: imageUrl ? [imageUrl] : [],
		},
	};
}

export default async function BlogPostPage(props: { params: Promise<Params> }) {
	const { path, locale } = await props.params;
	setRequestLocale(locale);

	const t = await getTranslations();

	const slug = getActivePathFromUrlParam(path);
	const post = await getPostBySlug(slug, { locale });

	if (!post) {
		return localeRedirect({ href: "/blog", locale });
	}

	const { title, date, authorName, authorImage, tags, image, body, excerpt } =
		post;

	// Article Schema JSON-LD
	const articleSchema = generateArticleSchema({
		title,
		description: excerpt || title,
		image: image || undefined,
		publishedAt: date,
		author: authorName || undefined,
	});

	return (
		<div className="container max-w-6xl pt-32 pb-24">
			<JsonLd data={articleSchema} />
			<div className="mx-auto max-w-2xl">
				<div className="mb-12">
					<LocaleLink href="/blog">
						&larr; {t("blog.back")}
					</LocaleLink>
				</div>

				<h1 className="font-bold text-4xl">{title}</h1>

				<div className="mt-4 flex items-center justify-start gap-6">
					{authorName && (
						<div className="flex items-center">
							{authorImage && (
								<div className="relative mr-2 size-8 overflow-hidden rounded-full">
									<Image
										src={authorImage}
										alt={authorName}
										fill
										sizes="96px"
										className="object-cover object-center"
									/>
								</div>
							)}
							<div>
								<p className="font-semibold text-sm opacity-50">
									{authorName}
								</p>
							</div>
						</div>
					)}

					<div className="mr-0 ml-auto">
						<p className="text-sm opacity-30">
							{Intl.DateTimeFormat("en-US").format(
								new Date(date),
							)}
						</p>
					</div>

					{tags && (
						<div className="flex flex-1 flex-wrap gap-2">
							{tags.map((tag) => (
								<span
									key={tag}
									className="font-semibold text-primary text-xs uppercase tracking-wider"
								>
									#{tag}
								</span>
							))}
						</div>
					)}
				</div>
			</div>

			{image && (
				<div className="relative mt-6 aspect-16/9 overflow-hidden rounded-xl">
					<Image
						src={image}
						alt={title}
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						className="object-cover object-center"
					/>
				</div>
			)}

			<div className="pb-8">
				<PostContent content={body} />
			</div>
		</div>
	);
}
