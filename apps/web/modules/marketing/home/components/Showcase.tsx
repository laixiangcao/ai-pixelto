"use client";

import { CompareSlider } from "@shared/components/CompareSlider";
import { Badge } from "@ui/components/badge";
import { cn } from "@ui/lib";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

const TAB_CONTAINER_CLASS =
	"inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/95 px-3 py-2 backdrop-blur-md ring-1 ring-slate-100/80 dark:border-white/10 dark:bg-slate-900/70 dark:ring-white/5";

// Mock Data for Showcase Scenarios
const SHOWCASE_SCENARIOS = [
	{
		id: "background",
		label: "Background Replacement",
		description:
			"Instantly swap backgrounds for professional product photography or creative compositions.",
		items: [
			{
				id: "bg-1",
				original:
					"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80", // Camera
				edited: "https://images.unsplash.com/photo-1505739998589-00fc191ce01d?w=600&q=80", // Product shot
				label: "Product Studio",
			},
			{
				id: "bg-2",
				original:
					"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80", // Portrait
				edited: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80", // Abstract bg
				label: "Creative Portrait",
			},
			{
				id: "bg-3",
				original:
					"https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=600&q=80", // Toy
				edited: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&q=80", // Neon bg
				label: "Cyberpunk Scene",
			},
		],
	},
	{
		id: "lighting",
		label: "Lighting Adjustment",
		description:
			"Correct exposure, add dramatic lighting, or change the time of day in seconds.",
		items: [
			{
				id: "light-1",
				original:
					"https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80", // Nature dark
				edited: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80", // Bright
				label: "Golden Hour",
			},
			{
				id: "light-2",
				original:
					"https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=600&q=80",
				edited: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80",
				label: "Studio Lighting",
			},
			{
				id: "light-3",
				original:
					"https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=600&q=80",
				edited: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80",
				label: "Soft Glow",
			},
		],
	},
	{
		id: "style",
		label: "Style Conversion",
		description:
			"Transform photos into paintings, sketches, 3D renders, or anime style art.",
		items: [
			{
				id: "style-1",
				original:
					"https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=600&q=80",
				edited: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
				label: "Fashion Illustration",
			},
			{
				id: "style-2",
				original:
					"https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80",
				edited: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&q=80",
				label: "Cyberpunk City",
			},
			{
				id: "style-3",
				original:
					"https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80",
				edited: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&q=80",
				label: "Neon Art",
			},
		],
	},
	{
		id: "color",
		label: "Color Change",
		description:
			"Precisely change the color of specific objects in the image, such as turning green leaves red.",
		items: [
			{
				id: "color-1",
				original:
					"https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&q=80",
				edited: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80", // Yellow -> Greenish
				label: "Object Recolor",
			},
			{
				id: "color-2",
				original:
					"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80",
				edited: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&q=80",
				label: "Coat Color",
			},
			{
				id: "color-3",
				original:
					"https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=600&q=80",
				edited: "https://images.unsplash.com/photo-1505739998589-00fc191ce01d?w=600&q=80",
				label: "Product Variant",
			},
		],
	},
	{
		id: "age",
		label: "Age Transformation",
		description:
			"Visualize age progression or regression with realistic AI aging effects.",
		items: [
			{
				id: "age-1",
				original:
					"https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=600&q=80",
				edited: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80", // Just swapping for demo
				label: "Younger Self",
			},
			{
				id: "age-2",
				original:
					"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
				edited: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80",
				label: "Aging Effect",
			},
			{
				id: "age-3",
				original:
					"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
				edited: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
				label: "Time Travel",
			},
		],
	},
];

export function Showcase() {
	const t = useTranslations("home.showcase");
	const [activeTab, setActiveTab] = useState(0);
	const [isHovering, setIsHovering] = useState(false);

	const handleCycleComplete = useCallback(() => {
		if (isHovering) {
			return;
		}
		setActiveTab((prev) => (prev + 1) % SHOWCASE_SCENARIOS.length);
	}, [isHovering]);

	return (
		<section id="showcase" className="overflow-hidden">
			<div className="container mx-auto px-4 max-w-7xl space-y-5 md:space-y-8 lg:space-y-10">
				{/* Header */}
				<motion.div
					className="text-center space-y-3 md:space-y-4"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
				>
					<h2 className="text-3xl md:text-4xl font-bold">
						{t("title")}
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl mx-auto">
						{t("subtitle")}
					</p>
				</motion.div>

				{/* Tabs Navigation + Description */}
				<div className="flex flex-col items-center gap-3.5 md:gap-4">
					<div className={TAB_CONTAINER_CLASS}>
						{SHOWCASE_SCENARIOS.map((scenario, index) => (
							<button
								key={scenario.id}
								type="button"
								onClick={() => setActiveTab(index)}
								className={cn(
									"relative z-10 max-w-[180px] overflow-hidden truncate rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 dark:text-slate-200",
									activeTab === index
										? "text-white shadow-[0_12px_35px_-22px_rgba(56,189,248,0.8)]"
										: "hover:text-slate-900 dark:hover:text-white",
								)}
								title={scenario.label}
							>
								<span className="pointer-events-none absolute inset-[-1px] -z-10 rounded-xl border border-white/20 bg-gradient-to-r from-slate-200/40 via-white/10 to-slate-200/40 opacity-90 blur-[0.5px] dark:border-white/10 dark:from-white/10 dark:via-white/5 dark:to-white/5" />
								{activeTab === index && (
									<motion.div
										layoutId="activeTab"
										className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 opacity-90"
										transition={{
											type: "spring",
											bounce: 0.2,
											duration: 0.6,
										}}
									/>
								)}
								{scenario.label}
							</button>
						))}
					</div>

					<div className="text-center min-h-[2rem] flex items-center justify-center">
						<AnimatePresence mode="wait">
							<motion.p
								key={activeTab}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="text-muted-foreground text-base md:text-lg max-w-2xl line-clamp-1"
								title={
									SHOWCASE_SCENARIOS[activeTab].description
								}
							>
								{SHOWCASE_SCENARIOS[activeTab].description}
							</motion.p>
						</AnimatePresence>
					</div>
				</div>

				{/* Fixed Grid of 3 Items */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{SHOWCASE_SCENARIOS[activeTab].items.map((item, index) => (
						<motion.div
							key={`${activeTab}-${item.id}`}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.4, delay: index * 0.1 }}
							className="space-y-4"
						>
							<CompareSlider
								original={item.original}
								edited={item.edited}
								aspectRatio="square"
								className="rounded-2xl shadow-lg"
								autoSpeed={0.6}
								onCycleComplete={
									index === 0
										? handleCycleComplete
										: undefined
								}
								onHoverChange={setIsHovering}
							/>
							<div className="flex items-center justify-between px-1">
								<span className="font-medium text-sm">
									{item.label}
								</span>
								<Badge
									status="info"
									className="text-[10px] h-6 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-colors cursor-pointer lowercase first-letter:uppercase"
								>
									Try with AI
								</Badge>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
