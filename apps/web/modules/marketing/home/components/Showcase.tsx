"use client";

import type { ShowcaseData } from "@marketing/home/lib/showcase";
import { cn } from "@ui/lib";
import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

const SHOWCASE_IMAGE_BASE = "/images/showcase";

interface ShowcaseProps {
	data: ShowcaseData;
}

export function Showcase({ data }: ShowcaseProps) {
	const t = useTranslations("home.showcase");
	const [activeTab, setActiveTab] = useState(0);
	const [activeVariant, setActiveVariant] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);
	const [isInView, setIsInView] = useState(false);
	const sectionRef = useRef<HTMLElement | null>(null);

	// 使用 ref 存储 data，避免 effect 依赖变化导致定时器重建
	const dataRef = useRef(data);
	dataRef.current = data;

	const currentStyle = data[activeTab];
	const originalItem = currentStyle?.items.find((item) => item.isOriginal);
	const variantItems =
		currentStyle?.items.filter((item) => !item.isOriginal) || [];
	const currentVariant = variantItems[activeVariant];

	useEffect(() => {
		if (isInView) return;
		const element = sectionRef.current;
		if (!element) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (entry?.isIntersecting) {
					setIsInView(true);
					observer.disconnect();
				}
			},
			{ rootMargin: "200px" },
		);

		observer.observe(element);
		return () => observer.disconnect();
	}, [isInView]);

	// 使用 ref 存储当前状态，避免闭包问题
	const stateRef = useRef({ activeTab, activeVariant });
	stateRef.current = { activeTab, activeVariant };

	// 自动播放逻辑 - 只依赖 isAutoPlaying 和 isInView
	useEffect(() => {
		if (!isAutoPlaying || !isInView) return;

		const interval = setInterval(() => {
			const currentData = dataRef.current;
			if (currentData.length === 0) return;

			const { activeTab: currentTab, activeVariant: currentVar } =
				stateRef.current;
			const currentStyleData = currentData[currentTab];
			const currentVariants =
				currentStyleData?.items.filter((item) => !item.isOriginal) ||
				[];
			const nextVariant = currentVar + 1;

			if (nextVariant < currentVariants.length) {
				// 还有下一个 variant
				setActiveVariant(nextVariant);
			} else {
				// 切换到下一个 tab，重置 variant
				const nextTab = (currentTab + 1) % currentData.length;
				setActiveTab(nextTab);
				setActiveVariant(0);
			}
		}, 2000);

		return () => clearInterval(interval);
	}, [isAutoPlaying, isInView]);

	const getVariantPromptText = (variantIndex: number) => {
		if (!currentStyle) return "";
		const key = `scenarios.${currentStyle.style}.prompts.${variantIndex}`;
		try {
			return t(key);
		} catch (error) {
			console.error("读取 showcase 提示文案翻译失败", {
				error,
				key,
				style: currentStyle.style,
				variantIndex,
			});
			return (
				variantItems[variantIndex]?.uiPrompt ||
				variantItems[variantIndex]?.desc ||
				""
			);
		}
	};

	const handlePrevVariant = useCallback(() => {
		setIsAutoPlaying(false);
		setActiveVariant((prev) =>
			prev === 0 ? variantItems.length - 1 : prev - 1,
		);
	}, [variantItems.length]);

	const handleNextVariant = useCallback(() => {
		setIsAutoPlaying(false);
		setActiveVariant((prev) => (prev + 1) % variantItems.length);
	}, [variantItems.length]);

	const getImageSrc = (img: string) => `${SHOWCASE_IMAGE_BASE}/${img}`;

	const renderPlaceholder = () => (
		<div className="absolute inset-0 bg-muted/70 animate-pulse" />
	);

	if (!currentStyle || !originalItem) return null;

	return (
		<section
			ref={sectionRef}
			id="showcase"
			className="overflow-hidden py-16 md:py-20"
		>
			<div className="container mx-auto px-4 max-w-6xl">
				{/* Header */}
				<div className="text-center mb-10 md:mb-14">
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
						{t("title")}
					</h2>
					<p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
						{t("subtitle")}
					</p>
				</div>

				{/* Tabs Navigation */}
				<div className="flex justify-center mb-8">
					<div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full bg-muted/50 dark:bg-muted/30 border border-border/50">
						{data.map((style, index) => (
							<button
								key={style.style}
								type="button"
								onClick={() => setActiveTab(index)}
								className={cn(
									"relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
									activeTab === index
										? "text-primary-foreground"
										: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
								)}
							>
								<span
									aria-hidden="true"
									className={cn(
										"absolute inset-0 rounded-full bg-primary shadow-md transition-opacity duration-200",
										activeTab === index
											? "opacity-100"
											: "opacity-0",
									)}
								/>
								<span className="relative z-10">
									{t(`scenarios.${style.style}.label`)}
								</span>
							</button>
						))}
					</div>
				</div>

				{/* Description */}
				<div className="text-center mb-10 min-h-[3rem] flex items-center justify-center">
					<p className="text-muted-foreground text-base md:text-lg max-w-2xl">
						{t(`scenarios.${currentStyle.style}.description`)}
					</p>
				</div>

				{/* Main Display Area */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
					{/* Left: Original Image */}
					<div className="relative">
						<div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-card shadow-lg">
							{isInView ? (
								<Image
									src={getImageSrc(originalItem.img)}
									alt="Original"
									fill
									className="object-cover"
									sizes="(max-width: 1024px) 100vw, 50vw"
									loading="lazy"
									unoptimized
								/>
							) : (
								renderPlaceholder()
							)}

							{/* Original Label */}
							<div className="absolute top-3 left-3 z-10">
								<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wide bg-black/70 text-white backdrop-blur-sm">
									<span className="h-1.5 w-1.5 rounded-full bg-white/60" />
									<span>{t("original")}</span>
								</div>
							</div>
						</div>
					</div>

					{/* Right: AI Generated Variants */}
					<div className="relative">
						{/* Main Variant Display */}
						<section
							className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-primary/30 bg-card shadow-xl shadow-primary/10"
							onMouseEnter={() => setIsAutoPlaying(false)}
							onMouseLeave={() => setIsAutoPlaying(true)}
							aria-label="Image Preview"
						>
							{isInView && currentVariant ? (
								<Image
									src={getImageSrc(currentVariant.img)}
									alt="AI Generated"
									fill
									className="object-cover"
									sizes="(max-width: 1024px) 100vw, 50vw"
									loading="lazy"
									unoptimized
								/>
							) : (
								renderPlaceholder()
							)}

							{/* AI Edit Label */}
							<div className="absolute top-3 right-3 z-10">
								<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wide bg-gradient-to-r from-primary to-emerald-500 text-white shadow-lg shadow-primary/30">
									<SparklesIcon className="h-3 w-3" />
									<span>{t("aiEdit")}</span>
								</div>
							</div>

							{/* Bottom Prompt Bar */}
							<div className="absolute inset-x-0 bottom-0 z-10">
								<div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 pb-4 px-4">
									{/* Navigation Arrows */}
									<div className="flex items-center justify-between mb-3">
										<button
											type="button"
											onClick={handlePrevVariant}
											className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
											aria-label="Previous variant"
										>
											<ChevronLeftIcon className="w-4 h-4" />
										</button>

										{/* Prompt Text */}
										<p className="text-white text-sm font-medium text-center flex-1 px-4 line-clamp-1">
											{getVariantPromptText(
												activeVariant,
											)}
										</p>

										<button
											type="button"
											onClick={handleNextVariant}
											className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
											aria-label="Next variant"
										>
											<ChevronRightIcon className="w-4 h-4" />
										</button>
									</div>

									{/* Dot Indicators */}
									<div className="flex items-center justify-center gap-2">
										{variantItems.map((_, index) => (
											<button
												key={`dot-${currentStyle.style}-${index}`}
												type="button"
												onClick={() => {
													setIsAutoPlaying(false);
													setActiveVariant(index);
												}}
												className={cn(
													"h-1.5 rounded-full transition-all duration-300",
													activeVariant === index
														? "w-6 bg-primary"
														: "w-1.5 bg-white/50 hover:bg-white/80",
												)}
												aria-label={`View variant ${index + 1}`}
											/>
										))}
									</div>
								</div>
							</div>
						</section>

						{/* Variant Thumbnails */}
						<div className="flex gap-3 mt-4 justify-center">
							{variantItems.map((variant, index) => (
								<button
									key={variant.img}
									type="button"
									onClick={() => {
										setIsAutoPlaying(false);
										setActiveVariant(index);
									}}
									className={cn(
										"relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200",
										activeVariant === index
											? "border-primary ring-2 ring-primary/30 scale-105"
											: "border-border hover:border-primary/50 opacity-70 hover:opacity-100",
									)}
								>
									{isInView ? (
										<Image
											src={getImageSrc(variant.img)}
											alt={
												getVariantPromptText(index) ||
												variant.desc
											}
											fill
											className="object-cover"
											sizes="64px"
											loading="lazy"
											unoptimized
										/>
									) : (
										<div className="absolute inset-0 bg-muted/70" />
									)}
								</button>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
