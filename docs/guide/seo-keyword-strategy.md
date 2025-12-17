# Pixelto 关键词策略与页面扩展指南

> 本文档解答 AI 工具站如何扩展关键词覆盖、理解搜索引擎关键词匹配机制，以及规划新页面的 SEO 策略

---

## 目录

1. [关键词核心概念与 Google 匹配机制](#一关键词核心概念与-google-匹配机制)
2. [工具站如何扩展关键词覆盖](#二工具站如何扩展关键词覆盖)
3. [从 Semrush 到页面落地：完整流程](#三从-semrush-到页面落地完整流程)
4. [竞品分析：他们如何收录数百上千关键词](#四竞品分析他们如何收录数百上千关键词)
5. [Tools 页面扩展规划](#五tools-页面扩展规划)
6. [Image Prompts 页面规划](#六image-prompts-页面规划)
7. [SEO 价值评估与优先级](#七seo-价值评估与优先级)

---

## 一、关键词核心概念与 Google 匹配机制

### 1.1 Google 如何匹配关键词到站点

Google 的关键词匹配是一个**多维度语义理解系统**，远超简单的字符串匹配：

```
用户搜索 → 意图理解 → 语义索引匹配 → 内容质量评分 → 排名展示
```

#### 匹配维度解析

| 匹配维度 | 权重 | 说明 |
|---------|------|------|
| **Title Tag** | ⭐⭐⭐⭐⭐ | 最重要的 on-page 因素，必须包含主关键词 |
| **H1 标签** | ⭐⭐⭐⭐ | 页面主题的第二确认信号 |
| **Meta Description** | ⭐⭐ | 不直接影响排名，但影响 CTR |
| **URL 路径** | ⭐⭐⭐⭐ | `/ai-wallpaper-generator/` 优于 `/tool123/` |
| **正文内容** | ⭐⭐⭐⭐⭐ | 语义相关性、关键词密度（自然）、内容深度 |
| **内链锚文本** | ⭐⭐⭐ | 其他页面如何描述这个页面 |
| **外链锚文本** | ⭐⭐⭐⭐ | 外部网站如何引用你 |
| **用户行为** | ⭐⭐⭐⭐ | 点击率、停留时间、跳出率 |

### 1.2 关键词不仅仅是 Metadata

**常见误区**：关键词只需要写在 title 和 description 中

**正确理解**：关键词需要**全方位自然融入**页面内容

```
页面关键词布局（以 "ai wallpaper generator 4k" 为例）

1. Title: AI Wallpaper Generator 4K | Free HD Desktop Wallpaper Creator
2. URL: /tools/ai-wallpaper-generator-4k/
3. H1: AI Wallpaper Generator 4K
4. 首段: Create stunning 4K wallpapers with our AI wallpaper generator...
5. H2: How to Generate 4K Wallpapers with AI
6. 正文: 自然融入 "4k wallpaper", "ai wallpaper", "desktop wallpaper" 等变体
7. 图片 alt: "ai generated 4k wallpaper example - mountain landscape"
8. FAQ: "What resolution does the AI wallpaper generator support?"
9. 内链: 从其他页面链接过来使用锚文本 "4K wallpaper generator"
```

### 1.3 语义搜索与 LSI 关键词

Google 使用 **LSI (Latent Semantic Indexing)** 理解页面主题：

```
主关键词: "ai wallpaper generator"

LSI 相关词（应自然出现在内容中）:
- desktop background
- screen resolution
- 4k, 1080p, 2k
- aesthetic, minimal, abstract
- download, export, save
- text to image
- custom wallpaper
- AI art, AI generated
```

**实践建议**：每个工具页面应包含 800-1200 词的内容，自然覆盖主关键词及其语义相关词。

---

## 二、工具站如何扩展关键词覆盖

### 2.1 单页面能承载的关键词有限

**问题核实**：首页作为综合型页面，确实只能承载少量核心关键词（3-5 个）

**解决方案**：通过 **Topic Cluster（主题集群）** 架构扩展

```
                    ┌─────────────────────┐
                    │    首页 (Pillar)    │
                    │  ai image generator │
                    │  ai art generator   │
                    └─────────┬───────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│   /tools/     │     │   /prompts/   │     │   /learn/     │
│   工具集群    │     │   提示词集群  │     │   教程集群    │
└───────┬───────┘     └───────┬───────┘     └───────┬───────┘
        │                     │                     │
   ┌────┴────┐           ┌────┴────┐           ┌────┴────┐
   ▼         ▼           ▼         ▼           ▼         ▼
wallpaper  avatar    anime     portrait   how-to   best-of
poster     logo      fantasy   product    tips     compare
```

### 2.2 关键词扩展的六大策略

#### 策略 1：垂直细分工具页面

将通用功能拆分为特定用途的独立页面：

| 通用功能 | 细分页面（每个独立 URL） |
|---------|-------------------------|
| AI Image Generator | `/tools/wallpaper-generator/` |
| | `/tools/avatar-generator/` |
| | `/tools/poster-generator/` |
| | `/tools/logo-generator/` |
| | `/tools/thumbnail-generator/` |

每个细分页面可承载 **10-20 个长尾关键词**。

#### 策略 2：风格/场景细分

将每个工具按风格、分辨率、用途进一步细分为子页面：

```
/tools/wallpaper-generator/          → 支柱页（主词）
├── /tools/wallpaper-generator/4k/   → 4k wallpaper ai generator
├── /tools/wallpaper-generator/anime/ → anime wallpaper ai generator
├── /tools/wallpaper-generator/minimal/ → minimalist wallpaper ai
└── /tools/wallpaper-generator/aesthetic/ → aesthetic wallpaper ai
```

**细分维度参考表**：

| 工具 | 风格细分 | 分辨率细分 | 场景细分 |
|------|---------|-----------|---------|
| Wallpaper | anime, minimal, abstract, nature | 4k, 1080p, mobile | desktop, phone, tablet |
| Avatar | cartoon, realistic, pixel, 3d | HD, standard | gaming, social, professional |
| Poster | minimalist, retro, modern, vintage | A4, A3, square | event, movie, music |

**页面内容差异化**：
- 每个子页面需要**独特的示例图**（3-6 张）
- 提供该风格**专属的 Prompt 模板**
- FAQ 针对该细分场景定制
- 内链指向父页面（支柱页）和兄弟页面

**关键词承载示例**（以 anime wallpaper 为例）：

| 主关键词 | LSI 相关词 |
|---------|-----------|
| anime wallpaper ai generator | anime desktop background |
| ai anime wallpaper maker | manga style wallpaper |
| generate anime wallpaper | kawaii wallpaper ai |
| | anime aesthetic background |

---

#### 策略 3：Prompt Gallery（提示词库）

创建可被搜索索引的提示词展示页，这是**关键词增长的核心引擎**：

```
/prompts/                           → 提示词库首页
├── /prompts/anime/                 → anime ai art prompts
├── /prompts/portrait/              → portrait ai prompts
├── /prompts/landscape/             → landscape ai art prompts
└── /prompts/[style]/[prompt-slug]/ → 单个 prompt 详情页
```

**Prompt 库三层架构**：

```
第一层：/prompts/（集合页）
├── 搜索框 + 分类筛选
├── 热门 Prompt 展示
├── 分类入口卡片
└── FAQ：通用提示词问题

第二层：/prompts/[category]/（分类页）
├── 分类介绍（200-300 词）
├── Prompt 卡片网格
├── 子分类筛选（如 anime → kawaii, cyberpunk, ghibli）
└── FAQ：该分类专属问题

第三层：/prompts/[category]/[slug]/（详情页，可选）
├── 高清生成结果图
├── 完整 Prompt + 负面 Prompt
├── 参数建议（宽高比、模型）
├── "Try This Prompt" 按钮
└── 相关 Prompt 推荐
```

**Prompt 数据结构**：

```typescript
interface Prompt {
  id: string;
  slug: string;                    // URL 友好标识
  title: string;                   // SEO 标题
  prompt: string;                  // 正向提示词
  negativePrompt?: string;         // 负向提示词
  category: string;                // 主分类
  subcategory?: string;            // 子分类
  tags: string[];                  // 标签
  style: string;                   // 风格
  aspectRatio: "1:1" | "16:9" | "9:16" | "4:3";
  imageUrl: string;                // 生成结果
  thumbnailUrl: string;            // 缩略图
  model?: string;                  // 推荐模型
  difficulty: "beginner" | "intermediate" | "advanced";
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: Date;
  featured?: boolean;              // 是否精选
}
```

**关键词承载策略**：

| 页面层级 | 目标关键词类型 | 示例 |
|---------|--------------|------|
| 集合页 | 宽泛词 | ai art prompts, ai image prompts |
| 分类页 | 风格词 | anime ai prompts, portrait prompts for ai |
| 详情页 | 超长尾词 | cyberpunk girl neon city prompt |

**SEO 价值**：
- 每个 Prompt 详情页可承载 "how to write prompts for X" 类关键词
- 分类页可排名 "[style] ai prompts" 关键词
- 用户停留时间长，有利于行为信号

---

#### 策略 4：教程/指南页面

教程页面承载 **Informational Intent（信息意图）** 关键词，是引流的重要渠道：

```
/learn/                             
├── /learn/how-to-write-ai-prompts/     → how to write ai prompts
├── /learn/negative-prompts-guide/      → negative prompts for ai
├── /learn/best-ai-image-styles/        → best ai image styles
└── /learn/ai-art-tips/                 → ai art generation tips
```

**教程页面分类**：

| 类型 | 内容方向 | 关键词示例 | 内容长度 |
|------|---------|-----------|---------|
| **How-to 教程** | 操作步骤指南 | how to generate ai wallpaper | 1200-2000 词 |
| **概念解释** | 术语/技术说明 | what is negative prompt | 800-1200 词 |
| **Best-of 列表** | 推荐/排名列表 | best ai art styles 2024 | 1500-2500 词 |
| **对比指南** | 差异对比 | flux vs stable diffusion | 1500-2000 词 |

**教程页面结构模板**：

```markdown
# [H1: 包含主关键词]

[导语：100-150 词，包含关键词变体]

## Table of Contents（自动生成）

## What is [概念]? （定义段，争取 Featured Snippet）

[简短定义，2-3 句话]

## Why [动作/概念] Matters

[价值说明，200-300 词]

## Step-by-Step Guide / How to [动作]

### Step 1: [步骤名]
[详细说明 + 截图/示例]

### Step 2: [步骤名]
...

## Best Practices / Tips

- **Tip 1**: [具体建议]
- **Tip 2**: [具体建议]
...

## Examples

[3-6 个示例，带图片和 Prompt]

## FAQ

### [问题 1]?
[回答]

### [问题 2]?
[回答]

## Related Articles

- [相关教程 1]
- [相关教程 2]

## Try It Yourself

[CTA 按钮链接到相关工具]
```

**内链策略**：
- 教程中提及的功能 → 链接到对应工具页
- 提及的风格/Prompt → 链接到 Prompt 库
- 相关教程 → 互相链接形成 Topic Cluster

---

#### 策略 5：对比/评测页面

对比页面承载 **Commercial Intent（商业意图）** 关键词，转化潜力高：

```
/compare/
├── /compare/pixelto-vs-midjourney/
├── /compare/best-ai-image-generators-2024/
└── /compare/free-ai-art-generators/
```

**对比页面类型**：

| 类型 | URL 模式 | 关键词模式 | 示例 |
|------|---------|-----------|------|
| **1v1 对比** | /compare/[a]-vs-[b]/ | [A] vs [B] | pixelto vs midjourney |
| **多产品对比** | /compare/best-[category]-[year]/ | best [category] [year] | best ai image generators 2024 |
| **特定属性** | /compare/free-[category]/ | free [category] | free ai art generators |

**1v1 对比页结构**：

```markdown
# Pixelto vs Midjourney: [年份] Comparison

[导语：简述两者定位差异]

## Quick Comparison Table

| Feature | Pixelto | Midjourney |
|---------|---------|------------|
| Pricing | Free tier + $10/mo | $10/mo minimum |
| Image Quality | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Ease of Use | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Speed | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
...

## Detailed Feature Comparison

### Pricing Breakdown
[详细对比价格]

### Image Quality
[样图对比]

### User Interface
[截图对比]

## Who Should Choose [A]?

[适用人群描述]

## Who Should Choose [B]?

[适用人群描述]

## Our Verdict

[结论和推荐]

## FAQ

### Is [A] better than [B]?
### Can I use [A] for free?
...
```

**最佳列表页结构**：

```markdown
# 10 Best AI Image Generators in 2024

[导语 + 评选标准说明]

## Quick Picks

| Rank | Tool | Best For | Price |
|------|------|----------|-------|
| 1 | Pixelto | Free users | Free |
| 2 | Midjourney | Artists | $10/mo |
...

## 1. Pixelto - Best Free AI Image Generator

[详细介绍 300-500 词]

### Pros
- [优点 1]
- [优点 2]

### Cons
- [缺点 1]

### Pricing
[价格信息]

## 2. [下一个工具]
...

## How We Tested

[评测方法论，增加可信度]

## FAQ

## Conclusion
```

---

#### 策略 6：用户生成内容（UGC）

UGC 是**长期关键词增长的飞轮**，通过用户内容自动扩展可索引页面：

```
/gallery/                           → 用户作品展示
├── /gallery/[username]/            → 用户个人页
└── /gallery/featured/              → 精选作品
```

**UGC 架构设计**：

```
/gallery/                          → 作品集合页
├── /gallery/featured/             → 精选作品（编辑推荐）
├── /gallery/popular/              → 热门作品（按点赞排序）
├── /gallery/recent/               → 最新作品
├── /gallery/[username]/           → 用户个人页
│   ├── 用户信息
│   ├── 作品列表
│   └── 统计数据
└── /gallery/[username]/[work-id]/ → 作品详情页（可选）
```

**SEO 价值分析**：

| 页面类型 | 可索引性 | 关键词潜力 | 实现优先级 |
|---------|---------|-----------|-----------|
| 精选页 | ✅ 高 | 中 | P1 |
| 用户个人页 | ⚠️ 需评估 | 低 | P3 |
| 作品详情页 | ✅ 高 | 高（长尾） | P2 |

**作品详情页 SEO 优化**：

```typescript
// 动态生成 SEO metadata
function generateWorkMetadata(work: UserWork): Metadata {
  return {
    title: `${work.title} | AI Art by ${work.username}`,
    description: `${work.prompt.slice(0, 150)}... Created with Pixelto AI.`,
    openGraph: {
      images: [work.imageUrl],
    },
  };
}
```

**UGC SEO 注意事项**：

1. **质量控制**：只索引高质量作品，避免稀释域名权重
2. **noindex 策略**：低质量/重复内容页面设置 noindex
3. **规范 URL**：确保每个作品有唯一 canonical URL
4. **用户隐私**：允许用户选择是否公开作品

**实现路线图**：

| 阶段 | 功能 | SEO 考量 |
|------|------|---------|
| Phase 1 | 精选作品展示（运营手动筛选） | 确保高质量，全部索引 |
| Phase 2 | 用户个人页（基础版） | 有作品的用户页面索引 |
| Phase 3 | 作品详情页 + 社区功能 | 点赞/评论增加停留时间 |
| Phase 4 | 用户提交 Prompt 到 Prompt 库 | UGC 反哺内容库 |

### 2.3 关键词数量与页面数量关系

**核心公式**：
```
可覆盖关键词数 ≈ 页面数量 × 单页平均关键词承载量（5-15）
```

| 页面类型 | 数量 | 平均关键词/页 | 预估覆盖 |
|---------|------|---------------|---------|
| 工具页面 | 20 | 10 | 200 |
| 提示词页面 | 100 | 5 | 500 |
| 教程页面 | 30 | 8 | 240 |
| 对比页面 | 10 | 12 | 120 |
| **总计** | **160** | - | **1060** |

---

## 三、从 Semrush 到页面落地：完整流程

### 3.1 发现高潜力关键词

在 Semrush 中找到关键词后，评估其价值：

```
关键词: "ai background remover free"
- Volume: 480
- KD%: 32
- Intent: Commercial
- SERP Features: Image Pack ✓, PAA ✓
- Trend: ↑ 上升趋势

评估: ✅ 符合甜区标准，值得创建专属页面
```

### 3.2 关键词整合决策树

```
                    ┌─────────────────────────┐
                    │ 发现潜力关键词          │
                    └───────────┬─────────────┘
                                │
                    ┌───────────▼─────────────┐
                    │ Volume >= 50?           │
                    └───────────┬─────────────┘
                         Yes    │     No → 作为 LSI 词融入已有页面
                    ┌───────────▼─────────────┐
                    │ KD <= 40?               │
                    └───────────┬─────────────┘
                         Yes    │     No → 放入次级池，后期攻占
                    ┌───────────▼─────────────┐
                    │ 是否有现成相关页面?      │
                    └───────────┬─────────────┘
                         │
              ┌──────────┴──────────┐
              Yes                   No
              │                     │
              ▼                     ▼
    ┌─────────────────┐   ┌─────────────────┐
    │ 优化现有页面    │   │ 创建新页面      │
    │ - 更新 Title   │   │ - 设计 URL     │
    │ - 添加 FAQ     │   │ - 撰写内容     │
    │ - 补充内容     │   │ - 添加工具功能  │
    └─────────────────┘   └─────────────────┘
```

### 3.3 新页面创建清单

以 "ai background remover" 为例：

```markdown
## 页面规划检查清单

### URL 设计
- [x] 包含主关键词: /tools/ai-background-remover/
- [x] 简洁可读
- [x] 使用小写和连字符

### Metadata
- [x] Title (50-60字符): AI Background Remover | Free Remove Background Online
- [x] Description (150-160字符): Remove image backgrounds instantly with AI...
- [x] Keywords: ai background remover, remove background free, background eraser ai

### 页面内容
- [x] H1 包含主关键词
- [x] 正文 800-1200 词
- [x] 3-6 张示例图片（带 alt 文本）
- [x] 6+ 可复制的 Prompt 模板
- [x] 6+ FAQ 问答
- [x] 内链到相关工具页

### 结构化数据
- [x] FAQPage Schema
- [x] SoftwareApplication Schema
- [x] BreadcrumbList Schema

### 内链建设
- [x] 从首页链接
- [x] 从 /tools/ 集合页链接
- [x] 从相关教程页链接
- [x] 在 sitemap 中添加
```

---

## 四、竞品分析：他们如何收录数百上千关键词

### 4.1 案例分析：leonardo.ai

**收录关键词数**: 50,000+（估计）

**策略拆解**：

| 策略 | 实现方式 | 关键词贡献 |
|------|---------|-----------|
| 工具细分 | 20+ 独立工具页面 | ~300 |
| 风格库 | 100+ 风格预设页 | ~1,000 |
| Prompt 库 | 10,000+ prompt 页面 | ~30,000 |
| 教程/博客 | 200+ 文章 | ~2,000 |
| 用户画廊 | 用户生成内容 | ~15,000 |

### 4.2 可复用策略

**Phase 1（1-3 个月）**: 工具页面矩阵
- 创建 15-20 个细分工具页面
- 预估覆盖: 200-400 关键词

**Phase 2（3-6 个月）**: Prompt 库
- 创建 200+ prompt 页面
- 预估覆盖: 500-1,000 关键词

**Phase 3（6-12 个月）**: 内容营销
- 50+ 教程文章
- 20+ 对比评测
- 预估覆盖: 500-800 关键词

### 4.3 关键词增长飞轮

```
创建优质内容 → Google 收录 → 获得排名 → 获得外链
      ↑                                    │
      └──────────── 权重提升 ←─────────────┘
```

---

## 五、Tools 页面扩展规划

### 5.1 计划扩展的工具 SEO 分析

#### Tool 1: Expand Image（图像扩展/外绘）

**关键词研究**：

| 关键词 | Volume | KD | Intent | 价值评估 |
|--------|--------|-----|--------|---------|
| ai image extender | 320 | 28 | C | ⭐⭐⭐⭐⭐ |
| ai outpainting | 260 | 25 | C | ⭐⭐⭐⭐⭐ |
| extend image ai | 210 | 30 | C | ⭐⭐⭐⭐ |
| uncrop image ai | 170 | 22 | C | ⭐⭐⭐⭐ |
| expand image ai free | 140 | 18 | T | ⭐⭐⭐⭐ |

**URL 建议**: `/tools/expand-image/` 或 `/tools/ai-outpainting/`

**页面结构**：
```
H1: AI Image Extender | Expand & Uncrop Images Online Free
├── 工具交互区（上传 → 选择扩展方向 → 生成）
├── 示例展示（before/after）
├── 使用场景说明
├── Prompt 模板区
├── FAQ（6+）
└── 相关工具推荐
```

**SEO 价值**: ⭐⭐⭐⭐⭐（搜索量适中，竞争低，与 AI 图像编辑高度相关）

---

#### Tool 2: Remove Background（背景移除）

**关键词研究**：

| 关键词 | Volume | KD | Intent | 价值评估 |
|--------|--------|-----|--------|---------|
| ai background remover | 2,400 | 45 | C | ⭐⭐⭐⭐ |
| remove background free | 5,200 | 52 | T | ⭐⭐⭐ |
| background eraser ai | 480 | 32 | C | ⭐⭐⭐⭐⭐ |
| transparent background maker | 390 | 28 | C | ⭐⭐⭐⭐⭐ |

**URL 建议**: `/tools/remove-background/`

**注意**: 此领域竞争激烈（remove.bg 等），建议差异化定位：
- 结合 AI 替换背景（不只是移除）
- 突出"AI 智能识别主体"
- 批量处理能力

**SEO 价值**: ⭐⭐⭐⭐（流量潜力大，但需差异化竞争）

---

#### Tool 3: Image to Prompt（图像反推提示词）

**关键词研究**：

| 关键词 | Volume | KD | Intent | 价值评估 |
|--------|--------|-----|--------|---------|
| image to prompt | 880 | 35 | C | ⭐⭐⭐⭐⭐ |
| reverse image prompt | 260 | 22 | C | ⭐⭐⭐⭐⭐ |
| ai prompt generator from image | 170 | 18 | C | ⭐⭐⭐⭐⭐ |
| describe image for ai | 140 | 20 | I | ⭐⭐⭐⭐ |

**URL 建议**: `/tools/image-to-prompt/`

**独特价值**：
- 帮助用户学习如何描述图像
- 可与 Prompt 库联动
- 教育性质强，易获得分享

**SEO 价值**: ⭐⭐⭐⭐⭐（需求增长快，竞争较低，与核心功能高度协同）

---

#### Tool 4: AI GIF Generator（AI GIF 生成）

**关键词研究**：

| 关键词 | Volume | KD | Intent | 价值评估 |
|--------|--------|-----|--------|---------|
| ai gif generator | 1,200 | 38 | C | ⭐⭐⭐⭐ |
| text to gif ai | 320 | 25 | C | ⭐⭐⭐⭐⭐ |
| ai animation generator | 480 | 35 | C | ⭐⭐⭐⭐ |
| animated ai art | 260 | 28 | C | ⭐⭐⭐⭐ |

**URL 建议**: `/tools/ai-gif-generator/`

**技术实现思路**：
1. 生成多帧一致性图像（同一 seed，轻微变化）
2. 合成为 GIF 动画
3. 支持调整帧率、循环方式

**SEO 价值**: ⭐⭐⭐⭐（独特功能，社交传播性强）

---

### 5.2 Tools 页面架构建议

```
/tools/                              → 工具集合页（重要！）
├── /tools/expand-image/             → 图像扩展
├── /tools/remove-background/        → 背景移除
├── /tools/image-to-prompt/          → 图像反推提示词
├── /tools/ai-gif-generator/         → AI GIF 生成
├── /tools/wallpaper-generator/      → 壁纸生成（未来）
├── /tools/avatar-generator/         → 头像生成（未来）
└── /tools/poster-generator/         → 海报生成（未来）
```

### 5.3 Tools 集合页 SEO 策略

`/tools/` 集合页本身也是重要的 SEO 资产：

```markdown
Title: Free AI Image Tools | Online AI Photo Editor & Generator
H1: AI Image Tools
描述: Explore our collection of AI-powered image tools...

内容结构:
1. 工具卡片网格（每个工具一张卡片）
2. 工具分类导航（Generator / Editor / Utility）
3. 工具对比表格
4. FAQ：常见问题
5. 内链：每个工具详情页
```

---

## 六、Image Prompts 页面规划

### 6.1 SEO 价值分析

**目标关键词群**：

| 关键词 | Volume | KD | Intent | 页面类型 |
|--------|--------|-----|--------|---------|
| ai art prompts | 2,900 | 42 | I | 集合页 |
| ai image prompts | 1,300 | 35 | I | 集合页 |
| anime ai prompts | 590 | 28 | I | 分类页 |
| portrait ai prompts | 320 | 22 | I | 分类页 |
| landscape ai prompts | 260 | 20 | I | 分类页 |
| midjourney prompts | 4,400 | 55 | I | 参考（高竞争） |
| stable diffusion prompts | 2,200 | 48 | I | 参考 |

**SEO 价值评估**: ⭐⭐⭐⭐⭐

理由：
1. **搜索量可观**：累计月搜索量 10,000+
2. **长尾潜力巨大**：每个具体 prompt 都是独立索引机会
3. **用户粘性高**：Prompt 库是复用资源
4. **内链枢纽**：可链接到所有工具页
5. **UGC 潜力**：未来可开放用户提交

### 6.2 页面架构设计

```
/prompts/                           → Prompt 库首页（主词）
├── /prompts/anime/                 → 动漫风格 prompts
├── /prompts/portrait/              → 人像 prompts
├── /prompts/landscape/             → 风景 prompts
├── /prompts/product/               → 产品图 prompts
├── /prompts/fantasy/               → 奇幻 prompts
├── /prompts/realistic/             → 写实 prompts
├── /prompts/abstract/              → 抽象 prompts
├── /prompts/3d/                    → 3D 风格 prompts
└── /prompts/[category]/[slug]/     → 单个 prompt 详情页（可选）
```

### 6.3 Prompts 集合页设计

```
/prompts/ 页面结构:

┌─────────────────────────────────────────────────────┐
│ H1: AI Image Prompts Library                        │
│ Subtitle: 500+ curated prompts for stunning AI art  │
├─────────────────────────────────────────────────────┤
│ [搜索框] [分类筛选: All | Anime | Portrait | ...]  │
├─────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│ │ 示例图  │ │ 示例图  │ │ 示例图  │ │ 示例图  │    │
│ │ Prompt  │ │ Prompt  │ │ Prompt  │ │ Prompt  │    │
│ │ [Copy]  │ │ [Copy]  │ │ [Copy]  │ │ [Copy]  │    │
│ │ [Try]   │ │ [Try]   │ │ [Try]   │ │ [Try]   │    │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
│                    ...more...                       │
├─────────────────────────────────────────────────────┤
│ Pagination / Infinite Scroll                        │
├─────────────────────────────────────────────────────┤
│ FAQ Section (6+ questions)                          │
├─────────────────────────────────────────────────────┤
│ Related: /tools/ | /learn/how-to-write-prompts/    │
└─────────────────────────────────────────────────────┘
```

### 6.4 Prompt 数据结构

```typescript
interface PromptItem {
  id: string;
  slug: string;
  prompt: string;           // 完整提示词
  negativePrompt?: string;  // 负面提示词
  category: string;         // 分类
  tags: string[];           // 标签
  style: string;            // 风格
  imageUrl: string;         // 生成结果图
  thumbnailUrl: string;     // 缩略图
  aspectRatio: string;      // 宽高比
  model?: string;           // 使用的模型
  likes?: number;           // 点赞数（未来）
  createdAt: Date;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}
```

### 6.5 SEO 最佳实践

#### 分类页 SEO

```markdown
/prompts/anime/ 页面

Title: Anime AI Art Prompts | 100+ Free Anime Style Prompts for AI
H1: Anime AI Art Prompts
Description: Discover 100+ curated anime-style prompts for AI image generators. Create stunning anime characters, scenes, and artwork with ready-to-use prompts.

内容元素:
- 分类介绍（200-300 词）
- Prompt 卡片网格
- 筛选：子风格（kawaii, cyberpunk, ghibli-style 等）
- FAQ（针对动漫生成的问题）
- 相关分类推荐
```

#### 单个 Prompt 详情页（可选，后期）

```markdown
/prompts/anime/cyberpunk-girl-neon-city/

Title: Cyberpunk Girl in Neon City | Anime AI Prompt
H1: Cyberpunk Girl in Neon City

内容:
- 高清示例图
- 完整 Prompt（可复制）
- 负面 Prompt
- 参数说明（宽高比、模型建议）
- "Try This Prompt" 按钮 → 跳转编辑器
- 相关 Prompts 推荐
- 评论/社区反馈（未来）
```

### 6.6 技术实现建议

```typescript
// Prompt 数据可以存储为 JSON 文件或 MDX
// 初期推荐使用静态 JSON + ISR

// /data/prompts/anime.json
[
  {
    "id": "anime-001",
    "slug": "cyberpunk-girl-neon-city",
    "prompt": "anime girl, cyberpunk style, neon city background, glowing eyes, futuristic outfit, rain, reflections, high detail, 4k",
    "negativePrompt": "low quality, blurry, deformed",
    "category": "anime",
    "tags": ["cyberpunk", "girl", "neon", "city", "futuristic"],
    "imageUrl": "/images/prompts/anime/cyberpunk-girl.webp"
  }
]

// 使用 generateStaticParams 生成静态路由
export async function generateStaticParams() {
  const prompts = await getPromptsByCategory('anime');
  return prompts.map(p => ({ category: 'anime', slug: p.slug }));
}
```

---

## 七、SEO 价值评估与优先级

### 7.1 综合评估矩阵

| 页面/功能 | SEO 价值 | 产品价值 | 开发成本 | 优先级 |
|----------|---------|---------|---------|--------|
| /tools/ 集合页 | ⭐⭐⭐⭐ | ⭐⭐⭐ | 低 | **P0** |
| Image to Prompt | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 中 | **P0** |
| Expand Image | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 中 | **P0** |
| /prompts/ 集合页 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 中 | **P1** |
| Remove Background | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 中 | **P1** |
| AI GIF Generator | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 高 | **P2** |
| Prompt 分类页 | ⭐⭐⭐⭐ | ⭐⭐⭐ | 低 | **P1** |
| Prompt 详情页 | ⭐⭐⭐ | ⭐⭐⭐ | 中 | **P2** |

### 7.2 实施路线图

```
Phase 1 (Week 1-2): 基础架构
├── 创建 /tools/ 集合页框架
├── 设计统一的工具页模板
└── 建立 Prompt 数据结构

Phase 2 (Week 3-4): 首批工具
├── 上线 Expand Image
├── 上线 Image to Prompt
└── 完善工具页 SEO 元素

Phase 3 (Week 5-6): Prompt 库 MVP
├── 上线 /prompts/ 集合页
├── 创建 5 个分类页
├── 录入 100+ 初始 prompts
└── 实现筛选和搜索功能

Phase 4 (Week 7-8): 扩展与优化
├── 上线 Remove Background
├── 扩展 Prompt 库至 300+
├── 添加 FAQ Schema
└── 提交 sitemap，监测收录

Phase 5 (Week 9-12): 迭代
├── AI GIF Generator（如技术可行）
├── Prompt 详情页（可选）
├── 根据 GSC 数据优化
└── 建立内容更新机制
```

### 7.3 预期 SEO 收益

| 时间点 | 预计收录页数 | 预计覆盖关键词 | 预计月自然流量 |
|-------|-------------|---------------|---------------|
| Month 1 | 10-15 | 50-100 | 100-300 |
| Month 3 | 30-50 | 200-400 | 500-1,500 |
| Month 6 | 80-120 | 500-1,000 | 2,000-5,000 |
| Month 12 | 200+ | 1,500-3,000 | 8,000-15,000 |

---

## 附录：快速参考

### A. 页面 SEO 检查清单

```markdown
□ Title 包含主关键词，50-60 字符
□ Meta Description 150-160 字符，包含 CTA
□ H1 与 Title 一致或高度相关
□ URL 包含关键词，简洁可读
□ 正文 800+ 词，自然融入关键词
□ 图片有描述性 alt 文本
□ 6+ FAQ 问答
□ 内链到相关页面 3+
□ FAQPage Schema 结构化数据
□ 已添加到 sitemap
```

### B. 关键词整合模板

```markdown
## 页面关键词规划

**主关键词**: ai background remover
**辅助关键词**: remove background free, background eraser ai
**LSI 词**: transparent, png, cutout, subject extraction

**Title**: AI Background Remover | Free Remove Background Online - Pixelto
**H1**: AI Background Remover
**URL**: /tools/remove-background/

**内容大纲**:
1. 工具介绍（包含主关键词）
2. 使用步骤（How-to 内容）
3. 示例展示
4. 使用场景
5. FAQ（对接 PAA）
6. 相关工具
```

---

## 更新日志

| 日期 | 更新内容 |
|------|----------|
| 2024-12-16 | 初始版本，解答关键词策略疑问 |

