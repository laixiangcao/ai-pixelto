# ============================================
# Base stage: 基础镜像配置
# ============================================
FROM node:20-alpine AS base

# 安装必要的系统依赖
RUN apk add --no-cache libc6-compat

WORKDIR /repo

# 启用 corepack 并准备 pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate


# ============================================
# Deps stage: 安装依赖（利用 Docker 层缓存）
# ============================================
FROM base AS deps

# 先复制依赖配置文件（变化频率低，利于缓存）
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# 复制所有 workspace 的 package.json
COPY config/package.json ./config/
COPY apps/web/package.json ./apps/web/
COPY packages/ai/package.json ./packages/ai/
COPY packages/api/package.json ./packages/api/
COPY packages/auth/package.json ./packages/auth/
COPY packages/database/package.json ./packages/database/
COPY packages/i18n/package.json ./packages/i18n/
COPY packages/logs/package.json ./packages/logs/
COPY packages/mail/package.json ./packages/mail/
COPY packages/payments/package.json ./packages/payments/
COPY packages/storage/package.json ./packages/storage/
COPY packages/utils/package.json ./packages/utils/
COPY tooling/scripts/package.json ./tooling/scripts/
COPY tooling/tailwind/package.json ./tooling/tailwind/
COPY tooling/typescript/package.json ./tooling/typescript/

# 安装依赖（frozen-lockfile 确保可重复构建）
RUN pnpm install --frozen-lockfile


# ============================================
# Builder stage: 构建应用
# ============================================
FROM base AS builder

# 复制依赖
COPY --from=deps /repo ./

# 复制源代码
COPY . .

# 生成 Prisma Client
RUN pnpm --filter @repo/database generate

# 构建 Next.js 应用
RUN pnpm --filter @repo/web build


# ============================================
# Runner stage: 生产运行环境（最小化镜像）
# ============================================
FROM node:20-alpine AS runner

# 安装 tini（优雅处理信号）和必要依赖
RUN apk add --no-cache tini libc6-compat

# 创建非 root 用户（安全最佳实践）
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 设置环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

WORKDIR /app

# 复制 standalone 输出（保留 monorepo 结构）
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/standalone ./

# 复制静态资源到正确位置
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/public ./apps/web/public

# 切换到非 root 用户
USER nextjs

EXPOSE 3000

# 使用 tini 作为 init 进程
ENTRYPOINT ["tini", "--"]

# 启动 Next.js 服务（注意路径）
CMD ["node", "apps/web/server.js"]
