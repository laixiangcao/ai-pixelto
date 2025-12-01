import { LocaleLink } from "@i18n/routing";
import { config } from "@repo/config";
import { Logo } from "@shared/components/Logo";

export function Footer() {
	return (
		<footer className="border-t py-8 text-foreground/60 text-sm">
			<div className="container grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div>
					<div className="flex items-center gap-2 opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
						<Logo />
					</div>
					<p className="mt-3 text-sm opacity-70">
						© {new Date().getFullYear()} {config.appName}.{" "}
						<a href="https://supastarter.dev">Built with supastarter</a>.
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<LocaleLink href="/blog" className="block">
						Blog
					</LocaleLink>

					<a href="#features" className="block">
						Features
					</a>

					<a href="/#pricing" className="block">
						Pricing
					</a>
				</div>

				<div className="flex flex-col gap-2">
					<LocaleLink href="/legal/privacy-policy" className="block">
						Privacy policy
					</LocaleLink>

					<LocaleLink href="/legal/terms" className="block">
						Terms and conditions
					</LocaleLink>
				</div>
			</div>
		</footer>
	);
}
