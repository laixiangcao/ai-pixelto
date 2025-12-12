"use client";

import type { Session } from "@repo/auth";
import { authClient } from "@repo/auth/client";
import { config } from "@repo/config";
import { UserAvatar } from "@shared/components/UserAvatar";
import { clearCache } from "@shared/lib/cache";
import { Button } from "@ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@ui/components/dropdown-menu";
import {
	ArrowRightIcon,
	BookIcon,
	LogOutIcon,
	MessageCircleIcon,
	UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

interface MarketingUserMenuProps {
	user: Session["user"];
	credits?: number;
}

export function MarketingUserMenu({
	user,
	credits = 0,
}: MarketingUserMenuProps) {
	const t = useTranslations("app.userMenu");
	const [open, setOpen] = useState(false);
	const isPointerFine = useIsPointerFine();
	const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handlePointerEnter = () => {
		if (!isPointerFine) {
			return;
		}
		if (hoverTimer.current) {
			clearTimeout(hoverTimer.current);
		}
		setOpen(true);
	};

	const handlePointerLeave = () => {
		if (!isPointerFine) {
			return;
		}
		if (hoverTimer.current) {
			clearTimeout(hoverTimer.current);
		}
		hoverTimer.current = setTimeout(() => setOpen(false), 120);
	};

	const onLogout = () => {
		authClient.signOut({
			fetchOptions: {
				onSuccess: async () => {
					await clearCache();
					window.location.href = new URL(
						config.auth.redirectAfterLogout,
						window.location.origin,
					).toString();
				},
			},
		});
	};

	return (
		<DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger
				asChild
				onPointerEnter={handlePointerEnter}
				onPointerLeave={handlePointerLeave}
			>
				<button
					type="button"
					className="flex cursor-pointer items-center rounded-full outline-hidden focus-visible:ring-2 focus-visible:ring-primary transition-transform hover:scale-105"
					aria-label="User menu"
				>
					<UserAvatar name={user.name ?? ""} avatarUrl={user.image} />
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="end"
				className="w-[300px] p-2 rounded-2xl"
				onPointerEnter={handlePointerEnter}
				onPointerLeave={handlePointerLeave}
			>
				{/* Profile Card Section */}
				<div className="mb-2 rounded-xl border border-border/30 dark:border-border/50 bg-muted/30 p-4">
					<div className="flex items-start justify-between gap-3 mb-4">
						<div className="flex gap-3 overflow-hidden">
							<UserAvatar
								name={user.name ?? ""}
								avatarUrl={user.image}
								className="size-10 shrink-0 rounded-full border border-border/30 dark:border-border/50"
							/>
							<div className="flex flex-col min-w-0">
								<span className="text-sm font-bold truncate text-foreground leading-tight">
									{user.name}
								</span>
								<span className="text-xs text-muted-foreground truncate leading-tight mt-0.5">
									{user.email}
								</span>
							</div>
						</div>

						<Button
							asChild
							size="sm"
							className="h-7 px-3 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200/50 dark:shadow-none shrink-0 border border-emerald-500/20"
						>
							<Link href="/pricing">{t("upgradePlan")}</Link>
						</Button>
					</div>

					<div className="h-px w-full bg-border/30 dark:bg-border/50 mb-3" />

					{/* Credits Row */}
					{typeof credits === "number" && (
						<Link
							href="/app/credits/usage"
							className="flex items-center justify-between group"
						>
							<span className="text-sm font-medium text-foreground/80">{t("credits")}</span>
							<div className="flex items-center gap-1.5 text-foreground">
								<span className="text-sm font-bold tabular-nums">
									{credits.toLocaleString()}
								</span>
								<ArrowRightIcon className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
							</div>
						</Link>
					)}
				</div>

				{/* Menu Items */}
				<div className="space-y-0.5 px-1">
					{/* 账户设置 */}
					<DropdownMenuItem asChild>
						<Link
							href="/app/settings/general"
							className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg hover:bg-muted/50 focus:bg-muted/50"
						>
							<UserIcon className="size-[18px] text-muted-foreground" />
							<span className="text-sm font-medium">
								{t("manageAccount")}
							</span>
						</Link>
					</DropdownMenuItem>

					{/* 用户指南 */}
					{/* <DropdownMenuItem asChild>
						<a
							href="https://docs.pixelto.com"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg hover:bg-muted/50 focus:bg-muted/50"
						>
							<BookIcon className="size-[18px] text-muted-foreground" />
							<span className="text-sm font-medium">{t("userGuide")}</span>
						</a>
					</DropdownMenuItem> */}

					{/* Discord */}
					{config.contact?.discord && (
						<DropdownMenuItem asChild>
							<a
								href={config.contact.discord}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg hover:bg-muted/50 focus:bg-muted/50"
							>
								<MessageCircleIcon className="size-[18px] text-muted-foreground" />
								<span className="text-sm font-medium">Discord</span>
							</a>
						</DropdownMenuItem>
					)}

					{/* 登出 */}
					<DropdownMenuItem
						onClick={onLogout}
						className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg text-muted-foreground hover:text-red-600 focus:text-red-600 hover:bg-red-50 focus:bg-red-50 mt-1"
					>
						<LogOutIcon className="size-[18px]" />
						<span className="text-sm font-medium">
							{t("logout")}
						</span>
					</DropdownMenuItem>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function useIsPointerFine() {
	const [fine, setFine] = useState(false);
	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}
		const mq = window.matchMedia("(pointer: fine)");
		setFine(mq.matches);
		const handler = (event: MediaQueryListEvent) => setFine(event.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);
	return fine;
}
