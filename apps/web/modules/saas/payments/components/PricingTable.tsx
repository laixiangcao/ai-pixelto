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
				className={cn("grid grid-cols-1 gap-6", {
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
						const { title, description } =
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

						return (
							<div
								key={planId}
								className={cn(
									"relative flex flex-col rounded-[2rem] bg-card p-8 transition-all duration-200",
									recommended
										? "border-2 border-primary hover:-translate-y-1"
										: "border border-border/60 hover:border-primary/20 hover:-translate-y-1",
								)}
							>
								{/* Zone 1: Header (Title & Description) */}
								<div className="mb-4">
									<div className="mb-2 flex h-[32px] items-center justify-between">
										<h3 className="text-xl font-bold text-foreground">
											{title}
										</h3>
										{recommended && (
											<span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
												{t("pricing.mostPopular")}
											</span>
										)}
									</div>
									<p className="h-[48px] text-sm text-muted-foreground leading-relaxed line-clamp-2">
										{description}
									</p>
								</div>

								{/* Zone 2: Pricing & Action */}
								<div className="flex flex-col justify-end pb-8">
									{/* Discount Tag */}
									<div className="mb-2 h-[26px]">
										{!isFree &&
										yearlyDiscount &&
										interval === "year" ? (
											<span className="inline-flex items-center rounded-md bg-green-500/15 px-2.5 py-1 text-xs font-bold text-green-600 dark:bg-green-500/20 dark:text-green-400">
												{t("pricing.savePercent", {
													percent: yearlyDiscount,
												})}
											</span>
										) : null}
									</div>

									{/* Price Area */}
									<div className="mb-4 h-[88px]">
										{price && (
											<div>
												<div className="flex items-baseline gap-1">
													<span className="text-5xl font-bold tracking-tight">
														{format.number(
															monthlyPrice ??
																price.amount,
															{
																style: "currency",
																currency:
																	price.currency,
																minimumFractionDigits: 0,
																maximumFractionDigits: 2,
															},
														)}
													</span>
													{"interval" in price && (
														<span className="text-muted-foreground font-medium">
															/
															{t(
																"pricing.month",
																{ count: 1 },
															)}
														</span>
													)}
												</div>
												<div className="h-[20px]">
													{yearlyTotal !== null &&
														yearlyTotal > 0 && (
															<p className="mt-2 text-sm text-muted-foreground">
																{t(
																	"pricing.billedAnnually",
																	{
																		amount: format.number(
																			yearlyTotal,
																			{
																				style: "currency",
																				currency:
																					price.currency,
																			},
																		),
																	},
																)}
															</p>
														)}
												</div>
											</div>
										)}
									</div>

									{/* Button */}
									<div>
										{isEnterprise ? (
											<Button
												className="w-full rounded-xl font-bold"
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
													"w-full rounded-xl font-bold",
													recommended
														? "shadow-md hover:shadow-lg"
														: "border-primary/20 text-primary hover:bg-primary/5 hover:text-primary",
												)}
												variant={
													recommended
														? "primary"
														: "outline"
												}
												size="lg"
												onClick={() =>
													onSelectPlan(
														planId as PlanId,
														price?.productId,
													)
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

								{/* Zone 3: Features */}
								{features && features.length > 0 && (
									<ul className="flex-1 space-y-3">
										{features.map((feature, index) => (
											<li
												key={index}
												className="flex items-start gap-3"
											>
												{feature.included ? (
													<CheckIcon className="mt-0.5 size-4 shrink-0 text-green-500" />
												) : (
													<XIcon className="mt-0.5 size-4 shrink-0 text-red-500/70" />
												)}
												<span
													className={cn(
														"text-sm leading-tight",
														feature.included
															? "text-foreground"
															: "text-muted-foreground",
														feature.highlight &&
															"font-bold text-primary",
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
