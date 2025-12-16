import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import "./globals.css";
import "cropperjs/dist/cropper.css";
import { config } from "@repo/config";
import { getBaseUrl } from "@repo/utils";

const baseUrl = getBaseUrl();

/**
 * 站点级别的默认描述（英文）
 * 注意：这是根 layout，在 locale 路由之外，无法使用 getTranslations
 * 各子页面应通过 generateMetadata 提供多语言版本覆盖此默认值
 */
const DEFAULT_DESCRIPTION =
	"Turn text into stunning visuals in seconds. AI-powered image generation and editing platform with premium models for photorealistic results.";

/**
 * 根 Layout 的全局 Metadata 配置
 *
 * 作用说明：
 * 1. metadataBase - 所有相对路径的基础 URL（必须在根 layout 定义）
 * 2. title.template - 子页面标题格式，如 "页面标题 | Pixelto"
 * 3. robots - 全局搜索引擎爬取规则
 * 4. 其他字段 - 当子页面未定义 metadata 时的后备值
 *
 * 子页面通过 generateMetadata 函数可覆盖这些默认值
 */
export const metadata: Metadata = {
	// 标题配置
	title: {
		absolute: config.appName, // 首页使用绝对标题
		default: config.appName, // 默认标题
		template: `%s | ${config.appName}`, // 子页面标题模板
	},
	description: DEFAULT_DESCRIPTION,
	// 所有相对路径的基础 URL
	metadataBase: new URL(baseUrl),
	// Open Graph（Facebook、LinkedIn 等社交媒体分享）
	openGraph: {
		type: "website",
		locale: "en_US",
		siteName: config.appName,
		title: config.appName,
		description: DEFAULT_DESCRIPTION,
		images: [
			{
				url: "/images/og-default.png",
				width: 1200,
				height: 630,
				alt: config.appName,
			},
		],
	},
	// Twitter Card
	twitter: {
		card: "summary_large_image",
		title: config.appName,
		description: DEFAULT_DESCRIPTION,
		images: ["/images/og-default.png"],
	},
	// 搜索引擎爬取规则
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1, // 允许任意长度视频预览
			"max-image-preview": "large", // 允许大图预览
			"max-snippet": -1, // 允许任意长度文字摘要
		},
	},
};

export default function RootLayout({ children }: PropsWithChildren) {
	return children;
}
