"use client";

import { LocaleLink } from "@i18n/routing";
import { type Config, config } from "@repo/config";
import { usePlanData } from "@saas/payments/hooks/plan-data";
import type { PlanId } from "@saas/payments/types";
import { useLocaleCurrency } from "@shared/hooks/locale-currency";
import { useRouter } from "@shared/hooks/router";
import { orpc } from "@shared/lib/orpc-query-utils";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@ui/components/button";
import { cn } from "@ui/lib";
import { CheckIcon, PhoneIcon, XIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

const plans = config.payments.plans as Config["payments"]["plans"];

export function PricingTable({
	className,
	userId,
	organizationId,
	activePlanId,
}: {
	className?: string;
	userId?: string;
	organizationId?: string;
	activePlanId?: string;
}) {
	const t = useTranslations();
	const format = useFormatter();
	const router = useRouter();
	const localeCurrency = useLocaleCurrency();
	const [loading, setLoading] = useState<PlanId | false>(false);
	const [interval, setInterval] = useState<"month" | "year">("year");

	const { planData } = usePlanData();

	const createCheckoutLinkMutation = useMutation(
		orpc.payments.createCheckoutLink.mutationOptions(),
	);

	const onSelectPlan = async (planId: PlanId, productId?: string) => {
		if (!(userId || organizationId)) {
			router.push("/auth/signup");
			return;
		}

		const plan = plans[planId];
		const price = plan.prices?.find(
			(price) => price.productId === productId,
		);

		if (!price) {
			return;
		}

		setLoading(planId);

		try {
			const { checkoutLink } =
				await createCheckoutLinkMutation.mutateAsync({
					type:
						price.type === "one-time" ? "one-time" : "subscription",
					productId: price.productId,
					organizationId,
					redirectUrl: window.location.href,
				});

			window.location.href = checkoutLink;
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const filteredPlans = Object.entries(plans).filter(
		([planId]) =>
			planId !== activePlanId && (!activePlanId || planId !== "free"),
	);

	const hasSubscriptions = filteredPlans.some(([_, plan]) =>
		plan.prices?.some((price) => price.type === "recurring"),
	);

	return (
		<div className={cn("@container", className)}>
			{/* Tab Switcher - Pill Style */}
			{hasSubscriptions && (
				<div className="mb-12 flex justify-center">
					<div className="inline-flex items-center rounded-full border border-border/40 bg-muted/30 p-1">
						<button
							type="button"
							onClick={() => setInterval("month")}
							className={cn(
								"rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200",
								interval === "month"
									? "bg-primary text-primary-foreground shadow-md"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							{t("pricing.monthly")}
						</button>
						<button
							type="button"
							onClick={() => setInterval("year")}
							className={cn(
								"rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
								interval === "year"
									? "bg-primary text-primary-foreground shadow-md"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							{t("pricing.yearly")}
							<span className="text-base">🔥</span>
						</button>
					</div>
				</div>
			)}

			<div
				className={cn("grid grid-cols-1 gap-8 py-8 px-1", {
					"@xl:grid-cols-2": filteredPlans.length >= 2,
					"@3xl:grid-cols-3": filteredPlans.length >= 3,
					"@4xl:grid-cols-4": filteredPlans.length >= 4,
				})}
			>
				{filteredPlans
					.filter(([planId]) => planId !== activePlanId)
					.map(([planId, plan]) => {
						const {
							isFree,
							isEnterprise,
							prices,
							recommended,
							yearlyDiscount,
							features,
						} = plan;
						const { title } =
							planData[planId as keyof typeof planData];

						let price = prices?.find(
							(price) =>
								!price.hidden &&
								(price.type === "one-time" ||
									price.interval === interval) &&
								price.currency === localeCurrency,
						);

						if (isFree) {
							price = {
								amount: 0,
								currency: localeCurrency,
								interval,
								productId: "",
								type: "recurring",
							};
						}

						if (!(price || isEnterprise)) {
							return null;
						}

						const monthlyPrice =
							price && "interval" in price && interval === "year"
								? price.amount / 12
								: null;

						const yearlyTotal =
							price && "interval" in price && interval === "year"
								? price.amount
								: null;

						const shouldShowOriginalMonthlyPrice =
							!isFree &&
							interval === "year" &&
							typeof yearlyDiscount === "number" &&
							yearlyDiscount > 0 &&
							monthlyPrice !== null;

						const originalMonthlyPrice = shouldShowOriginalMonthlyPrice
							? monthlyPrice / (1 - yearlyDiscount / 100)
							: null;

						const isUltra = planId === "ultra";
						const isPro = planId === "pro";

						return (
							<div
								key={planId}
								className={cn(
									"relative flex flex-col rounded-[2rem] bg-card p-8 transition-all duration-200",
									isPro
										? "border border-primary shadow-lg scale-[1.02] ring-4 ring-primary/5 z-10"
										: isUltra
											? "border border-blue-600 shadow-lg scale-[1.02] ring-4 ring-blue-600/5 z-10 dark:border-blue-500"
											: "border border-border/60 hover:border-primary/20 hover:shadow-md",
								)}
							>
								{ isPro && (
									<div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-sm ring-4 ring-background">
										{t("pricing.mostPopular")}
									</div>
								)}
								{ isUltra && (
									<div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm ring-4 ring-background dark:bg-blue-500">
										{t("pricing.expertChoice")}
									</div>
								)}

								<div className="mb-4">
									<div className="mb-2 flex min-h-[32px] items-center justify-between">
										<h3
											className={cn(
												"text-xl font-bold",
												isPro && "text-primary",
												isUltra && "text-blue-600 dark:text-blue-400",
												!isUltra && !isPro && "text-foreground",
											)}
										>
											{title}
										</h3>
									</div>
								</div>

								<div className="flex flex-col pb-8">
									<div className="min-h-[120px] space-y-2">
										{price && (
											<div>
												<div className="flex items-baseline gap-2">
													{originalMonthlyPrice !== null && (
														<span
															className={cn(
																"text-3xl font-semibold line-through decoration-2 opacity-50",
																isPro && "text-primary/80",
																isUltra && "text-blue-600/80 dark:text-blue-400/80",
																!isUltra && !isPro && "text-foreground/60",
															)}
														>
															{format.number(originalMonthlyPrice, {
																style: "currency",
																currency: price.currency,
																minimumFractionDigits: 0,
																maximumFractionDigits: 2,
															})}
														</span>
													)}
													<span className="text-4xl font-bold tracking-tight">
														{format.number(monthlyPrice ?? price.amount, {
															style: "currency",
															currency: price.currency,
															minimumFractionDigits: 0,
															maximumFractionDigits: 2,
														})}
													</span>
													{"interval" in price && (
														<span className="text-muted-foreground font-medium">
															/
															{t("pricing.month", { count: 1 })}
														</span>
													)}
												</div>

												<div className="mt-1 h-5">
													{interval === "month" && !isFree ? (
														<p className="text-sm text-muted-foreground">
															{t("pricing.billedMonthly")}
														</p>
													) : yearlyTotal !== null && yearlyTotal > 0 ? (
														<p className="text-sm text-muted-foreground">
															{t("pricing.billedAnnually", {
																amount: format.number(yearlyTotal, {
																	style: "currency",
																	currency: price.currency,
																}),
															})}
														</p>
													) : null}
												</div>

												<div className="mt-6">
													{typeof plan.credits?.monthly === "number" ? (
														<div className="flex items-baseline gap-2 rounded-lg bg-muted/50 p-2.5">
															<span className="text-2xl font-bold leading-none text-foreground">
																{format.number(plan.credits.monthly)}
															</span>
															<span className="text-sm font-medium text-muted-foreground">
																{t("pricing.creditsMonthlyLabel")}
															</span>
														</div>
													) : typeof plan.credits?.daily === "number" ? (
														<div className="flex items-baseline gap-2 rounded-lg bg-muted/50 p-2.5">
															<span className="text-2xl font-bold leading-none text-foreground">
																{format.number(plan.credits.daily)}
															</span>
															<span className="text-sm font-medium text-muted-foreground">
																{t("pricing.creditsDailyLabel")}
															</span>
														</div>
													) : null}
												</div>
											</div>
										)}
									</div>

									<div className="mt-6">
										{isEnterprise ? (
											<Button
												className="w-full rounded-xl font-bold h-12"
												variant="outline"
												size="lg"
												asChild
											>
												<LocaleLink href="/contact">
													<PhoneIcon className="mr-2 size-4" />
													{t("pricing.contactSales")}
												</LocaleLink>
											</Button>
										) : (
											<Button
												className={cn(
													"w-full rounded-xl font-bold h-12 transition-all",
													isPro
														? "shadow-md hover:shadow-xl hover:-translate-y-0.5"
														: isUltra
															? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-xl hover:-translate-y-0.5 dark:bg-blue-600 dark:hover:bg-blue-500 border-transparent"
															: "border-primary/20 text-primary hover:bg-primary/5 hover:text-primary",
												)}
												variant={isPro ? "primary" : "outline"}
												size="lg"
												onClick={() =>
													onSelectPlan(planId as PlanId, price?.productId)
												}
												loading={loading === planId}
											>
												{isFree
													? t("pricing.freeToUse")
													: t("pricing.subscribe")}
											</Button>
										)}
									</div>
								</div>

								{features && features.length > 0 && (
									<ul className="flex-1 space-y-3 pt-2 border-t border-border/40">
										{features.map((feature, index) => (
											<li
												key={index}
												className="flex items-start gap-3 mt-4"
											>
												{feature.included ? (
													<div
														className={cn(
															"flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
															isUltra ? "bg-blue-600/10" : "bg-primary/10",
														)}
													>
														<CheckIcon
															className={cn(
																"size-3.5",
																isUltra ? "text-blue-600" : "text-primary",
															)}
														/>
													</div>
												) : (
													<XIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground/40" />
												)}
												<span
													className={cn(
														"text-sm leading-tight",
														feature.included
															? "text-foreground"
															: "text-muted-foreground",
														feature.highlight &&
															(isUltra
																? "font-semibold text-blue-600"
																: "font-semibold text-primary"),
													)}
												>
													{t(feature.key)}
												</span>
											</li>
										))}
									</ul>
								)}
							</div>
						);
					})}
			</div>
		</div>
	);
}
