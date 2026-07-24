# 2Fauth-Cloudflare 部署指南

> 将 2Fauth-Cloudflare 部署到 Cloudflare Workers + D1 的完整指南。

> 💡 **已检测到项目根目录下的 `.env` 配置文件：**
> - `CLOUDFLARE_ACCOUNT_ID`: 已配置 (`9f6fabd6c1a9de0341270ab26eca469c`)
> - `CLOUDFLARE_API_TOKEN`: 已配置 (`cfut_...`)
>
> 部署脚本 (`deploy.ps1` 和 `setup.mjs`) 会自动加载该文件中的 Cloudflare 凭据，无需手动登录。


---

## 前置条件

| 工具 | 最低版本 | 安装方式 |
|------|---------|---------|
| Node.js | v18+ | https://nodejs.org |
| npm | v9+ | 随 Node.js 安装 |
| Wrangler CLI | v4+ | `npm install -g wrangler` |
| Git | any | https://git-scm.com |
| Cloudflare 账号 | 免费即可 | https://dash.cloudflare.com/sign-up |

---

## 步骤一：克隆仓库

```bash
git clone https://github.com/dengrb1/2Fauth-Cloudflare.git
cd 2Fauth-Cloudflare
```

## 步骤二：安装依赖

```bash
npm install
```

这将安装 `wrangler` 作为开发依赖。

## 步骤三：登录 Cloudflare

```bash
npx wrangler login
```

浏览器会打开 Cloudflare 授权页面，点击 **Allow** 完成授权。

验证登录状态：

```bash
npx wrangler whoami
```

## 步骤四：创建 D1 数据库

```bash
npx wrangler d1 create worker-2fauth-db
```

命令输出会包含 `database_id`，记录下来。输出类似：

```
✅ Successfully created DB 'worker-2fauth-db'

[[d1_databases]]
binding = "DB"
database_name = "worker-2fauth-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

## 步骤五：配置 wrangler.toml

编辑项目根目录的 `wrangler.toml`，将 `database_id` 替换为你自己的：

```toml
name = "worker-2fauth"
main = "src/worker.js"
compatibility_date = "2025-01-01"

[[d1_databases]]
binding = "DB"
database_name = "worker-2fauth-db"
database_id = "<你的-d1-database-id>"

[vars]
ALLOW_PLAINTEXT_EXPORT = "false"
```

## 步骤六：生成并设置密钥

### 6.1 生成 ENCRYPTION_KEY（32 字节 base64）

**Linux/macOS:**
```bash
openssl rand -base64 32
```

**Windows PowerShell:**
```powershell
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
[Convert]::ToBase64String($bytes)
```

**或者使用 Node.js（跨平台）:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 6.2 设置 Wrangler Secrets

```bash
# 粘贴上面生成的 32 字节 base64 值
npx wrangler secret put ENCRYPTION_KEY

# 生成并粘贴一个随机字符串作为会话 pepper
npx wrangler secret put SESSION_PEPPER

# 生成并粘贴一个随机字符串作为首次初始化令牌
npx wrangler secret put BOOTSTRAP_TOKEN
```

每次执行会提示 `Enter a secret value:`，粘贴对应值并回车。

### 6.3 可选密钥

```bash
# Turnstile 人机验证（可选，在 Cloudflare Dashboard 创建）
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler secret put TURNSTILE_SITE_KEY

# 浏览器扩展/客户端 CORS 白名单（可选）
npx wrangler secret put CORS_ALLOWED_ORIGINS
# 值示例: chrome-extension://abc123,moz-extension://def456
```

## 步骤七：执行数据库迁移

```bash
# 远程数据库迁移（生产环境）
npm run d1:migrate:remote
```

这将依次执行 9 个迁移文件（0001 到 0009），创建所有必要的表和索引。

## 步骤八：部署 Worker

```bash
npm run deploy
# 或者
npx wrangler deploy
```

部署成功后会输出 Worker URL，类似：

```
Published worker-2fauth (1.23 sec)
  https://worker-2fauth.<your-subdomain>.workers.dev
```

## 步骤九：初始化管理员账户

打开 Worker URL，首次访问会显示 Bootstrap 页面。

1. 在页面输入你设置的 `BOOTSTRAP_TOKEN` 值
2. 设置管理员用户名和密码（密码要求：12-256 字符，包含大小写字母、数字和符号）
3. 点击创建

⚠️ **Bootstrap 只能执行一次，创建成功后该入口永久关闭。**

### 通过 API 初始化（可选）

```bash
curl -X POST https://worker-2fauth.<subdomain>.workers.dev/api/bootstrap \
  -H "Content-Type: application/json" \
  -d '{
    "bootstrapToken": "<你的BOOTSTRAP_TOKEN>",
    "username": "admin",
    "password": "YourStr0ng!Pass#2025"
  }'
```

---

## 步骤十：验证部署

```bash
# 检查 API 能力端点
curl https://worker-2fauth.<subdomain>.workers.dev/api/v1/capabilities

# 运行项目测试
npm test
```

---

## 自定义域名（可选）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** → 选择 `worker-2fauth`
3. 点击 **Settings** → **Triggers** → **Custom Domains**
4. 添加你的域名（如 `2fa.yourdomain.com`）
5. Cloudflare 会自动配置 DNS 和 SSL

---

## 安全建议

- 🔑 **不要提交** 真实的 secrets 或 `BOOTSTRAP_TOKEN` 到 Git
- 🔒 首次部署时建议通过 [Cloudflare Access](https://one.dash.cloudflare.com) 限制访问
- 📦 导出数据视为敏感信息，优先使用加密导出
- 🔐 `ENCRYPTION_KEY` 和 `SESSION_PEPPER` 一旦设置不要随意更改
- 🚫 不要在同一请求中混用 Web UI cookie 和 API bearer token
- 🌐 `CORS_ALLOWED_ORIGINS` 使用精确的扩展 origin，不要用通配符

---

## 本地开发

```bash
# 本地数据库迁移
npm run d1:migrate:local

# 启动开发服务器
npm run dev
```

打开本地 Worker URL，从 Web UI 完成 Bootstrap 初始化。

---

## 更新部署

```bash
git pull origin main
npm install
npm run d1:migrate:remote   # 执行新迁移（如有）
npm run deploy
```

---

## 故障排查

| 问题 | 解决方案 |
|------|---------|
| `wrangler login` 失败 | 检查网络连接，尝试 `npx wrangler login --browser` |
| D1 迁移失败 | 确认 `database_id` 正确，检查 `wrangler.toml` |
| Bootstrap 报错 | 确认 `BOOTSTRAP_TOKEN` 已设置且值匹配 |
| 密码不符合要求 | 12-256 字符，需包含大写、小写、数字、符号 |
| CORS 错误 | 检查 `CORS_ALLOWED_ORIGINS` 格式 |
| Worker 500 错误 | 设置 `DEBUG_ERRORS=true`（仅限调试），检查 `wrangler tail` |

---

## 架构概览

```
┌──────────────┐     ┌──────────────────┐     ┌─────────┐
│  Web Browser │────▶│  Cloudflare      │────▶│  D1     │
│  / App       │     │  Worker          │     │  数据库  │
│  / Extension │     │  (worker-2fauth) │     │         │
└──────────────┘     └──────────────────┘     └─────────┘
                           │
                     ┌─────┴─────┐
                     │ AES-GCM   │
                     │ 加密存储   │
                     └───────────┘
```

## API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/v1/capabilities` | GET | 服务能力查询 |
| `/api/v1/auth/login` | POST | 用户登录 |
| `/api/v1/auth/refresh` | POST | 刷新令牌 |
| `/api/v1/auth/logout` | POST | 登出 |
| `/api/v1/me` | GET | 当前用户信息 |
| `/api/v1/entries` | GET/POST | OTP 条目管理 |
| `/api/v1/codes/batch` | POST | 批量生成验证码 |
| `/api/bootstrap` | POST | 首次初始化（一次性） |

---

## 相关链接

- 📖 [完整 API 文档](API.md)
- 🔒 [安全审计报告](SECURITY_AUDIT_REPORT.md)
- 🏗️ [GitHub 仓库](https://github.com/dengrb1/2Fauth-Cloudflare)
- ☁️ [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- 🗄️ [Cloudflare D1 文档](https://developers.cloudflare.com/d1/)
