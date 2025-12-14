# Stripe 订阅集成指南

本文档详细说明如何在 Pixelto AI 项目中配置和使用 Stripe 支付订阅系统。

## 目录

1. [系统架构](#系统架构)
2. [Stripe 后台配置](#stripe-后台配置)
3. [环境变量配置](#环境变量配置)
4. [本地开发测试](#本地开发测试)
5. [生产环境部署](#生产环境部署)
6. [订阅流程说明](#订阅流程说明)
7. [积分系统](#积分系统)
8. [常见问题](#常见问题)

---

## 系统架构

### 技术栈

- **支付提供商**: Stripe
- **后端**: oRPC API + Prisma
- **前端**: React + TanStack Query
- **Webhook**: Stripe CLI (开发) / Stripe Dashboard (生产)

### 核心文件

| 文件路径 | 用途 |
|---------|------|
| `config/index.ts` | 套餐配置（价格、积分、功能列表）|
| `packages/payments/provider/stripe/index.ts` | Stripe API 封装 |
| `packages/api/modules/payments/` | 支付相关 API |
| `packages/database/prisma/schema.prisma` | Purchase 数据模型 |
| `apps/web/modules/saas/payments/` | 前端支付组件 |

### 数据模型

```prisma
model Purchase {
  id             String        @id @default(cuid())
  organizationId String?
  userId         String?
  type           PurchaseType  // SUBSCRIPTION 或 ONE_TIME
  customerId     String        // Stripe Customer ID
  subscriptionId String?       @unique
  productId      String        // Stripe Price ID
  status         String?       // active, canceled, past_due 等
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}
```

---

## Stripe 后台配置

### 1. 获取 API 密钥

1. 登录 [Stripe Dashboard](https://dashboard.stripe.com)
2. 确保处于 **测试模式**（右上角橙色标签）
3. 左侧菜单 → **开发者** → **API 密钥**
4. 复制 **密钥**（`sk_test_xxx`）

### 2. 创建产品和价格

#### Pro Plan

1. **产品目录** → **添加产品**
2. 名称: `Pro Plan`
3. 描述: `Pixelto AI Pro - 3000积分/月`
4. 添加价格：
   - 月付: `$10 USD / 月` → 复制价格ID
   - 年付: `$84 USD / 年` → 复制价格ID

#### Ultra Plan

1. **产品目录** → **添加产品**
2. 名称: `Ultra Plan`
3. 描述: `Pixelto AI Ultra - 8000积分/月`
4. 添加价格：
   - 月付: `$20 USD / 月` → 复制价格ID
   - 年付: `$144 USD / 年` → 复制价格ID

### 3. 配置客户门户

1. **设置** → **Billing** → **客户门户**
2. 启用：
   - ✅ 查看发票历史
   - ✅ 更新支付方式
   - ✅ 切换计划
   - ✅ 取消订阅

---

## 环境变量配置

在 `.env.local` 中添加：

```bash
# Stripe 密钥
STRIPE_SECRET_KEY="sk_test_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"

# 价格 ID
NEXT_PUBLIC_PRICE_ID_PRO_MONTHLY="price_xxx"
NEXT_PUBLIC_PRICE_ID_PRO_YEARLY="price_xxx"
NEXT_PUBLIC_PRICE_ID_ULTRA_MONTHLY="price_xxx"
NEXT_PUBLIC_PRICE_ID_ULTRA_YEARLY="price_xxx"

# 积分配置（可选，已有默认值）
NEXT_PUBLIC_CREDITS_FREE_DAILY="30"
NEXT_PUBLIC_CREDITS_PRO_MONTHLY="3000"
NEXT_PUBLIC_CREDITS_ULTRA_MONTHLY="8000"
```

### 环境变量说明

| 变量 | 前缀 | 说明 |
|-----|------|------|
| `STRIPE_SECRET_KEY` | 无 | 敏感密钥，仅服务端使用 |
| `STRIPE_WEBHOOK_SECRET` | 无 | Webhook 签名验证 |
| `NEXT_PUBLIC_PRICE_ID_*` | `NEXT_PUBLIC_` | 前端需要，用于生成 Checkout 链接 |

---

## 本地开发测试

### 1. 安装 Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# 登录
stripe login
```

### 2. 启动 Webhook 转发

```bash
# 新终端窗口
stripe listen --forward-to localhost:3000/api/webhooks/payments
```

运行后会显示 `whsec_xxx`，将其填入 `STRIPE_WEBHOOK_SECRET`。

### 3. 启动开发服务器

```bash
pnpm dev
```

### 4. 测试支付

使用 Stripe 测试卡号：

| 场景 | 卡号 |
|-----|------|
| 成功支付 | `4242 4242 4242 4242` |
| 卡被拒绝 | `4000 0000 0000 0002` |
| 需要3D验证 | `4000 0000 0000 3220` |

其他字段：
- 有效期：任意未来日期（如 `12/26`）
- CVC：任意3位数（如 `123`）

### 5. 验证清单

- [ ] Checkout 页面正常跳转
- [ ] 支付完成后重定向回应用
- [ ] Stripe CLI 收到 webhook 事件
- [ ] 数据库 Purchase 记录已创建
- [ ] 积分正确发放
- [ ] 账单页面显示正确的订阅状态

---

## 生产环境部署

### 1. 切换到生产模式

1. Stripe Dashboard 右上角关闭测试模式
2. 重新创建生产环境的产品和价格
3. 获取生产 API 密钥（`sk_live_xxx`）

### 2. 配置 Webhook 端点

1. **开发者** → **Webhooks** → **添加端点**
2. 端点 URL: `https://你的域名/api/webhooks/payments`
3. 选择事件：
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. 获取签名密钥 `whsec_xxx`

### 3. 配置生产环境变量

```bash
STRIPE_SECRET_KEY="sk_live_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"
NEXT_PUBLIC_PRICE_ID_PRO_MONTHLY="price_xxx"
NEXT_PUBLIC_PRICE_ID_PRO_YEARLY="price_xxx"
NEXT_PUBLIC_PRICE_ID_ULTRA_MONTHLY="price_xxx"
NEXT_PUBLIC_PRICE_ID_ULTRA_YEARLY="price_xxx"
```

---

## 订阅流程说明

### 创建订阅

```
用户点击 Subscribe
    ↓
PricingTable.onSelectPlan()
    ↓
API: createCheckoutLink
    ↓
Stripe Checkout Session
    ↓
用户完成支付
    ↓
Stripe Webhook: customer.subscription.created
    ↓
创建 Purchase 记录
    ↓
重定向回应用
```

### 升级/降级订阅

已有订阅的用户点击其他套餐时，会跳转到 Customer Portal：

```
用户点击 "Upgrade"
    ↓
API: createCustomerPortalLink
    ↓
Stripe Customer Portal
    ↓
用户选择新计划并确认
    ↓
Stripe Webhook: customer.subscription.updated
    ↓
1. 检测 productId 变化
2. 清理旧计划的订阅积分
3. 更新 Purchase 记录
    ↓
用户下次访问时懒加载新计划积分
```

**积分处理逻辑**：
- 升级时自动清零旧计划当前周期的订阅积分
- 新计划积分通过懒加载机制发放
- Stripe 自动按比例计算差价（Proration）

### 取消订阅

用户可通过客户门户（Customer Portal）自助取消：

```
用户点击 "管理订阅"
    ↓
API: createCustomerPortalLink
    ↓
Stripe 客户门户
    ↓
用户取消订阅
    ↓
Stripe Webhook: customer.subscription.deleted
    ↓
删除 Purchase 记录
```

### Webhook 事件处理

| 事件 | 处理逻辑 |
|-----|---------|
| `checkout.session.completed` | 一次性购买完成，创建 Purchase |
| `customer.subscription.created` | 订阅创建，创建 Purchase |
| `customer.subscription.updated` | 订阅更新，更新 Purchase 状态 |
| `customer.subscription.deleted` | 订阅删除，删除 Purchase |

---

## 积分系统

### 发放机制（懒加载）

积分在用户查询余额时自动发放，避免定时任务复杂性：

```typescript
// packages/api/modules/payments/procedures/get-billing-summary.ts

// 1. Free 用户：每日发放
await ensureDailyFreeGrant({ userId, amount: 30 });

// 2. 订阅用户：每周期发放
await ensureSubscriptionCycleGrant({
  userId,
  amount: plan.credits.monthly,
  cycleAnchor: subscription.createdAt,
});
```

### 积分类型

| 类型 | 说明 | 过期规则 |
|-----|------|---------|
| `DAILY_FREE` | 每日免费积分 | 当日有效 |
| `SUBSCRIPTION` | 订阅周期积分 | 周期结束过期 |
| `PURCHASED` | 购买的积分 | 永不过期 |
| `PROMOTIONAL` | 促销赠送 | 按活动设定 |

### 扣费优先级

```
先过期优先 → 类型优先级 → 创建时间

类型优先级：DAILY_FREE > SUBSCRIPTION > PROMOTIONAL > PURCHASED
```

---

## 常见问题

### Q: 环境变量修改后不生效？

清除缓存并重启：

```bash
rm -rf apps/web/.next .turbo
pnpm dev
```

### Q: Webhook 收不到事件？

1. 确认 Stripe CLI 正在运行
2. 检查 `STRIPE_WEBHOOK_SECRET` 是否正确
3. 确认端点 URL: `/api/webhooks/payments`

### Q: 测试模式和生产模式的区别？

| 项目 | 测试模式 | 生产模式 |
|-----|---------|---------|
| 密钥前缀 | `sk_test_` | `sk_live_` |
| 卡号 | 测试卡号 | 真实信用卡 |
| 扣款 | 模拟，不扣款 | 真实扣款 |
| 产品/价格 | 独立的测试数据 | 独立的生产数据 |

### Q: 如何查看订阅状态？

1. Stripe Dashboard → **客户** 或 **订阅**
2. 应用内：`/app/settings/billing`
3. 数据库：`Purchase` 表

---

## 相关资源

- [Stripe 官方文档](https://stripe.com/docs)
- [Stripe CLI 文档](https://stripe.com/docs/stripe-cli)
- [Webhook 事件类型](https://stripe.com/docs/api/events/types)
- [测试卡号列表](https://stripe.com/docs/testing#cards)
