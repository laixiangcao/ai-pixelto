import type { Config } from "./types";

export const config = {
	appName: "supastarter for Next.js Demo",
	// Internationalization
	i18n: {
		// Whether internationalization should be enabled (if disabled, you still need to define the locale you want to use below and set it as the default locale)
		enabled: true,
		// Define all locales here that should be available in the app
		// You need to define a label that is shown in the language selector and a currency that should be used for pricing with this locale
		locales: {
			en: {
				currency: "USD",
				label: "English",
			},
			de: {
				currency: "USD",
				label: "Deutsch",
			},
			zh: {
				currency: "USD",
				label: "中文",
			},
		},
		// The default locale is used if no locale is provided
		defaultLocale: "en",
		// The default currency is used for pricing if no currency is provided
		defaultCurrency: "USD",
		// The name of the cookie that is used to determine the locale
		localeCookieName: "NEXT_LOCALE",
	},
	// Organizations
	organizations: {
		// Whether organizations are enabled in general
		enable: true,
		// Whether billing for organizations should be enabled (below you can enable it for users instead)
		enableBilling: false,
		// Whether the organization should be hidden from the user (use this for multi-tenant applications)
		hideOrganization: false,
		// Should users be able to create new organizations? Otherwise only admin users can create them
		enableUsersToCreateOrganizations: true,
		// Whether users should be required to be in an organization. This will redirect users to the organization page after sign in
		requireOrganization: false,
		// Define forbidden organization slugs. Make sure to add all paths that you define as a route after /app/... to avoid routing issues
		forbiddenOrganizationSlugs: [
			"new-organization",
			"admin",
			"settings",
			"ai-demo",
			"organization-invitation",
		],
	},
	// Users
	users: {
		// Whether billing should be enabled for users (above you can enable it for organizations instead)
		enableBilling: true,
		// Whether you want the user to go through an onboarding form after signup (can be defined in the OnboardingForm.tsx)
		enableOnboarding: true,
	},
	// Authentication
	auth: {
		// Whether users should be able to create accounts (otherwise users can only be by admins)
		enableSignup: true,
		// Whether users should be able to sign in with a magic link
		enableMagicLink: true,
		// Whether users should be able to sign in with a social provider
		enableSocialLogin: true,
		// Whether users should be able to sign in with a passkey
		enablePasskeys: true,
		// Whether users should be able to sign in with a password
		enablePasswordLogin: true,
		// Whether users should be activate two factor authentication
		enableTwoFactor: true,
		// where users should be redirected after the sign in
		redirectAfterSignIn: "/app",
		// where users should be redirected after logout
		redirectAfterLogout: "/",
		// how long a session should be valid
		sessionCookieMaxAge: 60 * 60 * 24 * 30,
	},
	// Mails
	mails: {
		// the from address for mails
		from: "noreply@supastarter.dev",
	},
	// Frontend
	ui: {
		// the themes that should be available in the app
		enabledThemes: ["light", "dark"],
		// the default theme
		defaultTheme: "light",
		// the saas part of the application
		saas: {
			// whether the saas part should be enabled (otherwise all routes will be redirect to the marketing page)
			enabled: true,
			// whether the sidebar layout should be used
			useSidebarLayout: true,
		},
		// the marketing part of the application
		marketing: {
			// whether the marketing features should be enabled (otherwise all routes will be redirect to the saas part)
			enabled: true,
		},
	},
	// Storage
	storage: {
		// define the name of the buckets for the different types of files
		bucketNames: {
			avatars: process.env.NEXT_PUBLIC_AVATARS_BUCKET_NAME ?? "avatars",
		},
	},
	contact: {
		email: "hello@pixelto.ai",
		twitter: "https://x.com/pixelto",
		discord: "https://discord.gg/pixelto",
		telegram: "https://t.me/pixelto",
		form: {
			enabled: true,
			to: "hello@pixelto.ai",
			subject: "Contact form message",
		},
	},
	// Payments
	payments: {
		// define the products that should be available in the checkout
		plans: {
			// The free plan is treated differently. It will automatically be assigned if the user has no other plan.
			free: {
				isFree: true,
				features: [
					{ key: "pricing.features.imagesPerDay", included: true },
					{ key: "pricing.features.basicResolution", included: true },
					{ key: "pricing.features.basicStyles", included: true },
					{
						key: "pricing.features.watermark",
						included: false,
						highlight: false,
					},
					{
						key: "pricing.features.commercialLicense",
						included: false,
					},
					{
						key: "pricing.features.priorityQueue",
						included: false,
					},
					{
						key: "pricing.features.imageUpscaling",
						included: false,
					},
					{
						key: "pricing.features.backgroundRemoval",
						included: false,
					},
				],
			},
			starter: {
				recommended: true,
				yearlyDiscount: 30,
				features: [
					{ key: "pricing.features.imagesPerMonth", included: true },
					{
						key: "pricing.features.hdResolution",
						included: true,
						highlight: true,
					},
					{
						key: "pricing.features.allStyles",
						included: true,
						highlight: true,
					},
					{ key: "pricing.features.watermark", included: true },
					{
						key: "pricing.features.commercialLicense",
						included: true,
					},
					{
						key: "pricing.features.priorityQueue",
						included: true,
					},
					{
						key: "pricing.features.imageUpscaling",
						included: false,
					},
					{
						key: "pricing.features.backgroundRemoval",
						included: false,
					},
				],
				prices: [
					{
						type: "recurring",
						productId: process.env
							.NEXT_PUBLIC_PRICE_ID_STARTER_MONTHLY as string,
						interval: "month",
						amount: 10,
						currency: "USD",
						seatBased: false,
					},
					{
						type: "recurring",
						productId: process.env
							.NEXT_PUBLIC_PRICE_ID_STARTER_YEARLY as string,
						interval: "year",
						amount: 84,
						currency: "USD",
						seatBased: false,
					},
				],
			},
			premium: {
				yearlyDiscount: 40,
				features: [
					{
						key: "pricing.features.unlimitedImages",
						included: true,
					},
					{
						key: "pricing.features.ultraHdResolution",
						included: true,
						highlight: true,
					},
					{
						key: "pricing.features.allStyles",
						included: true,
						highlight: true,
					},
					{ key: "pricing.features.watermark", included: true },
					{
						key: "pricing.features.commercialLicense",
						included: true,
					},
					{
						key: "pricing.features.priorityQueue",
						included: true,
					},
					{
						key: "pricing.features.imageUpscaling",
						included: true,
						highlight: true,
					},
					{
						key: "pricing.features.backgroundRemoval",
						included: true,
						highlight: true,
					},
				],
				prices: [
					{
						type: "recurring",
						productId: process.env
							.NEXT_PUBLIC_PRICE_ID_PREMIUM_MONTHLY as string,
						interval: "month",
						amount: 20,
						currency: "USD",
						seatBased: false,
					},
					{
						type: "recurring",
						productId: process.env
							.NEXT_PUBLIC_PRICE_ID_PREMIUM_YEARLY as string,
						interval: "year",
						amount: 216,
						currency: "USD",
						seatBased: false,
					},
				],
			},
		},
	},
} as const satisfies Config;

export type { Config };
