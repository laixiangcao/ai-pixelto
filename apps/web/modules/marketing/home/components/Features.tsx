"use client";

import { Button } from "@ui/components/button";
import { cn } from "@ui/lib";
import { motion, useInView } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRef } from "react";

const FEATURE_IMAGES = [
	// Freedom / Nature
	"/images/feature/nano-banana1.png",
	// Figures / Toys
	"/images/feature/nano-banana2.png",
	// Speed / Yellow
	"/images/feature/nano-banana3.gif",
];

const FeatureBlock = ({
	title,
	description,
	cta,
	image,
	index,
}: {
	title: string;
	description: string;
	cta: string;
	image: string;
	index: number;
}) => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });
	const isEven = index % 2 === 0;

	return (
		<div
			ref={ref}
			className={cn(
				"flex flex-col gap-8 md:gap-16 items-center",
				isEven ? "md:flex-row" : "md:flex-row-reverse",
			)}
		>
			{/* Image Side */}
			<motion.div
				className="w-full md:w-1/2"
				initial={{ opacity: 0, x: isEven ? -50 : 50 }}
				animate={
					isInView
						? { opacity: 1, x: 0 }
						: { opacity: 0, x: isEven ? -50 : 50 }
				}
				transition={{ duration: 0.8, ease: "easeOut" }}
			>
				<div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
					<Image
						src={image}
						alt={title}
						fill
						className="object-cover transition-transform duration-700 group-hover:scale-105"
						sizes="(max-width: 768px) 100vw, 50vw"
					/>
					{/* Overlay Gradient */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
				</div>
			</motion.div>

			{/* Text Side */}
			<motion.div
				className="w-full md:w-1/2 text-left space-y-6"
				initial={{ opacity: 0, y: 30 }}
				animate={
					isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
				}
				transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
			>
				<h3 className="text-3xl md:text-4xl font-bold leading-tight">
					{title}
				</h3>
				<p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
					{description}
				</p>
				<Link href="/#editor">
					<Button
						variant="secondary"
						size="lg"
						className="group bg-secondary/80 hover:bg-secondary backdrop-blur-sm border border-primary/10 mt-2"
					>
						{cta}
						<ArrowRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
					</Button>
				</Link>
			</motion.div>
		</div>
	);
};

export function Features() {
	const t = useTranslations("home.features");

	const features = [
		{
			key: "speed",
			image: FEATURE_IMAGES[0],
		},
		{
			key: "figures",
			image: FEATURE_IMAGES[1],
		},
		{
			key: "freedom",
			image: FEATURE_IMAGES[2],
		},
	];

	return (
		<section
			id="features"
			className="bg-zinc-50/50 dark:bg-zinc-900/20 overflow-hidden"
		>
			<div className="container px-4 max-w-6xl mx-auto">
				{/* Section Header */}
				<motion.div
					className="text-center mb-20 space-y-4"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
						{t("title")}
					</h2>
					<p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
						{t("subtitle")}
					</p>
				</motion.div>

				{/* Feature Blocks */}
				<div className="space-y-24 md:space-y-32">
					{features.map((feature, i) => (
						<FeatureBlock
							key={feature.key}
							index={i}
							title={t(`items.${feature.key}.title`)}
							description={t(`items.${feature.key}.description`)}
							cta={t(`items.${feature.key}.cta`)}
							image={feature.image}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
