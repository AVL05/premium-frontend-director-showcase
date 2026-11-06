# DESIGN.md — The Art of Direction

## Product context
- **Product:** Premium Frontend Director Showcase.
- **Audience:** developers, designers, maintainers of coding agents, creative technologists.
- **Primary user goal:** experience the artistic direction possible with the skill, understand its methodology, and install it.
- **Promise:** art direction, frontend engineering, visual proof.
- **Source of truth:** https://github.com/AVL05/premium-frontend-director
- **Creative profile:** Premium (optional companions only if explicitly present/approved).
- **Creative ambition:** Immersive. Immersive does not require WebGL.
- **Language:** English for public-facing content and documentation.

## Creative thesis
**THE ART OF DIRECTION** is an editorial exhibition, not an ordinary SaaS landing page. Design the opening as a restrained gallery catalogue: warm paper, near-black editorial typography, small curatorial labels, asymmetry, and a single original abstract object. On the second act, the paper world yields to a cinematic dark field. The object returns as a continuity motif across both worlds.

### Chosen direction — Premium Hybrid
Minimalist product precision plus restrained cinematic scene changes.
- First frame: headline dominant on left, reflective interlocking ring sculpture on right. No card grids or gradient blobs.
- Signature transition: moving from warm paper to deep-black filmic space as the viewer scrolls; the same sculpture is reframed, tilted and lit differently, with continuity of message and form.
- Editorial sections use dramatic type scale and few very deliberate layout variations.
- Reduced-motion visitors get a complete static composition without any loss of content.

### Alternative directions considered
1. Pure monochrome Swiss editorial: high legibility but insufficient dramatic shift.
2. Fully spatial WebGL narrative: visually ambitious but potentially unnecessary complexity and device cost.
3. **Chosen:** cinematic 2D/SVG art direction with clear motion budget.

### Antipatterns
No animated particle fields, arbitrary glassmorphism, glowing purple or blue gradients, identical feature cards, auto-playing high-bitrate video, hidden navigation, fake results, invented statistics, award claims, or 3D just to show off.

## User journey
| Section | Visitor question | Treatment | CTA |
| --- | --- | --- | --- |
| Opening | Is this different? | Monolithic typography + original sculpture | Scroll |
| Philosophy | What is the approach? | Editorial typography | Continue |
| Experience | Can it feel cinematic? | Dark scene shift, transformed sculpture | Continue |
| Craft | What does the skill actually do? | Three typographic rows | Continue |
| Standard | Can I trust the process? | Named quality gates without fabricated scores | Read gates |
| Install | Can I use it? | Command with copy button | GitHub |

## Design tokens
### Palette
- Paper: `#F3F0E9` — principal surface.
- Ink: `#171817` — primary text.
- Muted: `#686963` — explanatory text.
- Signal: `#CD4F38` — expressive accent, not a default background for small text.
- Cinema: `#101315` — high-contrast night surface.
- Separator: `rgba(23,24,23,.2)`.

### Typography
- Headlines: Space Grotesk, 700, tightly tracked. Display scales responsive via `clamp`.
- Body: DM Sans 400–700. System fallbacks.
- Labels: uppercase, compact, letter-spaced, not relied on to convey essential meaning.
- Font licensing: Google Fonts (OFL); production optimization should move to `next/font` or self-hosted permitted formats if necessary.
- Never use all-caps micro-labels for long instructions.

### Grids, spacing, responsive
- Fluid gutters `clamp(22px,4vw,76px)`.
- Desktop 2-column hero and cinema; mobile single column with intentionally re-staged object.
- Responsive review targets: 375, 768, 1440, 1920 pixels.
- Maintain at least 44px meaningful click targets when practical; no horizontal overflow at supported widths.
- Sections feel like chapters: generous vertical space and confident scale.

### Borders, iconography and asset direction
- Minimal 1px rules, restrained strokes, no generic app dashboard cards.
- Original vector sculpture used in first and second scene. SVG is part of the product, not a decorative stock photo.
- Alt text for content imagery. The object uses an accessible role and description; decorative rings are hidden.
- Inline arrows are semantic or aria-hidden.

## Components and states
- Header: compact wordmark, jump links, mobile menu; visible focus and expanded semantics.
- Signature ring: adaptive CSS/SVG artwork; no heavy canvas.
- Reveal: IntersectionObserver progressive enhancement; must remain readable without JavaScript or reduced motion.
- Installation command: accessible copy affordance, success feedback; command always selectable.
- Links: visible hover/focus. External links use `rel="noopener noreferrer"`.
- States: mobile menu open/closed; copy success or graceful failure; missing clipboard permissions do not remove command.

## Motion direction
- Motion thesis: **form follows intention**. The object drifts almost imperceptibly; visual storytelling comes mainly from page composition and changing surface.
- Motifs: slow levitation, editorial text reveals, stark scene cut.
- Default drift ~9s, editorial reveal ~0.8s; transitions should never prevent interaction.
- No forced smooth-scroll library.
- `prefers-reduced-motion: reduce` disables all decorative animation and smooth scroll.
- Non-WebGL environment is the default supported experience.

## Content integrity
- No claim that the site cost €10,000. This describes the desired perceived production quality, not a verified valuation.
- No fictitious customer logos, testimonials, metrics or benchmark results.
- Distinguish the site from the skill product. Identify it as an independent open-source showcase.
- Direct to the canonical upstream repository and official install syntax.

## Validation plan and evidence
All results below are **NOT RUN** until a browser and build run actually produce artifacts.

- G1 Design brief — documented here.
- G2 Design system — documented here.
- G3 Real browser screenshots — 375x812, 768x1024, 1440x900, 1920x1080.
- G4 Interactions — navigation, mobile menu, copy button, external links, keyboard.
- G5 Responsive — no unintended scroll, wrapping and object framing.
- G6 Accessibility — semantic regions, visible focus, contrast, keyboard, reduced motion; manual review essential.
- G7 Engineering — lint, build and relevant tests.
- G8 Performance — measured Lighthouse mobile/desktop and asset transfer, not guessed.
- G9 Assets — verify fonts and all artwork licenses.
- G10 Regression — core navigation and copy functionality.
- G11 Visual Ambition — record real hero render and signature moment, compare against approved concept, assess qualitative integrity.

### Targets, not achieved results
- Lighthouse performance ≥ 90 mobile.
- Lighthouse accessibility ≥ 95 (automated score does not certify WCAG).
- LCP ≤ 2.5s at 75th percentile field where data becomes available; CLS ≤ 0.1.
- No mandatory video/WebGL, small JS surface.
- WCAG 2.2 AA design intent, with both automated and manual checks.

## Prototype gate
- Prototype slice: first viewport plus beginning of philosophy/cinema transition.
- Baseline: new site, no existing before screenshot. Document conceptual reference rather than fabricate matched before/after.
- Expected observable difference: paper gallery opening versus cinema chapter with motif continuity.
- Browser evidence: **NOT RUN**.
- G11: **NOT RUN** until inspected in real browsers.
- Before scaling: visually review mobile/desktop and failure modes. Correct composition rather than simply adding effects.
