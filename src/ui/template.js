import { APP_STYLES } from "./styles.js";
import { CLIENT_SCRIPT } from "./client.js";

const ICONS = {
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3 5 6v5c0 4.6 2.9 8.7 7 10 4.1-1.3 7-5.4 7-10V6l-7-3Z"/><path d="m9.5 12 1.7 1.7 3.6-4"/></svg>',
  codes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 9h4M7 13h7M17 9h.01M17 13h.01"/></svg>',
  groups: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H10l2 2h5.5A2.5 2.5 0 0 1 20 8.5v9A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-11Z"/></svg>',
  transfer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 7h11l-3-3M17 17H6l3 3M18 7l-3 3M6 17l3-3"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.37a1.7 1.7 0 0 0-1 .63 1.7 1.7 0 0 0-.37 1.1V21h-4v-.1A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.23 15a1.7 1.7 0 0 0-.63-1A1.7 1.7 0 0 0 2.5 13.63H2.4v-4h.1A1.7 1.7 0 0 0 4 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 8.4 4.23a1.7 1.7 0 0 0 1-.63A1.7 1.7 0 0 0 9.77 2.5v-.1h4v.1A1.7 1.7 0 0 0 14.8 4a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06a1.7 1.7 0 0 0-.34 1.88c.16.4.38.73.63 1 .28.25.66.37 1.1.37h.1v4h-.1A1.7 1.7 0 0 0 19.4 15Z"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10 17l5-5-5-5M15 12H3M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6v5h-5M4 18v-5h5"/><path d="M18.5 9A7 7 0 0 0 6 6.5L4 9m16 6-2 2.5A7 7 0 0 1 5.5 15"/></svg>',
};

function brand() {
  return `<div class="brand"><div class="brand-mark">${ICONS.shield}</div><div class="brand-copy"><strong>2FAuth</strong><span data-i18n="brandTagline">安全验证码工作台</span></div></div>`;
}

export function renderAppHtml(env, nonce) {
  const turnstileSiteKey = String((env && env.TURNSTILE_SITE_KEY) || "");
  const plaintextExportEnabled = String((env && env.ALLOW_PLAINTEXT_EXPORT) || "").toLowerCase() === "true";
  const webTotpMode = String((env && env.WEB_TOTP_MODE) || "browser").toLowerCase() === "worker" ? "worker" : "browser";
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta name="theme-color" content="#102d30" />
  <title>2FAuth 验证器</title>
  <style nonce="${nonce}">${APP_STYLES}</style>
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</head>
<body>
  <main id="authShell" class="auth-shell">
    <section class="auth-card" aria-live="polite">
      ${brand()}
      <div id="authLoading" class="auth-heading">
        <h1>2FAuth 验证器</h1>
        <p id="state" data-i18n="loading">正在检查系统状态...</p>
      </div>

      <section id="bootstrap" class="hidden">
        <div class="auth-heading">
          <h2 data-i18n="bootstrapTitle">初始化管理员</h2>
          <p data-i18n="bootstrapIntro">首次使用，请创建用于管理此工作台的账户。</p>
        </div>
        <form id="bootstrapForm" class="auth-form">
          <label class="field"><span data-i18n="username">用户名</span><input id="bsUser" autocomplete="username" required data-i18n-placeholder="usernamePlaceholder" placeholder="管理员用户名" /></label>
          <label class="field"><span data-i18n="password">密码</span><input id="bsPass" type="password" autocomplete="new-password" required minlength="12" data-i18n-placeholder="passwordRequirement" placeholder="至少 12 位，包含大小写字母、数字和符号" /><small class="field-hint" data-i18n="passwordRequirement">至少 12 位，包含大小写字母、数字和符号</small></label>
          <label class="field"><span data-i18n="bootstrapToken">初始化密钥</span><input id="bsToken" type="password" autocomplete="off" required data-i18n-placeholder="bootstrapTokenPlaceholder" placeholder="部署时配置的初始化密钥" /></label>
          <button class="btn btn-block" type="submit" data-action="bootstrap"><span data-i18n="bootstrapAction">完成初始化</span></button>
          <div id="bsMsg" class="muted" role="status"></div>
        </form>
      </section>

      <section id="login" class="hidden">
        <div class="auth-heading">
          <h2 data-i18n="loginTitle">欢迎回来</h2>
          <p data-i18n="loginIntro">登录以查看和管理你的验证码。</p>
        </div>
        <form id="loginForm" class="auth-form">
          <label class="field"><span data-i18n="username">用户名</span><input id="loginUser" autocomplete="username" required data-i18n-placeholder="usernamePlaceholder" placeholder="输入用户名" /></label>
          <label class="field"><span data-i18n="password">密码</span><input id="loginPass" type="password" autocomplete="current-password" required data-i18n-placeholder="passwordPlaceholder" placeholder="输入密码" /></label>
          <div id="turnstileBox" class="hidden"></div>
          <button class="btn btn-block" type="submit" data-action="login"><span data-i18n="loginAction">登录</span></button>
          <div id="loginMsg" class="muted" role="status"></div>
        </form>
      </section>

      <div class="auth-footer"><span class="muted" data-i18n="localOnly">敏感数据仅发送到当前服务</span><select id="authLangSelect" aria-label="Language"><option value="zh-CN">简体中文</option><option value="en-US">English</option></select></div>
    </section>
  </main>

  <div id="app" class="app-shell hidden">
    <aside class="sidebar" id="sidebar" aria-label="Main navigation">
      ${brand()}
      <div class="nav-label" data-i18n="workspace">工作区</div>
      <nav class="nav">
        <button class="nav-item active" data-action="navigate" data-workspace="codes">${ICONS.codes}<span data-i18n="navCodes">验证码</span></button>
        <button class="nav-item" data-action="navigate" data-workspace="groups">${ICONS.groups}<span data-i18n="navGroups">分组</span></button>
        <button class="nav-item" data-action="navigate" data-workspace="transfer">${ICONS.transfer}<span data-i18n="navTransfer">导入导出</span></button>
        <button class="nav-item" data-action="navigate" data-workspace="settings">${ICONS.settings}<span data-i18n="navSettings">设置</span></button>
        <button id="adminNav" class="nav-item hidden" data-action="navigate" data-workspace="admin">${ICONS.users}<span data-i18n="navAdmin">用户管理</span></button>
      </nav>
      <div class="sidebar-bottom">
        <div class="sidebar-user"><div id="avatar" class="avatar">A</div><div class="sidebar-user-copy"><strong id="whoami">—</strong><span id="userRole">—</span></div></div>
        <button class="btn btn-quiet" data-action="logout">${ICONS.logout}<span data-i18n="logout">退出登录</span></button>
      </div>
    </aside>
    <button class="sidebar-scrim" data-action="close-sidebar" aria-label="Close navigation" aria-controls="sidebar"></button>

    <header class="topbar">
      <button class="btn btn-secondary icon-btn mobile-menu" data-action="toggle-sidebar" aria-label="Open navigation" aria-controls="sidebar" aria-expanded="false">${ICONS.menu}</button>
      <div class="page-title"><h1 id="pageTitle">验证码</h1><p id="pageSubtitle" data-i18n="codesSubtitle">快速取用并管理动态验证码</p></div>
      <label class="topbar-search" id="globalSearchWrap">${ICONS.search}<span class="sr-only" data-i18n="search">搜索</span><input id="search" name="otp-search-filter" type="search" autocomplete="off" data-lpignore="true" data-1p-ignore="true" data-i18n-placeholder="searchPlaceholder" placeholder="搜索标签或发行方" /></label>
      <div class="spacer"></div>
      <button class="btn btn-primary" data-action="open-entry" aria-label="添加验证码" data-i18n-aria-label="addCode">${ICONS.plus}<span data-i18n="addCode">添加验证码</span></button>
    </header>

    <main class="main">
      <section id="workspace-codes" class="workspace active" aria-labelledby="pageTitle">
        <div class="toolbar">
          <select id="groupFilter" class="field-inline" aria-label="Group filter"><option value="" data-i18n="allGroups">全部分组</option></select>
          <select id="statusFilter" class="field-inline" aria-label="Status filter"><option value="" data-i18n="allStatuses">全部状态</option><option value="enabled" data-i18n="enabled">已启用</option><option value="disabled" data-i18n="disabled">已停用</option><option value="hotp">HOTP</option></select>
          <button class="btn btn-secondary" data-action="refresh-all">${ICONS.refresh}<span data-i18n="refresh">刷新</span></button>
          <span id="entryCount" class="muted"></span>
        </div>
        <div id="entries" class="entries-grid" aria-live="polite">
          <div class="entry-card skeleton"></div><div class="entry-card skeleton"></div><div class="entry-card skeleton"></div>
        </div>
      </section>

      <section id="workspace-groups" class="workspace">
        <div class="workspace-header"><div><h2 data-i18n="groupsTitle">分组</h2><p data-i18n="groupsSubtitle">用颜色和名称整理验证码。</p></div></div>
        <div class="two-col">
          <div class="panel"><div class="panel-head"><h3 data-i18n="yourGroups">你的分组</h3><span id="groupCount" class="muted"></span></div><div class="panel-body"><div id="groupsList" class="group-list"></div></div></div>
          <form id="groupForm" class="panel"><div class="panel-head"><h3 data-i18n="newGroup">新建分组</h3></div><div class="panel-body stack"><label class="field"><span data-i18n="groupName">分组名称</span><input id="gName" required maxlength="60" data-i18n-placeholder="groupNamePlaceholder" placeholder="例如：工作" /></label><label class="field"><span data-i18n="groupColor">分组颜色</span><input id="gColor" type="color" value="#0f766e" /></label><button class="btn" type="submit" data-action="create-group"><span data-i18n="createGroup">创建分组</span></button><div id="groupMsg" class="muted" role="status"></div></div></form>
        </div>
      </section>

      <section id="workspace-transfer" class="workspace">
        <div class="workspace-header"><div><h2 data-i18n="transferTitle">导入导出</h2><p data-i18n="transferSubtitle">安全迁移或备份你的验证码数据。</p></div></div>
        <div class="callout"><strong data-i18n="encryptedRecommended">推荐使用加密备份</strong><span data-i18n="encryptedRecommendedDetail">加密备份在离开浏览器前会使用你的口令保护。</span></div>
        <div class="transfer-grid" style="margin-top:18px">
          <article class="panel action-card recommended"><h3 data-i18n="encryptedExport">加密导出</h3><p data-i18n="encryptedExportDetail">创建受口令保护的 JSON 备份，适合安全保存和迁移。</p><button class="btn" data-action="export-encrypted"><span data-i18n="createEncryptedBackup">创建加密备份</span></button></article>
          <article class="panel action-card"><h3 data-i18n="plaintextExport">明文导出</h3><p data-i18n="plaintextExportDetail">包含原始密钥，仅在受信环境中使用，并需要密码确认。</p><div class="row"><button class="btn btn-secondary" data-action="export-data" data-i18n="copyJson">复制 JSON</button><button class="btn btn-secondary" data-action="export-otpauth" data-i18n="downloadOtpAuth">下载 otpauth</button></div></article>
          <article class="panel action-card span-2"><h3 data-i18n="importData">导入数据</h3><p data-i18n="importDetail">支持备份 JSON、加密备份 JSON 或多行 otpauth URI。</p><div class="stack"><textarea id="importText" data-i18n-placeholder="importPlaceholder" placeholder="粘贴备份内容"></textarea><div class="row"><input id="importFile" type="file" accept=".json,.txt,text/plain,application/json" /><input id="importPassphrase" type="password" autocomplete="off" data-i18n-placeholder="backupPassphrase" placeholder="备份口令（加密导入时需要）" /></div><div class="row"><button class="btn btn-secondary" data-action="import-data" data-i18n="importJson">导入 JSON</button><button class="btn btn-secondary" data-action="import-otpauth" data-i18n="importOtpAuth">导入 otpauth</button><button class="btn" data-action="import-encrypted" data-i18n="importEncrypted">导入加密备份</button></div><div id="importMsg" class="muted" role="status"></div></div></article>
        </div>
      </section>

      <section id="workspace-settings" class="workspace">
        <div class="workspace-header"><div><h2 data-i18n="settingsTitle">账户设置</h2><p data-i18n="settingsSubtitle">管理界面偏好和账户安全。</p></div></div>
        <div class="settings-grid">
          <div class="panel"><div class="panel-head"><h3 data-i18n="preferences">偏好设置</h3></div><div class="panel-body"><div class="setting-row"><div><h3 data-i18n="language">语言</h3><p data-i18n="languageDetail">更改整个工作台的显示语言。</p></div><select id="langSelect"><option value="zh-CN">简体中文</option><option value="en-US">English</option></select></div><div class="setting-row"><div><h3 data-i18n="autoLogout">自动退出</h3><p data-i18n="autoLogoutDetail">无操作后自动结束当前会话。</p></div><select id="autoLogoutSelect"><option value="15">15 分钟</option><option value="30">30 分钟</option><option value="60">60 分钟</option><option value="120">120 分钟</option><option value="0" data-i18n="never">从不</option></select></div></div></div>
          <div class="panel"><div class="panel-head"><h3 data-i18n="accountSecurity">账户安全</h3></div><div class="panel-body stack"><p class="muted" data-i18n="passwordChangeDetail">修改密码后，当前会话将退出，需要重新登录。</p><button class="btn btn-secondary" data-action="change-my-password" data-i18n="changePassword">修改密码</button></div></div>
        </div>
      </section>

      <section id="workspace-admin" class="workspace">
        <div class="workspace-header"><div><h2 data-i18n="adminTitle">用户管理</h2><p data-i18n="adminSubtitle">管理成员账户、角色和登录风控。</p></div><button class="btn" data-action="open-create-user">${ICONS.plus}<span data-i18n="createUser">创建用户</span></button></div>
        <div class="panel"><div class="panel-head"><h3 data-i18n="users">用户</h3><span id="userMsg" class="muted"></span></div><div class="table-wrap"><table id="usersTable"></table></div></div>
        <div class="panel" style="margin-top:18px"><div class="panel-head"><h3 data-i18n="riskPolicy">登录风控设置</h3></div><div class="panel-body"><form id="riskForm" class="form-grid"><label class="field"><span data-i18n="requestsPerMinute">每分钟请求阈值</span><input id="riskMaxReq" type="number" min="3" max="100" required /></label><label class="field"><span data-i18n="lockMinutes">锁定分钟数</span><input id="riskLockMin" type="number" min="1" max="1440" required /></label><div class="span-2 row"><button class="btn" type="submit" data-action="save-login-policy" data-i18n="savePolicy">保存风控设置</button><span id="riskMsg" class="muted"></span></div></form></div></div>
      </section>
    </main>
  </div>

  <dialog id="entryDialog" class="dialog wide">
    <form id="entryForm" method="dialog">
      <div class="dialog-head"><div><h2 id="entryDialogTitle" data-i18n="addCode">添加验证码</h2><p data-i18n="entryDialogSubtitle">粘贴密钥或 otpauth URI，也可以扫描二维码。</p></div><button class="btn btn-quiet icon-btn" type="button" data-action="close-entry" aria-label="关闭" data-i18n-aria-label="close">×</button></div>
      <div class="dialog-body"><div class="form-grid">
        <input id="entryId" type="hidden" />
        <label class="field"><span data-i18n="label">标签</span><input id="eLabel" required maxlength="200" data-i18n-placeholder="labelPlaceholder" placeholder="例如：GitHub" /></label>
        <label class="field"><span data-i18n="issuer">发行方</span><input id="eIssuer" maxlength="100" data-i18n-placeholder="issuerPlaceholder" placeholder="可选" /></label>
        <label class="field span-2" id="secretField"><span data-i18n="secretOrUri">密钥或 URI</span><input id="eSecret" autocomplete="off" data-i18n-placeholder="secretPlaceholder" placeholder="Base32 密钥或 otpauth:// URI" /></label>
        <input id="eUri" type="hidden" />
        <label class="field span-2"><span data-i18n="group">分组</span><select id="eGroup"><option value="" data-i18n="noGroup">不分组</option></select></label>
        <div class="span-2 row"><button class="btn btn-secondary" type="button" data-action="start-scan" data-i18n="scanCamera">摄像头扫码</button><label class="btn btn-secondary"><span data-i18n="scanImage">扫描图片</span><input id="qrImageFile" class="sr-only" type="file" accept="image/*" /></label><button class="btn btn-quiet hidden" id="stopScanButton" type="button" data-action="stop-scan" data-i18n="stopScan">停止扫码</button></div>
        <video id="scanVideo" autoplay playsinline class="scan-preview span-2 hidden"></video><div id="scanMsg" class="muted span-2" role="status"></div>
        <details class="advanced span-2"><summary data-i18n="advancedSettings">高级设置</summary><div class="advanced-body form-grid"><label class="field"><span data-i18n="otpType">类型</span><select id="eOtpType"><option value="totp">TOTP</option><option value="hotp">HOTP</option></select></label><label class="field"><span data-i18n="algorithm">算法</span><select id="eAlgo"><option>SHA-1</option><option>SHA-256</option><option>SHA-512</option></select></label><label class="field"><span data-i18n="digits">位数</span><select id="eDigits"><option>6</option><option>7</option><option>8</option></select></label><label class="field"><span data-i18n="period">周期（秒）</span><input id="ePeriod" type="number" min="15" max="120" value="30" /></label><label class="field"><span data-i18n="counter">HOTP 计数器</span><input id="eCounter" type="number" min="0" value="0" /></label></div></details>
        <div id="entryMsg" class="muted span-2" role="status"></div>
      </div></div>
      <div class="dialog-footer"><button class="btn btn-secondary" type="button" data-action="close-entry" data-i18n="cancel">取消</button><button class="btn" type="submit" data-action="save-entry" data-i18n="save">保存</button></div>
    </form>
  </dialog>

  <dialog id="actionDialog" class="dialog">
    <form id="actionForm" method="dialog">
      <div class="dialog-head"><div><h2 id="actionTitle">确认操作</h2><p id="actionDescription"></p></div><button class="btn btn-quiet icon-btn" type="button" data-action="cancel-dialog" aria-label="关闭" data-i18n-aria-label="close">×</button></div>
      <div id="actionFields" class="dialog-body stack"></div>
      <div class="dialog-footer"><button class="btn btn-secondary" type="button" data-action="cancel-dialog" data-i18n="cancel">取消</button><button id="actionConfirm" class="btn" type="submit" data-i18n="confirm">确认</button></div>
    </form>
  </dialog>

  <div id="toastRegion" class="toast-region" aria-live="polite" aria-atomic="true"></div>
  <script nonce="${nonce}">const TURNSTILE_SITE_KEY=${JSON.stringify(turnstileSiteKey)};const PLAINTEXT_EXPORT_ENABLED=${JSON.stringify(plaintextExportEnabled)};const WEB_TOTP_MODE=${JSON.stringify(webTotpMode)};${CLIENT_SCRIPT}</script>
</body>
</html>`;
}
