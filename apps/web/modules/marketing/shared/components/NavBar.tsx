"use client";

import { LocaleLink, useLocalePathname } from "@i18n/routing";
import { config } from "@repo/config";
import { useSession } from "@saas/auth/hooks/use-session";
import { LanguageSwitch } from "@shared/components/LanguageSwitch";
import { Logo } from "@shared/components/Logo";
import { ThemeToggle } from "@shared/components/ThemeToggle";
import { Button } from "@ui/components/button";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@ui/components/sheet";
import { cn } from "@ui/lib";
import { MenuIcon } from "lucide-react";
import NextLink from "next/link";
import { useTranslations } from "next-intl";
import { Suspense, useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

export function NavBar() {
	const t = useTranslations();
	const { user } = useSession();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const localePathname = useLocalePathname();
	const [isTop, setIsTop] = useState(true);

	const debouncedScrollHandler = useDebounceCallback(
		() => {
			setIsTop(window.scrollY <= 10);
		},
		150,
		{
			maxWait: 150,
		},
	);

	useEffect(() => {
		window.addEventListener("scroll", debouncedScrollHandler);
		debouncedScrollHandler();
		return () => {
			window.removeEventListener("scroll", debouncedScrollHandler);
		};
	}, [debouncedScrollHandler]);

	useEffect(() => {
		setMobileMenuOpen(false);
	}, [localePathname]);

	const isDocsPage = localePathname.startsWith("/docs");

	const menuItems: {
		label: string;
		href: string;
	}[] = [
		{
			label: t("common.menu.pricing"),
			href: "/pricing",
		},
		{
			label: t("common.menu.blog"),
			href: "/blog",
		},
		...(config.contact?.form?.enabled
			? [
					{
						label: t("common.menu.contact"),
						href: "/contact",
					},
				]
			: []),
		{
			label: t("common.menu.about"),
			href: "/about",
		},
	];

	const isMenuItemActive = (href: string) => localePathname.startsWith(href);

	return (
		<nav
			className={cn(
				"fixed top-0 left-0 z-50 w-full transition-all duration-300",
				!isTop || isDocsPage
					? "bg-background/80 border-b border-border/50 shadow-sm backdrop-blur-xl"
					: "bg-transparent",
			)}
			data-test="navigation"
		>
			<div className="container">
				<div
					className={cn(
						"flex items-center justify-stretch gap-6 transition-[padding] duration-300",
						!isTop || isDocsPage ? "py-3" : "py-4",
					)}
				>
					<div className="flex flex-1 justify-start items-center">
						<LocaleLink
							href="/"
							className="flex items-center gap-3 hover:no-underline active:no-underline transition-all duration-200 hover:opacity-80"
						>
							<Logo />
						</LocaleLink>
					</div>

					<div className="hidden flex-1 items-center justify-center lg:flex">
						{menuItems.map((menuItem) => (
							<LocaleLink
								key={menuItem.href}
								href={menuItem.href}
								className={cn(
									"relative block px-4 py-2 font-medium text-sm transition-colors duration-200",
									isMenuItemActive(menuItem.href)
										? "text-primary font-semibold"
										: "text-foreground/70 hover:text-primary",
								)}
								prefetch
							>
								{menuItem.label}
								{isMenuItemActive(menuItem.href) && (
									<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
								)}
							</LocaleLink>
						))}
					</div>

					<div className="flex flex-1 items-center justify-end gap-3">
						{config.i18n.enabled && (
							<Suspense>
								<LanguageSwitch />
							</Suspense>
						)}
						<ThemeToggle />

						<Sheet
							open={mobileMenuOpen}
							onOpenChange={(open) => setMobileMenuOpen(open)}
						>
							<SheetTrigger asChild>
								<Button
									className="lg:hidden"
									size="icon"
									variant="ghost"
									aria-label="Menu"
								>
									<MenuIcon className="size-5" />
								</Button>
							</SheetTrigger>
							<SheetContent
								className="w-[280px] bg-background/95 backdrop-blur-xl"
								side="right"
							>
								<SheetTitle className="sr-only">
									Navigation Menu
								</SheetTitle>
								<div className="flex flex-col items-start justify-center pt-8 space-y-1">
									{menuItems.map((menuItem) => (
										<LocaleLink
											key={menuItem.href}
											href={menuItem.href}
											className={cn(
												"block w-full px-4 py-3 rounded-lg font-medium text-base transition-colors duration-200",
												isMenuItemActive(menuItem.href)
													? "bg-primary/10 text-primary font-semibold"
													: "text-foreground/80 hover:bg-muted hover:text-foreground",
											)}
											prefetch
										>
											{menuItem.label}
										</LocaleLink>
									))}

									<div className="w-full h-px bg-border my-4" />

									<NextLink
										key={user ? "start" : "login"}
										href={user ? "/app" : "/auth/login"}
										className={cn(
											"block w-full px-4 py-3 rounded-lg font-medium text-base transition-colors duration-200",
											"bg-primary text-primary-foreground hover:bg-primary/90",
										)}
										prefetch={!user}
									>
										{user
											? t("common.menu.dashboard")
											: t("common.menu.login")}
									</NextLink>
								</div>
							</SheetContent>
						</Sheet>

						{config.ui.saas.enabled &&
							(user ? (
								<Button
									key="dashboard"
									className="hidden lg:flex bg-primary text-primary-foreground hover:bg-primary/90"
									asChild
								>
									<NextLink href="/app">
										{t("common.menu.dashboard")}
									</NextLink>
								</Button>
							) : (
								<Button
									key="login"
									className="hidden lg:flex bg-primary text-primary-foreground hover:bg-primary/90"
									asChild
								>
									<NextLink href="/auth/login" prefetch>
										{t("common.menu.login")}
									</NextLink>
								</Button>
							))}
					</div>
				</div>
			</div>
		</nav>
	);
}
