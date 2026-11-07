'use client';

import { useEffect, useRef, useState } from 'react';
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

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  return <header className="site-header">
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
    try { await navigator.clipboard.writeText(command); setState('copied'); }
    catch {
      // Clipboard refused (permissions, insecure context): select the command so it can be copied by hand.
      const range = document.createRange();
      range.selectNodeContents(codeRef.current);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      setState('failed');
    }
  }
  return <div className="install-command">
    <code ref={codeRef} translate="no">{command}</code>
    <button type="button" className="magnetic" onClick={copy}>{state === 'copied' ? 'Copied ✓' : state === 'failed' ? 'Command selected' : 'Copy command'}</button>
    <span className="visually-hidden" role="status">{state === 'copied' ? 'Command copied to clipboard' : state === 'failed' ? 'Copy failed. The command is now selected, so you can copy it with your keyboard.' : ''}</span>
  </div>;
}
