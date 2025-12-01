"use client";

import { CheckCircle2, Command, Flame, Layers } from "lucide-react";
import { useTranslations } from "next-intl";

export function Hero() {
	const t = useTranslations("home.hero");

	return (
		<section className="relative flex items-center justify-center px-4 overflow-hidden">
			<div className="container max-w-4xl mx-auto transition-all duration-700">
				<div className="text-center space-y-5 animate-in slide-in-from-bottom-8 duration-700 fade-in px-4">
					{/* Badge - Premium Sleek Style */}
					<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 backdrop-blur-sm shadow-sm mb-2 transform transition-transform hover:scale-105 cursor-default group">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
							<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
						</span>
						<span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
							{t("badge.label")} •{" "}
							<span className="text-cyan-600 dark:text-cyan-400 group-hover:underline decoration-cyan-500/50 underline-offset-2">
								{t("badge.sublabel")}
							</span>
						</span>
					</div>

					{/* Hero Title */}
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-[1.2] py-2">
						{t("title.prefix")}{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 animate-gradient-x">
							{t("title.highlight")}
						</span>{" "}
						{t("title.suffix")}
					</h1>

					{/* Hero Subtitle */}
					<p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
						{t("subtitle")}
					</p>

					{/* Feature Tags Row */}
					<div className="flex flex-wrap items-center justify-center gap-3 pt-2">
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
							<CheckCircle2 className="w-3.5 h-3.5" />{" "}
							{t("features.unlimited")}
						</span>
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold">
							<Flame className="w-3.5 h-3.5" />{" "}
							{t("features.fast")}
						</span>
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold">
							<Layers className="w-3.5 h-3.5" />{" "}
							{t("features.styles")}
						</span>
						<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
							<Command className="w-3.5 h-3.5" />{" "}
							{t("features.noRestrictions")}
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}
