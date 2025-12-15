"use client";

import { cn } from "@ui/lib";
import { SparklesIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import type { InspirationItem, InspirationTab } from "@marketing/home/lib/inspiration";

export function Inspiration({
	tabs = [],
	items = [],
}: {
	tabs: InspirationTab[];
	items: InspirationItem[];
}) {
	const t = useTranslations("home.showcase");
	const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id || "");
	const [isInView, setIsInView] = useState(false);
	const sectionRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (isInView) return;
		const element = sectionRef.current;
		if (!element) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (!entry) return;
				if (entry.isIntersecting) {
					setIsInView(true);
					observer.disconnect();
				}
			},
			{
				rootMargin: "200px",
			},
		);

		observer.observe(element);
		return () => observer.disconnect();
	}, [isInView]);

	const filteredInspiration = items.filter((item) =>
		activeTab === "" ? true : item.category === activeTab,
	);

	const renderComparison = (original: string, edited: string) => {
		if (!isInView) {
			return (
				<div className="grid h-full w-full grid-cols-2 gap-0.5">
					<div className="h-full w-full bg-muted/70 animate-pulse" />
					<div className="h-full w-full bg-muted/70 animate-pulse" />
				</div>
			);
		}

		return (
			<div className="grid h-full w-full grid-cols-2 gap-0.5">
				{/* Original */}
				<div className="relative overflow-hidden group/image">
					<Image
						src={original}
						alt="Original"
						fill
						loading="lazy"
						className="object-cover transition-transform duration-500 group-hover:scale-105"
						sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
					/>
					<div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 z-10">
						<span className="text-[9px] sm:text-[10px] font-medium text-white/90 flex items-center gap-1">
							{t("original")}
						</span>
					</div>
				</div>

				{/* Edited */}
				<div className="relative overflow-hidden group/image">
					<Image
						src={edited}
						alt="Edited"
						fill
						loading="lazy"
						className="object-cover transition-transform duration-500 group-hover:scale-105"
						sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
					/>
					<div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-primary/90 backdrop-blur-sm border border-white/10 z-10 shadow-sm">
						<span className="text-[9px] sm:text-[10px] font-medium text-primary-foreground flex items-center gap-1">
							<SparklesIcon className="w-2.5 h-2.5" />
							{t("enhanced")}
						</span>
					</div>
				</div>
			</div>
		);
	};

	return (
		<section ref={sectionRef} id="inspiration" className="py-16 md:py-20">
			<div className="container mx-auto px-4 max-w-6xl">
				{/* Header */}
				<div className="text-center mb-10 md:mb-14">
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
						{t("inspiration.title")}
					</h2>
					<p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
						{t("inspiration.subtitle")}
					</p>
				</div>

				{/* Tabs Navigation - Pill style matching Showcase */}
				<div className="flex justify-center mb-8">
					<div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full bg-muted/50 dark:bg-muted/30 border border-border/50">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								type="button"
								onClick={() => setActiveTab(tab.id)}
								className={cn(
									"relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
									activeTab === tab.id
										? "text-primary-foreground"
										: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
								)}
							>
								<span
									aria-hidden="true"
									className={cn(
										"absolute inset-0 rounded-full bg-primary shadow-md transition-opacity duration-200",
										activeTab === tab.id ? "opacity-100" : "opacity-0",
									)}
								/>
								<span className="relative z-10 capitalize">
									{t(`inspiration.tabs.${tab.id}`)}
								</span>
							</button>
						))}
					</div>
				</div>

				{/* Cards Grid */}
				<div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
					style={{ contentVisibility: "auto", containIntrinsicSize: "800px" }}
				>
					{filteredInspiration.map((item) => (
						<div key={item.id} className="group cursor-pointer h-full">
							<div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
								{/* Image Container */}
								<div className="relative aspect-[2/1] w-full overflow-hidden bg-muted">
									{renderComparison(item.original, item.edited)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
