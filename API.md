# API Contract

This Worker keeps the existing Web UI routes and exposes stable `/api/v1` bearer-token routes for native Android apps and browser extensions.

## Conventions

- All request and response bodies are JSON unless explicitly noted otherwise (the only non-JSON response is `POST /api/export/otpauth`, which returns `text/plain`).
- JSON body size is capped at **1 MiB** per request. Encrypted-import and otpauth import endpoints apply stricter per-route limits (see [Rate limits](#rate-limits)).
- All timestamps in responses are seconds since the Unix epoch (UTC), unless the field name ends in `At` (ISO 8601 string).
- Error responses use the shape `{ "error": "message" }`. Rate-limited responses additionally include `retryAfterSeconds` and a `Retry-After` header.

## Client Authentication

Requests must use **exactly one** authentication mechanism. Do not send the Web UI `__Host-session` cookie together with an `Authorization: Bearer ...` header; mixed-authentication requests are rejected with `400 Do not send both Cookie session and Authorization bearer token`.

| Surface | Auth | Notes |
|---|---|---|
| Web UI (`/`, `/api/...` for cookie routes) | `__Host-session` HttpOnly cookie | Issued by `/api/login` and `/api/bootstrap` |
| Stable API (`/api/v1/*`) | `Authorization: Bearer <accessToken>` | Issued by `/api/v1/auth/login` or `/api/v1/auth/refresh` |
| Legacy mobile (`/api/mobile/*`) | `Authorization: Bearer <accessToken>` | Android client type only |
| Legacy extension (`/api/extension/*`) | `Authorization: Bearer <accessToken>` | Browser-extension client type only |
| Bootstrap (`/api/bootstrap`) | `X-Bootstrap-Token` header (or `X-Init-Secret`, or `bootstrapToken` body field) | One-time, before the first admin exists |

Bearer tokens are opaque, 64-character hex strings (32 random bytes).

---

## Bootstrap

### `POST /api/bootstrap`

Creates the first admin account only when the database has no users.

**Required header:**

```http
X-Bootstrap-Token: <BOOTSTRAP_TOKEN>
```

`BOOTSTRAP_TOKEN` (or `INIT_SECRET`) must be configured with `wrangler secret put BOOTSTRAP_TOKEN`. If the token is missing or incorrect, an empty deployment will not initialize. The endpoint is rate-limited and locked out per source IP after repeated failures (see [Rate limits](#rate-limits)).

**Request body:**

```json
{
  "username": "admin",
  "password": "Strong-Password-1!Aa"
}
```

**Response:** `201 Created`

```json
{
  "ok": true,
  "user": { "id": 1, "username": "admin", "role": "admin" }
}
```

A `__Host-session` cookie is set on success. After any user exists, the endpoint returns `400 Already initialized` and is permanently closed.

---

## Capabilities discovery

### `GET /api/v1/capabilities`

Returns runtime API metadata for Android apps and browser extensions **before login**. Not rate-limited.

**Response:** `200 OK`

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

Field reference:

- `auth.accessTokenExpiresIn` — access token lifetime in seconds (7 days).
- `auth.refreshTokenExpiresIn` — refresh token lifetime in seconds (90 days). The **absolute** maximum is also 90 days; rolling refresh cannot extend it indefinitely.
- `auth.refreshTokenRotation` — always `true`. Every successful refresh issues a new refresh token and invalidates the old one.
- `auth.turnstileRequired` — `true` when `TURNSTILE_SECRET_KEY` (or `TURNSTILE_KEY`) is set; clients must then include a valid `turnstileToken` in login.
- `auth.turnstileSiteKey` — `TURNSTILE_SITE_KEY` (empty string when Turnstile is not configured).
- `limits.extensionBatchMaxIds` — maximum number of `entryIds` accepted by the batch code endpoint.
- `cors.exactOriginAllowlist` — always `true`. Wildcards and non-local `http://` origins are rejected.
- `cors.configured` — `true` when `CORS_ALLOWED_ORIGINS` contains at least one origin.
- `cors.credentials` — always `false`. The API never sends `Access-Control-Allow-Credentials`.

---

## Bearer token lifecycle

### `POST /api/v1/auth/login`

**Request:**

```json
{
  "username": "alice",
  "password": "Strong-Password-1!Aa",
  "clientType": "android"
}
```

- `clientType` is required to be `android` or `browser_extension`. The default is `android` if omitted.
- When Turnstile is required, include a `turnstileToken` minted against the current request hostname.
- Passwords must be 12–256 characters and include uppercase, lowercase, number, and symbol.

For browser extensions, use `"clientType": "browser_extension"` and optionally include:

```json
{
  "deviceName": "edge",
  "clientVersion": "1.0.0"
}
```

`deviceName` (max 120 chars) and `clientVersion` (max 64 chars) are sanitized to `[A-Za-z0-9._- ]` and only stored for audit purposes.

**Response:** `200 OK`

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

Any existing `__Host-session` cookie for the same user is revoked. The previous `api_sessions` row is also deleted; only one API session per user is allowed at a time.

### `POST /api/v1/auth/refresh`

**Request:**

```json
{
  "refreshToken": "...",
  "clientType": "android"
}
```

The `clientType` must match the original login (`android` ↔ `android`, `browser_extension` ↔ extension). Refresh tokens are rotated on every successful refresh; replay of the previous refresh token returns `409 Refresh token already used`.

**Response:** `200 OK`

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

Requires `Authorization: Bearer <accessToken>`. Deletes the current `api_sessions` row. Always returns `{ "ok": true }` (even when the token is already invalid).

---

## Profile

### `GET /api/v1/me`

Requires `Authorization: Bearer <accessToken>`.

**Response:** `200 OK`

```json
{ "user": { "id": 1, "username": "alice", "role": "user" } }
```

### `PATCH /api/v1/me/password`

Requires `Authorization: Bearer <accessToken>`.

**Request:**

```json
{
  "currentPassword": "Strong-Password-1!Aa",
  "newPassword": "New-Strong-Password-1!Aa"
}
```

`oldPassword` and `password` are accepted as aliases of `currentPassword` and `newPassword` respectively for legacy clients.

**Response:** `200 OK` with `{ "ok": true }`. All other sessions (web and API) for the user are revoked; the bearer token in the current request is no longer valid. Use `/api/v1/auth/login` to obtain a new one.

---

## Entries

All entry routes accept either a Bearer token (under `/api/v1/entries/...`) or a Web UI cookie (under `/api/entries/...`); the URL is the same modulo the prefix. Web UI cookie writes are subject to the additional same-origin checks in [Web Cookie Writes](#web-cookie-writes).

Non-admin users can only read and modify their own entries; admins can target any user via `userId` in the request body.

| Method | Path | Description |
|---|---|---|
| `GET`   | `/api/v1/entries`                | List entries visible to the caller (admin sees all) |
| `POST`  | `/api/v1/entries`                | Create a TOTP or HOTP entry |
| `PATCH` | `/api/v1/entries/order`          | Reorder entries by ID list |
| `PATCH` | `/api/v1/entries/:id`            | Update an entry (label, issuer, secret, digits, period, algorithm, otpType, hotpCounter, enabled, groupId) |
| `DELETE`| `/api/v1/entries/:id`            | Delete an entry |
| `GET`   | `/api/v1/entries/:id/code`       | Compute a TOTP code (HOTP returns `400 Use /api/entries/:id/hotp`) |
| `POST`  | `/api/v1/entries/:id/verify`     | Verify a submitted TOTP code against a ±1 step window |
| `POST`  | `/api/v1/entries/:id/hotp`       | Consume an HOTP code and atomically increment the counter |

### Create / Update shape

- `label` (string, required, 1–200 chars) — display name.
- `issuer` (string, optional, max 100 chars).
- `secret` (string, required) — base32-encoded shared secret, 16–256 chars; also accepts a full `otpauth://` URI in this field for convenience.
- `digits` (6 / 7 / 8, default `6`).
- `period` (15–120, default `30`; TOTP only).
- `algorithm` (`SHA-1` / `SHA-256` / `SHA-512`; aliases `SHA1`, `SHA256`, `SHA512` are normalized). Defaults to `SHA-1` for legacy compatibility.
- `otpType` (`totp` / `hotp`, default `totp`).
- `hotpCounter` (non-negative integer, default `0`; HOTP only).
- `enabled` (boolean, default `true`).
- `groupId` (positive integer or `null`, optional). Must belong to the entry's owner.
- `userId` (admin only, positive integer) — assign the entry to another user.

For `PATCH`, every field is optional; only provided fields are updated. Setting `secret` validates the new base32 and re-encrypts the entry.

**Response:** `201 Created` (create) / `200 OK` (update) — body `{ "ok": true, "id": <id> }` on create.

### Reorder

`PATCH /api/v1/entries/order` replaces the sort order of the caller's entries.

```json
{ "orderedIds": [3, 1, 2] }
```

- Up to 500 IDs per request; all IDs must be unique positive integers and must be entries visible to the caller.
- An empty array is a no-op and returns `{ "ok": true }`.

### Verify TOTP

`POST /api/v1/entries/:id/verify` validates a submitted TOTP code with a ±1 time-step window. Returns the matching window offset.

```json
{ "code": "123456" }
```

```json
{ "ok": true, "valid": true, "window": 0 }
```

Invalid codes return `{ "ok": true, "valid": false }` (no `window` field). The endpoint is rate-limited per entry and per session/IP (defaults: 10 attempts/min, 5 min lockout).

### Consume HOTP

`POST /api/v1/entries/:id/hotp` atomically increments the stored counter (single `UPDATE ... RETURNING`) and returns the code at the **previous** counter value.

```json
{ "code": "123456", "counter": 7, "nextCounter": 8, "otpType": "hotp" }
```

If a concurrent request wins the race, the loser returns `409 HOTP code already consumed, please retry`. The endpoint is rate-limited per entry (defaults: 5 requests/min, 5 min lockout).

### List response

`GET /api/v1/entries` returns:

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

Secrets are **never** included in list responses.

---

## Groups

| Method | Path | Description |
|---|---|---|
| `GET`    | `/api/v1/groups`     | List groups visible to the caller |
| `POST`   | `/api/v1/groups`     | Create a group |
| `PATCH`  | `/api/v1/groups/:id` | Rename and/or recolor a group |
| `DELETE` | `/api/v1/groups/:id` | Delete a group; entries with this `groupId` are reset to `null` |

`PATCH` accepts `name` and/or `color` only:

```json
{ "name": "Work", "color": "#0f766e" }
```

- `name` is trimmed; must be non-empty; max 60 characters.
- `color` must match `^#[0-9a-fA-F]{6}$` (default `#0f766e` if omitted on create).
- Non-admin users can only modify their own groups; admins can modify any group.
- Duplicate group name for the same owner returns `409 Group name already exists for this user`.

`POST` additionally accepts `userId` (admin only) to assign the group to another user.

---

## Batch code generation

### `POST /api/v1/codes/batch`

Requires `Authorization: Bearer <accessToken>`. At most `extensionBatchMaxIds` (default 100) entries per request.

```json
{ "entryIds": [1, 2, 3] }
```

**Response:** `200 OK`

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

- `serverTime` is the server's current Unix epoch in seconds.
- TOTP items include `code`, `expiresIn` (seconds until the next period boundary), and `period`.
- HOTP items are **not** consumed by this endpoint; they include the current `counter` and an `error` reminder. Use `POST /api/v1/entries/:id/hotp` to advance the counter.
- Missing or forbidden entries return `{ "id": <id>, "error": "..." }` instead of failing the whole request.

---

## Web Vault (legacy / Web UI only)

### `POST /api/codes/vault`

Requires a Web UI session and a recent (≤ 5 minutes) step-up confirmation. Used by the Web UI to materialize a transient in-browser TOTP vault for export/transfer.

```json
{ "entryIds": [1, 2, 3], "confirmPassword": "Strong-Password-1!Aa" }
```

- `entryIds` must contain unique positive integers, up to 90 entries.
- `confirmPassword` is required only if the step-up window has expired; otherwise it is ignored.

**Response:** `200 OK`

```json
{
  "serverTime": 1730000000,
  "items": [
    { "id": 1, "secret": "JBSWY3DPEHPK3PXP", "digits": 6, "period": 30, "algorithm": "SHA-1" }
  ]
}
```

This endpoint is intentionally **not** exposed under `/api/v1/`.

---

## Export

### Encrypted export

Encrypted export is the default safe export path. It works for both **Web UI sessions** and **bearer tokens**, but the two paths differ:

- **Web UI session** (`POST /api/export/encrypted`): requires a current-password step-up confirmation (creates a 5-minute recent-authentication window). `confirmPassword` must be in the body.
- **Bearer token** (`POST /api/v1/export/encrypted`): no step-up required. Only `passphrase` is needed.

```http
POST /api/v1/export/encrypted
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{ "passphrase": "Long backup passphrase" }
```

`passphrase` must be 12–256 characters. The response is wrapped using PBKDF2-SHA256 (180 000 iterations) + AES-GCM:

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

### Plaintext export (Web UI only, opt-in)

Plaintext export is **disabled by default** and must be explicitly enabled with `ALLOW_PLAINTEXT_EXPORT=true`. Even when enabled, each call requires `confirmPassword` (which opens the 5-minute step-up window). When the flag is disabled, the endpoints return `403 Plaintext export is disabled. Use /api/export/encrypted.`

- `GET /api/export` and `POST /api/export` — JSON backup of all entries and groups visible to the caller.
- `POST /api/export/otpauth` — `text/plain` response with one `otpauth://` URI per line.

```json
{ "confirmPassword": "Strong-Password-1!Aa" }
```

The JSON export schema:

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

> Treat all export payloads as sensitive. They contain raw OTP secrets in cleartext.

---

## Import

### OTPAuth URI import

- `POST /api/v1/import/otpauth` (bearer token)
- `POST /api/import/otpauth` (web cookie)

```json
{
  "text": "otpauth://totp/Example:alice?secret=...&algorithm=SHA256",
  "groupId": 1,
  "userId": 1
}
```

- `text` may contain multiple `otpauth://` URIs (one per line or separated by whitespace). Duplicates are deduplicated.
- `text` is capped at 200 000 characters; at most 500 URIs are processed per request.
- `groupId` is optional and must belong to the **target user**. Missing groups return `404`; groups owned by a different user return `403`.
- `userId` is admin-only and may target another user; non-admins are always forced to import into their own account.
- `algorithm` defaults to `SHA-1` when the URI omits it. `SHA-1`, `SHA-256`, and `SHA-512` are all accepted. Any other value rejects the URI.

**Response:** `200 OK`

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

`errors` contains at most 5 per-item error messages; `failed` counts all rejected URIs (including those that referenced a non-existent group, an invalid base32 secret, or an unsupported algorithm).

### Encrypted import

- `POST /api/v1/import/encrypted` (bearer token)
- `POST /api/import/encrypted` (web cookie)

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

`passphrase` must be 12–256 characters. The encrypted blob is verified (format, KDF, field lengths) before decryption; a wrong passphrase or corrupted payload returns `400 failed to decrypt payload (wrong passphrase or payload corrupted)`. Decryption yields the same JSON shape as the plaintext export, and the result is imported via the same path as `POST /api/import`. Encrypted import is rate-limited per session/IP (see [Rate limits](#rate-limits)).

### Plain JSON backup import (Web UI only)

`POST /api/import` accepts the JSON schema produced by `GET /api/export`. Admin users may target another user via `userId`; non-admins are forced to import into their own account. The endpoint accepts at most 100 groups and 500 entries per request.

- `algorithm` defaults to `SHA-1` when missing. `SHA-1`, `SHA-256`, and `SHA-512` are all imported; any other value silently skips the entry.
- Group names are de-duplicated; existing groups with the same name (per owner) are reused.

---

## Rate limits

All non-`OPTIONS` API requests are subject to a per-session/IP bucket. The defaults below can be overridden via Wrangler `[vars]`.

| Scope | Default | Lockout | Env var |
|---|---|---|---|
| General API (`/api/v1/*`, `/api/...`) | 120 req/min | 15 min | `API_RATE_MAX_REQUESTS_PER_MINUTE` |
| Encrypted import | 5 req/min | 15 min | `ENCRYPTED_IMPORT_MAX_REQUESTS_PER_MINUTE` / `ENCRYPTED_IMPORT_LOCK_MINUTES` |
| Bootstrap | 5 req/min | 15 min | `BOOTSTRAP_MAX_REQUESTS_PER_MINUTE` / `BOOTSTRAP_LOCK_MINUTES` |
| TOTP verify (`/api/.../verify`) | 10 req/min | 5 min | `TOTP_VERIFY_MAX_REQUESTS_PER_MINUTE` / `TOTP_VERIFY_LOCK_MINUTES` |
| HOTP consume (`/api/.../hotp`) | 5 req/min | 5 min | `HOTP_CONSUME_MAX_REQUESTS_PER_MINUTE` / `HOTP_CONSUME_LOCK_MINUTES` |
| Login risk | dynamic | 15 min | `/api/security/login-policy` (admin) |

`/api/status` and `/api/v1/capabilities` are **not** rate-limited (they are public discovery endpoints). Per-IP login risk uses the same bucket shape as the API limiter but is bucketed per `(username, IP)` and per `IP` with a 2× allowance.

Rate-limited responses:

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

## Web Cookie Writes

Cookie-authenticated Web UI write requests (`POST`, `PATCH`, `DELETE`) carrying `__Host-session` must satisfy **all** of the following:

- `Origin` header equals `${protocol}//${host}` of the Worker (i.e. exact same origin).
- `Sec-Fetch-Site` is not `cross-site`.
- `Content-Type` is `application/json`.

Violations return `403 Invalid origin`, `403 Cross-site requests are not allowed`, or `415 Content-Type must be application/json` respectively.

Bearer-only API requests do **not** require these checks. Requests carrying both the Web session cookie and a Bearer token are rejected with `400 Do not send both Cookie session and Authorization bearer token` before route handling.

---

## Browser Extension CORS

Set `CORS_ALLOWED_ORIGINS` as a comma-separated list of **exact** origins, for example:

```text
chrome-extension://<extension-id>,moz-extension://<extension-id>,safari-web-extension://<id>,https://app.example.com
```

Rules:

- The Worker does **not** allow cross-origin API reads by default.
- Wildcard origins (`*`) and the literal `null` are ignored.
- `http://` origins are accepted **only** when the hostname is `localhost`, `127.0.0.1`, or `[::1]` (development use only).
- `Access-Control-Allow-Credentials` is **never** sent; the API does not rely on cookies for CORS.
- Preflight (`OPTIONS`) responses are cached for 24 hours via `Access-Control-Max-Age`.

---

## Legacy Routes

The following legacy surfaces remain available for backward compatibility. New clients should prefer the `/api/v1` equivalents.

| Path | Auth | Notes |
|---|---|---|
| `POST /api/login` | web cookie | Web UI login; supports Turnstile when configured |
| `POST /api/logout` | web cookie | Revokes the current `__Host-session` |
| `POST /api/session/close-soon` | web cookie | Shortens the current session TTL (browser unload handling) |
| `GET`/`POST /api/app-data` | web cookie | Combined entries + groups payload for the UI |
| `GET`/`PATCH /api/me`, `PATCH /api/me/password` | web cookie | Mirror of `/api/v1/me` and `/api/v1/me/password` |
| `GET`/`POST`/`PATCH`/`DELETE` `/api/entries...` | web cookie | Mirror of the `/api/v1/entries...` family |
| `GET`/`POST`/`PATCH`/`DELETE` `/api/groups...` | web cookie | Mirror of the `/api/v1/groups...` family |
| `POST /api/codes/batch` | web cookie | Mirror of `/api/v1/codes/batch` |
| `POST /api/codes/vault` | web cookie + step-up | Plaintext secret bundle for in-browser transfer |
| `GET`/`POST /api/export`, `POST /api/export/otpauth` | web cookie + step-up + `ALLOW_PLAINTEXT_EXPORT=true` | Plaintext exports |
| `POST /api/export/encrypted` | web cookie + step-up | Mirror of `/api/v1/export/encrypted` |
| `POST /api/import` | web cookie | Plaintext JSON backup import |
| `POST /api/import/otpauth`, `POST /api/import/encrypted` | web cookie | Mirrors of `/api/v1/import/...` |
| `GET`/`POST /api/users`, `PATCH /api/users/:id/...`, `DELETE /api/users/:id` | web cookie + admin | Admin-only user management |
| `GET`/`PATCH /api/security/login-policy` | web cookie + admin | Read and update the login risk policy |
| `POST /api/mobile/{login,refresh,logout}` | bearer (android) | Legacy Android client surface |
| `POST /api/extension/{login,refresh,logout}` | bearer (extension) | Legacy extension client surface |
| `GET /api/extension/entries` | bearer (extension) | Legacy entries list (same shape as `/api/v1/entries`) |
| `POST /api/extension/codes/batch` | bearer (extension) | Legacy batch codes (same shape as `/api/v1/codes/batch`) |
| `GET /api/status` | none | `{ "initialized": true, "bootstrapTokenRequired": false }` |
