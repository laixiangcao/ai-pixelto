"use client";

import { cn } from "@ui/lib";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, SparklesIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

// Mock Data for Showcase Scenarios
const SHOWCASE_SCENARIOS = [
	{
		id: "background",
		label: "Background Replacement",
		description:
			"Separate the subject from the original background and replace it with a new, more creative scene.",
		original:
			"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
		variants: [
			{
				id: "bg-1",
				image: "https://images.unsplash.com/photo-1505739998589-00fc191ce01d?w=800&q=80",
				prompt: "Place in a professional studio with soft lighting",
			},
			{
				id: "bg-2",
				image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80",
				prompt: "Transform to a cyberpunk neon city scene",
			},
			{
				id: "bg-3",
				image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
				prompt: "Set against a serene mountain landscape",
			},
		],
	},
	{
		id: "lighting",
		label: "Lighting Adjustment",
		description:
			"Correct exposure, add dramatic lighting, or change the time of day in seconds.",
		original:
			"https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
		variants: [
			{
				id: "light-1",
				image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
				prompt: "Apply golden hour warm lighting",
			},
			{
				id: "light-2",
				image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80",
				prompt: "Add dramatic studio rim lighting",
			},
			{
				id: "light-3",
				image: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=800&q=80",
				prompt: "Create soft diffused glow effect",
			},
		],
	},
	{
		id: "style",
		label: "Style Conversion",
		description:
			"Transform photos into paintings, sketches, 3D renders, or anime style art.",
		original:
			"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
		variants: [
			{
				id: "style-1",
				image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
				prompt: "Convert to fashion illustration style",
			},
			{
				id: "style-2",
				image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80",
				prompt: "Transform into oil painting artwork",
			},
			{
				id: "style-3",
				image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
				prompt: "Apply anime character style",
			},
		],
	},
	{
		id: "color",
		label: "Color Change",
		description:
			"Precisely change the color of specific objects in the image.",
		original:
			"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80",
		variants: [
			{
				id: "color-1",
				image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&q=80",
				prompt: "Change fur color to orange tabby",
			},
			{
				id: "color-2",
				image: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=800&q=80",
				prompt: "Transform to black and white coat",
			},
			{
				id: "color-3",
				image: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?w=800&q=80",
				prompt: "Apply calico pattern coloring",
			},
		],
	},
	{
		id: "age",
		label: "Age Transformation",
		description:
			"Visualize age progression or regression with realistic AI aging effects.",
		original:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
		variants: [
			{
				id: "age-1",
				image: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=800&q=80",
				prompt: "Show younger version at age 25",
			},
			{
				id: "age-2",
				image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
				prompt: "Apply aging effect to age 60",
			},
			{
				id: "age-3",
				image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
				prompt: "Visualize as a child version",
			},
		],
	},
];

export function Showcase() {
	const t = useTranslations("home.showcase");
	const [activeTab, setActiveTab] = useState(0);
	const [activeVariant, setActiveVariant] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);

	const currentScenario = SHOWCASE_SCENARIOS[activeTab];

	// Auto-rotate variants
	useEffect(() => {
		if (!isAutoPlaying) {
			return;
		}

		const interval = setInterval(() => {
			setActiveVariant(
				(prev) => (prev + 1) % currentScenario.variants.length,
			);
		}, 4000);

		return () => clearInterval(interval);
	}, [isAutoPlaying, currentScenario.variants.length]);

	// Reset variant when tab changes
	useEffect(() => {
		setActiveVariant(0);
	}, [activeTab]);

	const handlePrevVariant = useCallback(() => {
		setIsAutoPlaying(false);
		setActiveVariant((prev) =>
			prev === 0 ? currentScenario.variants.length - 1 : prev - 1,
		);
	}, [currentScenario.variants.length]);

	const handleNextVariant = useCallback(() => {
		setIsAutoPlaying(false);
		setActiveVariant(
			(prev) => (prev + 1) % currentScenario.variants.length,
		);
	}, [currentScenario.variants.length]);

	return (
		<section id="showcase" className="overflow-hidden py-16 md:py-20">
			<div className="container mx-auto px-4 max-w-6xl">
				{/* Header */}
				<motion.div
					className="text-center mb-10 md:mb-14"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
						{t("title")}
					</h2>
					<p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
						{t("subtitle")}
					</p>
				</motion.div>

				{/* Tabs Navigation */}
				<motion.div
					className="flex justify-center mb-8"
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					<div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full bg-muted/50 dark:bg-muted/30 border border-border/50">
						{SHOWCASE_SCENARIOS.map((scenario, index) => (
							<button
								key={scenario.id}
								type="button"
								onClick={() => setActiveTab(index)}
								className={cn(
									"relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
									activeTab === index
										? "text-primary-foreground"
										: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
								)}
							>
								{activeTab === index && (
									<motion.div
										layoutId="showcase-active-tab"
										className="absolute inset-0 rounded-full bg-primary shadow-md"
										transition={{
											type: "spring",
											bounce: 0.15,
											duration: 0.5,
										}}
									/>
								)}
								<span className="relative z-10">
									{scenario.label}
								</span>
							</button>
						))}
					</div>
				</motion.div>

				{/* Description */}
				<div className="text-center mb-10 min-h-[3rem] flex items-center justify-center">
					<AnimatePresence mode="wait">
						<motion.p
							key={activeTab}
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -8 }}
							transition={{ duration: 0.25 }}
							className="text-muted-foreground text-base md:text-lg max-w-2xl"
						>
							{currentScenario.description}
						</motion.p>
					</AnimatePresence>
				</div>

				{/* Main Display Area */}
				<motion.div
					className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					{/* Left: Original Image */}
					<div className="relative">
						<div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-card shadow-lg">
							<AnimatePresence mode="wait">
								<motion.div
									key={`original-${activeTab}`}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.3 }}
									className="absolute inset-0"
								>
									<Image
										src={currentScenario.original}
										alt="Original"
										fill
										className="object-cover"
										sizes="(max-width: 1024px) 100vw, 50vw"
										priority
									/>
								</motion.div>
							</AnimatePresence>

							{/* Original Label */}
							<div className="absolute top-3 left-3 z-10">
								<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wide bg-black/70 text-white backdrop-blur-sm">
									<span className="h-1.5 w-1.5 rounded-full bg-white/60" />
									<span>Original</span>
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
							<AnimatePresence mode="wait">
								<motion.div
									key={`variant-${activeTab}-${activeVariant}`}
									initial={{ opacity: 0, scale: 1.02 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.98 }}
									transition={{ duration: 0.4 }}
									className="absolute inset-0"
								>
									<Image
										src={
											currentScenario.variants[
												activeVariant
											].image
										}
										alt="AI Generated"
										fill
										className="object-cover"
										sizes="(max-width: 1024px) 100vw, 50vw"
										priority
									/>
								</motion.div>
							</AnimatePresence>

							{/* AI Edit Label */}
							<div className="absolute top-3 right-3 z-10">
								<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wide bg-gradient-to-r from-primary to-emerald-500 text-white shadow-lg shadow-primary/30">
									<SparklesIcon className="h-3 w-3" />
									<span>AI Edit</span>
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
										<AnimatePresence mode="wait">
											<motion.p
												key={`prompt-${activeVariant}`}
												initial={{ opacity: 0, y: 5 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -5 }}
												transition={{ duration: 0.2 }}
												className="text-white text-sm font-medium text-center flex-1 px-4 line-clamp-1"
											>
												{
													currentScenario.variants[
														activeVariant
													].prompt
												}
											</motion.p>
										</AnimatePresence>

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
										{currentScenario.variants.map(
											(_, index) => (
												<button
													key={index}
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
											),
										)}
									</div>
								</div>
							</div>
						</section>

						{/* Variant Thumbnails */}
						<div className="flex gap-3 mt-4 justify-center">
							{currentScenario.variants.map((variant, index) => (
								<button
									key={variant.id}
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
									<Image
										src={variant.image}
										alt={variant.prompt}
										fill
										className="object-cover"
										sizes="64px"
									/>
								</button>
							))}
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
