/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
	ArrowDownTrayIcon,
	PhotoIcon,
	PlusIcon,
	SparklesIcon,
	ViewColumnsIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Creation } from "./CreationHistory";

interface LivePreviewProps {
	creation: Creation | null;
	isLoading: boolean;
	isFocused: boolean;
	onReset: () => void;
	modelId?: string | null;
}

// Map model IDs to friendly names - should ideally match AIImageEdit.tsx
const MODEL_NAMES: Record<string, string> = {
	"gemini-2.5-flash-image": "Nano Banana🍌",
	"flux-context": "Flux Context",
	"seedream": "Seedream",
};

const LoadingStep = ({
	text,
	active,
	completed,
}: {
	text: string;
	active: boolean;
	completed: boolean;
}) => (
	<div
		className={`flex items-center space-x-3 transition-all duration-500 ${active || completed ? "opacity-100 translate-x-0" : "opacity-30 translate-x-4"}`}
	>
		<div
			className={`w-4 h-4 flex items-center justify-center ${completed ? "text-green-400" : active ? "text-orange-400" : "text-zinc-700"}`}
		>
			{completed ? (
				<svg
					className="w-4 h-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-label="Completed"
				>
					<title>Completed</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M5 13l4 4L19 7"
					/>
				</svg>
			) : active ? (
				<div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
			) : (
				<div className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
			)}
		</div>
		<span
			className={`font-mono text-xs tracking-wide uppercase ${active ? "text-zinc-200" : completed ? "text-zinc-400 line-through" : "text-zinc-600"}`}
		>
			{text}
		</span>
	</div>
);

export const LivePreview: React.FC<LivePreviewProps> = ({
	creation,
	isLoading,
	isFocused,
	onReset,
	modelId,
}) => {
	const t = useTranslations("editor");
	const [loadingStep, setLoadingStep] = useState(0);
	const [showSplitView, setShowSplitView] = useState(true);
	const [mounted, setMounted] = useState(false);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		setMounted(true);
	}, []);

	// Handle loading animation steps and progress
	useEffect(() => {
		if (isLoading) {
			setLoadingStep(0);
			setProgress(0);

			// Step interval (approx 2.5s per step)
			const stepInterval = setInterval(() => {
				setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
			}, 2500);

			// Smooth progress bar (target 95% over 10s)
			const progressInterval = setInterval(() => {
				setProgress((prev) => {
					if (prev >= 95) return prev;
					// Slow down as it gets closer to 95%
					const remaining = 95 - prev;
					const increment = Math.max(0.1, remaining * 0.02);
					return prev + increment;
				});
			}, 50);

			return () => {
				clearInterval(stepInterval);
				clearInterval(progressInterval);
			};
		}
		setLoadingStep(0);
		setProgress(0);
	}, [isLoading]);

	const modelName =
		modelId && MODEL_NAMES[modelId] ? MODEL_NAMES[modelId] : "AI Model";

	const handleExport = () => {
		if (!creation || !creation.resultImage) {
			return;
		}
		const a = document.createElement("a");
		a.href = creation.resultImage;
		a.download = `${creation.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_edited.png`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isFocused) {
				onReset();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isFocused, onReset]);

	if (!mounted) return null;

	return createPortal(
		<div className={`relative z-[9999] ${isFocused ? "pointer-events-auto" : "pointer-events-none"}`}>
			{/* Backdrop */}
			<div
				className={`
					fixed inset-0 bg-black/80 backdrop-blur-sm
					transition-opacity duration-700
					${isFocused ? "opacity-100" : "opacity-0"}
				`}
				onClick={onReset}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						onReset();
					}
				}}
			/>

			<div
				className={`
        fixed z-50 flex flex-col
        rounded-lg overflow-hidden border border-zinc-800 bg-[#0E0E10] shadow-2xl
        transition-all duration-700 cubic-bezier(0.2, 0.8, 0.2, 1)
        ${
			isFocused
				? "inset-2 md:inset-8 opacity-100 scale-100"
				: "top-1/2 left-1/2 w-[90%] h-[60%] -translate-x-1/2 -translate-y-1/2 opacity-0 scale-95 pointer-events-none"
		}
      `}
			>
				{/* Minimal Technical Header */}
				<div className="bg-[#121214] px-4 py-3 flex items-center justify-between border-b border-zinc-800 shrink-0">
					{/* Left: Close Button */}
					<div className="flex items-center w-32">
						<button
							type="button"
							onClick={onReset}
							className="group flex items-center space-x-1.5 text-zinc-400 hover:text-white transition-colors px-2 py-1.5 rounded-md hover:bg-zinc-800"
						>
							<XMarkIcon className="w-4 h-4" />
							<span className="text-xs font-medium">{t("preview.close")}</span>
						</button>
					</div>

					{/* Center: Title */}
					<div className="flex-1 flex items-center justify-center min-w-0 px-4 text-zinc-500">
						<PhotoIcon className="w-3 h-3 mr-2 flex-shrink-0" />
						<span className="text-[11px] font-mono uppercase tracking-wider truncate">
							{isLoading
								? t("preview.processing")
								: creation
									? creation.name
									: t("preview.defaultTitle")}
						</span>
					</div>

					{/* Right: Actions */}
					<div className="flex items-center justify-end space-x-2 w-auto min-w-[8rem]">
						{!isLoading && creation && (
							<>
								{creation.originalImage && (
									<button
										type="button"
										onClick={() =>
											setShowSplitView(!showSplitView)
										}
										title={
											showSplitView
												? t("preview.showResult")
												: t("preview.compare")
										}
										className="bg-zinc-800 text-zinc-100 hover:text-zinc-300 transition-colors p-1.5 rounded-md"
									>
										<ViewColumnsIcon className="w-4 h-4" />
									</button>
								)}

								<button
									type="button"
									onClick={handleExport}
									title={t("preview.download")}
									className="bg-zinc-800 text-zinc-100 hover:text-zinc-300 transition-colors p-1.5 rounded-md"
								>
									<ArrowDownTrayIcon className="w-4 h-4" />
								</button>

								<button
									type="button"
									onClick={onReset}
									title={t("preview.newEdit")}
									className="ml-2 flex items-center space-x-1 text-xs font-bold bg-zinc-100 text-black hover:bg-white px-3 py-1.5 rounded-md transition-colors shadow-lg hover:shadow-white/25"
								>
									<PlusIcon className="w-3 h-3" />
									<span className="hidden sm:inline">
										{t("preview.startOver")}
									</span>
								</button>
							</>
						)}
					</div>
				</div>

				{/* Main Content Area */}
				<div className="relative w-full flex-1 bg-[#09090b] flex overflow-hidden">
					{isLoading ? (
						<div className="absolute inset-0 flex flex-col items-center justify-center p-8 w-full">
							{/* Technical Loading State */}
							<div className="w-full max-w-md space-y-8">
								<div className="flex flex-col items-center">
									<div className="relative w-16 h-16 mb-6 text-orange-500">
										<div className="absolute inset-0 animate-ping opacity-20 rounded-full bg-orange-500" />
										<SparklesIcon className="w-full h-full animate-[spin_3s_linear_infinite]" />
									</div>
									<h3 className="text-zinc-100 font-mono text-lg tracking-tight">
										{t("loading.title")}
									</h3>
									<p className="text-zinc-500 text-sm mt-2">
										{t("loading.processing", {
											model: modelName,
										})}
									</p>
								</div>

								{/* Progress Bar */}
								<div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden relative">
									<div
										className="h-full bg-orange-500 transition-all duration-300 ease-out"
										style={{ width: `${progress}%` }}
									/>
								</div>

								{/* Terminal Steps */}
								<div className="border border-zinc-800 bg-black/50 rounded-lg p-4 space-y-3 font-mono text-sm">
									<LoadingStep
										text={t("loading.steps.analyzing")}
										active={loadingStep === 0}
										completed={loadingStep > 0}
									/>
									<LoadingStep
										text={t("loading.steps.understanding")}
										active={loadingStep === 1}
										completed={loadingStep > 1}
									/>
									<LoadingStep
										text={t("loading.steps.diffusion")}
										active={loadingStep === 2}
										completed={loadingStep > 2}
									/>
									<LoadingStep
										text={t("loading.steps.finalizing")}
										active={loadingStep === 3}
										completed={loadingStep > 3}
									/>
								</div>
							</div>
						</div>
					) : creation?.resultImage ? (
						<div className="w-full h-full flex">
							{/* Split View: Left Panel (Original Image) */}
							{showSplitView && creation.originalImage && (
								<div className="w-1/2 h-full border-r border-zinc-800 bg-[#0c0c0e] relative flex flex-col shrink-0">
									<div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur text-zinc-400 text-[10px] font-mono uppercase px-2 py-1 rounded border border-zinc-800">
										{t("preview.original")}
									</div>
									<div className="w-full h-full p-6 flex items-center justify-center overflow-hidden">
										{/* biome-ignore lint/performance/noImgElement: We need instant display for preview */}
										<img
											src={creation.originalImage}
											alt="Original Input"
											className="w-full h-full object-contain shadow-xl rounded"
										/>
									</div>
								</div>
							)}

							{/* Result Preview Panel */}
							<div
								className={`relative h-full bg-[#09090b] flex flex-col items-center justify-center overflow-hidden transition-all duration-500 ${showSplitView && creation.originalImage ? "w-1/2" : "w-full"}`}
							>
								<div className="absolute top-4 left-4 z-10 bg-orange-500/10 backdrop-blur text-orange-400 text-[10px] font-mono uppercase px-2 py-1 rounded border border-orange-500/20">
									{t("preview.editedResult")}
								</div>
								<div className="w-full h-full p-6 flex items-center justify-center overflow-hidden">
									{/* biome-ignore lint/performance/noImgElement: We need instant display for preview */}
									<img
										src={creation.resultImage}
										alt="Edited Result"
										className="w-full h-full object-contain shadow-xl rounded"
									/>
								</div>
							</div>
						</div>
					) : null}
				</div>
			</div>
		</div>,
		document.body,
	);
};
