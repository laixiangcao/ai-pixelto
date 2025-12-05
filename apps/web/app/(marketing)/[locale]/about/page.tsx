import { CTA } from "@marketing/home/components/CTA";
import { HeartIcon, RocketIcon, ShieldCheckIcon } from "lucide-react";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "about" });

	return {
		title: t("title"),
		description: t("description"),
	};
}

export default async function AboutPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations({ locale, namespace: "about" });

	const values = [
		{
			title: t("values.innovation.title"),
			desc: t("values.innovation.description"),
			icon: RocketIcon,
			color: "text-blue-500",
			bg: "bg-blue-500/10",
		},
		{
			title: t("values.quality.title"),
			desc: t("values.quality.description"),
			icon: ShieldCheckIcon,
			color: "text-emerald-500",
			bg: "bg-emerald-500/10",
		},
		{
			title: t("values.community.title"),
			desc: t("values.community.description"),
			icon: HeartIcon,
			color: "text-rose-500",
			bg: "bg-rose-500/10",
		},
	];

	return (
		<main className="flex-1 pt-24 md:pt-32">
			{/* Hero Section */}
			<section className="relative pb-16 md:pb-24 overflow-hidden">
				<div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent opacity-50 dark:opacity-30" />
				<div className="container px-4 text-center max-w-4xl mx-auto space-y-8">
					<h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 dark:from-white dark:to-white/60 animate-in fade-in slide-in-from-bottom-4 duration-1000">
						{t("title")}
					</h1>
					<p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
						{t("description")}
					</p>
				</div>
			</section>

			{/* Mission Section */}
			<section className="py-16 md:py-24 bg-muted/30">
				<div className="container px-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
						<div className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
							<h2 className="text-3xl font-bold tracking-tight">
								{t("mission.title")}
							</h2>
							<p className="text-lg text-muted-foreground leading-relaxed">
								{t("mission.description")}
							</p>
						</div>
						<div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
							<Image
								src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
								alt="Team working together"
								fill
								sizes="(max-width: 768px) 100vw, 50vw"
								className="object-cover hover:scale-105 transition-transform duration-700"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
						</div>
					</div>
				</div>
			</section>

			{/* Values Section */}
			<section className="py-16 md:py-24">
				<div className="container px-4 max-w-6xl mx-auto">
					<div className="text-center mb-16 space-y-4">
						<h2 className="text-3xl font-bold tracking-tight">
							{t("values.title")}
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							{t("values.subtitle")}
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{values.map((item, i) => (
							<div
								key={i}
								className="group bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
							>
								<div
									className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
								>
									<item.icon className="size-6" />
								</div>
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
			<CTA />
		</main>
	);
}
