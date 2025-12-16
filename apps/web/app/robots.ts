import { getBaseUrl } from "@repo/utils";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	const baseUrl = getBaseUrl();

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/app/", // 私有应用页面
					"/api/", // API 路由
					"/auth/", // 认证页面
					"/onboarding/", // 用户引导页面
					"/choose-plan/", // 选择套餐页面
					"*/changelog", // Demo 页面，暂不收录
					"*/docs", // Demo 页面，暂不收录
					"*/docs/*", // Demo 子页面
				],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
