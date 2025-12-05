"use client";

import { cn } from "@ui/lib";
import { MoveHorizontalIcon, SparklesIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

interface CompareSliderProps {
	original: string;
	edited: string;
	originalLabel?: string;
	editedLabel?: string;
	/** Optional item label displayed at bottom overlay */
	itemLabel?: string;
	/** Controls how quickly the handle moves during auto-play (higher = faster). */
	autoSpeed?: number;
	/** Called when the handle completes a full back-and-forth auto-play loop. */
	onCycleComplete?: () => void;
	/** Optional hover listener for parent coordination. */
	onHoverChange?: (hovering: boolean) => void;
	className?: string;
	aspectRatio?: "square" | "video" | "portrait" | "auto";
}

export function CompareSlider({
	original,
	edited,
	originalLabel = "Original",
	editedLabel = "AI Edited",
	itemLabel,
	autoSpeed = 0.6,
	onCycleComplete,
	onHoverChange,
	className,
	aspectRatio = "square",
}: CompareSliderProps) {
	const [sliderPosition, setSliderPosition] = useState(50);
	const [isDragging, setIsDragging] = useState(false);
	const [isHovering, setIsHovering] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const animationRef = useRef<number>(null);
	const directionRef = useRef<1 | -1>(1);
	const hasHitHighRef = useRef(false);
	const onCycleCompleteRef = useRef(onCycleComplete);

	useEffect(() => {
		onCycleCompleteRef.current = onCycleComplete;
	}, [onCycleComplete]);

	// Set initial position to 50%
	useEffect(() => {
		setSliderPosition(50);
	}, []);

	const handleMove = useCallback((clientX: number) => {
		if (!containerRef.current) {
			return;
		}

		const rect = containerRef.current.getBoundingClientRect();
		const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
		const percentage = (x / rect.width) * 100;

		setSliderPosition(percentage);
	}, []);

	const onMouseMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (isDragging) {
				handleMove(e.clientX);
			}
		},
		[isDragging, handleMove],
	);

	const onTouchMove = useCallback(
		(e: React.TouchEvent<HTMLDivElement>) => {
			if (isDragging) {
				handleMove(e.touches[0].clientX);
			}
		},
		[isDragging, handleMove],
	);

	useEffect(() => {
		const handleUp = () => setIsDragging(false);
		window.addEventListener("mouseup", handleUp);
		window.addEventListener("touchend", handleUp);
		return () => {
			window.removeEventListener("mouseup", handleUp);
			window.removeEventListener("touchend", handleUp);
		};
	}, []);

	// Handle auto-slide animation
	useEffect(() => {
		if (isDragging || isHovering) {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
			return;
		}

		const animate = () => {
			setSliderPosition((prev) => {
				let next = prev + autoSpeed * directionRef.current;
				// Keep auto-slide within 10-90% range
				if (next >= 90) {
					next = 90;
					directionRef.current = -1;
					hasHitHighRef.current = true;
				} else if (next <= 10) {
					next = 10;
					directionRef.current = 1;
					if (hasHitHighRef.current) {
						// Defer parent callback to avoid setState during current render
						requestAnimationFrame(() =>
							onCycleCompleteRef.current?.(),
						);
					}
					hasHitHighRef.current = false;
				}
				return next;
			});
			animationRef.current = requestAnimationFrame(animate);
		};

		animationRef.current = requestAnimationFrame(animate);

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [autoSpeed, isDragging, isHovering]);

	// Handle keyboard interaction
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowLeft") {
			setSliderPosition((prev) => Math.max(0, prev - 5));
		} else if (e.key === "ArrowRight") {
			setSliderPosition((prev) => Math.min(100, prev + 5));
		}
	};

	return (
		<div
			ref={containerRef}
			className={cn(
				"relative w-full overflow-hidden select-none group cursor-ew-resize rounded-2xl border border-border shadow-lg dark:shadow-xl touch-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
				aspectRatio === "square" && "aspect-square",
				aspectRatio === "video" && "aspect-video",
				aspectRatio === "portrait" && "aspect-[3/4]",
				className,
			)}
			onMouseDown={() => setIsDragging(true)}
			onTouchStart={() => setIsDragging(true)}
			onMouseMove={onMouseMove}
			onTouchMove={onTouchMove}
			onMouseEnter={() => {
				setIsHovering(true);
				onHoverChange?.(true);
			}}
			onMouseLeave={() => {
				setIsHovering(false);
				onHoverChange?.(false);
			}}
			onClick={(e) => handleMove(e.clientX)}
			onKeyDown={handleKeyDown}
			role="slider"
			aria-label="Comparison slider"
			aria-valuenow={sliderPosition}
			aria-valuemin={0}
			aria-valuemax={100}
			tabIndex={0}
		>
			{/* Edited Image (Background) */}
			<div className="absolute inset-0 w-full h-full">
				<Image
					src={edited}
					alt="Edited"
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, 50vw"
					priority
				/>
				{/* AI Edited Label - Small rounded style like History item */}
				{editedLabel && (
					<div className="absolute top-3 right-3 z-10 pointer-events-none">
						<div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wide bg-primary/90 text-white backdrop-blur-sm">
							<SparklesIcon className="h-2.5 w-2.5" />
							<span>{editedLabel}</span>
						</div>
					</div>
				)}
			</div>

			{/* Original Image (Foreground - Clipped) */}
			<div
				className="absolute inset-0 w-full h-full overflow-hidden"
				style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
			>
				<Image
					src={original}
					alt="Original"
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, 50vw"
					priority
				/>
				{/* Original Label - Small rounded style like History item */}
				{originalLabel && (
					<div className="absolute top-3 left-3 z-10 pointer-events-none">
						<div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wide bg-black/60 text-white/90 backdrop-blur-sm">
							<span className="h-1.5 w-1.5 rounded-full bg-white/60" />
							<span>{originalLabel}</span>
						</div>
					</div>
				)}
			</div>

			{/* Bottom Gradient Overlay with Label and Button */}
			{itemLabel && (
				<div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none">
					{/* Gradient background */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

					{/* Content */}
					<div className="relative px-4 py-3 flex items-center justify-between pointer-events-auto">
						<span className="font-medium text-sm text-white">
							{itemLabel}
						</span>
						<button
							type="button"
							className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
							onClick={(e) => e.stopPropagation()}
						>
							<SparklesIcon className="w-3 h-3" />
							<span>Try it</span>
						</button>
					</div>
				</div>
			)}

			{/* Slider Handle */}
			<div
				className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20"
				style={{ left: `${sliderPosition}%` }}
			>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-muted-foreground">
					<MoveHorizontalIcon className="w-4 h-4" />
				</div>
			</div>
		</div>
	);
}
