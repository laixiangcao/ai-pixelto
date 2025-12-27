# Pixelto 部署指南

本文档介绍 Pixelto 项目的部署流程，包括首次上线部署和后续迭代升级。

## 目录

- [环境要求](#环境要求)
- [首次部署](#首次部署)
- [迭代升级](#迭代升级)
- [数据库迁移](#数据库迁移)
- [回滚方案](#回滚方案)
- [常见问题](#常见问题)

---

## 环境要求

### 服务器要求

- **操作系统**: Linux (推荐 Ubuntu 22.04 LTS)
- **CPU**: 2 核以上
- **内存**: 4GB 以上
- **磁盘**: 20GB 以上

### 软件依赖

- **Docker**: 24.0+
- **Docker Compose**: 2.20+
- **Node.js**: 20+ (本地开发)
- **pnpm**: 10.14.0

### 外部服务

- **PostgreSQL**: 16+ (可使用 Docker 或云服务)
- **S3 兼容存储**: Cloudflare R2 / AWS S3 / MinIO
- **邮件服务**: Plunk / Resend / SMTP
- **支付服务**: Stripe

---

## 首次部署

### 1. 准备服务器

```bash
# 安装 Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 安装 Docker Compose (如未包含)
sudo apt-get install docker-compose-plugin
```

### 2. 克隆代码

```bash
git clone https://github.com/your-org/ai-pixelto.git
cd ai-pixelto
```

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.docker.example .env.docker

# 编辑环境变量（注意：值不要带引号）
vim .env.docker
```

**必须配置的环境变量**:

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | PostgreSQL 连接字符串 |
| `NEXT_PUBLIC_SITE_URL` | 网站 URL (如 https://pixelto.com) |
| `BETTER_AUTH_SECRET` | 认证密钥 (随机字符串) |
| `STRIPE_SECRET_KEY` | Stripe 密钥 |
| `S3_*` | S3 存储配置 |

### 4. 初始化数据库

```bash
# 方式 A: 使用 Docker Compose 启动 PostgreSQL
docker compose up -d postgres

# 等待数据库就绪
sleep 10

# 方式 B: 使用外部数据库，确保 DATABASE_URL 配置正确
```

### 5. 执行数据库迁移（首次部署）

**首次部署到全新数据库**需要执行完整迁移：

```bash
# 设置数据库连接（注意：值不要带引号）
export DATABASE_URL=postgresql://user:pass@host:5432/pixelto

# 执行迁移（会按顺序应用所有迁移文件）
pnpm db:migrate:deploy
```

迁移文件位于 `packages/database/prisma/migrations/`，包含：
- `20241209160000_init` - 基础表结构（user, session, account 等）
- `20241209170000_credit_grant_spend` - 积分系统表

**如果迁移失败**，可能是数据库已有部分表，使用以下方式处理：

```bash
# 方式 A: 使用 db push 直接同步 schema（适用于全新数据库）
pnpm --filter @repo/database push

# 然后标记迁移为已应用
pnpm --filter @repo/database exec prisma migrate resolve --applied "20241209160000_init"
pnpm --filter @repo/database exec prisma migrate resolve --applied "20241209170000_credit_grant_spend"
```

### 6. 构建并启动应用

```bash
# 构建镜像
pnpm docker:build

# 或使用 buildx 构建 linux/amd64 镜像 (Mac ARM 环境)
pnpm docker:buildx

# 启动服务
docker compose up -d
```

### 7. 配置反向代理 (Nginx)

参考 `pixelto.com.conf` 配置文件，主要配置：

```nginx
server {
    listen 443 ssl http2;
    server_name pixelto.com;

    ssl_certificate     /etc/nginx/cert/pixelto.com/fullchain.pem;
    ssl_certificate_key /etc/nginx/cert/pixelto.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 8. 验证部署

```bash
# 检查容器状态
docker compose ps

# 查看日志
docker compose logs -f web

# 测试健康检查
curl http://localhost:3000/api/health
```

---

## 迭代升级

### 标准升级流程

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 检查是否有数据库迁移
pnpm db:migrate:status

# 3. 执行数据库迁移（如有）
export DATABASE_URL="postgresql://user:pass@host:5432/pixelto"
pnpm db:migrate:deploy

# 4. 重新构建镜像
pnpm docker:build

# 5. 重启服务（零停机）
docker compose up -d --no-deps web

# 6. 验证服务
curl http://localhost:3000/api/health
```

### 快速升级脚本

创建 `scripts/deploy.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 开始部署..."

# 拉取代码
git pull origin main

# 数据库迁移
echo "📦 检查数据库迁移..."
pnpm db:migrate:deploy

# 构建镜像
echo "🔨 构建 Docker 镜像..."
pnpm docker:build

# 重启服务
echo "🔄 重启服务..."
docker compose up -d --no-deps web

# 等待服务就绪
sleep 5

# 健康检查
echo "✅ 健康检查..."
curl -f http://localhost:3000/api/health || exit 1

echo "🎉 部署完成!"
```

### CI/CD 自动化部署

GitHub Actions 示例 (`.github/workflows/deploy.yml`):

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build and push Docker image
        run: |
          docker build -t ${{ secrets.DOCKER_REGISTRY }}/pixelto:${{ github.sha }} .
          docker push ${{ secrets.DOCKER_REGISTRY }}/pixelto:${{ github.sha }}

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /app/pixelto
            docker pull ${{ secrets.DOCKER_REGISTRY }}/pixelto:${{ github.sha }}
            docker compose up -d --no-deps web
```

---

## 数据库迁移

### 命令说明

| 命令 | 用途 | 环境 |
|------|------|------|
| `pnpm --filter @repo/database push` | 直接同步 schema（无迁移记录） | **仅开发** |
| `pnpm --filter @repo/database migrate` | 生成迁移文件 + 应用 | **开发** |
| `pnpm db:migrate:deploy` | 应用已有迁移文件 | **生产** |
| `pnpm db:migrate:status` | 查看迁移状态 | 任意 |

### 开发流程

```bash
# 1. 修改 schema.prisma
vim packages/database/prisma/schema.prisma

# 2. 生成迁移文件
pnpm --filter @repo/database migrate --name add_user_avatar

# 3. 提交迁移文件
git add packages/database/prisma/migrations
git commit -m "feat(db): add user avatar field"
```

### 生产迁移

```bash
# 方式 A: 本地连接生产数据库
export DATABASE_URL="postgresql://user:pass@prod-host:5432/pixelto"
pnpm db:migrate:deploy

# 方式 B: SSH 隧道
ssh -L 5433:localhost:5432 user@prod-server
export DATABASE_URL="postgresql://user:pass@localhost:5433/pixelto"
pnpm db:migrate:deploy

# 方式 C: 在服务器上执行
ssh user@prod-server
cd /app/pixelto
DATABASE_URL="..." pnpm db:migrate:deploy
```

### ⚠️ 注意事项

1. **生产环境禁止使用 `push`**: 可能导致数据丢失
2. **迁移前备份数据库**: `pg_dump -h host -U user -d pixelto > backup.sql`
3. **测试迁移**: 先在 staging 环境测试
4. **迁移文件必须提交 Git**: 确保生产环境有迁移文件

---

## 回滚方案

### 应用回滚

```bash
# 1. 查看历史镜像
docker images | grep pixelto

# 2. 回滚到指定版本
docker compose down
docker tag pixelto:previous pixelto:latest
docker compose up -d
```

### 数据库回滚

Prisma 不支持自动回滚，需要手动处理：

```bash
# 1. 从备份恢复
psql -h host -U user -d pixelto < backup.sql

# 2. 或手动执行回滚 SQL
psql -h host -U user -d pixelto -c "ALTER TABLE users DROP COLUMN avatar;"
```

---

## 常见问题

### Q: Docker 构建失败 - 网络问题

```bash
# 配置 Docker 镜像加速
# 编辑 /etc/docker/daemon.json
{
  "registry-mirrors": ["https://mirror.ccs.tencentyun.com"]
}
sudo systemctl restart docker
```

### Q: 容器启动失败 - 端口占用

```bash
# 查看端口占用
lsof -i :3000

# 停止占用进程或修改 docker-compose.yml 端口映射
```

### Q: 数据库连接失败

```bash
# 检查数据库连接
docker compose exec postgres psql -U pixelto -d pixelto -c "SELECT 1"

# 检查环境变量
docker compose exec web env | grep DATABASE
```

### Q: 环境变量包含引号导致错误

Docker `--env-file` 会将引号作为值的一部分，确保 `.env.docker` 中的值不带引号：

```bash
# 错误
DATABASE_URL="postgresql://..."

# 正确
DATABASE_URL=postgresql://...
```

---

## 相关文件

- `Dockerfile` - Docker 构建配置
- `docker-compose.yml` - Docker Compose 配置
- `.env.docker.example` - 环境变量模板
- `pixelto.com.conf` - Nginx 配置示例
- `packages/database/prisma/schema.prisma` - 数据库 Schema
