// Content for the Setup and Install chapters. Everything here is taken from the canonical skill
// repository (README.md, docs/getting-started.md, docs/companion-profiles.md and
// skills/premium-frontend-director/references/*); nothing is invented. When an upstream
// command could not be verified, the entry links to the upstream documentation instead.

export const REPO = 'https://github.com/AVL05/premium-frontend-director';
export const SHOWCASE_REPO = 'https://github.com/AVL05/premium-frontend-director-showcase';
const blob = path => REPO + '/blob/main/' + path;
export const DOCS = {
  start: blob('docs/getting-started.md'),
  troubleshooting: blob('docs/getting-started.md#troubleshooting'),
  marketplace: blob('docs/getting-started.md#claude-code-plugin-marketplace'),
  profiles: blob('docs/companion-profiles.md'),
  ambition: blob('skills/premium-frontend-director/references/ambition-modes.md'),
  gates: blob('skills/premium-frontend-director/references/quality-gates.md'),
};

// Tool profiles decide which external tools the agent may consult. Core is the only required install.
export const PROFILES = [
  {
    id: 'core', name: 'Core', tag: 'Default · the only required install',
    summary: 'Premium Frontend Director on its own. Fully functional: not a trial and not a restricted edition.',
    fit: 'Any frontend. The fastest setup and the smallest footprint, with no companion skills.',
  },
  {
    id: 'premium', name: 'Premium', tag: 'Optional · four specialists',
    summary: 'Core plus UI UX Pro Max, Taste Skill, Impeccable and Web Design Guidelines, each installed separately.',
    fit: 'Portfolios, studios, distinctive brands and high-end launches. Skip what the project does not need.',
  },
  {
    id: 'studio', name: 'Studio', tag: 'Optional · chosen by need',
    summary: 'Premium plus Design System Patterns, and framework-specific guidance only where your stack calls for it.',
    fit: 'SaaS, multi-page products and large component systems. Not an install-everything bundle.',
  },
];

// Creative ambition decides the expected visual transformation. It is independent of the profile.
export const AMBITIONS = [
  {
    id: 'refined', name: 'Refined', art: 'refined',
    summary: 'Precise, restrained and coherent. Content-led refinement for maintenance, established brands and simpler interfaces.',
    proof: 'Coherent typography, spacing and semantics, with a responsive browser review.',
  },
  {
    id: 'expressive', name: 'Expressive', art: 'expressive',
    summary: 'A recognisable concept, deliberate storytelling and original composition.',
    proof: 'A meaningful structural difference and, for a redesign, a tested signature moment.',
  },
  {
    id: 'immersive', name: 'Immersive', art: 'immersive',
    summary: 'A cinematic or spatial transformation you can feel. 3D is optional: Immersive does not mean WebGL.',
    proof: 'A working first-viewport prototype, a signature interaction, before and after evidence and an accessible fallback.',
  },
];

export const AGENTS = [
  { id: 'claude-code', name: 'Claude Code', flag: 'claude-code', uipro: 'claude' },
  { id: 'codex', name: 'Codex', flag: 'codex', uipro: 'codex' },
];

// tier: the lowest profile that includes it (0 Core, 1 Premium, 2 Studio). Sources: companion-profiles.md, dependencies.md.
export const COMPANIONS = [
  { id: 'director', tier: 0, name: 'Premium Frontend Director', role: 'Required',
    does: 'The skill itself: creative brief, three directions, DESIGN.md, implementation, browser review and the quality gates.',
    setup: 'Installed with the Skills CLI, which needs Node.js 22.20+.' },
  { id: 'uipro', tier: 1, name: 'UI UX Pro Max', role: 'Optional',
    does: 'Research: searchable style, palette and typography data to inform the direction.',
    setup: 'Has its own CLI. Python 3 is needed for its search scripts.',
    url: 'https://github.com/nextlevelbuilder/ui-ux-pro-max-skill' },
  { id: 'taste', tier: 1, name: 'Taste Skill', role: 'Optional',
    does: 'Art direction: one primary aesthetic voice for the direction phase.',
    setup: 'Skills CLI. Check upstream for its current browser and Node requirements.',
    url: 'https://github.com/Leonxlnx/taste-skill' },
  { id: 'impeccable', tier: 1, name: 'Impeccable', role: 'Optional',
    does: 'Critique and polish: an independent review pass before sign-off.',
    setup: 'Has its own installer. Hooks are optional and need your approval.',
    url: 'https://impeccable.style/docs/' },
  { id: 'wdg', tier: 1, name: 'Web Design Guidelines', role: 'Optional',
    does: 'UI code and UX heuristics review. It is not a Lighthouse run and not a judgement of the art.',
    setup: 'Skills CLI.',
    url: 'https://github.com/vercel-labs/agent-skills' },
  { id: 'dsp', tier: 2, name: 'Design System Patterns', role: 'Optional',
    does: 'Design tokens and reusable component architecture for larger interfaces.',
    setup: 'Skills CLI.',
    url: 'https://github.com/wshobson/agents' },
  { id: 'react', tier: 2, name: 'Vercel React Best Practices', role: 'Only if relevant', situational: true,
    does: 'React and Next.js performance guidance. Skip it for any other stack.',
    setup: 'Skills CLI. Confirm the current skill name upstream first.',
    url: 'https://github.com/vercel-labs/agent-skills' },
  { id: 'responsive', tier: 2, name: 'Responsive Design', role: 'Only if relevant', situational: true,
    does: 'A specialist for when responsive layouts need one.',
    setup: 'Skills CLI.',
    url: 'https://github.com/wshobson/agents' },
  { id: 'a11y', tier: 2, name: 'Accessibility Compliance', role: 'Only if relevant', situational: true,
    does: 'A dedicated accessibility specialist, when the project warrants one.',
    setup: 'Skills CLI.',
    url: 'https://github.com/wshobson/agents' },
  { id: 'tailwind', tier: 2, name: 'Tailwind Design System', role: 'Only if relevant', situational: true,
    does: 'A Tailwind-specific component system. Only for projects that use Tailwind.',
    setup: 'Skills CLI.',
    url: 'https://github.com/wshobson/agents' },
];

export const profileRank = id => PROFILES.findIndex(p => p.id === id);

export const coreCommand = agent => `npx skills add AVL05/premium-frontend-director --skill premium-frontend-director -a ${agent.flag}`;
export const listCommand = 'npx skills list';
export const verifyPrompt = 'List the installed project skills. Confirm whether premium-frontend-director is registered and invocable in this session. Do not change any files.';

// Commands for the optional companions. `null` means no single verified command: the entry links upstream instead.
export function companionCommands(agent) {
  const add = (repo, skill) => `npx skills add ${repo} --skill ${skill} -a ${agent.flag}`;
  return {
    uipro: `npx ui-ux-pro-max-cli init --ai ${agent.uipro}`,
    taste: add('Leonxlnx/taste-skill', 'design-taste-frontend'),
    impeccable: 'npx impeccable install',
    wdg: add('vercel-labs/agent-skills', 'web-design-guidelines'),
    dsp: add('wshobson/agents', 'design-system-patterns'),
    react: 'npx skills add vercel-labs/agent-skills --list',
    responsive: add('wshobson/agents', 'responsive-design'),
    a11y: add('wshobson/agents', 'accessibility-compliance'),
    tailwind: add('wshobson/agents', 'tailwind-design-system'),
  };
}

export const verifyPremiumPrompt = 'Name the available skills and tell me which of them you can actually invoke in this session. Do not change any files.';

// The first prompt, built from the visitor's profile and ambition. The base text follows docs/getting-started.md;
// the Immersive sentence follows the README's Immersive example.
export function firstPrompt(profile, ambition) {
  const p = PROFILES.find(x => x.id === profile).name;
  const a = AMBITIONS.find(x => x.id === ambition).name;
  const lines = [
    `Use $premium-frontend-director with the ${p} profile and ${a} ambition.`,
    `Audit this project's existing UI and goals. Propose three different art directions, implement the best-fitting one in the current framework, document design.md, inspect mobile and desktop rendering when possible, and report actual PASS / FAIL / NOT RUN quality gates. Preserve existing behavior.`,
  ];
  if (ambition === 'refined') lines.push('Keep the existing structure and refine typography, spacing, semantics and responsive layouts.');
  if (ambition === 'immersive') lines.push('This must be a perceivable structural redesign, not a typography refresh. Build only the defining first-viewport prototype and its signature transition first, check G11 and an accessible fallback, and revise the prototype if G11 fails before expanding.');
  if (profile !== 'core') lines.push('Use only the companion skills that are actually installed, and report each as USED, NOT AVAILABLE or NOT NEEDED.');
  lines.push('Do not install anything else without permission.');
  return lines.join('\n');
}
