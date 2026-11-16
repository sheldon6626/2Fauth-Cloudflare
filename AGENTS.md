# Repository Guidelines

## Project Structure & Module Organization

This repository is a Cloudflare Worker application with D1 persistence.

- `src/worker.js`: Main Worker entrypoint (API routes, auth/RBAC, OTP logic, encryption helpers, and embedded UI).
- `src/ui/`: Embedded Web UI (HTML/JS/CSS rendered server-side via `renderAppHtml` in `template.js`).
- `migrations/`: Ordered D1 SQL migrations (for example `0001_init.sql`, `0002_groups_import_hotp.sql`).
- `tests/`: Test suite (`.spec.js` files, run with `npm test`).
- `workflows/`: GitHub Actions workflows (if configured).
- `wrangler.toml`: Worker config, D1 binding, runtime settings.
- `README.md`: Deployment and operational usage notes.
- `API.md` and `API.zh-CN.md`: API specifications (English and Chinese).
- `package.json`: Scripts for local dev, deploy, migrations, and testing.

Add new runtime code under `src/` and schema changes as a new numbered file in `migrations/`.

## Build, Test, and Development Commands

- `npm install`: Install dependencies (Wrangler CLI).
- `npm run dev`: Run Worker locally.
- `npm run deploy`: Deploy to Cloudflare.
- `npm run test`: Run tests (`node --test`).
- `npm run d1:migrate:local`: Apply migrations to local D1.
- `npm run d1:migrate:remote`: Apply migrations to remote D1.
- `node --check src/worker.js`: Fast syntax check before deploy.

Typical flow:
1. `npm install`
2. `npm run d1:migrate:local`
3. `npm run dev`

## Coding Style & Naming Conventions

- Language: JavaScript (ES modules), 2-space indentation, semicolons required.
- Naming: `camelCase` for variables/functions (`handleImportDataEncrypted`), `UPPER_SNAKE_CASE` for constants (`SESSION_TTL_SECONDS`).
- Keep route handlers focused and move reusable logic into helper functions.
- Prefer concise comments only where behavior is non-obvious.
- No formatter/linter is currently enforced; keep style consistent with `src/worker.js`.

Note: The embedded UI (SPA-like) is rendered server-side in `src/ui/template.js` and `src/ui/styles.js`; no separate build step for UI.

## Testing Guidelines

- Tests are in `tests/` using Node.js built-in testing.
- Minimum validation before PR:
  - `node --check src/worker.js`
  - `npm test`
  - Manual checks for login/logout, TOTP/HOTP generation, import/export, encrypted backup, group management, admin panel, API v1 endpoints.
- When adding tests, use `tests/` and `*.spec.js` naming (for example `tests/auth.spec.js`).

## Commit & Pull Request Guidelines

- Git history is not always available in this workspace; use Conventional Commits:
  - `feat: add encrypted import endpoint`
  - `fix: validate HOTP counter bounds`
- PRs should include:
  - clear summary and scope
  - migration impact (if any)
  - config/secrets changes
  - manual verification steps (and screenshots for UI changes)

## Security & Configuration Tips

- Never commit real secrets; store runtime secrets via Wrangler secrets.
- Treat export payloads as sensitive; prefer encrypted export in shared environments.
- For key rotation, plan a migration path for encrypted records before changing keys.
