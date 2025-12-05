import { LocaleLink } from "@i18n/routing";
import { config } from "@repo/config";
import { Logo } from "@shared/components/Logo";

export function Footer() {
	return (
		<footer className="border-t border-border/50 bg-muted/30 py-12 text-sm">
			<div className="container grid grid-cols-1 gap-8 lg:grid-cols-3">
				<div className="space-y-4">
					<div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity duration-200">
						<Logo />
					</div>
					<p className="text-muted-foreground max-w-xs">
						Transform your images with the power of AI. Professional
						results in seconds.
					</p>
					<p className="text-xs text-muted-foreground/70">
						© {new Date().getFullYear()} {config.appName}. All
						rights reserved.
					</p>
				</div>

				<div className="flex flex-col gap-3">
					<h4 className="font-semibold text-foreground mb-1">
						Product
					</h4>
					<LocaleLink
						href="/blog"
						className="text-muted-foreground hover:text-primary transition-colors duration-200"
					>
						Blog
					</LocaleLink>
					<a
						href="#features"
						className="text-muted-foreground hover:text-primary transition-colors duration-200"
					>
						Features
					</a>
					<a
						href="/pricing"
						className="text-muted-foreground hover:text-primary transition-colors duration-200"
					>
						Pricing
					</a>
				</div>

				<div className="flex flex-col gap-3">
					<h4 className="font-semibold text-foreground mb-1">
						Legal
					</h4>
					<LocaleLink
						href="/legal/privacy-policy"
						className="text-muted-foreground hover:text-primary transition-colors duration-200"
					>
						Privacy Policy
					</LocaleLink>
					<LocaleLink
						href="/legal/terms"
						className="text-muted-foreground hover:text-primary transition-colors duration-200"
					>
						Terms of Service
					</LocaleLink>
				</div>
			</div>
		</footer>
	);
}
