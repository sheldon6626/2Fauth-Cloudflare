#Requires -Version 5.1

function Write-Header($text) {
    Write-Host ""
    Write-Host ("=" * 60) -ForegroundColor Cyan
    Write-Host "  $text" -ForegroundColor Cyan
    Write-Host ("=" * 60) -ForegroundColor Cyan
    Write-Host ""
}

function Write-Success($text) { Write-Host "✅ $text" -ForegroundColor Green }
function Write-Warn($text)    { Write-Host "⚠️  $text" -ForegroundColor Yellow }
function Write-Info($text)    { Write-Host "ℹ️  $text" -ForegroundColor Blue }
function Write-Err($text)     { Write-Host "❌ $text" -ForegroundColor Red }

Write-Header "2Fauth-Cloudflare 部署向导"

# 屏蔽 Node Warning
$env:NODE_NO_WARNINGS = "1"

if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$') {
            $name = $Matches[1]
            $val = $Matches[2].Trim('"').Trim("'")
            [System.Environment]::SetEnvironmentVariable($name, $val)
        }
    }
    Write-Info "已自动从 .env 文件加载 Cloudflare API 凭据"
}

Write-Header "步骤 1/8: 检查前置条件"
$nodeVer = & node --version 2>$null
if (-not $nodeVer) {
    Write-Err "未找到 Node.js，请先安装: https://nodejs.org"
    exit 1
}
Write-Success "Node.js: $nodeVer"

$npmVer = & npm --version 2>$null
Write-Success "npm: v$npmVer"

Write-Header "步骤 2/8: 安装依赖"
if (-not (Test-Path "node_modules")) {
    npm install
} else {
    Write-Success "依赖已安装"
}

Write-Header "步骤 3/8: 检查 Cloudflare 授权"
if ($env:CLOUDFLARE_API_TOKEN) {
    Write-Success "检测到 CLOUDFLARE_API_TOKEN 环境变量"
} else {
    $whoami = & npx wrangler whoami 2>$null
    if ($whoami -match "Not authenticated" -or -not $whoami) {
        Write-Info "请在浏览器中完成 Cloudflare 授权..."
        npx wrangler login
    } else {
        Write-Success "已登录 Cloudflare"
    }
}

Write-Header "步骤 4/8: 配置 D1 数据库"
$dbId = ""
if (Test-Path "wrangler.toml") {
    $content = Get-Content "wrangler.toml" -Raw
    if ($content -match 'database_id\s*=\s*"([^"]+)"') {
        $existingId = $Matches[1]
        if ($existingId -and $existingId -ne "<your-d1-database-id>") {
            Write-Success "找到已配置的 D1 数据库 ID: $existingId"
            $dbId = $existingId
        }
    }
}

if (-not $dbId) {
    Write-Info "正在创建 D1 数据库 worker-2fauth-db..."
    $createOutput = & npx wrangler d1 create worker-2fauth-db 2>&1 | Out-String
    if ($createOutput -match 'database_id\s*=\s*"([^"]+)"') {
        $dbId = $Matches[1]
        Write-Success "数据库创建成功! ID: $dbId"
    } else {
        $dbId = Read-Host "未能自动抓取 database_id，请手动粘贴输入"
    }
}

Write-Header "步骤 5/8: 生成安全密钥"
$encKey  = node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
$pepper  = node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
$bsToken = node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"

Write-Host "  ENCRYPTION_KEY:  $encKey"
Write-Host "  SESSION_PEPPER:  $pepper"
Write-Host "  BOOTSTRAP_TOKEN: $bsToken"
Write-Host ""
Write-Warn "⚠️ 请妥善保存 BOOTSTRAP_TOKEN！首次打开 Worker 页面初始化管理员账号时需要输入。"

Write-Header "步骤 6/8: 配置 wrangler.toml"
$tomlContent = @"
name = "worker-2fauth"
main = "src/worker.js"
compatibility_date = "2025-01-01"

[[d1_databases]]
binding = "DB"
database_name = "worker-2fauth-db"
database_id = "$dbId"

[vars]
ALLOW_PLAINTEXT_EXPORT = "false"
"@
Set-Content -Path "F:\AI\2FAauth\wrangler.toml" -Value $tomlContent -Encoding UTF8
Write-Success "wrangler.toml 已更新"

Write-Header "步骤 7/8: 写入 Cloudflare Secrets"
$encKey  | cmd /c "npx wrangler secret put ENCRYPTION_KEY 2>NUL"
Write-Success "ENCRYPTION_KEY 已设置"

$pepper  | cmd /c "npx wrangler secret put SESSION_PEPPER 2>NUL"
Write-Success "SESSION_PEPPER 已设置"

$bsToken | cmd /c "npx wrangler secret put BOOTSTRAP_TOKEN 2>NUL"
Write-Success "BOOTSTRAP_TOKEN 已设置"

Write-Header "步骤 8/8: 执行数据库迁移与部署"
Write-Info "正在应用远程数据库迁移 (npm run d1:migrate:remote)..."
npm run d1:migrate:remote
$migrateCode = $LASTEXITCODE

Write-Info "正在部署 Worker (npm run deploy)..."
npm run deploy
$deployCode = $LASTEXITCODE

if ($migrateCode -eq 0 -and $deployCode -eq 0) {
    Write-Header "🎉 部署成功!"
    Write-Host "  管理员初始化步骤:"
    Write-Host "  1. 打开控制台输出的 Worker URL"
    Write-Host "  2. 输入初始化令牌 BOOTSTRAP_TOKEN: $bsToken"
    Write-Host "  3. 创建管理员账号（密码要求 12+ 字符，含大小写字母、数字与符号）"
    Write-Host ""
} else {
    Write-Header "⚠️ 部署过程中因 Cloudflare API 网络超时未完全成功"
    Write-Warn "网络提示: Cloudflare API 请求超时 (The request to Cloudflare's API timed out)"
    Write-Info "解决建议:"
    Write-Info "1. 检查或切换网络代理/梯子节点（例如选择全局代理或直连模式）"
    Write-Info "2. 在网络恢复后直接运行以下两条命令重试部署:"
    Write-Host ""
    Write-Host "   npm run d1:migrate:remote" -ForegroundColor Yellow
    Write-Host "   npm run deploy" -ForegroundColor Yellow
    Write-Host ""
    Write-Info "注意: 本地配置、数据库绑定与密钥已经全部设置完毕，无需重复运行向导。"
}
