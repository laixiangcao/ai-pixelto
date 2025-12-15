import {
	ArrowUpTrayIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	CommandLineIcon,
	SparklesIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { BoltIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface AIImageEditProps {
	onGenerate: (
		prompt: string,
		file: File,
		modelId: string,
		modelCost: number,
	) => void;
	isGenerating: boolean;
	disabled?: boolean;
}

const PRESET_ACTIONS = [
	"Change background to sunset beach",
	"Convert to cartoon style, keep character features",
	"Transform day scene to night",
	"Remove objects from background",
	"Add rain effect and reflections",
	"Make it look like a cyberpunk city",
	"Turn into a pencil sketch",
	"Enhance lighting and colors",
	"Make it look like an oil painting",
];

const SAMPLE_IMAGES = [
	{
		url: "/images/simple/3d-07-original.webp",
		label: "demo1",
	},
	{
		url: "/images/simple/3d-10-original.webp",
		label: "demo2",
	},
	{
		url: "/images/simple/cartoon-08-original.webp",
		label: "demo3",
	},
	{
		url: "/images/simple/christmas-07-original.webp",
		label: "demo4",
	},
];

// Custom Logos

const NanoLogo = () => (
	<Image
		src="/images/icons/ai/gemini.webp"
		alt="NanoBanana"
		width={64}
		height={64}
		className="w-full h-full object-contain"
	/>
);

const FluxLogo = () => (
	<>
		<Image
			src="/images/icons/ai/flux-light.webp"
			alt="Flux"
			width={64}
			height={64}
			className="w-full h-full object-contain dark:hidden"
		/>
		<Image
			src="/images/icons/ai/flux-dark.webp"
			alt="Flux"
			width={64}
			height={64}
			className="w-full h-full object-contain hidden dark:block"
		/>
	</>
);

const SeedreamLogo = () => (
	<Image
		src="/images/icons/ai/seedream.webp"
		alt="Seedream"
		width={64}
		height={64}
		className="w-full h-full object-contain"
	/>
);

const MODELS = [
	{
		id: "gemini-2.5-flash-image",
		name: "Nano Banana🍌",
		description: "Abstract artistic flair",
		cost: 4,
		active: true,
		locked: false,
		Logo: NanoLogo,
	},
	{
		id: "flux-context",
		name: "Flux Context",
		description: "Complex scene awareness",
		cost: 24,
		active: false,
		locked: true,
		Logo: FluxLogo,
	},
	{
		id: "seedream",
		name: "Seedream",
		description: "Photorealistic detail",
		cost: 12,
		active: false,
		locked: true,
		Logo: SeedreamLogo,
	},
];

export const AIImageEdit: React.FC<AIImageEditProps> = ({
	onGenerate,
	isGenerating,
	disabled = false,
}) => {
	const t = useTranslations("editor");
	const [isDragging, setIsDragging] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [prompt, setPrompt] = useState("");
	const [selectedModel, setSelectedModel] = useState<string>(
		"gemini-2.5-flash-image",
	);
	const [toastMessage, setToastMessage] = useState<string | null>(null);

	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);

	const fileInputRef = useRef<HTMLInputElement>(null);
	const chipsScrollRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Auto-resize textarea
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	}, [prompt]);

	const checkScroll = () => {
		if (chipsScrollRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } =
				chipsScrollRef.current;
			setCanScrollLeft(scrollLeft > 0);
			setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
		}
	};

	useEffect(() => {
		checkScroll();
		window.addEventListener("resize", checkScroll);
		return () => window.removeEventListener("resize", checkScroll);
	}, []);

	const handleFile = (file: File) => {
		if (file.type.startsWith("image/")) {
			setSelectedFile(file);
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
		} else {
			alert("Please upload an image file (JPG, PNG).");
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
			handleFile(e.target.files[0]);
		}
	};

	const handleDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			setIsDragging(false);
			if (disabled || isGenerating) {
				return;
			}
			if (e.dataTransfer.files?.[0]) {
				handleFile(e.dataTransfer.files[0]);
			}
		},
		[disabled, isGenerating],
	);

	const handleDragOver = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			if (!disabled && !isGenerating) {
				setIsDragging(true);
			}
		},
		[disabled, isGenerating],
	);

	const handleDragLeave = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			setIsDragging(false);
		},
		[],
	);

	const triggerFileInput = () => {
		if (!disabled && !isGenerating) {
			fileInputRef.current?.click();
		}
	};

	const handleRemoveFile = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setSelectedFile(null);
		setPreviewUrl(null);
		setPrompt(""); // Auto-clear prompt when image is removed
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const loadSampleImage = async (e: React.MouseEvent, url: string) => {
		e.preventDefault();
		e.stopPropagation();
		if (isGenerating) {
			return;
		}

		try {
			const response = await fetch(url);
			const blob = await response.blob();
			const file = new File([blob], "sample.jpg", { type: blob.type });
			handleFile(file);
		} catch (err) {
			console.error("Failed to load sample image", err);
		}
	};

	const handleSubmit = () => {
		const selectedModelConfig = MODELS.find(
			(model) => model.id === selectedModel,
		);
		if (selectedFile && prompt && selectedModelConfig) {
			onGenerate(
				prompt,
				selectedFile,
				selectedModelConfig.id,
				selectedModelConfig.cost,
			);
		}
	};

	const handlePresetClick = (preset: string) => {
		setPrompt(preset);
	};

	const handleModelSelect = (model: (typeof MODELS)[0]) => {
		if (model.active) {
			setSelectedModel(model.id);
		} else {
			setToastMessage(`${model.name} ${t("errors.comingSoon")}`);
			setTimeout(() => setToastMessage(null), 2000);
		}
	};

	const scrollChips = (direction: "left" | "right") => {
		if (chipsScrollRef.current) {
			const scrollAmount = 200;
			chipsScrollRef.current.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			});
		}
	};

	return (
		<div className="relative group/card w-full max-w-[1078px] mx-auto perspective-1000">
			{/* Ambient Glow Layer - Emerald Gradient */}
			<div className="absolute -inset-1 bg-gradient-to-r from-primary/60 via-emerald-400/60 to-teal-500/60 rounded-[2rem] opacity-20 blur-lg group-hover/card:opacity-40 transition duration-500 ease-in-out will-change-opacity" />

			{/* Main Card */}
			<div
				className={`
					relative transition-all duration-500 ease-out
					rounded-3xl bg-card/80 dark:bg-card/90 backdrop-blur-xl 
					border border-border dark:border-border 
					shadow-xl shadow-muted/20 dark:shadow-2xl dark:shadow-black/50
					overflow-hidden h-[520px] flex flex-col
					group-hover/card:border-primary/30 dark:group-hover/card:border-primary/20
				`}
			>
				{/* Decorative Background Grid */}
				<div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] pointer-events-none" />

				{/* Top Status Bar Decoration */}
				<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-border to-transparent opacity-20 z-20" />
				<div className="absolute top-4 right-6 flex items-center space-x-2 pointer-events-none z-20">
					<div className="flex space-x-1">
						<div className="w-1 h-1 bg-muted-foreground/50 rounded-full animate-pulse" />
						<div className="w-1 h-1 bg-muted-foreground/50 rounded-full animate-pulse delay-75" />
						<div className="w-1 h-1 bg-muted-foreground/50 rounded-full animate-pulse delay-150" />
					</div>
					<span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">
						{t("systemReady")}
					</span>
				</div>

				{/* Toast Notification */}
				{toastMessage && (
					<div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4">
						<div className="bg-card text-foreground px-4 py-2 rounded-full text-xs font-mono border border-border shadow-xl flex items-center gap-2">
							<LockClosedIcon className="w-3 h-3 text-amber-500" />
							{toastMessage}
						</div>
					</div>
				)}

				{/* Content Area */}
				<div className="relative flex-1 w-full overflow-hidden flex flex-col">
					{selectedFile && previewUrl ? (
						// PREVIEW STATE
						<div className="relative w-full h-full flex items-center justify-center p-6 animate-in fade-in duration-500">
							{/* biome-ignore lint/performance/noImgElement: Blob URL preview does not need optimization */}
							<img
								src={previewUrl}
								alt="Preview"
								className="relative w-full h-full object-contain z-10"
							/>

							<button
								type="button"
								onClick={handleRemoveFile}
								className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md text-white hover:bg-red-500/80 rounded-full border border-white/10 transition-all shadow-lg z-30 group/close"
							>
								<XMarkIcon className="w-5 h-5 group-hover/close:rotate-90 transition-transform" />
							</button>
						</div>
					) : (
						// UPLOAD STATE
						// biome-ignore lint/a11y/noStaticElementInteractions: Drag and drop zone needs to be interactive
						<div
							className="w-full h-full flex flex-col"
							onDrop={handleDrop}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									triggerFileInput();
								}
							}}
						>
							<button
								type="button"
								onClick={triggerFileInput}
								className="flex-1 flex flex-col items-center justify-center w-full px-6 cursor-pointer group/dropzone hover:bg-muted/50 transition-colors"
							>
								{/* Animated Icon with Lift & Glow */}
								<div
									className={
										"relative w-12 h-12 mb-3 transition-all duration-500 ease-out group-hover/dropzone:scale-110 group-hover/dropzone:-translate-y-1"
									}
								>
									{/* Glow behind */}
									<div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover/dropzone:opacity-100 transition-opacity duration-500" />

									<div
										className={`absolute inset-0 rounded-full border border-dashed border-border dark:border-border transition-all duration-1000 ${isDragging ? "animate-[spin_4s_linear_infinite] border-primary" : "opacity-50 group-hover/dropzone:border-primary/50 group-hover/dropzone:opacity-60"}`}
									/>
									<div
										className={`absolute inset-0 rounded-full border border-border transition-all duration-500 ${isDragging ? "scale-90 border-primary/30" : ""}`}
									/>

									<div className="absolute inset-0 flex items-center justify-center bg-card dark:bg-gradient-to-br dark:from-muted dark:to-card rounded-full backdrop-blur-sm border border-border shadow-sm dark:shadow-inner group-hover/dropzone:shadow-[0_0_20px_var(--glow-primary)] transition-shadow duration-500">
										<ArrowUpTrayIcon
											className={`w-5 h-5 text-muted-foreground transition-all duration-300 ${isDragging ? "text-primary animate-bounce" : "group-hover/dropzone:text-primary"}`}
										/>
									</div>
								</div>

								<h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/60 mb-1 tracking-tight">
									{t("upload.title")}
								</h3>
								<p className="text-muted-foreground text-xs mb-3 font-light tracking-wide">
									{t("upload.dragDrop")}
								</p>

								<div className="flex items-center gap-4 text-foreground mb-0">
									<div className="h-px w-12 bg-gradient-to-r from-transparent to-border" />
									<span className="text-[9px] font-mono uppercase text-muted-foreground">
										{t("upload.supportedFormats")}
									</span>
									<div className="h-px w-12 bg-gradient-to-l from-transparent to-border" />
								</div>
							</button>

							<div className="w-full px-8 pb-9 z-10 bg-gradient-to-t from-white/80 via-white/40 to-transparent dark:from-black/20 dark:via-black/10 dark:to-transparent">
								<div className="relative py-2">
									<div
										className="absolute inset-0 flex items-center"
										aria-hidden="true"
									>
										<div className="w-full border-t border-border" />
									</div>
									<div className="relative flex justify-center">
										<span className="bg-card px-3 text-[10px] font-mono text-muted-foreground uppercase tracking-widest border border-border rounded-full shadow-sm">
											{t("upload.orDemo")}
										</span>
									</div>
								</div>

								{/* Sample Images Container - Compact Spacing (gap-2) */}
								<div className="flex gap-2 justify-center mt-0 mb-2 items-end">
									{SAMPLE_IMAGES.map((sample, idx) => (
										<button
											key={idx}
											onClick={(e) =>
												loadSampleImage(e, sample.url)
											}
											className="
                                                relative group w-14 h-14 rounded-xl cursor-pointer outline-none 
                                                transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] 
                                                z-10 hover:z-50 hover:scale-[1.35] hover:-translate-y-2
                                            "
											type="button"
										>
											{/* Background Block (Prevents clipping) */}
											<div className="absolute inset-0 bg-muted rounded-xl shadow-lg group-hover:shadow-primary/40 transition-all duration-300" />

											{/* Border Overlay (Z-20) - No text labels inside */}
											<div className="absolute inset-0 rounded-xl border-2 border-card group-hover:border-primary transition-colors duration-300 z-20 pointer-events-none" />

											{/* Image Container (Inset slightly) */}
											<div className="absolute inset-[2px] rounded-[10px] overflow-hidden z-10">
												{/* biome-ignore lint/performance/noImgElement: Sample images need to be instantly visible */}
												<img
													src={sample.url}
													alt={sample.label}
													className="w-full h-full object-cover transition-all duration-300 opacity-90 group-hover:opacity-100"
												/>
											</div>
										</button>
									))}
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Hidden File Input */}
				<input
					type="file"
					ref={fileInputRef}
					accept="image/png, image/jpeg, image/webp"
					className="hidden"
					onChange={handleFileChange}
					disabled={isGenerating || disabled}
				/>

				{/* Controls Area */}
				<div className="relative px-6 pb-6 pt-4 bg-muted/50 border-t border-border backdrop-blur-sm z-30">
					{/* Horizontal Model Selector */}
					<div className="w-full overflow-x-auto scrollbar-hide pb-3 -mx-1 px-1 mb-1">
						<div className="flex gap-2 min-w-min">
							{MODELS.map((model) => (
								<button
									type="button"
									key={model.id}
									onClick={() => handleModelSelect(model)}
									className={`
                                        relative flex flex-col justify-center gap-1 w-[200px] py-2.5 px-3 rounded-xl border transition-all duration-300 flex-shrink-0
                                        group/model text-left
                                        ${
											model.id === selectedModel
												? "bg-primary/5 dark:bg-primary/5 border-primary/60 shadow-sm dark:shadow-[0_0_15px_-5px_var(--glow-primary)]"
												: "bg-card dark:bg-muted/60 border-border hover:bg-muted dark:hover:bg-muted hover:border-primary/30"
										}
                                        ${!model.active && "opacity-60"}
                                    `}
								>
									{/* Top Row: Icon + Name + Cost */}
									<div className="flex items-center justify-between w-full">
										<div className="flex items-center gap-2">
											<div className="w-5 h-5 flex-shrink-0">
												<model.Logo />
											</div>
											<span
												className={`text-[13px] font-bold tracking-wide ${model.id === selectedModel ? "text-primary dark:text-primary" : "text-foreground/80"}`}
											>
												{model.name}
											</span>
										</div>

										{/* Cost or Lock */}
										{model.locked ? (
											<LockClosedIcon className="w-3.5 h-3.5 text-muted-foreground" />
										) : (
											<div className="flex items-center gap-0.5 text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
												<BoltIcon className="w-3 h-3" />
												<span className="text-[10px] font-mono font-bold">
													{model.cost}
												</span>
											</div>
										)}
									</div>

									{/* Bottom Row: Description */}
									<div
										className={`text-[10px] leading-tight truncate w-full pl-0.5 ${model.id === selectedModel ? "text-primary/80 dark:text-primary/60" : "text-muted-foreground"}`}
									>
										{model.description}
									</div>

									{/* Selected Glow Effect */}
									{model.id === selectedModel && (
										<div className="absolute inset-0 rounded-xl ring-1 ring-primary/20 pointer-events-none" />
									)}
								</button>
							))}
						</div>
					</div>

					{/* Command Input Wrapper */}
					<div className="relative flex items-center bg-card dark:bg-card rounded-xl border border-border overflow-hidden focus-within:border-primary/50 focus-within:shadow-sm dark:focus-within:shadow-[0_0_20px_-5px_var(--glow-primary)] transition-all duration-300 mb-3 pr-2 min-h-[54px]">
						<div className="pl-4 pr-2 text-muted-foreground flex-shrink-0 self-center">
							<CommandLineIcon className="w-5 h-5" />
						</div>

						<textarea
							ref={textareaRef}
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							placeholder={
								selectedFile
									? t("input.placeholder")
									: t("input.placeholderWaiting")
							}
							disabled={!selectedFile || isGenerating}
							rows={1}
							className="flex-1 min-w-0 bg-transparent border-none py-3 pr-4 text-sm font-mono text-foreground placeholder-muted-foreground focus:ring-0 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed resize-none max-h-[3.5em] overflow-y-auto leading-relaxed self-center scrollbar-hide"
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									handleSubmit();
								}
							}}
						/>

						<div className="flex-shrink-0 ml-1 self-center">
							<button
								type="button"
								onClick={handleSubmit}
								disabled={
									!selectedFile || !prompt || isGenerating
								}
								className={`
                                    flex items-center gap-2 px-4 py-2 rounded-lg
                                    font-medium text-sm text-white shadow-lg
                                    transition-all duration-300
                                    ${
										!selectedFile || !prompt || isGenerating
											? "bg-gray-200 dark:bg-muted text-gray-400 dark:text-muted-foreground border border-gray-300 dark:border-transparent cursor-not-allowed shadow-none"
											: "bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-400 shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
									}
                                `}
							>
								<span className="hidden sm:inline">
									{isGenerating
										? t("input.processing")
										: t("input.generate")}
								</span>
								<SparklesIcon
									className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`}
								/>
							</button>
						</div>
					</div>

					{/* Integrated Preset Chips (Holographic Pills) with Conditional Scroll Mask */}
					<div className="relative group/scroll">
						{/* Left Gradient & Button (Conditional on Hover) */}
						{canScrollLeft && (
							<div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-muted via-muted/90 to-transparent z-20 pointer-events-none opacity-0 group-hover/scroll:opacity-100 transition-opacity duration-300 flex items-center justify-start pl-1">
								<button
									type="button"
									onClick={() => scrollChips("left")}
									className="pointer-events-auto h-8 w-8 flex items-center justify-center bg-card/90 backdrop-blur border border-border text-muted-foreground rounded-full shadow-lg hover:text-primary hover:bg-muted hover:border-primary/30 transition-all duration-200 active:scale-95"
								>
									<ChevronLeftIcon className="w-4 h-4" />
								</button>
							</div>
						)}

						{/* Chips Container - Removed horizontal padding (px-2) */}
						<div
							ref={chipsScrollRef}
							onScroll={checkScroll}
							className="flex overflow-x-auto gap-3 pb-1 scrollbar-hide items-center scroll-smooth"
						>
							{PRESET_ACTIONS.map((preset, i) => (
								<button
									type="button"
									key={i}
									onClick={() => handlePresetClick(preset)}
									className="
                                        group/chip whitespace-nowrap px-3 py-1.5 rounded-md 
                                        bg-card dark:bg-muted/50 border border-border 
                                        text-muted-foreground text-[11px] font-mono tracking-tight
                                        hover:bg-muted dark:hover:bg-muted hover:text-primary hover:border-primary/30
                                        active:scale-95 transition-all duration-200 flex-shrink-0
                                    "
								>
									<span className="opacity-50 group-hover/chip:opacity-100 mr-1.5 text-primary">
										&gt;
									</span>
									{preset}
								</button>
							))}
						</div>

						{/* Right Gradient & Button (Conditional on Hover) */}
						{canScrollRight && (
							<div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-muted via-muted/90 to-transparent z-20 pointer-events-none opacity-0 group-hover/scroll:opacity-100 transition-opacity duration-300 flex items-center justify-end pr-1">
								<button
									type="button"
									onClick={() => scrollChips("right")}
									className="pointer-events-auto h-8 w-8 flex items-center justify-center bg-card/90 backdrop-blur border border-border text-muted-foreground rounded-full shadow-lg hover:text-primary hover:bg-muted hover:border-primary/30 transition-all duration-200 active:scale-95"
								>
									<ChevronRightIcon className="w-4 h-4" />
								</button>
							</div>
						)}
					</div>
				</div>
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
