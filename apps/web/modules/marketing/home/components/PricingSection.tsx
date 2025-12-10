"use client";

import { PricingTable } from "@saas/payments/components/PricingTable";
import { useTranslations } from "next-intl";

export function PricingSection() {
	const t = useTranslations("pricing");

	return (
		<section id="pricing" className="scroll-mt-16 relative overflow-hidden">
			{/* Background Decoration */}
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50 dark:opacity-30" />

			<div className="container max-w-6xl mx-auto px-4">
				<div className="mb-16 text-center space-y-4">
					<h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 dark:from-white dark:to-white/60">
						{t("title")}
					</h2>
					<p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
						{t("description")}
					</p>
				</div>

				<PricingTable />
			</div>
		</section>
	);
}
