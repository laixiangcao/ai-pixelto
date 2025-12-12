"use client";

import { useSession } from "@saas/auth/hooks/use-session";
import { useBillingSummary } from "@saas/payments/hooks/billing-summary";
import { Skeleton } from "@ui/components/skeleton";
import { cn } from "@ui/lib";
import { CrownIcon, SparklesIcon, ZapIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { CreditDetailsPopover } from "./CreditDetailsPopover";
import { MarketingUserMenu } from "./MarketingUserMenu";

interface MarketingUserStatusProps {
	className?: string;
}

export function MarketingUserStatus({ className }: MarketingUserStatusProps) {
	const { user, loaded } = useSession();
	const tCredits = useTranslations("app.credits.details");
	const tMenu = useTranslations("app.userMenu");
	const formatter = useFormatter();

	// 获取积分和套餐信息（个人账户，不需要 organizationId）
	const { data: billingSummary, isLoading } = useBillingSummary(null, {
		enabled: !!user,
		staleTime: 60 * 1000, // 1分钟缓存
	});

	if (!loaded || !user) {
		return null;
	}

	const planId = billingSummary?.activePlan?.id;
	const isFree = planId === "free" || !planId;

	const renderPlanBadge = () => {
		if (isFree) {
			return (
				<span className="text-emerald-800 dark:text-emerald-100 hover:text-emerald-900 dark:hover:text-emerald-50 transition-colors">
					{tMenu("upgradePlan")}
				</span>
			);
		}

		if (planId === "premium") {
			return (
				<div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
					<CrownIcon className="size-3.5 text-amber-500 fill-amber-500/20" />
					<span className="font-extrabold tracking-tight">Premium</span>
				</div>
			);
		}

		if (planId === "starter") {
			return (
				<div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
					<SparklesIcon className="size-3.5 text-blue-600 fill-blue-600/20" />
					<span className="font-extrabold tracking-tight">Starter</span>
				</div>
			);
		}
		return <span>{planId}</span>;
	};

	const credits = billingSummary?.credits ?? 0;
	const formattedCredits = formatter.number(credits, {
		useGrouping: true,
		maximumFractionDigits: 0,
	});
	// Use simple label for the popover context
	const planLabel =
		planId === "premium" ? "Premium" : planId === "starter" ? "Starter" : "Free";

	return (
		<div className={cn("flex items-center gap-2 sm:gap-3", className)}>
			{/* 统一状态 Pill：套餐 + 积分 (Nested Pill Design) */}
			<div className="flex items-center p-1 pl-3 gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/60 backdrop-blur-md shadow-sm shadow-emerald-500/5 dark:bg-emerald-900/20 dark:border-emerald-500/30">
				{/* 套餐/升级链接 - 小屏幕隐藏 */}
				<Link
					href="/pricing"
					className="hidden sm:block text-xs font-bold transition-opacity hover:opacity-80"
				>
					{renderPlanBadge()}
				</Link>

				{/* 积分按钮 - 独立的内部 Pill */}
				<CreditDetailsPopover
					credits={credits}
					creditDetails={billingSummary?.creditDetails}
					planLabel={planLabel}
					isFreePlan={isFree}
				>
					<button
						type="button"
						className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-b from-white to-emerald-50/50 border border-emerald-200/60 shadow-sm shadow-emerald-500/10 hover:shadow-md hover:shadow-emerald-500/20 hover:-translate-y-0.5 hover:from-white hover:to-white dark:hover:from-emerald-800 dark:hover:to-emerald-800 active:translate-y-0 active:shadow-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:ring-offset-1 dark:bg-emerald-900 dark:from-emerald-900 dark:to-emerald-900 dark:border-emerald-700/50 dark:shadow-none"
						aria-label={tCredits("title")}
					>
						<ZapIcon className="size-3 text-yellow-500 fill-yellow-500 transition-transform duration-300 group-hover:scale-110 group-active:scale-90" />
						<span className="text-xs font-bold tabular-nums text-emerald-950 dark:text-emerald-50">
							{isLoading ? (
								<Skeleton className="h-4 w-8 bg-emerald-900/10 dark:bg-emerald-50/20" />
							) : (
								formattedCredits
							)}
						</span>
					</button>
				</CreditDetailsPopover>
			</div>

			{/* 用户菜单 */}
			<MarketingUserMenu user={user} credits={credits} />
		</div>
	);
}
