import { generateSeoMetadata } from "@shared/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "seo.contact" });

	return generateSeoMetadata({
		title: t("title"),
		description: t("description"),
		keywords: t("keywords"),
		path: "/contact",
		locale,
	});
}

export default async function ContactPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);

	const ContactContent = (await import("./page.client")).default;

	return <ContactContent />;
}
