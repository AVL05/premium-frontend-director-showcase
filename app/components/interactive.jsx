'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { Arrow } from './Arrow';
import { motionSwitch, prefersReduced, setMotionSwitch, MOTION_EVENT } from './motion';

// Pause control for all decorative motion (WCAG 2.2.2). The OS reduced-motion setting always wins.
function MotionToggle() {
  const [on, setOn] = useState(true);
  const [forced, setForced] = useState(false);
  useEffect(() => {
    const sync = () => { setOn(motionSwitch()); setForced(prefersReduced()); };
    sync();
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    window.addEventListener(MOTION_EVENT, sync);
    mq.addEventListener('change', sync);
    return () => { window.removeEventListener(MOTION_EVENT, sync); mq.removeEventListener('change', sync); };
  }, []);
  const active = on && !forced;
  return <button type="button" className="motion-toggle" aria-pressed={active} disabled={forced}
    title={forced ? 'Motion is reduced by your system setting' : active ? 'Turn motion off' : 'Turn motion on'}
    onClick={() => setMotionSwitch(!on)}>
    <span className="motion-dot" aria-hidden="true"/><span className="motion-label">Motion {active ? 'on' : 'off'}</span>
  </button>;
}

// The header is fixed so the navigation and the motion switch stay reachable all through the take.
// 'top': transparent over the opening frame. Past it, a matte bar (the letterbox) that slides away
// while scrolling down and returns on the first scroll up; keyboard focus always brings it back.
function useDock() {
  const [dock, setDock] = useState('top');
  useEffect(() => {
    const TOP = 96, STEP = 6;
    let last = window.scrollY, frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY, dy = y - last;
      if (y < TOP) { setDock('top'); last = y; return; }
      if (dy > STEP) { setDock('hidden'); last = y; }
      else if (dy < -STEP) { setDock('shown'); last = y; }
      else setDock(d => (d === 'top' ? 'hidden' : d));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);
  return dock;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const dock = useDock();
  const close = () => setOpen(false);
  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  const docked = dock !== 'top';
  const hidden = dock === 'hidden' && !open;
  return <header className={'site-header' + (docked ? ' site-header--docked' : '') + (hidden ? ' site-header--hidden' : '')}>
    <a className="brand" href="#top" aria-label="Premium Frontend Director, back to top"><span className="brand-mark" aria-hidden="true">P<span>·</span></span><span>Premium<br/>Frontend Director</span></a>
    <button className="mobile-menu" type="button" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(v => !v)}>{open ? 'Close' : 'Menu'} <span aria-hidden="true">{open ? '×' : '+'}</span></button>
    <nav id="primary-nav" className={open ? 'navigation navigation--open' : 'navigation'} aria-label="Main navigation">
      <a onClick={close} href="#experience">Experience</a>
      <a onClick={close} href="#process">Process</a>
      <a onClick={close} href="#craft">Craft</a>
      <a onClick={close} href="#standard">Gates</a>
      <a onClick={close} href="#install">Get the skill <Arrow diagonal/></a>
    </nav>
    <MotionToggle/>
  </header>;
}

export function CopyCommand({ command }) {
  const [state, setState] = useState('idle');
  const codeRef = useRef(null);
  async function copy() {
    try { await navigator.clipboard.writeText(command); setState('copied'); return; }
    catch { /* Clipboard API refused or unavailable (permissions, insecure context): fall back below. */ }
    // Select the command, then try the legacy copy; if that is refused too it stays selected for a manual copy.
    const range = document.createRange();
    range.selectNodeContents(codeRef.current);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { /* keep the selection */ }
    setState(ok ? 'copied' : 'failed');
  }
  // Each argument stays whole when the command wraps (a flag never splits across lines);
  // the text, and so what is selected and copied, is unchanged.
  const tokens = command.split(' ');
  return <div className="install-command">
    <code ref={codeRef} translate="no">{tokens.map((t, i) => <Fragment key={i}>{i > 0 && ' '}<span className="cmd-token">{t}</span></Fragment>)}</code>
    <button type="button" className="magnetic" onClick={copy}>{state === 'copied' ? 'Copied ✓' : state === 'failed' ? 'Command selected' : 'Copy command'}</button>
    <span className="visually-hidden" role="status">{state === 'copied' ? 'Command copied to clipboard' : state === 'failed' ? 'Copy failed. The command is now selected, so you can copy it with your keyboard.' : ''}</span>
  </div>;
}
