import { PostListItem } from "@marketing/blog/components/PostListItem";
import { getAllPosts } from "@marketing/blog/utils/lib/posts";
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata() {
	const t = await getTranslations();
	return {
		title: t("blog.title"),
	};
}

export default async function BlogListPage() {
	const locale = await getLocale();
	const t = await getTranslations();

	const posts = await getAllPosts();

	return (
		<main className="flex-1 pt-24 md:pt-32">
			<section className="relative pb-16 md:pb-24 overflow-hidden">
				<div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50 dark:opacity-30" />
				<div className="container px-4 text-center max-w-4xl mx-auto space-y-6">
					<h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 dark:from-white dark:to-white/60 animate-in fade-in slide-in-from-bottom-4 duration-1000">
						{t("blog.title")}
					</h1>
					<p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
						{t("blog.description")}
					</p>
				</div>
			</section>

			<section className="container px-4 pb-24 max-w-6xl mx-auto">
				<div className="grid gap-8 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
					{posts
						.filter(
							(post) => post.published && locale === post.locale,
						)
						.sort(
							(a, b) =>
								new Date(b.date).getTime() -
								new Date(a.date).getTime(),
						)
						.map((post) => (
							<PostListItem post={post} key={post.path} />
						))}
				</div>
			</section>
		</main>
	);
}
