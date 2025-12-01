"use client";

import { submitContactForm, type ContactFormData } from "@/app/actions/contact";
import {
	EnvelopeIcon,
	MapPinIcon,
	PhoneIcon,
} from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ContactContent() {
	const t = useTranslations("contact");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ContactFormData>();

	const onSubmit = async (data: ContactFormData) => {
		setIsSubmitting(true);
		try {
			const result = await submitContactForm(data);
			if (result.success) {
				toast.success(t("form.notifications.success"));
				reset();
			} else {
				toast.error(t("form.notifications.error"));
			}
		} catch (_error) {
			toast.error(t("form.notifications.error"));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main className="flex-1">
			{/* Header */}
			<section className="bg-muted/30 py-16 md:py-24">
				<div className="container px-4 text-center">
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
						{t("title")}
					</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						{t("description")}
					</p>
				</div>
			</section>

			<section className="container px-4 py-16">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 max-w-6xl mx-auto">
					{/* Contact Info */}
					<div className="space-y-8">
						<h2 className="text-2xl font-bold">Get in touch</h2>
						<p className="text-muted-foreground">
							We'd love to hear from you. Please fill out this form or shoot us
							an email.
						</p>

						<div className="space-y-6">
							<div className="flex items-start gap-4">
								<div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
									<EnvelopeIcon className="w-6 h-6" />
								</div>
								<div>
									<h3 className="font-semibold">Email</h3>
									<p className="text-muted-foreground">
										hello@pixelto.ai
									</p>
									<p className="text-muted-foreground">
										support@pixelto.ai
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
									<MapPinIcon className="w-6 h-6" />
								</div>
								<div>
									<h3 className="font-semibold">Office</h3>
									<p className="text-muted-foreground">
										123 AI Boulevard, Tech District
									</p>
									<p className="text-muted-foreground">
										San Francisco, CA 94105
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="p-3 bg-pink-500/10 rounded-lg text-pink-500">
									<PhoneIcon className="w-6 h-6" />
								</div>
								<div>
									<h3 className="font-semibold">Phone</h3>
									<p className="text-muted-foreground">
										+1 (555) 123-4567
									</p>
									<p className="text-sm text-muted-foreground mt-1">
										Mon-Fri from 8am to 5pm
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Contact Form */}
					<div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<label htmlFor="name" className="text-sm font-medium">
										{t("form.name")}
									</label>
									<input
										id="name"
										{...register("name", { required: true })}
										className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										placeholder="John Doe"
									/>
									{errors.name && (
										<span className="text-xs text-red-500">
											{errors.name.message || "Name is required"}
										</span>
									)}
								</div>

								<div className="space-y-2">
									<label htmlFor="email" className="text-sm font-medium">
										{t("form.email")}
									</label>
									<input
										id="email"
										type="email"
										{...register("email", { required: true })}
										className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
										placeholder="john@example.com"
									/>
									{errors.email && (
										<span className="text-xs text-red-500">
											{errors.email.message || "Email is required"}
										</span>
									)}
								</div>
							</div>

							<div className="space-y-2">
								<label htmlFor="subject" className="text-sm font-medium">
									Subject
								</label>
								<select
									id="subject"
									{...register("subject", { required: true })}
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								>
									<option value="general">General Inquiry</option>
									<option value="support">Technical Support</option>
									<option value="business">Business Partnership</option>
									<option value="issue">Report an Issue</option>
								</select>
							</div>

							<div className="space-y-2">
								<label htmlFor="message" className="text-sm font-medium">
									{t("form.message")}
								</label>
								<textarea
									id="message"
									rows={5}
									{...register("message", { required: true })}
									className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									placeholder="How can we help you?"
								/>
								{errors.message && (
									<span className="text-xs text-red-500">
										{errors.message.message || "Message is required"}
									</span>
								)}
							</div>

							<button
								type="submit"
								disabled={isSubmitting}
								className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
							>
								{isSubmitting ? "Sending..." : t("form.submit")}
							</button>
						</form>
					</div>
				</div>
			</section>
		</main>
	);
}

