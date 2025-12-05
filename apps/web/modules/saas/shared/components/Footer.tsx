import { LocaleLink } from "@i18n/routing";
import { config } from "@repo/config";
import { cn } from "@ui/lib";

export function Footer() {
	return (
		<footer
			className={cn(
				"container max-w-6xl py-6 text-center text-muted-foreground/60 text-xs",
			)}
		>
			<span>
				© {new Date().getFullYear()} {config.appName}. All rights
				reserved.
			</span>
			<span className="opacity-50 mx-2"> | </span>
			<LocaleLink
				href="/legal/privacy-policy"
				className="hover:text-primary transition-colors"
			>
				Privacy policy
			</LocaleLink>
			<span className="opacity-50 mx-2"> | </span>
			<LocaleLink
				href="/legal/terms"
				className="hover:text-primary transition-colors"
			>
				Terms and conditions
			</LocaleLink>
		</footer>
	);
}
