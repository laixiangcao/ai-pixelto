export type Config = {
	appName: string;
	i18n: {
		enabled: boolean;
		locales: { [locale: string]: { currency: string; label: string } };
		defaultLocale: string;
		defaultCurrency: string;
		localeCookieName: string;
	};
	organizations: {
		enable: boolean;
		enableBilling: boolean;
		enableUsersToCreateOrganizations: boolean;
		requireOrganization: boolean;
		hideOrganization: boolean;
		forbiddenOrganizationSlugs: string[];
	};
	users: {
		enableBilling: boolean;
		enableOnboarding: boolean;
	};
	auth: {
		enableSignup: boolean;
		enableMagicLink: boolean;
		enableSocialLogin: boolean;
		enablePasskeys: boolean;
		enablePasswordLogin: boolean;
		enableTwoFactor: boolean;
		redirectAfterSignIn: string;
		redirectAfterLogout: string;
		sessionCookieMaxAge: number;
	};
	mails: {
		from: string;
	};
	storage: {
		bucketNames: {
			avatars: string;
		};
	};
	ui: {
		enabledThemes: Array<"light" | "dark">;
		defaultTheme: Config["ui"]["enabledThemes"][number];
		saas: {
			enabled: boolean;
			useSidebarLayout: boolean;
		};
		marketing: {
			enabled: boolean;
		};
	};
	contact: {
		email: string;
		twitter?: string;
		discord?: string;
		telegram?: string;
		form: {
			enabled: boolean;
			to: string;
			subject: string;
		};
	};
	payments: {
		plans: {
			[id: string]: {
				hidden?: boolean;
				isFree?: boolean;
				isEnterprise?: boolean;
				recommended?: boolean;
				yearlyDiscount?: number; // 年付折扣百分比（如 30 表示 Save 30%）
				credits?: {
					daily?: number; // 每日赠送（如 Free 计划）
					monthly?: number; // 每周期发放（订阅）
					promotionalBonus?: number; // 促销赠送（如年付赠送）
				};
				features?: Array<{
					key: string; // 翻译键（如 "pricing.features.imagesPerDay"）
					included: boolean; // 是否支持该功能
					highlight?: boolean; // 是否高亮显示（绿色文字）
				}>;
				prices?: Array<
					{
						productId: string;
						amount: number;
						currency: string;
						hidden?: boolean;
					} & (
						| {
								type: "recurring";
								interval: "month" | "year" | "week";
								intervalCount?: number;
								trialPeriodDays?: number;
								seatBased?: boolean;
						  }
						| {
								type: "one-time";
						  }
					)
				>;
			};
		};
	};
};
