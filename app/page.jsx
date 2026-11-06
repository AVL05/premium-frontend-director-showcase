'use client';

import { useEffect, useRef, useState } from 'react';

const repository = 'https://github.com/AVL05/premium-frontend-director';
const showcaseRepo = 'https://github.com/AVL05/premium-frontend-director-showcase';
const installCommand = 'npx skills add AVL05/premium-frontend-director --skill premium-frontend-director -a claude-code';

function Arrow({ diagonal = false }) {
  return <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{diagonal ? <path d="M5 19 19 5M8 5h11v11" /> : <path d="M4 12h16m-6-6 6 6-6 6" />}</svg>;
}

function Symbol({ subtle = false }) {
  return <svg className={subtle ? 'symbol symbol--subtle' : 'symbol'} viewBox="0 0 800 800" role="img" aria-label="Abstract direction sculpture formed by interlocking elliptical rings">
    <defs>
      <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e9e8e2"/><stop offset=".26" stopColor="#777875"/><stop offset=".49" stopColor="#faf8f2"/><stop offset=".72" stopColor="#4d4e4c"/><stop offset="1" stopColor="#ddd8d0"/></linearGradient>
      <linearGradient id="ring2" x1="0" y1="0" x2=".9" y2="1"><stop offset="0" stopColor="#efeee8"/><stop offset=".35" stopColor="#999b99"/><stop offset=".59" stopColor="#363837"/><stop offset="1" stopColor="#f5f2eb"/></linearGradient>
      <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18"/></filter>
    </defs>
    <ellipse cx="412" cy="666" rx="238" ry="44" fill="#000" opacity=".15" filter="url(#softShadow)"/>
    <g transform="rotate(-33 400 395)">
      <ellipse cx="400" cy="395" rx="230" ry="112" fill="none" stroke="#262927" strokeWidth="87" opacity=".22" transform="translate(16 18)"/>
      <ellipse cx="400" cy="395" rx="230" ry="112" fill="none" stroke="url(#ring)" strokeWidth="84"/>
      <ellipse cx="400" cy="395" rx="230" ry="112" fill="none" stroke="#fff" strokeOpacity=".56" strokeWidth="3" transform="translate(0 -38)"/>
    </g>
    <g transform="rotate(48 403 394)">
      <ellipse cx="403" cy="394" rx="224" ry="110" fill="none" stroke="url(#ring2)" strokeWidth="81"/>
      <ellipse cx="403" cy="394" rx="224" ry="110" fill="none" stroke="#faf7f0" strokeOpacity=".58" strokeWidth="2.5" transform="translate(0 -37)"/>
    </g>
    <circle cx="405" cy="392" r="18" fill="#c94c37"/>
  </svg>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <a className="brand" href="#top" aria-label="Premium Frontend Director, back to top"><span className="brand-mark" aria-hidden="true">P<span>·</span></span><span>PREMIUM<br/>FRONTEND DIRECTOR</span></a>
    <button className="mobile-menu" type="button" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(v => !v)}>{open ? 'Close' : 'Menu'} <span aria-hidden="true">{open ? '×' : '+'}</span></button>
    <nav id="primary-nav" className={open ? 'navigation navigation--open' : 'navigation'} aria-label="Main navigation">
      <a onClick={() => setOpen(false)} href="#philosophy">Philosophy</a>
      <a onClick={() => setOpen(false)} href="#craft">The craft</a>
      <a onClick={() => setOpen(false)} href="#experience">Experience</a>
      <a onClick={() => setOpen(false)} href="#install">Get the skill <Arrow diagonal/></a>
    </nav>
  </header>;
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.12 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={'reveal is-visible-fallback ' + className}>{children}</div>;
}

function CopyCommand() {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(installCommand); setCopied(true); } catch { setCopied(false); }
  }
  return <div className="install-command"><code>{installCommand}</code><button type="button" onClick={copy} aria-live="polite">{copied ? 'Copied ✓' : 'Copy command'}</button></div>;
}

export default function Home() {
  return <main id="top">
    <a className="skip-link" href="#content">Skip to content</a>
    <Header/>
    <div id="content">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-overline"><span>Independent agent skill / Issue 001</span><span>Art direction for the modern web</span></div>
        <div className="hero-main">
          <div className="hero-copy">
            <p className="eyebrow"><span className="signal-dot" /> AN EXERCISE IN INTENTION</p>
            <h1 id="hero-title">THE WEB<br/>DESERVES<br/><em>DIRECTION.</em></h1>
            <div className="hero-bottom"><p>Good interfaces are built.<br/>Great experiences are directed.</p><a className="round-link" href="#philosophy" aria-label="Explore the experience"><Arrow/></a></div>
          </div>
          <div className="hero-art"><span className="art-index">FIG. 01 / COMPOSITION IN MOTION</span><div className="art-orbit" aria-hidden="true" /><Symbol/><span className="art-caption">FORM FOLLOWS INTENT.<br/>NOT THE OTHER WAY AROUND.</span></div>
        </div>
        <div className="hero-foot"><span>SCROLL TO EXPLORE</span><span>DESIGNED TO BE FELT. BUILT TO WORK.</span><span>01 — 05</span></div>
      </section>

      <section className="manifesto" id="philosophy" aria-labelledby="manifesto-title">
        <div className="section-label"><span>01 / THE PHILOSOPHY</span><span>A DIFFERENT STANDARD</span></div>
        <Reveal><h2 id="manifesto-title">LESS GENERIC.<br/><span>MORE</span> <i>GENUINE.</i></h2></Reveal>
        <div className="manifesto-bottom"><p>Not another prompt for prettier buttons. A disciplined workflow for concept, composition, real implementation, and visual proof.</p><div className="small-note">THE DIFFERENCE<br/>IS IN THE DECISIONS.</div></div>
      </section>

      <section className="cinema" id="experience" aria-labelledby="cinema-title">
        <div className="cinema-content">
          <div className="section-label section-label--light"><span>02 / THE EXPERIENCE</span><span>WHERE INTENT BECOMES FORM</span></div>
          <div className="cinema-grid"><div><span className="eyebrow eyebrow--light">A moment of clarity</span><h2 id="cinema-title">BEYOND<br/><i>THE</i> TEMPLATE.</h2></div><div className="cinema-art"><Symbol subtle/></div></div>
          <p className="cinema-caption">Design is not decoration. It is the deliberate orchestration of every detail, from first impression to final interaction.</p>
          <div className="cinema-bottom"><span>CURATED, NOT GENERATED.</span><span>02 — 05</span></div>
        </div>
      </section>

      <section className="craft" id="craft" aria-labelledby="craft-title">
        <div className="section-label"><span>03 / THE CRAFT</span><span>A PROCESS, NOT A PRESET</span></div>
        <Reveal><h2 id="craft-title">THREE DISCIPLINES.<br/><em>ONE DIRECTION.</em></h2></Reveal>
        <div className="craft-rows">
          <div className="craft-row"><span className="craft-number">01</span><h3>ART DIRECTION</h3><p>Creative concepts, typography, composition and an unmistakable point of view.</p><span className="craft-arrow" aria-hidden="true">↗</span></div>
          <div className="craft-row"><span className="craft-number">02</span><h3>FRONTEND ENGINEERING</h3><p>Production-minded components, semantic markup and intentional interactions.</p><span className="craft-arrow" aria-hidden="true">↗</span></div>
          <div className="craft-row"><span className="craft-number">03</span><h3>VISUAL PROOF</h3><p>Real browser inspection, device coverage and explicit quality gates. No imaginary scores.</p><span className="craft-arrow" aria-hidden="true">↗</span></div>
        </div>
      </section>

      <section className="proof" aria-labelledby="proof-title">
        <div className="section-label"><span>04 / THE STANDARD</span><span>INTENTION MEETS EVIDENCE</span></div>
        <div className="proof-grid"><Reveal><h2 id="proof-title">LOOKS<br/>ARE NOT<br/><em>ENOUGH.</em></h2></Reveal><div className="proof-aside"><p>Premium Frontend Director is built around a clear process and eleven quality gates. Its visual ambition gate, G11, prevents a cosmetic refresh from passing as an immersive redesign.</p><div className="proof-tags"><span>RESPONSIVE</span><span>ACCESSIBLE</span><span>MEASURABLE</span><span>HONEST</span></div><a className="text-link" href={repository + '/blob/main/skills/premium-frontend-director/references/quality-gates.md'} target="_blank" rel="noopener noreferrer">Read the quality gates <Arrow diagonal/></a></div></div>
      </section>

      <section className="install" id="install" aria-labelledby="install-title">
        <div className="section-label section-label--light"><span>05 / YOUR MOVE</span><span>OPEN SOURCE · MIT</span></div>
        <Reveal><h2 id="install-title">MAKE<br/>SOMETHING<br/><em>MATTER.</em></h2></Reveal>
        <p className="install-intro">The skill is open source. The standard is yours to raise. Install it and give your next frontend project a point of view.</p>
        <CopyCommand/>
        <div className="install-actions"><a href={repository} target="_blank" rel="noopener noreferrer">Explore the skill <Arrow diagonal/></a><a href={showcaseRepo} target="_blank" rel="noopener noreferrer">View showcase source <Arrow diagonal/></a></div>
      </section>
    </div>
    <footer className="footer"><span>© {new Date().getFullYear()} PREMIUM FRONTEND DIRECTOR</span><span>AN INDEPENDENT OPEN-SOURCE SHOWCASE.</span><a href="#top">BACK TO TOP ↑</a></footer>
  </main>;
}
