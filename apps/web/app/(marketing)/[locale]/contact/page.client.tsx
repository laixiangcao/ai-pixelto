"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	type ContactFormValues,
	contactFormSchema,
} from "@repo/api/modules/contact/types";
import { config } from "@repo/config";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import { Textarea } from "@ui/components/textarea";
import { FadeIn } from "@ui/components/FadeIn";
import { Gamepad2Icon, MailIcon, SendIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ContactContent() {
	const t = useTranslations("contact");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const contactFormMutation = useMutation(
		orpc.contact.submit.mutationOptions(),
	);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ContactFormValues>({
		resolver: zodResolver(contactFormSchema),
	});

	const onSubmit = async (data: ContactFormValues) => {
		setIsSubmitting(true);
		try {
			await contactFormMutation.mutateAsync(data);
			toast.success(t("form.notifications.success"));
			reset();
		} catch (_error) {
			toast.error(t("form.notifications.error"));
		} finally {
			setIsSubmitting(false);
		}
	};

	const contactMethods = [
		{
			icon: MailIcon,
			label: "Email",
			value: config.contact.email,
			href: `mailto:${config.contact.email}`,
			color: "text-blue-500",
			bg: "bg-blue-500/10",
		},
		{
			icon: XIcon,
			label: "X (Twitter)",
			value: "@pixelto",
			href: config.contact.twitter,
			color: "text-sky-500",
			bg: "bg-sky-500/10",
		},
		{
			icon: Gamepad2Icon,
			label: "Discord",
			value: "Join our server",
			href: config.contact.discord,
			color: "text-indigo-500",
			bg: "bg-indigo-500/10",
		},
		{
			icon: SendIcon,
			label: "Telegram",
			value: "Join our channel",
			href: config.contact.telegram,
			color: "text-cyan-500",
			bg: "bg-cyan-500/10",
		},
	].filter((method) => method.href);

	return (
		<main className="relative min-h-screen overflow-hidden bg-background selection:bg-primary/20 pt-24 md:pt-32">
			{/* Background Elements */}
			<div className="absolute inset-0 -z-10 pointer-events-none">
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-30" />
				<div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] opacity-20" />
			</div>

			<div className="container px-4 pb-24 max-w-7xl mx-auto">
				{/* Hero */}
				<FadeIn duration={800} direction="up">
					<div className="text-center mb-16 md:mb-24 space-y-6">
						<h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60 pb-2">
							{t("title")}
						</h1>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
							{t("description")}
						</p>
					</div>
				</FadeIn>

				<div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
					{/* Left: Contact Cards */}
					<FadeIn duration={800} delay={200} direction="left">
						<div className="space-y-8">
							<div className="space-y-4">
								<h2 className="text-2xl font-bold tracking-tight">
									Get in touch
								</h2>
								<p className="text-muted-foreground text-lg">
									We'd love to hear from you. Choose your
									preferred way to connect with our team.
								</p>
							</div>

							<div className="grid gap-4">
								{contactMethods.map((method) => (
									<a
										key={method.label}
										href={method.href}
										target="_blank"
										rel="noopener noreferrer"
										className="group flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card/30 hover:bg-card/80 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 backdrop-blur-sm"
									>
										<div
											className={`p-3 rounded-xl ${method.bg} ${method.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}
										>
											<method.icon className="w-6 h-6" />
										</div>
										<div>
											<h3 className="font-semibold text-lg mb-0.5 group-hover:text-primary transition-colors">
												{method.label}
											</h3>
											<p className="text-muted-foreground text-sm group-hover:text-foreground/80 transition-colors">
												{method.value}
											</p>
										</div>
									</a>
								))}
							</div>
						</div>
					</FadeIn>

					{/* Right: Form */}
					<FadeIn duration={800} delay={300} direction="right">
						<div className="relative">
							<div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-emerald-500/10 to-transparent rounded-2xl blur-2xl -z-10" />
							<div className="bg-card/80 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-xl">
								<form
									onSubmit={handleSubmit(onSubmit)}
									className="space-y-6"
								>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="space-y-2">
											<Label htmlFor="name">
												{t("form.name")}
											</Label>
											<Input
												id="name"
												{...register("name")}
												placeholder="John Doe"
												className="bg-background/50 border-border/50 focus:border-primary/50 transition-colors h-11"
											/>
											{errors.name && (
												<span className="text-xs text-destructive">
													{errors.name.message ||
														"Name is required"}
												</span>
											)}
										</div>

										<div className="space-y-2">
											<Label htmlFor="email">
												{t("form.email")}
											</Label>
											<Input
												id="email"
												type="email"
												{...register("email")}
												placeholder="john@example.com"
												className="bg-background/50 border-border/50 focus:border-primary/50 transition-colors h-11"
											/>
											{errors.email && (
												<span className="text-xs text-destructive">
													{errors.email.message ||
														"Email is required"}
												</span>
											)}
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="message">
											{t("form.message")}
										</Label>
										<Textarea
											id="message"
											rows={5}
											{...register("message")}
											placeholder="How can we help you?"
											className="bg-background/50 border-border/50 focus:border-primary/50 transition-colors min-h-[150px] resize-none"
										/>
										{errors.message && (
											<span className="text-xs text-destructive">
												{errors.message.message ||
													"Message is required"}
											</span>
										)}
									</div>

									<Button
										type="submit"
										disabled={isSubmitting}
										variant="primary"
										size="lg"
										className="w-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all h-12 text-base"
										loading={isSubmitting}
									>
										{t("form.submit")}
									</Button>
								</form>
							</div>
						</div>
					</FadeIn>
				</div>
			</div>
		</main>
	);
}
