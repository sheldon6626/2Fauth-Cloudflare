export const CLIENT_SCRIPT = String.raw`
(() => {
  "use strict";

  const I18N = {
    "zh-CN": {
      loading: "正在检查系统状态...", brandTagline: "安全验证码工作台", bootstrapTitle: "初始化管理员", bootstrapIntro: "首次使用，请创建用于管理此工作台的账户。", username: "用户名", password: "密码", usernamePlaceholder: "输入用户名", passwordPlaceholder: "输入密码", passwordRequirement: "至少 12 位，包含大小写字母、数字和符号", bootstrapToken: "初始化密钥", bootstrapTokenPlaceholder: "部署时配置的初始化密钥", bootstrapAction: "完成初始化", loginTitle: "欢迎回来", loginIntro: "登录以查看和管理你的验证码。", loginAction: "登录", localOnly: "敏感数据仅发送到当前服务",
      workspace: "工作区", navCodes: "验证码", navGroups: "分组", navTransfer: "导入导出", navSettings: "设置", navAdmin: "用户管理", logout: "退出登录", codesSubtitle: "快速取用并管理动态验证码", search: "搜索", searchPlaceholder: "搜索标签或发行方", addCode: "添加验证码", allGroups: "全部分组", allStatuses: "全部状态", enabled: "已启用", disabled: "已停用", refresh: "刷新",
      groupsTitle: "分组", groupsSubtitle: "用颜色和名称整理验证码。", yourGroups: "你的分组", newGroup: "新建分组", groupName: "分组名称", groupNamePlaceholder: "例如：工作", groupColor: "分组颜色", createGroup: "创建分组", transferTitle: "导入导出", transferSubtitle: "安全迁移或备份你的验证码数据。", encryptedRecommended: "推荐使用加密备份", encryptedRecommendedDetail: "加密备份在离开浏览器前会使用你的口令保护。", encryptedExport: "加密导出", encryptedExportDetail: "创建受口令保护的 JSON 备份，适合安全保存和迁移。", createEncryptedBackup: "创建加密备份", plaintextExport: "明文导出", plaintextExportDetail: "包含原始密钥，仅在受信环境中使用，并需要密码确认。", copyJson: "复制 JSON", downloadOtpAuth: "下载 otpauth", importData: "导入数据", importDetail: "支持备份 JSON、加密备份 JSON 或多行 otpauth URI。", importPlaceholder: "粘贴备份内容", backupPassphrase: "备份口令（加密导入时需要）", importJson: "导入 JSON", importOtpAuth: "导入 otpauth", importEncrypted: "导入加密备份",
      settingsTitle: "账户设置", settingsSubtitle: "管理界面偏好和账户安全。", preferences: "偏好设置", language: "语言", languageDetail: "更改整个工作台的显示语言。", autoLogout: "自动退出", autoLogoutDetail: "无操作后自动结束当前会话。", never: "从不", accountSecurity: "账户安全", passwordChangeDetail: "修改密码后，当前会话将退出，需要重新登录。", changePassword: "修改密码", adminTitle: "用户管理", adminSubtitle: "管理成员账户、角色和登录风控。", createUser: "创建用户", users: "用户", riskPolicy: "登录风控设置", requestsPerMinute: "每分钟请求阈值", lockMinutes: "锁定分钟数", savePolicy: "保存风控设置",
      entryDialogSubtitle: "粘贴密钥或 otpauth URI，也可以扫描二维码。", label: "标签", labelPlaceholder: "例如：GitHub", issuer: "发行方", issuerPlaceholder: "可选", secretOrUri: "密钥或 URI", secretPlaceholder: "Base32 密钥或 otpauth:// URI", group: "分组", noGroup: "不分组", scanCamera: "摄像头扫码", scanImage: "扫描图片", stopScan: "停止扫码", advancedSettings: "高级设置", otpType: "类型", algorithm: "算法", digits: "位数", period: "周期（秒）", counter: "HOTP 计数器", cancel: "取消", save: "保存", confirm: "确认",
      systemNotInitialized: "系统尚未初始化，请先创建管理员。", pleaseLogin: "请先登录。", ready: "已就绪", adminRole: "管理员", userRole: "用户", entriesCount: "个验证码", groupsCount: "个分组", usersCount: "个用户", noEntries: "还没有验证码", noEntriesDetail: "点击“添加验证码”开始使用。", noResults: "没有匹配结果", noResultsDetail: "请调整搜索或筛选条件。", loadFailed: "加载失败", retry: "重试", noGroupsYet: "暂无分组", groupEntries: "个条目", noIssuer: "无发行方", copyCode: "复制验证码", codeCopied: "验证码已复制", copyFailed: "无法复制，请稍后重试", secondsLeft: "秒后过期", generateHotp: "生成新代码", clickGenerate: "点击生成新的 HOTP", edit: "编辑", delete: "删除", enableEntry: "启用", disableEntry: "停用", moveGroup: "移动分组", moreActions: "更多操作", reorderCode: "拖动调整验证码顺序", entrySaved: "验证码已保存", entryUpdated: "验证码已更新", entryDeleted: "验证码已删除", groupCreated: "分组已创建", groupDeleted: "分组已删除", groupUpdated: "分组已更新",
      deleteEntryTitle: "删除验证码", deleteEntryDetail: "此操作无法撤销。确定删除这个验证码吗？", deleteGroupTitle: "删除分组", deleteGroupDetail: "分组下的验证码会保留并变为不分组。", deleteUserTitle: "删除用户", deleteUserDetail: "该用户的验证码和分组将被永久删除。", currentPassword: "当前密码", newPassword: "新密码", role: "角色", actions: "操作", setAdmin: "设为管理员", setUser: "设为普通用户", resetPassword: "重置密码", passwordChanged: "密码已修改，请重新登录。", passwordReset: "密码已重置", userCreated: "用户已创建", userDeleted: "用户已删除", roleUpdated: "角色已更新", riskPolicySaved: "风控设置已保存", createUserDetail: "创建一个可登录此工作台的新账户。", resetPasswordDetail: "为该用户设置新密码，并用你的当前密码确认。", roleChangeDetail: "更改用户角色需要输入你的当前密码。",
      encryptedBackupTitle: "创建加密备份", encryptedBackupDetail: "设置至少 10 位的备份口令，并输入当前账户密码确认。", backupPassphraseLabel: "备份口令", plaintextExportTitle: "确认明文导出", plaintextExportWarning: "导出内容包含所有 OTP 密钥。仅在受信环境中继续。", plaintextExportDisabled: "当前部署未开启明文导出，请使用加密导出。", backupCopied: "备份已复制到剪贴板", backupDownloaded: "无法访问剪贴板，已下载备份文件", otpauthDownloaded: "otpauth 文本已下载", importDone: "导入完成", fileLoaded: "文件内容已载入", scanStarted: "摄像头扫码已启动", scanFallback: "正在使用兼容扫码模式", scanDenied: "无法访问摄像头", noQrFound: "图片中未识别到二维码", qrDetected: "二维码已识别并填入表单", invalidOtpInput: "请输入有效的 Base32 密钥或 otpauth URI", logoutTimeout: "长时间无操作，已自动退出。", turnstileRequired: "请先完成 Cloudflare Turnstile 验证。", operationFailed: "操作失败", close: "关闭", editingCode: "编辑验证码", keepSecret: "留空将保留当前密钥", loginPolicyConfirm: "保存风控设置需要输入当前密码。"
    },
    "en-US": {
      loading: "Checking system status...", brandTagline: "Secure authenticator workspace", bootstrapTitle: "Initialize administrator", bootstrapIntro: "Create the administrator account for this workspace.", username: "Username", password: "Password", usernamePlaceholder: "Enter username", passwordPlaceholder: "Enter password", passwordRequirement: "At least 12 characters with upper/lowercase, number, and symbol", bootstrapToken: "Bootstrap token", bootstrapTokenPlaceholder: "Token configured during deployment", bootstrapAction: "Complete setup", loginTitle: "Welcome back", loginIntro: "Sign in to view and manage your codes.", loginAction: "Sign in", localOnly: "Sensitive data is sent only to this service",
      workspace: "Workspace", navCodes: "Codes", navGroups: "Groups", navTransfer: "Import & export", navSettings: "Settings", navAdmin: "User management", logout: "Sign out", codesSubtitle: "Access and manage authentication codes", search: "Search", searchPlaceholder: "Search label or issuer", addCode: "Add code", allGroups: "All groups", allStatuses: "All statuses", enabled: "Enabled", disabled: "Disabled", refresh: "Refresh",
      groupsTitle: "Groups", groupsSubtitle: "Organize codes with names and colors.", yourGroups: "Your groups", newGroup: "New group", groupName: "Group name", groupNamePlaceholder: "For example: Work", groupColor: "Group color", createGroup: "Create group", transferTitle: "Import & export", transferSubtitle: "Move or back up your authenticator data safely.", encryptedRecommended: "Encrypted backup recommended", encryptedRecommendedDetail: "Your passphrase protects the backup before it leaves the browser.", encryptedExport: "Encrypted export", encryptedExportDetail: "Create a passphrase-protected JSON backup for storage or migration.", createEncryptedBackup: "Create encrypted backup", plaintextExport: "Plaintext export", plaintextExportDetail: "Contains raw secrets and requires password confirmation.", copyJson: "Copy JSON", downloadOtpAuth: "Download otpauth", importData: "Import data", importDetail: "Supports backup JSON, encrypted JSON, or multiple otpauth URIs.", importPlaceholder: "Paste backup content", backupPassphrase: "Backup passphrase (for encrypted import)", importJson: "Import JSON", importOtpAuth: "Import otpauth", importEncrypted: "Import encrypted backup",
      settingsTitle: "Account settings", settingsSubtitle: "Manage preferences and account security.", preferences: "Preferences", language: "Language", languageDetail: "Change the language across the workspace.", autoLogout: "Auto sign-out", autoLogoutDetail: "End the session after a period of inactivity.", never: "Never", accountSecurity: "Account security", passwordChangeDetail: "Changing your password signs out the current session.", changePassword: "Change password", adminTitle: "User management", adminSubtitle: "Manage accounts, roles, and login risk controls.", createUser: "Create user", users: "Users", riskPolicy: "Login risk controls", requestsPerMinute: "Requests per minute", lockMinutes: "Lock duration (minutes)", savePolicy: "Save risk controls",
      entryDialogSubtitle: "Paste a secret or otpauth URI, or scan a QR code.", label: "Label", labelPlaceholder: "For example: GitHub", issuer: "Issuer", issuerPlaceholder: "Optional", secretOrUri: "Secret or URI", secretPlaceholder: "Base32 secret or otpauth:// URI", group: "Group", noGroup: "No group", scanCamera: "Scan with camera", scanImage: "Scan image", stopScan: "Stop scanning", advancedSettings: "Advanced settings", otpType: "Type", algorithm: "Algorithm", digits: "Digits", period: "Period (seconds)", counter: "HOTP counter", cancel: "Cancel", save: "Save", confirm: "Confirm",
      systemNotInitialized: "The system has not been initialized.", pleaseLogin: "Please sign in.", ready: "Ready", adminRole: "Administrator", userRole: "User", entriesCount: "codes", groupsCount: "groups", usersCount: "users", noEntries: "No codes yet", noEntriesDetail: "Select “Add code” to get started.", noResults: "No matching results", noResultsDetail: "Adjust the search or filter settings.", loadFailed: "Unable to load", retry: "Retry", noGroupsYet: "No groups yet", groupEntries: "entries", noIssuer: "No issuer", copyCode: "Copy code", codeCopied: "Code copied", copyFailed: "Could not copy the code", secondsLeft: "seconds left", generateHotp: "Generate new code", clickGenerate: "Generate a new HOTP code", edit: "Edit", delete: "Delete", enableEntry: "Enable", disableEntry: "Disable", moveGroup: "Move to group", moreActions: "More actions", reorderCode: "Drag to reorder code", entrySaved: "Code saved", entryUpdated: "Code updated", entryDeleted: "Code deleted", groupCreated: "Group created", groupDeleted: "Group deleted", groupUpdated: "Group updated",
      deleteEntryTitle: "Delete code", deleteEntryDetail: "This cannot be undone. Delete this authentication code?", deleteGroupTitle: "Delete group", deleteGroupDetail: "Codes in this group will be kept and become ungrouped.", deleteUserTitle: "Delete user", deleteUserDetail: "This user's codes and groups will be permanently deleted.", currentPassword: "Current password", newPassword: "New password", role: "Role", actions: "Actions", setAdmin: "Make administrator", setUser: "Make standard user", resetPassword: "Reset password", passwordChanged: "Password changed. Please sign in again.", passwordReset: "Password reset", userCreated: "User created", userDeleted: "User deleted", roleUpdated: "Role updated", riskPolicySaved: "Risk controls saved", createUserDetail: "Create a new account that can sign in to this workspace.", resetPasswordDetail: "Set a new password and confirm with your current password.", roleChangeDetail: "Changing a role requires your current password.",
      encryptedBackupTitle: "Create encrypted backup", encryptedBackupDetail: "Set a backup passphrase of at least 10 characters and confirm your account password.", backupPassphraseLabel: "Backup passphrase", plaintextExportTitle: "Confirm plaintext export", plaintextExportWarning: "This export contains every OTP secret. Continue only in a trusted environment.", plaintextExportDisabled: "Plaintext export is disabled. Use encrypted export instead.", backupCopied: "Backup copied to clipboard", backupDownloaded: "Clipboard unavailable; the backup was downloaded", otpauthDownloaded: "otpauth text downloaded", importDone: "Import completed", fileLoaded: "File content loaded", scanStarted: "Camera scanning started", scanFallback: "Using compatible scanning mode", scanDenied: "Camera is unavailable", noQrFound: "No QR code was found in the image", qrDetected: "QR code recognized and added to the form", invalidOtpInput: "Enter a valid Base32 secret or otpauth URI", logoutTimeout: "You were signed out after inactivity.", turnstileRequired: "Complete the Cloudflare Turnstile challenge first.", operationFailed: "Operation failed", close: "Close", editingCode: "Edit code", keepSecret: "Leave blank to keep the current secret", loginPolicyConfirm: "Enter your current password to save risk controls."
    }
  };

  let currentLang = localStorage.getItem("ui_lang") || "zh-CN";
  let autoLogoutMinutes = Number(localStorage.getItem("auto_logout_minutes") || "30");
  let currentUser = null;
  let entries = [];
  let groups = [];
  let codeState = Object.create(null);
  let serverClockOffsetMs = 0;
  let codesRefreshing = false;
  let codeTimer = null;
  let codeRequestAbort = null;
  let vaultGeneration = 0;
  let vaultStepUpDialogOpen = false;
  const browserTotpKeys = new Map();
  let scanStream = null;
  let scanTimer = null;
  let jsQrReady = false;
  let inactivityTimer = null;
  let activityBound = false;
  let otpLifecycleBound = false;
  let turnstileWidgetId = null;
  let turnstileToken = "";
  let actionHandler = null;
  let dialogReturnFocus = null;
  let draggedEntryCard = null;
  let reorderQueue = Promise.resolve();

  const byId = (id) => document.getElementById(id);
  const value = (id) => byId(id).value;
  const t = (key) => (I18N[currentLang] && I18N[currentLang][key]) || I18N["zh-CN"][key] || key;
  const esc = (text) => String(text == null ? "" : text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  async function api(path, options) {
    const opts = options || {};
    const response = await fetch(path, Object.assign({}, opts, {
      headers: Object.assign({ "content-type": "application/json" }, opts.headers || {}),
      credentials: "include"
    }));
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.detail ? data.error + ": " + data.detail : (data.error || "HTTP " + response.status));
      error.status = response.status;
      error.payload = data;
      if (response.status === 401 && !/password confirmation/i.test(String(data.error || ""))) clearBrowserTotpVault();
      throw error;
    }
    return data;
  }

  function setMessage(id, text, error) {
    const element = byId(id);
    if (!element) return;
    element.textContent = text || "";
    element.className = error ? "error" : "muted";
  }

  function toast(message, error) {
    const item = document.createElement("div");
    item.className = "toast" + (error ? " error" : "");
    item.setAttribute("role", error ? "alert" : "status");
    const copy = document.createElement("div");
    copy.textContent = message;
    const close = document.createElement("button");
    close.type = "button";
    close.setAttribute("aria-label", t("close"));
    close.textContent = "×";
    close.addEventListener("click", () => item.remove());
    item.append(copy, close);
    byId("toastRegion").appendChild(item);
    setTimeout(() => item.remove(), error ? 7000 : 4200);
  }

  function applyLanguage() {
    document.documentElement.lang = currentLang;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      element.placeholder = t(element.dataset.i18nPlaceholder);
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
    });
    byId("langSelect").value = currentLang;
    byId("authLangSelect").value = currentLang;
    byId("autoLogoutSelect").value = String(autoLogoutMinutes);
    Array.from(byId("autoLogoutSelect").options).forEach((option) => {
      if (option.value === "0") option.textContent = t("never");
      else option.textContent = option.value + (currentLang === "zh-CN" ? " 分钟" : " minutes");
    });
    document.title = currentLang === "zh-CN" ? "2FAuth 验证器" : "2FAuth Authenticator";
    syncPlaintextExportUi();
    if (currentUser) {
      byId("userRole").textContent = currentUser.role === "admin" ? t("adminRole") : t("userRole");
      const active = document.querySelector(".nav-item.active");
      navigate(active ? active.dataset.workspace : "codes", false);
      renderGroups();
      renderEntries();
      if (currentUser.role === "admin") renderUsers(window.__users || []);
    }
  }

  function changeLanguage(lang) {
    currentLang = I18N[lang] ? lang : "zh-CN";
    localStorage.setItem("ui_lang", currentLang);
    applyLanguage();
  }

  function syncPlaintextExportUi() {
    document.querySelectorAll('[data-action="export-data"], [data-action="export-otpauth"]').forEach((button) => {
      button.disabled = !PLAINTEXT_EXPORT_ENABLED;
      button.title = PLAINTEXT_EXPORT_ENABLED ? "" : t("plaintextExportDisabled");
    });
  }

  function showAuthSection(id, stateText) {
    clearBrowserTotpVault();
    byId("authLoading").classList.add("hidden");
    byId("bootstrap").classList.add("hidden");
    byId("login").classList.add("hidden");
    byId(id).classList.remove("hidden");
    byId("state").textContent = stateText;
  }

  function showApp() {
    byId("authShell").classList.add("hidden");
    byId("app").classList.remove("hidden");
    byId("whoami").textContent = currentUser.username;
    byId("avatar").textContent = String(currentUser.username || "U").slice(0, 1).toUpperCase();
    byId("userRole").textContent = currentUser.role === "admin" ? t("adminRole") : t("userRole");
    if (currentUser.role === "admin") byId("adminNav").classList.remove("hidden");
    bindActivityEvents();
    bindOtpLifecycle();
    startOtpActivity();
    scheduleAutoLogout();
  }

  function initTurnstile() {
    if (!TURNSTILE_SITE_KEY) return;
    byId("turnstileBox").classList.remove("hidden");
    let attempts = 0;
    const render = () => {
      if (turnstileWidgetId !== null) return;
      if (window.turnstile && typeof window.turnstile.render === "function") {
        turnstileWidgetId = window.turnstile.render("#turnstileBox", {
          sitekey: TURNSTILE_SITE_KEY,
          action: "login",
          callback: (token) => { turnstileToken = token || ""; },
          "expired-callback": () => { turnstileToken = ""; },
          "error-callback": () => { turnstileToken = ""; }
        });
      } else if (++attempts < 50) setTimeout(render, 100);
    };
    render();
  }

  async function init() {
    applyLanguage();
    const notice = sessionStorage.getItem("auth_notice");
    if (notice) {
      sessionStorage.removeItem("auth_notice");
      setTimeout(() => toast(t(notice)), 0);
    }
    try {
      const status = await api("/api/status");
      if (!status.initialized) {
        showAuthSection("bootstrap", t("systemNotInitialized"));
        return;
      }
      const me = await api("/api/me").catch(() => null);
      if (!me) {
        showAuthSection("login", t("pleaseLogin"));
        initTurnstile();
        return;
      }
      currentUser = me.user;
      showApp();
      await refreshAll();
      if (currentUser.role === "admin") await Promise.all([refreshUsers(), loadLoginPolicy()]);
    } catch (error) {
      byId("authLoading").querySelector("p").textContent = error.message;
    }
  }

  async function submitBootstrap() {
    setMessage("bsMsg", "");
    const button = document.querySelector('[data-action="bootstrap"]');
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    try {
      await api("/api/bootstrap", { method: "POST", body: JSON.stringify({ username: value("bsUser"), password: value("bsPass"), bootstrapToken: value("bsToken") }) });
      location.replace("/");
    } finally {
      button.disabled = false;
      button.removeAttribute("aria-busy");
    }
  }

  async function submitLogin() {
    if (TURNSTILE_SITE_KEY && !turnstileToken) throw new Error(t("turnstileRequired"));
    const button = document.querySelector('[data-action="login"]');
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    try {
      await api("/api/login", { method: "POST", body: JSON.stringify({ username: value("loginUser"), password: value("loginPass"), turnstileToken }) });
      location.replace("/");
    } catch (error) {
      if (window.turnstile && turnstileWidgetId !== null) {
        try { window.turnstile.reset(turnstileWidgetId); } catch {}
      }
      turnstileToken = "";
      throw error;
    } finally {
      button.disabled = false;
      button.removeAttribute("aria-busy");
    }
  }

  async function logout() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    clearBrowserTotpVault();
    await api("/api/logout", { method: "POST", body: "{}" });
    location.replace("/");
  }

  function navigate(workspace, closeDrawer) {
    if (workspace === "admin" && (!currentUser || currentUser.role !== "admin")) workspace = "codes";
    document.querySelectorAll(".workspace").forEach((section) => section.classList.toggle("active", section.id === "workspace-" + workspace));
    document.querySelectorAll(".nav-item[data-workspace]").forEach((button) => button.classList.toggle("active", button.dataset.workspace === workspace));
    const titles = {
      codes: [t("navCodes"), t("codesSubtitle")], groups: [t("groupsTitle"), t("groupsSubtitle")], transfer: [t("transferTitle"), t("transferSubtitle")], settings: [t("settingsTitle"), t("settingsSubtitle")], admin: [t("adminTitle"), t("adminSubtitle")]
    };
    byId("pageTitle").textContent = titles[workspace][0];
    byId("pageSubtitle").textContent = titles[workspace][1];
    byId("globalSearchWrap").classList.toggle("hidden", workspace !== "codes");
    if (closeDrawer !== false) setSidebarOpen(false);
  }

  let sidebarReturnFocus = null;

  function setSidebarOpen(open) {
    const wasOpen = document.body.classList.contains("sidebar-open");
    const sidebar = byId("sidebar");
    const drawerMode = window.matchMedia("(max-width: 900px)").matches;
    document.body.classList.toggle("sidebar-open", open);
    const toggle = document.querySelector('[data-action="toggle-sidebar"]');
    if (toggle) toggle.setAttribute("aria-expanded", String(open));
    document.querySelectorAll(".topbar, .main").forEach((region) => {
      if (open) region.setAttribute("inert", "");
      else region.removeAttribute("inert");
    });
    if (drawerMode && !open) {
      sidebar.setAttribute("inert", "");
      sidebar.setAttribute("aria-hidden", "true");
    } else {
      sidebar.removeAttribute("inert");
      sidebar.removeAttribute("aria-hidden");
    }
    if (open) {
      sidebarReturnFocus = document.activeElement;
      requestAnimationFrame(() => sidebar.querySelector(".nav-item:not(.hidden)")?.focus());
    } else if (wasOpen && sidebarReturnFocus instanceof HTMLElement) {
      const returnTarget = sidebarReturnFocus;
      sidebarReturnFocus = null;
      requestAnimationFrame(() => returnTarget.focus());
    }
  }

  async function refreshAll() {
    byId("entries").innerHTML = '<div class="entry-card skeleton"></div><div class="entry-card skeleton"></div><div class="entry-card skeleton"></div>';
    try {
      const data = await api("/api/app-data");
      entries = data.entries || [];
      groups = data.groups || [];
      const valid = new Set(entries.map((entry) => String(entry.id)));
      Object.keys(codeState).forEach((id) => { if (!valid.has(String(id))) delete codeState[id]; });
      clearBrowserTotpVault();
      hydrateGroupSelects();
      renderGroups();
      renderEntries();
      if (!document.hidden) await refreshVisibleCodes();
    } catch (error) {
      renderLoadError(error);
      throw error;
    }
  }

  function hydrateGroupSelects() {
    const currentEntryGroup = value("eGroup");
    const currentFilter = value("groupFilter");
    const filters = ['<option value="">' + esc(t("allGroups")) + "</option>"];
    groups.forEach((group) => {
      const suffix = currentUser && currentUser.role === "admin" && group.username ? " · " + group.username : "";
      filters.push('<option value="' + group.id + '">' + esc(group.name + suffix) + "</option>");
    });
    populateEntryGroupSelect(currentUser && currentUser.id, currentEntryGroup);
    byId("groupFilter").innerHTML = filters.join("");
    if (Array.from(byId("groupFilter").options).some((option) => option.value === currentFilter)) byId("groupFilter").value = currentFilter;
  }

  function populateEntryGroupSelect(ownerId, selectedGroupId) {
    const selected = selectedGroupId == null ? "" : String(selectedGroupId);
    const options = ['<option value="">' + esc(t("noGroup")) + "</option>"];
    groups.filter((group) => Number(group.user_id) === Number(ownerId)).forEach((group) => {
      options.push('<option value="' + group.id + '">' + esc(group.name) + "</option>");
    });
    byId("eGroup").innerHTML = options.join("");
    if (Array.from(byId("eGroup").options).some((option) => option.value === selected)) byId("eGroup").value = selected;
  }

  function renderGroups() {
    byId("groupCount").textContent = groups.length + " " + t("groupsCount");
    if (!groups.length) {
      byId("groupsList").innerHTML = '<div class="empty-state"><h3>' + esc(t("noGroupsYet")) + "</h3></div>";
      return;
    }
    byId("groupsList").innerHTML = groups.map((group) => {
      const count = entries.filter((entry) => Number(entry.group_id) === Number(group.id)).length;
      const owner = currentUser && currentUser.role === "admin" && group.username ? " · " + esc(group.username) : "";
      return '<div class="group-item"><span class="group-color" style="background:' + safeColor(group.color) + '"></span><div class="group-copy"><strong>' + esc(group.name) + "</strong><span>" + count + " " + esc(t("groupEntries")) + owner + '</span></div><button class="btn btn-quiet" data-action="delete-group" data-id="' + group.id + '">' + esc(t("delete")) + "</button></div>";
    }).join("");
  }

  function safeColor(color) {
    return /^#[0-9a-f]{6}$/i.test(String(color || "")) ? color : "#087f79";
  }

  function isEnabled(entry) {
    return entry.enabled === undefined || entry.enabled === null || Number(entry.enabled) !== 0;
  }

  function filteredEntries() {
    const query = value("search").trim().toLowerCase();
    const groupFilter = value("groupFilter");
    const status = value("statusFilter");
    return entries.filter((entry) => {
      if (query && !(String(entry.label || "") + " " + String(entry.issuer || "") + " " + String(entry.username || "")).toLowerCase().includes(query)) return false;
      if (groupFilter && String(entry.group_id || "") !== groupFilter) return false;
      if (status === "enabled" && !isEnabled(entry)) return false;
      if (status === "disabled" && isEnabled(entry)) return false;
      if (status === "hotp" && entry.otp_type !== "hotp") return false;
      return true;
    }).sort((left, right) => Number(isEnabled(right)) - Number(isEnabled(left)));
  }

  function renderEntries() {
    const list = filteredEntries();
    byId("entryCount").textContent = list.length + " " + t("entriesCount");
    if (!list.length) {
      const filtered = !!value("search") || !!value("groupFilter") || !!value("statusFilter");
      byId("entries").innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M7 10h6M7 14h4M17 10h.01"/></svg><h3>' + esc(t(filtered ? "noResults" : "noEntries")) + "</h3><p>" + esc(t(filtered ? "noResultsDetail" : "noEntriesDetail")) + "</p></div>";
      return;
    }
    byId("entries").innerHTML = list.map(entryCardHtml).join("");
    updateCodeTimers();
  }

  function entryCardHtml(entry) {
    const enabled = isEnabled(entry);
    const state = codeState[entry.id] || {};
    const code = enabled ? (state.code || "------") : "------";
    const timing = entryTiming(entry);
    const isHotp = entry.otp_type === "hotp";
    const groupBadge = entry.group_name ? '<span class="badge"><i class="swatch" style="background:' + safeColor(entry.group_color) + '"></i>' + esc(entry.group_name) + "</span>" : "";
    const ownerBadge = currentUser && currentUser.role === "admin" && entry.username ? '<span class="badge">' + esc(entry.username) + "</span>" : "";
    const caption = !enabled ? t("disabled") : (isHotp ? t("clickGenerate") : timing.expiresIn + " " + t("secondsLeft"));
    const groupOptions = ['<option value="">' + esc(t("noGroup")) + "</option>"].concat(groups.filter((group) => Number(group.user_id) === Number(entry.user_id)).map((group) => '<option value="' + group.id + '"' + (Number(group.id) === Number(entry.group_id) ? " selected" : "") + ">" + esc(group.name) + "</option>")).join("");
    return [
      '<article class="entry-card' + (enabled ? "" : " disabled") + '" data-entry-id="' + entry.id + '" data-enabled="' + (enabled ? "1" : "0") + '">',
      '<div class="entry-card-head"><div class="entry-ident"><h3>' + esc(entry.label) + "</h3><p>" + esc(entry.issuer || t("noIssuer")) + "</p></div>",
      '<button class="drag-handle" type="button" draggable="true" data-action="reorder-entry" data-id="' + entry.id + '" aria-label="' + esc(t("reorderCode")) + '" title="' + esc(t("reorderCode")) + '">⠿</button>',
      '<div class="entry-menu-wrap"><button class="btn btn-quiet icon-btn" data-action="toggle-entry-menu" data-id="' + entry.id + '" aria-label="' + esc(t("moreActions")) + '" aria-expanded="false">•••</button>',
      '<div class="entry-menu hidden" id="entry-menu-' + entry.id + '"><button data-action="edit-entry" data-id="' + entry.id + '">' + esc(t("edit")) + "</button>",
      '<button data-action="toggle-entry" data-id="' + entry.id + '" data-enabled="' + (enabled ? "0" : "1") + '">' + esc(enabled ? t("disableEntry") : t("enableEntry")) + "</button>",
      '<label><span class="sr-only">' + esc(t("moveGroup")) + '</span><select data-action="move-entry-group" data-id="' + entry.id + '" aria-label="' + esc(t("moveGroup")) + '">' + groupOptions + "</select></label>",
      '<button class="danger" data-action="delete-entry" data-id="' + entry.id + '">' + esc(t("delete")) + "</button></div></div></div>",
      '<div class="badges"><span class="badge">' + esc(String(entry.otp_type || "totp").toUpperCase()) + "</span>",
      !enabled ? '<span class="badge">' + esc(t("disabled")) + "</span>" : "",
      groupBadge, ownerBadge, isHotp ? '<span class="badge">#' + Number(entry.hotp_counter || 0) + "</span>" : "", "</div>",
      '<button class="code-button" data-action="' + (isHotp ? "gen-hotp" : "copy-code") + '" data-id="' + entry.id + '"' + (enabled ? "" : " disabled") + '><span class="code" id="c-' + entry.id + '">' + esc(code) + "</span></button>",
      '<div class="code-caption"><span id="x-' + entry.id + '">' + esc(caption) + "</span><span>" + (isHotp ? "HOTP" : entry.period + "s") + "</span></div>",
      '<div class="progress"><i id="p-' + entry.id + '" style="width:' + (enabled ? timing.progress : 0) + '%"></i></div>',
      '<div class="entry-footer"><button class="btn btn-secondary" data-action="' + (isHotp ? "gen-hotp" : "copy-code") + '" data-id="' + entry.id + '"' + (enabled ? "" : " disabled") + ">" + esc(isHotp ? t("generateHotp") : t("copyCode")) + "</button></div></article>"
    ].join("");
  }

  function renderLoadError(error) {
    byId("entries").innerHTML = '<div class="empty-state"><h3>' + esc(t("loadFailed")) + "</h3><p>" + esc(error.message) + '</p><button class="btn" data-action="refresh-all">' + esc(t("retry")) + "</button></div>";
  }

  function moveDraggedCard(target, clientX, clientY) {
    if (!draggedEntryCard || !target || target === draggedEntryCard) return;
    if (target.dataset.enabled !== draggedEntryCard.dataset.enabled) return;
    const rect = target.getBoundingClientRect();
    const sameRow = clientY >= rect.top && clientY <= rect.bottom;
    const insertAfter = sameRow ? clientX > rect.left + rect.width / 2 : clientY > rect.top + rect.height / 2;
    target.parentElement.insertBefore(draggedEntryCard, insertAfter ? target.nextSibling : target);
  }

  function persistRenderedEntryOrder() {
    const visibleIds = Array.from(byId("entries").querySelectorAll(".entry-card[data-entry-id]"), (card) => Number(card.dataset.entryId));
    if (!visibleIds.length) return;
    const visibleSet = new Set(visibleIds);
    const entryById = new Map(entries.map((entry) => [Number(entry.id), entry]));
    let visibleIndex = 0;
    entries = entries.map((entry) => visibleSet.has(Number(entry.id)) ? entryById.get(visibleIds[visibleIndex++]) : entry);
    const orderedIds = entries.map((entry) => Number(entry.id));
    reorderQueue = reorderQueue.catch(() => {}).then(() => api("/api/entries/order", {
      method: "PATCH",
      body: JSON.stringify({ orderedIds })
    })).catch(async (error) => {
      toast(error.message || t("operationFailed"), true);
      await refreshAll().catch(() => {});
    });
  }

  function serverNowSec() { return Math.floor((Date.now() + serverClockOffsetMs) / 1000); }
  function entryPeriod(entry) { return Math.max(1, Number(entry.period || 30)); }
  function entryStep(entry) { return Math.floor(serverNowSec() / entryPeriod(entry)); }
  function entryTiming(entry) {
    if (!isEnabled(entry) || entry.otp_type === "hotp") return { expiresIn: 0, progress: entry.otp_type === "hotp" ? 100 : 0 };
    const period = entryPeriod(entry);
    const remaining = period - (serverNowSec() % period);
    return { expiresIn: remaining, progress: Math.max(0, Math.min(100, remaining / period * 100)) };
  }

  async function refreshVisibleCodes() {
    if (document.hidden) return;
    const activeTotpEntries = entries.filter((entry) => entry.otp_type !== "hotp" && isEnabled(entry));
    if (browserTotpAvailable()) {
      await refreshBrowserTotp(activeTotpEntries, true);
      return;
    }
    await refreshCodesBatch(activeTotpEntries, true);
  }

  async function refreshCodesBatch(list, silent) {
    if (!list.length || codesRefreshing || document.hidden) return;
    codesRefreshing = true;
    const controller = new AbortController();
    codeRequestAbort = controller;
    try {
      const result = await api("/api/codes/batch", { method: "POST", signal: controller.signal, body: JSON.stringify({ entryIds: list.map((entry) => entry.id) }) });
      if (document.hidden || controller.signal.aborted) return;
      if (Number.isFinite(result.serverTime)) serverClockOffsetMs = Number(result.serverTime) * 1000 - Date.now();
      (result.items || []).forEach((item) => {
        const entry = entries.find((candidate) => Number(candidate.id) === Number(item.id));
        if (entry && !item.error && item.enabled !== false) codeState[item.id] = { code: item.code, fetchedStep: entryStep(entry) };
      });
      updateCodeTimers();
    } catch (error) {
      if (!silent && error.name !== "AbortError") toast(error.message, true);
    } finally {
      if (codeRequestAbort === controller) codeRequestAbort = null;
      codesRefreshing = false;
    }
  }

  function browserTotpAvailable() {
    return WEB_TOTP_MODE === "browser" && !!(window.crypto && window.crypto.subtle);
  }

  function clearBrowserTotpVault() {
    vaultGeneration += 1;
    browserTotpKeys.clear();
    entries.filter((entry) => entry.otp_type !== "hotp").forEach((entry) => delete codeState[entry.id]);
  }

  function decodeBase32Secret(secret) {
    const normalized = String(secret || "").toUpperCase().replace(/[\s=-]/g, "");
    if (!normalized || !/^[A-Z2-7]+$/.test(normalized)) throw new Error("Invalid TOTP secret");
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let buffer = 0;
    let bits = 0;
    const bytes = [];
    for (const character of normalized) {
      buffer = (buffer << 5) | alphabet.indexOf(character);
      bits += 5;
      if (bits >= 8) {
        bits -= 8;
        bytes.push((buffer >>> bits) & 0xff);
        buffer &= bits ? (1 << bits) - 1 : 0;
      }
    }
    if (!bytes.length) throw new Error("Invalid TOTP secret");
    return new Uint8Array(bytes);
  }

  function validBrowserTotpAlgorithm(value) {
    const algorithm = String(value || "").toUpperCase();
    return ["SHA-1", "SHA-256", "SHA-512"].includes(algorithm) ? algorithm : null;
  }

  async function importBrowserTotpKey(item, generation) {
    const algorithm = validBrowserTotpAlgorithm(item.algorithm);
    const digits = Number(item.digits);
    const period = Number(item.period);
    if (!algorithm || ![6, 7, 8].includes(digits) || !Number.isInteger(period) || period < 15 || period > 120) return;
    const secretBytes = decodeBase32Secret(item.secret);
    try {
      const key = await crypto.subtle.importKey("raw", secretBytes, { name: "HMAC", hash: { name: algorithm } }, false, ["sign"]);
      if (generation === vaultGeneration && !document.hidden) {
        browserTotpKeys.set(String(item.id), { key, digits, period, algorithm });
      }
    } finally {
      secretBytes.fill(0);
    }
  }

  function isPasswordStepUpError(error) {
    return error && error.status === 401 && /password confirmation/i.test(error.message || "");
  }

  function promptForVaultPassword(list) {
    if (vaultStepUpDialogOpen) return;
    vaultStepUpDialogOpen = true;
    openAction({
      title: t("currentPassword"),
      description: t("codesSubtitle"),
      fields: [{ name: "confirmPassword", label: t("currentPassword"), type: "password", autocomplete: "current-password" }],
      onConfirm: async (data) => {
        await refreshBrowserTotp(list, false, data.confirmPassword);
        closeAction();
      },
    });
  }

  async function refreshBrowserTotp(list, silent, confirmPassword) {
    if (!list.length || document.hidden) return;
    const missing = list.filter((entry) => !browserTotpKeys.has(String(entry.id)));
    if (missing.length) await syncBrowserTotpVault(missing, silent, confirmPassword);
    if (!document.hidden) await computeBrowserTotpCodes(list);
  }

  async function syncBrowserTotpVault(list, silent, confirmPassword) {
    if (!list.length || codesRefreshing || document.hidden) return;
    codesRefreshing = true;
    const controller = new AbortController();
    const generation = vaultGeneration;
    codeRequestAbort = controller;
    try {
      for (let start = 0; start < list.length; start += 90) {
        const chunk = list.slice(start, start + 90);
        const payload = { entryIds: chunk.map((entry) => entry.id) };
        if (confirmPassword) payload.confirmPassword = confirmPassword;
        const result = await api("/api/codes/vault", { method: "POST", signal: controller.signal, body: JSON.stringify(payload) });
        if (controller.signal.aborted || document.hidden || generation !== vaultGeneration) return;
        if (Number.isFinite(result.serverTime)) serverClockOffsetMs = Number(result.serverTime) * 1000 - Date.now();
        await Promise.all((result.items || []).map((item) => importBrowserTotpKey(item, generation).catch(() => {})));
      }
      if (!document.hidden && generation === vaultGeneration) updateCodeTimers();
    } catch (error) {
      if (error.name === "AbortError") return;
      if (!confirmPassword && isPasswordStepUpError(error)) {
        promptForVaultPassword(list);
        return;
      }
      if (silent) return;
      toast(error.message, true);
      throw error;
    } finally {
      if (codeRequestAbort === controller) codeRequestAbort = null;
      codesRefreshing = false;
    }
  }

  async function generateBrowserTotp(record, step) {
    const counter = new Uint8Array(8);
    let value = Math.max(0, Math.floor(step));
    for (let index = 7; index >= 0; index -= 1) {
      counter[index] = value & 0xff;
      value = Math.floor(value / 256);
    }
    const digest = new Uint8Array(await crypto.subtle.sign("HMAC", record.key, counter));
    const offset = digest[digest.length - 1] & 0x0f;
    if (offset + 4 > digest.length) throw new Error("Invalid TOTP digest");
    const binary = (((digest[offset] & 0x7f) << 24) | (digest[offset + 1] << 16) | (digest[offset + 2] << 8) | digest[offset + 3]) >>> 0;
    return String(binary % (10 ** record.digits)).padStart(record.digits, "0");
  }

  async function computeBrowserTotpCodes(list) {
    const updates = await Promise.all(list.map(async (entry) => {
      const record = browserTotpKeys.get(String(entry.id));
      if (!record || entry.otp_type === "hotp" || !isEnabled(entry)) return null;
      const step = Math.floor(serverNowSec() / record.period);
      const state = codeState[entry.id] || {};
      if (state.code && state.fetchedStep === step) return entry;
      const code = await generateBrowserTotp(record, step);
      if (!document.hidden && browserTotpKeys.get(String(entry.id)) === record) {
        codeState[entry.id] = { code, fetchedStep: step };
      }
      return entry;
    }));
    if (!document.hidden) updates.filter(Boolean).forEach(updateEntryDisplay);
  }

  function updateEntryDisplay(entry) {
    const state = codeState[entry.id] || {};
    const enabled = isEnabled(entry);
    const timing = entryTiming(entry);
    const codeElement = byId("c-" + entry.id);
    const caption = byId("x-" + entry.id);
    const progress = byId("p-" + entry.id);
    if (codeElement) codeElement.textContent = enabled ? (state.code || "------") : "------";
    if (caption) caption.textContent = !enabled ? t("disabled") : (entry.otp_type === "hotp" ? t("clickGenerate") : timing.expiresIn + " " + t("secondsLeft"));
    if (progress) progress.style.width = (enabled ? timing.progress : 0) + "%";
  }

  function updateCodeTimers() {
    if (document.hidden) return;
    const localRefresh = [];
    const remoteRefresh = [];
    const missingVaultEntries = [];
    entries.forEach((entry) => {
      updateEntryDisplay(entry);
      if (entry.otp_type === "hotp" || !isEnabled(entry)) return;
      const state = codeState[entry.id] || {};
      if (state.code && state.fetchedStep === entryStep(entry)) return;
      if (browserTotpAvailable()) {
        if (browserTotpKeys.has(String(entry.id))) localRefresh.push(entry);
        else missingVaultEntries.push(entry);
      } else remoteRefresh.push(entry);
    });
    if (localRefresh.length) void computeBrowserTotpCodes(localRefresh).catch(() => {});
    if (missingVaultEntries.length) void refreshBrowserTotp(missingVaultEntries, true).catch(() => {});
    if (remoteRefresh.length) void refreshCodesBatch(remoteRefresh, true);
  }

  async function copyCode(id) {
    const entry = entries.find((item) => Number(item.id) === Number(id));
    if (!entry || !isEnabled(entry)) return;
    if (!(codeState[id] && codeState[id].code)) {
      if (browserTotpAvailable()) await refreshBrowserTotp([entry], false);
      else await refreshCodesBatch([entry], false);
    }
    const code = String((codeState[id] && codeState[id].code) || "");
    if (!code) throw new Error(t("copyFailed"));
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.remove();
      if (!copied) throw new Error(t("copyFailed"));
    }
    toast(t("codeCopied"));
  }

  async function generateHotp(id) {
    const result = await api("/api/entries/" + id + "/hotp", { method: "POST", body: "{}" });
    codeState[id] = { code: result.code, fetchedStep: 0 };
    const entry = entries.find((item) => Number(item.id) === Number(id));
    if (entry) entry.hotp_counter = result.nextCounter;
    renderEntries();
  }

  function resetEntryForm() {
    byId("entryForm").reset();
    populateEntryGroupSelect(currentUser && currentUser.id, "");
    byId("entryId").value = "";
    byId("eUri").value = "";
    byId("eAlgo").value = "SHA-1";
    byId("eDigits").value = "6";
    byId("ePeriod").value = "30";
    byId("eCounter").value = "0";
    byId("secretField").querySelector("span").textContent = t("secretOrUri");
    byId("eSecret").placeholder = t("secretPlaceholder");
    setMessage("entryMsg", "");
  }

  function openEntry(id, source) {
    resetEntryForm();
    dialogReturnFocus = source || document.activeElement;
    const entry = entries.find((item) => Number(item.id) === Number(id));
    if (entry) {
      populateEntryGroupSelect(entry.user_id, entry.group_id);
      byId("entryId").value = entry.id;
      byId("eLabel").value = entry.label || "";
      byId("eIssuer").value = entry.issuer || "";
      byId("eOtpType").value = entry.otp_type || "totp";
      byId("eAlgo").value = normalizeAlgorithm(entry.algorithm);
      byId("eDigits").value = String(entry.digits || 6);
      byId("ePeriod").value = String(entry.period || 30);
      byId("eCounter").value = String(entry.hotp_counter || 0);
      byId("entryDialogTitle").textContent = t("editingCode");
      byId("eSecret").placeholder = t("keepSecret");
    } else {
      byId("entryDialogTitle").textContent = t("addCode");
    }
    byId("entryDialog").showModal();
    setTimeout(() => byId("eLabel").focus(), 0);
  }

  function closeEntry() {
    stopScan();
    clearEntrySecretInputs();
    byId("entryDialog").close();
    if (dialogReturnFocus && typeof dialogReturnFocus.focus === "function") dialogReturnFocus.focus();
  }

  function clearEntrySecretInputs() {
    byId("eSecret").value = "";
    byId("eUri").value = "";
  }

  function canonicalBase32(input) { return String(input || "").toUpperCase().replace(/[\s=-]/g, ""); }
  function validBase32(input) { const secret = canonicalBase32(input); return secret.length >= 8 && /^[A-Z2-7]+$/.test(secret); }
  function normalizeAlgorithm(input) {
    const normalized = String(input || "").toUpperCase().replace(/-/g, "");
    if (normalized === "SHA256") return "SHA-256";
    if (normalized === "SHA512") return "SHA-512";
    return "SHA-1";
  }

  function applyOtpInput(input, showError) {
    const match = String(input || "").match(/otpauth:\/\/[^\s"'<>]+/i);
    if (match) {
      try {
        const url = new URL(match[0]);
        if (url.protocol !== "otpauth:" || !["totp", "hotp"].includes(url.hostname)) throw new Error("invalid");
        const secret = canonicalBase32(url.searchParams.get("secret"));
        if (!validBase32(secret)) throw new Error("invalid");
        const rawLabel = decodeURIComponent(url.pathname.replace(/^\//, ""));
        const colon = rawLabel.indexOf(":");
        const issuer = (url.searchParams.get("issuer") || (colon >= 0 ? rawLabel.slice(0, colon) : "")).trim();
        const label = (colon >= 0 ? rawLabel.slice(colon + 1) : rawLabel).trim();
        byId("eUri").value = match[0];
        byId("eSecret").value = secret;
        if (!byId("eLabel").value) byId("eLabel").value = label || issuer || "OTP";
        if (!byId("eIssuer").value) byId("eIssuer").value = issuer;
        byId("eOtpType").value = url.hostname;
        byId("eAlgo").value = normalizeAlgorithm(url.searchParams.get("algorithm"));
        byId("eDigits").value = ["6", "7", "8"].includes(url.searchParams.get("digits")) ? url.searchParams.get("digits") : "6";
        byId("ePeriod").value = url.searchParams.get("period") || "30";
        byId("eCounter").value = url.searchParams.get("counter") || "0";
        return true;
      } catch {}
    }
    if (validBase32(input)) {
      byId("eSecret").value = canonicalBase32(input);
      byId("eUri").value = "";
      return true;
    }
    if (showError) setMessage("entryMsg", t("invalidOtpInput"), true);
    return false;
  }

  async function saveEntry() {
    const id = Number(value("entryId") || 0);
    const rawSecret = value("eSecret").trim();
    if (!id && !rawSecret) throw new Error(t("invalidOtpInput"));
    if (rawSecret && !applyOtpInput(rawSecret, true)) return;
    const payload = {
      label: value("eLabel"), issuer: value("eIssuer"), groupId: value("eGroup") ? Number(value("eGroup")) : null,
      otpType: value("eOtpType"), algorithm: value("eAlgo"), digits: Number(value("eDigits")), period: Number(value("ePeriod")), hotpCounter: Number(value("eCounter"))
    };
    if (id) {
      if (rawSecret) payload.secret = canonicalBase32(value("eSecret"));
      await api("/api/entries/" + id, { method: "PATCH", body: JSON.stringify(payload) });
      toast(t("entryUpdated"));
    } else {
      if (value("eUri")) {
        delete payload.otpType; delete payload.algorithm; delete payload.digits; delete payload.period; delete payload.hotpCounter;
        payload.otpauthUri = value("eUri");
      } else payload.secret = canonicalBase32(value("eSecret"));
      await api("/api/entries", { method: "POST", body: JSON.stringify(payload) });
      toast(t("entrySaved"));
    }
    closeEntry();
    await refreshAll();
  }

  function fieldHtml(field) {
    const type = field.type || "text";
    const attributes = ['id="action-' + esc(field.name) + '"', 'name="' + esc(field.name) + '"'];
    if (field.required !== false) attributes.push("required");
    if (field.autocomplete) attributes.push('autocomplete="' + esc(field.autocomplete) + '"');
    if (field.minlength) attributes.push('minlength="' + Number(field.minlength) + '"');
    if (field.min != null) attributes.push('min="' + Number(field.min) + '"');
    if (field.max != null) attributes.push('max="' + Number(field.max) + '"');
    if (field.readonly) attributes.push("readonly");
    let control;
    if (type === "select") control = '<select ' + attributes.join(" ") + ">" + field.options.map((option) => '<option value="' + esc(option.value) + '"' + (String(option.value) === String(field.value) ? " selected" : "") + ">" + esc(option.label) + "</option>").join("") + "</select>";
    else if (type === "textarea") control = '<textarea ' + attributes.join(" ") + ">" + esc(field.value || "") + "</textarea>";
    else control = '<input type="' + esc(type) + '" value="' + esc(field.value || "") + '" ' + attributes.join(" ") + " />";
    return '<label class="field"><span>' + esc(field.label) + "</span>" + control + (field.hint ? '<small class="field-hint">' + esc(field.hint) + "</small>" : "") + "</label>";
  }

  function openAction(config, source) {
    dialogReturnFocus = source || document.activeElement;
    byId("actionTitle").textContent = config.title;
    byId("actionDescription").textContent = config.description || "";
    byId("actionFields").innerHTML = (config.fields || []).map(fieldHtml).join("");
    byId("actionConfirm").textContent = config.confirmLabel || t("confirm");
    byId("actionConfirm").className = "btn" + (config.danger ? " btn-danger" : "");
    actionHandler = config.onConfirm;
    byId("actionDialog").showModal();
    const first = byId("actionFields").querySelector("input,select,textarea");
    setTimeout(() => (first || byId("actionConfirm")).focus(), 0);
  }

  function closeAction() {
    actionHandler = null;
    byId("actionDialog").close();
    if (dialogReturnFocus && typeof dialogReturnFocus.focus === "function") dialogReturnFocus.focus();
  }

  function actionValues() {
    return Object.fromEntries(new FormData(byId("actionForm")).entries());
  }

  async function confirmDeleteEntry(id, source) {
    openAction({ title: t("deleteEntryTitle"), description: t("deleteEntryDetail"), danger: true, confirmLabel: t("delete"), onConfirm: async () => {
      await api("/api/entries/" + id, { method: "DELETE" });
      closeAction(); toast(t("entryDeleted")); await refreshAll();
    } }, source);
  }

  async function createGroup() {
    await api("/api/groups", { method: "POST", body: JSON.stringify({ name: value("gName"), color: value("gColor") }) });
    byId("gName").value = "";
    toast(t("groupCreated"));
    await refreshAll();
  }

  function confirmDeleteGroup(id, source) {
    openAction({ title: t("deleteGroupTitle"), description: t("deleteGroupDetail"), danger: true, confirmLabel: t("delete"), onConfirm: async () => {
      await api("/api/groups/" + id, { method: "DELETE" }); closeAction(); toast(t("groupDeleted")); await refreshAll();
    } }, source);
  }

  async function moveEntryGroup(id, groupId) {
    await api("/api/entries/" + id, { method: "PATCH", body: JSON.stringify({ groupId: groupId ? Number(groupId) : null }) });
    toast(t("groupUpdated"));
    await refreshAll();
  }

  async function refreshUsers() {
    const data = await api("/api/users");
    window.__users = data.users || [];
    renderUsers(window.__users);
  }

  function renderUsers(users) {
    byId("userMsg").textContent = users.length + " " + t("usersCount");
    byId("usersTable").innerHTML = '<thead><tr><th>ID</th><th>' + esc(t("username")) + "</th><th>" + esc(t("role")) + "</th><th>" + esc(t("actions")) + "</th></tr></thead><tbody>" + users.map((user) => '<tr><td>' + user.id + "</td><td>" + esc(user.username) + "</td><td>" + esc(user.role) + '</td><td class="actions"><button class="btn btn-secondary" data-action="switch-role" data-id="' + user.id + '" data-role="' + (user.role === "admin" ? "user" : "admin") + '">' + esc(user.role === "admin" ? t("setUser") : t("setAdmin")) + '</button><button class="btn btn-secondary" data-action="reset-password" data-id="' + user.id + '">' + esc(t("resetPassword")) + '</button><button class="btn btn-quiet" data-action="delete-user" data-id="' + user.id + '">' + esc(t("delete")) + "</button></td></tr>").join("") + "</tbody>";
  }

  function openCreateUser(source) {
    openAction({ title: t("createUser"), description: t("createUserDetail"), confirmLabel: t("createUser"), fields: [
      { name: "username", label: t("username"), autocomplete: "off" }, { name: "password", label: t("password"), type: "password", minlength: 12, autocomplete: "new-password", hint: t("passwordRequirement") }, { name: "role", label: t("role"), type: "select", value: "user", options: [{ value: "user", label: t("userRole") }, { value: "admin", label: t("adminRole") }] }
    ], onConfirm: async (data) => { await api("/api/users", { method: "POST", body: JSON.stringify(data) }); closeAction(); toast(t("userCreated")); await refreshUsers(); } }, source);
  }

  function openRoleChange(id, role, source) {
    openAction({ title: role === "admin" ? t("setAdmin") : t("setUser"), description: t("roleChangeDetail"), fields: [{ name: "confirmPassword", label: t("currentPassword"), type: "password", autocomplete: "current-password" }], onConfirm: async (data) => {
      await api("/api/users/" + id + "/role", { method: "PATCH", body: JSON.stringify({ role, confirmPassword: data.confirmPassword }) }); closeAction(); toast(t("roleUpdated")); await refreshUsers();
    } }, source);
  }

  function openResetPassword(id, source) {
    openAction({ title: t("resetPassword"), description: t("resetPasswordDetail"), fields: [{ name: "newPassword", label: t("newPassword"), type: "password", minlength: 12, autocomplete: "new-password", hint: t("passwordRequirement") }, { name: "confirmPassword", label: t("currentPassword"), type: "password", autocomplete: "current-password" }], onConfirm: async (data) => {
      await api("/api/users/" + id + "/password", { method: "PATCH", body: JSON.stringify(data) }); closeAction(); toast(t("passwordReset"));
    } }, source);
  }

  function openDeleteUser(id, source) {
    openAction({ title: t("deleteUserTitle"), description: t("deleteUserDetail"), danger: true, confirmLabel: t("delete"), fields: [{ name: "confirmPassword", label: t("currentPassword"), type: "password", autocomplete: "current-password" }], onConfirm: async (data) => {
      await api("/api/users/" + id, { method: "DELETE", body: JSON.stringify(data) }); closeAction(); toast(t("userDeleted")); await refreshUsers();
    } }, source);
  }

  function openChangePassword(source) {
    openAction({ title: t("changePassword"), description: t("passwordChangeDetail"), fields: [{ name: "currentPassword", label: t("currentPassword"), type: "password", autocomplete: "current-password" }, { name: "newPassword", label: t("newPassword"), type: "password", minlength: 12, autocomplete: "new-password", hint: t("passwordRequirement") }], onConfirm: async (data) => {
      await api("/api/me/password", { method: "PATCH", body: JSON.stringify(data) }); sessionStorage.setItem("auth_notice", "passwordChanged"); location.replace("/");
    } }, source);
  }

  async function loadLoginPolicy() {
    const data = await api("/api/security/login-policy");
    byId("riskMaxReq").value = data.maxRequestsPerMinute;
    byId("riskLockMin").value = data.lockMinutes;
  }

  function openSaveLoginPolicy(source) {
    const maxRequestsPerMinute = Number(value("riskMaxReq"));
    const lockMinutes = Number(value("riskLockMin"));
    openAction({ title: t("savePolicy"), description: t("loginPolicyConfirm"), fields: [{ name: "confirmPassword", label: t("currentPassword"), type: "password", autocomplete: "current-password" }], onConfirm: async (data) => {
      await api("/api/security/login-policy", { method: "PATCH", body: JSON.stringify({ maxRequestsPerMinute, lockMinutes, confirmPassword: data.confirmPassword }) }); closeAction(); toast(t("riskPolicySaved")); await loadLoginPolicy();
    } }, source);
  }

  async function copyOrDownload(content, filename) {
    try {
      await navigator.clipboard.writeText(content);
      toast(t("backupCopied"));
    } catch {
      downloadTextFile(filename, content, "application/json");
      toast(t("backupDownloaded"));
    }
  }

  function openEncryptedExport(source) {
    openAction({ title: t("encryptedBackupTitle"), description: t("encryptedBackupDetail"), fields: [{ name: "passphrase", label: t("backupPassphraseLabel"), type: "password", minlength: 10, autocomplete: "new-password" }, { name: "confirmPassword", label: t("currentPassword"), type: "password", autocomplete: "current-password" }], onConfirm: async (data) => {
      const result = await api("/api/export/encrypted", { method: "POST", body: JSON.stringify(data) }); closeAction(); await copyOrDownload(JSON.stringify(result.encrypted, null, 2), "2fauth-encrypted-backup.json");
    } }, source);
  }

  function openPlaintextExport(kind, source) {
    if (!PLAINTEXT_EXPORT_ENABLED) { toast(t("plaintextExportDisabled"), true); return; }
    openAction({ title: t("plaintextExportTitle"), description: t("plaintextExportWarning"), danger: true, fields: [{ name: "confirmPassword", label: t("currentPassword"), type: "password", autocomplete: "current-password" }], onConfirm: async (data) => {
      if (kind === "json") {
        const result = await api("/api/export", { method: "POST", body: JSON.stringify(data) }); closeAction(); await copyOrDownload(JSON.stringify(result, null, 2), "2fauth-plaintext-backup.json");
      } else {
        const response = await fetch("/api/export/otpauth", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
        if (!response.ok) { const detail = await response.json().catch(() => ({})); throw new Error(detail.error || "HTTP " + response.status); }
        const content = await response.text(); closeAction(); downloadTextFile("otpauth-export.txt", content, "text/plain"); toast(t("otpauthDownloaded"));
      }
    } }, source);
  }

  async function importData(kind) {
    let result;
    if (kind === "json") result = await api("/api/import", { method: "POST", body: JSON.stringify(JSON.parse(value("importText") || "{}")) });
    if (kind === "otpauth") result = await api("/api/import/otpauth", { method: "POST", body: JSON.stringify({ text: value("importText") }) });
    if (kind === "encrypted") result = await api("/api/import/encrypted", { method: "POST", body: JSON.stringify({ encrypted: JSON.parse(value("importText") || "{}"), passphrase: value("importPassphrase") }) });
    clearImportSensitiveFields();
    setMessage("importMsg", t("importDone") + (result && result.imported ? ": " + JSON.stringify(result.imported) : ""));
    toast(t("importDone"));
    await refreshAll();
  }

  function clearImportSensitiveFields() {
    byId("importText").value = "";
    byId("importPassphrase").value = "";
    byId("importFile").value = "";
  }

  async function loadImportFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    byId("importText").value = await file.text();
    setMessage("importMsg", t("fileLoaded"));
  }

  async function startScan() {
    try {
      scanStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      const video = byId("scanVideo");
      video.srcObject = scanStream;
      video.classList.remove("hidden");
      byId("stopScanButton").classList.remove("hidden");
      setMessage("scanMsg", t("scanStarted"));
      let detector = "BarcodeDetector" in window ? new BarcodeDetector({ formats: ["qr_code"] }) : null;
      if (!detector) { await ensureJsQrLoaded(); setMessage("scanMsg", t("scanFallback")); }
      scanTimer = setInterval(async () => {
        try {
          let raw = "";
          if (detector) {
            try {
              const results = await detector.detect(video);
              raw = results[0] ? String(results[0].rawValue || "") : "";
            } catch {}
            if (!raw) {
              await ensureJsQrLoaded();
              detector = null;
              setMessage("scanMsg", t("scanFallback"));
              raw = detectQrFromVideo(video);
            }
          } else raw = detectQrFromVideo(video);
          if (raw && applyOtpInput(raw, true)) { setMessage("scanMsg", t("qrDetected")); stopScan(); }
        } catch {}
      }, 600);
    } catch (error) {
      setMessage("scanMsg", t("scanDenied") + ": " + error.message, true);
    }
  }

  function stopScan() {
    if (scanTimer) clearInterval(scanTimer);
    scanTimer = null;
    if (scanStream) scanStream.getTracks().forEach((track) => track.stop());
    scanStream = null;
    const video = byId("scanVideo");
    video.srcObject = null;
    video.classList.add("hidden");
    byId("stopScanButton").classList.add("hidden");
  }

  function stopCodeTimer() {
    if (codeTimer) clearInterval(codeTimer);
    codeTimer = null;
  }

  function stopOtpActivity() {
    stopCodeTimer();
    if (codeRequestAbort) codeRequestAbort.abort();
  }

  function startOtpActivity() {
    if (!currentUser || document.hidden) return;
    if (!codeTimer) codeTimer = setInterval(updateCodeTimers, 1000);
    updateCodeTimers();
  }

  function bindOtpLifecycle() {
    if (otpLifecycleBound) return;
    otpLifecycleBound = true;
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopOtpActivity();
        stopScan();
      } else startOtpActivity();
    });
    window.addEventListener("pagehide", () => {
      stopOtpActivity();
      stopScan();
      clearBrowserTotpVault();
    });
    window.addEventListener("pageshow", () => startOtpActivity());
    window.addEventListener("beforeunload", clearBrowserTotpVault);
    byId("actionDialog").addEventListener("close", () => {
      vaultStepUpDialogOpen = false;
      actionHandler = null;
      byId("actionFields").replaceChildren();
    });
  }

  async function scanImage(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    let raw = "";
    try {
      if ("BarcodeDetector" in window) {
        const bitmap = await createImageBitmap(file);
        const results = await new BarcodeDetector({ formats: ["qr_code"] }).detect(bitmap);
        raw = results[0] ? String(results[0].rawValue || "") : "";
      }
      if (!raw) { await ensureJsQrLoaded(); raw = await detectQrFromImage(file); }
      if (!raw || !applyOtpInput(raw, true)) throw new Error(t("noQrFound"));
      setMessage("scanMsg", t("qrDetected"));
    } catch (error) { setMessage("scanMsg", error.message, true); }
  }

  async function ensureJsQrLoaded() {
    if (jsQrReady && typeof window.jsQR === "function") return;
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js";
      script.integrity = "sha384-b5Ya4Bq3qCyz39m2ISh+4DxjAIljdeFwK/BsXLuj9gugaNwAcj/ia15fxNZL9Nlx";
      script.crossOrigin = "anonymous";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    jsQrReady = typeof window.jsQR === "function";
  }

  function qrFromCanvas(canvas) {
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const data = context.getImageData(0, 0, canvas.width, canvas.height);
    const result = window.jsQR(data.data, canvas.width, canvas.height, { inversionAttempts: "attemptBoth" });
    return result && result.data ? String(result.data) : "";
  }

  function detectQrFromVideo(video) {
    if (!window.jsQR || !video.videoWidth || !video.videoHeight) return "";
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    return qrFromCanvas(canvas);
  }

  async function detectQrFromImage(file) {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width; canvas.height = bitmap.height;
    canvas.getContext("2d").drawImage(bitmap, 0, 0);
    return qrFromCanvas(canvas);
  }

  function downloadTextFile(filename, content, type) {
    const url = URL.createObjectURL(new Blob([content], { type: (type || "text/plain") + ";charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = filename; document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url);
  }

  function scheduleAutoLogout() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    if (!currentUser || !Number.isFinite(autoLogoutMinutes) || autoLogoutMinutes <= 0) return;
    inactivityTimer = setTimeout(async () => {
      clearBrowserTotpVault();
      try { await api("/api/logout", { method: "POST", body: "{}" }); } finally { sessionStorage.setItem("auth_notice", "logoutTimeout"); location.replace("/"); }
    }, autoLogoutMinutes * 60 * 1000);
  }

  function bindActivityEvents() {
    if (activityBound) return;
    activityBound = true;
    ["click", "keydown", "mousemove", "touchstart", "scroll"].forEach((name) => window.addEventListener(name, scheduleAutoLogout, { passive: true }));
    window.addEventListener("pagehide", closeSoonOnLeave);
    window.addEventListener("beforeunload", closeSoonOnLeave);
  }

  function closeSoonOnLeave() {
    if (!currentUser) return;
    try {
      const blob = new Blob(["{}"], { type: "application/json" });
      if (!navigator.sendBeacon("/api/session/close-soon", blob)) void fetch("/api/session/close-soon", { method: "POST", credentials: "same-origin", keepalive: true, headers: { "Content-Type": "application/json", "X-Session-Close": "web-beforeunload" }, body: "{}" }).catch(() => {});
    } catch {}
  }

  async function runAction(action, target, event) {
    const id = Number(target.dataset.id || 0);
    if (action === "bootstrap") return submitBootstrap();
    if (action === "login") return submitLogin();
    if (action === "logout") return logout();
    if (action === "navigate") return navigate(target.dataset.workspace);
    if (action === "toggle-sidebar") return setSidebarOpen(!document.body.classList.contains("sidebar-open"));
    if (action === "close-sidebar") return setSidebarOpen(false);
    if (action === "refresh-all") return refreshAll();
    if (action === "open-entry") return openEntry(0, target);
    if (action === "close-entry") return closeEntry();
    if (action === "save-entry") return saveEntry();
    if (action === "create-group") return createGroup();
    if (action === "delete-group") return confirmDeleteGroup(id, target);
    if (action === "toggle-entry-menu") {
      const menu = byId("entry-menu-" + id);
      document.querySelectorAll(".entry-menu").forEach((item) => { if (item !== menu) item.classList.add("hidden"); });
      menu.classList.toggle("hidden"); target.setAttribute("aria-expanded", String(!menu.classList.contains("hidden"))); return;
    }
    if (action === "edit-entry") return openEntry(id, target);
    if (action === "delete-entry") return confirmDeleteEntry(id, target);
    if (action === "toggle-entry") { await api("/api/entries/" + id, { method: "PATCH", body: JSON.stringify({ enabled: target.dataset.enabled === "1" }) }); return refreshAll(); }
    if (action === "copy-code") return copyCode(id);
    if (action === "gen-hotp") return generateHotp(id);
    if (action === "open-create-user") return openCreateUser(target);
    if (action === "switch-role") return openRoleChange(id, target.dataset.role, target);
    if (action === "reset-password") return openResetPassword(id, target);
    if (action === "delete-user") return openDeleteUser(id, target);
    if (action === "change-my-password") return openChangePassword(target);
    if (action === "save-login-policy") return openSaveLoginPolicy(target);
    if (action === "export-encrypted") return openEncryptedExport(target);
    if (action === "export-data") return openPlaintextExport("json", target);
    if (action === "export-otpauth") return openPlaintextExport("otpauth", target);
    if (action === "import-data") return importData("json");
    if (action === "import-otpauth") return importData("otpauth");
    if (action === "import-encrypted") return importData("encrypted");
    if (action === "start-scan") return startScan();
    if (action === "stop-scan") return stopScan();
    if (action === "cancel-dialog") return closeAction();
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) {
      if (!event.target.closest(".entry-menu-wrap")) document.querySelectorAll(".entry-menu").forEach((menu) => menu.classList.add("hidden"));
      return;
    }
    event.preventDefault();
    Promise.resolve(runAction(target.dataset.action, target, event)).catch((error) => {
      if (["bootstrap", "login"].includes(target.dataset.action)) setMessage(target.dataset.action === "bootstrap" ? "bsMsg" : "loginMsg", error.message, true);
      else toast(error.message || t("operationFailed"), true);
    });
  });

  const FORM_ACTIONS = {
    bootstrapForm: "bootstrap",
    loginForm: "login",
    entryForm: "save-entry",
    groupForm: "create-group",
    riskForm: "save-login-policy"
  };

  document.addEventListener("submit", (event) => {
    event.preventDefault();
    if (event.target.id === "actionForm" && actionHandler) {
      const button = byId("actionConfirm");
      button.disabled = true;
      Promise.resolve(actionHandler(actionValues())).catch((error) => toast(error.message, true)).finally(() => { button.disabled = false; });
      return;
    }
    const action = FORM_ACTIONS[event.target.id];
    if (!action) return;
    const target = event.submitter || event.target.querySelector('[data-action="' + action + '"]') || event.target;
    Promise.resolve(runAction(action, target, event)).catch((error) => {
      if (action === "bootstrap" || action === "login") setMessage(action === "bootstrap" ? "bsMsg" : "loginMsg", error.message, true);
      else toast(error.message || t("operationFailed"), true);
    });
  });

  document.addEventListener("change", (event) => {
    const target = event.target;
    if (target.id === "langSelect" || target.id === "authLangSelect") changeLanguage(target.value);
    else if (target.id === "autoLogoutSelect") { autoLogoutMinutes = Number(target.value || 0); localStorage.setItem("auto_logout_minutes", String(autoLogoutMinutes)); scheduleAutoLogout(); }
    else if (target.id === "groupFilter" || target.id === "statusFilter") renderEntries();
    else if (target.id === "importFile") void loadImportFile(event).catch((error) => setMessage("importMsg", error.message, true));
    else if (target.id === "qrImageFile") void scanImage(event);
    else if (target.dataset.action === "move-entry-group") void moveEntryGroup(Number(target.dataset.id), target.value).catch((error) => toast(error.message, true));
    else if (target.id === "eSecret" && target.value) applyOtpInput(target.value, true);
  });

  byId("search").addEventListener("input", renderEntries);
  byId("entries").addEventListener("dragstart", (event) => {
    const handle = event.target.closest(".drag-handle");
    if (!handle) return;
    draggedEntryCard = handle.closest(".entry-card");
    draggedEntryCard.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", draggedEntryCard.dataset.entryId);
  });
  byId("entries").addEventListener("dragover", (event) => {
    const target = event.target.closest(".entry-card");
    if (!draggedEntryCard || !target || target.dataset.enabled !== draggedEntryCard.dataset.enabled) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    moveDraggedCard(target, event.clientX, event.clientY);
  });
  byId("entries").addEventListener("drop", (event) => {
    if (!draggedEntryCard) return;
    event.preventDefault();
    draggedEntryCard.classList.remove("dragging");
    draggedEntryCard = null;
    persistRenderedEntryOrder();
  });
  byId("entries").addEventListener("dragend", () => {
    if (!draggedEntryCard) return;
    draggedEntryCard.classList.remove("dragging");
    draggedEntryCard = null;
    renderEntries();
  });
  byId("entries").addEventListener("pointerdown", (event) => {
    const handle = event.target.closest(".drag-handle");
    if (!handle || event.pointerType === "mouse") return;
    event.preventDefault();
    draggedEntryCard = handle.closest(".entry-card");
    draggedEntryCard.classList.add("dragging");
    handle.setPointerCapture(event.pointerId);
  });
  byId("entries").addEventListener("pointermove", (event) => {
    if (!draggedEntryCard || event.pointerType === "mouse") return;
    event.preventDefault();
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(".entry-card");
    moveDraggedCard(target, event.clientX, event.clientY);
  });
  byId("entries").addEventListener("pointerup", (event) => {
    if (!draggedEntryCard || event.pointerType === "mouse") return;
    draggedEntryCard.classList.remove("dragging");
    draggedEntryCard = null;
    persistRenderedEntryOrder();
  });
  byId("entries").addEventListener("pointercancel", (event) => {
    if (!draggedEntryCard || event.pointerType === "mouse") return;
    draggedEntryCard.classList.remove("dragging");
    draggedEntryCard = null;
    renderEntries();
  });
  byId("eSecret").addEventListener("paste", () => setTimeout(() => applyOtpInput(value("eSecret"), true), 0));
  byId("entryDialog").addEventListener("close", () => {
    stopScan();
    clearEntrySecretInputs();
  });
  const desktopNavigation = window.matchMedia("(min-width: 901px)");
  desktopNavigation.addEventListener("change", () => setSidebarOpen(false));
  document.addEventListener("keydown", (event) => {
    const handle = event.target.closest(".drag-handle");
    if (handle && ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].includes(event.key)) {
      const card = handle.closest(".entry-card");
      const cards = Array.from(byId("entries").querySelectorAll('.entry-card[data-enabled="' + card.dataset.enabled + '"]'));
      const currentIndex = cards.indexOf(card);
      const offset = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
      const sibling = cards[currentIndex + offset];
      if (sibling) {
        event.preventDefault();
        if (offset < 0) sibling.parentElement.insertBefore(card, sibling);
        else sibling.parentElement.insertBefore(sibling, card);
        handle.focus();
        persistRenderedEntryOrder();
      }
      return;
    }
    if (event.key === "Escape") {
      setSidebarOpen(false);
      document.querySelectorAll(".entry-menu").forEach((menu) => menu.classList.add("hidden"));
    }
  });

  setSidebarOpen(false);
  void init();
})();
`;
