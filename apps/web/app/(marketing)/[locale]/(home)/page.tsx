import { AIImageEditor } from "@ai-image-editor/AIImageEditor";
import { CTA } from "@marketing/home/components/CTA";
import { FaqSection } from "@marketing/home/components/FaqSection";
import { Features } from "@marketing/home/components/Features";
import { Hero } from "@marketing/home/components/Hero";
import { Inspiration } from "@marketing/home/components/Inspiration";
import { ParticleBackground } from "@marketing/home/components/ParticleBackground";
import { Showcase } from "@marketing/home/components/Showcase";
import { JsonLdMultiple } from "@shared/components/JsonLd";
import {
	generateOrganizationSchema,
	generateSeoMetadata,
	generateSoftwareApplicationSchema,
} from "@shared/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { getInspirationData } from "@marketing/home/lib/inspiration";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "seo.home" });

	return generateSeoMetadata({
		title: t("title"),
		description: t("description"),
		keywords: t("keywords"),
		path: "",
		locale,
		image: "/images/hero-image.png",
	});
}

export default async function Home({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);

	// JSON-LD 结构化数据
	const schemas = [
		generateOrganizationSchema(),
		generateSoftwareApplicationSchema(),
	];

	return (
		<div className="relative min-h-screen">
			<JsonLdMultiple schemas={schemas} />
			<ParticleBackground />

			{/* Main content with consistent spacing */}
			<div className="relative z-10 pt-24 md:pt-32 pb-8">
				{/* Hero - no extra spacing needed, first element */}
				<Hero />

				{/* Main Editor Section */}
				<AIImageEditor />

				{/* Showcase */}
				<Showcase />

				{/* Inspiration Gallery */}
				<Inspiration {...(await getInspirationData())} />

				{/* Features - has its own background */}
				<Features />

				{/* FAQ */}
				<FaqSection />

				{/* CTA - Final call to action */}
				<CTA />
			</div>
		</div>
	);
}
