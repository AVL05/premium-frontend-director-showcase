# DESIGN.md — The Continuous Take

## Product context
- **Product:** Premium Frontend Director Showcase.
- **Audience:** developers, designers, maintainers of coding agents, creative technologists.
- **Primary user goal:** feel what a directed frontend can be, understand the skill's workflow and its configurations, install exactly what they need, verify it and write a first brief.
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
| Setup | What do I need, and which setup fits? | Two independent choices: tool profile (Core, Premium, Studio) and creative ambition (Refined, Expressive, Immersive); a ledger of what each tool contributes; the 3 × 3 of valid pairings | Radio cards, drawn-in ambition diagrams, the object leaves while the visitor decides |
| Install | How do I install and use it? | Closing frame, then a guide: agent, install command, verification, a first prompt for the chosen setup, optional companions, docs | Object returns on "matter.", magnetic copy button |

Journey: Experience (opening to Craft) → Understand (Process, Session, Standard) → Configure (Setup) → Install → Use. The header's "Get the skill" and the hero button jump straight to Install, so nobody has to sit through the animations; Install shows the chosen setup with a "Change" link back to Setup.

## Design tokens
### Palette
- Paper `#F3F0E9` — principal surface. Ink `#171817` — primary text. Muted `#5F605A` (4.4:1 on the `#E8E5DD` Standard surface was below AA for small text; now above 5:1 on both light surfaces).
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
- Header: wordmark, jump links, **Motion on/off** toggle (persists per viewer, satisfies WCAG 2.2.2 pause for the idle rotation), mobile menu with Escape. Fixed: transparent over the opening frame; past it, a matte bar (the letterbox) that slides away while scrolling down, returns on the first scroll up and always shows on keyboard focus.
- Landmarks: `header`, `main#content`, `footer` are siblings, so each keeps its landmark role.
- Stage: fixed `<canvas aria-hidden>` behind content; never holds content or controls.
- Poster: the original SVG sculpture renders in the hero until WebGL is ready, and stays as the fallback.
- Copy blocks (`CopyBlock`): a command or a prompt with a copy button, an announced status, a legacy-copy fallback and, if that fails too, the text left selected. Commands wrap at spaces only.
- Choices (`Setup.jsx`): native radio groups in a `fieldset`, so arrow keys, focus and form semantics come for free; the short label is the accessible name, the card text its description. Choices only change what is highlighted or generated: every profile, ambition and companion stays readable on the page, which is also what a static or no-JS render shows.
- Content for Setup and Install lives in `app/components/setup-data.js` and mirrors the canonical skill repository (README, `docs/getting-started.md`, `docs/companion-profiles.md`, `references/dependencies.md`, `references/ambition-modes.md`). Commands are generated per agent (Claude Code, Codex); where no single command is verified the entry links to the upstream docs.
- The closing frame has its own night layer (`.backdrop-close`), so a ScrollTrigger refresh cannot overwrite the opening one.
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

## Art-direction pass 2 (2026-11-07)
The owner asked to raise the artistic level. Three upgrades, each with a narrative job:

1. **The takes tell their phase literally.**
   - Direct: the noise condenses into three small re-composed copies labelled A/B/C (the three directions actually considered for this site: Motion lab, Continuous take, Type tunnel). A and C are struck and drift away; B grows into the frame. The take panel lists the same three directions.
   - Document: the wireframe gains a drawn blueprint: envelope circle, centre mark, Ø/H dimension lines and leaders labelled with the real geometry (R 1.00, tube 0.20, link offset 0.90).
   - Prove: four viewport frames at real aspect ratios (1920, 1440, 768, 375) draw in around the object.
2. **Studio material and light.** Wrap diffuse with warm shadows, clearcoat Fresnel, procedural softbox reflections, contact occlusion where the rings pass each other, a contact shadow, a soft warm halo under cinema light and a graded vignette. In the opening the nearest arcs of the rings pass **in front of** the headline (a second, clipped pass copied to a canvas above the type; desktop only).
3. **Varied staging.**
   - Portal (Prove → Craft): ring A turns flat to the lens, its hole is centred and grows past the frame; the paper world seen through it becomes the next chapter. Behind the camera the object is re-staged invisibly on the Craft title and dissolves in. This replaces the second iris, so the two night/day changes are no longer the same gesture.
   - Macro (Session): the object at 1.3× viewport height, cropped by the frame edge, with the session floating in front.

Polish: viewfinder cursor (four corners, difference blend, native cursor kept, fine pointers only); film grain re-seeded at ~7 fps (stops with Motion off / reduced motion). The film-leader countdown was considered and rejected as a cliché that adds nothing here.

Overlays (`StageOverlay.jsx`) are aria-hidden SVG positioned on the object each frame from `stage.metrics`; strokes and type are divided by the px-per-unit so they stay a constant screen size.

## Art-direction pass 3 (2026-11-07)
Self-critique after pass 2 named three weak spots; all three are addressed.

1. **Craft, lower half.** Each discipline row gains its own stroked drawing, drawn in by scroll: a frame with thirds and focal point (Art direction), a layout resolving into components (Frontend engineering), the four review viewports crossed by a scan line (Visual proof). On hover the heading's width axis opens (wdth 62 → 82) and turns signal red.
2. **Standard.** The list pins on desktop and becomes a **slate**: each gate in turn takes it (number, name and the evidence it asks for, from `quality-gates.md`), a signal bar tracks the active row and the blueprint turns behind the slate. The legend shows the only three outcomes (pass, fail, not run) without assigning any. The evidence text is now in every list item, so the static and mobile views carry the same content; the slate itself is an aria-hidden copy.
3. **Repetition.** Chapter titles no longer share one entrance: rise (Process, Install, bookending the opening), width morph from wide/light to condensed/black (Craft), typing (Session), a scanner wipe (Standard).

Not done: a gallery of real projects built with the skill. It needs real work and permission to show it; nothing is invented in its place.

- Mobile process forms are now scrubbed by scroll like the desktop take. The earlier time-based tweens kept writing after a fast scroll and left the Prove frames and the solid object over the gates (reproduced at 375 px).

## Implementation notes
- The intro animates its own keys (`intro`, `introMove`); the stage combines them with the scroll-driven `solid`/`zoom`/`twist`. Before this, a visitor who scrolled during the first ~3 s could have the intro overwrite a later shot (reproduced: Direct showed the solid object).
- The night halo uses normal blending: additive blending wrote alpha 1 across the whole quad of the transparent canvas and showed its rectangle.
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
| G11 (pass 3) | PASS (internal, qualitative) | `artifacts/after/30–35-*`: discipline drawings, slate at G7 and G11, Craft width morph, Standard wipe, gates at 375. Lint clean, build OK, production CLS 0, no console warnings or errors across a Motion off/on restart, no horizontal overflow at 375. Owner acceptance pending |
| G11 (pass 2) | PASS (internal, qualitative) | `artifacts/after/20–28-*`: threading over the headline, A/B/C directions, blueprint, viewport frames, portal sequence, macro session, mobile Direct. Re-checked after pass 2: lint clean, build OK, production CLS 0, 11 JS files ≈ 325 KB compressed (three ≈ 133 KB, lazy), no console errors, Motion off/on round trip restores everything, no horizontal overflow at 375. Owner acceptance pending |
| G11 Visual ambition | PASS (internal, qualitative) | Before: static SVG sculpture on paper. After: real-time WebGL object, intro dissolve, iris + letterbox, horizontal take with the object morphing points → blueprint → solid → rim-lit, kinetic variable type, typed session. Structural, not cosmetic. Owner acceptance pending |

## Pre-publication audit (2026-11-07)
Browser: the Claude desktop built-in browser (Chromium, software rendering, no GPU), production build (`next start`), 1440×900, 768×1024 and 375×812. Art direction untouched; only defects were fixed.

| Defect found | Fix |
| --- | --- |
| **Install CTA (and the End key, or a reload near the bottom) landed on an unreadable frame.** The Craft portal hides the night layer; jumping straight to the closing chapter never rendered the start of the tween that shows it again, so light text sat on the paper backdrop. | `autoAlpha: 1` added to the end values of the closing tween (`Experience.jsx`). Re-checked: the CTA lands at the chapter top with night visible and the command in view. |
| The header scrolled away with the first screen: navigation, the primary link and the Motion switch were unreachable afterwards. | Fixed header with a docked, auto-hiding bar (see Components). Re-checked at 1440 and 375: hidden on scroll down, shown on scroll up, mobile menu and jump links work. |
| The install command wrapped inside an argument (`-a` / `claude-code`). | Each argument is a no-wrap token; the selected and copied text is unchanged. |
| Muted text on the Standard surface was 4.4:1 (AA needs 4.5:1). | Token darkened (see Palette). Scan of every visible text node outside the cinema frame in the static page: no failures. |
| `header` and `footer` were inside `main`, so they lost their landmark roles. | Siblings of `main#content`. |
| Copy fallback only selected the text. | After selecting, it tries the legacy copy; otherwise the text stays selected and the failure is announced. |

Checks run: `npm run lint` clean, `npm run build` succeeds, no console errors, no horizontal overflow at 768 and 375, links verified (skill repository and quality-gates path return 200; the install command is identical to the one in the skill's README and the skill path `skills/premium-frontend-director` exists). Copy with a real click reports success in the pane.

Not run or not verifiable here: the install command itself (`npx skills add …` would install files); frame rate and Lighthouse (the pane renders WebGL in software, so timings would be meaningless); screen-reader pass; OS-level reduced-motion emulation.

Known and left as is: on narrow screens the blueprint wireframe passes behind the gate list while travelling to the closing frame (a few hundred pixels of scroll, text stays readable).

## Release pass: setup and installation (2026-11-07)
The showcase became the place to discover, configure and install the skill, without touching the cinematic direction.

- **Added:** the Setup chapter (profile, ambition, tool ledger, independence matrix) and a full Install guide (agent, command, verification, first prompt generated from the chosen setup, companions, docs). Process takes now state what each leaves behind. The hero says what the product is in one sentence.
- **Navigation:** Experience, Process, Gates, Setup and "Get the skill".
- **Honest claims:** the Prove take and the guide say browser checks need browser tooling and are otherwise reported NOT RUN; the guide says the skill does not guarantee a result and that a folder on disk is not proof of installation.
- **Metadata:** canonical URL, Open Graph and Twitter cards, a generated social image (`opengraph-image.jsx`, build time), `robots.txt` and `sitemap.xml`. The public address is set in `app/site.js`.
- **Fixed on the way:** without WebGL (or with the context lost) the opening showed the night sculpture over the paper one, now they swap with the iris. A ScrollTrigger refresh while in Process (resize, fonts) could reset the shared night layer and leave light text on paper; the closing frame now uses its own layer.

Verified against upstream (2026-11-07): `skills` CLI requires Node.js ≥ 22.20 and supports `--skill` and `-a`; `ui-ux-pro-max-cli` and `impeccable` exist on npm; the Studio skills exist in `wshobson/agents`; every external link answers 200. No installer was executed.

| Gate | Status | Evidence |
| --- | --- | --- |
| G3 Visual review | PASS | 375, 768, 1440 and 1920 px: Setup and Install at all four; the cinematic sequences at 375, 768 and 1440 (at 1920 the first frame only: the pane renders WebGL in software, about 0.5 fps there) |
| G4 Interactions | PASS | Profile, ambition and agent selection with the mouse and arrow keys (focus ring visible); commands and prompts change with the setup; copy with a real click on commands and prompts; details open by profile |
| G5 Responsive | PASS | No horizontal overflow at 375, 768, 1440 and 1920 |
| G6 Accessibility | PARTIAL | Landmarks, fieldsets and names verified in the DOM; keyboard path and focus rings checked; static-page contrast scan clean. OS reduced-motion emulation and a screen reader NOT RUN |
| G7 Engineering | PASS | `npm run lint` clean; `npm run build` succeeds (static `/`, `opengraph-image`, `robots.txt`, `sitemap.xml`) |
| G8 Performance | NOT RUN | No Lighthouse or frame-rate measurement is possible in the available browser (software WebGL) |
| G9 Assets and content | PASS | Claims taken from the canonical repository; no invented commands, versions or scores |
| G10 Regression | PASS | Install CTA, header, motion switch, anchors, no-WebGL fallback and Motion off still work |
| G11 Visual ambition | PASS (internal, qualitative) | Unchanged: the new chapters reuse the existing language (monument type, stroke drawings, night frame) |

## Prototype gate
- Slice 1 (stage, opening frame, lights-down) was reviewed in the browser first; the half-dimmed grey frame it showed was replaced by the iris before the other chapters were rebuilt.
