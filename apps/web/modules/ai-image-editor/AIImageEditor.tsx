"use client";

import { AuthDialog } from "@saas/auth/components/AuthDialog";
import { useSession } from "@saas/auth/hooks/use-session";
import { useActiveOrganization } from "@saas/organizations/hooks/use-active-organization";
import { useBillingSummary } from "@saas/payments/hooks/billing-summary";
import { orpcClient } from "@shared/lib/orpc-client";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { AIImageEdit } from "./AIImageEdit";
import { type Creation, CreationHistory } from "./CreationHistory";
import { LivePreview } from "./LivePreview";

export const AIImageEditor: React.FC = () => {
	const [activeCreation, setActiveCreation] = useState<Creation | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [currentModelId, setCurrentModelId] = useState<string | null>(null);
	const [history, setHistory] = useState<Creation[]>([]);
	const t = useTranslations("editor");
	const { user } = useSession();
	const { activeOrganization } = useActiveOrganization();
	const [authDialogOpen, setAuthDialogOpen] = useState(false);
	const { data: billingSummary, refetch: refetchBillingSummary } =
		useBillingSummary(activeOrganization?.id ?? null, {
			enabled: !!user,
			staleTime: 60 * 1000,
		});

	// Load history
	useEffect(() => {
		// Ensure we are on client side
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("gemini_editor_history");
			if (saved) {
				try {
					const parsed = JSON.parse(saved);
					setHistory(
						parsed.map((item: any) => ({
							...item,
							timestamp: new Date(item.timestamp),
						})),
					);
				} catch (e) {
					console.error("Failed to load history", e);
				}
			}
		}
	}, []);

	// Save history
	useEffect(() => {
		try {
			const limitedHistory = history.slice(0, 10);
			if (limitedHistory.length > 0) {
				localStorage.setItem(
					"gemini_editor_history",
					JSON.stringify(limitedHistory),
				);
			} else {
				localStorage.removeItem("gemini_editor_history");
			}
		} catch (e) {
			console.warn("Local storage full or error saving history", e);
		}
	}, [history]);

	useEffect(() => {
		if (user && authDialogOpen) {
			setAuthDialogOpen(false);
		}
	}, [user, authDialogOpen]);

	// Resize and compress image before sending to API to avoid RPC/Payload errors
	const resizeImage = (file: File, maxWidth = 1536): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (event) => {
				const img = new Image();
				img.src = event.target?.result as string;
				img.onload = () => {
					let width = img.width;
					let height = img.height;

					// Calculate new dimensions
					if (width > maxWidth) {
						height = Math.round((height * maxWidth) / width);
						width = maxWidth;
					}

					const canvas = document.createElement("canvas");
					canvas.width = width;
					canvas.height = height;
					const ctx = canvas.getContext("2d");

					if (ctx) {
						ctx.drawImage(img, 0, 0, width, height);
						// Compress to JPEG with 0.85 quality to ensure it fits in payload
						const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
						// Remove prefix
						resolve(dataUrl.split(",")[1]);
					} else {
						reject(new Error("Failed to get canvas context"));
					}
				};
				img.onerror = (e) => reject(e);
			};
			reader.onerror = (error) => reject(error);
		});
	};

	// Simple helper for original preview (keep quality high for local display)
	const fileToBase64Display = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
		});
	};

	const handleGenerate = async (
		promptText: string,
		file: File,
		modelId: string,
		modelCost: number,
	) => {
		if (!user) {
			setAuthDialogOpen(true);
			return;
		}

		const summary =
			billingSummary ?? (await refetchBillingSummary()).data ?? null;
		const availableCredits = summary?.credits ?? 0;

		if (availableCredits < modelCost) {
			toast.error(t("errors.insufficientCredits"));
			return;
		}

		setIsGenerating(true);
		setActiveCreation(null);
		setCurrentModelId(modelId);

		try {
			// 1. Prepare display version (original quality)
			const originalDisplayBase64 = await fileToBase64Display(file);

			// 2. Prepare API version (resized/compressed)
			const apiBase64 = await resizeImage(file);
			const mimeType = "image/jpeg"; // We convert to JPEG in resizeImage

			const response = await orpcClient.ai.images.edit({
				prompt: promptText,
				fileBase64: apiBase64,
				mimeType,
				modelId,
			});

			const imageBase64 = (response as any)?.data?.imageBase64;

			if (!imageBase64) {
				throw new Error("No image returned from API");
			}

			const newCreation: Creation = {
				id: crypto.randomUUID(),
				name:
					promptText.slice(0, 20) +
					(promptText.length > 20 ? "..." : ""),
				originalImage: originalDisplayBase64,
				resultImage: `data:image/png;base64,${imageBase64}`,
				html: "", // No HTML involved
				timestamp: new Date(),
			};
			setActiveCreation(newCreation);
			setHistory((prev) => [newCreation, ...prev]);
			if (user) {
				refetchBillingSummary();
			}
		} catch (error) {
			console.error("Failed to generate:", error);
			const errorData =
				typeof error === "object" && error !== null
					? (error as { code?: string; data?: { code?: string } })
					: undefined;
			const errorCode = errorData?.data?.code ?? errorData?.code;

			if (
				errorCode === "INSUFFICIENT_CREDITS" ||
				errorCode === "PAYMENT_REQUIRED"
			) {
				toast.error(
					t("errors.insufficientCredits", {
						defaultMessage: "额度不足，请前往充值或升级",
					}),
				);
			} else {
				toast.error(
					error instanceof Error
						? error.message
						: t("errors.generationFailed"),
				);
			}
		} finally {
			setIsGenerating(false);
		}
	};

	const handleReset = () => {
		setActiveCreation(null);
		setIsGenerating(false);
	};

	const handleDeleteCreation = (id: string) => {
		setHistory((prev) => prev.filter((item) => item.id !== id));
		if (activeCreation?.id === id) {
			setActiveCreation(null);
		}
	};

	const handleSelectCreation = (creation: any) => {
		setActiveCreation(creation);
	};

	const isFocused = !!activeCreation || isGenerating;

	return (
		<section
			id="editor"
			className="w-full flex flex-col items-center mt-20 md:mt-32 scroll-mt-24"
		>
			<div
				className={`
					w-full max-w-[1126px] px-4 sm:px-6
					transition-all duration-700
					${
						isFocused
							? "opacity-0 scale-95 blur-sm pointer-events-none"
							: "opacity-100 scale-100 blur-0"
					}
				`}
			>
				<div className="relative w-full rounded-3xl border border-border/40 bg-card/30 backdrop-blur-sm shadow-2xl shadow-primary/5 p-1 md:p-2">
					<div className="flex flex-col justify-start items-center w-full">
						{/* Input Section */}
						<div className="w-full flex justify-center">
							<AIImageEdit
								onGenerate={handleGenerate}
								isGenerating={isGenerating}
								disabled={isFocused}
							/>
						</div>

						{/* History Section */}
						{history.length > 0 && (
							<div className="w-full mt-8 flex flex-col items-center gap-6">
								<div className="w-full px-2 md:px-0 max-w-6xl mx-auto">
									<CreationHistory
										history={history}
										onSelect={handleSelectCreation}
										onDelete={handleDeleteCreation}
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Live Preview Overlay (z-40) */}
			<LivePreview
				creation={activeCreation}
				isLoading={isGenerating}
				isFocused={isFocused}
				onReset={handleReset}
				modelId={currentModelId}
			/>

			<AuthDialog
				open={authDialogOpen}
				onOpenChange={setAuthDialogOpen}
			/>
		</section>
	);
};
