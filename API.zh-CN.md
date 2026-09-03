# API 契约

本 Worker 保留了原有 Web UI 路由，并对外暴露稳定的 `/api/v1` Bearer Token 路由，供 Android 原生应用与浏览器扩展使用。

> 本文档是 [`API.md`](./API.md) 的中文翻译。两侧内容必须保持一致；如有不一致请以英文版为准并提交 PR。

## 约定

- 除显式说明外，所有请求与响应体均为 JSON。（唯一的非 JSON 响应是 `POST /api/export/otpauth`，返回 `text/plain`。）
- 每个请求的 JSON 请求体上限为 **1 MiB**。加密导入与 otpauth 导入端点有更严格的路由级限制，参见 [限速策略](#限速策略)。
- 响应中的时间戳为 Unix 纪元秒（UTC），字段名以 `At` 结尾的除外（这些字段是 ISO 8601 字符串）。
- 错误响应统一使用 `{ "error": "message" }` 结构。被限流的响应额外包含 `retryAfterSeconds` 字段以及 `Retry-After` 响应头。

## 客户端认证

每个请求**必须**且只能使用一种认证方式。请勿同时发送 Web UI 的 `__Host-session` Cookie 与 `Authorization: Bearer ...` 头，混合认证请求会被拒绝（`400 Do not send both Cookie session and Authorization bearer token`）。

| 接入面 | 鉴权方式 | 说明 |
|---|---|---|
| Web UI（`/`、`/api/...` 的 Cookie 路由） | `__Host-session` HttpOnly Cookie | 由 `/api/login` 与 `/api/bootstrap` 颁发 |
| 稳定 API（`/api/v1/*`） | `Authorization: Bearer <accessToken>` | 由 `/api/v1/auth/login` 或 `/api/v1/auth/refresh` 颁发 |
| 旧版 Mobile（`/api/mobile/*`） | `Authorization: Bearer <accessToken>` | 仅限 Android 客户端类型 |
| 旧版 Extension（`/api/extension/*`） | `Authorization: Bearer <accessToken>` | 仅限浏览器扩展客户端类型 |
| 引导（`/api/bootstrap`） | `X-Bootstrap-Token` 请求头（亦可使用 `X-Init-Secret` 或 `bootstrapToken` 请求体字段） | 一次性使用，须在首位管理员创建前调用 |

Bearer Token 是不透明的 64 字符十六进制字符串（32 字节随机数）。

---

## 引导（Bootstrap）

### `POST /api/bootstrap`

仅在数据库中尚无任何用户时用于创建首位管理员账户。

**必填请求头：**

```http
X-Bootstrap-Token: <BOOTSTRAP_TOKEN>
```

`BOOTSTRAP_TOKEN`（或 `INIT_SECRET`）必须通过 `wrangler secret put BOOTSTRAP_TOKEN` 配置。如果令牌缺失或错误，空部署将无法初始化。该端点有基于源 IP 的失败次数限速与封禁（参见 [限速策略](#限速策略)）。

**请求体：**

```json
{
  "username": "admin",
  "password": "Strong-Password-1!Aa"
}
```

**响应：**`201 Created`

```json
{
  "ok": true,
  "user": { "id": 1, "username": "admin", "role": "admin" }
}
```

成功后会设置 `__Host-session` Cookie。一旦数据库中存在任何用户，端点将永久返回 `400 Already initialized`。

---

## 能力发现

### `GET /api/v1/capabilities`

在登录前返回运行时 API 元信息，供 Android 应用与浏览器扩展使用。**不参与限速**。

**响应：**`200 OK`

```json
{
  "apiVersion": "v1",
  "compatibleClients": ["android", "browser_extension"],
  "auth": {
    "scheme": "Bearer",
    "accessTokenExpiresIn": 604800,
    "refreshTokenExpiresIn": 7776000,
    "refreshTokenRotation": true,
    "turnstileRequired": false,
    "turnstileSiteKey": ""
  },
  "limits": {
    "extensionBatchMaxIds": 100
  },
  "cors": {
    "exactOriginAllowlist": true,
    "configured": true,
    "credentials": false
  },
  "endpoints": {
    "login": "/api/v1/auth/login",
    "refresh": "/api/v1/auth/refresh",
    "logout": "/api/v1/auth/logout",
    "me": "/api/v1/me",
    "changePassword": "/api/v1/me/password",
    "entries": "/api/v1/entries",
    "groups": "/api/v1/groups",
    "codesBatch": "/api/v1/codes/batch",
    "importOtpAuth": "/api/v1/import/otpauth",
    "exportEncrypted": "/api/v1/export/encrypted",
    "importEncrypted": "/api/v1/import/encrypted"
  }
}
```

字段说明：

- `auth.accessTokenExpiresIn` —— Access Token 有效期（秒），固定 7 天。
- `auth.refreshTokenExpiresIn` —— Refresh Token 有效期（秒），固定 90 天。**绝对**最长期限同样为 90 天，频繁刷新不能无限延长。
- `auth.refreshTokenRotation` —— 恒为 `true`。每次成功刷新都会颁发新的 Refresh Token 并使旧的失效。
- `auth.turnstileRequired` —— 当设置了 `TURNSTILE_SECRET_KEY`（或 `TURNSTILE_KEY`）时为 `true`，客户端登录时必须携带针对当前请求 hostname 的 `turnstileToken`。
- `auth.turnstileSiteKey` —— `TURNSTILE_SITE_KEY` 的值；未配置 Turnstile 时为空字符串。
- `limits.extensionBatchMaxIds` —— 批量验证码接口接受的 `entryIds` 上限。
- `cors.exactOriginAllowlist` —— 恒为 `true`。通配符与非本地 `http://` 来源会被拒绝。
- `cors.configured` —— 当 `CORS_ALLOWED_ORIGINS` 至少包含一个来源时为 `true`。
- `cors.credentials` —— 恒为 `false`。API 永远不会发送 `Access-Control-Allow-Credentials`。

---

## Bearer Token 生命周期

### `POST /api/v1/auth/login`

**请求：**

```json
{
  "username": "alice",
  "password": "Strong-Password-1!Aa",
  "clientType": "android"
}
```

- `clientType` 必须为 `android` 或 `browser_extension`，缺省值为 `android`。
- 启用 Turnstile 时，需附带针对当前请求 hostname 的 `turnstileToken`。
- 密码必须为 12–256 字符，并同时包含大写字母、小写字母、数字、符号。

浏览器扩展请使用 `"clientType": "browser_extension"`，并可附带：

```json
{
  "deviceName": "edge",
  "clientVersion": "1.0.0"
}
```

`deviceName`（最长 120 字符）和 `clientVersion`（最长 64 字符）会被过滤为 `[A-Za-z0-9._- ]`，仅用于审计。

**响应：**`200 OK`

```json
{
  "ok": true,
  "user": { "id": 1, "username": "alice", "role": "user" },
  "accessToken": "...",
  "refreshToken": "...",
  "expiresIn": 604800,
  "refreshExpiresIn": 7776000,
  "sessionId": 1
}
```

同一用户的既有 `__Host-session` Cookie 会被吊销；既有的 `api_sessions` 记录也会被删除——同一时刻只允许每个用户保留一个 API 会话。

### `POST /api/v1/auth/refresh`

**请求：**

```json
{
  "refreshToken": "...",
  "clientType": "android"
}
```

`clientType` 必须与登录时保持一致（`android` ↔ `android`，`browser_extension` ↔ 扩展）。每次成功刷新都会轮换 Refresh Token；重放旧 Refresh Token 会返回 `409 Refresh token already used`。

**响应：**`200 OK`

```json
{
  "ok": true,
  "user": { "id": 1, "username": "alice", "role": "user" },
  "accessToken": "...",
  "refreshToken": "...",
  "expiresIn": 604800,
  "refreshExpiresIn": 7776000
}
```

### `POST /api/v1/auth/logout`

需要 `Authorization: Bearer <accessToken>`。删除当前 `api_sessions` 记录。始终返回 `{ "ok": true }`（即便 Token 已经失效）。

---

## 个人信息

### `GET /api/v1/me`

需要 `Authorization: Bearer <accessToken>`。

**响应：**`200 OK`

```json
{ "user": { "id": 1, "username": "alice", "role": "user" } }
```

### `PATCH /api/v1/me/password`

需要 `Authorization: Bearer <accessToken>`。

**请求：**

```json
{
  "currentPassword": "Strong-Password-1!Aa",
  "newPassword": "New-Strong-Password-1!Aa"
}
```

为兼容旧客户端，`oldPassword` 与 `password` 分别被视作 `currentPassword` 与 `newPassword` 的别名。

**响应：**`200 OK`，返回 `{ "ok": true }`。同一用户的所有会话（Web 与 API）都会被吊销；当前请求中的 Bearer Token 立即失效，需重新调用 `/api/v1/auth/login` 获取新 Token。

---

## OTP 条目

所有条目路由同时支持 Bearer Token（位于 `/api/v1/entries/...`）和 Web UI Cookie（位于 `/api/entries/...`），除前缀外语义完全一致。Web UI Cookie 写操作还须满足 [Web Cookie 写操作](#web-cookie-写操作) 中描述的同源校验。

非管理员用户只能读写自己的条目；管理员可通过请求体中的 `userId` 操作任意用户的条目。

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET`    | `/api/v1/entries`                | 列出对调用者可见的条目（管理员看到全部） |
| `POST`   | `/api/v1/entries`                | 创建 TOTP 或 HOTP 条目 |
| `PATCH`  | `/api/v1/entries/order`          | 按 ID 列表重排条目 |
| `PATCH`  | `/api/v1/entries/:id`            | 更新条目（label、issuer、secret、digits、period、algorithm、otpType、hotpCounter、enabled、groupId） |
| `DELETE` | `/api/v1/entries/:id`            | 删除条目 |
| `GET`    | `/api/v1/entries/:id/code`       | 计算 TOTP 验证码（HOTP 返回 `400 Use /api/entries/:id/hotp`） |
| `POST`   | `/api/v1/entries/:id/verify`     | 在 ±1 时间步窗口内校验提交的 TOTP 验证码 |
| `POST`   | `/api/v1/entries/:id/hotp`       | 消费一个 HOTP 验证码并原子自增计数器 |

### 创建 / 更新字段

- `label`（字符串，必填，1–200 字符）——显示名称。
- `issuer`（字符串，可选，最长 100 字符）。
- `secret`（字符串，必填）——base32 编码的共享密钥，16–256 字符；为方便使用也允许直接传入完整 `otpauth://` URI。
- `digits`（6 / 7 / 8，缺省 `6`）。
- `period`（15–120，缺省 `30`；仅 TOTP）。
- `algorithm`（`SHA-1` / `SHA-256` / `SHA-512`；别名 `SHA1`、`SHA256`、`SHA512` 会被标准化）。为兼容历史数据，缺省为 `SHA-1`。
- `otpType`（`totp` / `hotp`，缺省 `totp`）。
- `hotpCounter`（非负整数，缺省 `0`；仅 HOTP）。
- `enabled`（布尔值，缺省 `true`）。
- `groupId`（正整数或 `null`，可选）。必须属于该条目的拥有者。
- `userId`（仅管理员，正整数）——将条目分配给其他用户。

`PATCH` 的所有字段均为可选；只更新提供的字段。设置 `secret` 会校验新的 base32 并重新加密条目。

**响应：**创建返回 `201 Created`，更新返回 `200 OK`；创建时响应体为 `{ "ok": true, "id": <id> }`。

### 重排

`PATCH /api/v1/entries/order` 替换调用者条目的排序。

```json
{ "orderedIds": [3, 1, 2] }
```

- 单次请求最多 500 个 ID；所有 ID 必须唯一、为正整数，且必须是调用者可见的条目。
- 空数组是空操作，直接返回 `{ "ok": true }`。

### 校验 TOTP

`POST /api/v1/entries/:id/verify` 在 ±1 时间步窗口内校验提交的 TOTP 验证码，并返回匹配的时间步偏移。

```json
{ "code": "123456" }
```

```json
{ "ok": true, "valid": true, "window": 0 }
```

校验失败时返回 `{ "ok": true, "valid": false }`（无 `window` 字段）。该端点按条目与会话/IP 限速（默认每分钟 10 次，超限后锁定 5 分钟）。

### 消费 HOTP

`POST /api/v1/entries/:id/hotp` 原子地自增存储中的计数器（单条 `UPDATE ... RETURNING`），并返回**自增前**计数器对应的验证码。

```json
{ "code": "123456", "counter": 7, "nextCounter": 8, "otpType": "hotp" }
```

若并发请求先到一步，输家会收到 `409 HOTP code already consumed, please retry`。该端点按条目限速（默认每分钟 5 次，超限后锁定 5 分钟）。

### 列表响应

`GET /api/v1/entries` 返回：

```json
{
  "entries": [
    {
      "id": 1,
      "user_id": 1,
      "username": "alice",
      "label": "GitHub",
      "issuer": "GitHub",
      "digits": 6,
      "period": 30,
      "algorithm": "SHA-1",
      "otp_type": "totp",
      "hotp_counter": 0,
      "enabled": 1,
      "group_id": null,
      "group_name": null,
      "group_color": null,
      "sort_order": 0,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

列表响应**永远不会**包含 `secret`。

---

## 分组

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET`    | `/api/v1/groups`     | 列出对调用者可见的分组 |
| `POST`   | `/api/v1/groups`     | 创建分组 |
| `PATCH`  | `/api/v1/groups/:id` | 重命名和/或修改颜色 |
| `DELETE` | `/api/v1/groups/:id` | 删除分组；引用此分组的条目 `groupId` 会被重置为 `null` |

`PATCH` 仅接受 `name` 和/或 `color`：

```json
{ "name": "Work", "color": "#0f766e" }
```

- `name` 会去除首尾空白；必须非空；最长 60 字符。
- `color` 必须匹配 `^#[0-9a-fA-F]{6}$`（创建时缺省为 `#0f766e`）。
- 非管理员只能修改自己的分组；管理员可以修改任何分组。
- 同一拥有者下分组名重复返回 `409 Group name already exists for this user`。

`POST` 额外接受 `userId`（仅管理员），用于将分组分配给其他用户。

---

## 批量验证码

### `POST /api/v1/codes/batch`

需要 `Authorization: Bearer <accessToken>`。单次请求最多 `extensionBatchMaxIds`（默认 100）个条目。

```json
{ "entryIds": [1, 2, 3] }
```

**响应：**`200 OK`

```json
{
  "serverTime": 1730000000,
  "items": [
    { "id": 1, "otpType": "totp", "enabled": true, "code": "123456", "expiresIn": 21, "period": 30 },
    { "id": 2, "otpType": "hotp", "enabled": true, "counter": 0, "error": "Use HOTP endpoint" },
    { "id": 3, "error": "Entry not found or forbidden" }
  ]
}
```

- `serverTime` 是服务端当前的 Unix 纪元秒。
- TOTP 条目包含 `code`（验证码）、`expiresIn`（距下一个时间步边界的秒数）和 `period`（时间步长）。
- HOTP 条目**不会被本端点消费**；响应中包含当前 `counter` 与 `error` 提示。请使用 `POST /api/v1/entries/:id/hotp` 推进计数器。
- 找不到或无权限的条目会以 `{ "id": <id>, "error": "..." }` 形式返回，不会让整个请求失败。

---

## Web Vault（仅 Web UI）

### `POST /api/codes/vault`

需要 Web UI 会话，以及最近（≤ 5 分钟）的密码再认证确认。供 Web UI 在导出/转移时构造一个临时的浏览器内 TOTP 保险库。

```json
{ "entryIds": [1, 2, 3], "confirmPassword": "Strong-Password-1!Aa" }
```

- `entryIds` 必须包含唯一正整数，最多 90 个条目。
- 仅当再认证窗口已过期时才需要 `confirmPassword`；否则该字段会被忽略。

**响应：**`200 OK`

```json
{
  "serverTime": 1730000000,
  "items": [
    { "id": 1, "secret": "JBSWY3DPEHPK3PXP", "digits": 6, "period": 30, "algorithm": "SHA-1" }
  ]
}
```

该端点**不会**暴露在 `/api/v1/` 下。

---

## 导出

### 加密导出

加密导出是默认的安全导出路径，同时支持 **Web UI 会话**与 **Bearer Token**，但两种方式的要求不同：

- **Web UI 会话**（`POST /api/export/encrypted`）：需要当前密码再认证确认（开启一个 5 分钟的最近认证窗口）。请求体中必须包含 `confirmPassword`。
- **Bearer Token**（`POST /api/v1/export/encrypted`）：不需要再认证。请求体中只需 `passphrase`。

```http
POST /api/v1/export/encrypted
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{ "passphrase": "Long backup passphrase" }
```

`passphrase` 必须为 12–256 字符。响应使用 PBKDF2-SHA256（180 000 次迭代）+ AES-GCM 封装：

```json
{
  "ok": true,
  "encrypted": {
    "format": "worker-2fauth-encrypted-v1",
    "kdf": "PBKDF2-SHA-256",
    "iterations": 180000,
    "salt": "...",
    "iv": "...",
    "ciphertext": "..."
  }
}
```

### 明文导出（仅 Web UI，需显式启用）

明文导出**默认关闭**，必须显式将 `ALLOW_PLAINTEXT_EXPORT` 设为 `true` 才能启用。即便启用，每次调用仍需提供 `confirmPassword`（用于开启 5 分钟的再认证窗口）。当关闭时，端点返回 `403 Plaintext export is disabled. Use /api/export/encrypted.`

- `GET /api/export` 与 `POST /api/export` —— 调用者可见的全部条目与分组的 JSON 备份。
- `POST /api/export/otpauth` —— `text/plain` 响应，每行一条 `otpauth://` URI。

```json
{ "confirmPassword": "Strong-Password-1!Aa" }
```

JSON 导出结构：

```json
{
  "format": "worker-2fauth-export-v1",
  "exportedAt": "2024-01-01T00:00:00.000Z",
  "by": "alice",
  "groups": [
    { "id": 1, "user_id": 1, "name": "Work", "color": "#0f766e", "created_at": "..." }
  ],
  "entries": [
    {
      "id": 1, "user_id": 1, "label": "GitHub", "issuer": "GitHub",
      "secret": "JBSWY3DPEHPK3PXP", "digits": 6, "period": 30,
      "algorithm": "SHA-1", "otp_type": "totp", "hotp_counter": 0,
      "enabled": 1, "group_id": null, "created_at": "..."
    }
  ]
}
```

> 请将所有导出负载视为敏感数据，其中包含明文 OTP 密钥。

---

## 导入

### OTPAuth URI 导入

- `POST /api/v1/import/otpauth`（Bearer Token）
- `POST /api/import/otpauth`（Web Cookie）

```json
{
  "text": "otpauth://totp/Example:alice?secret=...&algorithm=SHA256",
  "groupId": 1,
  "userId": 1
}
```

- `text` 可以包含多条 `otpauth://` URI（按行或空白分隔）。重复的 URI 会被去重。
- `text` 长度上限 200 000 字符；单次请求最多处理 500 条 URI。
- `groupId` 可选，且必须属于**目标用户**。找不到分组返回 `404`；属于其他用户的分组返回 `403`。
- `userId` 仅管理员可指定其他用户；非管理员始终只能导入到自己的账户。
- 当 URI 省略 `algorithm` 时默认为 `SHA-1`。`SHA-1`、`SHA-256`、`SHA-512` 均被接受；其他取值会让该 URI 被拒绝。

**响应：**`200 OK`

```json
{
  "ok": true,
  "found": 1,
  "imported": 1,
  "importedIds": [42],
  "failed": 0,
  "errors": []
}
```

`errors` 最多包含 5 条逐项错误信息；`failed` 统计所有被拒绝的 URI（包括引用了不存在的分组、base32 密钥无效或不支持的算法）。

### 加密导入

- `POST /api/v1/import/encrypted`（Bearer Token）
- `POST /api/import/encrypted`（Web Cookie）

```json
{
  "passphrase": "Long backup passphrase",
  "encrypted": {
    "format": "worker-2fauth-encrypted-v1",
    "kdf": "PBKDF2-SHA-256",
    "iterations": 180000,
    "salt": "...",
    "iv": "...",
    "ciphertext": "..."
  }
}
```

`passphrase` 必须为 12–256 字符。密文在解密前会先校验格式、KDF 与字段长度；口令错误或密文损坏返回 `400 failed to decrypt payload (wrong passphrase or payload corrupted)`。解密后得到的 JSON 结构与明文导出一致，并走与 `POST /api/import` 相同的导入路径。加密导入按会话/IP 限速（参见 [限速策略](#限速策略)）。

### 明文 JSON 备份导入（仅 Web UI）

`POST /api/import` 接受由 `GET /api/export` 产生的 JSON 结构。管理员可通过 `userId` 指定其他用户；非管理员只能导入到自己的账户。该端点单次请求最多接受 100 个分组、500 个条目。

- 缺失 `algorithm` 时默认为 `SHA-1`。`SHA-1`、`SHA-256`、`SHA-512` 均会被导入；其他取值会让该条目被静默跳过。
- 分组名会去重；同一拥有者下已存在的同名分组会被复用。

---

## 限速策略

所有非 `OPTIONS` 的 API 请求都按会话/IP 桶进行限速。下方列出的默认值可通过 Wrangler `[vars]` 覆盖。

| 范围 | 默认值 | 封禁时长 | 环境变量 |
|---|---|---|---|
| 通用 API（`/api/v1/*`、`/api/...`） | 120 次/分钟 | 15 分钟 | `API_RATE_MAX_REQUESTS_PER_MINUTE` |
| 加密导入 | 5 次/分钟 | 15 分钟 | `ENCRYPTED_IMPORT_MAX_REQUESTS_PER_MINUTE` / `ENCRYPTED_IMPORT_LOCK_MINUTES` |
| 引导 | 5 次/分钟 | 15 分钟 | `BOOTSTRAP_MAX_REQUESTS_PER_MINUTE` / `BOOTSTRAP_LOCK_MINUTES` |
| TOTP 校验（`/api/.../verify`） | 10 次/分钟 | 5 分钟 | `TOTP_VERIFY_MAX_REQUESTS_PER_MINUTE` / `TOTP_VERIFY_LOCK_MINUTES` |
| HOTP 消费（`/api/.../hotp`） | 5 次/分钟 | 5 分钟 | `HOTP_CONSUME_MAX_REQUESTS_PER_MINUTE` / `HOTP_CONSUME_LOCK_MINUTES` |
| 登录风控 | 动态 | 15 分钟 | `/api/security/login-policy`（管理员） |

`/api/status` 与 `/api/v1/capabilities` **不参与限速**（它们是公开的发现端点）。登录风控按 `(username, IP)` 与 `IP` 两个维度分桶，后者额度为前者的 2 倍。

限流响应示例：

```http
HTTP/1.1 429 Too Many Requests
Retry-After: <seconds>
Content-Type: application/json

{
  "error": "Too many <scope> requests. Temporarily locked.",
  "retryAfterSeconds": <seconds>
}
```

---

## Web Cookie 写操作

携带 `__Host-session` Cookie 的 Web UI 写请求（`POST`、`PATCH`、`DELETE`）必须**同时**满足以下条件：

- `Origin` 头等于 Worker 的 `${protocol}//${host}`（即严格同源）。
- `Sec-Fetch-Site` 不为 `cross-site`。
- `Content-Type` 为 `application/json`。

违反时分别返回 `403 Invalid origin`、`403 Cross-site requests are not allowed` 与 `415 Content-Type must be application/json`。

仅使用 Bearer Token 的 API 请求**不**需要这些校验。同时携带 Web 会话 Cookie 与 Bearer Token 的请求会在进入路由前被拒绝（`400 Do not send both Cookie session and Authorization bearer token`）。

---

## 浏览器扩展 CORS

将 `CORS_ALLOWED_ORIGINS` 设置为**精确**来源的逗号分隔列表，例如：

```text
chrome-extension://<extension-id>,moz-extension://<extension-id>,safari-web-extension://<id>,https://app.example.com
```

规则：

- 默认不允许跨源 API 读取。
- 通配符来源（`*`）和字面量 `null` 会被忽略。
- `http://` 来源仅在 hostname 为 `localhost`、`127.0.0.1` 或 `[::1]` 时被接受（仅供开发使用）。
- **永远不会**发送 `Access-Control-Allow-Credentials`，API 不依赖 Cookie 完成 CORS。
- 预检（`OPTIONS`）响应通过 `Access-Control-Max-Age` 缓存 24 小时。

---

## 旧版路由

下列旧版接口仍可用，以兼容既有客户端。新客户端应优先使用 `/api/v1` 等价接口。

| 路径 | 鉴权 | 说明 |
|---|---|---|
| `POST /api/login` | Web Cookie | Web UI 登录；启用 Turnstile 时会校验 |
| `POST /api/logout` | Web Cookie | 吊销当前 `__Host-session` |
| `POST /api/session/close-soon` | Web Cookie | 缩短当前会话的 TTL（用于浏览器卸载场景） |
| `GET`/`POST /api/app-data` | Web Cookie | UI 一次性拉取的条目 + 分组载荷 |
| `GET`/`PATCH /api/me`，`PATCH /api/me/password` | Web Cookie | `/api/v1/me` 与 `/api/v1/me/password` 的镜像 |
| `GET`/`POST`/`PATCH`/`DELETE` `/api/entries...` | Web Cookie | `/api/v1/entries...` 系列的镜像 |
| `GET`/`POST`/`PATCH`/`DELETE` `/api/groups...` | Web Cookie | `/api/v1/groups...` 系列的镜像 |
| `POST /api/codes/batch` | Web Cookie | `/api/v1/codes/batch` 的镜像 |
| `POST /api/codes/vault` | Web Cookie + 再认证 | 浏览器内转移用的明文密钥包 |
| `GET`/`POST /api/export`，`POST /api/export/otpauth` | Web Cookie + 再认证 + `ALLOW_PLAINTEXT_EXPORT=true` | 明文导出 |
| `POST /api/export/encrypted` | Web Cookie + 再认证 | `/api/v1/export/encrypted` 的镜像 |
| `POST /api/import` | Web Cookie | 明文 JSON 备份导入 |
| `POST /api/import/otpauth`，`POST /api/import/encrypted` | Web Cookie | `/api/v1/import/...` 系列的镜像 |
| `GET`/`POST /api/users`，`PATCH /api/users/:id/...`，`DELETE /api/users/:id` | Web Cookie + 管理员 | 仅管理员的用户管理 |
| `GET`/`PATCH /api/security/login-policy` | Web Cookie + 管理员 | 读取与更新登录风控策略 |
| `POST /api/mobile/{login,refresh,logout}` | Bearer（android） | 旧版 Android 客户端接口 |
| `POST /api/extension/{login,refresh,logout}` | Bearer（extension） | 旧版扩展客户端接口 |
| `GET /api/extension/entries` | Bearer（extension） | 旧版条目列表（与 `/api/v1/entries` 同结构） |
| `POST /api/extension/codes/batch` | Bearer（extension） | 旧版批量验证码（与 `/api/v1/codes/batch` 同结构） |
| `GET /api/status` | 无 | `{ "initialized": true, "bootstrapTokenRequired": false }` |
