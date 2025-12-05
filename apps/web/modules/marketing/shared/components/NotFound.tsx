"use client";

import { LocaleLink } from "@i18n/routing";
import { Button } from "@ui/components/button";
import { GhostIcon, HelpCircleIcon, HomeIcon } from "lucide-react";

export function NotFound() {
	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
			{/* Background */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] opacity-50" />
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] opacity-50" />
			</div>

			{/* Illustration (Abstract) */}
			<div className="relative mb-8">
				<div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
				<GhostIcon className="w-32 h-32 text-primary relative z-10 animate-bounce" />
			</div>

			<h1 className="font-bold text-8xl md:text-9xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 mb-4">
				404
			</h1>
			<h2 className="text-2xl md:text-3xl font-semibold mb-2">
				Page not found
			</h2>
			<p className="text-muted-foreground text-lg max-w-md text-center mb-12">
				Oops! It seems like you've wandered into the void. The page
				you're looking for doesn't exist or has been moved.
			</p>

			<div className="flex gap-4">
				<Button
					asChild
					variant="primary"
					size="lg"
					className="shadow-lg shadow-primary/20"
				>
					<LocaleLink href="/">
						<HomeIcon className="mr-2 size-4" /> Go Home
					</LocaleLink>
				</Button>
				<Button
					asChild
					variant="secondary"
					size="lg"
					className="border border-border/50"
				>
					<LocaleLink href="/contact">
						<HelpCircleIcon className="mr-2 size-4" /> Contact
						Support
					</LocaleLink>
				</Button>
			</div>
		</div>
	);
}
