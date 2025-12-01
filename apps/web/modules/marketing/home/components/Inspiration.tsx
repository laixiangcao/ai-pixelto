"use client";

import { Button } from "@ui/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";

const TAB_CONTAINER_CLASS =
	"inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white/95 px-3 py-2 backdrop-blur-md ring-1 ring-slate-100/80 dark:border-white/10 dark:bg-slate-900/70 dark:ring-white/5";

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
};

// Stable Unsplash image ids with crop params to avoid 404s
const INSPIRATION_ITEMS: InspirationItem[] = [
	{
		id: "insp-santa-1",
		title: "Add Santa to Photos",
		category: "latest",
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
		title: "3D Plush Pillow Logo Generator",
		category: "brand_identity",
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
		title: "AI Portrait",
		category: "ai_image",
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
		title: "Christmas Polaroid Photo",
		category: "christmas",
		images: [
			"https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=720&q=80",
			"https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=720&q=80",
			"https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=720&q=80",
		],
	},
	{
		id: "insp-sweater",
		title: "Christmas Sweater Photo",
		category: "christmas",
		images: [
			"https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=720&q=80",
			"https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=720&q=80",
		],
	},
	{
		id: "insp-winter",
		title: "First Snow Photo Generator",
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

const TABS: InspirationCategory[] = [
	"latest",
	"christmas",
	"poster",
	"packing",
	"ai_image",
	"brand_identity",
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
						className="object-cover"
						sizes="(max-width: 768px) 90vw, (max-width: 1200px) 40vw, 25vw"
						priority={activeTab === "latest"}
					/>
				</div>
			);
		}

		if (images.length === 2) {
			return (
				<div className="grid h-full w-full grid-cols-2 gap-1">
					{images.map((img, idx) => (
						<div key={img + idx} className="relative">
							<Image
								src={img}
								alt=""
								fill
								className="object-cover"
								sizes="(max-width: 768px) 90vw, (max-width: 1200px) 40vw, 25vw"
							/>
						</div>
					))}
				</div>
			);
		}

		return (
			<div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-1">
				{images.map((img, idx) => (
					<div
						key={img + idx}
						className={
							idx === 0
								? "relative col-span-2 row-span-1"
								: "relative"
						}
					>
						<Image
							src={img}
							alt=""
							fill
							className="object-cover"
							sizes="(max-width: 768px) 90vw, (max-width: 1200px) 40vw, 25vw"
						/>
					</div>
				))}
			</div>
		);
	};

	return (
		<section>
			<div className="container mx-auto px-4 max-w-7xl">
				<div className="space-y-10 md:space-y-14">
					<motion.div
						className="text-center space-y-3 md:space-y-4"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
					>
						<h2 className="text-3xl md:text-4xl font-bold">
							{t("inspiration.title")}
						</h2>
					</motion.div>

					<div className="rounded-[28px] border border-white/20 bg-white/60 p-5 shadow-xl shadow-primary/5 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/60">
						<Tabs
							defaultValue="latest"
							value={activeTab}
							onValueChange={(value) =>
								setActiveTab(value as InspirationCategory)
							}
							className="w-full"
						>
							<div className="mb-8 flex justify-center overflow-x-auto pb-2">
								<TabsList className={TAB_CONTAINER_CLASS}>
									{TABS.map((tab) => (
										<TabsTrigger
											key={tab}
											value={tab}
											className="relative max-w-[180px] overflow-hidden truncate rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:text-slate-900 dark:text-slate-200 dark:data-[state=inactive]:text-slate-300 dark:data-[state=inactive]:hover:text-white"
										>
											<span className="relative z-10 truncate max-w-[160px]">
												{t(`inspiration.tabs.${tab}`)}
											</span>
											<span className="pointer-events-none absolute inset-[-1px] -z-0 rounded-xl border border-white/20 bg-gradient-to-r from-slate-200/40 via-white/10 to-slate-100/30 opacity-90 blur-[0.5px] dark:border-white/10 dark:from-white/10 dark:via-white/5 dark:to-white/5" />
											<span className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 opacity-0 transition-opacity duration-300 data-[state=active]:opacity-90" />
										</TabsTrigger>
									))}
								</TabsList>
							</div>

							<TabsContent value={activeTab} className="mt-0">
								<motion.div
									layout
									className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
								>
									<AnimatePresence mode="popLayout">
										{filteredInspiration.map(
											(item, idx) => (
												<motion.div
													key={item.id}
													layout
													initial={{
														opacity: 0,
														scale: 0.98,
														y: 8,
													}}
													animate={{
														opacity: 1,
														scale: 1,
														y: 0,
													}}
													exit={{
														opacity: 0,
														scale: 0.98,
														y: 8,
													}}
													transition={{
														duration: 0.3,
														delay: idx * 0.04,
													}}
													className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-lg shadow-black/5 transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/80"
												>
													<div className="relative h-48 overflow-hidden">
														<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-amber-200/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-primary/20 dark:to-amber-300/10" />
														{renderImages(
															item.images,
														)}
													</div>
													<div className="flex items-center justify-between border-t border-slate-200/80 px-4 py-3 text-sm font-medium text-slate-800 dark:border-white/10 dark:text-white">
														<span>
															{item.title}
														</span>
														<ArrowRightIcon className="h-4 w-4 text-muted-foreground" />
													</div>
												</motion.div>
											),
										)}
									</AnimatePresence>
								</motion.div>
							</TabsContent>
						</Tabs>
					</div>

					<div className="mt-4 flex justify-center md:mt-2">
						<Link href="/#editor">
							<Button
								size="lg"
								variant="secondary"
								className="rounded-full px-8 shadow-lg shadow-primary/10 transition-all hover:shadow-primary/30"
							>
								{t("inspiration.cta")}
								<ArrowRightIcon className="ml-2 h-4 w-4" />
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
