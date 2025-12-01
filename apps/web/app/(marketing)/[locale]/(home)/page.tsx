import { AIImageEditor } from "@ai-image-editor/AIImageEditor";
import { CTA } from "@marketing/home/components/CTA";
import { FaqSection } from "@marketing/home/components/FaqSection";
import { Features } from "@marketing/home/components/Features";
import { Hero } from "@marketing/home/components/Hero";
import { Inspiration } from "@marketing/home/components/Inspiration";
import { ParticleBackground } from "@marketing/home/components/ParticleBackground";
import { Showcase } from "@marketing/home/components/Showcase";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "home.hero" });

	return {
		title: `${t("title.prefix")} ${t("title.highlight")} ${t("title.suffix")}`,
		description: t("subtitle"),
		openGraph: {
			title: `${t("title.prefix")} ${t("title.highlight")} ${t("title.suffix")}`,
			description: t("subtitle"),
			images: [
				{
					url: "/images/hero-image.png",
					width: 1200,
					height: 630,
					alt: `${t("title.prefix")} ${t("title.highlight")} ${t("title.suffix")}`,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `${t("title.prefix")} ${t("title.highlight")} ${t("title.suffix")}`,
			description: t("subtitle"),
			images: ["/images/hero-image.png"],
		},
	};
}

export default async function Home({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<div className="relative min-h-screen">
			<ParticleBackground />

			<div className="relative z-10 space-y-24 md:space-y-32  py-24 md:py-32">
				<Hero />
				<AIImageEditor />
				<Showcase />
				<Inspiration />
				<Features />
				<FaqSection />
				<CTA />
			</div>
		</div>
	);
}
