"use client";

import { cn } from "@ui/lib";
import { motion, useInView } from "framer-motion";
import {
	ArrowRightIcon,
	PaletteIcon,
	SparklesIcon,
	ZapIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRef } from "react";

const FEATURE_IMAGES = [
	"/images/feature/speed.png",
	"/images/feature/quality.png",
	"/images/feature/creative.png",
];

const FEATURE_ICONS = [ZapIcon, SparklesIcon, PaletteIcon];

const FeatureBlock = ({
	title,
	description,
	cta,
	image,
	index,
	icon: Icon,
}: {
	title: string;
	description: string;
	cta: string;
	image: string;
	index: number;
	icon: React.ComponentType<{ className?: string }>;
}) => {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });
	const isEven = index % 2 === 0;

	return (
		<div
			ref={ref}
			className={cn(
				"flex flex-col gap-10 md:gap-16 items-center",
				isEven ? "md:flex-row" : "md:flex-row-reverse",
			)}
		>
			{/* Image Side */}
			<motion.div
				className="w-full md:w-1/2"
				initial={{ opacity: 0, x: isEven ? -40 : 40 }}
				animate={
					isInView
						? { opacity: 1, x: 0 }
						: { opacity: 0, x: isEven ? -40 : 40 }
				}
				transition={{ duration: 0.7, ease: "easeOut" }}
			>
				<div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-card shadow-lg group">
					<Image
						src={image}
						alt={title}
						fill
						className="object-cover transition-transform duration-700 group-hover:scale-105"
						sizes="(max-width: 768px) 100vw, 50vw"
					/>
					{/* Subtle gradient overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
				</div>
			</motion.div>

			{/* Text Side */}
			<motion.div
				className="w-full md:w-1/2 text-left space-y-5"
				initial={{ opacity: 0, y: 24 }}
				animate={
					isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }
				}
				transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
			>
				{/* Feature Number & Icon */}
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
						<Icon className="w-5 h-5" />
					</div>
					<span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
						Feature {String(index + 1).padStart(2, "0")}
					</span>
				</div>

				<h3 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-foreground">
					{title}
				</h3>

				<p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
					{description}
				</p>

				<Link href="/#editor" className="inline-block pt-2">
					<button
						type="button"
						className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
					>
						{cta}
						<ArrowRightIcon className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
					</button>
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
			icon: FEATURE_ICONS[0],
		},
		{
			key: "figures",
			image: FEATURE_IMAGES[1],
			icon: FEATURE_ICONS[1],
		},
		{
			key: "freedom",
			image: FEATURE_IMAGES[2],
			icon: FEATURE_ICONS[2],
		},
	];

	return (
		<section
			id="features"
			className="py-16 md:py-20 bg-muted/30 overflow-hidden"
		>
			<div className="container px-4 max-w-6xl mx-auto">
				{/* Section Header */}
				<motion.div
					className="text-center mb-16 md:mb-20"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
				>
					<motion.span
						className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4"
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4 }}
					>
						Why Choose Us
					</motion.span>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
						{t("title")}
					</h2>
					<p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
						{t("subtitle")}
					</p>
				</motion.div>

				{/* Feature Blocks */}
				<div className="space-y-20 md:space-y-28">
					{features.map((feature, i) => (
						<FeatureBlock
							key={feature.key}
							index={i}
							title={t(`items.${feature.key}.title`)}
							description={t(`items.${feature.key}.description`)}
							cta={t(`items.${feature.key}.cta`)}
							image={feature.image}
							icon={feature.icon}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
