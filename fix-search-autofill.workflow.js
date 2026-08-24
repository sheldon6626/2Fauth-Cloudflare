export const meta = {
  name: 'fix-search-autofill',
  description: 'Diagnose and minimally fix browser autofill interfering with the authenticated OTP search field.',
  phases: [{ title: 'Diagnose' }, { title: 'Fix and verify' }],
};

phase('Diagnose');
const diagnosis = await agent(`
You are the diagnostic reviewer for F:\\code\\2Fauth-Cloudflare.
Objective: determine why browser credential/autofill suggestions can populate or interfere with the authenticated OTP search box shown in the UI, and identify the smallest robust fix.
Read AGENTS.md and inspect the current dirty worktree plus relevant src UI code. Do not modify files.
Constraints: preserve API, authentication, CSP, bilingual UI, and all non-search form autofill behavior. Consider browser autocomplete heuristics, input name/id/type, and accidental persistence. Report exact files/functions, a concrete recommendation, and focused validation commands. State uncertainty rather than guessing.
`, { sandbox: 'read-only', label: 'search-autofill-diagnosis' });

phase('Fix and verify');
const implementation = await agent(`
You are the implementation owner for F:\\code\\2Fauth-Cloudflare.
Implement and verify the smallest safe fix for browser autofill interfering with the authenticated OTP search field. This is an execution task: you may edit only files required for this issue, preserve existing user changes, and do not change API/auth/security/data behavior. Read AGENTS.md first.

An independent diagnosis is below. Treat it as a lead, not authority; inspect the current code yourself and correct it if needed:
--- diagnosis ---
${diagnosis || 'No diagnosis was returned; investigate directly.'}
--- end diagnosis ---

Requirements: the OTP search field must not receive browser credential autofill or store its query as a credential/autofill value; use semantic/autocomplete attributes appropriate for a non-credential search control and avoid relying solely on autocomplete=off where browsers ignore it. Do not degrade the login, initialization, password-change, or sensitive confirmation fields. Add or update focused tests if the project has a suitable test structure. Run node --check src/worker.js and the relevant test command(s). Return a concise summary, changed files, and command results.
`, { sandbox: 'workspace-write', label: 'search-autofill-implementation', timeoutMs: 600000 });

return { diagnosis, implementation };
