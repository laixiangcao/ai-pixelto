"use server";

import { type GenerateContentResponse, GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from environment variables
// Note: This runs on the server, so the key is safe.
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
	console.warn("GEMINI_API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export async function editImageAction(
	prompt: string,
	fileBase64: string,
	mimeType: string,
	modelId = "gemini-2.5",
): Promise<{ success: boolean; data?: string; error?: string }> {
	if (!apiKey) {
		return {
			success: false,
			error: "Server configuration error: API Key missing.",
		};
	}

	// Ensure we have a valid prompt
	const finalPrompt = prompt || "Enhance this image";

	try {
		const response: GenerateContentResponse =
			await ai.models.generateContent({
				model: modelId,
				contents: {
					parts: [
						{
							inlineData: {
								data: fileBase64,
								mimeType: mimeType,
							},
						},
						{
							text: finalPrompt,
						},
					],
				},
				config: {
					responseModalities: ["IMAGE"],
				},
			});

		// Extract image from response
		const parts = response.candidates?.[0]?.content?.parts;
		if (parts) {
			for (const part of parts) {
				if (part.inlineData?.data) {
					return { success: true, data: part.inlineData.data };
				}
			}
		}

		return { success: false, error: "No image generated in response" };
	} catch (error: any) {
		console.error("Gemini Generation Error:", error);
		return {
			success: false,
			error: error.message || "Failed to generate image",
		};
	}
}
