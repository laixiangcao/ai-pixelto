import { ParticleBackground } from "@marketing/home/components/ParticleBackground";
import { config } from "@repo/config";
import { Footer } from "@saas/shared/components/Footer";
import { LanguageSwitch } from "@shared/components/LanguageSwitch";
import { Logo } from "@shared/components/Logo";
import { ThemeToggle } from "@shared/components/ThemeToggle";
import { cn } from "@ui/lib";
import Link from "next/link";
import { type PropsWithChildren, Suspense } from "react";

export function AuthWrapper({
	children,
	contentClass,
}: PropsWithChildren<{ contentClass?: string }>) {
	return (
		<div className="relative flex min-h-screen w-full flex-col overflow-hidden">
			<ParticleBackground />

			<div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-between gap-8 py-6">
				<div className="container">
					<div className="flex items-center justify-between">
						<Link
							href="/"
							className="block transition-transform hover:scale-105"
						>
							<Logo />
						</Link>

						<div className="flex items-center justify-end gap-3">
							{config.i18n.enabled && (
								<Suspense>
									<LanguageSwitch />
								</Suspense>
							)}
							<ThemeToggle />
						</div>
					</div>
				</div>

				<div className="container flex justify-center">
					<main
						className={cn(
							"w-full max-w-md rounded-3xl p-6 lg:p-8 backdrop-blur-md transition-all",
							// Base
							"border shadow-2xl",
							// Light Mode
							"bg-white/80 border-slate-200/60 shadow-slate-200/50",
							// Dark Mode
							"dark:bg-card/60 dark:border-border/40 dark:shadow-primary/5",
							contentClass,
						)}
					>
						{children}
					</main>
				</div>

				<Footer />
			</div>
		</div>
	);
}
