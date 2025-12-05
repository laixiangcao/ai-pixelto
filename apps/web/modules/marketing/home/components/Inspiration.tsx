"use client";

import { cn } from "@ui/lib";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";

type InspirationCategory =
	| "latest"
	| "christmas"
	| "poster"
	| "packing"
	| "ai_image"
	| "brand_identity";

type InspirationItem = {
	id: string;
	title: string;
	category: InspirationCategory;
	images: string[];
	tag?: string;
};

// Stable Unsplash image ids with crop params
const INSPIRATION_ITEMS: InspirationItem[] = [
	{
		id: "insp-santa-1",
		title: "Add Santa to Photos",
		category: "latest",
		tag: "Hot",
		images: [
			"https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=720&q=80",
			"https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=720&q=80",
		],
	},
	{
		id: "insp-ornament",
		title: "Christmas Card Maker",
		category: "christmas",
		images: [
			"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=720&q=80",
		],
	},
	{
		id: "insp-logo-plush",
		title: "3D Plush Pillow Logo",
		category: "brand_identity",
		tag: "New",
		images: [
			"https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=720&q=80",
		],
	},
	{
		id: "insp-brand-keys",
		title: "Branded Keycaps",
		category: "brand_identity",
		images: [
			"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=720&q=80",
		],
	},
	{
		id: "insp-abstract",
		title: "Abstract Poster Art",
		category: "poster",
		images: [
			"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=720&q=80",
		],
	},
	{
		id: "insp-packaging",
		title: "Product Packaging",
		category: "packing",
		images: [
			"https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=720&q=80",
		],
	},
	{
		id: "insp-avatar",
		title: "AI Portrait Generator",
		category: "ai_image",
		tag: "Popular",
		images: [
			"https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=720&q=80",
		],
	},
	{
		id: "insp-cyberpunk",
		title: "AI Logo Art",
		category: "brand_identity",
		images: [
			"https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=720&q=80",
		],
	},
	{
		id: "insp-polaroid",
		title: "Christmas Polaroid",
		category: "christmas",
		images: [
			"https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=720&q=80",
			"https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=720&q=80",
			"https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=720&q=80",
		],
	},
	{
		id: "insp-sweater",
		title: "Christmas Sweater",
		category: "christmas",
		images: [
			"https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=720&q=80",
			"https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=720&q=80",
		],
	},
	{
		id: "insp-winter",
		title: "First Snow Generator",
		category: "latest",
		images: [
			"https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=720&q=80",
			"https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=720&q=80",
		],
	},
	{
		id: "insp-body",
		title: "Body Transform",
		category: "ai_image",
		images: [
			"https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=720&q=80",
		],
	},
];

const TABS: { id: InspirationCategory; label: string }[] = [
	{ id: "latest", label: "Latest" },
	{ id: "christmas", label: "Christmas" },
	{ id: "poster", label: "Poster" },
	{ id: "packing", label: "Packaging" },
	{ id: "ai_image", label: "AI Image" },
	{ id: "brand_identity", label: "Brand" },
];

export function Inspiration() {
	const t = useTranslations("home.showcase");
	const [activeTab, setActiveTab] = useState<InspirationCategory>("latest");

	const filteredInspiration = INSPIRATION_ITEMS.filter((item) =>
		activeTab === "latest" ? true : item.category === activeTab,
	);

	const renderImages = (images: string[]) => {
		if (images.length === 1) {
			return (
				<div className="relative h-full w-full">
					<Image
						src={images[0]}
						alt=""
						fill
						className="object-cover transition-transform duration-500 group-hover:scale-105"
						sizes="(max-width: 768px) 90vw, (max-width: 1200px) 40vw, 25vw"
						priority={activeTab === "latest"}
					/>
				</div>
			);
		}

		if (images.length === 2) {
			return (
				<div className="grid h-full w-full grid-cols-2 gap-0.5">
					{images.map((img, idx) => (
						<div
							key={img + idx}
							className="relative overflow-hidden"
						>
							<Image
								src={img}
								alt=""
								fill
								className="object-cover transition-transform duration-500 group-hover:scale-105"
								sizes="(max-width: 768px) 45vw, (max-width: 1200px) 20vw, 12vw"
							/>
						</div>
					))}
				</div>
			);
		}

		return (
			<div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-0.5">
				{images.map((img, idx) => (
					<div
						key={img + idx}
						className={
							idx === 0
								? "relative col-span-2 row-span-1 overflow-hidden"
								: "relative overflow-hidden"
						}
					>
						<Image
							src={img}
							alt=""
							fill
							className="object-cover transition-transform duration-500 group-hover:scale-105"
							sizes="(max-width: 768px) 90vw, (max-width: 1200px) 40vw, 25vw"
						/>
					</div>
				))}
			</div>
		);
	};

	return (
		<section id="inspiration" className="py-16 md:py-20">
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
						{t("inspiration.title")}
					</h2>
					<p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
						Get inspired by our community creations and start your
						own
					</p>
				</motion.div>

				{/* Tabs Navigation - Pill style matching Showcase */}
				<motion.div
					className="flex justify-center mb-8"
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					<div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full bg-muted/50 dark:bg-muted/30 border border-border/50">
						{TABS.map((tab) => (
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
								{activeTab === tab.id && (
									<motion.div
										layoutId="inspiration-active-tab"
										className="absolute inset-0 rounded-full bg-primary shadow-md"
										transition={{
											type: "spring",
											bounce: 0.15,
											duration: 0.5,
										}}
									/>
								)}
								<span className="relative z-10">
									{tab.label}
								</span>
							</button>
						))}
					</div>
				</motion.div>

				{/* Cards Grid */}
				<motion.div
					layout
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
				>
					<AnimatePresence mode="popLayout">
						{filteredInspiration.map((item, idx) => (
							<motion.div
								key={item.id}
								layout
								initial={{ opacity: 0, scale: 0.95, y: 12 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: 12 }}
								transition={{
									duration: 0.35,
									delay: idx * 0.04,
								}}
								className="group cursor-pointer"
							>
								<div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
									{/* Image Container */}
									<div className="relative h-48 overflow-hidden bg-muted">
										{renderImages(item.images)}

										{/* Hover Gradient Overlay */}
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

										{/* Tag Badge */}
										{item.tag && (
											<div className="absolute top-3 left-3 z-10">
												<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide bg-primary text-primary-foreground">
													{item.tag === "Hot" && (
														<SparklesIcon className="h-2.5 w-2.5" />
													)}
													{item.tag}
												</span>
											</div>
										)}

										{/* Hover Action */}
										<div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
											<button
												type="button"
												className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
											>
												Try this style
											</button>
										</div>
									</div>

									{/* Bottom Title Bar */}
									<div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
										<span className="font-medium text-sm text-foreground truncate pr-2">
											{item.title}
										</span>
										<ArrowRightIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
									</div>
								</div>
							</motion.div>
						))}
					</AnimatePresence>
				</motion.div>

				{/* Bottom CTA */}
				<motion.div
					className="mt-10 flex justify-center"
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<Link
						href="/#editor"
						className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card hover:bg-muted text-foreground font-semibold transition-all duration-200 hover:shadow-lg group"
					>
						<span>{t("inspiration.cta")}</span>
						<ArrowRightIcon className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
					</Link>
				</motion.div>
			</div>
		</section>
	);
}
