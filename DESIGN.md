# DESIGN.md — The Continuous Take

## Product context
- **Product:** Premium Frontend Director Showcase.
- **Audience:** developers, designers, maintainers of coding agents, creative technologists.
- **Primary user goal:** feel what a directed frontend can be, understand the skill's workflow, install it.
- **Promise:** art direction, frontend engineering, visual proof.
- **Source of truth:** https://github.com/AVL05/premium-frontend-director
- **Skill profile:** Premium (companions present in `.claude/skills`: design-taste-frontend, impeccable, ui-ux-pro-max, web-design-guidelines).
- **Creative ambition:** **Immersive** (revised 2026-11-07). The owner asked for "only the after": a visually spectacular site that shows the motion the skill can direct. Mobile may be simplified (owner approval, 2026-11-07).
- **Language:** English for public-facing content and documentation.

## Creative brief (2026-11-07)
**Visual thesis:** one continuous take in which a single sculpture is directed from noise into form, and every chapter shows a different motion craft.

- **Business goal:** make the visitor want the skill by experiencing its output, not by reading a feature list. The site is the proof.
- **Signature moment:** "Noise to form". In the Process chapter the horizontal take pins, the sculpture dissolves into a cloud of points (Discover), the points converge into the interlocked rings (Direct), the rings resolve as a blueprint wireframe (Document), turn solid (Build) and finally rim-lit under cinema light (Prove). The object's state is literally the workflow phase.
- **Continuity motif:** the interlocked rings from the previous "Director's Frame" direction, now a real-time WebGL object. They appear in every chapter, so the page reads as one shot rather than a stack of sections.

### Three directions considered
1. **A. The Continuous Take (chosen).** One fixed WebGL stage behind semantic DOM. A single object travels and transforms through all chapters, driven by one scroll timeline. Coherent, cinematic, one renderer and one RAF.
2. **B. Motion Lab.** Separate full-screen specimens, each with its own canvas and technique. Shows range, but reads as a disjointed demo reel and multiplies GPU contexts.
3. **C. Type Tunnel.** The camera flies through 3D type. Spectacular but a known trope; mid-flight legibility suffers and mobile cost is high.

Recommendation: A, because the transformation of one object carries meaning (it is the workflow), and it keeps the technical budget to one canvas.

### Motion thesis (three motifs, no more)
1. **The object is directed:** position, material and form of the sculpture follow scroll (lights down, noise → form, rim light).
2. **Type is staged:** headings enter by line masks; the kinetic line responds to scroll velocity through Archivo's width axis.
3. **Matter responds:** the cursor tilts the object and pulls primary buttons (magnetic). Hover never carries meaning.

### Antipatterns
No ambient particle wallpaper (points exist only as a state of the object), no purple/blue glow gradients, no glassmorphism, no identical feature cards, no autoplay video, no hidden navigation, no fake results, invented statistics, awards or price claims, no 3D without a narrative job.

## User journey
| Section | Visitor question | Treatment | Motion craft shown |
| --- | --- | --- | --- |
| Opening | Is this different? | "The web deserves DIRECTION." with the 3D rings on the full stop | Intro choreography, char masks, cursor-reactive WebGL |
| Lights down | Can it feel cinematic? | Paper dims to cinema, letterbox closes, object rim-lit | Pinned scrubbed timeline, material transition |
| Process | What does the skill do? | Five phases in a horizontal take | Horizontal pin, noise → form morph |
| Craft | Is the detail real? | Kinetic line of the disciplines | Velocity-driven variable font, line reveals |
| Standard | Can I trust the process? | The 11 real gate names; G11 as a monument | Staggered reveal, scan line |
| Install | Can I use it? | Illustrative session, copy command, the object's last appearance | Typed terminal, magnetic button |

## Design tokens
### Palette
- Paper `#F3F0E9` — principal surface. Ink `#171817` — primary text. Muted `#686963`.
- Signal `#CD4F38` — expressive accent; not a background for small text.
- Cinema `#101315`, Matte `#070809` — night surfaces. Rim `#EE7A5F` — light on the object at night only.
- Separators `rgba(23,24,23,.2)` on paper, `rgba(243,240,233,.22)` on cinema.

### Typography
- Display: Archivo variable (wght 100–900, wdth 62–125) via `next/font`. Monument 900 / wdth 62 / -0.035em. Kicker 300 / wdth 125.
- Body: DM Sans variable via `next/font`. Mono: system `ui-monospace` stack for the session and command.
- Both OFL. Tracking floor -0.04em.

### Layout
- Fluid gutters `clamp(22px,4vw,76px)`. Review targets 375, 768, 1440, 1920.
- Process: horizontal pinned track on ≥ 900px wide with fine pointer or any desktop; below that, a vertical list (no pin).
- 44px minimum targets.

## Components and states
- Header: wordmark, jump links, **Motion on/off** toggle (persists per viewer, satisfies WCAG 2.2.2 pause for the idle rotation), mobile menu with Escape.
- Stage: fixed `<canvas aria-hidden>` behind content; never holds content or controls.
- Poster: the original SVG sculpture renders in the hero until WebGL is ready, and stays as the fallback.
- Install command: copy with announced status; on failure the command is selected.
- Session: illustrative transcript, labelled as such, typed when it enters the viewport; full text present in the DOM from the start.

## Motion and technology
- Libraries (owner-approved 2026-11-07): `three` (stage), `gsap` with ScrollTrigger and SplitText (choreography), `lenis` (smooth scroll). One ticker: Lenis and the WebGL render both run on `gsap.ticker`.
- Stage loads by dynamic import after first paint; the headline is the LCP element, not the canvas.
- Render budget: DPR capped at 1.75 desktop / 1.25 touch; rendering pauses when the tab is hidden; context loss returns to the SVG poster; everything is disposed on teardown.
- Easing: `expo.out` for entrances, `power2.inOut` for scene changes, immediate scrub on scroll (Lenis provides the smoothing). No linear UI motion.
- **Reduced motion / Motion off:** no Lenis, no pins, no WebGL idle, no typing; the vertical layout and the SVG poster give a complete static composition.
- **No WebGL:** same content, SVG poster, all chapters static.
- **No JS:** all content visible (initial hidden states are applied only under `.motion-ready`).

## Content integrity
- No claim of monetary value, awards or certification.
- The session transcript is marked "Illustrative session"; it describes workflow phases, never scores.
- Gate names are those published in the skill's `references/quality-gates.md`.

## Implementation notes
- All pinned/scrubbed timelines use `scrub: true`. Lenis already smooths the scroll; a lagged scrub (`scrub: 1`) kept writing the object's state after later chapters on fast anchor jumps.
- Lenis re-measures on every ScrollTrigger refresh (pin spacers change the page height); without it anchor jumps stopped at the old scroll limit.
- `DEFAULT_STATE` lives in `motion.js`, so the static import graph never contains `three`.
- Craft and Install anchor the object to their title's full stop and ride the scroll 1:1, so it never covers body copy.

## Validation (2026-11-07)
Evidence: `artifacts/before/hero-1440.jpg`, `artifacts/after/01–17-*.jpg` (local, not committed). Browser: the Claude desktop built-in browser (Chromium), dev server and `next start` production build.

| Gate | Status | Evidence |
| --- | --- | --- |
| G1 Design brief | PASS | Creative brief above: thesis, three directions, choice, motion thesis |
| G2 Design system | PASS | This file: tokens, components, motion, fallbacks |
| G3 Visual review | PASS | 375×812, 768×1024, 1440×900, 1920×1080 first viewports; every chapter at 1440 and 375 |
| G4 Interactions | PASS (partial) | Keyboard order and visible focus in header; nav anchor to a chapter after two pins lands exactly (y 13068, section top 0); motion toggle off/on; copy button failure path (clipboard refused in the pane) selects and announces. Copy success path NOT RUN |
| G5 Responsive | PASS | No horizontal overflow at 375 and 768 (scrollWidth ≤ innerWidth); header fixed at 768 |
| G6 Accessibility | PARTIAL | Semantic headings and lists, canvas `aria-hidden`, pause control (WCAG 2.2.2), motion-off path fully static. OS-level `prefers-reduced-motion` emulation NOT RUN (same code path as the toggle); screen-reader pass NOT RUN; no automated contrast scan |
| G7 Engineering | PASS | `npx eslint .` clean; `npm run build` succeeds (Next 16.4.5) |
| G8 Performance | PARTIAL | Production: CLS 0 (buffered observer), 11 JS files ≈ 322 KB compressed in total, of which `three` ≈ 132 KB loads lazily at ≈ 0.5 s, after first paint. LCP not captured (pane hidden). Lighthouse NOT RUN; FPS not measured |
| G9 Assets/content | PASS | Original geometry, OFL fonts, no fabricated claims; the session is labelled illustrative |
| G10 Regression | PASS | Install command, copy, external links (`noopener noreferrer`), skip link, mobile menu unchanged |
| G11 Visual ambition | PASS (internal, qualitative) | Before: static SVG sculpture on paper. After: real-time WebGL object, intro dissolve, iris + letterbox, horizontal take with the object morphing points → blueprint → solid → rim-lit, kinetic variable type, typed session. Structural, not cosmetic. Owner acceptance pending |

## Prototype gate
- Slice 1 (stage, opening frame, lights-down) was reviewed in the browser first; the half-dimmed grey frame it showed was replaced by the iris before the other chapters were rebuilt.
