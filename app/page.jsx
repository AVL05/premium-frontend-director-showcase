import Sculpture from './components/Sculpture';
import { Arrow } from './components/Arrow';
import { Header, CopyCommand } from './components/interactive';

const repository = 'https://github.com/AVL05/premium-frontend-director';
const showcaseRepo = 'https://github.com/AVL05/premium-frontend-director-showcase';
const gatesUrl = repository + '/blob/main/skills/premium-frontend-director/references/quality-gates.md';
// Gate names as published in the skill's references/quality-gates.md.
const gates = [
  ['G1', 'Design brief'], ['G2', 'Design system'], ['G3', 'Visual review'], ['G4', 'Interactions'],
  ['G5', 'Responsive'], ['G6', 'Accessibility'], ['G7', 'Engineering'], ['G8', 'Performance'],
  ['G9', 'Assets and content'], ['G10', 'Regression'],
  ['G11', 'Visual ambition', 'Stops a cosmetic refresh from passing as an immersive redesign.'],
];
const installCommand = 'npx skills add AVL05/premium-frontend-director --skill premium-frontend-director -a claude-code';

function FrameMarks({ className }) {
  return <span className={'frame-marks ' + className} aria-hidden="true"><i/><i/><i/><i/></span>;
}

export default function Home() {
  return <main id="top">
    <a className="skip-link" href="#content">Skip to content</a>
    <Header/>
    <div id="content">
      {/*
        Signature scene. Without scroll-driven animation support, or with reduced motion,
        these render as two static chapters: the paper opening, then the cinema frame.
        With support, both pin to one stage and the paper world is letterboxed into cinema.
      */}
      <div className="scene">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-fg">
            <FrameMarks className="frame-marks--paper"/>
            <p className="hero-meta"><span>The Art of Direction</span><span>Open-source agent skill</span></p>
            <h1 id="hero-title" className="hero-title">
              <span className="t-kicker">The web deserves</span>
              <span className="t-word">
                <span className="t-text">Direction<b>.</b></span>
                <span className="ring-box ring-box--paper"><Sculpture className="ring-svg" variant="paper"/></span>
                <span className="ring-box ring-box--front"><Sculpture className="ring-svg" variant="paper" part="front"/></span>
              </span>
            </h1>
            <div className="hero-base">
              <p className="hero-lede">Premium Frontend Director teaches coding agents to art-direct a frontend, build it, and prove it in a real browser against 11 named quality gates.</p>
              <div className="hero-actions">
                <a className="button" href="#install">Install the skill</a>
                <a className="text-link" href="#experience">Enter the scene <Arrow down/></a>
              </div>
            </div>
          </div>
        </section>

        <span className="scene-mark" id="experience" aria-hidden="true"/>

        <section className="cinema" aria-labelledby="cinema-title">
          <div className="cinema-ground" aria-hidden="true"/>
          <div className="bar bar--top" aria-hidden="true"/>
          <div className="bar bar--bottom" aria-hidden="true"/>
          <FrameMarks className="frame-marks--night"/>
          <div className="cinema-copy">
            <h2 id="cinema-title" className="cinema-title"><span className="t-kicker">Beyond</span><span className="t-word"><span className="t-text">the template<b>.</b></span><span className="ring-box ring-box--night"><Sculpture className="ring-svg" variant="night"/></span></span></h2>
            <p className="cinema-subtitle">Same object. New light. Direction decides what changes, and what stays.</p>
          </div>
        </section>
      </div>

      <section className="chapter chapter--philosophy" id="philosophy" aria-labelledby="philosophy-title">
        <h2 id="philosophy-title" className="chapter-title" style={{ '--fit': 6.6 }}>
          <span className="t-kicker">Less generic.</span>
          <span className="t-word"><span className="t-text">More genuine<b>.</b></span></span>
        </h2>
        <p className="chapter-lede">Not another prompt for prettier buttons. A disciplined workflow for concept, composition, real implementation and visual proof. The difference is in the decisions.</p>
      </section>

      <section className="chapter chapter--craft" id="craft" aria-labelledby="craft-title">
        <h2 id="craft-title" className="chapter-title" style={{ '--fit': 7.1 }}>
          <span className="t-kicker">Three disciplines.</span>
          <span className="t-word"><span className="t-text">One direction<b>.</b></span></span>
        </h2>
        <ul className="disciplines">
          <li><h3>Art direction</h3><p>Creative concepts, typography, composition and an unmistakable point of view.</p></li>
          <li><h3>Frontend engineering</h3><p>Production-minded components, semantic markup and intentional interactions.</p></li>
          <li><h3>Visual proof</h3><p>Real browser inspection, device coverage and explicit quality gates. No imaginary scores.</p></li>
        </ul>
      </section>

      <section className="chapter chapter--standard" id="standard" aria-labelledby="standard-title">
        <h2 id="standard-title" className="chapter-title" style={{ '--fit': 3.6 }}>
          <span className="t-kicker">Looks are not</span>
          <span className="t-word"><span className="t-text">enough<b>.</b></span></span>
        </h2>
        <div className="standard-grid">
          <div className="standard-copy">
            <p className="chapter-lede">Every run is reported against 11 named gates, each marked pass, fail or not run. Nothing is claimed without evidence.</p>
            <a className="text-link" href={gatesUrl} target="_blank" rel="noopener noreferrer">Read the quality gates <Arrow diagonal/></a>
          </div>
          <ol className="gates" aria-label="The 11 quality gates">
            {gates.map(([id, name, note]) => <li key={id} className={note ? 'gate gate--key' : 'gate'}><span className="gate-id">{id}</span><span className="gate-name"><span className="gate-title">{name}</span>{note && <span className="gate-note">{note}</span>}</span></li>)}
          </ol>
        </div>
      </section>

      <section className="chapter chapter--install" id="install" aria-labelledby="install-title">
        <FrameMarks className="frame-marks--install"/>
        <h2 id="install-title" className="chapter-title" style={{ '--fit': 4.2 }}>
          <span className="t-kicker">Make something</span>
          <span className="t-word"><span className="t-text">matter<b>.</b></span><span className="ring-box ring-box--close"><Sculpture className="ring-svg" variant="night"/></span></span>
        </h2>
        <p className="chapter-lede">Install the skill and give your next frontend project a point of view. Open source under MIT, compatible with Claude Code and Codex.</p>
        <CopyCommand command={installCommand}/>
        <div className="install-actions"><a className="text-link" href={repository} target="_blank" rel="noopener noreferrer">Explore the skill <Arrow diagonal/></a><a className="text-link" href={showcaseRepo} target="_blank" rel="noopener noreferrer">View showcase source <Arrow diagonal/></a></div>
      </section>
    </div>
    <footer className="footer"><span>© {new Date().getFullYear()} Premium Frontend Director</span><span>An independent open-source showcase</span><a href="#top">Back to top <span aria-hidden="true">↑</span></a></footer>
  </main>;
}
