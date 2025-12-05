import { CTA } from "@marketing/home/components/CTA";
import { FaqSection } from "@marketing/home/components/FaqSection";
import { PricingSection } from "@marketing/home/components/PricingSection";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "home.pricing" });

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
			{/* Pricing Section */}
			<PricingSection />

			{/* FAQ Section */}
			<div className="mt-20 md:mt-32">
				<FaqSection />
			</div>

			{/* CTA Section */}
			<CTA />
		</div>
	);
}
