"use client";

import { Button } from "@ui/components/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@ui/components/popover";
import { cn } from "@ui/lib";
import { ArrowRightIcon, ZapIcon } from "lucide-react";
import Link from "next/link";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export interface CreditDetails {
	total: number;
	dailyFree: number;
	purchased: number;
	subscription: number;
	promotional: number;
	nextExpiry: string | null;
}

interface CreditDetailsPopoverProps {
	credits: number;
	creditDetails?: CreditDetails;
	planLabel: string;
	isFreePlan: boolean;
	children: React.ReactNode;
	className?: string;
}

export function CreditDetailsPopover({
	credits,
	creditDetails,
	planLabel,
	isFreePlan,
	children,
	className,
}: CreditDetailsPopoverProps) {
	const t = useTranslations("app.credits.details");
	const tMenu = useTranslations("app.userMenu");
	const formatter = useFormatter();
	const [open, setOpen] = useState(false);
	const isPointerFine = useIsPointerFine();
	const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const formatNumber = (value: number) =>
		formatter.number(value, {
			useGrouping: true,
			maximumFractionDigits: 0,
		});

	const expiringTotal =
		(creditDetails?.subscription ?? 0) + (creditDetails?.promotional ?? 0);
	const nonExpiringTotal = creditDetails?.purchased ?? 0;
	const dailyFree = creditDetails?.dailyFree ?? 0;
	const nextExpiry = creditDetails?.nextExpiry;

	const handleUsageDetails = () => {
		toast.info(t("usageComingSoon"));
	};

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

	const formattedNextExpiry =
		nextExpiry && !Number.isNaN(new Date(nextExpiry).getTime())
			? formatter.dateTime(new Date(nextExpiry), { dateStyle: "medium" })
			: null;

	const shouldShowPaidBlock = !isFreePlan;
	const shouldShowFreeBlock = isFreePlan;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				asChild
				onPointerEnter={handlePointerEnter}
				onPointerLeave={handlePointerLeave}
			>
				{children}
			</PopoverTrigger>
			<PopoverContent
				className={cn(
					"w-[320px] sm:w-[340px] rounded-2xl shadow-xl border-border/30 dark:border-border bg-popover p-0 overflow-hidden",
					className,
				)}
				align="end"
				onOpenAutoFocus={(e) => e.preventDefault()}
				onPointerEnter={handlePointerEnter}
				onPointerLeave={handlePointerLeave}
			>
				<div className="p-4 space-y-4">
					{/* 顶部：计划名称 + Upgrade 按钮 */}
					<div className="flex items-center justify-between pb-4 border-b border-border/30 dark:border-border/50">
						<div className="text-sm font-bold text-foreground leading-none">
							{planLabel}
						</div>
						<Button
							asChild
							size="sm"
							className="h-7 px-3 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200/50 dark:shadow-none shrink-0 border border-emerald-500/20"
						>
							<Link href="/pricing">{tMenu("upgradePlan")}</Link>
						</Button>
					</div>

					{/* 付费用户：积分详情 */}
					{shouldShowPaidBlock && (
						<div className="space-y-0.5">
							{/* 主积分数值 */}
							<div className="flex items-center justify-between gap-4">
								<div className="flex items-center gap-2.5">
									<div className="flex items-center justify-center size-8 rounded-full bg-amber-100/50 dark:bg-amber-900/20">
										<ZapIcon className="size-4 text-amber-500 fill-amber-500/20" />
									</div>
									<div className="text-sm font-semibold text-foreground">
										{t("title")}
									</div>
								</div>
								<div className="text-sm font-bold tabular-nums text-foreground">
									{formatNumber(credits)}
								</div>
							</div>

							{/* 积分分类明细 */}
							<div className="space-y-1.5 pl-[42px]">
								<CreditRow
									label={
										formattedNextExpiry
											? t("expireAfter", {
													date: formattedNextExpiry,
												})
											: t("expiring")
									}
									value={expiringTotal}
									formatNumber={formatNumber}
								/>
								<CreditRow
									label={t("nonExpiringCredits")}
									value={nonExpiringTotal}
									formatNumber={formatNumber}
								/>
							</div>
						</div>
					)}

					{/* 免费用户：每日积分 */}
					{shouldShowFreeBlock && (
						<div className="space-y-0.5">
							{/* 主积分数值 */}
							<div className="flex items-center justify-between gap-4">
								<div className="flex items-center gap-2.5">
									<div className="flex items-center justify-center size-8 rounded-full bg-amber-100/50 dark:bg-amber-900/20">
										<ZapIcon className="size-4 text-amber-500 fill-amber-500/20" />
									</div>
									<div className="text-sm font-semibold text-foreground">
										{t("dailyFreeLabel")}
									</div>
								</div>
								<div className="text-sm font-bold tabular-nums text-foreground">
									{formatNumber(dailyFree)}
								</div>
							</div>

							{/* 每日积分说明 */}
							<div className="text-xs text-muted-foreground pl-[42px]">
								{t("dailyFreeHintWithAmount", {
									amount: formatNumber(dailyFree),
								})}
							</div>
						</div>
					)}
				</div>

				{/* 底部：Usage Details */}
				<div className="border-t border-border/30 dark:border-border/50 p-2">
					<button
						type="button"
						onClick={handleUsageDetails}
						className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all group"
					>
						<span>{t("usageDetails")}</span>
						<ArrowRightIcon className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
					</button>
				</div>
			</PopoverContent>
		</Popover>
	);
}

function CreditRow({
	label,
	value,
	formatNumber,
}: {
	label: string;
	value: number;
	formatNumber: (value: number) => string;
}) {
	return (
		<div className="flex items-center justify-between gap-2">
			<div className="text-sm text-muted-foreground/80">{label}</div>
			<div className="tabular-nums text-sm font-semibold text-foreground">
				{formatNumber(value)}
			</div>
		</div>
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
