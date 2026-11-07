'use client';

// Director of the continuous take. Owns smooth scroll, the GSAP choreography and the WebGL stage,
// all on one ticker. Everything it adds is reverted when motion is turned off, so the static page
// (semantic DOM + SVG poster) is always the baseline.
//
// The object's journey is a chain of shots. Each scrubbed transition starts exactly where the
// previous one ends, so scrolling backwards replays the take in reverse without jumps.
import { useEffect, useRef } from 'react';
import { motionAllowed, MOTION_EVENT, DEFAULT_STATE } from './motion';
import StageOverlay from './StageOverlay';

const root = () => document.documentElement;
// Resolves to the active direction's teardown (or null).
let chain = Promise.resolve(null);

const wide = () => window.innerWidth >= 900;
const mobile = () => window.innerWidth <= 760;

// Object shots that are not tied to a word, in viewport fractions (see stage.js).
const SHOTS = {
  process: () => (wide() ? { x: .73, y: .47, size: .6 } : { x: .5, y: .26, size: .36 }),
  // Macro: the object enormous and cropped by the frame edge, the session floating in front of it.
  session: () => (wide() ? { x: .97, y: .52, size: 1.3 } : { x: .92, y: .2, size: .5 }),
  standard: () => (wide() ? { x: .19, y: .76, size: .38 } : { x: .8, y: .17, size: .24 }),
};

// Object forms for each take of the workflow. Every key is set so any form can follow any other.
//  Discover: noise. Direct: three re-composed copies (A/B/C), two set aside, one takes the frame.
//  Document: blueprint with dimensions. Build: solid. Prove: framed at four viewport sizes.
const BASE_FORM = { solid: 1, points: 0, scatter: 0, wire: 0, zoom: 1, ghost: 0, choose: 1, anno: 0, frames: 0 };
const FORMS = {
  head: { ...BASE_FORM, ghost: 1, choose: 0 },
  Discover: { ...BASE_FORM, solid: 0, points: 1, scatter: 1, ghost: 1, choose: 0 },
  Direct: { ...BASE_FORM, solid: 0, points: 1 },
  Document: { ...BASE_FORM, solid: 0, points: .22, wire: 1, anno: 1 },
  Build: { ...BASE_FORM },
  Prove: { ...BASE_FORM, zoom: 1.12, frames: 1 },
};
const TAKES = ['Discover', 'Direct', 'Document', 'Build', 'Prove'];

// The object on a word's full stop. `relativeTo` measures against a pinned element (which sits at
// the top of the viewport while pinned); otherwise the result is in document coordinates (docY).
function stopAnchor(selector, ringEm, mobileRingEm, relativeTo) {
  const b = document.querySelector(selector);
  if (!b) return { x: .7, y: .5, docY: 0, size: .5 };
  const word = b.closest('.t-word');
  const r = b.getBoundingClientRect(), wr = word.getBoundingClientRect();
  const fs = parseFloat(getComputedStyle(word).fontSize);
  const m = mobile();
  const cx = m ? wr.left + wr.width / 2 : r.right - .094 * fs;
  const cy = m ? wr.bottom - .36 * fs : r.bottom - .152 * fs;
  const top = relativeTo ? document.querySelector(relativeTo).getBoundingClientRect().top : 0;
  return {
    x: cx / window.innerWidth,
    y: (cy - top) / window.innerHeight,
    docY: cy + window.scrollY,
    size: ((m ? mobileRingEm : ringEm) * fs) / window.innerHeight,
  };
}

// DOM layers that follow the object: the annotation overlay and the paper seen through the portal.
function overlayPainter(state) {
  const overlay = document.querySelector('.overlay');
  const day = document.querySelector('.backdrop-day');
  let shown = false, dayShown = false;
  const css = (el, k, v) => el.style.setProperty(k, v);
  return metrics => {
    const s = state;
    const dirs = s.points * s.ghost * Math.max(0, 1 - s.scatter * 1.6);
    const on = s.opacity > .01 && (s.anno > .001 || s.frames > .001 || dirs > .01);
    if (overlay && on) {
      const d = metrics.diameter;
      overlay.style.transform = `translate3d(${metrics.cx - d}px,${metrics.cy - d}px,0)`;
      overlay.style.width = overlay.style.height = 2 * d + 'px';
      css(overlay, '--u', (d / 100).toFixed(4));
      css(overlay, '--anno', s.anno.toFixed(3));
      css(overlay, '--frames', s.frames.toFixed(3));
      css(overlay, '--dirs', dirs.toFixed(3));
      css(overlay, '--choose', s.choose.toFixed(3));
    }
    if (overlay && on !== shown) { overlay.style.visibility = on ? 'visible' : 'hidden'; shown = on; }
    const dayOn = s.portal > .001;
    if (day && dayOn) {
      css(day, '--day', (metrics.hole * Math.sqrt(s.portal)).toFixed(1) + 'px');
      css(day, '--dx', s.x * 100 + '%');
      css(day, '--dy', s.y * 100 + '%');
    }
    if (day && dayOn !== dayShown) { day.style.visibility = dayOn ? 'visible' : 'hidden'; dayShown = dayOn; }
  };
}

async function direct({ canvas, frontCanvas, state }) {
  const [{ gsap }, { ScrollTrigger }, { SplitText }, { default: Lenis }] = await Promise.all([
    import('gsap'), import('gsap/ScrollTrigger'), import('gsap/SplitText'), import('lenis'),
  ]);
  gsap.registerPlugin(ScrollTrigger, SplitText);
  ScrollTrigger.config({ ignoreMobileResize: true });
  const html = root();
  const touch = window.matchMedia('(pointer: coarse)').matches;
  const cleanups = [];

  // ---- Smooth scroll on the shared ticker ----
  const lenis = new Lenis({ lerp: touch ? .14 : .095, anchors: true, autoRaf: false });
  let stage = null;
  const kinetic = document.querySelector('.kinetic');
  const kineticRows = gsap.utils.toArray('.kinetic-row');
  const wTo = gsap.quickTo(kinetic ? kinetic : {}, '--w', { duration: .6, ease: 'power3.out' });
  const skewTo = kineticRows.length ? gsap.quickTo(kineticRows, 'skewX', { duration: .6, ease: 'power3.out' }) : () => {};
  lenis.on('scroll', e => {
    ScrollTrigger.update();
    stage?.setVelocity(e.velocity);
    const v = e.velocity || 0;
    if (kinetic) { wTo(100 + Math.min(Math.abs(v) * 1.1, 25)); skewTo(gsap.utils.clamp(-9, 9, -v * .3)); }
  });
  const paint = overlayPainter(state);
  cleanups.push(() => document.querySelectorAll('.overlay, .backdrop-day').forEach(el => { el.style.visibility = 'hidden'; }));
  const tick = (time, dt) => {
    lenis.raf(time * 1000);
    if (!stage) return;
    stage.render(time, Math.min(dt / 1000, .05));
    paint(stage.metrics);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  cleanups.push(() => { gsap.ticker.remove(tick); lenis.destroy(); });

  // ---- Stage (optional layer) ----
  try {
    const { createStage, webglAvailable } = await import('./stage');
    if (webglAvailable()) {
      stage = createStage(canvas, {
        touch, state, frontCanvas,
        onContextLost: () => { html.classList.remove('stage-live'); html.classList.add('no-webgl'); stage = null; },
      });
      html.classList.add('stage-live');
      const onResize = () => stage?.resize();
      window.addEventListener('resize', onResize);
      cleanups.push(() => { window.removeEventListener('resize', onResize); stage?.dispose(); stage = null; });
    } else html.classList.add('no-webgl');
  } catch { html.classList.add('no-webgl'); }
  cleanups.push(() => html.classList.remove('stage-live', 'no-webgl'));

  html.classList.add('motion-ready');
  cleanups.push(() => html.classList.remove('motion-ready'));

  const splits = [];
  const split = (target, vars) => { const s = SplitText.create(target, vars); splits.push(s); return s; };
  const scrub = (trigger, vars) => ({ trigger, scrub: true, invalidateOnRefresh: true, ...vars });
  // Function-based so every shot is re-measured on refresh (resize, fonts).
  const at = shot => ({ x: () => SHOTS[shot]().x, y: () => SHOTS[shot]().y, size: () => SHOTS[shot]().size });
  const fullIris = () => Math.hypot(window.innerWidth, window.innerHeight) + 'px';

  const ctx = gsap.context(() => {
    const hero = () => stopAnchor('.hero-title b', 2.7, 3.7, '.scene');
    const cinema = () => stopAnchor('.cinema-title b', 3.3, 5.4, '.scene');
    const pos = s => ({ x: s.x, y: s.y, size: s.size });

    // ======== 1. Opening choreography ========
    const heroSplit = split('.hero-title .t-text', { type: 'chars', mask: 'chars' });
    const kicker = split('.hero-title .t-kicker', { type: 'words', mask: 'words' });
    // front: the nearest arcs of the rings pass in front of the headline (the threading pass).
    // The intro animates its own keys (intro, introMove), never the scroll-driven ones, so a visitor
    // who scrolls during the first seconds cannot have a later shot overwritten by the intro.
    Object.assign(state, pos(hero()), { intro: 0, introMove: 0, front: 1 });
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from(heroSplit.chars, { yPercent: 112, duration: 1.5, stagger: .045 }, .15)
      .from(kicker.words, { yPercent: 105, duration: 1.2, stagger: .06 }, .3)
      .to(state, { intro: 1, duration: 2.4, ease: 'power2.inOut' }, .35)
      .to(state, { introMove: 1, duration: 2.8 }, .35)
      .from('.site-header > *, .hero-meta > *', { y: -16, autoAlpha: 0, duration: 1, stagger: .06 }, .9)
      .from('.hero-base > *', { y: 26, autoAlpha: 0, duration: 1.1, stagger: .08 }, 1.05)
      .from('.frame-marks--paper i', { scale: 0, autoAlpha: 0, duration: .9, stagger: .05, ease: 'power3.out' }, .6);

    // ======== 2. Lights down: one pinned stage, paper -> cinema ========
    const cinemaSplit = split('.cinema-title .t-text', { type: 'chars', mask: 'chars' });
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: '.scene', start: 'top top', end: '+=170%', scrub: true, pin: true, invalidateOnRefresh: true },
    })
      .to('.hero-meta, .hero-base, .frame-marks--paper', { autoAlpha: 0, y: -50, duration: .2 }, .02)
      .fromTo(state, { front: 1 }, { front: 0, duration: .1 }, .04)
      .to('.hero-title .t-kicker', { yPercent: -160, autoAlpha: 0, duration: .26, ease: 'power2.in' }, .05)
      .fromTo(heroSplit.chars, { yPercent: 0 }, { yPercent: -112, duration: .26, stagger: .012, ease: 'power2.in', immediateRender: false }, .07)
      // Iris: night opens as a circle from the full stop, so there is never a half-dimmed grey frame.
      .fromTo('.backdrop-night', { autoAlpha: 1, '--iris': '0px', '--ix': () => hero().x * 100 + '%', '--iy': () => hero().y * 100 + '%' },
        { '--iris': fullIris, duration: .36, ease: 'power2.in' }, .1)
      .fromTo(state, { night: 0, shadow: 1 }, { night: 1, shadow: 0, duration: .22 }, .17)
      .fromTo(state, { x: () => hero().x, y: () => hero().y, size: () => hero().size, rot: 0 },
        { x: () => cinema().x, y: () => cinema().y, size: () => cinema().size, rot: 1.25, duration: .62, ease: 'power2.inOut' }, .08)
      .fromTo('.cinema .bar', { scaleY: 0 }, { scaleY: 1, duration: .34, ease: 'power3.out' }, .22)
      .fromTo('.frame-marks--night', { autoAlpha: 0 }, { autoAlpha: 1, duration: .16 }, .46)
      .fromTo('.cinema-title .t-kicker', { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: .22, ease: 'power3.out' }, .46)
      .from(cinemaSplit.chars, { yPercent: 112, duration: .26, stagger: .014, ease: 'power3.out' }, .5)
      .fromTo('.cinema-subtitle', { autoAlpha: 0 }, { autoAlpha: 1, duration: .16 }, .62)
      .to({}, { duration: .2 });

    // ======== 3. Into the process: cinema anchor -> process shot ========
    gsap.fromTo(state,
      { x: () => cinema().x, y: () => cinema().y, size: () => cinema().size, rot: 1.25 },
      { ...at('process'), rot: 2.1, ease: 'power2.inOut', immediateRender: false,
        scrollTrigger: scrub('.process', { start: 'top bottom', end: 'top top' }) });

    // Monument headings outside the scene enter by masked characters.
    gsap.utils.toArray('#content .chapter-title').forEach(title => {
      const chars = split(title.querySelector('.t-text'), { type: 'chars', mask: 'chars' }).chars;
      const words = split(title.querySelector('.t-kicker'), { type: 'words', mask: 'words' }).words;
      gsap.timeline({ scrollTrigger: { trigger: title, start: 'top 82%', once: true } })
        .from(words, { yPercent: 105, duration: 1, stagger: .05, ease: 'expo.out' }, 0)
        .from(chars, { yPercent: 112, duration: 1.2, stagger: .03, ease: 'expo.out' }, .08);
    });

    const mm = gsap.matchMedia();
    cleanups.push(() => mm.revert());

    // ======== 4a. Process, desktop: the horizontal take ========
    mm.add('(min-width: 900px)', () => {
      const track = document.querySelector('.process-track');
      const distance = () => track.scrollWidth - window.innerWidth;
      const tc = document.querySelector('.hud-tc');
      const fmt = p => {
        const f = Math.round(p * 20 * 24), s = Math.floor(f / 24), fr = f % 24;
        return `00:00:${String(s).padStart(2, '0')}:${String(fr).padStart(2, '0')}`;
      };
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '.process', start: 'top top', end: () => '+=' + distance(), scrub: true, pin: true, invalidateOnRefresh: true,
          onUpdate: self => { if (tc) tc.textContent = fmt(self.progress); },
        },
      });
      tl.to(track, { x: () => -distance(), duration: 5 }, 0)
        .fromTo('.hud-bar i', { scaleX: 0 }, { scaleX: 1, duration: 5 }, 0);
      // Take i sits centred at t = i + 1 (t = 0 is the head panel).
      const io = { ease: 'power2.inOut' };
      tl.fromTo(state, FORMS.head, { ...FORMS.Discover, duration: .75, ...io }, .3)
        // Direct: three directions condense out of the noise, two are set aside, one takes the frame.
        .to(state, { scatter: 0, duration: .55, ...io }, 1.3)
        // The row of three needs more room: the shot slides right while it is on screen.
        .fromTo(state, { x: () => SHOTS.process().x }, { x: () => SHOTS.process().x + .045, duration: .5, ...io, immediateRender: false }, 1.2)
        .fromTo(state, { x: () => SHOTS.process().x + .045 }, { x: () => SHOTS.process().x, duration: .45, ...io, immediateRender: false }, 2.25)
        .to(state, { choose: 1, duration: .3, ...io }, 1.9)
        .to(state, { ghost: 0, duration: .4, ease: 'power3.inOut' }, 2.2)
        // Document: the blueprint, then its dimensions are drawn.
        .to(state, { solid: 0, points: .22, wire: 1, duration: .5, ...io }, 2.55)
        .to(state, { anno: 1, duration: .45, ...io }, 2.75)
        .to(state, { anno: 0, duration: .3, ...io }, 3.3)
        .to(state, { solid: 1, points: 0, wire: 0, duration: .7, ...io }, 3.35)
        // Prove: four viewport frames close in around it.
        .to(state, { zoom: 1.12, frames: 1, duration: .6, ...io }, 4.3)
        .fromTo(state, { rot: 2.1 }, { rot: 4.6, duration: 5 }, 0);

      gsap.utils.toArray('.take:not(.take--head)').forEach(take => {
        const chars = split(take.querySelector('.take-name'), { type: 'chars', mask: 'chars' }).chars;
        const reveal = gsap.timeline({ scrollTrigger: { trigger: take, containerAnimation: tl, start: 'left 62%', toggleActions: 'play none none reverse' } })
          .from(take.querySelector('.take-slate'), { autoAlpha: 0, x: 40, duration: .8, ease: 'expo.out' }, 0)
          .from(chars, { yPercent: 112, duration: 1.1, stagger: .035, ease: 'expo.out' }, .05)
          .from(take.querySelector('.take-copy'), { autoAlpha: 0, y: 24, duration: 1, ease: 'expo.out' }, .3);
        const meta = take.querySelectorAll('.take-meta li');
        if (meta.length) reveal.from(meta, { autoAlpha: 0, y: 16, duration: .8, stagger: .08, ease: 'expo.out' }, .45);
        // Parallax inside the take: the name travels slightly slower than its panel.
        gsap.fromTo(take.querySelector('.take-name'), { xPercent: 18 }, {
          xPercent: -18, ease: 'none',
          scrollTrigger: { trigger: take, containerAnimation: tl, start: 'left right', end: 'right left', scrub: true },
        });
      });
    });

    // ======== 4b. Process, narrow: each take sets the object's form as it arrives ========
    mm.add('(max-width: 899px)', () => {
      let current = null;
      const go = form => {
        current?.kill();
        const io = { ease: 'power2.inOut' };
        current = form === 'Direct'
          ? gsap.timeline()
            .to(state, { ...FORMS.Discover, scatter: 0, duration: 1.1, ...io })
            .to(state, { choose: 1, duration: .6, ...io })
            .to(state, { ghost: 0, duration: .8, ease: 'power3.inOut' })
          : gsap.to(state, { ...FORMS[form], duration: 1.4, ...io });
      };
      cleanups.push(() => current?.kill());
      gsap.utils.toArray('.take:not(.take--head)').forEach((take, i) => {
        ScrollTrigger.create({
          trigger: take, start: 'top 55%', end: 'bottom 55%',
          onEnter: () => go(TAKES[i]), onEnterBack: () => go(TAKES[i]),
          onLeaveBack: () => { if (i === 0) go('head'); },
        });
        gsap.from(take.children, { autoAlpha: 0, y: 30, duration: 1, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: take, start: 'top 70%', once: true } });
      });
    });

    // ======== 5. The portal: the camera passes through ring A's hole into the paper world ========
    // The ring turns flat to the lens, the hole is centred and grows past the frame; the paper
    // seen through it becomes the next chapter. Behind the camera the object is re-staged,
    // invisible, on the Craft title's full stop and materialises there.
    // In Craft the object rides the title and leaves the frame with it, so it never covers the
    // discipline copy; it re-enters for the session.
    const ih = () => window.innerHeight;
    const docTop = sel => document.querySelector(sel).getBoundingClientRect().top + window.scrollY;
    const craftStop = () => stopAnchor('#craft-title b', 2.2, 3.2);
    const craftLand = () => docTop('#craft') - ih() * .15;
    const craftLeave = () => Math.max(craftLand() + 1, docTop('#session') - ih());
    const craftAt = scroll => () => (craftStop().docY - scroll()) / ih();
    const off = { immediateRender: false };
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: scrub('#craft', { start: 'top bottom', end: () => craftLand() }) })
      .fromTo(state, { ...at('process'), face: 0, frames: 1 }, { x: .5, y: .5, face: 1, frames: 0, duration: .26, ease: 'power2.inOut', ...off }, 0)
      .fromTo('.process-hud', { autoAlpha: 1 }, { autoAlpha: 0, duration: .2, ...off }, 0)
      .fromTo(state, { zoom: 1.12 }, { zoom: 13, duration: .5, ease: 'power3.in', ...off }, .22)
      .fromTo(state, { portal: 0 }, { portal: 1, duration: .3, ease: 'power1.in', ...off }, .3)
      .fromTo(state, { opacity: 1 }, { opacity: 0, duration: .05, ...off }, .68)
      .set('.backdrop-night', { autoAlpha: 0 }, .74)
      .fromTo(state,
        { night: 1, portal: 1, face: 1, zoom: 13, x: .5, y: .5, size: () => SHOTS.process().size, solid: 1 },
        { night: 0, portal: 0, face: 0, zoom: 1, x: () => craftStop().x, y: craftAt(craftLand), size: () => craftStop().size, solid: 0, duration: .001, ...off }, .75)
      .fromTo(state, { opacity: 0, solid: 0 }, { opacity: 1, solid: 1, duration: .25, ...off }, .752);
    gsap.fromTo(state, { y: craftAt(craftLand) }, {
      y: craftAt(craftLeave), ease: 'none', immediateRender: false,
      scrollTrigger: { start: craftLand, end: craftLeave, scrub: true, invalidateOnRefresh: true },
    });

    // ======== 6. Craft: kinetic type, object turning with the page ========
    gsap.fromTo('.kinetic-row--0 .kinetic-track', { xPercent: 0 }, { xPercent: -30, ease: 'none', scrollTrigger: scrub('.kinetic', { start: 'top bottom', end: 'bottom top' }) });
    gsap.fromTo('.kinetic-row--1 .kinetic-track', { xPercent: -30 }, { xPercent: 0, ease: 'none', scrollTrigger: scrub('.kinetic', { start: 'top bottom', end: 'bottom top' }) });
    gsap.fromTo(state, { twist: 0 }, { twist: Math.PI, ease: 'none', immediateRender: false, scrollTrigger: scrub('#craft', { start: 'top top', end: 'bottom top' }) });
    gsap.utils.toArray('.disciplines li').forEach(li => {
      const lines = split(li.querySelector('h3'), { type: 'lines', mask: 'lines' }).lines;
      gsap.timeline({ scrollTrigger: { trigger: li, start: 'top 85%', once: true } })
        .from(lines, { yPercent: 105, duration: 1.1, ease: 'expo.out' }, 0)
        .from(li.querySelector('p'), { autoAlpha: 0, y: 20, duration: 1, ease: 'expo.out' }, .15);
    });

    // ======== 7. Session: the prompt types itself, the phases follow ========
    gsap.fromTo(state, { x: () => craftStop().x, y: craftAt(craftLeave), size: () => craftStop().size }, {
      ...at('session'), ease: 'power2.inOut', immediateRender: false,
      scrollTrigger: scrub('#session', { start: 'top bottom', end: 'top 25%' }),
    });
    const typed = split('.session-typed', { type: 'words,chars' });
    gsap.timeline({ scrollTrigger: { trigger: '.session', start: 'top 70%', once: true } })
      .from('.session', { y: 60, autoAlpha: 0, duration: 1.2, ease: 'expo.out' }, 0)
      .from(typed.chars, { autoAlpha: 0, duration: .01, stagger: .011, ease: 'none' }, .5)
      .from('.session-log li', { autoAlpha: 0, x: -18, duration: .6, stagger: .32, ease: 'expo.out' }, '>+.2');

    // ======== 8. Standard: the object becomes its own blueprint ========
    gsap.fromTo(state, { ...at('session'), solid: 1, wire: 0 }, {
      ...at('standard'), solid: 0, wire: 1, ease: 'power2.inOut', immediateRender: false,
      scrollTrigger: scrub('#standard', { start: 'top bottom', end: 'top 20%' }),
    });
    gsap.from('.gate:not(.gate--key)', { autoAlpha: 0, y: 18, duration: .8, stagger: .06, ease: 'expo.out', scrollTrigger: { trigger: '.gates', start: 'top 80%', once: true } });
    gsap.from('.gate--key', { autoAlpha: 0, y: 40, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.gate--key', start: 'top 88%', once: true } });

    // ======== 9. Closing frame: night returns, the object lands on "matter." ========
    // The anchor moves with the page, so the shot lands when the title is centred and then rides
    // the scroll 1:1 until the end of the page.
    const close = () => stopAnchor('.chapter--install .chapter-title b', 2.5, 2.6);
    const maxScroll = () => ScrollTrigger.maxScroll(window) - 1;
    const landAt = () => Math.min(close().docY - window.innerHeight * .5, maxScroll());
    gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: scrub('#install', { start: 'top bottom', end: () => landAt() }) })
      .fromTo('.backdrop-night', { autoAlpha: 1, '--iris': '0px', '--ix': () => SHOTS.standard().x * 100 + '%', '--iy': () => SHOTS.standard().y * 100 + '%' },
        { '--iris': fullIris, ease: 'power2.in', immediateRender: false }, 0)
      .fromTo(state, { ...at('standard'), solid: 0, wire: 1, night: 0 }, {
        x: () => close().x, y: () => (close().docY - landAt()) / window.innerHeight, size: () => close().size,
        solid: 1, wire: 0, night: 1, ease: 'power2.inOut', immediateRender: false,
      }, 0);
    gsap.fromTo(state, { y: () => (close().docY - landAt()) / window.innerHeight }, {
      y: () => (close().docY - maxScroll()) / window.innerHeight, ease: 'none', immediateRender: false,
      scrollTrigger: { start: () => landAt(), end: () => maxScroll(), scrub: true, invalidateOnRefresh: true },
    });
    gsap.from('.chapter--install > :is(.chapter-lede,.install-command,.install-actions)', {
      autoAlpha: 0, y: 30, duration: 1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: '.chapter--install .chapter-lede', start: 'top 90%', once: true },
    });

    // ======== Viewfinder cursor (fine pointers only; the native cursor stays) ========
    const cursor = document.querySelector('.cursor');
    if (!touch && cursor) {
      const cx = gsap.quickTo(cursor, 'x', { duration: .45, ease: 'power3.out' });
      const cy = gsap.quickTo(cursor, 'y', { duration: .45, ease: 'power3.out' });
      const move = e => {
        cx(e.clientX); cy(e.clientY);
        cursor.classList.add('cursor--on');
        cursor.classList.toggle('cursor--target', !!e.target.closest?.('a, button'));
      };
      const out = () => cursor.classList.remove('cursor--on');
      window.addEventListener('pointermove', move, { passive: true });
      document.documentElement.addEventListener('pointerleave', out);
      html.classList.add('has-cursor');
      cleanups.push(() => {
        window.removeEventListener('pointermove', move);
        document.documentElement.removeEventListener('pointerleave', out);
        html.classList.remove('has-cursor');
        cursor.classList.remove('cursor--on', 'cursor--target');
      });
    }

    // ======== Matter responds: magnetic primary actions (fine pointers only) ========
    if (!touch) gsap.utils.toArray('.magnetic').forEach(el => {
      const xTo = gsap.quickTo(el, 'x', { duration: .5, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: .5, ease: 'power3.out' });
      const move = e => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * .32);
        yTo((e.clientY - r.top - r.height / 2) * .42);
      };
      const leave = () => { gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, .4)' }); };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      cleanups.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); });
    });

    cleanups.push(() => splits.reverse().forEach(s => s.revert()));
  });
  cleanups.push(() => ctx.revert());

  // Pin spacers change the page height: Lenis must re-measure after every refresh, or anchor
  // jumps stop at the old scroll limit.
  const syncLenis = () => lenis.resize();
  ScrollTrigger.addEventListener('refresh', syncLenis);
  cleanups.push(() => ScrollTrigger.removeEventListener('refresh', syncLenis));
  ScrollTrigger.refresh();
  // Fonts change the measured anchors.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  return () => {
    cleanups.reverse().forEach(fn => { try { fn(); } catch { /* keep tearing down */ } });
    Object.assign(state, DEFAULT_STATE);
  };
}

export default function Experience() {
  const canvasRef = useRef(null);
  const frontRef = useRef(null);
  const stateRef = useRef({ ...DEFAULT_STATE });

  useEffect(() => {
    let alive = true;
    // Strictly sequential: each (re)start waits for the previous direction to be torn down,
    // so two directors never share the canvas or the timelines.
    const start = () => {
      chain = chain.then(async prev => {
        prev?.();
        const still = () => { root().classList.add('motion-static'); return null; };
        if (!alive) return null;
        if (!motionAllowed()) return still();
        root().classList.remove('motion-static');
        try { return await direct({ canvas: canvasRef.current, frontCanvas: frontRef.current, state: stateRef.current }); }
        catch { root().classList.remove('motion-ready', 'stage-live'); return still(); }
      });
    };
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    start();
    window.addEventListener(MOTION_EVENT, start);
    mq.addEventListener('change', start);
    return () => {
      alive = false;
      window.removeEventListener(MOTION_EVENT, start);
      mq.removeEventListener('change', start);
      chain = chain.then(prev => { prev?.(); return null; });
    };
  }, []);

  return <>
    <div className="backdrop" aria-hidden="true"><div className="backdrop-night"/><div className="backdrop-day"/></div>
    <canvas ref={canvasRef} className="stage" aria-hidden="true"/>
    <StageOverlay/>
    <canvas ref={frontRef} className="stage-front" aria-hidden="true"/>
    <div className="grain" aria-hidden="true"/>
    <div className="cursor" aria-hidden="true"><span className="cursor-frame"><i/><i/><i/><i/></span></div>
  </>;
}
