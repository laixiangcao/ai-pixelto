import { ChangelogSection } from "@marketing/changelog/components/ChangelogSection";
import { getTranslations, setRequestLocale } from "next-intl/server";

// Demo 页面，禁止搜索引擎索引
export async function generateMetadata() {
	return {
		title: "Changelog",
		robots: {
			index: false,
			follow: false,
		},
	};
}

export default async function ChangelogPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations();

	return (
		<div className="container max-w-3xl pt-32 pb-16">
			<div className="mb-12 text-balance pt-8 text-center">
				<h1 className="mb-2 font-bold text-5xl">
					{t("changelog.title")}
				</h1>
				<p className="text-lg opacity-50">
					{t("changelog.description")}
				</p>
			</div>
			<ChangelogSection
				items={[
					{
						date: "2024-03-01",
						changes: ["🚀 Improved performance"],
					},
					{
						date: "2024-02-01",
						changes: ["🎨 Updated design", "🐞 Fixed a bug"],
					},
					{
						date: "2024-01-01",
						changes: ["🎉 Added new feature", "🐞 Fixed a bug"],
					},
				]}
			/>
		</div>
	);
}
