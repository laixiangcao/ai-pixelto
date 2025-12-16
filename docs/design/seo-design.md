# Pixelto SEO 技术设计文档

> 本文档描述 Pixelto 项目的 SEO 技术实现细节，供开发人员参考。

---

## 目录

1. [架构概览](#一架构概览)
2. [基础元数据配置](#二基础元数据配置)
3. [结构化数据（JSON-LD）](#三结构化数据json-ld)
4. [Sitemap 与 Robots](#四sitemap-与-robots)
5. [工具函数详解](#五工具函数详解)
6. [图片优化配置](#六图片优化配置)
7. [新增页面 SEO 接入指南](#七新增页面-seo-接入指南)
8. [常见问题与排查](#八常见问题与排查)

---

## 一、架构概览

### SEO 模块位置

```
apps/web/
├── app/
│   ├── layout.tsx              # 全局 Metadata 配置
│   ├── sitemap.ts              # XML Sitemap 生成
│   ├── robots.ts               # robots.txt 生成
│   └── (marketing)/[locale]/   # 营销页面（带 generateMetadata）
│       ├── page.tsx            # 首页
│       ├── pricing/page.tsx    # 定价页
│       ├── about/page.tsx      # 关于页
│       ├── contact/page.tsx    # 联系页
│       ├── blog/               # 博客
│       └── ...
└── modules/shared/
    ├── lib/seo.ts              # SEO 工具函数
    └── components/JsonLd.tsx   # JSON-LD 组件
```

### 数据流

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  config/index   │────▶│  seo.ts 工具函数  │────▶│  页面 Metadata  │
│  (站点配置)      │     │  (生成元数据)     │     │  (Next.js)      │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌──────────────────┐
                        │  JsonLd 组件     │
                        │  (结构化数据)     │
                        └──────────────────┘
```

### 核心依赖

| 依赖 | 用途 |
|------|------|
| `@repo/config` | 站点名称、联系方式等配置 |
| `@repo/utils` | `getBaseUrl()` 获取站点 URL |
| `next-intl` | 多语言支持 |
| `content-collections` | MDX 内容管理 |

---

## 二、基础元数据配置

### 2.1 全局 Metadata（layout.tsx）

文件位置：`apps/web/app/layout.tsx`

```typescript
import type { Metadata } from "next";
import { config } from "@repo/config";
import { getBaseUrl } from "@repo/utils";

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  // 标题配置
  title: {
    absolute: config.appName,      // 首页使用绝对标题
    default: config.appName,       // 默认标题
    template: `%s | ${config.appName}`, // 子页面标题模板："页面标题 | Pixelto"
  },
  description: "站点默认描述...",

  // 所有相对路径的基础 URL（必须在根 layout 定义）
  metadataBase: new URL(baseUrl),

  // Open Graph 默认配置
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: config.appName,
    images: [{ url: "/images/og-default.png", width: 1200, height: 630 }],
  },

  // Twitter Card 默认配置
  twitter: {
    card: "summary_large_image",
    images: ["/images/og-default.png"],
  },

  // 搜索引擎爬取规则
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
```

**配置说明**：

| 字段 | 作用 | 覆盖规则 |
|------|------|----------|
| `title.template` | 子页面标题格式 | 子页面 title 自动套用 |
| `metadataBase` | 相对路径基础 URL | 全局生效 |
| `openGraph` | 社交分享默认配置 | 子页面可覆盖 |
| `robots` | 默认允许索引 | 子页面可设置 noIndex |

### 2.2 页面级 generateMetadata

每个营销页面实现 `generateMetadata` 函数覆盖默认配置：

```typescript
// apps/web/app/(marketing)/[locale]/pricing/page.tsx
import { generateSeoMetadata } from "@shared/lib/seo";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });

  return generateSeoMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/pricing",
    locale,
  });
}
```

### 2.3 国际化 SEO（hreflang）

所有页面自动生成 hreflang alternates：

```html
<!-- 输出示例 -->
<link rel="canonical" href="https://pixelto.com/pricing" />
<link rel="alternate" hreflang="en" href="https://pixelto.com/pricing" />
<link rel="alternate" hreflang="de" href="https://pixelto.com/de/pricing" />
<link rel="alternate" hreflang="zh" href="https://pixelto.com/zh/pricing" />
<link rel="alternate" hreflang="x-default" href="https://pixelto.com/pricing" />
```

**URL 规则**：
- 默认语言（en）不带前缀：`/pricing`
- 其他语言带前缀：`/de/pricing`、`/zh/pricing`
- `x-default` 指向默认语言

---

## 三、结构化数据（JSON-LD）

### 3.1 Schema 类型与使用场景

| Schema 类型 | 使用页面 | 作用 |
|-------------|----------|------|
| `Organization` | 首页 | 展示公司/品牌信息 |
| `SoftwareApplication` | 首页 | 展示应用信息 |
| `Article` | 博客文章 | 文章富媒体结果 |
| `FAQPage` | 工具页/产品页 | FAQ 富媒体结果 |
| `BreadcrumbList` | 多级页面 | 面包屑导航 |

### 3.2 JsonLd 组件

文件位置：`apps/web/modules/shared/components/JsonLd.tsx`

```typescript
// 单个 Schema
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// 多个 Schema 组合
export function JsonLdMultiple({ schemas }: { schemas: Array<object> }) {
  return (
    <>
      {schemas.map((schema, index) => (
        <JsonLd key={index} data={schema} />
      ))}
    </>
  );
}
```

**使用示例**：

```tsx
// 首页：Organization + SoftwareApplication
import { JsonLdMultiple } from "@shared/components/JsonLd";
import {
  generateOrganizationSchema,
  generateSoftwareApplicationSchema,
} from "@shared/lib/seo";

export default function HomePage() {
  return (
    <>
      <JsonLdMultiple
        schemas={[
          generateOrganizationSchema(),
          generateSoftwareApplicationSchema(),
        ]}
      />
      {/* 页面内容 */}
    </>
  );
}

// 博客文章：Article Schema
import { JsonLd } from "@shared/components/JsonLd";
import { generateArticleSchema } from "@shared/lib/seo";

export default function BlogPost({ post }) {
  return (
    <>
      <JsonLd
        data={generateArticleSchema({
          title: post.title,
          description: post.excerpt,
          image: post.coverImage,
          publishedAt: post.date,
          author: post.author,
        })}
      />
      {/* 文章内容 */}
    </>
  );
}
```

### 3.3 Schema 生成函数

文件位置：`apps/web/modules/shared/lib/seo.ts`

| 函数 | 参数 | 返回类型 |
|------|------|----------|
| `generateOrganizationSchema()` | 无 | `OrganizationSchema` |
| `generateSoftwareApplicationSchema()` | 无 | `SoftwareApplicationSchema` |
| `generateArticleSchema(article)` | title, description, image?, publishedAt?, author? | `ArticleSchema` |
| `generateFAQPageSchema(faqs)` | `Array<{question, answer}>` | `FAQPageSchema` |
| `generateBreadcrumbSchema(breadcrumbs)` | `Array<{name, url}>` | `BreadcrumbListSchema` |

---

## 四、Sitemap 与 Robots

### 4.1 sitemap.ts 实现

文件位置：`apps/web/app/sitemap.ts`

```typescript
import { getAllPosts } from "@marketing/blog/utils/lib/posts";
import { config } from "@repo/config";
import { getBaseUrl } from "@repo/utils";
import { getLocalePath } from "@shared/lib/seo";
import { allLegalPages } from "content-collections";
import type { MetadataRoute } from "next";

const baseUrl = getBaseUrl();
const locales = Object.keys(config.i18n.locales);

// 静态营销页面（按优先级排序）
const staticMarketingPages = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/pricing", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/blog", priority: 0.8, changeFrequency: "daily" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  return [
    // 静态页面（每种语言一条）
    ...staticMarketingPages.flatMap((page) =>
      locales.map((locale) => ({
        url: new URL(getLocalePath(page.path, locale), baseUrl).href,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      })),
    ),
    // 博客文章
    ...posts.map((post) => ({
      url: new URL(getLocalePath(`/blog/${post.path}`, post.locale), baseUrl).href,
      lastModified: post.date ? new Date(post.date) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // 法律页面
    ...allLegalPages.map((page) => ({
      url: new URL(getLocalePath(`/legal/${page.path}`, page.locale), baseUrl).href,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
```

**添加新页面到 Sitemap**：

```typescript
// 在 staticMarketingPages 数组中添加
const staticMarketingPages = [
  // ... 现有页面
  { path: "/your-new-page", priority: 0.7, changeFrequency: "monthly" as const },
];
```

### 4.2 robots.ts 配置

文件位置：`apps/web/app/robots.ts`

```typescript
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
          "/app/",        // 私有应用页面
          "/api/",        // API 路由
          "/auth/",       // 认证页面
          "/onboarding/", // 用户引导页面
          "/choose-plan/",// 选择套餐页面
          "*/changelog",  // Demo 页面
          "*/docs",       // Demo 页面
          "*/docs/*",     // Demo 子页面
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

---

## 五、工具函数详解

文件位置：`apps/web/modules/shared/lib/seo.ts`

### 5.1 generateSeoMetadata()

生成完整的页面 SEO 元数据。

```typescript
interface GenerateSeoMetadataOptions {
  title: string;           // 页面标题
  description: string;     // 页面描述
  path: string;            // 页面路径（不含 locale 前缀）
  locale: string;          // 当前语言
  image?: string;          // OG 图片（可选，默认 /images/og-default.png）
  keywords?: string;       // 关键词（逗号分隔，可选）
  type?: "website" | "article"; // 类型（可选，默认 website）
  publishedTime?: string;  // 发布时间（article 类型）
  modifiedTime?: string;   // 修改时间（article 类型）
  authors?: string[];      // 作者（article 类型）
  noIndex?: boolean;       // 是否禁止索引（可选，默认 false）
}

function generateSeoMetadata(options: GenerateSeoMetadataOptions): Metadata
```

**返回内容**：
- `title`、`description`
- `keywords`（如果提供）
- `alternates.canonical` + `alternates.languages`（hreflang）
- `openGraph` 完整配置
- `twitter` 完整配置
- `robots`（如果 noIndex 为 true）

### 5.2 generateAlternates()

单独生成 hreflang alternates 配置。

```typescript
function generateAlternates(
  path: string,
  locale: string,
  availableLocales?: string[] // 可选，指定可用语言版本
): {
  canonical: string;
  languages: Record<string, string>;
}
```

**使用场景**：部分页面只有某些语言版本时使用。

### 5.3 getLocalePath()

生成带 locale 前缀的 URL 路径。

```typescript
function getLocalePath(path: string, locale: string): string
// 默认语言（en）不添加前缀
// getLocalePath("/pricing", "en")  → "/pricing"
// getLocalePath("/pricing", "de")  → "/de/pricing"
// getLocalePath("/pricing", "zh")  → "/zh/pricing"
```

---

## 六、图片优化配置

文件位置：`next.config.ts`

```typescript
const nextConfig: NextConfig = {
  images: {
    // 图片缓存 30 天
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // 响应式图片尺寸
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 768, 1024],
    // 允许的外部图片域名
    remotePatterns: [
      // R2 存储
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      // ... 其他域名
    ],
  },
};
```

**图片 SEO 最佳实践**：

```tsx
import Image from "next/image";

// ✅ 正确：提供 alt 和尺寸
<Image
  src="/images/example.webp"
  alt="AI generated wallpaper example"
  width={800}
  height={600}
  loading="lazy"
/>

// ❌ 错误：缺少 alt
<Image src="/images/example.webp" width={800} height={600} />
```

---

## 七、新增页面 SEO 接入指南

### 三步接入流程

#### 步骤 1：添加 generateMetadata 函数

```typescript
// apps/web/app/(marketing)/[locale]/your-page/page.tsx
import { generateSeoMetadata } from "@shared/lib/seo";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "yourPage" });

  return generateSeoMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/your-page",
    locale,
    // 可选配置
    image: "/images/your-page-og.png",
    keywords: "keyword1, keyword2, keyword3",
  });
}

export default async function YourPage({ params }: Props) {
  // 页面内容
}
```

#### 步骤 2：更新 sitemap.ts

```typescript
// apps/web/app/sitemap.ts
const staticMarketingPages = [
  // ... 现有页面
  { path: "/your-page", priority: 0.7, changeFrequency: "monthly" as const },
];
```

#### 步骤 3：添加翻译文本

```json
// packages/i18n/translations/en.json
{
  "yourPage": {
    "meta": {
      "title": "Your Page Title",
      "description": "Your page description for SEO."
    }
  }
}

// packages/i18n/translations/de.json
{
  "yourPage": {
    "meta": {
      "title": "Ihr Seitentitel",
      "description": "Ihre Seitenbeschreibung für SEO."
    }
  }
}

// packages/i18n/translations/zh.json
{
  "yourPage": {
    "meta": {
      "title": "页面标题",
      "description": "页面的 SEO 描述。"
    }
  }
}
```

### 添加 JSON-LD 结构化数据（可选）

```tsx
// 如果页面需要 FAQ Schema
import { JsonLd } from "@shared/components/JsonLd";
import { generateFAQPageSchema } from "@shared/lib/seo";

export default function YourPage() {
  const faqs = [
    { question: "What is this?", answer: "This is..." },
    { question: "How does it work?", answer: "It works by..." },
  ];

  return (
    <>
      <JsonLd data={generateFAQPageSchema(faqs)} />
      {/* 页面内容 */}
    </>
  );
}
```

---

## 八、常见问题与排查

### Q1: sitemap 中的 URL 显示为 localhost

**原因**：未设置 `NEXT_PUBLIC_SITE_URL` 环境变量。

**解决**：
```bash
# .env.production
NEXT_PUBLIC_SITE_URL=https://pixelto.com
```

### Q2: hreflang 不生效

**排查步骤**：
1. 检查 `generateSeoMetadata` 是否正确调用
2. 确认所有语言版本的页面都存在
3. 使用 [hreflang Testing Tool](https://technicalseo.com/tools/hreflang/) 验证

**常见错误**：
```typescript
// ❌ 错误：path 包含了 locale 前缀
generateSeoMetadata({ path: "/de/pricing", locale: "de" });

// ✅ 正确：path 不包含 locale 前缀
generateSeoMetadata({ path: "/pricing", locale: "de" });
```

### Q3: JSON-LD 未被 Google 识别

**排查步骤**：
1. 使用 [Rich Results Test](https://search.google.com/test/rich-results) 检查
2. 确认 Schema 格式正确（@context、@type 必须）
3. 检查是否有语法错误

### Q4: OG 图片不显示

**排查步骤**：
1. 确认图片路径正确（相对路径基于 metadataBase）
2. 检查图片尺寸（推荐 1200x630）
3. 使用 [Facebook Debugger](https://developers.facebook.com/tools/debug/) 清除缓存

### Q5: 页面被索引但未收录

**可能原因**：
1. robots.txt 禁止了该路径
2. 页面设置了 noIndex
3. 内容质量问题

**检查命令**：
```bash
# 检查 robots.txt
curl https://pixelto.com/robots.txt

# 检查页面 meta robots
curl -s https://pixelto.com/your-page | grep -i "robots"
```

---

## 更新日志

| 日期 | 更新内容 |
|------|----------|
| 2024-12-16 | 初始版本，从 seo-guide.md 分离技术实现部分 |
