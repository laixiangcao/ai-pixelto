import {
	createPurchase,
	deletePurchaseBySubscriptionId,
	getPurchaseBySubscriptionId,
	invalidateSubscriptionGrantsForPlan,
	updatePurchase,
} from "@repo/database";
import { logger } from "@repo/logs";
import Stripe from "stripe";
import { setCustomerIdToEntity } from "../../src/lib/customer";
import {
	calculateUpgradeCreditsDiff,
	getPlanIdByProductId,
} from "../../src/lib/helper";
import type {
	CancelSubscription,
	CreateCheckoutLink,
	CreateCustomerPortalLink,
	SetSubscriptionSeats,
	WebhookHandler,
} from "../../types";

let stripeClient: Stripe | null = null;

export function getStripeClient() {
	if (stripeClient) {
		return stripeClient;
	}

	const stripeSecretKey = process.env.STRIPE_SECRET_KEY as string;

	if (!stripeSecretKey) {
		throw new Error("Missing env variable STRIPE_SECRET_KEY");
	}

	stripeClient = new Stripe(stripeSecretKey);

	return stripeClient;
}

export const createCheckoutLink: CreateCheckoutLink = async (options) => {
	const stripeClient = getStripeClient();
	const {
		type,
		productId,
		redirectUrl,
		customerId,
		organizationId,
		userId,
		trialPeriodDays,
		seats,
		email,
	} = options;

	const metadata = {
		organization_id: organizationId || null,
		user_id: userId || null,
	};

	const response = await stripeClient.checkout.sessions.create({
		mode: type === "subscription" ? "subscription" : "payment",
		success_url: redirectUrl ?? "",
		line_items: [
			{
				quantity: seats ?? 1,
				price: productId,
			},
		],
		...(customerId ? { customer: customerId } : { customer_email: email }),
		...(type === "one-time"
			? {
					payment_intent_data: {
						metadata,
					},
					customer_creation: "always",
				}
			: {
					subscription_data: {
						metadata,
						trial_period_days: trialPeriodDays,
					},
				}),
		metadata,
	});

	return response.url;
};

export const createCustomerPortalLink: CreateCustomerPortalLink = async ({
	customerId,
	redirectUrl,
}) => {
	const stripeClient = getStripeClient();

	const response = await stripeClient.billingPortal.sessions.create({
		customer: customerId,
		return_url: redirectUrl ?? "",
	});

	return response.url;
};

export const setSubscriptionSeats: SetSubscriptionSeats = async ({
	id,
	seats,
}) => {
	const stripeClient = getStripeClient();

	const subscription = await stripeClient.subscriptions.retrieve(id);

	if (!subscription) {
		throw new Error("Subscription not found.");
	}

	await stripeClient.subscriptions.update(id, {
		items: [
			{
				id: subscription.items.data[0].id,
				quantity: seats,
			},
		],
	});
};

export const cancelSubscription: CancelSubscription = async (id) => {
	const stripeClient = getStripeClient();

	await stripeClient.subscriptions.cancel(id);
};

export const webhookHandler: WebhookHandler = async (req) => {
	const stripeClient = getStripeClient();

	if (!req.body) {
		return new Response("Invalid request.", {
			status: 400,
		});
	}

	let event: Stripe.Event | undefined;

	try {
		event = await stripeClient.webhooks.constructEventAsync(
			await req.text(),
			req.headers.get("stripe-signature") as string,
			process.env.STRIPE_WEBHOOK_SECRET as string,
		);
	} catch (e) {
		logger.error(e);

		return new Response("Invalid request.", {
			status: 400,
		});
	}

	try {
		switch (event.type) {
			case "checkout.session.completed": {
				const { mode, metadata, customer, id } = event.data.object;

				if (mode === "subscription") {
					break;
				}

				const checkoutSession =
					await stripeClient.checkout.sessions.retrieve(id, {
						expand: ["line_items"],
					});

				const productId = checkoutSession.line_items?.data[0].price?.id;

				if (!productId) {
					return new Response("Missing product ID.", {
						status: 400,
					});
				}

				await createPurchase({
					organizationId: metadata?.organization_id || null,
					userId: metadata?.user_id || null,
					customerId: customer as string,
					type: "ONE_TIME",
					productId,
				});

				await setCustomerIdToEntity(customer as string, {
					organizationId: metadata?.organization_id,
					userId: metadata?.user_id,
				});

				break;
			}
			case "customer.subscription.created": {
				const { metadata, customer, items, id } = event.data.object;

				const productId = items?.data[0].price?.id;

				if (!productId) {
					return new Response("Missing product ID.", {
						status: 400,
					});
				}

				await createPurchase({
					subscriptionId: id,
					organizationId: metadata?.organization_id || null,
					userId: metadata?.user_id || null,
					customerId: customer as string,
					type: "SUBSCRIPTION",
					productId,
					status: event.data.object.status,
				});

				await setCustomerIdToEntity(customer as string, {
					organizationId: metadata?.organization_id,
					userId: metadata?.user_id,
				});

				break;
			}
			case "customer.subscription.updated": {
				const subscription = event.data.object as Stripe.Subscription &
					Record<string, unknown>;
				const subscriptionId = subscription.id;
				const newProductId = subscription.items?.data[0].price?.id;
				// 使用 Stripe 订阅的当前周期结束时间作为积分过期时间
				const currentPeriodEndUnix =
					typeof subscription["current_period_end"] === "number"
						? subscription["current_period_end"]
						: null;
				const currentPeriodEnd = currentPeriodEndUnix
					? new Date(currentPeriodEndUnix * 1000)
					: null;

				const existingPurchase =
					await getPurchaseBySubscriptionId(subscriptionId);

				if (existingPurchase) {
					// 检测是否是计划升降级（productId 变化）
					const oldProductId = existingPurchase.productId;
					const isProductChange =
						oldProductId &&
						newProductId &&
						oldProductId !== newProductId;

					if (isProductChange) {
						const oldPlanId = getPlanIdByProductId(oldProductId);
						const newPlanId = getPlanIdByProductId(newProductId);

						const ownerInfo = existingPurchase.organizationId
							? {
									organizationId:
										existingPurchase.organizationId,
								}
							: { userId: existingPurchase.userId ?? undefined };

						if (oldPlanId) {
							// 清理旧计划的订阅积分（包括之前的升级差额积分）
							const result =
								await invalidateSubscriptionGrantsForPlan({
									...ownerInfo,
									planId: oldPlanId,
								});

							logger.info(
								"Invalidated old plan credits on plan change",
								{
									subscriptionId,
									oldPlanId,
									newPlanId,
									invalidatedCount: result.invalidatedCount,
									invalidatedAmount: result.invalidatedAmount,
								},
							);
						}

						// 升级时发放差额积分（带幂等性保护）
						if (oldPlanId && newPlanId) {
							const creditsDiff = calculateUpgradeCreditsDiff(
								oldPlanId,
								newPlanId,
							);

							if (creditsDiff > 0 && currentPeriodEnd) {
								// 使用订阅周期结束时间作为过期时间，并用周期结束日期作为 sourceRef 的一部分确保幂等性
								const periodEndKey = currentPeriodEnd
									.toISOString()
									.slice(0, 10);
								const sourceRef = `upgrade-${oldPlanId}-to-${newPlanId}-${periodEndKey}`;

								// 幂等性检查：避免重复发放
								const { ensureUpgradeCreditGrant } =
									await import("@repo/database");
								const grantResult =
									await ensureUpgradeCreditGrant({
										...ownerInfo,
										amount: creditsDiff,
										expiresAt: currentPeriodEnd,
										sourceRef,
									});

								if (grantResult) {
									logger.info(
										"Issued upgrade credit difference",
										{
											subscriptionId,
											oldPlanId,
											newPlanId,
											creditsDiff,
											expiresAt:
												currentPeriodEnd.toISOString(),
											isNewGrant: grantResult.isNew,
										},
									);
								}
							}
						}
					}

					await updatePurchase({
						id: existingPurchase.id,
						status: event.data.object.status,
						productId: newProductId,
					});
				}

				break;
			}
			case "customer.subscription.deleted": {
				await deletePurchaseBySubscriptionId(event.data.object.id);

				break;
			}

			default:
				return new Response("Unhandled event type.", {
					status: 200,
				});
		}

		return new Response(null, { status: 204 });
	} catch (error) {
		return new Response(
			`Webhook error: ${error instanceof Error ? error.message : ""}`,
			{
				status: 400,
			},
		);
	}
};
