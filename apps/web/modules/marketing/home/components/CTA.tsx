"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function CTA() {
	const t = useTranslations("home.cta");

	return (
		<section id="cta" className="py-12 md:py-16">
			<div className="container max-w-4xl mx-auto px-4">
				<motion.div
					className="relative overflow-hidden rounded-2xl"
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					{/* Background */}
					<div className="absolute inset-0 bg-gradient-to-br from-primary via-emerald-600 to-teal-600 dark:from-primary/90 dark:via-emerald-700 dark:to-teal-700" />

					{/* Glow effects */}
					<div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none" />
					<div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-48 h-48 bg-teal-300/25 rounded-full blur-2xl pointer-events-none" />

					{/* Content */}
					<div className="relative z-10 px-6 py-10 md:px-12 md:py-12 text-center">
						<motion.h2
							className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight"
							initial={{ opacity: 0, y: 8 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.4, delay: 0.1 }}
						>
							{t("title")}
						</motion.h2>

						<motion.p
							className="text-white/80 text-base md:text-lg mb-8 max-w-xl mx-auto"
							initial={{ opacity: 0, y: 8 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.4, delay: 0.15 }}
						>
							{t("subtitle")}
						</motion.p>

						<motion.div
							className="flex flex-col sm:flex-row justify-center gap-3"
							initial={{ opacity: 0, y: 8 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.4, delay: 0.2 }}
						>
							<Link href="/#editor">
								<button
									type="button"
									className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-primary font-semibold text-sm hover:bg-white/95 transition-all duration-200 shadow-lg min-w-[160px]"
								>
									<SparklesIcon className="w-4 h-4" />
									{t("startCreating")}
									<ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
								</button>
							</Link>
							<Link href="/pricing">
								<button
									type="button"
									className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/30 text-white font-semibold text-sm hover:bg-white/20 transition-all duration-200 min-w-[160px]"
								>
									{t("viewPricing")}
								</button>
							</Link>
						</motion.div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
