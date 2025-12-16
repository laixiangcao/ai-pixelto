# Pixelto SEO 运营指南

> 适用对象：Pixelto 运营团队
> 核心目标：新站快速突破 1000+ PV，建立可持续的 SEO 增长体系

---

## 目录

1. [SEO 关键知识 · 快速精通](#一seo-关键知识--快速精通)
2. [新站快速突破 1000+ PV 方案](#二新站快速突破-1000-pv-方案)
3. [AI 生图工具站 SEO 特别指南](#三ai-生图工具站-seo-特别指南)
4. [维护检查清单](#四维护检查清单)
5. [附录](#五附录)

---

## 一、SEO 关键知识 · 快速精通

### 1.1 搜索意图（I/C/T/N）

理解用户搜索意图是关键词选择的基础：

| 类型 | 全称 | 说明 | 示例 | 策略 |
|------|------|------|------|------|
| **I** | Informational | 寻找信息、教程、知识 | "how to write ai prompts" | 教程/博客引流 |
| **C** | Commercial | 对比、评测、准备购买 | "best ai image generator 2024" | 对比页/工具页（主战场） |
| **T** | Transactional | 直接交易意图 | "ai image generator pricing" | 定价/注册页 |
| **N** | Navigational | 寻找特定品牌/站点 | "midjourney login" | 品牌词自然覆盖 |

**优先级**：C（商业）> I（信息）> T（交易）> N（导航）

新站重点攻占 **C/I 混合意图** 的关键词。

### 1.2 关键词三维度

| 维度 | 指标 | 新站甜区 | 说明 |
|------|------|----------|------|
| **Volume** | 月搜索量 | 50–800 | 太低无流量，太高竞争激烈 |
| **KD** | 难度 | ≤ 35 | 首批核心池；35-40 为次级池 |
| **Intent** | 意图 | C/T | 优先商业/交易意图 |

**筛选公式**：`Volume 50-800` + `KD ≤ 35` + `Intent C/T` = 新站可打词

### 1.3 SERP Features 与内容形态匹配

| SERP 特性 | 适配内容 | 优先级 |
|-----------|----------|--------|
| **Image Pack** | 生成器页 + 高质量示例图 | ⭐⭐⭐ 优先 |
| **PAA (People Also Ask)** | FAQ 结构化内容 | ⭐⭐⭐ 优先 |
| Featured Snippet | 教程/定义类内容 | ⭐⭐ |
| Shopping/News/Local | 避开（CTR 被分流） | ❌ 谨慎 |

**选词原则**：优先选择有 **Image Pack 或 PAA** 的关键词，与生图工具天然契合。

### 1.4 E-E-A-T 原则（AI 工具站视角）

Google 评估内容质量的四大维度：

| 维度 | 全称 | AI 工具站落地方式 |
|------|------|-------------------|
| **E** | Experience | 展示真实生成结果、用户案例 |
| **E** | Expertise | 提供专业 Prompt 模板、参数说明 |
| **A** | Authoritativeness | 对比评测、引用权威数据 |
| **T** | Trustworthiness | 版权声明、隐私政策、使用条款 |

**具体落地**：
- 每个工具页展示 **3-6 张真实生成示例**
- 提供 **可复制的 Prompt 模板**（正向/负向）
- 添加 **FAQ 解答常见问题**
- 标注 **商用限制与版权说明**

### 1.5 技术 SEO 速查清单

| 项目 | 要求 | 检查方式 |
|------|------|----------|
| robots.txt | 正确配置允许/禁止 | `curl https://domain.com/robots.txt` |
| XML Sitemap | 包含所有公开页面 | `curl https://domain.com/sitemap.xml` |
| Canonical | 每页唯一规范 URL | 查看页面 `<link rel="canonical">` |
| hreflang | 多语言页面正确配置 | [hreflang Testing Tool](https://technicalseo.com/tools/hreflang/) |
| Core Web Vitals | LCP/FID/CLS 达标 | [PageSpeed Insights](https://pagespeed.web.dev/) |
| HTTPS | 全站强制 HTTPS | 检查 URL 前缀 |
| Mobile | 移动端友好 | [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly) |

---

## 二、新站快速突破 1000+ PV 方案

### 2.1 目标拆解与 KPI 设定

**3 个月里程碑**：

| 时间 | 目标关键词 Top 10 | 日均自然点击 | 收录页数 | 转化率 |
|------|-------------------|--------------|----------|--------|
| 第 1 月 | ≥ 10 个 | ≥ 30 | ≥ 25 | — |
| 第 2 月 | ≥ 25 个 | ≥ 80 | ≥ 50 | ≥ 2% |
| 第 3 月 | ≥ 40 个 | ≥ 150 | ≥ 80 | ≥ 3% |

**流量计算**：
- 40 个词 × 平均 Top 10 CTR 5% × 平均月搜索 300 = 600 点击/月
- 加上长尾词覆盖，目标 **1000+ PV/月** 可达成

### 2.2 关键词筛选规则

#### 核心池（首批上线）

```
Database: United States（随后 UK/CA/AU/SG）
Volume: 50–800
KD%: ≤ 35
PKD%: ≤ 45（站点权重低则 ≤ 40）
Intent: Commercial / Transactional
Word Count: 3–6
Include: `ai` AND `generator|create|make`
Exclude: `midjourney|adobe|canva|photoshop|stable diffusion|free trial`
SERP Features: Images 或 PAA 至少其一
排序: Potential Traffic (desc) → KD (asc)
```

#### 次级池（填充/AB 测试）

```
Volume: 30–1,200
KD: ≤ 40
其它同上
```

### 2.3 高价值关键词方向

| 类目 | 细分方向 | 示例长尾词 |
|------|----------|------------|
| **Wallpaper** | desktop/phone/4k/aesthetic/anime/minimal | ai wallpaper generator 4k |
| **Avatar** | profile picture/gaming/headshot | profile picture ai generator |
| **YouTube/Marketing** | thumbnail/banner/hero/blog cover | youtube thumbnail ai generator |
| **Poster/Banner** | event/music/movie/minimalist | minimalist poster ai generator |
| **Background/Pattern** | abstract/gradient/mesh/seamless | gradient background ai generator |
| **Illustration** | flat/vector/isometric/pixel/line art/3d | isometric illustration ai generator |
| **Style** | realistic/photorealistic/anime/manga/cyberpunk | anime style ai image generator |

### 2.4 内容生产节奏（4 周排期模板）

| 周次 | 内容类型 | 产出数量 | 具体内容 |
|------|----------|----------|----------|
| **Week 1** | 工具页 | 5-6 页 | Wallpaper（Pillar+3 Leaf）、Avatar（Pillar+2 Leaf） |
| **Week 2** | 工具页 | 4-5 页 | YouTube Thumbnail（Pillar+2）、Poster（Pillar+2） |
| **Week 3** | 工具页 | 5-6 页 | Background/Pattern（Pillar+3）、Illustration（Pillar+2） |
| **Week 4** | 教程+对比 | 6 篇 | 教程 4 篇 + 对比 2 篇 |

**每页验收标准**：
- ≥ 900 词文本内容
- ≥ 3 张高质量示例图
- ≥ 6 个可复制的 Prompt 模板
- ≥ 6 条 FAQ（对接 PAA）
- Title/H1/Meta 唯一
- 图片 alt 完整
- 内部链接 ≥ 6 个

### 2.5 站内架构与内链策略

#### Cluster → Pillar → Leaf 模型

```
Wallpaper（Cluster 主题）
├── /generate/wallpaper/          ← Pillar（支柱页，承接核心词）
│   ├── /generate/wallpaper/4k/      ← Leaf（子页，承接长尾）
│   ├── /generate/wallpaper/anime/
│   ├── /generate/wallpaper/aesthetic/
│   └── /generate/wallpaper/minimal/
```

#### URL 结构规范

| 页面类型 | URL 模式 | 示例 |
|----------|----------|------|
| 工具页 | `/generate/[use-case]/` | `/generate/wallpaper/` |
| 模板页 | `/templates/[scenario]/` | `/templates/youtube-thumbnail/` |
| 教程页 | `/learn/prompts/[topic]/` | `/learn/prompts/negative-prompts/` |
| 对比页 | `/compare/[brand-a]-vs-[brand-b]/` | `/compare/flux-vs-stable-diffusion/` |

#### 内链规则

| 链接类型 | 规则 | 锚文本 |
|----------|------|--------|
| Pillar ↔ Leaf | 双向互链 + 面包屑 | 包含主词变体 |
| 跨 Cluster | 相邻主题互链 | "See also: [Related Tool]" |
| 教程 → 工具 | How-to → Tool 路径导流 | "Try our [Tool Name]" |

### 2.6 首月行动清单

#### Day 1-3：关键词挖掘

- [ ] 在 Semrush 建立过滤预设（按 2.2 节规则）
- [ ] 录入竞品域名清单（见附录）
- [ ] 运行 Keyword Gap（Missing + Weak）
- [ ] 运行 Keyword Magic（种子词扩展）
- [ ] 抽取 5 个核心 Cluster，每个 10-15 词
- [ ] 完成 Manager 聚类

#### Day 4-7：首批内容上线

- [ ] 输出 2 个 Cluster 的页面文案
- [ ] 发布 5-8 个工具页
- [ ] 部署 FAQ Schema 结构化数据
- [ ] 提交 Sitemap 到 GSC
- [ ] 开启 Position Tracking

#### Day 8-14：内容扩展

- [ ] 新增 2 个 Cluster（6-10 页）
- [ ] 完善内链结构
- [ ] 检查索引状态，修复爬取错误
- [ ] 首次 CTR/排名复盘

#### Day 15-30：优化迭代

- [ ] 完成剩余 Cluster（共 20+ 工具页）
- [ ] 产出 2 篇对比 + 4 篇教程
- [ ] 根据数据调整 Title/Meta/FAQ
- [ ] 建立 2-3 个高质量外链
- [ ] 月度复盘报告

### 2.7 监测指标与优化闭环

#### 核心监测工具

| 工具 | 监测内容 | 频率 |
|------|----------|------|
| **GSC** | 索引状态、查询词、CTR、排名 | 每日 |
| **GA4** | 流量来源、转化事件、用户行为 | 每日 |
| **Semrush Position Tracking** | 目标关键词排名变化 | 每周 2 次 |

#### 优化决策阈值

| 情况 | 触发条件 | 优化动作 |
|------|----------|----------|
| 排名停滞 | 7-14 天无增长 | 调整 Title/首屏内容/FAQ/内链 |
| CTR 偏低 | < 1% | 重写 Title/Meta Description |
| 高排名低转化 | Top 10 但转化 < 1% | 优化页面 CTA、表单位置 |
| 未收录 | 提交 7 天后仍未收录 | 检查 robots/canonical、手动请求索引 |

#### GSC 关键指标解读

| 指标 | 健康值 | 异常处理 |
|------|--------|----------|
| 覆盖率 | > 95% 有效 | 检查 noindex、重定向问题 |
| 平均排名 | 持续下降趋势 | 内容更新、增加内链 |
| 点击率 | > 3%（品牌词除外） | 优化 Title/Description |
| 展示量 | 稳定或增长 | 若下降检查算法更新 |

---

## 三、AI 生图工具站 SEO 特别指南

### 3.1 落地页模板

#### Title 模板

```
[Primary Keyword] | Free AI [Use-case] Generator Online
```

示例：`AI Wallpaper Generator 4K | Free AI Desktop Wallpaper Generator Online`

#### H1 模板

```
AI [Use-case or Style] Generator (Online, Fast, No Watermark)
```

示例：`AI Wallpaper Generator (Online, Fast, No Watermark)`

#### Meta Description 模板

```
Generate [use-case/style] images online with AI. Ready-to-use prompts, fast results, and HD export for blogs, social, and ecommerce. Try free now!
```

#### 页面结构模块

1. **H1 + 副描述**（意图词 + 场景词）
2. **生成器交互区**（输入框 → 预设 Prompt → 生成按钮）
3. **示例结果**（3-6 张，带 alt 与可复制 Prompt）
4. **Prompt 模板区**（正/负面词，尺寸与风格开关）
5. **FAQ 区**（对接 PAA，≥ 6 条）
6. **相关生成器内链**（同 Cluster 兄弟页）
7. **合规说明**（商用、版权、限制）

### 3.2 FAQ 模板（可复用）

针对每个工具页，FAQ 应包含：

```markdown
### What is an AI [use-case] generator?
An AI [use-case] generator creates [use-case] images from text prompts using artificial intelligence. Simply describe what you want, and the AI generates matching visuals.

### How to write prompts for [style/use-case]?
For best results, include: subject, style, mood, colors, and quality modifiers. Example: "minimalist mountain landscape, soft pastel colors, clean lines, 4k wallpaper"

### Can I use AI-generated images commercially?
Yes, images generated on Pixelto can be used for commercial purposes. However, avoid prompts containing brand names, copyrighted characters, or real person likenesses.

### What sizes and formats are supported?
We support common aspect ratios (16:9, 9:16, 1:1, 4:3) and export in PNG, JPG, and WebP formats up to 4K resolution.

### Is registration required to use the generator?
You can try the generator without registration. Sign up for free to unlock higher resolution exports and save your creations.

### How many images can I generate for free?
Free users get [X] generations per day. Upgrade to Pro for unlimited generations and priority processing.
```

### 3.3 结构化数据扩展

#### FAQ Schema（每个工具页必备）

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is an AI wallpaper generator?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "An AI wallpaper generator creates desktop and mobile wallpapers from text descriptions using artificial intelligence."
      }
    }
  ]
}
```

#### HowTo Schema（教程页）

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Generate AI Wallpapers",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Enter your prompt",
      "text": "Describe the wallpaper you want, including style, colors, and mood."
    },
    {
      "@type": "HowToStep",
      "name": "Select size",
      "text": "Choose desktop (16:9) or mobile (9:16) aspect ratio."
    },
    {
      "@type": "HowToStep",
      "name": "Generate and download",
      "text": "Click Generate and download your wallpaper in HD quality."
    }
  ]
}
```

#### Product Schema（定价页）

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Pixelto Pro",
  "description": "Professional AI image generation with unlimited exports",
  "offers": {
    "@type": "Offer",
    "price": "9.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
```

### 3.4 合规与版权策略

#### 页面必备声明

```markdown
**Usage Guidelines**
- Images generated on Pixelto are created by AI and may be used for personal and commercial purposes.
- Do not include brand names, copyrighted characters, or real person names in prompts.
- Users are responsible for ensuring their use complies with applicable laws.
- For full terms, see our [Terms of Service](/legal/terms).
```

#### Prompt 过滤建议

禁止/警告的 Prompt 关键词：
- 品牌词：Disney, Nike, Marvel, Pokemon 等
- 真人姓名：明星、政治人物
- 版权角色：Mickey Mouse, Spider-Man 等

---

## 四、维护检查清单

### 每周检查

- [ ] GSC 无新爬取错误
- [ ] 站点地图已更新（新内容已包含）
- [ ] 关键页面索引状态正常
- [ ] 无新增 404 错误
- [ ] 核心关键词排名记录

### 每月检查

- [ ] Core Web Vitals 指标达标
- [ ] 移动端友好性测试通过
- [ ] 结构化数据无报错（Rich Results Test）
- [ ] hreflang 配置正确
- [ ] 外链质量检查
- [ ] 流量与转化趋势分析

### 季度检查

- [ ] 内容审计（更新过期内容）
- [ ] 关键词排名全面分析
- [ ] 竞品 SEO 策略对比
- [ ] 技术 SEO 全面审计
- [ ] 内链结构优化
- [ ] 下季度内容规划

---

## 五、附录

### A. 英文长尾词清单

以下关键词可直接导入 Semrush Keyword Manager 进行筛选：

```
ai wallpaper generator 4k, desktop wallpaper ai generator, phone wallpaper ai generator, aesthetic wallpaper ai generator, anime wallpaper ai generator, profile picture ai generator, gaming avatar ai generator, headshot style ai image generator, youtube thumbnail ai generator, social media banner ai generator, hero image ai generator for websites, blog cover image ai generator, poster ai generator online, minimalist poster ai generator, event poster ai generator, music poster ai generator, movie poster concept ai generator, abstract background ai generator, gradient background ai generator, gradient mesh background ai, simple geometric background ai, seamless pattern ai generator, nature pattern seamless ai, flat illustration ai generator, vector illustration ai generator, isometric illustration ai generator, pixel art ai generator online, line art illustration ai generator, low poly style ai image generator, 3d style ai image generator, realistic ai image generator online, photorealistic ai image from text, anime style ai image generator, manga style ai art generator, kawaii illustration ai generator, cyberpunk ai art generator, vaporwave ai art generator, neon noir ai art generator, fantasy landscape ai generator, dark fantasy ai art generator, sci fi city ai generator, surreal dreamscape ai generator, city night scene ai generator, mountain landscape ai generator, beach sunset ai image generator, flower illustration ai generator, animal illustration ai generator, food illustration ai generator, product concept image ai generator, ecommerce poster ai generator, abstract texture background ai, hero section background ai generator, vector icons style ai generator
```

### B. Semrush 过滤器预设

**Include（任一）**
```
(ai).*(generator|create|make)|(generator|create|make).*(ai)
```

**Exclude（按需）**
```
midjourney|adobe|photoshop|canva|stable diffusion|free trial|dall-e|dalle
```

### C. 竞品对标域名池

用于 Keyword Gap 分析（每次选 4-5 个）：

```
leonardo.ai
playgroundai.com
getimg.ai
mage.space
nightcafe.studio
starryai.com
artsmart.ai
instantart.io
openart.ai
ideogram.ai
hotpot.ai
simplified.com
picsart.com
```

### D. SEO 验证工具

| 工具 | 用途 | 链接 |
|------|------|------|
| Google Rich Results Test | 验证结构化数据 | [链接](https://search.google.com/test/rich-results) |
| Facebook Sharing Debugger | 验证 Open Graph | [链接](https://developers.facebook.com/tools/debug/) |
| Twitter Card Validator | 验证 Twitter Card | [链接](https://cards-dev.twitter.com/validator) |
| hreflang Testing Tool | 验证多语言标签 | [链接](https://technicalseo.com/tools/hreflang/) |
| PageSpeed Insights | Core Web Vitals | [链接](https://pagespeed.web.dev/) |

---

## 更新日志

| 日期 | 更新内容 |
|------|----------|
| 2024-12-16 | 重构文档，分离运营指南与技术设计 |
