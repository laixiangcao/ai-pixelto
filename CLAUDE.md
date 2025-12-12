# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 沟通与工作原则

**始终使用中文沟通**（代码标识符除外）。注释、文档、对话均使用中文。

**决策优先级**：安全性 > 可维护性 > 性能 > 简洁性

**顾问角色**：发现安全隐患、架构问题或反模式时，必须主动指出并提供更优方案。

### 工作流模式

| 模式 | 适用场景 | 流程 |
|------|----------|------|
| 快速模式 | Bug 修复、UI 微调、单文件改动 | 直接编码，规范 commit |
| 规范模式 | 新功能、跨模块重构、DB/API 变更 | 需求确认 → 文档编写 → 执行实施 |

规范模式文档规范详见 [`docs/specs/README.md`](./docs/specs/README.md)，包含：
- 业务域分类与命名规范（`{nn}-domain/{nnn}-feature/`）
- 文档模板（requirements / design / plan）
- 创建流程与示例

### 禁止行为

- 静默吞掉异常
- 使用 `temp`、`data`、`obj` 等无意义命名
- 跳过必要的错误处理
- 在未理解上下文前修改代码

## 项目概述

Pixelto AI 是一款 AI 图像处理 SaaS 应用

**技术栈**：Next.js 15 (App Router) + React 19 + TypeScript + Prisma + oRPC + better-auth + Tailwind CSS + Shadcn UI

**包管理**：pnpm monorepo (Turborepo)

**国际化**：next-intl (en/de/zh)

### 国际化开发规范

- **禁止硬编码**用户可见文本
- 新增/修改文本**必须同步更新** `en.json`、`de.json`、`zh.json`
- 翻译文件：`packages/i18n/translations/{locale}.json`
- 客户端：`useTranslations("namespace")`
- 服务端：`await getTranslations("namespace")`

## 常用命令

```bash
pnpm dev              # 启动开发服务器
pnpm build            # 生产构建
pnpm lint             # Biome 检查
pnpm format           # Biome 格式化

# 数据库
pnpm --filter @repo/database push      # 推送 schema
pnpm --filter @repo/database studio    # Prisma Studio
pnpm --filter @repo/database migrate   # 执行迁移
pnpm --filter @repo/database generate  # 生成 Prisma Client

# 测试
pnpm --filter @repo/web e2e            # Playwright UI 模式
pnpm --filter @repo/web e2e:ci         # Playwright CI 模式
```

## 项目结构

```
apps/web/                  # Next.js 主应用
├── app/
│   ├── (marketing)/       # 营销页面（带 locale）
│   ├── (saas)/            # SaaS 应用页面
│   ├── auth/              # 认证页面
│   └── api/               # API 路由
└── modules/               # 前端业务模块
    ├── ai-image-editor/   # AI 图像编辑器
    ├── marketing/         # 营销组件
    ├── saas/              # SaaS 组件
    └── ui/                # Shadcn UI 组件

packages/                  # 后端/共享包
├── api/                   # oRPC API（modules/{module}/procedures/）
├── ai/                    # AI 集成
├── auth/                  # better-auth 配置
├── database/              # Prisma schema 和查询
├── i18n/                  # 翻译文件
├── mail/                  # 邮件模板
├── payments/              # 支付集成
└── storage/               # S3 文件存储

config/index.ts            # 应用配置
```

### 关键文件

| 用途 | 路径 |
|------|------|
| 应用配置 | `config/index.ts` |
| 数据库 Schema | `packages/database/prisma/schema.prisma` |
| API 定义 | `packages/api/modules/{module}/procedures/` |
| 翻译文件 | `packages/i18n/translations/{locale}.json` |
| 主题变量 | `tooling/tailwind/theme.css` |

## 代码规范

### TypeScript

- 使用 `interface` 定义对象类型
- 使用 `const` + `as const` 替代 enum
- 使用 Zod 进行运行时验证
- 使用 guard clauses（卫语句）尽早返回

### React

- 优先使用 React Server Components
- 最小化 `"use client"`、`useEffect`、`useState`
- 客户端组件用 `<Suspense>` 包裹
- 非关键组件用 `dynamic()` 懒加载
- 使用具名导出

### 样式

- 使用 `cn()` 合并类名（来自 `@ui/lib`）
- 移动优先响应式设计

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 目录 | kebab-case | `auth-wizard/` |
| 组件文件 | PascalCase | `UserCard.tsx` |
| 函数/变量 | camelCase | `getUserById` |
| 常量 | SCREAMING_SNAKE | `MAX_RETRY_COUNT` |
| 布尔变量 | is/has 前缀 | `isActive`, `hasPermission` |

### 错误处理

```typescript
// 捕获异常必须记录日志
try {
  await riskyOperation();
} catch (error) {
  logger.error("操作失败", { error });
  throw new BusinessError("操作失败，请重试");
}
```

## 开发模式

### API 开发

```typescript
// packages/api/modules/{module}/procedures/{action}.ts
import { authenticatedProcedure } from "@api/orpc/procedures";
import { z } from "zod";

export const createItem = authenticatedProcedure
  .input(z.object({ name: z.string() }))
  .handler(async ({ input, context }) => {
    // 实现逻辑
  });
```

### 数据库查询

```typescript
// packages/database/prisma/queries/{entity}.ts
import { db } from "../client";

export async function findUserById(id: string) {
  return db.user.findUnique({ where: { id } });
}
```
