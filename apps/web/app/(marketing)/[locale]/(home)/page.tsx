import { AIImageEditor } from "@ai-image-editor/AIImageEditor";
import { CTA } from "@marketing/home/components/CTA";
import { FaqSection } from "@marketing/home/components/FaqSection";
import { Features } from "@marketing/home/components/Features";
import { Hero } from "@marketing/home/components/Hero";
import { Inspiration } from "@marketing/home/components/Inspiration";
import { ParticleBackground } from "@marketing/home/components/ParticleBackground";
import { Showcase } from "@marketing/home/components/Showcase";
import { getInspirationData } from "@marketing/home/lib/inspiration";
import { getShowcaseData } from "@marketing/home/lib/showcase";
import { JsonLdMultiple } from "@shared/components/JsonLd";
import {
	generateOrganizationSchema,
	generateSeoMetadata,
	generateSoftwareApplicationSchema,
} from "@shared/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";

function getHomeFaqItems(t: (key: string) => string) {
	return [
		{ id: "item-1", question: t("q1.question"), answer: t("q1.answer") },
		{ id: "item-2", question: t("q2.question"), answer: t("q2.answer") },
		{ id: "item-3", question: t("q3.question"), answer: t("q3.answer") },
		{ id: "item-4", question: t("q4.question"), answer: t("q4.answer") },
		{ id: "item-5", question: t("q5.question"), answer: t("q5.answer") },
		{ id: "item-6", question: t("q6.question"), answer: t("q6.answer") },
	];
}

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

	const tFaq = await getTranslations({ locale, namespace: "home.faq" });
	const faqItems = getHomeFaqItems(tFaq);

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
				<Showcase data={getShowcaseData()} />

				{/* Inspiration Gallery */}
				<Inspiration {...(await getInspirationData())} />

				{/* Features - has its own background */}
				<Features />

				{/* FAQ */}
				<FaqSection
					title={tFaq("title")}
					subtitle={tFaq("subtitle")}
					items={faqItems}
				/>

				{/* CTA - Final call to action */}
				<CTA />
			</div>
		</div>
	);
}
