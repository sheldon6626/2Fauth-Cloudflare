const SESSION_COOKIE = "__Host-session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
// Keep an absolute upper bound so an actively used stolen token cannot live forever.
const SESSION_ABSOLUTE_TTL_SECONDS = 60 * 60 * 24 * 30;
import { renderAppHtml } from "./ui/template.js";
const STEP_UP_TTL_SECONDS = 5 * 60; // 5 minutes
const API_ACCESS_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const API_REFRESH_TTL_SECONDS = 60 * 60 * 24 * 90; // 90 days
const API_ABSOLUTE_TTL_SECONDS = 60 * 60 * 24 * 90;
const CLOSE_LOGOUT_GRACE_SECONDS = 12;
const CLOSE_SOON_HEADER = "x-session-close";
const CLOSE_SOON_HEADER_VALUE = "web-beforeunload";
// Keep hashing strong while avoiding CPU limit spikes on Cloudflare Workers.
const PBKDF2_ITERATIONS = 100_000;
const MIN_PASSWORD_PBKDF2_ITERATIONS = 10_000;
const MAX_PASSWORD_PBKDF2_ITERATIONS = 1_000_000;
const PBKDF2_HASH = "SHA-256";
const PASSWORD_POLICY_DESCRIPTION = "12 to 256 chars with uppercase, lowercase, number, and symbol";
const PASSWORD_MAX_LENGTH = 256;
const PASSPHRASE_PBKDF2_ITERATIONS = 180_000;
const MAX_PASSPHRASE_PBKDF2_ITERATIONS = 300_000;
const ENCRYPTED_BACKUP_PASSPHRASE_MIN_LENGTH = 12;
const ENCRYPTED_BACKUP_PASSPHRASE_MAX_LENGTH = 256;
const ENCRYPTED_BACKUP_SALT_BYTES = 16;
const ENCRYPTED_BACKUP_IV_BYTES = 12;
const ENCRYPTED_BACKUP_MIN_CIPHERTEXT_BYTES = 16;
const ENCRYPTED_BACKUP_MAX_CIPHERTEXT_BYTES = 1_048_576;
const DEFAULT_JSON_BODY_MAX_BYTES = 1_048_576;
const DEFAULT_RISK_MAX_REQUESTS_PER_MINUTE = 10;
const DEFAULT_RISK_LOCK_MINUTES = 15;
const DEFAULT_API_RATE_MAX_REQUESTS_PER_MINUTE = 120;
const DEFAULT_ENCRYPTED_IMPORT_MAX_REQUESTS_PER_MINUTE = 5;
const DEFAULT_ENCRYPTED_IMPORT_LOCK_MINUTES = 15;
const DEFAULT_BOOTSTRAP_MAX_REQUESTS_PER_MINUTE = 5;
const DEFAULT_BOOTSTRAP_LOCK_MINUTES = 15;
const DEFAULT_TOTP_VERIFY_MAX_REQUESTS_PER_MINUTE = 10;
const DEFAULT_TOTP_VERIFY_LOCK_MINUTES = 5;
const DEFAULT_HOTP_CONSUME_MAX_REQUESTS_PER_MINUTE = 5;
const DEFAULT_HOTP_CONSUME_LOCK_MINUTES = 5;
const ENCRYPTION_KEY_CACHE_TTL_MS = 5 * 60 * 1000;
const API_SESSION_LAST_USED_UPDATE_INTERVAL_SECONDS = 15 * 60;
const ENTRY_LABEL_MAX_LENGTH = 200;
const ENTRY_ISSUER_MAX_LENGTH = 100;
const ENTRY_REORDER_MAX_IDS = 500;
const OTP_ALGORITHM_DEFAULT = "SHA-1";
const OTP_ALGORITHM_ERROR = "algorithm must be SHA-1, SHA-256, or SHA-512";
const GROUP_NAME_MAX_LENGTH = 60;
const DEFAULT_API_RATE_LOCK_MINUTES = 15;
const OTP_SECRET_MIN_BASE32_CHARS = 16;
const OTP_SECRET_MAX_BASE32_CHARS = 256;
const OTP_SECRET_MIN_BYTES = 10;
const OTP_SECRET_MAX_BYTES = 128;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_REQUEST_TIMEOUT_MS = 5000;
const ANDROID_CLIENT_TYPE = "android";
const EXTENSION_CLIENT_TYPE = "edge_extension";
const EXTENSION_BATCH_MAX_IDS = 100;
const DB_ID_PATH_PATTERN = "[1-9]\\d{0,15}";
const EXTENSION_CORS_PROTOCOLS = new Set(["chrome-extension:", "moz-extension:", "safari-web-extension:"]);
const COOKIE_WRITE_METHODS = new Set(["POST", "PATCH", "DELETE"]);

// N-01 fix: dummy salt/hash for constant-time PBKDF2 on missing user
const FAKE_PASSWORD_SALT = "AAAAAAAAAAAAAAAAAAAAAA";
const FAKE_PASSWORD_HASH = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
const BOOTSTRAP_COMPLETED_SETTING = "bootstrap_completed";
const BOOTSTRAP_TOKEN_HEADER = "x-bootstrap-token";
const CORS_ALLOWED_HEADERS = "Content-Type, Authorization, X-Client-Type, X-Bootstrap-Token, X-Init-Secret";
const CORS_ALLOWED_METHODS = "GET, POST, PATCH, DELETE, OPTIONS";

const VAULT_MAX_IDS = 90;

const API_ROUTES = [
  ["GET", "/api/status", handleStatus],
  ["POST", "/api/bootstrap", handleBootstrap],
  ["POST", "/api/login", handleLogin],
  ["POST", "/api/mobile/login", handleMobileLogin],
  ["POST", "/api/mobile/refresh", handleMobileRefresh],
  ["POST", "/api/mobile/logout", handleMobileLogout],
  ["POST", "/api/extension/login", handleExtensionLogin],
  ["POST", "/api/extension/refresh", handleExtensionRefresh],
  ["POST", "/api/extension/logout", handleExtensionLogout],
  ["GET", "/api/extension/entries", handleExtensionEntries],
  ["POST", "/api/extension/codes/batch", handleExtensionCodesBatch],
  ["GET", "/api/v1/capabilities", handleApiCapabilities],
  ["POST", "/api/v1/auth/login", handleApiClientLogin],
  ["POST", "/api/v1/auth/refresh", handleApiClientRefresh],
  ["POST", "/api/v1/auth/logout", handleApiClientLogout],
  ["GET", "/api/v1/me", handleMe],
  ["PATCH", "/api/v1/me/password", handleChangeMyPassword],
  ...entryRoutes("/api/v1"),
  ...groupRoutes("/api/v1"),
  ["POST", "/api/v1/codes/batch", handleApiCodesBatch],
  ["POST", "/api/v1/import/otpauth", handleImportOtpAuth],
  ["POST", "/api/v1/export/encrypted", handleExportDataEncrypted],
  ["POST", "/api/v1/import/encrypted", handleImportDataEncrypted],
  ["POST", "/api/logout", handleLogout],
  ["POST", "/api/session/close-soon", handleCloseSoon],
  ["GET", "/api/me", handleMe],
  ["GET", "/api/app-data", handleAppData],
  ["PATCH", "/api/me/password", handleChangeMyPassword],
  ...entryRoutes("/api"),
  ...groupRoutes("/api"),
  ["POST", "/api/codes/batch", handleWebCodesBatch],
  ["POST", "/api/codes/vault", handleCodesVault],
  ["GET", "/api/export", handleExportData],
  ["POST", "/api/export", handleExportData],
  ["POST", "/api/export/otpauth", handleExportOtpAuth],
  ["POST", "/api/export/encrypted", handleExportDataEncrypted],
  ["POST", "/api/import", handleImportData],
  ["POST", "/api/import/otpauth", handleImportOtpAuth],
  ["POST", "/api/import/encrypted", handleImportDataEncrypted],
  ["GET", "/api/users", handleListUsers],
  ["POST", "/api/users", handleCreateUser],
  ["PATCH", routePattern("/api", `/users/${DB_ID_PATH_PATTERN}/role`), handleUpdateUserRole],
  ["PATCH", routePattern("/api", `/users/${DB_ID_PATH_PATTERN}/password`), handleResetUserPassword],
  ["DELETE", routePattern("/api", `/users/${DB_ID_PATH_PATTERN}`), handleDeleteUser],
  ["GET", "/api/security/login-policy", handleGetLoginPolicy],
  ["PATCH", "/api/security/login-policy", handleUpdateLoginPolicy],
];

function entryRoutes(prefix) {
  return [
    ["GET", `${prefix}/entries`, handleListEntries],
    ["POST", `${prefix}/entries`, handleCreateEntry],
    ["PATCH", `${prefix}/entries/order`, handleReorderEntries],
    ["PATCH", routePattern(prefix, `/entries/${DB_ID_PATH_PATTERN}`), handleUpdateEntry],
    ["GET", routePattern(prefix, `/entries/${DB_ID_PATH_PATTERN}/code`), handleEntryCode],
    ["POST", routePattern(prefix, `/entries/${DB_ID_PATH_PATTERN}/verify`), handleVerifyTotp],
    ["POST", routePattern(prefix, `/entries/${DB_ID_PATH_PATTERN}/hotp`), handleConsumeHotp],
    ["DELETE", routePattern(prefix, `/entries/${DB_ID_PATH_PATTERN}`), handleDeleteEntry],
  ];
}

function groupRoutes(prefix) {
  return [
    ["GET", `${prefix}/groups`, handleListGroups],
    ["POST", `${prefix}/groups`, handleCreateGroup],
    ["PATCH", routePattern(prefix, `/groups/${DB_ID_PATH_PATTERN}`), handleUpdateGroup],
    ["DELETE", routePattern(prefix, `/groups/${DB_ID_PATH_PATTERN}`), handleDeleteGroup],
  ];
}

function routePattern(prefix, suffixPattern) {
  return new RegExp(`^${escapeRegExp(prefix)}${suffixPattern}$`);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default {
  async fetch(request, env, ctx) {
    try {
      if (!env.DB) {
        return json({ error: "D1 binding DB is required" }, 500);
      }
      if (!env.ENCRYPTION_KEY || !env.SESSION_PEPPER) {
        return json({ error: "ENCRYPTION_KEY and SESSION_PEPPER are required" }, 500);
      }

      const url = new URL(request.url);
      const method = request.method.toUpperCase();
      const path = url.pathname;

      if (method === "OPTIONS") {
        return corsPreflight(request, env);
      }

      if (method === "GET" && path === "/") {
        const nonce = randomHex(16);
        return html(appHtml(env, nonce), nonce);
      }

      const route = findApiRoute(method, path);
      if (route) {
        const authMixViolation = validateAuthMethodConsistency(request);
        if (authMixViolation) return withCors(request, authMixViolation, env);
        const cookieWriteViolation = validateCookieWriteRequest(request);
        if (cookieWriteViolation) return withCors(request, cookieWriteViolation, env);
        const encryptedImportLimited = await applyEncryptedImportRateLimit(request, env);
        if (encryptedImportLimited) return withCors(request, encryptedImportLimited, env);
        const limited = await applyApiRateLimit(request, env, route);
        if (limited) return withCors(request, limited, env);
        return withCors(request, await route.handler(request, env), env);
      }
      if (method === "GET" && path === "/favicon.ico") {
        return new Response(null, { status: 204 });
      }
      if (method === "GET" && !path.startsWith("/api/")) {
        const nonce = randomHex(16);
        return html(appHtml(env, nonce), nonce);
      }

      return withCors(request, json({ error: "Not found" }, 404), env);
    } catch (err) {
      if (err instanceof ApiError) {
        return withCors(request, json({ error: err.message }, err.status), env);
      }
      const payload = { error: "Internal Server Error" };
      if (canExposeErrorDetail(request, env)) {
        payload.detail = err instanceof Error ? err.message : "Internal error";
      }
      return withCors(request, json(payload, 500), env);
    }
  },
  async scheduled(controller, env, ctx) {
    const maintenance = runBackgroundMaintenance(env).catch((error) => {
      console.error(JSON.stringify({ message: "scheduled maintenance failed", cron: controller.cron, error: String(error?.message || error) }));
    });
    ctx.waitUntil(maintenance);
  },
};

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function findApiRoute(method, path) {
  for (const [routeMethod, matcher, handler] of API_ROUTES) {
    if (routeMethod !== method) continue;
    if (typeof matcher === "string" && matcher === path) return { method: routeMethod, matcher, handler };
    if (matcher instanceof RegExp && matcher.test(path)) return { method: routeMethod, matcher, handler };
  }
  return null;
}

async function handleStatus(request, env) {
  const initialized = await isBootstrapClosed(env);
  return json({ initialized, bootstrapTokenRequired: !initialized });
}

async function handleBootstrap(request, env) {
  const body = await parseJson(request);
  const bootstrapTokenCheck = validateBootstrapToken(request, env, body);
  if (!bootstrapTokenCheck.ok) {
    if (env.BOOTSTRAP_TOKEN || env.INIT_SECRET) {
      const bootstrapLimited = await applyBootstrapRateLimit(request, env);
      if (bootstrapLimited) return bootstrapLimited;
    }
    return json({ error: bootstrapTokenCheck.error }, 403);
  }
  const initialized = await isBootstrapClosed(env);
  if (initialized) return json({ error: "Already initialized" }, 400);
  const bootstrapLimited = await applyBootstrapRateLimit(request, env);
  if (bootstrapLimited) return bootstrapLimited;

  const username = normalizeUsername(body.username);
  const password = String(body.password || "");
  if (!username || !validPassword(password)) {
    // F-04: vague error — do not disclose password policy details.
    return json({ error: "Invalid username or password" }, 400);
  }

  const { hashB64, saltB64 } = await hashPassword(password);
  const now = nowIso();
  const row = await env.DB.prepare(
    "INSERT INTO users (username, password_hash, password_salt, role, created_at) SELECT ?, ?, ?, 'admin', ? WHERE NOT EXISTS (SELECT 1 FROM users) RETURNING id"
  )
    .bind(username, encodePasswordHash(hashB64), saltB64, now)
    .first();

  let userId = normalizeDbId(row?.id);
  if (!userId) {
    await markBootstrapCompleted(env).catch(() => {});
    return json({ error: "Already initialized" }, 400);
  }
  await markBootstrapCompleted(env);
  const { cookie } = await regenerateWebSession(request, env, userId);
  return json(
    { ok: true, user: { id: userId, username, role: "admin" } },
    201,
    { "set-cookie": cookie }
  );
}

async function handleLogin(request, env) {
  const body = await parseJson(request);
  const username = normalizeUsername(body.username);
  const password = String(body.password || "");
  const turnstileToken = String(body.turnstileToken || "");
  const risk = await applyLoginRiskControl(request, env, username);
  if (risk.blocked) {
    return json(
      {
        error: "Too many login attempts. Temporarily locked.",
        retryAfterSeconds: risk.retryAfterSeconds,
      },
      429
    );
  }
  if (!username || !password) return json({ error: "Username and password are required" }, 400);
  if (!validPasswordLength(password)) return json({ error: "Invalid credentials" }, 401);
  if (hasTurnstileSecret(env)) {
    const ts = await verifyTurnstileToken(turnstileToken, clientIp(request), env, request);
    if (!ts.ok) {
      return json({ error: "Turnstile verification failed" }, 400);
    }
  }

  const row = await env.DB.prepare(
    "SELECT id, username, role, password_hash, password_salt FROM users WHERE username = ?"
  )
    .bind(username)
    .first();
  if (!row) {
    // N-01 fix: run dummy PBKDF2 to eliminate timing side-channel
    await verifyPasswordDetailed(password, FAKE_PASSWORD_SALT, FAKE_PASSWORD_HASH);
    return json({ error: "Invalid credentials" }, 401);
  }

  const passwordCheck = await verifyPasswordDetailed(password, row.password_salt, row.password_hash);
  if (!passwordCheck.ok) return json({ error: "Invalid credentials" }, 401);
  if (passwordCheck.needsRehash) {
    await upgradePasswordHash(env, row.id, password).catch(() => {});
  }
  await clearLoginRiskControl(request, env, username).catch(() => {});
  await revokePresentedWebSession(request, env);
  // F-05: session fixation prevention 鈥?old session revoked, new random token generated below.

  const { cookie } = await createSession(env, row.id);
  return json(
    { ok: true, user: { id: row.id, username: row.username, role: row.role } },
    200,
    { "set-cookie": cookie }
  );
}

async function handleMobileLogin(request, env) {
  return loginForApiClient(request, env, ANDROID_CLIENT_TYPE);
}

async function handleMobileRefresh(request, env) {
  return rotateApiSessionTokens(request, env, ANDROID_CLIENT_TYPE, { includeRefreshExpiresIn: true });
}

async function handleMobileLogout(request, env) {
  const auth = await requireApiSession(request, env);
  if (!auth.ok) return auth.response;
  if (auth.apiClientType !== ANDROID_CLIENT_TYPE) {
    return json({ error: "Mobile bearer token required" }, 400);
  }
  await env.DB.prepare("DELETE FROM api_sessions WHERE id = ?").bind(auth.sessionId).run();
  return json({ ok: true });
}

async function handleApiCapabilities(request, env) {
  const corsOrigins = normalizedAllowedCorsOrigins(env);
  return json({
    apiVersion: "v1",
    compatibleClients: [ANDROID_CLIENT_TYPE, "browser_extension"],
    auth: {
      scheme: "Bearer",
      accessTokenExpiresIn: API_ACCESS_TTL_SECONDS,
      refreshTokenExpiresIn: API_REFRESH_TTL_SECONDS,
      refreshTokenRotation: true,
      turnstileRequired: hasTurnstileSecret(env),
      turnstileSiteKey: String(env.TURNSTILE_SITE_KEY || ""),
    },
    limits: {
      extensionBatchMaxIds: EXTENSION_BATCH_MAX_IDS,
    },
    cors: {
      exactOriginAllowlist: true,
      configured: corsOrigins.length > 0,
      credentials: corsCredentialsEnabled(env),
    },
    endpoints: {
      login: "/api/v1/auth/login",
      refresh: "/api/v1/auth/refresh",
      logout: "/api/v1/auth/logout",
      me: "/api/v1/me",
      changePassword: "/api/v1/me/password",
      entries: "/api/v1/entries",
      groups: "/api/v1/groups",
      codesBatch: "/api/v1/codes/batch",
      importOtpAuth: "/api/v1/import/otpauth",
      exportEncrypted: "/api/v1/export/encrypted",
      importEncrypted: "/api/v1/import/encrypted",
    },
  });
}

async function handleApiClientLogin(request, env) {
  const body = await parseJson(request);
  const clientType = normalizeApiClientType(body.clientType || ANDROID_CLIENT_TYPE);
  if (!clientType) return json({ error: "clientType must be android or browser_extension" }, 400);

  if (clientType === "browser_extension") {
    body.clientType = EXTENSION_CLIENT_TYPE;
    return handleExtensionLogin(withJsonBody(request, body), env);
  }

  return loginForApiClient(withJsonBody(request, body), env, ANDROID_CLIENT_TYPE);
}

async function loginForApiClient(request, env, clientType) {
  const body = await parseJson(request);
  const username = normalizeUsername(body.username);
  const password = String(body.password || "");
  const turnstileToken = String(body.turnstileToken || "");
  const risk = await applyLoginRiskControl(request, env, username);
  if (risk.blocked) {
    return json(
      {
        error: "Too many login attempts. Temporarily locked.",
        retryAfterSeconds: risk.retryAfterSeconds,
      },
      429
    );
  }
  if (!username || !password) return json({ error: "Username and password are required" }, 400);
  if (!validPasswordLength(password)) return json({ error: "Invalid credentials" }, 401);
  if (hasTurnstileSecret(env)) {
    const ts = await verifyTurnstileToken(turnstileToken, clientIp(request), env, request);
    if (!ts.ok) {
      return json({ error: "Turnstile verification failed" }, 400);
    }
  }

  const row = await env.DB.prepare(
    "SELECT id, username, role, password_hash, password_salt FROM users WHERE username = ?"
  )
    .bind(username)
    .first();
  if (!row) {
    await verifyPasswordDetailed(password, FAKE_PASSWORD_SALT, FAKE_PASSWORD_HASH);
    return json({ error: "Invalid credentials" }, 401);
  }

  const passwordCheck = await verifyPasswordDetailed(password, row.password_salt, row.password_hash);
  if (!passwordCheck.ok) return json({ error: "Invalid credentials" }, 401);
  if (passwordCheck.needsRehash) {
    await upgradePasswordHash(env, row.id, password).catch(() => {});
  }
  await clearLoginRiskControl(request, env, username).catch(() => {});
  await revokePresentedWebSession(request, env);

  const apiSession = await createApiSession(env, row.id, clientType);
  return json({
    ok: true,
    user: { id: row.id, username: row.username, role: row.role },
    accessToken: apiSession.accessToken,
    refreshToken: apiSession.refreshToken,
    expiresIn: apiSession.expiresIn,
    refreshExpiresIn: API_REFRESH_TTL_SECONDS,
    sessionId: apiSession.sessionId,
  });
}

async function handleApiClientRefresh(request, env) {
  const body = await parseJson(request);
  const clientType = normalizeApiClientType(body.clientType || ANDROID_CLIENT_TYPE);
  if (!clientType) return json({ error: "clientType must be android or browser_extension" }, 400);
  const expected = clientType === "browser_extension" ? EXTENSION_CLIENT_TYPE : ANDROID_CLIENT_TYPE;
  return rotateApiSessionTokens(withJsonBody(request, body), env, expected, { includeRefreshExpiresIn: true });
}

async function handleApiClientLogout(request, env) {
  const auth = await requireApiSession(request, env);
  if (!auth.ok) return auth.response;
  await env.DB.prepare("DELETE FROM api_sessions WHERE id = ?").bind(auth.sessionId).run();
  return json({ ok: true });
}

async function handleExtensionLogin(request, env) {
  const body = await parseJson(request);
  const username = normalizeUsername(body.username);
  const password = String(body.password || "");
  const risk = await applyLoginRiskControl(request, env, username);
  if (risk.blocked) {
    return json(
      {
        error: "Too many login attempts. Temporarily locked.",
        retryAfterSeconds: risk.retryAfterSeconds,
      },
      429
    );
  }
  if (!username || !password) return json({ error: "Username and password are required" }, 400);
  if (!validPasswordLength(password)) return json({ error: "Invalid credentials" }, 401);

  // F-01 fix: Turnstile verification was missing, allowing CAPTCHA bypass via extension login
  const turnstileToken = String(body.turnstileToken || "");
  if (hasTurnstileSecret(env)) {
    const ts = await verifyTurnstileToken(turnstileToken, clientIp(request), env, request);
    if (!ts.ok) {
      return json({ error: "Turnstile verification failed" }, 400);
    }
  }

  const row = await env.DB.prepare(
    "SELECT id, username, role, password_hash, password_salt FROM users WHERE username = ?"
  )
    .bind(username)
    .first();
  if (!row) {
    // N-01 fix: run dummy PBKDF2 to eliminate timing side-channel
    await verifyPasswordDetailed(password, FAKE_PASSWORD_SALT, FAKE_PASSWORD_HASH);
    return json({ error: "Invalid credentials" }, 401);
  }

  const passwordCheck = await verifyPasswordDetailed(password, row.password_salt, row.password_hash);
  if (!passwordCheck.ok) return json({ error: "Invalid credentials" }, 401);
  if (passwordCheck.needsRehash) {
    await upgradePasswordHash(env, row.id, password).catch(() => {});
  }
  await clearLoginRiskControl(request, env, username).catch(() => {});
  await revokePresentedWebSession(request, env);

  const deviceName = normalizeClientMetadata(body.deviceName, 120, "edge");
  const clientVersion = normalizeClientMetadata(body.clientVersion, 64, "unknown");
  const clientType = `${EXTENSION_CLIENT_TYPE}:${deviceName}:${clientVersion}`;
  const apiSession = await createApiSession(env, row.id, clientType);

  return json({
    ok: true,
    user: { id: row.id, username: row.username, role: row.role },
    accessToken: apiSession.accessToken,
    refreshToken: apiSession.refreshToken,
    expiresIn: apiSession.expiresIn,
    refreshExpiresIn: API_REFRESH_TTL_SECONDS,
    sessionId: apiSession.sessionId,
  });
}

async function handleExtensionRefresh(request, env) {
  return rotateApiSessionTokens(request, env, EXTENSION_CLIENT_TYPE, { includeRefreshExpiresIn: true });
}

async function handleExtensionLogout(request, env) {
  const auth = await requireExtensionSession(request, env);
  if (!auth.ok) return auth.response;
  await env.DB.prepare("DELETE FROM api_sessions WHERE id = ?").bind(auth.sessionId).run();
  return json({ ok: true });
}

async function handleExtensionEntries(request, env) {
  const auth = await requireExtensionSession(request, env);
  if (!auth.ok) return auth.response;
  return json({ entries: await listEntriesForAuth(env, auth) });
}

async function handleExtensionCodesBatch(request, env) {
  const auth = await requireExtensionSession(request, env);
  if (!auth.ok) return auth.response;
  return handleCodesBatchForAuth(request, env, auth);
}

async function handleApiCodesBatch(request, env) {
  const auth = await requireApiSession(request, env);
  if (!auth.ok) return auth.response;
  return handleCodesBatchForAuth(request, env, auth);
}

async function handleWebCodesBatch(request, env) {
  const auth = await requireWebSession(request, env);
  if (!auth.ok) return auth.response;
  return handleCodesBatchForAuth(request, env, auth);
}

async function handleCodesBatchForAuth(request, env, auth) {
  const body = await parseJson(request);
  if (!Array.isArray(body.entryIds)) return json({ error: "entryIds must be an array" }, 400);

  const normalizedIds = [];
  const unique = new Set();
  for (const rawId of body.entryIds) {
    const id = Number(rawId);
    if (!Number.isFinite(id) || id <= 0 || !Number.isInteger(id)) {
      return json({ error: "entryIds must contain positive integer ids" }, 400);
    }
    if (unique.has(id)) continue;
    unique.add(id);
    normalizedIds.push(id);
  }
  if (normalizedIds.length === 0) return json({ error: "entryIds cannot be empty" }, 400);
  if (normalizedIds.length > EXTENSION_BATCH_MAX_IDS) {
    return json({ error: `entryIds cannot exceed ${EXTENSION_BATCH_MAX_IDS}` }, 400);
  }

  const { placeholders, params: inParams } = buildInClause(normalizedIds);
  let query = `SELECT id, user_id, secret_enc, digits, period, algorithm, otp_type, hotp_counter, enabled FROM totp_entries WHERE id IN (${placeholders})`;
  const baseParams = [...inParams];
  if (auth.user.role !== "admin") {
    query += " AND user_id = ?";
    baseParams.push(auth.user.id);
  }
  const rows = await env.DB.prepare(query).bind(...baseParams).all();
  const rowMap = new Map((rows.results || []).map((row) => [Number(row.id), row]));

  const nowSec = Math.floor(Date.now() / 1000);
  const items = [];
  for (const id of normalizedIds) {
    const row = rowMap.get(id);
    if (!row) {
      items.push({ id, error: "Entry not found or forbidden" });
      continue;
    }

    if (!entryEnabled(row.enabled)) {
      items.push({ id, otpType: row.otp_type || "totp", enabled: false, error: "Entry is disabled" });
      continue;
    }

    const otpType = row.otp_type || "totp";
    if (otpType === "hotp") {
      items.push({
        id,
        otpType: "hotp",
        enabled: true,
        counter: Number(row.hotp_counter || 0),
        error: "Use HOTP endpoint",
      });
      continue;
    }

    try {
      const period = normalizeTotpPeriod(row.period);
      const digits = normalizeOtpDigits(row.digits);
      const algorithm = normalizeAlgorithm(row.algorithm || "SHA-1");
      if (!algorithm) {
        items.push({ id, otpType: "totp", error: "Unsupported OTP algorithm" });
        continue;
      }
      const secret = await decryptText(row.secret_enc, env);
      const step = Math.floor(nowSec / period);
      const code = await generateTotp(secret, period, digits, algorithm, step);
      const expiresIn = period - (nowSec % period);
      items.push({
        id,
        otpType: "totp",
        enabled: true,
        code,
        expiresIn,
        period,
      });
    } catch {
      items.push({ id, otpType: "totp", error: "Failed to generate code" });
    }
  }

  return json({ serverTime: nowSec, items });
}

async function handleCodesVault(request, env) {
  const auth = await requireWebSession(request, env);
  if (!auth.ok) return auth.response;

  const body = await parseJson(request);
  if (!Array.isArray(body.entryIds)) return json({ error: "entryIds must be an array" }, 400);

  const entryIds = [];
  const uniqueIds = new Set();
  for (const rawId of body.entryIds) {
    const id = Number(rawId);
    if (!Number.isSafeInteger(id) || id <= 0) {
      return json({ error: "entryIds must contain positive integer ids" }, 400);
    }
    if (!uniqueIds.has(id)) {
      uniqueIds.add(id);
      entryIds.push(id);
    }
  }
  if (entryIds.length === 0) return json({ error: "entryIds cannot be empty" }, 400);
  if (entryIds.length > VAULT_MAX_IDS) {
    return json({ error: `entryIds cannot exceed ${VAULT_MAX_IDS}` }, 400);
  }

  const stepUp = await requireRecentWebStepUp(request, env, auth, body);
  if (stepUp) return stepUp;

  const { placeholders, params: inParams } = buildInClause(entryIds);
  let query = `SELECT id, secret_enc, digits, period, algorithm, otp_type, enabled FROM totp_entries WHERE id IN (${placeholders})`;
  const params = [...inParams];
  if (auth.user.role !== "admin") {
    query += " AND user_id = ?";
    params.push(auth.user.id);
  }
  const result = await env.DB.prepare(query).bind(...params).all();
  const rowsById = new Map((result.results || []).map((row) => [Number(row.id), row]));
  const items = [];

  for (const id of entryIds) {
    const row = rowsById.get(id);
    if (!row || !entryEnabled(row.enabled) || (row.otp_type || "totp") !== "totp") continue;
    const algorithm = normalizeAlgorithm(row.algorithm || OTP_ALGORITHM_DEFAULT);
    if (!algorithm) continue;
    try {
      items.push({
        id,
        secret: await decryptText(row.secret_enc, env),
        digits: normalizeOtpDigits(row.digits),
        period: normalizeTotpPeriod(row.period),
        algorithm,
      });
    } catch {
      // Do not expose decryption details or encrypted material to the client.
    }
  }

  return json({ serverTime: Math.floor(Date.now() / 1000), items });
}

async function handleLogout(request, env) {
  const origin = request.headers.get("Origin");
  if (origin) {
    const url = new URL(request.url);
    const expectedOrigin = `${url.protocol}//${url.host}`;
    if (origin !== expectedOrigin) return json({ error: "Invalid origin" }, 403);
  }
  const token = readCookie(request, SESSION_COOKIE);
  if (token) {
    const tokenHash = await hashSessionToken(token, env);
    await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(tokenHash).run();
  }
  return json({ ok: true }, 200, { "set-cookie": clearSessionCookie() });
}

async function handleCloseSoon(request, env) {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token) return json({ ok: true });
  if (!isAllowedCloseSoonRequest(request)) return json({ ok: true });
  const tokenHash = await hashSessionToken(token, env);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + CLOSE_LOGOUT_GRACE_SECONDS * 1000).toISOString();
  await updateWebSessionExpiry(env, tokenHash, expiresAt);
  return json({ ok: true });
}

function isAllowedCloseSoonRequest(request) {
  const closeHeader = String(request.headers.get(CLOSE_SOON_HEADER) || "").trim().toLowerCase();
  if (closeHeader === CLOSE_SOON_HEADER_VALUE) return true;

  const fetchMode = String(request.headers.get("sec-fetch-mode") || "").trim().toLowerCase();
  const fetchDest = String(request.headers.get("sec-fetch-dest") || "").trim().toLowerCase();
  return fetchMode === "navigate" && fetchDest === "document";
}

async function handleMe(request, env) {
  const path = new URL(request.url).pathname;
  const auth = path.startsWith("/api/v1/")
    ? await requireApiSession(request, env)
    : await requireWebSession(request, env);
  if (!auth.ok) return auth.response;
  if (auth.sessionKind === "web") {
    await refreshSessionTtl(request, env).catch(() => {});
  }
  return json({ user: auth.user });
}

async function handleAppData(request, env) {
  const auth = await requireWebSession(request, env);
  if (!auth.ok) return auth.response;

  const [entries, groups] = await Promise.all([
    listEntriesForAuth(env, auth),
    listGroupsForAuth(env, auth),
  ]);
  return json({ entries, groups });
}

async function handleListEntries(request, env) {
  const auth = await requireRouteSession(request, env);
  if (!auth.ok) return auth.response;
  return json({ entries: await listEntriesForAuth(env, auth) });
}

async function listEntriesForAuth(env, auth) {
  if (auth.user.role === "admin") {
    const rows = await env.DB.prepare(
      "SELECT e.id, e.user_id, u.username, e.label, e.issuer, e.digits, e.period, e.algorithm, e.otp_type, e.hotp_counter, e.enabled, e.group_id, e.sort_order, g.name AS group_name, g.color AS group_color, e.created_at FROM totp_entries e JOIN users u ON u.id = e.user_id LEFT JOIN groups g ON g.id = e.group_id ORDER BY e.enabled DESC, e.sort_order ASC, e.id DESC"
    ).all();
    return rows.results || [];
  }

  const rows = await env.DB.prepare(
    "SELECT e.id, e.user_id, e.label, e.issuer, e.digits, e.period, e.algorithm, e.otp_type, e.hotp_counter, e.enabled, e.group_id, e.sort_order, g.name AS group_name, g.color AS group_color, e.created_at FROM totp_entries e LEFT JOIN groups g ON g.id = e.group_id WHERE e.user_id = ? ORDER BY e.enabled DESC, e.sort_order ASC, e.id DESC"
  )
    .bind(auth.user.id)
    .all();
  return rows.results || [];
}

async function handleReorderEntries(request, env) {
  const auth = await requireRouteSession(request, env);
  if (!auth.ok) return auth.response;

  const body = await parseJson(request);
  const orderedIds = Array.isArray(body.orderedIds) ? body.orderedIds.map(Number) : null;
  if (!orderedIds || orderedIds.length > ENTRY_REORDER_MAX_IDS) {
    return json({ error: `orderedIds must be an array with at most ${ENTRY_REORDER_MAX_IDS} items` }, 400);
  }
  if (orderedIds.some((id) => !Number.isSafeInteger(id) || id <= 0) || new Set(orderedIds).size !== orderedIds.length) {
    return json({ error: "orderedIds must contain unique positive integer ids" }, 400);
  }
  if (!orderedIds.length) return json({ ok: true });

  const allowedIds = new Set();
  for (let offset = 0; offset < orderedIds.length; offset += VAULT_MAX_IDS) {
    const chunk = orderedIds.slice(offset, offset + VAULT_MAX_IDS);
    const placeholders = chunk.map(() => "?").join(",");
    let statement = env.DB.prepare(`SELECT id FROM totp_entries WHERE id IN (${placeholders})`);
    const bindings = [...chunk];
    if (auth.user.role !== "admin") {
      statement = env.DB.prepare(`SELECT id FROM totp_entries WHERE id IN (${placeholders}) AND user_id = ?`);
      bindings.push(auth.user.id);
    }
    const rows = await statement.bind(...bindings).all();
    (rows.results || []).forEach((row) => allowedIds.add(Number(row.id)));
  }
  if (allowedIds.size !== orderedIds.length) return json({ error: "One or more entries are unavailable" }, 403);

  await env.DB.batch(orderedIds.map((id, index) => (
    env.DB.prepare("UPDATE totp_entries SET sort_order = ? WHERE id = ?").bind(index, id)
  )));
  return json({ ok: true });
}

async function handleCreateEntry(request, env) {
  const auth = await requireRouteSession(request, env);
  if (!auth.ok) return auth.response;

  const body = await parseJson(request);
  const normalized = normalizeOtpEntryInput(body, { strictParameters: true });
  if (!normalized.ok) return json({ error: normalized.error }, 400);
  const payload = normalized.data;

  const { label, issuer, secret, digits, period, algorithm, otpType, hotpCounter } = payload;
  if (label.length > ENTRY_LABEL_MAX_LENGTH) return json({ error: `label must be at most ${ENTRY_LABEL_MAX_LENGTH} characters` }, 400);
  if (issuer.length > ENTRY_ISSUER_MAX_LENGTH) return json({ error: `issuer must be at most ${ENTRY_ISSUER_MAX_LENGTH} characters` }, 400);
  const enabled = body.enabled === undefined ? 1 : booleanFlag(body.enabled);
  const groupId = parseOptionalPositiveId(body.groupId);
  const requestedUserId = Number(body.userId !== undefined ? body.userId : auth.user.id);
  const userId = auth.user.role === "admin" ? requestedUserId : auth.user.id;

  if (!Number.isInteger(userId) || userId <= 0) return json({ error: "userId must be a positive integer" }, 400);
  if (groupId === false) return json({ error: "groupId must be a positive integer or null" }, 400);
  if (enabled === false) return json({ error: "enabled must be a boolean" }, 400);

  if (auth.user.role === "admin") {
    const exists = await env.DB.prepare("SELECT id FROM users WHERE id = ?").bind(userId).first();
    if (!exists) return json({ error: "userId does not exist" }, 400);
  }
  if (groupId) {
    const group = await env.DB.prepare("SELECT id, user_id FROM groups WHERE id = ?").bind(groupId).first();
    if (!group) return json({ error: "groupId does not exist" }, 400);
    if (Number(group.user_id) !== Number(userId)) return json({ error: "groupId must belong to entry user" }, 400);
  }

  const secretEnc = await encryptText(secret, env);
  const now = nowIso();
  const result = await env.DB.prepare(
    "INSERT INTO totp_entries (user_id, label, issuer, secret_enc, digits, period, algorithm, otp_type, hotp_counter, enabled, group_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  )
    .bind(userId, label, issuer, secretEnc, digits, period, algorithm, otpType, hotpCounter, enabled, groupId, now)
    .run();

  return json({ ok: true, id: normalizeDbId(result.meta?.last_row_id) }, 201);
}

async function handleUpdateEntry(request, env) {
  const auth = await requireRouteSession(request, env);
  if (!auth.ok) return auth.response;
  const id = pathResourceId(request, "entries");
  if (!Number.isFinite(id)) return json({ error: "Invalid id" }, 400);

  const existing = await env.DB.prepare("SELECT * FROM totp_entries WHERE id = ?").bind(id).first();
  if (!existing) return json({ error: "Entry not found" }, 404);
  if (auth.user.role !== "admin" && existing.user_id !== auth.user.id) return json({ error: "Forbidden" }, 403);

  const body = await parseJson(request);
  const label = body.label !== undefined ? String(body.label).trim() : existing.label;
  const issuer = body.issuer !== undefined ? String(body.issuer).trim() : existing.issuer;
  if (label.length > ENTRY_LABEL_MAX_LENGTH) return json({ error: `label must be at most ${ENTRY_LABEL_MAX_LENGTH} characters` }, 400);
  if (issuer.length > ENTRY_ISSUER_MAX_LENGTH) return json({ error: `issuer must be at most ${ENTRY_ISSUER_MAX_LENGTH} characters` }, 400);
  const digits = body.digits !== undefined ? Number(body.digits) : existing.digits;
  const period = body.period !== undefined ? Number(body.period) : existing.period;
  const algorithm = body.algorithm !== undefined ? normalizeAlgorithm(body.algorithm) : normalizeAlgorithm(existing.algorithm || "SHA-1");
  const otpType = body.otpType ? (body.otpType === "hotp" ? "hotp" : "totp") : (existing.otp_type || "totp");
  const hotpCounter = body.hotpCounter !== undefined ? Number(body.hotpCounter) : (existing.hotp_counter || 0);
  const enabled = body.enabled !== undefined ? booleanFlag(body.enabled) : (entryEnabled(existing.enabled) ? 1 : 0);
  const groupId = body.groupId !== undefined ? parseOptionalPositiveId(body.groupId) : existing.group_id;

  if (!label) return json({ error: "label is required" }, 400);
  if (groupId === false) return json({ error: "groupId must be a positive integer or null" }, 400);
  if (![6, 7, 8].includes(digits)) return json({ error: "digits must be 6/7/8" }, 400);
  if (otpType === "totp" && (!Number.isFinite(period) || period < 15 || period > 120)) return json({ error: "period must be between 15 and 120" }, 400);
  if (!algorithm) return json({ error: OTP_ALGORITHM_ERROR }, 400);
  if (otpType === "hotp" && (!Number.isInteger(hotpCounter) || hotpCounter < 0)) return json({ error: "hotpCounter must be >= 0" }, 400);
  if (enabled === false) return json({ error: "enabled must be a boolean" }, 400);

  let secretEnc = existing.secret_enc;
  if (body.secret !== undefined) {
    const rawSecret = String(body.secret || "").trim();
    if (!rawSecret) return json({ error: "secret cannot be empty" }, 400);
    let secret;
    try {
      secret = canonicalizeBase32Secret(rawSecret);
    } catch {
      return json({ error: "secret is not valid base32" }, 400);
    }
    secretEnc = await encryptText(secret, env);
  }

  if (groupId) {
    const group = await env.DB.prepare("SELECT id, user_id FROM groups WHERE id = ?").bind(groupId).first();
    if (!group) return json({ error: "groupId does not exist" }, 400);
    if (Number(group.user_id) !== Number(existing.user_id)) return json({ error: "groupId must belong to entry user" }, 400);
  }

  await env.DB.prepare(
    "UPDATE totp_entries SET label = ?, issuer = ?, secret_enc = ?, digits = ?, period = ?, algorithm = ?, otp_type = ?, hotp_counter = ?, enabled = ?, group_id = ? WHERE id = ?"
  )
    .bind(label, issuer, secretEnc, digits, period, algorithm, otpType, hotpCounter, enabled, groupId, id)
    .run();
  return json({ ok: true });
}

async function handleEntryCode(request, env) {
  const auth = await requireRouteSession(request, env);
  if (!auth.ok) return auth.response;
  const id = pathResourceId(request, "entries");
  if (!Number.isFinite(id)) return json({ error: "Invalid id" }, 400);

  const row = await env.DB.prepare("SELECT * FROM totp_entries WHERE id = ?").bind(id).first();
  if (!row) return json({ error: "Entry not found" }, 404);
  if (auth.user.role !== "admin" && row.user_id !== auth.user.id) return json({ error: "Forbidden" }, 403);
  if (!entryEnabled(row.enabled)) return json({ error: "Entry is disabled" }, 409);

  const secret = await decryptText(row.secret_enc, env);
  const otpType = row.otp_type || "totp";
  if (otpType === "hotp") {
    return json({ error: "Use /api/entries/:id/hotp to generate HOTP code" }, 400);
  }
  const nowSec = Math.floor(Date.now() / 1000);
  const period = normalizeTotpPeriod(row.period);
  const digits = normalizeOtpDigits(row.digits);
  const step = Math.floor(nowSec / period);
  const algorithm = normalizeAlgorithm(row.algorithm || "SHA-1");
  if (!algorithm) return json({ error: "Unsupported OTP algorithm" }, 400);
  const code = await generateTotp(secret, period, digits, algorithm, step);
  const expiresIn = period - (nowSec % period);
  return json({ code, expiresIn, now: nowSec, otpType: "totp" });
}

async function handleVerifyTotp(request, env) {
  const auth = await requireRouteSession(request, env);
  if (!auth.ok) return auth.response;
  const id = pathResourceId(request, "entries");
  if (!Number.isFinite(id)) return json({ error: "Invalid id" }, 400);

  const body = await parseJson(request);
  const submittedCode = String(body.code || "").replace(/\s+/g, "");
  if (!/^\d{6,8}$/.test(submittedCode)) return json({ error: "code must be 6 to 8 digits" }, 400);
  const verifyLimit = await applyTotpVerifyRateLimit(request, env, id);
  if (verifyLimit) return verifyLimit;

  const row = await env.DB.prepare("SELECT * FROM totp_entries WHERE id = ?").bind(id).first();
  if (!row) return json({ error: "Entry not found" }, 404);
  if (auth.user.role !== "admin" && row.user_id !== auth.user.id) return json({ error: "Forbidden" }, 403);
  if ((row.otp_type || "totp") === "hotp") return json({ error: "Use /api/entries/:id/hotp for HOTP codes" }, 400);
  if (!entryEnabled(row.enabled)) return json({ error: "Entry is disabled" }, 409);

  const algorithm = normalizeAlgorithm(row.algorithm || "SHA-1");
  if (!algorithm) return json({ error: "Unsupported OTP algorithm" }, 400);
  const secret = await decryptText(row.secret_enc, env);
  const nowSec = Math.floor(Date.now() / 1000);
  const period = normalizeTotpPeriod(row.period);
  const digits = normalizeOtpDigits(row.digits);
  const currentStep = Math.floor(nowSec / period);
  for (const windowOffset of [-1, 0, 1]) {
    const expected = await generateTotp(secret, period, digits, algorithm, currentStep + windowOffset);
    if (constantTimeEqual(enc(submittedCode), enc(expected))) {
      return json({ ok: true, valid: true, window: windowOffset });
    }
  }
  return json({ ok: true, valid: false });
}

async function handleConsumeHotp(request, env) {
  const auth = await requireRouteSession(request, env);
  if (!auth.ok) return auth.response;
  const id = pathResourceId(request, "entries");
  if (!Number.isFinite(id)) return json({ error: "Invalid id" }, 400);

  const row = await env.DB.prepare("SELECT * FROM totp_entries WHERE id = ?").bind(id).first();
  if (!row) return json({ error: "Entry not found" }, 404);
  if (auth.user.role !== "admin" && row.user_id !== auth.user.id) return json({ error: "Forbidden" }, 403);
  if ((row.otp_type || "totp") !== "hotp") return json({ error: "This entry is not HOTP" }, 400);
  if (!entryEnabled(row.enabled)) return json({ error: "Entry is disabled" }, 409);

  const hotpLimit = await applyHotpConsumeRateLimit(request, env, id);
  if (hotpLimit) return hotpLimit;

  const secret = await decryptText(row.secret_enc, env);
  const counter = Number(row.hotp_counter || 0);
  const digits = normalizeOtpDigits(row.digits);
  const algorithm = normalizeAlgorithm(row.algorithm || "SHA-1");
  if (!algorithm) return json({ error: "Unsupported OTP algorithm" }, 400);

  // F-06 fix: single atomic UPDATE ... RETURNING to prevent TOCTOU race.
  // D1 serialises writes per DO, so RETURNING + increment is naturally atomic.
  const result = await env.DB.prepare(
    "UPDATE totp_entries SET hotp_counter = hotp_counter + 1 WHERE id = ? AND otp_type = 'hotp' RETURNING hotp_counter - 1 AS old_counter, hotp_counter AS new_counter"
  ).bind(id).first();

  if (!result || result.old_counter === undefined) {
    return json({ error: "HOTP code already consumed, please retry" }, 409);
  }

  const usedCounter = Number(result.old_counter);
  const nextCounter = Number(result.new_counter);
  const code = await generateHotp(secret, digits, algorithm, usedCounter);
  return json({ code, counter: usedCounter, nextCounter, otpType: "hotp" });
}

async function handleListGroups(request, env) {
  const auth = await requireRouteSession(request, env);
  if (!auth.ok) return auth.response;
  return json({ groups: await listGroupsForAuth(env, auth) });
}

async function listGroupsForAuth(env, auth) {
  if (auth.user.role === "admin") {
    const rows = await env.DB.prepare(
      "SELECT g.id, g.user_id, u.username, g.name, g.color, g.created_at FROM groups g JOIN users u ON u.id = g.user_id ORDER BY g.id DESC"
    ).all();
    return rows.results || [];
  }
  const rows = await env.DB.prepare(
    "SELECT id, user_id, name, color, created_at FROM groups WHERE user_id = ? ORDER BY id DESC"
  )
    .bind(auth.user.id)
    .all();
  return rows.results || [];
}

async function handleCreateGroup(request, env) {
  const auth = await requireRouteSession(request, env);
  if (!auth.ok) return auth.response;

  const body = await parseJson(request);
  const name = String(body.name || "").trim();
  const color = validHexColor(body.color) ? body.color : "#0f766e";
  if (!name) return json({ error: "name is required" }, 400);
  if (name.length > GROUP_NAME_MAX_LENGTH) return json({ error: `name must be at most ${GROUP_NAME_MAX_LENGTH} characters` }, 400);
  const requestedUserId = Number(body.userId !== undefined ? body.userId : auth.user.id);
  const userId = auth.user.role === "admin" ? requestedUserId : auth.user.id;
  if (!Number.isInteger(userId) || userId <= 0) return json({ error: "userId must be a positive integer" }, 400);
  if (auth.user.role === "admin") {
    const exists = await env.DB.prepare("SELECT id FROM users WHERE id = ?").bind(userId).first();
    if (!exists) return json({ error: "userId does not exist" }, 400);
  }

  try {
    const result = await env.DB.prepare(
      "INSERT INTO groups (user_id, name, color, created_at) VALUES (?, ?, ?, ?)"
    )
      .bind(userId, name, color, nowIso())
      .run();
    return json({ ok: true, id: normalizeDbId(result.meta?.last_row_id) }, 201);
  } catch {
    return json({ error: "Group name already exists for this user" }, 409);
  }
}

async function handleUpdateGroup(request, env) {
  const auth = await requireAuth(request, env);
  if (!auth.ok) return auth.response;
  const id = pathResourceId(request, "groups");
  if (!Number.isFinite(id)) return json({ error: "Invalid id" }, 400);

  const existing = await env.DB.prepare("SELECT id, user_id, name, color FROM groups WHERE id = ?").bind(id).first();
  if (!existing) return json({ error: "Group not found" }, 404);
  if (auth.user.role !== "admin" && Number(existing.user_id) !== Number(auth.user.id)) {
    return json({ error: "Forbidden" }, 403);
  }

  const body = await parseJson(request);
  if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "Invalid JSON body" }, 400);
  const keys = Object.keys(body);
  if (!keys.length) return json({ error: "name or color is required" }, 400);
  if (keys.some((key) => key !== "name" && key !== "color")) {
    return json({ error: "Only name and color can be updated" }, 400);
  }

  const name = body.name !== undefined ? String(body.name ?? "").trim() : existing.name;
  const color = body.color !== undefined ? String(body.color ?? "").trim() : existing.color;
  if (!name) return json({ error: "name is required" }, 400);
  if (name.length > GROUP_NAME_MAX_LENGTH) return json({ error: `name must be at most ${GROUP_NAME_MAX_LENGTH} characters` }, 400);
  if (!validHexColor(color)) return json({ error: "color must be #RRGGBB" }, 400);

  try {
    await env.DB.prepare("UPDATE groups SET name = ?, color = ? WHERE id = ?").bind(name, color, id).run();
    return json({ ok: true });
  } catch {
    return json({ error: "Group name already exists for this user" }, 409);
  }
}

async function handleDeleteGroup(request, env) {
  const auth = await requireRouteSession(request, env);
  if (!auth.ok) return auth.response;
  const id = pathResourceId(request, "groups");
  if (!Number.isFinite(id)) return json({ error: "Invalid id" }, 400);

  const row = await env.DB.prepare("SELECT id, user_id FROM groups WHERE id = ?").bind(id).first();
  if (!row) return json({ error: "Group not found" }, 404);
  if (auth.user.role !== "admin" && row.user_id !== auth.user.id) return json({ error: "Forbidden" }, 403);

  await env.DB.prepare("UPDATE totp_entries SET group_id = NULL WHERE group_id = ?").bind(id).run();
  await env.DB.prepare("DELETE FROM groups WHERE id = ?").bind(id).run();
  return json({ ok: true });
}

async function handleExportData(request, env) {
  const auth = await requireWebSession(request, env);
  if (!auth.ok) return auth.response;
  const confirmation = await requirePlaintextExportConfirmation(request, env, auth);
  if (confirmation) return confirmation;
  return json(await getExportPayload(auth, env));
}

async function handleImportData(request, env) {
  const auth = await requireWebSession(request, env);
  if (!auth.ok) return auth.response;

  const body = await parseJson(request);
  return importPayload(body, auth, env);
}

async function handleExportOtpAuth(request, env) {
  const auth = await requireWebSession(request, env);
  if (!auth.ok) return auth.response;
  const confirmation = await requirePlaintextExportConfirmation(request, env, auth);
  if (confirmation) return confirmation;

  const entriesQuery =
    auth.user.role === "admin"
      ? env.DB.prepare("SELECT id, user_id, label, issuer, secret_enc, digits, period, algorithm, otp_type, hotp_counter, enabled FROM totp_entries ORDER BY id ASC")
      : env.DB.prepare("SELECT id, user_id, label, issuer, secret_enc, digits, period, algorithm, otp_type, hotp_counter, enabled FROM totp_entries WHERE user_id = ? ORDER BY id ASC").bind(auth.user.id);
  const entriesRes = await entriesQuery.all();
  const lines = [];
  for (const e of entriesRes.results || []) {
    const secret = await decryptText(e.secret_enc, env);
    lines.push(buildOtpAuthUri({ ...e, secret }));
  }
  const text = lines.join("\n");
  return new Response(text, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "content-disposition": `attachment; filename="otpauth-export-${Date.now()}.txt"`,
      ...commonSecurityHeaders(),
    },
  });
}

async function handleImportOtpAuth(request, env) {
  const auth = await requireRouteSession(request, env);
  if (!auth.ok) return auth.response;
  const body = await parseJson(request);
  const text = String(body.text || "");
  if (!text.trim()) return json({ error: "text is required" }, 400);

  // N-07 fix: reject oversized payloads to prevent CPU/memory spikes
  if (text.length > 200_000) return json({ error: "otpauth text too large (max 200KB)" }, 413);

  // Non-admin users can ONLY import to their own account (security fix)
  const requestedUserId = Number(body.userId !== undefined ? body.userId : auth.user.id);
  if (auth.user.role !== "admin" && requestedUserId !== auth.user.id) {
    return json({ error: "Forbidden: cannot import data to another user's account" }, 403);
  }
  const userId = auth.user.role === "admin" ? requestedUserId : auth.user.id;
  if (!Number.isInteger(userId) || userId <= 0) return json({ error: "userId must be a positive integer" }, 400);
  if (auth.user.role === "admin") {
    const exists = await env.DB.prepare("SELECT id FROM users WHERE id = ?").bind(userId).first();
    if (!exists) return json({ error: "userId does not exist" }, 400);
  }
  const groupId = parseOptionalPositiveId(body.groupId);
  if (groupId === false) return json({ error: "groupId must be a positive integer or null" }, 400);
  if (groupId) {
    const group = await env.DB.prepare("SELECT id, user_id FROM groups WHERE id = ?").bind(groupId).first();
    if (!group) return json({ error: "Group not found" }, 404);
    if (Number(group.user_id) !== Number(userId)) return json({ error: "Forbidden" }, 403);
  }

  const uris = extractOtpAuthUris(text);
  if (!uris.length) return json({ error: "No otpauth URI found in text" }, 400);
  // F-10 fix: limit otpauth import size
  if (uris.length > 500) {
    return json({ error: "Too many otpauth URIs (max 500)" }, 400);
  }

  let imported = 0;
  const importedIds = [];
  const errors = [];
  for (const uri of uris) {
    const normalized = normalizeOtpEntryInput({ otpauthUri: uri }, { strictParameters: false, missingMessage: "Missing secret/label" });
    if (!normalized.ok) {
      errors.push(normalized.error);
      continue;
    }
    const data = normalized.data;
    const { secret, label, issuer, digits, period, algorithm, otpType, hotpCounter } = data;
    if (label.length > ENTRY_LABEL_MAX_LENGTH) { errors.push("Label too long"); continue; }
    if (issuer.length > ENTRY_ISSUER_MAX_LENGTH) { errors.push("Issuer too long"); continue; }
    try {
      const secretEnc = await encryptText(secret, env);
      const result = await env.DB.prepare(
        "INSERT INTO totp_entries (user_id, label, issuer, secret_enc, digits, period, algorithm, otp_type, hotp_counter, enabled, group_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)"
      )
        .bind(userId, label, issuer, secretEnc, digits, period, algorithm, otpType, hotpCounter, groupId, nowIso())
        .run();
      imported += 1;
      importedIds.push(normalizeDbId(result.meta?.last_row_id));
    } catch (e) {
      errors.push(String(e && e.message ? e.message : "failed"));
    }
  }

  return json({
    ok: true,
    found: uris.length,
    imported,
    importedIds,
    failed: uris.length - imported,
    errors: errors.slice(0, 5),
  });
}

async function requirePlaintextExportConfirmation(request, env, auth) {
  if (String(env.ALLOW_PLAINTEXT_EXPORT || "").toLowerCase() !== "true") {
    return json({ error: "Plaintext export is disabled. Use /api/export/encrypted." }, 403);
  }
  // Read password from request body for re-verification
  let password;
  try {
    const body = await parseJson(request.clone());
    password = String(body.confirmPassword || "");
  } catch {
    return json({ error: "Password confirmation required for plaintext export." }, 400);
  }
  if (!password) {
    return json({ error: "Password confirmation required for plaintext export." }, 400);
  }
  // Retrieve user's current password hash for verification
  const userRow = await env.DB.prepare(
    "SELECT password_hash, password_salt FROM users WHERE id = ?"
  ).bind(auth.user.id).first();
  if (!userRow) return json({ error: "User not found" }, 401);
  const passwordCheck = await verifyPassword(password, userRow.password_salt, userRow.password_hash);
  if (!passwordCheck) {
    return json({ error: "Invalid password confirmation" }, 401);
  }
  await markWebSessionStepUp(env, auth).catch(() => {});
  return null;
}

function isStepUpFresh(auth) {
  const lastMs = Date.parse(String(auth.stepUpAt || ""));
  return Number.isFinite(lastMs) && Date.now() - lastMs <= STEP_UP_TTL_SECONDS * 1000;
}

async function requireRecentWebStepUp(request, env, auth, body) {
  if (auth.sessionKind !== "web") return json({ error: "Web session required" }, 403);
  if (isStepUpFresh(auth)) return null;
  const password = String(body.confirmPassword || body.currentPassword || "");
  if (!password) return json({ error: "Current password confirmation required" }, 401);

  const userRow = await env.DB.prepare(
    "SELECT password_hash, password_salt FROM users WHERE id = ?"
  ).bind(auth.user.id).first();
  if (!userRow) return json({ error: "User not found" }, 401);

  const passwordCheck = await verifyPasswordDetailed(password, userRow.password_salt, userRow.password_hash);
  if (!passwordCheck.ok) return json({ error: "Invalid password confirmation" }, 401);
  await markWebSessionStepUp(env, auth).catch(() => {});
  return null;
}

async function markWebSessionStepUp(env, auth, at = nowIso()) {
  if (!auth || auth.sessionKind !== "web" || !auth.tokenHash) return;
  try {
    await env.DB.prepare("UPDATE sessions SET step_up_at = ? WHERE token_hash = ?")
      .bind(at, auth.tokenHash)
      .run();
    auth.stepUpAt = at;
  } catch (err) {
    if (!isMissingColumnError(err, "step_up_at")) throw err;
  }
}

async function getExportPayload(auth, env) {
  const groupsQuery =
    auth.user.role === "admin"
      ? env.DB.prepare("SELECT id, user_id, name, color, created_at FROM groups ORDER BY id ASC")
      : env.DB.prepare("SELECT id, user_id, name, color, created_at FROM groups WHERE user_id = ? ORDER BY id ASC").bind(auth.user.id);
  const entriesQuery =
    auth.user.role === "admin"
      ? env.DB.prepare("SELECT id, user_id, label, issuer, secret_enc, digits, period, algorithm, otp_type, hotp_counter, enabled, group_id, created_at FROM totp_entries ORDER BY id ASC")
      : env.DB.prepare("SELECT id, user_id, label, issuer, secret_enc, digits, period, algorithm, otp_type, hotp_counter, enabled, group_id, created_at FROM totp_entries WHERE user_id = ? ORDER BY id ASC").bind(auth.user.id);

  const [groupsRes, entriesRes] = await Promise.all([groupsQuery.all(), entriesQuery.all()]);
  const entries = [];
  for (const e of entriesRes.results || []) {
    entries.push({
      ...e,
      secret: await decryptText(e.secret_enc, env),
      secret_enc: undefined,
    });
  }
  return {
    format: "worker-2fauth-export-v1",
    exportedAt: nowIso(),
    by: auth.user.username,
    groups: groupsRes.results || [],
    entries,
  };
}

async function importPayload(body, auth, env) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ error: "import payload must be an object" }, 400);
  }
  const groups = Array.isArray(body.groups) ? body.groups : [];
  const entries = Array.isArray(body.entries) ? body.entries : [];

  // F-10 fix: limit import size to prevent DoS
  const MAX_IMPORT_ENTRIES = 500;
  const MAX_IMPORT_GROUPS = 100;
  if (groups.length > MAX_IMPORT_GROUPS) {
    return json({ error: `groups cannot exceed ${MAX_IMPORT_GROUPS}` }, 400);
  }
  if (entries.length > MAX_IMPORT_ENTRIES) {
    return json({ error: `entries cannot exceed ${MAX_IMPORT_ENTRIES}` }, 400);
  }
  const imported = { groups: 0, entries: 0 };

  // Admin can only import to their own account unless explicitly managing another user
  // Non-admin users can ONLY import to their own account (security fix)
  const requestedUserId = Number(body.userId !== undefined ? body.userId : auth.user.id);
  if (auth.user.role !== "admin" && requestedUserId !== auth.user.id) {
    return json({ error: "Forbidden: cannot import data to another user's account" }, 403);
  }
  const userId = auth.user.role === "admin" ? requestedUserId : auth.user.id;
  if (!Number.isInteger(userId) || userId <= 0) return json({ error: "userId must be a positive integer" }, 400);
  if (auth.user.role === "admin") {
    const exists = await env.DB.prepare("SELECT id FROM users WHERE id = ?").bind(userId).first();
    if (!exists) return json({ error: "userId does not exist" }, 400);
  }

  const normalizedGroups = [];
  for (const g of groups) {
    if (!g || typeof g !== "object") continue;
    const name = String(g.name || "").trim();
    if (!name) continue;
    if (name.length > GROUP_NAME_MAX_LENGTH) continue;
    const color = validHexColor(g.color) ? g.color : "#0f766e";
    normalizedGroups.push({ sourceId: String(g.id), name, color });
  }

  const uniqueGroupNames = [...new Set(normalizedGroups.map((group) => group.name))];
  const existingGroupsByName = new Map();
  if (uniqueGroupNames.length) {
    const { placeholders, params } = buildInClause(uniqueGroupNames);
    const result = await env.DB.prepare(
      `SELECT id, name FROM groups WHERE user_id = ? AND name IN (${placeholders})`
    ).bind(userId, ...params).all();
    (result.results || []).forEach((group) => existingGroupsByName.set(String(group.name), normalizeDbId(group.id)));
  }

  const groupsToInsert = [];
  const seenGroupNames = new Set(existingGroupsByName.keys());
  for (const group of normalizedGroups) {
    if (seenGroupNames.has(group.name)) continue;
    seenGroupNames.add(group.name);
    groupsToInsert.push(group);
  }
  for (let start = 0; start < groupsToInsert.length; start += 40) {
    const chunk = groupsToInsert.slice(start, start + 40);
    const statements = chunk.map((group) => env.DB.prepare(
      "INSERT OR IGNORE INTO groups (user_id, name, color, created_at) VALUES (?, ?, ?, ?)"
    ).bind(userId, group.name, group.color, nowIso()));
    const results = await runD1Batch(env, statements);
    imported.groups += results.reduce((count, result) => count + Number(result?.meta?.changes || 0), 0);
  }

  const groupsByName = new Map(existingGroupsByName);
  if (uniqueGroupNames.length) {
    const { placeholders, params } = buildInClause(uniqueGroupNames);
    const result = await env.DB.prepare(
      `SELECT id, name FROM groups WHERE user_id = ? AND name IN (${placeholders})`
    ).bind(userId, ...params).all();
    (result.results || []).forEach((group) => groupsByName.set(String(group.name), normalizeDbId(group.id)));
  }
  const groupMap = new Map(normalizedGroups.map((group) => [group.sourceId, groupsByName.get(group.name) || null]));

  const normalizedEntries = [];
  for (const e of entries) {
    if (!e || typeof e !== "object") continue;
    const label = String(e.label || "").trim();
    const issuer = String(e.issuer || "").trim();
    if (!e.secret || !label) continue;
    if (label.length > ENTRY_LABEL_MAX_LENGTH) continue;
    if (issuer.length > ENTRY_ISSUER_MAX_LENGTH) continue;
    const algorithm = normalizeAlgorithm(e.algorithm || OTP_ALGORITHM_DEFAULT);
    if (!algorithm) continue;
    try {
      const secret = canonicalizeBase32Secret(e.secret);
      const groupId = e.group_id !== undefined && e.group_id !== null ? groupMap.get(String(e.group_id)) || null : null;
      const otpType = e.otp_type === "hotp" ? "hotp" : "totp";
      const digits = normalizeOtpDigits(e.digits);
      const period = normalizeTotpPeriod(e.period);
      const hotpCounter = normalizeHotpCounter(e.hotp_counter);
      const enabled = e.enabled === undefined ? 1 : booleanFlag(e.enabled);
      normalizedEntries.push({ label, issuer, secret, groupId, otpType, digits, period, algorithm, hotpCounter, enabled });
    } catch {
      continue;
    }
  }

  for (let start = 0; start < normalizedEntries.length; start += 40) {
    const chunk = normalizedEntries.slice(start, start + 40);
    const prepared = await Promise.all(chunk.map(async (entry) => ({
      ...entry,
      secretEnc: await encryptText(entry.secret, env),
    })));
    const statements = prepared.map((entry) => env.DB.prepare(
      "INSERT INTO totp_entries (user_id, label, issuer, secret_enc, digits, period, algorithm, otp_type, hotp_counter, enabled, group_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).bind(userId, entry.label, entry.issuer, entry.secretEnc, entry.digits, entry.period, entry.algorithm, entry.otpType, entry.hotpCounter, entry.enabled, entry.groupId, nowIso()));
    try {
      await runD1Batch(env, statements);
      imported.entries += prepared.length;
    } catch {
      for (const entry of prepared) {
        try {
          await env.DB.prepare(
            "INSERT INTO totp_entries (user_id, label, issuer, secret_enc, digits, period, algorithm, otp_type, hotp_counter, enabled, group_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
          ).bind(userId, entry.label, entry.issuer, entry.secretEnc, entry.digits, entry.period, entry.algorithm, entry.otpType, entry.hotpCounter, entry.enabled, entry.groupId, nowIso()).run();
          imported.entries += 1;
        } catch {}
      }
    }
  }

  return json({ ok: true, imported });
}

async function runD1Batch(env, statements) {
  if (!statements.length) return [];
  if (typeof env.DB.batch === "function") return env.DB.batch(statements);
  const results = [];
  for (const statement of statements) results.push(await statement.run());
  return results;
}

async function handleExportDataEncrypted(request, env) {
  const auth = await requireRouteSession(request, env);
  if (!auth.ok) return auth.response;
  const body = await parseJson(request);
  if (auth.sessionKind === "web") {
    const stepUp = await requireRecentWebStepUp(request, env, auth, body);
    if (stepUp) return stepUp;
  }
  const passphrase = String(body.passphrase || "");
  if (passphrase.length < ENCRYPTED_BACKUP_PASSPHRASE_MIN_LENGTH) {
    return json({ error: `passphrase must be at least ${ENCRYPTED_BACKUP_PASSPHRASE_MIN_LENGTH} chars` }, 400);
  }
  if (passphrase.length > ENCRYPTED_BACKUP_PASSPHRASE_MAX_LENGTH) {
    return json({ error: `passphrase must be at most ${ENCRYPTED_BACKUP_PASSPHRASE_MAX_LENGTH} chars` }, 400);
  }

  const plainData = await getExportPayload(auth, env);
  const encrypted = await encryptWithPassphrase(plainData, passphrase);
  return json({ ok: true, encrypted });
}

async function handleImportDataEncrypted(request, env) {
  const auth = await requireRouteSession(request, env);
  if (!auth.ok) return auth.response;

  const body = await parseJson(request);
  const passphrase = String(body.passphrase || "");
  const encrypted = body.encrypted;
  if (passphrase.length < ENCRYPTED_BACKUP_PASSPHRASE_MIN_LENGTH) return json({ error: `passphrase must be at least ${ENCRYPTED_BACKUP_PASSPHRASE_MIN_LENGTH} chars` }, 400);
  if (passphrase.length > ENCRYPTED_BACKUP_PASSPHRASE_MAX_LENGTH) return json({ error: `passphrase must be at most ${ENCRYPTED_BACKUP_PASSPHRASE_MAX_LENGTH} chars` }, 400);
  if (!encrypted || typeof encrypted !== "object") return json({ error: "encrypted payload is required" }, 400);

  let data;
  try {
    data = await decryptWithPassphrase(encrypted, passphrase);
  } catch {
    return json({ error: "failed to decrypt payload (wrong passphrase or payload corrupted)" }, 400);
  }

  return importPayload(data, auth, env);
}

async function handleDeleteEntry(request, env) {
  const auth = await requireRouteSession(request, env);
  if (!auth.ok) return auth.response;
  const id = pathResourceId(request, "entries");
  if (!Number.isFinite(id)) return json({ error: "Invalid id" }, 400);

  const row = await env.DB.prepare("SELECT id, user_id FROM totp_entries WHERE id = ?").bind(id).first();
  if (!row) return json({ error: "Entry not found" }, 404);
  if (auth.user.role !== "admin" && row.user_id !== auth.user.id) return json({ error: "Forbidden" }, 403);

  await env.DB.prepare("DELETE FROM totp_entries WHERE id = ?").bind(id).run();
  return json({ ok: true });
}

async function handleListUsers(request, env) {
  const auth = await requireAdminWebSession(request, env);
  if (!auth.ok) return auth.response;

  const rows = await env.DB.prepare("SELECT id, username, role, created_at FROM users ORDER BY id ASC").all();
  return json({ users: rows.results || [] });
}

async function handleCreateUser(request, env) {
  const auth = await requireAdminWebSession(request, env);
  if (!auth.ok) return auth.response;

  const body = await parseJson(request);
  const username = normalizeUsername(body.username);
  const password = String(body.password || "");
  const role = body.role === "admin" ? "admin" : "user";
    if (!username || !validPassword(password)) {
      return json({ error: "Invalid username or password" }, 400);
  }

  const { hashB64, saltB64 } = await hashPassword(password);
  const now = nowIso();
  try {
    const result = await env.DB.prepare(
      "INSERT INTO users (username, password_hash, password_salt, role, created_at) VALUES (?, ?, ?, ?, ?)"
    )
      .bind(username, encodePasswordHash(hashB64), saltB64, role, now)
      .run();
    return json({ ok: true, id: normalizeDbId(result.meta?.last_row_id) }, 201);
  } catch {
    return json({ error: "Username already exists" }, 409);
  }
}

async function handleChangeMyPassword(request, env) {
  const auth = await requireRouteSession(request, env);
  if (!auth.ok) return auth.response;

  const body = await parseJson(request);
  const currentPassword = String(body.currentPassword || body.oldPassword || "");
  const newPassword = String(body.newPassword || body.password || "");
  if (!currentPassword || !newPassword) {
    return json({ error: "currentPassword and newPassword are required" }, 400);
  }
    if (!validPassword(newPassword)) {
      return json({ error: "Invalid new password" }, 400);
  }

  const target = await env.DB.prepare("SELECT id, username, password_hash, password_salt FROM users WHERE id = ?")
    .bind(auth.user.id)
    .first();
  if (!target) return json({ error: "User not found" }, 404);

  const passwordCheck = await verifyPasswordDetailed(currentPassword, target.password_salt, target.password_hash);
  if (!passwordCheck.ok) return json({ error: "Invalid current password" }, 401);

  await upgradePasswordHash(env, auth.user.id, newPassword);
  await deleteUserSessions(env, auth.user.id);
  await clearLoginRiskForUsername(env, target.username);

  const headers = auth.sessionKind === "web" ? { "set-cookie": clearSessionCookie() } : {};
  return json({ ok: true }, 200, headers);
}

async function handleResetUserPassword(request, env) {
  const auth = await requireAdminWebSession(request, env);
  if (!auth.ok) return auth.response;

  const id = pathResourceId(request, "users");
  if (!Number.isFinite(id)) return json({ error: "Invalid id" }, 400);
  if (id === auth.user.id) {
    return json({ error: "Use /api/me/password to change your own password" }, 400);
  }

  const body = await parseJson(request);
  const stepUp = await requireRecentWebStepUp(request, env, auth, body);
  if (stepUp) return stepUp;
  const newPassword = String(body.newPassword || body.password || "");
  if (!validPassword(newPassword)) {
    return json({ error: "Invalid new password" }, 400);
  }

  const target = await env.DB.prepare("SELECT id, username FROM users WHERE id = ?").bind(id).first();
  if (!target) return json({ error: "User not found" }, 404);

  await upgradePasswordHash(env, id, newPassword);
  await deleteUserSessions(env, id);
  await clearLoginRiskForUsername(env, target.username);

  return json({ ok: true });
}

async function handleUpdateUserRole(request, env) {
  const auth = await requireAdminWebSession(request, env);
  if (!auth.ok) return auth.response;

  const id = pathResourceId(request, "users");
  if (!Number.isFinite(id)) return json({ error: "Invalid id" }, 400);
  const body = await parseJson(request);
  const stepUp = await requireRecentWebStepUp(request, env, auth, body);
  if (stepUp) return stepUp;
  const role = body.role === "admin" ? "admin" : body.role === "user" ? "user" : null;
  if (!role) return json({ error: "role must be admin or user" }, 400);
  if (id === auth.user.id && role !== "admin") {
    return json({ error: "Cannot demote yourself" }, 400);
  }
  const target = await env.DB.prepare("SELECT id, role FROM users WHERE id = ?").bind(id).first();
  if (!target) return json({ error: "User not found" }, 404);
  if (target.role === "admin" && role !== "admin" && (await countAdmins(env)) <= 1) {
    return json({ error: "Cannot remove the last admin" }, 400);
  }

  await env.DB.prepare("UPDATE users SET role = ? WHERE id = ?").bind(role, id).run();
  return json({ ok: true });
}

async function handleDeleteUser(request, env) {
  const auth = await requireAdminWebSession(request, env);
  if (!auth.ok) return auth.response;

  const id = pathResourceId(request, "users");
  if (!Number.isFinite(id)) return json({ error: "Invalid id" }, 400);
  if (id === auth.user.id) return json({ error: "Cannot delete yourself" }, 400);
  const body = await parseJson(request);
  const stepUp = await requireRecentWebStepUp(request, env, auth, body);
  if (stepUp) return stepUp;

  const target = await env.DB.prepare("SELECT id, username, role FROM users WHERE id = ?").bind(id).first();
  if (!target) return json({ error: "User not found" }, 404);
  if (target.role === "admin" && (await countAdmins(env)) <= 1) {
    return json({ error: "Cannot delete the last admin" }, 400);
  }

  // Cascade delete: remove all related data before deleting user
  // This prevents orphaned records and ensures data consistency
  await env.DB.prepare("DELETE FROM totp_entries WHERE user_id = ?").bind(id).run();
  await env.DB.prepare("DELETE FROM groups WHERE user_id = ?").bind(id).run();
  await env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(id).run();
  await env.DB.prepare("DELETE FROM api_sessions WHERE user_id = ?").bind(id).run();
  await env.DB.prepare("DELETE FROM login_risk_control WHERE username = ?").bind(target.username).run();
  await env.DB.prepare("DELETE FROM users WHERE id = ?").bind(id).run();
  return json({ ok: true });
}

async function handleGetLoginPolicy(request, env) {
  const auth = await requireAdminWebSession(request, env);
  if (!auth.ok) return auth.response;
  return json(await getLoginPolicy(env));
}

async function handleUpdateLoginPolicy(request, env) {
  const auth = await requireAdminWebSession(request, env);
  if (!auth.ok) return auth.response;

  const body = await parseJson(request);
  const stepUp = await requireRecentWebStepUp(request, env, auth, body);
  if (stepUp) return stepUp;
  const maxRequestsPerMinute = Number(body.maxRequestsPerMinute);
  const lockMinutes = Number(body.lockMinutes);
  if (!Number.isFinite(maxRequestsPerMinute) || maxRequestsPerMinute < 3 || maxRequestsPerMinute > 100) {
    return json({ error: "maxRequestsPerMinute must be between 3 and 100" }, 400);
  }
  if (!Number.isFinite(lockMinutes) || lockMinutes < 1 || lockMinutes > 1440) {
    return json({ error: "lockMinutes must be between 1 and 1440" }, 400);
  }

  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare(
    "INSERT INTO app_settings (key, value, updated_at) VALUES ('risk_max_requests_per_minute', ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at"
  )
    .bind(String(Math.floor(maxRequestsPerMinute)), now)
    .run();
  await env.DB.prepare(
    "INSERT INTO app_settings (key, value, updated_at) VALUES ('risk_lock_minutes', ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at"
  )
    .bind(String(Math.floor(lockMinutes)), now)
    .run();

  return json({ ok: true, ...(await getLoginPolicy(env)) });
}

async function hasAnyUser(env) {
  const row = await env.DB.prepare("SELECT id FROM users LIMIT 1").first();
  return !!row;
}

async function isBootstrapClosed(env) {
  if (await hasAnyUser(env)) return true;
  try {
    const row = await env.DB.prepare("SELECT value FROM app_settings WHERE key = ?")
      .bind(BOOTSTRAP_COMPLETED_SETTING)
      .first();
    return String(row?.value || "").toLowerCase() === "true";
  } catch (err) {
    if (isMissingTableError(err, "app_settings")) return false;
    throw err;
  }
}

async function markBootstrapCompleted(env) {
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare(
    "INSERT INTO app_settings (key, value, updated_at) VALUES (?, 'true', ?) ON CONFLICT(key) DO UPDATE SET value = 'true', updated_at = excluded.updated_at"
  )
    .bind(BOOTSTRAP_COMPLETED_SETTING, now)
    .run();
}

function validateBootstrapToken(request, env, body) {
  const expected = String(env.BOOTSTRAP_TOKEN || env.INIT_SECRET || "");
  if (!expected) return { ok: false, error: "Bootstrap token is required" };
  const provided = String(
    request.headers.get(BOOTSTRAP_TOKEN_HEADER) ||
      request.headers.get("x-init-secret") ||
      body.bootstrapToken ||
      body.initSecret ||
      ""
  );
  if (!provided || !constantTimeStringEqual(provided, expected)) {
    return { ok: false, error: "Invalid bootstrap token" };
  }
  return { ok: true };
}

function constantTimeStringEqual(a, b) {
  const left = enc(String(a || ""));
  const right = enc(String(b || ""));
  return constantTimeEqual(left, right);
}

async function countAdmins(env) {
  const row = await env.DB.prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'").first();
  return Number(row?.count || 0);
}

async function getUsernameById(env, userId) {
  const row = await env.DB.prepare("SELECT username FROM users WHERE id = ?").bind(userId).first();
  return row ? row.username : null;
}

async function getLoginPolicy(env) {
  let rows;
  try {
    rows = await env.DB.prepare(
      "SELECT key, value FROM app_settings WHERE key IN ('risk_max_requests_per_minute', 'risk_lock_minutes')"
    ).all();
  } catch (err) {
    if (isMissingTableError(err, "app_settings")) return defaultLoginPolicy();
    throw err;
  }
  const map = new Map((rows.results || []).map((r) => [r.key, r.value]));
  const maxRequestsPerMinute = Number(map.get("risk_max_requests_per_minute") || DEFAULT_RISK_MAX_REQUESTS_PER_MINUTE);
  const lockMinutes = Number(map.get("risk_lock_minutes") || DEFAULT_RISK_LOCK_MINUTES);
  return {
    maxRequestsPerMinute: Number.isFinite(maxRequestsPerMinute) ? maxRequestsPerMinute : DEFAULT_RISK_MAX_REQUESTS_PER_MINUTE,
    lockMinutes: Number.isFinite(lockMinutes) ? lockMinutes : DEFAULT_RISK_LOCK_MINUTES,
  };
}

function defaultLoginPolicy() {
  return {
    maxRequestsPerMinute: DEFAULT_RISK_MAX_REQUESTS_PER_MINUTE,
    lockMinutes: DEFAULT_RISK_LOCK_MINUTES,
  };
}

async function applyLoginRiskControl(request, env, username) {
  const nowSec = Math.floor(Date.now() / 1000);
  const policy = await getLoginPolicy(env);
  const ip = clientIp(request);
  const { usernameKey, ipKey } = await buildLoginRiskKeys(username, ip);
  const ipPolicy = { ...policy, maxRequestsPerMinute: policy.maxRequestsPerMinute * 2 };
  let userRisk;
  let ipRisk;
  try {
    [userRisk, ipRisk] = await Promise.all([
      updateLoginRiskBucket(env, usernameKey, username || "__empty__", ip, nowSec, policy),
      updateLoginRiskBucket(env, ipKey, "__any__", ip, nowSec, ipPolicy),
    ]);
  } catch (err) {
    if (isMissingTableError(err, "login_risk_control")) return { blocked: false };
    throw err;
  }

  if (userRisk.blocked && ipRisk.blocked) {
    return userRisk.retryAfterSeconds >= ipRisk.retryAfterSeconds ? userRisk : ipRisk;
  }
  if (userRisk.blocked) return userRisk;
  if (ipRisk.blocked) return ipRisk;
  return { blocked: false };
}

async function updateLoginRiskBucket(env, riskKey, username, ip, nowSec, policy) {
  let row;
  row = await env.DB.prepare(
    "SELECT key, window_start, request_count, lock_until FROM login_risk_control WHERE key = ?"
  )
    .bind(riskKey)
    .first();

  if (row && Number(row.lock_until) > nowSec) {
    return {
      blocked: true,
      retryAfterSeconds: Number(row.lock_until) - nowSec,
      lockUntil: Number(row.lock_until),
    };
  }

  let windowStart = nowSec;
  let lockUntil = 0;
  let requestCount = 1;
  if (row && nowSec - Number(row.window_start) < 60) {
    windowStart = Number(row.window_start);
    requestCount = Number(row.request_count) + 1;
  }
  if (requestCount >= policy.maxRequestsPerMinute) {
    lockUntil = nowSec + policy.lockMinutes * 60;
  }

  await env.DB.prepare(
    "INSERT INTO login_risk_control (key, username, ip, window_start, request_count, lock_until, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(key) DO UPDATE SET username = excluded.username, ip = excluded.ip, window_start = excluded.window_start, request_count = excluded.request_count, lock_until = excluded.lock_until, updated_at = excluded.updated_at"
  )
    .bind(riskKey, username || "__empty__", ip, windowStart, requestCount, lockUntil, nowSec)
    .run();

  if (lockUntil > nowSec) {
    return { blocked: true, retryAfterSeconds: lockUntil - nowSec, lockUntil };
  }
  return { blocked: false };
}

async function clearLoginRiskControl(request, env, username) {
  const ip = clientIp(request);
  const { usernameKey, ipKey } = await buildLoginRiskKeys(username, ip);
  await env.DB.prepare("DELETE FROM login_risk_control WHERE key IN (?, ?)")
    .bind(usernameKey, ipKey)
    .run();
}

async function buildLoginRiskKeys(username, ip) {
  const normalizedUsername = username || "__empty__";
  const normalizedIp = ip || "unknown";
  const ipBucket = normalizedIp === "unknown" ? "unknown-global" : normalizedIp;
  return {
    usernameKey: await sha256Base64(`login|user-ip|${normalizedUsername}|${normalizedIp}`),
    ipKey: await sha256Base64(`login|ip|${ipBucket}`),
  };
}

async function clearLoginRiskForUsername(env, username) {
  const normalized = String(username || "").trim();
  if (!normalized) return;
  await env.DB.prepare("DELETE FROM login_risk_control WHERE username = ?").bind(normalized).run();
}

async function deleteUserSessions(env, userId) {
  await env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(userId).run().catch((err) => {
    if (isMissingTableError(err, "sessions")) return;
    throw err;
  });
  await env.DB.prepare("DELETE FROM api_sessions WHERE user_id = ?").bind(userId).run().catch((err) => {
    if (isMissingTableError(err, "api_sessions")) return;
    throw err;
  });
}

async function applyApiRateLimit(request, env, route) {
  if (!shouldRateLimitRoute(request, route)) return null;

  const nowSec = Math.floor(Date.now() / 1000);
  const maxRequests = normalizeRateLimit(env.API_RATE_MAX_REQUESTS_PER_MINUTE, DEFAULT_API_RATE_MAX_REQUESTS_PER_MINUTE);
  const subject = await apiRateLimitSubject(request, env);
  const rateKey = await sha256Base64(`api|${subject}`);
  let row;
  try {
    row = await env.DB.prepare(
      "SELECT key, window_start, request_count, lock_until FROM login_risk_control WHERE key = ?"
    )
      .bind(rateKey)
      .first();
  } catch (err) {
    return json({ error: "API rate limiter unavailable" }, 503);
  }

  if (row && Number(row.lock_until) > nowSec) {
    return json(
      { error: "Too many API requests. Temporarily locked.", retryAfterSeconds: Number(row.lock_until) - nowSec },
      429,
      { "Retry-After": String(Number(row.lock_until) - nowSec) }
    );
  }

  let windowStart = nowSec;
  let lockUntil = 0;
  let requestCount = 1;
  if (row && nowSec - Number(row.window_start) < 60) {
    windowStart = Number(row.window_start);
    requestCount = Number(row.request_count) + 1;
  }
  if (requestCount > maxRequests) {
    const lockMinutes = normalizeRateLimit(env.API_RATE_LOCK_MINUTES, DEFAULT_API_RATE_LOCK_MINUTES);
    lockUntil = nowSec + lockMinutes * 60;
  }

  try {
    await env.DB.prepare(
      "INSERT INTO login_risk_control (key, username, ip, window_start, request_count, lock_until, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(key) DO UPDATE SET username = excluded.username, ip = excluded.ip, window_start = excluded.window_start, request_count = excluded.request_count, lock_until = excluded.lock_until, updated_at = excluded.updated_at"
    )
      .bind(rateKey, "__api__", clientIp(request), windowStart, requestCount, lockUntil, nowSec)
      .run();
  } catch (err) {
    return json({ error: "API rate limiter unavailable" }, 503);
  }

  if (requestCount > maxRequests) {
    return json(
      { error: "Too many API requests. Temporarily locked.", retryAfterSeconds: lockUntil - nowSec },
      429,
      { "Retry-After": String(lockUntil - nowSec) }
    );
  }
  return null;
}

async function applyTotpVerifyRateLimit(request, env, entryId) {
  const nowSec = Math.floor(Date.now() / 1000);
  const subject = await apiRateLimitSubject(request, env);
  const rateKey = await sha256Base64(`totp-verify|${entryId}|${subject}`);
  const policy = {
    maxRequestsPerMinute: normalizeRateLimit(
      env.TOTP_VERIFY_MAX_REQUESTS_PER_MINUTE,
      DEFAULT_TOTP_VERIFY_MAX_REQUESTS_PER_MINUTE
    ),
    lockMinutes: normalizeRateLimit(env.TOTP_VERIFY_LOCK_MINUTES, DEFAULT_TOTP_VERIFY_LOCK_MINUTES),
  };

  let result;
  try {
    result = await updateLoginRiskBucket(env, rateKey, "__totp_verify__", clientIp(request), nowSec, policy);
  } catch (err) {
    return json({ error: "TOTP verification rate limiter unavailable" }, 503);
  }

  if (result.blocked) {
    return json(
      { error: "Too many TOTP verification attempts. Temporarily locked.", retryAfterSeconds: result.retryAfterSeconds },
      429,
      { "Retry-After": String(result.retryAfterSeconds) }
    );
  }
  return null;
}

async function applyHotpConsumeRateLimit(request, env, entryId) {
  const nowSec = Math.floor(Date.now() / 1000);
  const subject = await apiRateLimitSubject(request, env);
  const rateKey = await sha256Base64(`hotp-consume|${entryId}|${subject}`);
  const policy = {
    maxRequestsPerMinute: Number(env.HOTP_CONSUME_MAX_REQUESTS_PER_MINUTE) || DEFAULT_HOTP_CONSUME_MAX_REQUESTS_PER_MINUTE,
    lockMinutes: Number(env.HOTP_CONSUME_LOCK_MINUTES) || DEFAULT_HOTP_CONSUME_LOCK_MINUTES,
  };

  let result;
  try {
    result = await updateLoginRiskBucket(env, rateKey, "__hotp_consume__", clientIp(request), nowSec, policy);
  } catch (err) {
    return json({ error: "HOTP rate limiter unavailable" }, 503);
  }

  if (result.blocked) {
    return json(
      { error: "Too many HOTP requests. Temporarily locked.", retryAfterSeconds: result.retryAfterSeconds },
      429,
      { "Retry-After": String(result.retryAfterSeconds) }
    );
  }
  return null;
}

function validateAuthMethodConsistency(request) {
  if (!readBearerToken(request)) return null;
  if (!readCookie(request, SESSION_COOKIE)) return null;
  return json({ error: "Do not send both Cookie session and Authorization bearer token" }, 400);
}

function validateCookieWriteRequest(request) {
  const method = request.method.toUpperCase();
  if (!COOKIE_WRITE_METHODS.has(method)) return null;
  if (!readCookie(request, SESSION_COOKIE)) return null;

  const url = new URL(request.url);
  const expectedOrigin = `${url.protocol}//${url.host}`;
  const origin = request.headers.get("origin");
  if (origin !== expectedOrigin) return json({ error: "Invalid origin" }, 403);

  const fetchSite = String(request.headers.get("sec-fetch-site") || "").toLowerCase();
  if (fetchSite === "cross-site") return json({ error: "Cross-site requests are not allowed" }, 403);

  const contentType = String(request.headers.get("content-type") || "").toLowerCase().split(";")[0].trim();
  if (contentType !== "application/json") return json({ error: "Content-Type must be application/json" }, 415);

  return null;
}

async function applyBootstrapRateLimit(request, env) {
  const nowSec = Math.floor(Date.now() / 1000);
  const maxRequests = normalizeInteger(
    env.BOOTSTRAP_MAX_REQUESTS_PER_MINUTE,
    DEFAULT_BOOTSTRAP_MAX_REQUESTS_PER_MINUTE,
    1,
    60
  );
  const lockMinutes = normalizeInteger(
    env.BOOTSTRAP_LOCK_MINUTES,
    DEFAULT_BOOTSTRAP_LOCK_MINUTES,
    1,
    1440
  );
  const ip = clientIp(request);
  const subjectIp = ip === "unknown" ? "unknown-global" : ip;
  const rateKey = await sha256Base64(`bootstrap|ip|${subjectIp}`);
  const policy = { maxRequestsPerMinute: maxRequests, lockMinutes };

  let result;
  try {
    result = await updateLoginRiskBucket(env, rateKey, "__bootstrap__", ip, nowSec, policy);
  } catch (err) {
    if (isMissingTableError(err, "login_risk_control")) return null;
    return json({ error: "Bootstrap rate limiter unavailable" }, 503);
  }

  if (result.blocked) {
    return json(
      { error: "Too many bootstrap attempts. Temporarily locked.", retryAfterSeconds: result.retryAfterSeconds },
      429,
      { "Retry-After": String(result.retryAfterSeconds) }
    );
  }
  return null;
}

async function applyEncryptedImportRateLimit(request, env) {
  if (request.method.toUpperCase() !== "POST") return null;
  const path = new URL(request.url).pathname;
  if (path !== "/api/import/encrypted" && path !== "/api/v1/import/encrypted") return null;

  const nowSec = Math.floor(Date.now() / 1000);
  const maxRequests = normalizeInteger(
    env.ENCRYPTED_IMPORT_MAX_REQUESTS_PER_MINUTE,
    DEFAULT_ENCRYPTED_IMPORT_MAX_REQUESTS_PER_MINUTE,
    1,
    60
  );
  const lockMinutes = normalizeInteger(
    env.ENCRYPTED_IMPORT_LOCK_MINUTES,
    DEFAULT_ENCRYPTED_IMPORT_LOCK_MINUTES,
    1,
    1440
  );
  const subject = await apiRateLimitSubject(request, env);
  const rateKey = await sha256Base64(`encrypted-import|${subject}`);

  let row;
  try {
    row = await env.DB.prepare(
      "SELECT key, window_start, request_count, lock_until FROM login_risk_control WHERE key = ?"
    )
      .bind(rateKey)
      .first();
  } catch {
    return json({ error: "Encrypted import rate limiter unavailable" }, 503);
  }

  if (row && Number(row.lock_until) > nowSec) {
    const retryAfterSeconds = Number(row.lock_until) - nowSec;
    return json(
      { error: "Too many encrypted import requests. Temporarily locked.", retryAfterSeconds },
      429,
      { "Retry-After": String(retryAfterSeconds) }
    );
  }

  let windowStart = nowSec;
  let requestCount = 1;
  let lockUntil = 0;
  if (row && nowSec - Number(row.window_start) < 60) {
    windowStart = Number(row.window_start);
    requestCount = Number(row.request_count) + 1;
  }
  if (requestCount > maxRequests) {
    lockUntil = nowSec + lockMinutes * 60;
  }

  try {
    await env.DB.prepare(
      "INSERT INTO login_risk_control (key, username, ip, window_start, request_count, lock_until, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(key) DO UPDATE SET username = excluded.username, ip = excluded.ip, window_start = excluded.window_start, request_count = excluded.request_count, lock_until = excluded.lock_until, updated_at = excluded.updated_at"
    )
      .bind(rateKey, "__encrypted_import__", clientIp(request), windowStart, requestCount, lockUntil, nowSec)
      .run();
  } catch {
    return json({ error: "Encrypted import rate limiter unavailable" }, 503);
  }

  if (lockUntil > nowSec) {
    return json(
      { error: "Too many encrypted import requests. Temporarily locked.", retryAfterSeconds: lockUntil - nowSec },
      429,
      { "Retry-After": String(lockUntil - nowSec) }
    );
  }
  return null;
}

function shouldRateLimitRoute(request, route) {
  if (request.method.toUpperCase() === "OPTIONS") return false;
  const path = new URL(request.url).pathname;
  if (path === "/api/status" || path === "/api/v1/capabilities") return false;
  if (request.method.toUpperCase() === "GET" && ["/api/me", "/api/app-data"].includes(path)) return false;
  if (
    [
      "/api/login",
      "/api/mobile/login",
      "/api/extension/login",
      "/api/v1/auth/login",
      "/api/bootstrap",
    ].includes(path)
  ) {
    return false;
  }
  return !!route;
}

async function apiRateLimitSubject(request, env) {
  const bearerToken = readBearerToken(request);
  if (bearerToken) return `bearer:${await hashSessionToken(bearerToken, env)}`;
  const sessionToken = readCookie(request, SESSION_COOKIE);
  if (sessionToken) return `cookie:${await hashSessionToken(sessionToken, env)}`;
  const ip = clientIp(request);
  // P1 fix: avoid shared rate-limit bucket when IP is unknown (non-CF environments)
  return ip === "unknown" ? `ip:${crypto.randomUUID()}` : `ip:${ip}`;
}

function normalizeRateLimit(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 10 && n <= 5000 ? Math.floor(n) : fallback;
}

function normalizeInteger(value, fallback, min, max) {
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? Math.floor(n) : fallback;
}

function isMissingTableError(err, tableName) {
  return dbErrorMessage(err).includes(`no such table: ${String(tableName).toLowerCase()}`);
}

function isMissingColumnError(err, columnName) {
  const msg = dbErrorMessage(err);
  const column = String(columnName).toLowerCase();
  return msg.includes(`no such column: ${column}`) || msg.includes(`has no column named ${column}`);
}

function dbErrorMessage(err) {
  return String(err?.message || err || "").toLowerCase();
}

function clientIp(request) {
  // Only trust cf-connecting-ip (set by Cloudflare edge, not spoofable by client).
  // x-forwarded-for / x-real-ip are client-controlled and must not be used.
  const value = String(request.headers.get("cf-connecting-ip") || "")
    .split(",")[0]
    .trim();
  return value || "unknown";
}

async function verifyTurnstileToken(token, remoteip, env, request) {
  const secretKey = String(env.TURNSTILE_SECRET_KEY || env.TURNSTILE_KEY || "");
  if (!secretKey) return { ok: false };
  if (!token) return { ok: false };
  const body = new URLSearchParams();
  body.set("secret", secretKey);
  body.set("response", token);
  if (remoteip) body.set("remoteip", remoteip);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TURNSTILE_REQUEST_TIMEOUT_MS);
  try {
    const resp = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: controller.signal,
    });
    if (!resp.ok) return { ok: false };
    const data = await resp.json().catch(() => ({}));
    if (!data.success || !turnstileHostnameMatchesRequest(data.hostname, request, env)) return { ok: false };
    // Tokens from older clients may omit action. If an action is returned,
    // require the login action so a token minted for another flow cannot be reused.
    if (data.action && String(data.action).toLowerCase() !== "login") return { ok: false };
    return { ok: true };
  } catch {
    return { ok: false };
  } finally {
    clearTimeout(timeout);
  }
}

function turnstileHostnameMatchesRequest(hostname, request, env) {
  const reported = String(hostname || "").trim().toLowerCase();
  if (!reported) return false;
  const configured = String(env.TURNSTILE_ALLOWED_HOSTNAMES || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  let requestHostname = "";
  try {
    requestHostname = new URL(request.url).hostname.toLowerCase();
  } catch {
    return false;
  }
  const allowed = configured.length ? configured : [requestHostname];
  return allowed.includes(reported);
}

async function requireWebSession(request, env) {
  const current = await getCurrentWebSession(request, env);
  if (!current) {
    const status = readBearerToken(request) ? 403 : 401;
    const message = status === 403 ? "Web session required" : "Unauthorized";
    return { ok: false, response: json({ error: message }, status) };
  }
  return { ok: true, ...current };
}

async function requireAdminWebSession(request, env) {
  const auth = await requireWebSession(request, env);
  if (!auth.ok) return auth;
  if (auth.user.role !== "admin") return { ok: false, response: json({ error: "Forbidden" }, 403) };
  return auth;
}

async function requireApiSession(request, env) {
  const current = await getCurrentApiSession(request, env);
  if (!current) return { ok: false, response: json({ error: "API bearer token required" }, 401) };
  return { ok: true, ...current };
}

async function requireExtensionSession(request, env) {
  const auth = await requireApiSession(request, env);
  if (!auth.ok) return auth;
  if (!isExtensionClientType(auth.apiClientType)) {
    return { ok: false, response: json({ error: "Extension bearer token required" }, 400) };
  }
  return auth;
}

async function requireRouteSession(request, env) {
  const path = new URL(request.url).pathname;
  if (path.startsWith("/api/v1/")) return requireApiSession(request, env);
  return requireWebSession(request, env);
}

async function requireAuth(request, env) {
  const current = (await getCurrentApiSession(request, env)) || (await getCurrentWebSession(request, env));
  if (!current) return { ok: false, response: json({ error: "Unauthorized" }, 401) };
  return { ok: true, ...current };
}

async function getCurrentApiSession(request, env) {
  const bearerToken = readBearerToken(request);
  if (!bearerToken) return null;
  const tokenHash = await hashSessionToken(bearerToken, env);
  const nowMs = Date.now();
  const now = new Date(nowMs).toISOString();
  let row = null;
  try {
    row = await env.DB.prepare(
      "SELECT s.id AS session_id, s.client_type, s.last_used_at, s.created_at, u.id, u.username, u.role FROM api_sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?"
    )
      .bind(tokenHash, now)
      .first();
  } catch (err) {
    if (!isMissingTableError(err, "api_sessions")) throw err;
  }
  if (!row) return null;
  if (!isWithinAbsoluteSessionLifetime(row.created_at, API_ABSOLUTE_TTL_SECONDS, nowMs)) return null;
  if (shouldUpdateApiSessionLastUsed(row.last_used_at, nowMs)) {
    await env.DB.prepare("UPDATE api_sessions SET last_used_at = ? WHERE id = ?").bind(now, row.session_id).run();
  }
  return {
    user: { id: row.id, username: row.username, role: row.role },
    sessionKind: "api",
    sessionId: row.session_id,
    apiClientType: String(row.client_type || ANDROID_CLIENT_TYPE),
  };
}

async function getCurrentWebSession(request, env) {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token) return null;
  const tokenHash = await hashSessionToken(token, env);
  const now = nowIso();
  const queries = [
    "SELECT s.id AS session_id, s.step_up_at, s.created_at, u.id, u.username, u.role FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ? AND s.client_type = 'web'",
    "SELECT s.id AS session_id, s.created_at, u.id, u.username, u.role FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ? AND s.client_type = 'web'",
    "SELECT s.id AS session_id, s.created_at, u.id, u.username, u.role FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?",
  ];
  let lastMissingColumn = null;
  for (const sql of queries) {
    try {
      const row = await env.DB.prepare(sql).bind(tokenHash, now).first();
      if (!row) return null;
      if (!isWithinAbsoluteSessionLifetime(row.created_at, SESSION_ABSOLUTE_TTL_SECONDS)) return null;
      return {
        user: { id: row.id, username: row.username, role: row.role },
        sessionKind: "web",
        sessionId: row.session_id,
        tokenHash,
        stepUpAt: row.step_up_at || null,
      };
    } catch (err) {
      if (!isMissingColumnError(err, "step_up_at") && !isMissingColumnError(err, "client_type")) throw err;
      lastMissingColumn = err;
    }
  }
  if (lastMissingColumn) return null;
  return null;
}

function shouldUpdateApiSessionLastUsed(lastUsedAt, nowMs) {
  const lastMs = Date.parse(String(lastUsedAt || ""));
  if (!Number.isFinite(lastMs)) return true;
  return nowMs - lastMs >= API_SESSION_LAST_USED_UPDATE_INTERVAL_SECONDS * 1000;
}

async function createSession(env, userId) {
  const token = randomHex(32);
  const tokenHash = await hashSessionToken(token, env);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_SECONDS * 1000).toISOString();
  const result = await insertWebSession(env, userId, tokenHash, expiresAt, now.toISOString());
  let sessionId = normalizeDbId(result.meta?.last_row_id);
  if (!sessionId) {
    const row = await env.DB.prepare("SELECT id FROM sessions WHERE token_hash = ? AND user_id = ?")
      .bind(tokenHash, userId)
      .first();
    sessionId = normalizeDbId(row?.id);
  }
  if (sessionId) {
    await env.DB.prepare("DELETE FROM sessions WHERE user_id = ? AND id <> ?").bind(userId, sessionId).run();
  }
  await deleteApiSessionsForUser(env, userId);

  return { cookie: sessionCookie(token, SESSION_TTL_SECONDS) };
}

async function regenerateWebSession(request, env, userId) {
  await revokePresentedWebSession(request, env);
  return createSession(env, userId);
}

async function revokePresentedWebSession(request, env) {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token) return;
  const tokenHash = await hashSessionToken(token, env);
  await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(tokenHash).run();
}

async function refreshSessionTtl(request, env) {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token) return;
  const tokenHash = await hashSessionToken(token, env);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_SECONDS * 1000).toISOString();
  await env.DB.prepare("UPDATE sessions SET expires_at = ? WHERE token_hash = ?").bind(expiresAt, tokenHash).run();
}

async function cleanExpiredSessions(env) {
  const now = nowIso();
  await env.DB.prepare("DELETE FROM sessions WHERE expires_at <= ?").bind(now).run();
  try {
    await env.DB.prepare("DELETE FROM api_sessions WHERE refresh_expires_at <= ?").bind(now).run();
  } catch (err) {
    if (!isMissingTableError(err, "api_sessions")) throw err;
  }
}

async function runBackgroundMaintenance(env) {
  await Promise.all([
    cleanExpiredSessions(env),
    cleanExpiredLoginRisk(env),
  ]);
}

async function insertWebSession(env, userId, tokenHash, expiresAt, createdAt) {
  try {
    return await env.DB.prepare(
      "INSERT INTO sessions (user_id, token_hash, client_type, expires_at, created_at, step_up_at) VALUES (?, ?, 'web', ?, ?, ?)"
    )
      .bind(userId, tokenHash, expiresAt, createdAt, createdAt)
      .run();
  } catch (err) {
    if (!isMissingColumnError(err, "step_up_at") && !isMissingColumnError(err, "client_type")) throw err;
    try {
      return await env.DB.prepare(
        "INSERT INTO sessions (user_id, token_hash, client_type, expires_at, created_at) VALUES (?, ?, 'web', ?, ?)"
      )
        .bind(userId, tokenHash, expiresAt, createdAt)
        .run();
    } catch (fallbackErr) {
      if (!isMissingColumnError(fallbackErr, "client_type")) throw fallbackErr;
      return env.DB.prepare(
        "INSERT INTO sessions (user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?)"
      )
        .bind(userId, tokenHash, expiresAt, createdAt)
        .run();
    }
  }
}

function isWithinAbsoluteSessionLifetime(createdAt, maxAgeSeconds, nowMs = Date.now()) {
  const createdMs = Date.parse(String(createdAt || ""));
  // Legacy test fixtures and pre-existing non-standard rows may not expose a
  // creation timestamp. The normal schema always has one; preserve those rows
  // until they naturally expire rather than treating missing metadata as fresh.
  if (!Number.isFinite(createdMs)) return true;
  return nowMs - createdMs <= maxAgeSeconds * 1000;
}

async function updateWebSessionExpiry(env, tokenHash, expiresAt) {
  try {
    await env.DB.prepare("UPDATE sessions SET expires_at = ? WHERE token_hash = ? AND client_type = 'web'")
      .bind(expiresAt, tokenHash)
      .run();
  } catch (err) {
    if (!isMissingColumnError(err, "client_type")) throw err;
    await env.DB.prepare("UPDATE sessions SET expires_at = ? WHERE token_hash = ?")
      .bind(expiresAt, tokenHash)
      .run();
  }
}

async function deleteApiSessionsForUser(env, userId) {
  try {
    await env.DB.prepare("DELETE FROM api_sessions WHERE user_id = ?").bind(userId).run();
  } catch (err) {
    if (!isMissingTableError(err, "api_sessions")) throw err;
  }
}

async function createApiSession(env, userId, clientType) {
  const accessToken = randomHex(32);
  const refreshToken = randomHex(32);
  const tokenHash = await hashSessionToken(accessToken, env);
  const refreshHash = await hashSessionToken(refreshToken, env);
  const now = new Date();
  const createdAt = now.toISOString();
  const expiresAt = new Date(now.getTime() + API_ACCESS_TTL_SECONDS * 1000).toISOString();
  const refreshExpiresAt = new Date(now.getTime() + API_REFRESH_TTL_SECONDS * 1000).toISOString();

  await env.DB.prepare(
    "INSERT INTO api_sessions (user_id, token_hash, refresh_hash, expires_at, refresh_expires_at, created_at, last_used_at, client_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  )
    .bind(userId, tokenHash, refreshHash, expiresAt, refreshExpiresAt, createdAt, createdAt, clientType)
    .run();

  const sessionId = normalizeDbId(
    (
      await env.DB.prepare(
        "SELECT id FROM api_sessions WHERE token_hash = ? AND user_id = ?"
      ).bind(tokenHash, userId).first()
    )?.id
  );
  if (sessionId) {
    await env.DB.prepare("DELETE FROM api_sessions WHERE user_id = ? AND id <> ?")
      .bind(userId, sessionId)
      .run();
  }
  await env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(userId).run();
  return { accessToken, refreshToken, expiresIn: API_ACCESS_TTL_SECONDS, sessionId };
}

function hasTurnstileSecret(env) {
  return !!String(env.TURNSTILE_SECRET_KEY || env.TURNSTILE_KEY || "");
}

async function rotateApiSessionTokens(request, env, expectedClientType, options = {}) {
  const body = await parseJson(request);
  const refreshToken = String(body.refreshToken || "").trim();
  if (!refreshToken) return json({ error: "refreshToken is required" }, 400);

  const refreshHash = await hashSessionToken(refreshToken, env);
  const now = nowIso();
  const row = await env.DB.prepare(
    "SELECT s.id, s.client_type, s.created_at, s.user_id, u.username, u.role FROM api_sessions s JOIN users u ON u.id = s.user_id WHERE s.refresh_hash = ? AND s.refresh_expires_at > ?"
  )
    .bind(refreshHash, now)
    .first();
  if (!row) return json({ error: "Invalid refresh token" }, 401);
  if (!isWithinAbsoluteSessionLifetime(row.created_at, API_ABSOLUTE_TTL_SECONDS)) {
    return json({ error: "Refresh token expired" }, 401);
  }

  if (expectedClientType === ANDROID_CLIENT_TYPE && String(row.client_type || "") !== ANDROID_CLIENT_TYPE) {
    return json({ error: "Invalid refresh token" }, 401);
  }
  if (expectedClientType === EXTENSION_CLIENT_TYPE && !isExtensionClientType(String(row.client_type || ""))) {
    return json({ error: "Invalid refresh token" }, 401);
  }

  const accessToken = randomHex(32);
  const newRefreshToken = randomHex(32);
  const accessHash = await hashSessionToken(accessToken, env);
  const newRefreshHash = await hashSessionToken(newRefreshToken, env);
  const nowDate = new Date();
  const expiresAt = new Date(nowDate.getTime() + API_ACCESS_TTL_SECONDS * 1000).toISOString();
  const refreshExpiresAt = new Date(nowDate.getTime() + API_REFRESH_TTL_SECONDS * 1000).toISOString();

  const result = await env.DB.prepare(
    "UPDATE api_sessions SET token_hash = ?, refresh_hash = ?, expires_at = ?, refresh_expires_at = ?, last_used_at = ? WHERE id = ? AND refresh_hash = ?"
  )
    .bind(accessHash, newRefreshHash, expiresAt, refreshExpiresAt, nowDate.toISOString(), row.id, refreshHash)
    .run();
  if (result.meta?.changes === 0) {
    return json({ error: "Refresh token already used" }, 409);
  }

  const payload = {
    ok: true,
    user: { id: row.user_id, username: row.username, role: row.role },
    accessToken,
    refreshToken: newRefreshToken,
    expiresIn: API_ACCESS_TTL_SECONDS,
  };
  if (options.includeRefreshExpiresIn) {
    payload.refreshExpiresIn = API_REFRESH_TTL_SECONDS;
  }
  return json(payload);
}

function isExtensionClientType(clientType) {
  return String(clientType || "") === EXTENSION_CLIENT_TYPE || String(clientType || "").startsWith(`${EXTENSION_CLIENT_TYPE}:`);
}

function normalizeApiClientType(value) {
  const v = String(value || "").trim().toLowerCase();
  if (v === ANDROID_CLIENT_TYPE) return ANDROID_CLIENT_TYPE;
  if (["browser_extension", "extension", "edge_extension", "chrome_extension", "safari-web-extension"].includes(v)) {
    return "browser_extension";
  }
  return "";
}

function normalizeClientMetadata(value, maxLen, fallback) {
  const normalized = String(value || "").trim().replace(/[^\w.\- ]+/g, "");
  if (!normalized) return fallback;
  return normalized.slice(0, maxLen);
}

async function cleanExpiredLoginRisk(env) {
  const nowSec = Math.floor(Date.now() / 1000);
  // Keep recent rows, remove old/unlocked rows.
  await env.DB.prepare(
    "DELETE FROM login_risk_control WHERE lock_until <= ? AND updated_at < ?"
  )
    .bind(nowSec, nowSec - 24 * 60 * 60)
    .run();
}

async function hashSessionToken(token, env) {
  return sha256Base64(`${token}:${env.SESSION_PEPPER}`);
}

async function hashPassword(password, saltB64, iterations = PBKDF2_ITERATIONS) {
  const salt = saltB64 ? b64ToBytes(saltB64) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", enc(String(password)), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: PBKDF2_HASH, iterations, salt },
    key,
    256
  );
  return { hashB64: bytesToB64(new Uint8Array(bits)), saltB64: bytesToB64(salt) };
}

function encodePasswordHash(hashB64, iterations = PBKDF2_ITERATIONS) {
  return `pbkdf2-${PBKDF2_HASH.toLowerCase()}:i=${iterations}:${hashB64}`;
}

function parsePasswordHash(storedHashB64) {
  const text = String(storedHashB64 || "");
  const match = text.match(/^pbkdf2-sha-256:i=([1-9]\d{0,9}):([A-Za-z0-9+/]+={0,2})$/);
  if (!match) return { hashB64: text, iterations: PBKDF2_ITERATIONS, legacy: true };
  const iterations = Number(match[1]);
  if (
    !Number.isSafeInteger(iterations) ||
    iterations < MIN_PASSWORD_PBKDF2_ITERATIONS ||
    iterations > MAX_PASSWORD_PBKDF2_ITERATIONS
  ) {
    throw new Error("invalid password hash iterations");
  }
  return { hashB64: match[2], iterations, legacy: false };
}

async function verifyPassword(password, saltB64, expectedHashB64) {
  return (await verifyPasswordDetailed(password, saltB64, expectedHashB64)).ok;
}

async function verifyPasswordDetailed(password, saltB64, expectedHashB64) {
  try {
    const parsed = parsePasswordHash(expectedHashB64);
    const expected = b64ToBytes(parsed.hashB64);
    const current = await hashPassword(password, saltB64, parsed.iterations);
    if (constantTimeEqual(b64ToBytes(current.hashB64), expected)) {
      return { ok: true, needsRehash: parsed.legacy || parsed.iterations < PBKDF2_ITERATIONS };
    }
  } catch {
    return { ok: false, needsRehash: false };
  }
  return { ok: false, needsRehash: false };
}

async function upgradePasswordHash(env, userId, password) {
  const { hashB64, saltB64 } = await hashPassword(password);
  await env.DB.prepare("UPDATE users SET password_hash = ?, password_salt = ? WHERE id = ?")
    .bind(encodePasswordHash(hashB64), saltB64, userId)
    .run();
}

const encryptionKeyCache = new Map();

async function getEncryptionKey(env) {
  // F-02 fix: hash secrets instead of storing plaintext secrets in Map key
  const raw = `${env.ENVIRONMENT || env.NODE_ENV || "default"}|${env.ENCRYPTION_KEY}|${env.SESSION_PEPPER}`;
  const cacheKey = await sha256Base64(raw);
  const now = Date.now();
  for (const [key, entry] of encryptionKeyCache) {
    if (entry.expiresAt <= now) encryptionKeyCache.delete(key);
  }
  const cached = encryptionKeyCache.get(cacheKey);
  if (!cached) {
    if (encryptionKeyCache.size >= 8) encryptionKeyCache.clear();
    const keyPromise = crypto.subtle.importKey(
      "raw",
      b64ToBytes(env.ENCRYPTION_KEY),
      "AES-GCM",
      false,
      ["encrypt", "decrypt"]
    );
    encryptionKeyCache.set(cacheKey, { keyPromise, expiresAt: now + ENCRYPTION_KEY_CACHE_TTL_MS });
    return keyPromise;
  }
  return cached.keyPromise;
}

async function encryptText(plain, env) {
  const key = await getEncryptionKey(env);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc(plain));
  return `${bytesToB64(iv)}:${bytesToB64(new Uint8Array(cipher))}`;
}

async function decryptText(payload, env) {
  const [ivB64, ctB64] = String(payload || "").split(":");
  if (!ivB64 || !ctB64) throw new Error("Bad encrypted payload");
  const key = await getEncryptionKey(env);
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: b64ToBytes(ivB64) },
    key,
    b64ToBytes(ctB64)
  );
  return dec(new Uint8Array(plain));
}

async function encryptWithPassphrase(data, passphrase) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await derivePassphraseKey(passphrase, salt);
  const plaintext = enc(JSON.stringify(data));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
  return {
    format: "worker-2fauth-encrypted-v1",
    kdf: "PBKDF2-SHA-256",
    iterations: PASSPHRASE_PBKDF2_ITERATIONS,
    salt: bytesToB64(salt),
    iv: bytesToB64(iv),
    ciphertext: bytesToB64(new Uint8Array(cipher)),
  };
}

async function decryptWithPassphrase(payload, passphrase) {
  if (payload.format !== "worker-2fauth-encrypted-v1") throw new Error("unsupported format");
  if (payload.kdf !== "PBKDF2-SHA-256") throw new Error("unsupported kdf");
  const iterations = normalizePassphraseIterations(payload.iterations);
  const salt = decodeBackupB64Field(payload.salt, ENCRYPTED_BACKUP_SALT_BYTES);
  const iv = decodeBackupB64Field(payload.iv, ENCRYPTED_BACKUP_IV_BYTES);
  const ciphertext = decodeBackupB64Field(
    payload.ciphertext,
    null,
    ENCRYPTED_BACKUP_MIN_CIPHERTEXT_BYTES,
    ENCRYPTED_BACKUP_MAX_CIPHERTEXT_BYTES
  );
  const key = await derivePassphraseKey(passphrase, salt, iterations);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  return JSON.parse(dec(new Uint8Array(plain)));
}

function decodeBackupB64Field(value, exactLength, minLength = exactLength, maxLength = exactLength) {
  const bytes = b64ToBytes(String(value || ""));
  if (minLength !== null && bytes.length < minLength) throw new Error("invalid encrypted backup field length");
  if (maxLength !== null && bytes.length > maxLength) throw new Error("invalid encrypted backup field length");
  return bytes;
}

async function derivePassphraseKey(passphrase, salt, iterations = PASSPHRASE_PBKDF2_ITERATIONS) {
  const baseKey = await crypto.subtle.importKey("raw", enc(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

function normalizePassphraseIterations(value) {
  const iterations = value === undefined || value === null ? PASSPHRASE_PBKDF2_ITERATIONS : Number(value);
  if (
    !Number.isSafeInteger(iterations) ||
    iterations < PASSPHRASE_PBKDF2_ITERATIONS ||
    iterations > MAX_PASSPHRASE_PBKDF2_ITERATIONS
  ) {
    throw new Error("invalid PBKDF2 iterations");
  }
  return iterations;
}

function parseOtpAuthUri(uri) {
  try {
    // F-07: limit input length to prevent ReDoS via URL parser.
    if (typeof uri !== "string" || uri.length > 1024) {
      return { ok: false, error: "otpauth URI too long" };
    }
    const url = new URL(uri);
    if (url.protocol !== "otpauth:" || !["totp", "hotp"].includes(url.hostname)) {
      return { ok: false, error: "Only otpauth://totp or otpauth://hotp URI is supported" };
    }
    const otpType = url.hostname;
    const secret = String(url.searchParams.get("secret") || "").trim();
    if (!secret) return { ok: false, error: "otpauth URI missing secret" };
    const issuerQ = String(url.searchParams.get("issuer") || "").trim();
    // F-07: use substring instead of regex to avoid any backtracking risk.
    const labelRaw = decodeURIComponent(url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname);
    let issuer = issuerQ;
    let label = labelRaw;
    if (labelRaw.includes(":")) {
      const [issuerInLabel, account] = labelRaw.split(":");
      if (!issuer) issuer = issuerInLabel.trim();
      label = account.trim();
    }
    const digits = Number(url.searchParams.get("digits") || 6);
    const period = Number(url.searchParams.get("period") || 30);
    const hotpCounter = Number(url.searchParams.get("counter") || 0);
    const algorithmParam = url.searchParams.get("algorithm");
    const algorithm = normalizeAlgorithm(algorithmParam || "SHA-1");
    if (!algorithm) return { ok: false, error: "otpauth URI algorithm must be SHA-1, SHA-256, or SHA-512" };
    return {
      ok: true,
      data: { secret, issuer, label: label || issuer || "OTP", digits, period, algorithm, algorithmSpecified: algorithmParam !== null, otpType, hotpCounter },
    };
  } catch {
    return { ok: false, error: "Invalid otpauth URI" };
  }
}

function normalizeOtpEntryInput(input, options = {}) {
  const strictParameters = options.strictParameters !== false;
  const missingMessage = options.missingMessage || "label and secret are required";
  const payload = { ...(input || {}) };
  const explicitSecret = String(payload.secret || "").trim();
  const explicitUri = String(payload.otpauthUri || payload.uri || "").trim();
  const uriFromSecret = explicitSecret ? firstOtpAuthUri(explicitSecret) : "";
  const uri = explicitUri || uriFromSecret;
  let data = { ...payload };

  if (uri) {
    const parsed = parseOtpAuthUri(uri);
    if (!parsed.ok) return parsed;
    if (explicitSecret && !uriFromSecret) {
      let explicitCanonical;
      let parsedCanonical;
      try {
        explicitCanonical = canonicalizeBase32Secret(explicitSecret);
        parsedCanonical = canonicalizeBase32Secret(parsed.data.secret);
      } catch {
        return { ok: false, error: "secret is not valid base32" };
      }
      if (explicitCanonical !== parsedCanonical) {
        return { ok: false, error: "secret and otpauthUri conflict" };
      }
    }
    data = { ...payload, ...parsed.data, secret: parsed.data.secret };
  }

  const label = String(data.label || "").trim();
  const issuer = String(data.issuer || "").trim();
  const rawSecret = String(data.secret || "").trim();
  if (!label || !rawSecret) return { ok: false, error: missingMessage };

  let secret;
  try {
    secret = canonicalizeBase32Secret(rawSecret);
  } catch {
    return { ok: false, error: "secret is not valid base32" };
  }

  const algorithm = normalizeAlgorithm(data.algorithm || OTP_ALGORITHM_DEFAULT);
  if (!algorithm) return { ok: false, error: OTP_ALGORITHM_ERROR };

  const otpType = data.otpType === "hotp" ? "hotp" : "totp";
  const digits = strictParameters ? Number(data.digits || 6) : normalizeOtpDigits(data.digits);
  if (strictParameters && ![6, 7, 8].includes(digits)) {
    return { ok: false, error: "digits must be 6/7/8" };
  }

  const period = strictParameters ? Number(data.period || 30) : normalizeTotpPeriod(data.period);
  if (strictParameters && otpType === "totp" && (!Number.isFinite(period) || period < 15 || period > 120)) {
    return { ok: false, error: "period must be between 15 and 120" };
  }

  const hotpCounter = strictParameters ? Number(data.hotpCounter || 0) : normalizeHotpCounter(data.hotpCounter);
  if (strictParameters && otpType === "hotp" && (!Number.isInteger(hotpCounter) || hotpCounter < 0)) {
    return { ok: false, error: "hotpCounter must be >= 0" };
  }

  return {
    ok: true,
    data: { ...data, label, issuer, secret, digits, period, algorithm, otpType, hotpCounter },
  };
}

function firstOtpAuthUri(text) {
  return extractOtpAuthUris(String(text || ""))[0] || "";
}

function extractOtpAuthUris(text) {
  // F-07: limit input length to prevent DoS via regex on large payloads.
  if (typeof text !== "string" || text.length > 65536) return [];
  const out = [];
  const re = /otpauth:\/\/[^\s"'<>]+/gi;
  let m;
  while ((m = re.exec(String(text || ""))) !== null) out.push(m[0]);
  return [...new Set(out)];
}

function buildOtpAuthUri(entry) {
  const otpType = entry.otp_type === "hotp" ? "hotp" : "totp";
  const label = encodeURIComponent(String(entry.label || "OTP"));
  const params = new URLSearchParams();
  params.set("secret", String(entry.secret || ""));
  if (entry.issuer) params.set("issuer", String(entry.issuer));
  params.set("algorithm", String(normalizeAlgorithm(entry.algorithm || "SHA-1") || "SHA-1").replace("-", ""));
  params.set("digits", String(Number(entry.digits || 6)));
  if (otpType === "hotp") {
    params.set("counter", String(Number(entry.hotp_counter || 0)));
  } else {
    params.set("period", String(Number(entry.period || 30)));
  }
  return `otpauth://${otpType}/${label}?${params.toString()}`;
}

async function generateTotp(secretBase32, period, digits, algorithm, counter) {
  const secretBytes = base32Decode(secretBase32);
  const algo = normalizeAlgorithm(algorithm);
  if (!algo) throw new Error("Unsupported OTP algorithm");
  const key = await crypto.subtle.importKey("raw", secretBytes, { name: "HMAC", hash: { name: algo } }, false, [
    "sign",
  ]);
  const data = new ArrayBuffer(8);
  const view = new DataView(data);
  const high = Math.floor(counter / 2 ** 32);
  const low = counter >>> 0;
  view.setUint32(0, high);
  view.setUint32(4, low);
  const hmac = new Uint8Array(await crypto.subtle.sign("HMAC", key, data));
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binCode =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  const mod = 10 ** digits;
  return String(binCode % mod).padStart(digits, "0");
}

async function generateHotp(secretBase32, digits, algorithm, counter) {
  return generateTotp(secretBase32, 30, digits, algorithm, counter);
}

function base32Decode(input) {
  const clean = cleanBase32Secret(input);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let buffer = 0;
  let bitsLeft = 0;
  const bytes = [];
  for (const ch of clean) {
    const idx = alphabet.indexOf(ch);
    if (idx < 0) throw new Error("invalid base32");
    buffer = (buffer << 5) | idx;
    bitsLeft += 5;
    while (bitsLeft >= 8) {
      bytes.push((buffer >>> (bitsLeft - 8)) & 0xff);
      bitsLeft -= 8;
      buffer &= (1 << bitsLeft) - 1;
    }
  }
  return new Uint8Array(bytes);
}

function cleanBase32Secret(input) {
  return String(input || "").toUpperCase().replace(/[\s=-]/g, "");
}

function canonicalizeBase32Secret(input) {
  const secret = cleanBase32Secret(input);
  if (secret.length < OTP_SECRET_MIN_BASE32_CHARS || secret.length > OTP_SECRET_MAX_BASE32_CHARS) {
    throw new Error("secret is not valid base32");
  }
  const bytes = base32Decode(secret);
  if (bytes.length < OTP_SECRET_MIN_BYTES || bytes.length > OTP_SECRET_MAX_BYTES) {
    throw new Error("secret is not valid base32");
  }
  return secret;
}

function normalizeAlgorithm(value) {
  const v = String(value || "").toUpperCase();
  if (v === "SHA1" || v === "SHA-1") return "SHA-1";
  if (v === "SHA256" || v === "SHA-256") return "SHA-256";
  if (v === "SHA512" || v === "SHA-512") return "SHA-512";
  return null;
}

function normalizeOtpDigits(value) {
  const digits = Number(value);
  return [6, 7, 8].includes(digits) ? digits : 6;
}

function normalizeTotpPeriod(value) {
  const period = Number(value);
  return Number.isInteger(period) && period >= 15 && period <= 120 ? period : 30;
}

function normalizeHotpCounter(value) {
  const counter = Number(value);
  return Number.isInteger(counter) && counter >= 0 ? counter : 0;
}

function booleanFlag(value) {
  if (value === true || value === 1 || value === "1") return 1;
  if (value === false || value === 0 || value === "0") return 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return 1;
    if (normalized === "false") return 0;
  }
  return false;
}

function entryEnabled(value) {
  return value === undefined || value === null || Number(value) !== 0;
}

function normalizeUsername(v) {
  const out = String(v || "").trim().toLowerCase();
  return /^[a-z0-9_.-]{3,40}$/.test(out) ? out : "";
}

function validPassword(p) {
  return (
    typeof p === "string" &&
    validPasswordLength(p) &&
    p.length >= 12 &&
    /[a-z]/.test(p) &&
    /[A-Z]/.test(p) &&
    /[0-9]/.test(p) &&
    /[^A-Za-z0-9]/.test(p)
  );
}

function validPasswordLength(p) {
  return typeof p === "string" && p.length <= PASSWORD_MAX_LENGTH;
}

function validHexColor(v) {
  return typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v);
}

function parseCookies(request) {
  const raw = request.headers.get("cookie") || "";
  const map = {};
  for (const part of raw.split(";")) {
    const idx = part.indexOf("=");
    if (idx < 0) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    try {
      map[k] = decodeURIComponent(v);
    } catch {
      continue;
    }
  }
  return map;
}

function readCookie(request, key) {
  return parseCookies(request)[key] || null;
}

function readBearerToken(request) {
  const authHeader = String(request.headers.get("authorization") || "");
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  return match[1].trim() || null;
}

function withJsonBody(request, data) {
  const headers = new Headers(request.headers);
  headers.set("content-type", "application/json");
  headers.delete("content-length");
  return new Request(request.url, {
    method: request.method,
    headers,
    body: JSON.stringify(data),
  });
}

function sessionCookie(token, ttlSeconds) {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${ttlSeconds}`;
}

function clearSessionCookie() {
  return `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeDbId(value) {
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "string") return Number(value);
  if (typeof value === "number") return value;
  return null;
}

// F-01: safe IN-clause builder. Returns only "?" placeholders 鈥?never interpolates user values into SQL.
function buildInClause(values) {
  // values must be pre-validated (e.g. positive integers) by the caller.
  const placeholders = Array(values.length).fill("?").join(", ");
  return { placeholders, params: [...values] };
}

function pathResourceId(request, resource) {
  const parts = new URL(request.url).pathname.split("/").filter(Boolean);
  const idx = parts.indexOf(resource);
  if (idx < 0 || idx + 1 >= parts.length) return NaN;
  return parsePathId(parts[idx + 1]);
}

function parsePathId(value) {
  const text = String(value || "");
  if (!/^[1-9]\d{0,15}$/.test(text)) return NaN;
  const id = Number(text);
  return Number.isSafeInteger(id) && id > 0 ? id : NaN;
}

function parseOptionalPositiveId(value) {
  if (value === undefined || value === null || value === "") return null;
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) return false;
  return id;
}

function randomHex(byteLen) {
  const arr = crypto.getRandomValues(new Uint8Array(byteLen));
  return [...arr].map((x) => x.toString(16).padStart(2, "0")).join("");
}

async function parseJson(request) {
  const text = await readRequestTextLimited(request, DEFAULT_JSON_BODY_MAX_BYTES);
  if (!text.trim()) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError(400, "Invalid JSON body");
  }
}

async function readRequestTextLimited(request, maxBytes) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw new ApiError(413, `JSON body too large (max ${maxBytes} bytes)`);
  }
  if (!request.body) return "";

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let total = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel().catch(() => {});
        throw new ApiError(413, `JSON body too large (max ${maxBytes} bytes)`);
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return text;
  } finally {
    reader.releaseLock();
  }
}

async function sha256Base64(input) {
  const digest = await crypto.subtle.digest("SHA-256", enc(String(input)));
  return bytesToB64(new Uint8Array(digest));
}

function constantTimeEqual(a, b) {
  const maxLen = Math.max(a.length, b.length);
  let out = a.length ^ b.length;
  for (let i = 0; i < maxLen; i++) out |= (a[i] || 0) ^ (b[i] || 0);
  return out === 0;
}

function enc(s) {
  return new TextEncoder().encode(s);
}

function dec(bytes) {
  return new TextDecoder().decode(bytes);
}

function bytesToB64(bytes) {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str);
}

function b64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function corsPreflight(request, env) {
  const origin = allowedCorsOrigin(request, env);
  if (!origin) return new Response(null, { status: 403 });
  const headers = new Headers(commonSecurityHeaders());
  for (const [key, value] of corsHeaders(origin, env)) headers.set(key, value);
  headers.set("Access-Control-Max-Age", "86400");
  headers.set("Vary", "Origin");
  return new Response(null, { status: 204, headers });
}

function withCors(request, response, env) {
  const origin = allowedCorsOrigin(request, env);
  if (!origin) return response;
  const next = new Response(response.body, response);
  const headers = corsHeaders(origin, env);
  for (const [key, value] of headers) next.headers.set(key, value);
  next.headers.set("Vary", appendVary(next.headers.get("Vary"), "Origin"));
  return next;
}

function corsHeaders(origin, env) {
  const headers = new Headers({
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": CORS_ALLOWED_METHODS,
    "Access-Control-Allow-Headers": CORS_ALLOWED_HEADERS,
  });
  // F-03: never allow credentials in CORS responses.
  return headers;
}

function allowedCorsOrigin(request, env) {
  const origin = String(request.headers.get("origin") || "").trim();
  if (!origin) return "";
  if (!isSafeCorsOrigin(origin)) return "";
  const allowed = normalizedAllowedCorsOrigins(env);
  return allowed.includes(origin) ? origin : "";
}

function normalizedAllowedCorsOrigins(env) {
  return String(env.CORS_ALLOWED_ORIGINS || "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item && item !== "*" && item !== "null" && isSafeCorsOrigin(item));
}

function corsCredentialsEnabled(env) {
  // F-03: credentials are never allowed.
  return false;
}

function isSafeCorsOrigin(origin) {
  // F-11 fix: no longer automatically trust all browser extensions.
  // Extensions must be explicitly listed in CORS_ALLOWED_ORIGINS.
  try {
    const url = new URL(origin);
    if (url.protocol === "https:") return origin === url.origin;
    if (url.protocol === "http:") return origin === url.origin && isLocalHttpOrigin(url);
    if (EXTENSION_CORS_PROTOCOLS.has(url.protocol)) {
      const normalized = `${url.protocol}//${url.host}`;
      return origin === normalized && !!url.host;
    }
    return false;
  } catch {
    return false;
  }
}

function isLocalHttpOrigin(url) {
  return ["localhost", "127.0.0.1", "[::1]", "::1"].includes(url.hostname);
}

function appendVary(current, value) {
  const parts = String(current || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (!parts.some((item) => item.toLowerCase() === value.toLowerCase())) parts.push(value);
  return parts.join(", ");
}

function commonSecurityHeaders() {
  return {
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(self), clipboard-write=(self), geolocation=(), microphone=(), payment=(), usb=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Origin-Agent-Cluster": "?1",
    "X-Permitted-Cross-Domain-Policies": "none",
  };
}

function debugErrorsEnabled(env) {
  const enabled = String(env.DEBUG_ERRORS || "").toLowerCase() === "true";
  const environment = String(env.ENVIRONMENT || env.NODE_ENV || "").toLowerCase();
  // F-06: only expose details in explicit development/staging with opt-in flag.
  const isNonProd = environment === "development" || environment === "staging";
  return enabled && isNonProd;
}

function canExposeErrorDetail(request, env) {
  if (!debugErrorsEnabled(env)) return false;
  // F-06: only expose to same-origin requests, never via API or curl.
  const origin = String(request.headers.get("origin") || "").trim();
  if (!origin) return false;
  try {
    return origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

function json(data, status = 200, headers = {}) {
  const securityHeaders = commonSecurityHeaders();
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...securityHeaders,
      ...headers,
    },
  });
}

function html(markup, nonce) {
  // F-08 fix: jsQR has SRI integrity; cdn.jsdelivr.net still needed for fetch. Inlining jsQR would eliminate this risk.
  // N-06 / F-08: narrow CSP to the exact jsQR path with SRI; drop the broad jsdelivr domain.
  const scriptSrc = ["'self'", `'nonce-${nonce}'`, "https://challenges.cloudflare.com", "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js"];
  const styleSrc = ["'self'", `'nonce-${nonce}'`];
  return new Response(markup, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "Content-Security-Policy": [
        "default-src 'self'",
        `script-src ${scriptSrc.join(" ")}`,
        `style-src ${styleSrc.join(" ")}`,
        "img-src 'self' data: blob:",
        "media-src 'self' blob:",
        "connect-src 'self' https://challenges.cloudflare.com",
        "frame-src https://challenges.cloudflare.com",
        "object-src 'none'",
        "manifest-src 'self'",
        "base-uri 'none'",
        "frame-ancestors 'none'",
        "form-action 'self'",
      ].join("; "),
      ...commonSecurityHeaders(),
    },
  });
}


function appHtml(env, nonce) {
  return renderAppHtml(env, nonce);
}
