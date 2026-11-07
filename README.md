# Premium Frontend Director — The Art of Direction

An independent, open-source showcase for [Premium Frontend Director](https://github.com/AVL05/premium-frontend-director).

**Creative thesis:** An editorial gallery that becomes a cinematic, interactive demonstration of deliberate frontend design. The website itself is the case study.

## Quick start

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Stack

Next.js App Router, React, JavaScript and plain CSS. The continuous take uses `three` (one WebGL stage, loaded lazily), `gsap` (ScrollTrigger and SplitText) and `lenis` (smooth scroll), all on a single ticker. Archivo and DM Sans are self-hosted at build time by `next/font`. Without WebGL, with Motion off or with `prefers-reduced-motion`, the same content renders as a static page with an SVG sculpture.

```bash
npm run lint
npm run build
```

## Principles

- Distinctive art direction before decorative effects.
- Responsive first-frame composition, accessible interactions, reduced-motion alternatives.
- No fictional metrics, customer testimonials, awards or price claims.
- Only claim quality gates that have actually been executed.
- Keep the published skill in its own repository; this site is its demonstration.

See [DESIGN.md](DESIGN.md), [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md), and [CLAUDE_CODE_PROMPT.md](CLAUDE_CODE_PROMPT.md).

## Install the skill

```bash
npx skills add AVL05/premium-frontend-director --skill premium-frontend-director -a claude-code
```

The CLI installer requires Node.js 22.20+; the skill itself is portable. Use project scope, and do not install a second native Claude plugin copy alongside the CLI version.

## Project status

Implemented and reviewed in a real browser; the gates that were run, and those that were not, are listed in the validation tables of [DESIGN.md](DESIGN.md). Lighthouse, frame-rate measurements and a screen-reader pass have not been run yet, so no scores are claimed.

Licensed under MIT. Independent project, not affiliated with Anthropic, OpenAI or Vercel.
