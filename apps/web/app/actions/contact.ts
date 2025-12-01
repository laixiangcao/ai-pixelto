"use server";

import { db } from "@repo/database";
import { z } from "zod";

const contactSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	email: z.string().email("Please enter a valid email address"),
	subject: z.enum(["general", "support", "business", "issue"], {
		errorMap: () => ({ message: "Please select a subject" }),
	}),
	message: z.string().min(20, "Message must be at least 20 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export async function submitContactForm(data: ContactFormData) {
	try {
		// 1. Validate input
		const validated = contactSchema.parse(data);

		// 2. Save to database
		await db.contactSubmission.create({
			data: validated,
		});

		// 3. Send email (Mock for now, integrate Resend later if keys provided)
		// await sendMail(...)
		console.log("Contact form submitted:", validated);

		return { success: true };
	} catch (error) {
		console.error("Contact submission error:", error);
		if (error instanceof z.ZodError) {
			return { success: false, error: "Validation failed" };
		}
		return { success: false, error: "Something went wrong. Please try again." };
	}
}



