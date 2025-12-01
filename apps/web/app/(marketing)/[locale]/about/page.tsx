"use client";

import { setRequestLocale } from "next-intl/server";
import Image from "next/image";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const t = await import(`../../../../../packages/i18n/translations/${locale}.json`).then((m) => m.about);

	return {
		title: t.title,
		description: t.description,
	};
}

export default async function AboutPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await import(`../../../../../packages/i18n/translations/${locale}.json`).then((m) => m.about);

	return (
		<main className="flex-1">
			{/* Hero Section */}
			<section className="relative py-24 md:py-32 overflow-hidden">
				<div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50 dark:opacity-30" />
				<div className="container px-4 text-center max-w-4xl mx-auto space-y-8">
					<h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 dark:from-white dark:to-white/60">
						{t.title}
					</h1>
					<p className="text-xl text-muted-foreground leading-relaxed">
						{t.description}
					</p>
				</div>
			</section>

			{/* Mission Section */}
			<section className="py-16 md:py-24 bg-muted/30">
				<div className="container px-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
						<div className="space-y-6">
							<h2 className="text-3xl font-bold">{t.mission.title}</h2>
							<p className="text-lg text-muted-foreground leading-relaxed">
								{t.mission.description}
							</p>
						</div>
						<div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
							<Image
								src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
								alt="Team working together"
								fill
								className="object-cover"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Values Section */}
			<section className="py-16 md:py-24">
				<div className="container px-4 max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl font-bold mb-4">{t.values.title}</h2>
						<p className="text-lg text-muted-foreground">
							{t.values.subtitle}
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[
							{
								title: t.values.innovation.title,
								desc: t.values.innovation.description,
								icon: "🚀",
							},
							{
								title: t.values.quality.title,
								desc: t.values.quality.description,
								icon: "✨",
							},
							{
								title: t.values.community.title,
								desc: t.values.community.description,
								icon: "🤝",
							},
						].map((item, i) => (
							<div
								key={i}
								className="bg-card border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
							>
								<div className="text-4xl mb-4">{item.icon}</div>
								<h3 className="text-xl font-semibold mb-3">
									{item.title}
								</h3>
								<p className="text-muted-foreground leading-relaxed">
									{item.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-24 text-center">
				<div className="container px-4">
					<div className="bg-primary/5 border border-primary/10 rounded-3xl p-12 max-w-4xl mx-auto">
						<h2 className="text-3xl font-bold mb-4">{t.cta.title}</h2>
						<p className="text-lg text-muted-foreground mb-8">
							{t.cta.description}
						</p>
						<a
							href="/app"
							className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
						>
							{t.cta.button}
						</a>
					</div>
				</div>
			</section>
		</main>
	);
}

