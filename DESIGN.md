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
- First frame (revised 2026-11-06, "The Director's Frame"): a viewfinder on warm paper. The headline is one sentence set in two widths of one family: "THE WEB DESERVES" wide and light, "DIRECTION." condensed and black across the frame. The interlocked ring sculpture is threaded through the word and centred on its full stop: the red full stop is the sculpture's core. The ring passes behind "ON" and in front of the "O". No left/right split, no card grids, no gradient blobs.
- Signature transition ("lights down, letterbox in"): one pinned stage. The type tilts out upward faster than the object (depth), the paper dims to cinema, matte bars close to a ~2.39:1 frame, and the same sculpture, now rim-lit, settles behind "THE TEMPLATE." with a subtitle in the lower bar. Same object, new light.
- Editorial chapters (extended 2026-11-06 after approval) repeat one system: each title is one sentence in two widths (wide light first half, condensed black monument with the red full stop), no section numbers, no eyebrow labels. Philosophy: monument + offset lede. Craft: three discipline rows set as condensed monuments, no fake link arrows. Standard: the 11 real gate names from the skill as a catalogue index, G11 set as a monument. Install: the cinema world returns as a closing frame (matte top bar, frame marks, the rim-lit sculpture's third and last appearance behind "MATTER."); the footer sits in a matte band like end credits.
- Reduced-motion visitors get a complete static composition without any loss of content.

### Alternative directions considered
1. Pure monochrome Swiss editorial: high legibility but insufficient dramatic shift.
2. Fully spatial WebGL narrative: visually ambitious but potentially unnecessary complexity and device cost.
3. **Chosen:** cinematic 2D/SVG art direction with clear motion budget.

Prototype iteration (2026-11-06) compared three first-frame directions:
- A. Catalogue plate: a single object photographed on a gallery plate, lights fade out on scroll. Strong mood, but keeps the "headline left, object right" scaffold the audit flagged as generic.
- B. **Chosen — The Director's Frame:** viewfinder composition, type and object fused, transition by letterboxing. The motion has a cause (framing is what a director does) and needs only CSS.
- C. Typographic monolith: zoom through the counter of the "O" into the dark chapter. Spectacular but a known trope, and scaling huge text is costly and hurts legibility mid-transition.

### Antipatterns
No animated particle fields, arbitrary glassmorphism, glowing purple or blue gradients, identical feature cards, auto-playing high-bitrate video, hidden navigation, fake results, invented statistics, award claims, or 3D just to show off.

## User journey
| Section | Visitor question | Treatment | CTA |
| --- | --- | --- | --- |
| Opening | Is this different? | Director's frame: monument word threaded through the sculpture | Install / Enter the scene |
| Experience | Can it feel cinematic? | Pinned scene: lights down, letterbox, rim-lit sculpture | Continue |
| Philosophy | What is the approach? | Editorial typography | Continue |
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
- Display: Archivo variable (wght 100–900, wdth 62–125), self-hosted via `next/font`. Monument: 900 / wdth 62 / -0.035em. Kicker: 300 / wdth 125 / +0.01em. Later chapters: 800 at normal width. Tracking floor -0.04em (the earlier -0.09em made letters collide).
- Body: DM Sans variable via `next/font`. System fallbacks.
- Labels: only the opening running head ("The Art of Direction / Open-source agent skill"); uppercase, compact, letter-spaced, never essential meaning.
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
- Installation command: copy button with visible and announced (`role="status"`) feedback. On clipboard failure the command is auto-selected and the button reads "Command selected"; the command is always selectable.
- Links: visible hover/focus. External links use `rel="noopener noreferrer"`.
- States: mobile menu open/closed; copy success or graceful failure; missing clipboard permissions do not remove command.

## Motion direction
- Motion thesis: **form follows intention**. The object drifts almost imperceptibly; visual storytelling comes mainly from page composition and changing surface.
- Motifs: camera tilt (type leaves faster than the object), lights down, letterbox. No per-section entrance animations.
- The scroll scene is the one authored motion: CSS scroll-driven animations (`view-timeline`), composited properties only, no JS. Without `animation-timeline` support or with reduced motion the scene renders as two static chapters. The former 9s ambient drift was removed (one authored moment; avoids a WCAG 2.2.2 pause requirement). The per-heading IntersectionObserver reveal was removed for the same reason, which also drops its client JS.
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
- Browser evidence: captured 2026-11-06 with headless Edge via CDP (local `artifacts/before`, `artifacts/after`, not committed).
- G11: PASS (internal, qualitative) for the first viewport and transition at 375/768/1440/1920; direction approved by the user on 2026-11-06 and extended to all chapters.
- Before scaling: visually review mobile/desktop and failure modes. Correct composition rather than simply adding effects.
