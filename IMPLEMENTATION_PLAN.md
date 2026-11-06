# Implementation plan — The Art of Direction

## Intent
Build a differentiated, technically credible public showcase for the original Premium Frontend Director Agent Skill. This site is **not** a paid service and does **not** need authentication, a database, analytics or complex deployment.

## Stack and boundaries
- Next.js App Router + React + JavaScript; avoid TypeScript initially.
- Plain CSS with design tokens; no Tailwind/GSAP/Lenis/Three.js unless evidence supports the addition.
- Vector-first signature artwork.
- English UI, responsive-first, keyboard-first, SEO basics.
- Official skill stays at https://github.com/AVL05/premium-frontend-director.
- Repo stays independent. Changes to original skill require separate authorization.

## Phase 0 — Design contract
- [x] Define visual thesis, token system, content hierarchy and signature motif.
- [x] Create DESIGN.md and project architecture.
- [x] Write truthful README.
- [ ] Obtain first browser rendering and verify typography, framing and CTA readability.

## Phase 1 — Working vertical slice
- [x] Build hero, signature vector sculpture, navigation and first narrative chapters.
- [x] Include no-JS-friendly static content structure and reduced-motion rules.
- [ ] Execute real browser screenshots and short sequence demonstrating transition.
- [ ] Fix any reported G3/G5/G6/G11 issues.
- [ ] Obtain creative approval if direction diverges materially from this contract.

## Phase 2 — Content and craft
- [x] Add editorial Craft, Standard and Install chapters.
- [x] Include canonical install command.
- [ ] Add vetted real project cases with demos only when available; do not manufacture portfolio work.
- [ ] Make Open Graph artwork with documented ownership/licensing.
- [ ] Verify SEO/social metadata against a deployed canonical URL.

## Phase 3 — Validation
- [ ] Install dependencies.
- [ ] Run `npm run lint` and `npm run build`.
- [ ] Test mobile menu, anchors, copy affordance, focus order and reduced-motion.
- [ ] Capture 375, 768, 1440, 1920 screenshots with actual browser automation.
- [ ] Perform automated and manual accessibility checks.
- [ ] Record actual Lighthouse scores; compare to targets, don't pre-claim them.
- [ ] Run separate quality-gate report G1–G11 with PASS / FAIL / NOT RUN.
- [ ] Check all outbound URLs and installation docs.

## Phase 4 — Polish and deployment
- [ ] Address measured performance and visual problems.
- [ ] Replace temporary metadataBase GitHub URL with final deployed canonical domain; add sitemap/robots if needed.
- [ ] Add CI checks; validate green status.
- [ ] Deploy Vercel only after user approval; attach custom domain only with explicit instructions.
- [ ] Update README screenshots/credits when real imagery is available.

## Definition of done
No broken navigation; meaningful keyboard support; no content obscured by animation; confirmed high-quality appearance at four viewports; truthful audit results; coherent visual hierarchy; real assets licensed; build and lint pass. An aesthetic target of '€10k agency quality' is a creative aspiration, not a financial claim or test result.

## Claude Code workflow
Use `$premium-frontend-director`, profile Premium if installed otherwise Core, ambition Immersive. Read actual SKILL.md and references. Start by testing the current vertical slice against DESIGN.md, fix evidence-based defects, and only then iterate visual choreography. Do not add optional skills or deployments without authorization.
