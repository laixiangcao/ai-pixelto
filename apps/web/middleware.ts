import { routing } from "@i18n/routing";
import { config as appConfig } from "@repo/config";
import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { withQuery } from "ufo";

const intlMiddleware = createMiddleware(routing);

// Demo 页面路径匹配（支持带/不带 locale 前缀，以及默认语言无前缀的情况）
const DEMO_PAGE_PATTERN = /^(?:\/(en|de|zh))?\/(changelog|docs)(?:\/|$)/;

export default async function middleware(req: NextRequest) {
	const { pathname, origin } = req.nextUrl;

	const sessionCookie = getSessionCookie(req);

	// 生产环境重定向 demo 页面到404
	const isProduction = process.env.NODE_ENV === "production";
	if (isProduction && DEMO_PAGE_PATTERN.test(pathname)) {
		return NextResponse.redirect(new URL("/404", origin));
	}

	if (pathname.startsWith("/app")) {
		const response = NextResponse.next();

		if (!appConfig.ui.saas.enabled) {
			return NextResponse.redirect(new URL("/", origin));
		}

		if (!sessionCookie) {
			return NextResponse.redirect(
				new URL(
					withQuery("/auth/login", {
						redirectTo: pathname,
					}),
					origin,
				),
			);
		}

		return response;
	}

	if (pathname.startsWith("/auth")) {
		if (!appConfig.ui.saas.enabled) {
			return NextResponse.redirect(new URL("/", origin));
		}

		return NextResponse.next();
	}

	const pathsWithoutLocale = [
		"/onboarding",
		"/new-organization",
		"/choose-plan",
		"/organization-invitation",
	];

	if (pathsWithoutLocale.some((path) => pathname.startsWith(path))) {
		return NextResponse.next();
	}

	if (!appConfig.ui.marketing.enabled) {
		return NextResponse.redirect(new URL("/app", origin));
	}

	return intlMiddleware(req);
}

export const config = {
	matcher: [
		"/((?!api|image-proxy|images|fonts|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
