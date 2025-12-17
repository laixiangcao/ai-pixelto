import { LocaleLink } from "@i18n/routing";
import { config } from "@repo/config";
import { Logo } from "@shared/components/Logo";
import { useTranslations } from "next-intl";

export function Footer() {
	const t = useTranslations("footer");
	return (
		<footer className="border-t border-border/50 bg-muted/30 py-12 text-sm">
			<div className="container grid grid-cols-1 gap-8 lg:grid-cols-3">
				<div className="space-y-4">
					<div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity duration-200">
						<Logo />
					</div>
					<p className="text-muted-foreground max-w-xs">
						{t("description")}
					</p>
					<p className="text-xs text-muted-foreground/70">
						© {new Date().getFullYear()} {config.appName}.{" "}
						{t("allRightsReserved")}
					</p>
				</div>

				<div className="flex flex-col gap-3">
					<h4 className="font-semibold text-foreground mb-1">
						{t("product.title")}
					</h4>
					<LocaleLink
						href="/blog"
						className="text-muted-foreground hover:text-primary transition-colors duration-200"
					>
						{t("product.blog")}
					</LocaleLink>
					<a
						href="/#features"
						className="text-muted-foreground hover:text-primary transition-colors duration-200"
					>
						{t("product.features")}
					</a>
					<a
						href="/pricing"
						className="text-muted-foreground hover:text-primary transition-colors duration-200"
					>
						{t("product.pricing")}
					</a>
				</div>

				<div className="flex flex-col gap-3">
					<h4 className="font-semibold text-foreground mb-1">
						{t("legal.title")}
					</h4>
					<LocaleLink
						href="/legal/privacy-policy"
						className="text-muted-foreground hover:text-primary transition-colors duration-200"
					>
						{t("legal.privacyPolicy")}
					</LocaleLink>
					<LocaleLink
						href="/legal/terms"
						className="text-muted-foreground hover:text-primary transition-colors duration-200"
					>
						{t("legal.termsOfService")}
					</LocaleLink>
				</div>
			</div>
		</footer>
	);
}
