# Pixelto 现有站点 SEO 审计与改善计划

> 本文档详细分析现有站点的 SEO 状态，并提供具体的改善方案和实施指南

---

## 目录

1. [现有页面 SEO 审计](#一现有页面-seo-审计)
2. [结构化数据详解与实施](#二结构化数据详解与实施)
3. [页面级改善清单](#三页面级改善清单)
4. [技术 SEO 检查](#四技术-seo-检查)
5. [实施优先级与路线图](#五实施优先级与路线图)

---

## 一、现有页面 SEO 审计

### 1.1 页面清单与评估

| 页面 | URL | 当前状态 | 主要问题 | 优先级 |
|------|-----|---------|---------|--------|
| 首页 | `/` | ⭐⭐⭐⭐ | FAQ 数量不足 | P1 |
| 定价页 | `/pricing` | ⭐⭐⭐ | 缺少 Product Schema | P1 |
| 关于页 | `/about` | ⭐⭐⭐ | 缺少 Organization Schema | P2 |
| 博客列表 | `/blog` | ⭐⭐⭐ | 文章数量少 | P2 |
| 联系页 | `/contact` | ⭐⭐⭐ | 缺少 LocalBusiness Schema | P3 |

### 1.2 Metadata 详细评估

#### 首页 `/`

**当前配置**：
```typescript
// packages/i18n/translations/en.json
{
  "seo": {
    "home": {
      "title": "Pixelto - Free AI Image Generator | Text to Image AI Art Creator",
      "description": "Create stunning AI-generated images from text prompts in seconds. Free AI art generator powered by premium Gemini models. No watermarks, commercial license included.",
      "keywords": "ai image generator, text to image, ai art generator, free ai image creator, ai photo generator, text to image ai, ai picture generator"
    }
  }
}
```

**评估**：
- ✅ Title 包含主关键词，长度适中（60 字符内）
- ✅ Description 包含价值主张和关键词
- ✅ 有 Organization Schema
- ✅ 有 SoftwareApplication Schema
- ⚠️ FAQ 只有 4 条，建议扩展到 6+ 条
- ⚠️ 缺少 FAQPage Schema 结构化数据

**改善建议**：
1. 扩展 FAQ 到 6-8 条
2. 添加 FAQPage Schema
3. 首屏图片添加 `priority` 属性优化 LCP

---

#### 定价页 `/pricing`

**当前配置**：
```typescript
{
  "seo": {
    "pricing": {
      "title": "Pixelto Pricing - AI Image Generator Plans & Pricing",
      "description": "Choose from free and premium AI image generation plans. Get up to 3000 images per month with 4K resolution. Start free, upgrade anytime.",
      "keywords": "ai image generator pricing, pixelto pricing, ai art generator plans, free ai image generator, ai image subscription"
    }
  }
}
```

**评估**：
- ✅ Title 包含 "pricing" 关键词
- ✅ Description 包含价格信息
- ❌ 缺少 Product Schema（重要！）
- ⚠️ 共用首页 FAQ，应有定价专属 FAQ

**改善建议**：
1. 添加 Product Schema（详见第二章）
2. 创建定价专属 FAQ（如退款政策、付款方式等）

---

#### 关于页 `/about`

**当前配置**：
```typescript
{
  "seo": {
    "about": {
      "title": "About Pixelto - AI Image Generation Platform",
      "description": "Pixelto is on a mission to democratize professional image creation with AI. Learn about our technology, team, and vision for the future of creative tools.",
      "keywords": "pixelto, ai image company, ai art platform, image generation technology"
    }
  }
}
```

**评估**：
- ✅ Title 合理
- ✅ Description 包含使命陈述
- ❌ 缺少 Organization Schema（应在关于页强化）
- ⚠️ 缺少团队信息、公司历史等 E-E-A-T 内容

**改善建议**：
1. 添加 Organization Schema
2. 补充团队介绍、公司成立时间等可信度内容

---

## 二、结构化数据详解与实施

### 2.1 什么是 Schema 结构化数据？

**Schema.org 结构化数据**是一种标准化的数据格式，帮助搜索引擎更好地理解页面内容：

```
普通 HTML              vs            结构化数据
────────────────                    ────────────────
<p>$9.99/month</p>                  {
                                      "@type": "Offer",
                                      "price": "9.99",
                                      "priceCurrency": "USD"
                                    }
```

**为什么重要**：
1. **富媒体摘要**：在搜索结果中显示价格、评分、FAQ 等
2. **更高 CTR**：富媒体结果点击率通常提升 20-30%
3. **语义理解**：帮助 Google 理解页面类型和内容

### 2.2 Product Schema（定价页缺失）

**问题说明**：定价页缺少 Product Schema，导致：
- 搜索结果无法显示价格信息
- Google 无法识别这是一个产品/服务页面

**实施方案**：

```typescript
// apps/web/modules/shared/lib/seo.ts - 新增函数

export interface ProductSchemaOptions {
  name: string;
  description: string;
  price: number;
  priceCurrency: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  billingPeriod?: "month" | "year";
}

export function generateProductSchema(options: ProductSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": options.name,
    "description": options.description,
    "brand": {
      "@type": "Brand",
      "name": "Pixelto"
    },
    "offers": {
      "@type": "Offer",
      "price": options.price.toString(),
      "priceCurrency": options.priceCurrency,
      "availability": `https://schema.org/${options.availability || "InStock"}`,
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      ...(options.billingPeriod && {
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": options.price.toString(),
          "priceCurrency": options.priceCurrency,
          "billingDuration": options.billingPeriod === "month" ? "P1M" : "P1Y"
        }
      })
    }
  };
}
```

**在定价页使用**：

```tsx
// apps/web/app/(marketing)/[locale]/pricing/page.tsx

import { JsonLdMultiple } from "@shared/components/JsonLd";
import { generateProductSchema } from "@shared/lib/seo";

// 在组件中
const productSchemas = [
  generateProductSchema({
    name: "Pixelto Pro",
    description: "Professional AI image generation with 1000 images per month",
    price: 10,
    priceCurrency: "USD",
    billingPeriod: "month"
  }),
  generateProductSchema({
    name: "Pixelto Ultra",
    description: "Ultimate AI image generation with 3000 images per month",
    price: 20,
    priceCurrency: "USD",
    billingPeriod: "month"
  })
];

return (
  <>
    <JsonLdMultiple schemas={productSchemas} />
    {/* 页面内容 */}
  </>
);
```

### 2.3 Organization Schema（关于页强化）

**问题说明**：虽然首页有 Organization Schema，但关于页应该包含更详细的组织信息。

**增强版 Organization Schema**：

```typescript
export function generateDetailedOrganizationSchema() {
  const baseUrl = getBaseUrl();
  
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Pixelto",
    "url": baseUrl,
    "logo": `${baseUrl}/images/pixelto-logo.png`,
    "description": "AI-powered image generation and editing platform. Turn text into stunning visuals in seconds.",
    "foundingDate": "2024",
    "founders": [
      {
        "@type": "Person",
        "name": "Pixelto Team"
      }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "support@pixelto.com"
    },
    "sameAs": [
      "https://x.com/pixelto",
      "https://discord.gg/z3aYM4bm"
    ]
  };
}
```

### 2.4 FAQPage Schema（首页/定价页）

**当前状态**：首页有 FAQ 组件，但缺少对应的结构化数据。

**实施方案**：

```tsx
// apps/web/app/(marketing)/[locale]/(home)/page.tsx

import { generateFAQPageSchema } from "@shared/lib/seo";

// 获取 FAQ 数据
const faqs = [
  { question: "What is Pixelto AI?", answer: "Pixelto AI is an advanced image editing platform..." },
  { question: "How does the AI editor work?", answer: "Simply upload your image and describe..." },
  // ... 更多 FAQ
];

const faqSchema = generateFAQPageSchema(faqs);

return (
  <>
    <JsonLdMultiple schemas={[...otherSchemas, faqSchema]} />
    {/* 页面内容 */}
  </>
);
```

### 2.5 Schema 类型速查表

| Schema 类型 | 适用页面 | 当前状态 | 优先级 |
|------------|---------|---------|--------|
| **Organization** | 首页、关于页 | ⚠️ 首页有，关于页无 | P1 |
| **SoftwareApplication** | 首页、工具页 | ✅ 首页已有 | - |
| **Product** | 定价页 | ❌ 缺失 | P0 |
| **FAQPage** | 首页、定价页、工具页 | ❌ 缺失 | P1 |
| **Article** | 博客文章 | ⚠️ 需检查 | P2 |
| **BreadcrumbList** | 所有子页面 | ⚠️ 需添加 | P2 |
| **HowTo** | 教程页 | 未来添加 | P3 |

---

## 三、页面级改善清单

### 3.1 首页改善

#### 任务清单

- [ ] **扩展 FAQ 内容**
  - 当前：4 条
  - 目标：6-8 条
  - 新增建议问题：
    - "Is Pixelto free to use?"
    - "Can I use AI-generated images commercially?"
    - "What AI models does Pixelto use?"
    - "How long does it take to generate an image?"

- [ ] **添加 FAQPage Schema**
  - 在 `page.tsx` 中引入 `generateFAQPageSchema`
  - 将 FAQ 数据传入生成 Schema

- [ ] **优化首屏图片 LCP**
  - 确保 Hero 区域图片使用 `priority` 属性
  - 检查图片格式是否为 WebP

- [ ] **检查图片 alt 文本**
  - 所有示例图片需要描述性 alt
  - 包含相关关键词

#### 代码改动示例

```tsx
// apps/web/app/(marketing)/[locale]/(home)/page.tsx

// 添加 FAQ Schema
const faqData = [
  { question: t("home.faq.q1.question"), answer: t("home.faq.q1.answer") },
  { question: t("home.faq.q2.question"), answer: t("home.faq.q2.answer") },
  // ... 更多
];

const schemas = [
  generateOrganizationSchema(),
  generateSoftwareApplicationSchema(),
  generateFAQPageSchema(faqData.map(f => ({
    question: f.question,
    answer: f.answer
  })))
];
```

---

### 3.2 定价页改善

#### 任务清单

- [ ] **添加 Product Schema**
  - 为每个付费套餐添加 Product Schema
  - 包含价格、货币、计费周期

- [ ] **添加定价专属 FAQ**
  - "What payment methods do you accept?"
  - "Can I cancel my subscription anytime?"
  - "Is there a refund policy?"
  - "Do you offer team or enterprise plans?"
  - "What happens when I run out of credits?"
  - "Can I upgrade or downgrade my plan?"

- [ ] **添加 FAQPage Schema**

#### 代码改动示例

```tsx
// apps/web/app/(marketing)/[locale]/pricing/page.tsx

const productSchemas = config.payments.plans.pro.prices
  .filter(p => p.interval === 'month')
  .map(price => generateProductSchema({
    name: `Pixelto Pro`,
    description: "Professional AI image generation plan",
    price: price.amount,
    priceCurrency: price.currency,
    billingPeriod: price.interval
  }));

// 加上 Ultra 套餐...
```

---

### 3.3 关于页改善

#### 任务清单

- [ ] **添加详细 Organization Schema**
  - 包含联系方式
  - 包含社交媒体链接
  - 包含成立日期

- [ ] **补充 E-E-A-T 内容**
  - 团队介绍（可匿名描述团队背景）
  - 公司使命和愿景
  - 技术能力说明

---

### 3.4 博客改善

#### 任务清单

- [ ] **增加博客文章数量**
  - 当前：2 篇示例文章
  - 目标：10+ 篇高质量文章

- [ ] **文章主题建议**
  - How to Write Better AI Image Prompts
  - AI Image Generation Styles Guide
  - Negative Prompts Explained
  - AI Art for Commercial Use: What You Need to Know
  - Pixelto vs [Competitor] Comparison

- [ ] **确保文章有 Article Schema**

- [ ] **添加作者信息增加 E-E-A-T**

---

## 四、技术 SEO 检查

### 4.1 当前技术 SEO 状态

| 检查项 | 状态 | 备注 |
|-------|------|------|
| robots.txt | ⚠️ 需检查 | 确认配置正确 |
| sitemap.xml | ✅ 已配置 | `apps/web/app/sitemap.ts` |
| Canonical URL | ✅ 自动生成 | `@shared/lib/seo.ts` |
| hreflang | ✅ 自动生成 | 支持 en/de/zh |
| HTTPS | ✅ | - |
| Mobile Friendly | ⚠️ 需测试 | 使用 Google 工具验证 |

### 4.2 Sitemap 改进建议

当前 sitemap 配置：

```typescript
// apps/web/app/sitemap.ts
const staticMarketingPages = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "weekly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.8, changeFrequency: "daily" },
];
```

**改进建议**：
- 未来添加 `/tools/` 页面时，优先级设为 0.9
- 未来添加 `/prompts/` 页面时，优先级设为 0.8
- 确保新页面及时添加到 sitemap

### 4.3 待检查项

```bash
# 检查 robots.txt
curl https://pixelto.com/robots.txt

# 检查 sitemap
curl https://pixelto.com/sitemap.xml

# 验证结构化数据
# 使用 https://search.google.com/test/rich-results

# 验证移动端友好性
# 使用 https://search.google.com/test/mobile-friendly

# 检查 Core Web Vitals
# 使用 https://pagespeed.web.dev/
```

---

## 五、实施优先级与路线图

### 5.1 优先级矩阵

| 任务 | 影响 | 工作量 | 优先级 |
|------|------|--------|--------|
| 定价页添加 Product Schema | 高 | 低 | **P0** |
| 首页添加 FAQPage Schema | 高 | 低 | **P0** |
| 扩展首页 FAQ 到 6+ 条 | 中 | 低 | **P1** |
| 关于页添加 Organization Schema | 中 | 低 | **P1** |
| 定价页添加专属 FAQ | 中 | 中 | **P1** |
| 检查所有图片 alt 文本 | 中 | 中 | **P2** |
| 增加博客文章数量 | 高 | 高 | **P2** |
| 添加 BreadcrumbList Schema | 低 | 中 | **P3** |

### 5.2 实施路线图

#### Week 1：结构化数据补全

- [ ] Day 1-2: 在 `seo.ts` 中添加 `generateProductSchema` 函数
- [ ] Day 2-3: 定价页实施 Product Schema
- [ ] Day 3-4: 首页实施 FAQPage Schema
- [ ] Day 4-5: 关于页实施详细 Organization Schema
- [ ] Day 5: 使用 Rich Results Test 验证所有 Schema

#### Week 2：内容优化

- [ ] Day 1-2: 扩展首页 FAQ（翻译三种语言）
- [ ] Day 2-3: 创建定价页专属 FAQ（翻译三种语言）
- [ ] Day 3-5: 审核所有页面图片 alt 文本

#### Week 3-4：博客内容

- [ ] 撰写 4-6 篇 SEO 导向的博客文章
- [ ] 确保文章有正确的 Article Schema
- [ ] 建立内链结构

---

## 六、验证清单

### 发布前验证

```markdown
- [ ] Rich Results Test 通过（无错误）
- [ ] Mobile-Friendly Test 通过
- [ ] PageSpeed Insights 评分 > 80
- [ ] 所有页面 title 唯一
- [ ] 所有页面有 canonical URL
- [ ] hreflang 配置正确
- [ ] sitemap 包含所有公开页面
- [ ] 图片均有 alt 文本
```

### GSC 监测

发布后在 Google Search Console 监测：
- 索引状态
- 富媒体结果覆盖
- 结构化数据错误

---

## 更新日志

| 日期 | 更新内容 |
|------|----------|
| 2024-12-16 | 初始版本，完成现有站点 SEO 审计 |
