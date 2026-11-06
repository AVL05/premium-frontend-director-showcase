# Claude Code execution prompt

Use this from the root of `AVL05/premium-frontend-director-showcase`.

```text
You are the frontend art director and senior engineer for the Premium Frontend Director showcase.

Use $premium-frontend-director with creative ambition Immersive. Choose profile Premium only if all its optional companions are already installed and available; otherwise use Core without installing anything automatically.

Inspect this repository first: README.md, DESIGN.md, IMPLEMENTATION_PLAN.md, app/page.jsx, app/globals.css and the canonical upstream skill at https://github.com/AVL05/premium-frontend-director. Confirm the installed skill instructions and actual available tools. Do not hallucinate skills, scripts, tests or capabilities.

The site is called THE ART OF DIRECTION. Its visual thesis is a gallery-catalogue world of warm paper and near-black huge editorial typography, interrupted by a cinematic charcoal scene. An original sculptural ring motif connects the two states.

Important: the initial site already exists. DO NOT replace it with a generic SaaS template and DO NOT rebuild it blindly. First run it and review the existing implementation in an actual browser.

Your immediate scope:
1. Install exact dependencies only as required by this repo, using a lockfile. Review compatibility before changing versions.
2. Run lint and build, fix issues.
3. Capture screenshots at 375x812, 768x1024, 1440x900, and 1920x1080, and inspect actual framing, wrapping, contrast, imagery and hierarchy. Save evidence to local artifacts (do not commit huge binaries).
4. Test keyboard navigation, menu toggling, copy command, reduced-motion, no-JS readability, focus styling, browser console and network errors.
5. Compare the visual output against DESIGN.md. The goal is €10k-agency-level perceived craft, but never describe that as a measured commercial valuation.
6. Improve the first-screen art direction and the paper-to-cinema transition before increasing page count. G11 must be based on observed interaction and a reasoned assessment; mark NOT RUN without evidence.
7. Keep the site fast and accessible. Avoid WebGL, GSAP, Lenis and dependencies unless a concrete visual limitation cannot be solved by CSS/SVG.
8. Keep claims truthful. Do not fabricate customer projects, performance scores, awards, endorsements or screenshots.
9. Implement a small, accessible set of functional improvements where required, but preserve the approved editorial concept.
10. Report G1-G11 separately as PASS / FAIL / NOT RUN, with exact commands, screenshots and findings. Do not declare WCAG compliance solely from automated checks.

Stop after completing this vertical-slice audit and improvements. Summarize the visual changes and any unresolved issues; do not automatically deploy, create paid resources, or modify the upstream skill. Commit and push to this repository only if the repository's workflow permits and changes are clean, tested and described.
```

## Recommended operating style
- Model: Claude Code's strongest available model for creative direction, with higher reasoning effort for the concept/audit. Use a more economical model for mechanical fixes if necessary; do not trade away inspection quality.
- Do not repeatedly re-run full test suites after CSS-only edits; run targeted visual checks, then final consolidated lint/build/audit.
- Prefer clear screenshots, a short before/after summary and an issue list over subjective numerical design scores.
