import { CTA } from "@marketing/home/components/CTA";
import { FaqSection } from "@marketing/home/components/FaqSection";
import { PricingSection } from "@marketing/home/components/PricingSection";
import { FadeIn } from "@ui/components/FadeIn";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "pricing" });

	return {
		title: t("title"),
		description: t("description"),
	};
}

export default async function PricingPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<div className="relative min-h-screen pt-24 md:pt-32 pb-16">
			{/* Pricing Section with FadeIn */}
			<FadeIn duration={800} direction="up">
				<PricingSection />
			</FadeIn>

			{/* FAQ Section with FadeIn */}
			<FadeIn duration={800} delay={200} direction="up">
				<div className="mt-20 md:mt-32">
					<FaqSection />
				</div>
			</FadeIn>

			{/* CTA Section with FadeIn */}
			<FadeIn duration={800} delay={400} direction="up">
				<CTA />
			</FadeIn>
		</div>
	);
}
