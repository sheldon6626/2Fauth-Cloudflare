# 2Fauth-Cloudflare

> 基于 Cloudflare Workers + D1 的轻量级两步验证（2FA）管理器，原生支持 TOTP / HOTP、分组、用户角色、加密备份，以及面向 Android 应用与浏览器扩展的 Bearer Token API。

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![D1](https://img.shields.io/badge/Storage-D1-F38020?logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/d1/)

---

## ⚠️ 重要声明与警告

> **使用前请仔细阅读本节。部署本项目即表示你已理解并接受以下全部条款。**

### 1. 免责声明

- 本项目以 **"按原样"（AS IS）** 方式提供，**不附带任何明示或暗示的保证**，包括但不限于适销性、特定用途适用性、安全性与无错误运行。
- 作者与贡献者 **不对因使用、误用或无法使用本项目所造成的任何直接或间接损失负责**（包括但不限于账户被盗、OTP 密钥泄露、数据丢失、业务中断等）。
- 你应在生产环境部署前 **自行进行安全审计、渗透测试与风险评估**，并持续关注后续版本的安全更新。

### 2. 数据丢失与密钥管理

- `ENCRYPTION_KEY`、`SESSION_PEPPER` 与数据库中的 OTP 密钥一旦丢失，**所有加密数据将永久不可恢复**。
- **请务必在安全的离线位置（如密码管理器、加密 USB、纸质保险柜）备份所有密钥与 `wrangler.toml` 配置**。
- 轮换密钥需要制定迁移计划；**任何密钥变更都会让旧密钥下的历史数据在下线后无法解密**。
- D1 数据库本身 **不在本项目的备份范围之内**；请按 Cloudflare 的最佳实践自行启用定期导出与跨区域复制。

### 3. 合规使用

- 本项目仅供 **合法的个人或组织自托管 2FA 管理** 使用。**禁止** 用于：
  - 任何违反所在地法律法规的用途；
  - 未授权访问他人账户、绕过他人安全措施；
  - 存储、传播或处理任何违法、侵权、违反隐私法规的内容。
- 你有责任确保你的部署行为符合所在地区的数据保护法律（如 GDPR、PIPL、CCPA 等）。
- 在欧盟、英国等地区部署时，请评估是否需要发布隐私政策、Cookie 横幅与数据处理协议。

### 4. 生产环境警告

- **绝不要** 直接将包含真实密钥的 `wrangler.toml`、`dev.vars`、`.dev.vars` 提交到 Git 仓库。
- **绝不要** 在公共设备上使用未加密的明文导出（`/api/export`、`/api/export/otpauth`）。
- **绝不要** 关闭 `ENCRYPTION_KEY` 派生机制或使用弱口令作为 `ENCRYPTION_KEY` 源。
- 首次部署时 **必须** 通过 Cloudflare Access / IP 白名单 / 临时密码保护等手段限制引导端点被外部探测。
- 不要在没有 Turnstile 或等价风控机制的情况下 **直接暴露到公网**，否则可能遭受暴力破解。
- 升级前请务必在测试环境验证 **迁移脚本与密钥兼容性**；一旦生产环境出现不可解密的数据，**无法回滚**。

### 5. 安全漏洞报告

- 请 **不要** 在 GitHub Issues、Discussions 或任何公开渠道披露未修复的安全漏洞。
- 私下联系维护者，并在修复完成后再公开讨论。
- 详细的安全审计记录与已知问题见 [`SECURITY-AUDIT.md`](./SECURITY-AUDIT.md) 与 [`SECURITY-AUDIT-v2.md`](./SECURITY-AUDIT-v2.md)。

### 6. 无 SLA 承诺

- 本项目由社区维护，**不承诺任何形式的可用性、响应时间或修复时效**。
- 不要将本项目用于不能容忍偶发不可用的关键业务场景。
- 重大变更（包括破坏性 API 变更、迁移要求）可能随时发生，请关注 Release Notes 与 CHANGELOG。

### 7. 第三方依赖

- 本项目依赖 Cloudflare Workers / D1、Node.js 标准库及少量第三方包。
- 这些依赖自身的漏洞、安全公告与可用性 **不在本项目作者控制范围之内**。
- 建议订阅 [GitHub Security Advisories](https://github.com/advisories) 与 Cloudflare 的状态页。

---

**继续阅读或部署本项目即表示你已阅读、理解并同意上述全部声明与警告。**

---

## 目录

- [⚠️ 重要声明与警告](#️-重要声明与警告)
- [功能特性](#功能特性)
- [架构概览](#架构概览)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [配置说明](#配置说明)
- [数据库迁移](#数据库迁移)
- [首次部署引导](#首次部署引导)
- [API 参考](#api-参考)
- [安全模型](#安全模型)
- [运维与维护](#运维与维护)
- [测试](#测试)
- [部署](#部署)
- [常见问题](#常见问题)

---

## 功能特性

| 分类 | 能力 |
|---|---|
| **Web UI** | 单页应用、HttpOnly 会话 Cookie、可选 Cloudflare Turnstile、严格 CSP |
| **OTP 条目** | TOTP / HOTP、SHA-1 / SHA-256 / SHA-512、分组、二维码扫描、分组/拖拽排序 |
| **用户与权限** | 管理员 / 普通用户角色、登录风控策略、密码自助修改与重置 |
| **数据迁移** | JSON 备份、`otpauth://` URI 导入导出、AES-GCM 加密备份 |
| **API（稳定）** | `/api/v1` Bearer Token 协议，面向 Android 应用和浏览器扩展 |
| **API（兼容）** | 旧版 `/api/mobile/*`、`/api/extension/*` 和 Web UI 路由仍可用 |
| **安全** | PBKDF2-SHA256 密码哈希、5 分钟敏感操作再认证、TOTP 校验与 HOTP 消费独立限速 |

---

## 架构概览

```
┌──────────────────────┐        ┌──────────────────────┐
│  Browser / Extension │ HTTPS  │  Cloudflare Worker   │
│   (Web UI + Bearer)  ├───────►│   src/worker.js      │
└──────────────────────┘        │  (路由 + 鉴权 + 限速) │
                                └──────────┬───────────┘
                                           │ SQL
                                           ▼
                                ┌──────────────────────┐
                                │   Cloudflare D1      │
                                │   migrations/*.sql   │
                                └──────────────────────┘
```

- **运行时**：Cloudflare Workers（V8 隔离，无冷启动）
- **存储**：Cloudflare D1（SQLite，单区域读多写少）
- **加密**：AES-GCM（条目密钥由 `ENCRYPTION_KEY` 派生；备份密钥由 PBKDF2 派生自口令）
- **会话**：HttpOnly `__Host-session` Cookie（Web UI）+ 随机 32 字节十六进制 Bearer Token（API）

---

## 快速开始

环境要求：Node.js 18+ 与 `npm`。

```bash
# 1. 安装依赖
npm install

# 2. 编辑 wrangler.toml，填入你的 D1 database_id
#    （首次创建：npx wrangler d1 create worker-2fauth-db）

# 3. 生成并写入运行时密钥
openssl rand -base64 32 | npx wrangler secret put ENCRYPTION_KEY
openssl rand -base64 32 | npx wrangler secret put SESSION_PEPPER
openssl rand -base64 32 | npx wrangler secret put BOOTSTRAP_TOKEN

# 4. 应用数据库迁移（本地）
npm run d1:migrate:local

# 5. 启动本地开发服务器
npm run dev
```

打开本地 URL，通过 Web UI 输入 `BOOTSTRAP_TOKEN` 完成首个管理员创建。

> ⚠️ 首次部署到生产环境前请先阅读 [首次部署引导](#首次部署引导) 一节，避免把未初始化的 Worker 暴露在公网。

---

## 项目结构

```
.
├── src/
│   ├── worker.js           # 入口：路由、鉴权、限速、加密、OTP 生成
│   └── ui/                 # 内嵌的 Web UI（无构建步骤，运行时渲染）
├── migrations/             # 编号化的 D1 SQL 迁移脚本
├── tests/                  # Node.js 内置测试（node --test）
├── wrangler.toml           # Worker 与 D1 绑定配置
├── package.json            # npm 脚本与依赖
├── README.md               # 本文件
├── API.md                  # 稳定的 API 契约（英文）
└── API.zh-CN.md            # API 契约的中文翻译
```

> 运行时所有路由、鉴权、限速、加密逻辑都在 `src/worker.js` 中；新增功能请优先在该文件中添加辅助函数，而不是在 UI 中内嵌业务规则。

---

## 配置说明

### `wrangler.toml`

```toml
name = "worker-2fauth"
main = "src/worker.js"
compatibility_date = "2025-01-01"

[[d1_databases]]
binding = "DB"
database_name = "worker-2fauth-db"
database_id = "<your-d1-database-id>"
```

### 必填 Secrets

| 名称 | 用途 | 生成方式 |
|---|---|---|
| `ENCRYPTION_KEY` | AES-GCM 主密钥，**32 字节** base64 | `openssl rand -base64 32` |
| `SESSION_PEPPER` | 会话/Refresh Token 的 HMAC pepper | `openssl rand -base64 32` |
| `BOOTSTRAP_TOKEN` | 首次创建管理员的引导令牌（可用 `INIT_SECRET` 代替） | `openssl rand -base64 32` |

> 轮换 `ENCRYPTION_KEY` / `SESSION_PEPPER` 前必须制定迁移计划，否则历史数据将无法解密或会话校验失败。

### 可选环境变量（`wrangler.toml` 的 `[vars]` 段）

| 名称 | 默认值 | 说明 |
|---|---|---|
| `ALLOW_PLAINTEXT_EXPORT` | `false` | 是否允许 `/api/export` 与 `/api/export/otpauth`。**默认关闭**；请仅在确实需要时临时开启 |
| `CORS_ALLOWED_ORIGINS` | 空 | 浏览器扩展/HTTPS 客户端的精确来源白名单，逗号分隔，例如 `chrome-extension://<id>,https://app.example.com` |
| `TURNSTILE_SECRET_KEY`（或 `TURNSTILE_KEY`） | 空 | 启用后 Web/Android 登录需校验 Turnstile Token |
| `TURNSTILE_SITE_KEY` | 空 | Web UI 渲染 Turnstile 组件的 Site Key |
| `TURNSTILE_ALLOWED_HOSTNAMES` | 空 | 多域名部署的 Turnstile hostname 白名单，缺省时强制使用请求自身的 hostname |
| `API_RATE_MAX_REQUESTS_PER_MINUTE` | `120` | API 每会话/IP 每分钟请求上限 |
| `ENCRYPTED_IMPORT_MAX_REQUESTS_PER_MINUTE` | `5` | 加密导入每分钟请求上限 |
| `ENCRYPTED_IMPORT_LOCK_MINUTES` | `15` | 加密导入超限后的封禁时长 |
| `BOOTSTRAP_MAX_REQUESTS_PER_MINUTE` | `5` | 引导令牌每分钟尝试上限 |
| `BOOTSTRAP_LOCK_MINUTES` | `15` | 引导令牌超限后的封禁时长 |
| `DEBUG_ERRORS` | `false` | 仅在显式 `development` / `staging` 环境开启，把内部错误写入 JSON 响应 |

> 详细的 401 / 403 / 429 行为、TOTP 校验和 HOTP 消费的额外限速策略请参考 [API 文档](./API.md)。

---

## 数据库迁移

```bash
# 本地 D1
npm run d1:migrate:local

# 远程 D1（生产）
npm run d1:migrate:remote
```

当前迁移链包含：API 会话表与索引、登录风控表、Refresh Token 清理索引、客户端类型字段、会话再认证时间戳、引导完成哨兵、条目排序字段等。**所有迁移都是前向兼容的**，新部署可以一次性应用全部脚本。

---

## 首次部署引导

新的部署在创建任何用户之前处于"未初始化"状态，需要通过 `BOOTSTRAP_TOKEN` 创建首个管理员账户。**强烈建议**按以下顺序操作：

1. 在 Wrangler 中设置 `ENCRYPTION_KEY`、`SESSION_PEPPER`、`BOOTSTRAP_TOKEN`。
2. 部署后**先临时限制访问**（例如通过 Cloudflare Access 或 IP 白名单），避免引导端点被外部探测。
3. 打开 Web UI，输入 `BOOTSTRAP_TOKEN` 完成首个管理员创建。
4. 验证登录可用后，移除临时访问限制。
5. （可选）登录管理员后台删除 `BOOTSTRAP_TOKEN` secret，使引导端点永久失效。

> 一旦数据库中至少存在一个用户，迁移 `0009_step_up_bootstrap.sql` 会写入 `bootstrap_completed` 哨兵；并发的引导请求中只有一条会成功，其他会返回 `400 Already initialized`。

也可以通过 API 直接引导：

```bash
curl -X POST https://<your-worker>/api/bootstrap \
  -H "X-Bootstrap-Token: $BOOTSTRAP_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Strong-Password-1!Aa"}'
```

---

## API 参考

完整的稳定 API 契约见：

- 英文版：[`API.md`](./API.md)
- 中文版：[`API.zh-CN.md`](./API.zh-CN.md)

快速入口（均使用 `Authorization: Bearer <token>` 鉴权）：

| 用途 | 端点 |
|---|---|
| 查询服务端能力 | `GET /api/v1/capabilities` |
| 登录 | `POST /api/v1/auth/login` |
| 刷新 Token | `POST /api/v1/auth/refresh` |
| 登出 | `POST /api/v1/auth/logout` |
| 当前用户 | `GET /api/v1/me` |
| 列出条目 | `GET /api/v1/entries` |
| 批量获取验证码 | `POST /api/v1/codes/batch` |

旧版 `/api/mobile/*`、`/api/extension/*` 与 Web UI 路由仍可继续使用，但不再扩展新能力。

---

## 安全模型

- **认证分离**：Web UI Cookie 与 `/api/v1` Bearer Token **不能**同时使用，否则请求被拒绝（防止 CSRF 与限速桶混淆）。
- **强密码策略**：12–256 字符，必须包含大写、小写、数字、符号。PBKDF2-SHA256 100 000 次迭代；旧哈希自动升级。
- **会话保护**：
  - Web 会话 30 天绝对生命周期；每次读取会顺延 TTL。
  - API Refresh Token 90 天绝对生命周期，每次刷新**强制轮换**。
  - 登录成功后旧的同用户会话会被撤销（防会话固定）。
- **敏感操作再认证**（5 分钟窗口）：导出、删除/重置其他用户等操作需要当前密码确认。
- **加密**：
  - D1 中的 OTP 密钥使用 AES-GCM 加密（密钥由 `ENCRYPTION_KEY` 派生并加 TTL 缓存）。
  - 备份使用 AES-GCM + PBKDF2-SHA256（180 000 次迭代，最小口令 12 字符）。
- **CORS**：只接受**精确匹配**的白名单来源；不发送 `Access-Control-Allow-Credentials`；本地 `http://localhost` 仅供开发。
- **CSP / 浏览器头**：严格 CSP、COOP=`same-origin`、Permissions-Policy 仅放开相机（自源）。
- **客户端输入**：`/api/import/encrypted`、`/api/bootstrap`、TOTP 校验、HOTP 消费各自有独立的 IP/会话级限速。
- **安全响应头**：所有响应附带 HSTS、X-Content-Type-Options、X-Frame-Options、Referrer-Policy、Permissions-Policy 等。

详细漏洞与修复历史见 [`SECURITY-AUDIT.md`](./SECURITY-AUDIT.md) 和 [`SECURITY-AUDIT-v2.md`](./SECURITY-AUDIT-v2.md)。

---

## 运维与维护

- **后台任务**：Worker 的 `scheduled` handler 会定期清理过期会话与登录风控表。需要在 `wrangler.toml` 中配置 `[triggers] crons = ["..."]` 才会触发。
- **数据备份**：定期使用 `/api/v1/export/encrypted` 生成加密备份；**绝不要**在共享环境里开启明文导出。
- **密钥轮换**：制定计划 → 双密钥并行读取 → 批量重加密 → 下线旧密钥；任何密钥变更都会让历史数据在旧密钥删除后**无法恢复**。
- **日志**：默认不向客户端暴露内部错误；如需排障，临时把 `DEBUG_ERRORS=true` 与 `ENVIRONMENT=development` 同时设置即可。
- **审计**：`/api/security/login-policy`（管理员）可调整登录风控阈值。

---

## 测试

```bash
npm test               # node --test
node --check src/worker.js   # 语法快速校验
```

测试覆盖：CORS、JSON 解析、Turnstile 配置、Bearer 会话、Refresh 轮换、HTML 安全头、Web vs Bearer 鉴权边界、再认证、引导硬化、登录风控清理与关键 RBAC 回归。

---

## 部署

```bash
npm run deploy
```

部署前确认事项：

- [x] `wrangler.toml` 中 `database_id` 已填写
- [x] 三个必填 Secret 已写入远端
- [x] 已应用远程迁移（`npm run d1:migrate:remote`）
- [x] 已临时限制访问，完成首个管理员创建
- [x] `ALLOW_PLAINTEXT_EXPORT` 保持 `false`
- [x] `CORS_ALLOWED_ORIGINS` 已精确填写真实来源

---

## 常见问题

**Q：忘记管理员密码怎么办？**
A：在 D1 控制台用 `wrangler d1 execute worker-2fauth-db --command "UPDATE users SET ..."` 重置（请先阅读 `src/worker.js` 中的 `hashPassword` 流程生成正确的 `password_hash` / `password_salt`）。生产环境推荐直接用 `POST /api/users` 由管理员创建新账号。

**Q：能关闭 Turnstile 吗？**
A：清空 `TURNSTILE_SECRET_KEY` / `TURNSTILE_KEY` 即可。Web UI 在检测到未配置时不会渲染 Turnstile 组件。

**Q：扩展被 CORS 拦截。**
A：在 `CORS_ALLOWED_ORIGINS` 中加入扩展的精确来源，例如 `chrome-extension://your-extension-id`。**不要**使用通配符。

**Q：导出备份能否跨 Worker 迁移？**
A：可以，但 `ENCRYPTION_KEY` 必须保持一致；或者使用加密备份（口令派生密钥），只需要口令即可在不同 Worker 之间迁移。

---

## 许可证

本项目以 MIT 协议发布。
