import {
	ChevronLeftIcon,
	ChevronRightIcon,
	ClockIcon,
	SparklesIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useRef, useState } from "react";

export interface Creation {
	id: string;
	name: string;
	html?: string;
	originalImage?: string; // Base64 data URL
	resultImage?: string; // Base64 of the edited image
	timestamp: Date;
}

interface CreationHistoryProps {
	history: Creation[];
	onSelect: (creation: Creation) => void;
	onDelete?: (id: string) => void;
}

const HistoryCard = ({
	item,
	onClick,
	onDelete,
}: {
	item: Creation;
	onClick: () => void;
	onDelete?: () => void;
}) => {
	const t = useTranslations("editor");
	const [showResult, setShowResult] = useState(true);

	useEffect(() => {
		const interval = setInterval(() => {
			setShowResult((prev) => !prev);
		}, 3000); // Toggle every 3 seconds
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="relative flex-shrink-0 w-72 h-48 group">
			<button
				type="button"
				onClick={onClick}
				className="relative w-full h-full rounded-xl overflow-hidden border border-border bg-card shadow-lg hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
				aria-label={item.name}
			>
				{/* Image Container */}
				<div className="absolute inset-0 w-full h-full bg-zinc-950">
					{/* Original Image Layer */}
					{item.originalImage && (
						// biome-ignore lint/performance/noImgElement: We need instant display for history
						<img
							src={item.originalImage}
							alt="Original"
							className="absolute inset-0 w-full h-full object-cover"
						/>
					)}

					{/* Result Image Layer (Fades in/out) */}
					{item.resultImage && (
						// biome-ignore lint/performance/noImgElement: We need instant display for history
						<img
							src={item.resultImage}
							alt="Edited"
							className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${showResult ? "opacity-100" : "opacity-0"}`}
						/>
					)}

					{/* Overlay Gradient for text readability */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
				</div>

				{/* Status Badge (Top Left) - Minimalist design */}
				<div className="absolute top-2.5 left-2.5 z-10">
					<div
						className={`
							inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wide
							${
								showResult
									? "bg-black/60 text-white backdrop-blur-sm"
									: "bg-black/40 text-white/70 backdrop-blur-sm"
							}
						`}
					>
						<span
							className={`h-1.5 w-1.5 rounded-full ${showResult ? "bg-primary" : "bg-white/60"}`}
						/>
						{showResult
							? t("history.edited")
							: t("history.original")}
					</div>
				</div>

				{/* Content Overlay (Bottom) */}
				<div className="absolute bottom-0 left-0 w-full p-3 text-left z-10">
					<div className="flex items-center justify-between mb-1">
						<div className="flex items-center space-x-1.5 text-[10px] text-white/70 font-mono">
							<ClockIcon className="w-3 h-3" />
							<span>
								{item.timestamp.toLocaleDateString([], {
									month: "short",
									day: "numeric",
								})}{" "}
								•{" "}
								{item.timestamp.toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
						</div>
					</div>
					<h3 className="text-sm font-medium text-white line-clamp-1 transition-colors">
						{item.name}
					</h3>
				</div>

				{/* Hover Effect Border Glow */}
				<div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 rounded-xl transition-all duration-300 pointer-events-none" />
			</button>

			{/* Delete Button (sibling to avoid nested buttons) */}
			{onDelete && (
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onDelete();
					}}
					className="absolute top-2 right-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur border border-white/20 shadow-md hover:bg-red-500 hover:text-white hover:border-red-200 transition-colors opacity-0 group-hover:opacity-100"
					aria-label={t("history.delete")}
				>
					<TrashIcon className="h-4 w-4" />
				</button>
			)}
		</div>
	);
};

export const CreationHistory: React.FC<CreationHistoryProps> = ({
	history,
	onSelect,
	onDelete,
}) => {
	const t = useTranslations("editor");
	const scrollRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);

	const checkScroll = () => {
		if (scrollRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
			setCanScrollLeft(scrollLeft > 0);
			setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
		}
	};

	useEffect(() => {
		checkScroll();
		window.addEventListener("resize", checkScroll);
		return () => window.removeEventListener("resize", checkScroll);
	}, [history]); // Re-check when history changes

	const scroll = (direction: "left" | "right") => {
		if (scrollRef.current) {
			const scrollAmount = 300;
			scrollRef.current.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			});
		}
	};

	if (history.length === 0) {
		return null;
	}

	return (
		<div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 group/history">
			<div className="flex items-center space-x-3 mb-4 px-1">
				<SparklesIcon className="w-4 h-4 text-primary" />
				<h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
					{t("history.label")}
				</h2>
				<div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
			</div>

			<div className="relative">
				{/* Left Gradient & Button (Conditional on Hover) */}
				{canScrollLeft && (
					<div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background via-background/90 to-transparent z-20 pointer-events-none opacity-0 group-hover/history:opacity-100 transition-opacity duration-300 flex items-center justify-start pl-1">
						<button
							type="button"
							onClick={() => scroll("left")}
							className="pointer-events-auto h-8 w-8 flex items-center justify-center bg-card/90 backdrop-blur border border-border text-muted-foreground rounded-full shadow-lg hover:text-primary hover:bg-muted hover:border-primary/30 transition-all duration-200 active:scale-95"
						>
							<ChevronLeftIcon className="w-4 h-4" />
						</button>
					</div>
				)}

				{/* Horizontal Scroll Container */}
				<div
					ref={scrollRef}
					onScroll={checkScroll}
					className="flex overflow-x-auto space-x-4 pb-4 px-4 scrollbar-hide scroll-smooth"
				>
					{history.map((item) => (
						<HistoryCard
							key={item.id}
							item={item}
							onClick={() => onSelect(item)}
							onDelete={
								onDelete ? () => onDelete(item.id) : undefined
							}
						/>
					))}
					{/* Spacer */}
					<div className="w-4 flex-shrink-0" />
				</div>

				{/* Right Gradient & Button (Conditional on Hover) */}
				{canScrollRight && (
					<div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background via-background/90 to-transparent z-20 pointer-events-none opacity-0 group-hover/history:opacity-100 transition-opacity duration-300 flex items-center justify-end pr-1">
						<button
							type="button"
							onClick={() => scroll("right")}
							className="pointer-events-auto h-8 w-8 flex items-center justify-center bg-card/90 backdrop-blur border border-border text-muted-foreground rounded-full shadow-lg hover:text-primary hover:bg-muted hover:border-primary/30 transition-all duration-200 active:scale-95"
						>
							<ChevronRightIcon className="w-4 h-4" />
						</button>
					</div>
				)}
			</div>

			<style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
		</div>
	);
};
