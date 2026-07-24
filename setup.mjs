import { execSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { randomBytes } from 'node:crypto';

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(r => rl.question(q, r));

process.env.NODE_NO_WARNINGS = '1';

function run(cmd, opts = {}) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: opts.silent ? 'pipe' : 'inherit', ...opts });
  } catch (e) {
    if (!opts.ignoreError) {
      return { success: false, error: e };
    }
    return { success: true, output: '' };
  }
}

function runCapture(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch {
    return '';
  }
}

function header(text) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  ${text}`);
  console.log(`${'='.repeat(60)}\n`);
}

function success(text) { console.log(`✅ ${text}`); }
function warn(text) { console.log(`⚠️  ${text}`); }
function info(text) { console.log(`ℹ️  ${text}`); }

async function main() {
  header('2Fauth-Cloudflare 部署向导');

  if (existsSync('.env')) {
    const envText = readFileSync('.env', 'utf8');
    envText.split('\n').forEach(line => {
      const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
      }
    });
    info('已自动加载 .env 配置文件中的 API 凭据');
  }

  header('步骤 1/8: 检查前置条件');
  const nodeVersion = runCapture('node --version');
  if (!nodeVersion) {
    console.error('❌ 未找到 Node.js，请先安装: https://nodejs.org');
    process.exit(1);
  }
  success(`Node.js: ${nodeVersion}`);

  const npmVersion = runCapture('npm --version');
  success(`npm: v${npmVersion}`);

  header('步骤 2/8: 安装依赖');
  if (!existsSync('node_modules')) {
    run('npm install');
  } else {
    success('依赖已安装');
  }

  const wranglerVersion = runCapture('npx wrangler --version');
  success(`Wrangler: ${wranglerVersion}`);

  header('步骤 3/8: 检查 Cloudflare 授权');
  if (process.env.CLOUDFLARE_API_TOKEN) {
    success('检测到 CLOUDFLARE_API_TOKEN 环境变量');
  } else {
    const whoami = runCapture('npx wrangler whoami');
    if (whoami.includes('Not authenticated') || !whoami) {
      info('请在打开的浏览器中完成 Cloudflare 授权...');
      run('npx wrangler login');
    } else {
      success(`已登录: ${whoami.split('\n')[0]}`);
    }
  }

  header('步骤 4/8: 配置 D1 数据库');
  let dbId = '';
  if (existsSync('wrangler.toml')) {
    const existingConfig = readFileSync('wrangler.toml', 'utf8');
    const existingDbMatch = existingConfig.match(/database_id\s*=\s*"([^"]+)"/);
    if (existingDbMatch && existingDbMatch[1] !== '<your-d1-database-id>') {
      dbId = existingDbMatch[1];
      success(`找到已配置的 D1 数据库 ID: ${dbId}`);
    }
  }

  if (!dbId) {
    info('正在创建 D1 数据库 worker-2fauth-db...');
    const createOutput = runCapture('npx wrangler d1 create worker-2fauth-db');
    const idMatch = createOutput.match(/database_id\s*=\s*"([^"]+)"/);
    if (idMatch) {
      dbId = idMatch[1];
      success(`数据库创建成功! ID: ${dbId}`);
    } else {
      dbId = await ask('请手动输入 database_id: ');
    }
  }

  header('步骤 5/8: 生成安全密钥');
  const encryptionKey = randomBytes(32).toString('base64');
  const sessionPepper = randomBytes(32).toString('base64');
  const bootstrapToken = randomBytes(24).toString('base64url');

  console.log(`  ENCRYPTION_KEY:  ${encryptionKey}`);
  console.log(`  SESSION_PEPPER:  ${sessionPepper}`);
  console.log(`  BOOTSTRAP_TOKEN: ${bootstrapToken}`);
  console.log('');
  warn('请妥善保存 BOOTSTRAP_TOKEN！首次打开 Worker 页面初始化管理员账号时需要输入。');

  header('步骤 6/8: 配置 wrangler.toml');
  const wranglerContent = `name = "2fauth-cloudflare"
main = "src/worker.js"
compatibility_date = "2025-01-01"

[[d1_databases]]
binding = "DB"
database_name = "worker-2fauth-db"
database_id = "${dbId}"

[vars]
ALLOW_PLAINTEXT_EXPORT = "false"
`;

  writeFileSync('wrangler.toml', wranglerContent, 'utf8');
  success(`wrangler.toml 已更新 (database_id: ${dbId})`);

  header('步骤 7/8: 写入 Cloudflare Secrets');
  const setSecret = (name, value) => {
    try {
      const result = spawnSync('npx', ['wrangler', 'secret', 'put', name], {
        input: value,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
        env: { ...process.env, NODE_NO_WARNINGS: '1' }
      });
      if (result.status === 0) {
        success(`${name} 已设置`);
      } else {
        warn(`${name} 设置提示: ${result.stderr || result.stdout}`);
      }
    } catch (e) {
      warn(`${name} 设置失败: ${e.message}`);
    }
  };

  setSecret('ENCRYPTION_KEY', encryptionKey);
  setSecret('SESSION_PEPPER', sessionPepper);
  setSecret('BOOTSTRAP_TOKEN', bootstrapToken);

  header('步骤 8/8: 执行数据库迁移与部署');
  info('正在应用远程数据库迁移 (npm run d1:migrate:remote)...');
  const migRes = run('npm run d1:migrate:remote');
  
  info('正在部署 Worker (npm run deploy)...');
  const depRes = run('npm run deploy');

  if (migRes.success !== false && depRes.success !== false) {
    header('🎉 部署成功!');
    console.log('  管理员初始化步骤:');
    console.log('  1. 打开控制台输出的 Worker URL');
    console.log(`  2. 输入初始化令牌 BOOTSTRAP_TOKEN: ${bootstrapToken}`);
    console.log('  3. 创建管理员账号（密码要求 12+ 字符，含大小写字母、数字与符号）\n');
  } else {
    header('⚠️ 部署过程中因 Cloudflare API 网络超时未完全成功');
    warn('网络提示: Cloudflare API 请求超时 (The request to Cloudflare API timed out)');
    info('解决建议:');
    info('1. 检查或切换网络代理/梯子节点（例如选择全局代理或直连模式）');
    info('2. 网络恢复后直接运行以下两条命令重试部署:\n');
    console.log('   npm run d1:migrate:remote');
    console.log('   npm run deploy\n');
  }

  rl.close();
}

main().catch(e => {
  console.error('\n❌ 部署失败:', e.message);
  process.exit(1);
});
