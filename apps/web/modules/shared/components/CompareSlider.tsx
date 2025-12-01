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
				"relative w-full overflow-hidden select-none group cursor-ew-resize rounded-2xl border border-white/10 shadow-xl touch-none focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
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
				{editedLabel && (
					<div className="absolute top-4 right-4 z-10 pointer-events-none">
						<div className="flex items-center gap-1 rounded-full border border-white/20 bg-gradient-to-r from-primary to-rose-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-lg shadow-primary/30 backdrop-blur">
							<SparklesIcon className="h-3 w-3" />
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
				{originalLabel && (
					<div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-medium text-white/90 border border-white/10 z-10 pointer-events-none">
						{originalLabel}
					</div>
				)}
			</div>

			{/* Slider Handle */}
			<div
				className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20"
				style={{ left: `${sliderPosition}%` }}
			>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-900">
					<MoveHorizontalIcon className="w-4 h-4" />
				</div>
			</div>
		</div>
	);
}
