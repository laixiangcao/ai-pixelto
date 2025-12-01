"use client";

import { Button } from "@ui/components/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function CTA() {
	const t = useTranslations("home.cta");

	return (
		<section>
			<div className="container max-w-5xl mx-auto px-4">
				<div className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-slate-800 border border-slate-800 dark:border-slate-700 shadow-2xl">
					{/* Gradient Effects */}
					<div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />
					<div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl pointer-events-none" />

					<div className="relative z-10 p-12 md:p-16 text-center">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
							{t("title")}
						</h2>
						<p className="text-slate-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
							{t("subtitle")}
						</p>
						<div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
							<Link href="/#editor" className="w-full sm:w-auto">
								<Button
									size="lg"
									className="w-full sm:w-auto min-w-[160px] bg-white text-slate-900 hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-base h-12"
								>
									{t("startCreating")}
								</Button>
							</Link>
							<Link href="/pricing" className="w-full sm:w-auto">
								<Button
									size="lg"
									variant="outline"
									className="w-full sm:w-auto min-w-[160px] border-slate-700 text-white hover:bg-white/10 hover:text-white hover:border-white/30 transition-all duration-300 font-semibold text-base h-12 bg-transparent"
								>
									{t("viewPricing")}
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
