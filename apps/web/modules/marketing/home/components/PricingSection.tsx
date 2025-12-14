"use client";

import { useSession } from "@saas/auth/hooks/use-session";
import { useUserPurchases } from "@saas/payments/hooks/purchases";
import { PricingTable } from "@saas/payments/components/PricingTable";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function PricingSection() {
	const t = useTranslations("pricing");
	const { user } = useSession();
	// 仅在用户已登录时查询购买记录，避免匿名用户触发 401 错误
	const { activePlan } = useUserPurchases({ enabled: !!user });
	const searchParams = useSearchParams();
	const toastShownRef = useRef(false);

	// 检测订阅成功回调并显示toast
	useEffect(() => {
		const checkoutSuccess = searchParams.get("checkout_success");
		if (
			checkoutSuccess === "true" &&
			!toastShownRef.current &&
			activePlan?.id &&
			activePlan.id !== "free"
		) {
			toastShownRef.current = true;
			const planTitle = t(`products.${activePlan.id}.title`);
			toast.success(t("notifications.subscriptionSuccess.title"), {
				description: t(
					"notifications.subscriptionSuccess.description",
					{ plan: planTitle },
				),
			});
			// 清除URL参数
			const url = new URL(window.location.href);
			url.searchParams.delete("checkout_success");
			window.history.replaceState({}, "", url.toString());
		}
	}, [searchParams, activePlan, t]);

	return (
		<section id="pricing" className="scroll-mt-16 relative overflow-hidden">
			{/* Background Decoration */}
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50 dark:opacity-30" />

			<div className="container max-w-6xl mx-auto px-4">
				<div className="mb-16 text-center space-y-4">
					<h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 dark:from-white dark:to-white/60">
						{t("title")}
					</h2>
					<p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
						{t("description")}
					</p>
				</div>

				<PricingTable
					userId={user?.id}
					activePlanId={activePlan?.id}
					activePurchaseId={activePlan?.purchaseId}
				/>
			</div>
		</section>
	);
}
