import { CTA } from "@marketing/home/components/CTA";
import { FaqSection } from "@marketing/home/components/FaqSection";
import { PricingSection } from "@marketing/home/components/PricingSection";
import { generateSeoMetadata } from "@shared/lib/seo";
import { FadeIn } from "@ui/components/FadeIn";
import { getTranslations, setRequestLocale } from "next-intl/server";

function getPricingFaqItems(t: (key: string) => string) {
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
	const t = await getTranslations({ locale, namespace: "seo.pricing" });

	return generateSeoMetadata({
		title: t("title"),
		description: t("description"),
		keywords: t("keywords"),
		path: "/pricing",
		locale,
	});
}

export default async function PricingPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);

	const tFaq = await getTranslations({ locale, namespace: "pricing.faq" });
	const faqItems = getPricingFaqItems(tFaq);

	return (
		<div className="relative min-h-screen pt-24 md:pt-32 pb-16">
			{/* Pricing Section with FadeIn */}
			<FadeIn duration={800} direction="up">
				<PricingSection />
			</FadeIn>

			{/* FAQ Section with FadeIn */}
			<FadeIn duration={800} delay={200} direction="up">
				<div className="mt-20 md:mt-32">
					<FaqSection
						title={tFaq("title")}
						subtitle={tFaq("subtitle")}
						items={faqItems}
					/>
				</div>
			</FadeIn>

			{/* CTA Section with FadeIn */}
			<FadeIn duration={800} delay={400} direction="up">
				<CTA />
			</FadeIn>
		</div>
	);
}
