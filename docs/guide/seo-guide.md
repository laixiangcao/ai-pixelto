# Pixelto SEO 优化指南

本文档提供 Pixelto 项目的 SEO 实现现状、最佳实践和维护指南。

## 目录

1. [当前 SEO 实现现状](#当前-seo-实现现状)
2. [AI 生图工具站 SEO 最佳实践](#ai-生图工具站-seo-最佳实践)
3. [新站 SEO 优化建议](#新站-seo-优化建议)
4. [维护检查清单](#维护检查清单)
5. [技术实现详解](#技术实现详解)

---

## 当前 SEO 实现现状

### 已实现功能

#### 1. 基础元数据配置 ✅

- **全局 Metadata**: 在 `apps/web/app/layout.tsx` 中配置
  - title template: `%s | Pixelto`
  - description: 全局描述
  - metadataBase: 动态基础 URL
  - robots: 索引和跟随配置
  - Open Graph 默认配置
  - Twitter Card 默认配置

#### 2. 页面级 SEO 配置 ✅

所有营销页面都实现了 `generateMetadata` 函数：

| 页面 | 路径 | SEO 功能 |
|------|------|---------|
| 首页 | `/` | title, description, OG, Twitter, JSON-LD |
| 定价 | `/pricing` | title, description, OG, Twitter, alternates |
| 关于 | `/about` | title, description, OG, Twitter, alternates |
| 联系 | `/contact` | title, description, OG, Twitter, alternates |
| 更新日志 | `/changelog` | title, description, OG, Twitter, alternates |
| 博客列表 | `/blog` | title, description, OG, Twitter, alternates |
| 博客文章 | `/blog/[slug]` | title, description, OG, Twitter, alternates, JSON-LD |
| 文档 | `/docs/[...path]` | title, description, alternates |
| 法律 | `/legal/[...path]` | title, alternates |

#### 3. 国际化 SEO (hreflang) ✅

- 所有页面配置了 `alternates.languages`
- 支持语言: `en`, `de`, `zh`
- 包含 `x-default` 指向默认语言

#### 4. JSON-LD 结构化数据 ✅

- **首页**: Organization Schema + SoftwareApplication Schema
- **博客文章**: Article Schema

#### 5. 站点地图 (Sitemap) ✅

文件: `apps/web/app/sitemap.ts`

包含内容：
- 所有静态营销页面（首页、定价、关于、联系、博客、更新日志）
- 所有博客文章
- 所有法律页面
- 所有文档页面
- 配置了 `priority` 和 `changeFrequency`

#### 6. Robots.txt ✅

文件: `apps/web/app/robots.ts`

配置：
- 允许爬取所有公开页面
- 禁止爬取: `/app/`, `/api/`, `/auth/`, `/onboarding/`, `/choose-plan/`
- 引用 sitemap.xml

#### 7. 图片优化 ✅

- 使用 Next.js Image 组件
- 配置了图片缓存 TTL (30天)
- 响应式图片尺寸
- 懒加载 (`loading="lazy"`)
- 所有图片都有 alt 属性

#### 8. HTML 语义化 ✅

- 正确使用语义标签 (`<main>`, `<section>`, `<nav>`, `<footer>`)
- 标题层级正确 (h1-h6)
- MDX 内容标题自动添加 ID 锚点

---

## AI 生图工具站 SEO 最佳实践

### 1. 关键词策略

#### 核心关键词
- AI image generator
- AI art generator
- Text to image AI
- AI image editing
- AI photo editing

#### 长尾关键词示例
- "free AI image generator online"
- "AI art generator from text"
- "convert text to image AI"
- "AI photo enhancement tool"

### 2. 内容策略

#### 博客内容建议
1. **教程类**: "如何使用 AI 生成专业产品图片"
2. **对比类**: "2024 最佳 AI 图像生成工具对比"
3. **案例类**: "AI 生图在电商中的应用案例"
4. **技术类**: "AI 图像生成技术原理解析"

#### 落地页优化
- 为每个主要功能创建专属落地页
- 包含功能描述、使用场景、示例图片
- 添加用户评价和案例展示

### 3. 技术 SEO 重点

#### Core Web Vitals 优化
```typescript
// next.config.ts 中的图片优化配置
images: {
  minimumCacheTTL: 60 * 60 * 24 * 30, // 30天缓存
  deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920, 2560, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 768, 1024],
}
```

#### 图片 SEO
- 使用描述性文件名: `ai-generated-portrait-sample.webp`
- 添加详细的 alt 文本
- 使用 WebP 格式减小文件大小
- 实现图片懒加载

### 4. 结构化数据扩展

#### 推荐添加的 Schema
```typescript
// Product Schema (如果有付费功能)
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Pixelto Pro",
  "description": "Professional AI image generation tool",
  "offers": {
    "@type": "Offer",
    "price": "10.00",
    "priceCurrency": "USD"
  }
}

// HowTo Schema (教程页面)
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to generate AI images",
  "step": [...]
}
```

---

## 新站 SEO 优化建议

### 上线前检查清单

#### 技术配置
- [ ] 设置 `NEXT_PUBLIC_SITE_URL` 环境变量
- [ ] 验证 sitemap.xml 可访问
- [ ] 验证 robots.txt 配置正确
- [ ] 检查所有页面的 canonical URL
- [ ] 测试 hreflang 标签正确性

#### 内容准备
- [ ] 每个页面都有唯一的 title 和 description
- [ ] 首页 title 包含品牌名和核心关键词
- [ ] 所有图片都有 alt 属性
- [ ] 创建 10+ 篇高质量博客文章

#### 提交与索引
- [ ] 提交 Google Search Console
- [ ] 提交 Bing Webmaster Tools
- [ ] 提交站点地图
- [ ] 设置 Google Analytics

### 上线后持续优化

#### 第一周
1. 监控 Google Search Console 索引状态
2. 修复任何爬取错误
3. 提交重要页面进行索引

#### 第一月
1. 发布 2-4 篇博客文章
2. 建立 2-3 个高质量外链
3. 监控关键词排名变化

#### 持续进行
1. 每周发布 1-2 篇博客文章
2. 监控 Core Web Vitals 指标
3. 定期更新过期内容
4. 分析用户搜索行为

---

## 维护检查清单

### 每周检查

```markdown
- [ ] Google Search Console 无新错误
- [ ] 站点地图已更新（新内容）
- [ ] 关键页面索引状态正常
- [ ] 无 404 错误
```

### 每月检查

```markdown
- [ ] Core Web Vitals 指标在合理范围
- [ ] 移动端友好性测试通过
- [ ] 结构化数据无错误
- [ ] hreflang 配置正确
- [ ] 外链质量检查
```

### 季度检查

```markdown
- [ ] 内容审计（更新过期内容）
- [ ] 关键词排名分析
- [ ] 竞品 SEO 分析
- [ ] 技术 SEO 审计
```

---

## 技术实现详解

### 1. SEO 工具函数

文件: `apps/web/modules/shared/lib/seo.ts`

```typescript
// 生成完整的 SEO 元数据
import { generateSeoMetadata } from "@shared/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });

  return generateSeoMetadata({
    title: t("title"),
    description: t("description"),
    path: "/pricing",
    locale,
  });
}
```

### 2. JSON-LD 组件

文件: `apps/web/modules/shared/components/JsonLd.tsx`

```typescript
import { JsonLd, JsonLdMultiple } from "@shared/components/JsonLd";
import {
  generateOrganizationSchema,
  generateArticleSchema,
} from "@shared/lib/seo";

// 单个 Schema
<JsonLd data={generateArticleSchema({ title, description })} />

// 多个 Schema
<JsonLdMultiple schemas={[
  generateOrganizationSchema(),
  generateSoftwareApplicationSchema(),
]} />
```

### 3. 添加新页面的 SEO

1. **使用 `generateSeoMetadata` 函数**:
```typescript
import { generateSeoMetadata } from "@shared/lib/seo";

export async function generateMetadata({ params }) {
  const { locale } = await params;

  return generateSeoMetadata({
    title: "页面标题",
    description: "页面描述",
    path: "/your-path",
    locale,
    image: "/images/your-og-image.png", // 可选
  });
}
```

2. **更新 sitemap.ts** 添加新页面:
```typescript
const staticMarketingPages = [
  // ... 现有页面
  { path: "/your-new-page", priority: 0.7, changeFrequency: "monthly" as const },
];
```

3. **添加翻译文本** 到 `packages/i18n/translations/*.json`

### 4. 环境变量配置

```bash
# .env.production
NEXT_PUBLIC_SITE_URL=https://pixelto.com
```

---

## SEO 验证工具

### 在线工具
- [Google Rich Results Test](https://search.google.com/test/rich-results) - 验证结构化数据
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) - 验证 Open Graph
- [Twitter Card Validator](https://cards-dev.twitter.com/validator) - 验证 Twitter Card
- [hreflang Tags Testing Tool](https://technicalseo.com/tools/hreflang/) - 验证多语言标签

### 命令行检查
```bash
# 检查 sitemap
curl https://pixelto.com/sitemap.xml

# 检查 robots.txt
curl https://pixelto.com/robots.txt

# 检查页面 meta 标签
curl -s https://pixelto.com | grep -E "<title>|<meta"
```

---

## 常见问题

### Q: 为什么 sitemap 中的 URL 是 localhost?
A: 确保设置了 `NEXT_PUBLIC_SITE_URL` 环境变量。

### Q: 如何为新功能页面添加 SEO?
A: 使用 `generateSeoMetadata` 函数，并更新 sitemap.ts。

### Q: hreflang 不生效怎么办?
A: 检查 `generateAlternates` 函数是否正确调用，并确保所有语言版本的页面都存在。

### Q: JSON-LD 没有被 Google 识别?
A: 使用 Google Rich Results Test 工具检查语法，确保 Schema 类型正确。

---

## 更新日志

| 日期 | 更新内容 |
|------|---------|
| 2024-12-15 | 初始版本，完整实现 SEO 优化 |
