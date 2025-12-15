# syntax=docker/dockerfile:1

FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat
WORKDIR /repo

RUN corepack enable && corepack prepare pnpm@10.14.0 --activate


FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY config/package.json ./config/package.json
COPY apps/*/package.json ./apps/*/package.json
COPY packages/*/package.json ./packages/*/package.json
COPY tooling/*/package.json ./tooling/*/package.json

RUN pnpm install --frozen-lockfile


FROM base AS builder

COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/package.json ./package.json
COPY --from=deps /repo/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /repo/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=deps /repo/turbo.json ./turbo.json

COPY . .

RUN pnpm --filter @repo/web build


FROM node:20-alpine AS runner

RUN apk add --no-cache tini libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
WORKDIR /app

COPY --from=builder /repo/apps/web/.next/standalone ./
COPY --from=builder /repo/apps/web/.next/static ./.next/static
COPY --from=builder /repo/apps/web/public ./public

EXPOSE 3000

ENTRYPOINT ["tini", "--"]
CMD ["node", "server.js"]
