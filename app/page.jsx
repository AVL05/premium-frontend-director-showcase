import Sculpture from './components/Sculpture';
import { Arrow } from './components/Arrow';
import { Header, CopyCommand } from './components/interactive';
import Experience from './components/Experience';

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
// The five phases of the skill's workflow (SKILL.md, "Workflow"), one take each.
const takes = [
  ['Discover', 'Read the project before touching it: routes, tokens, fonts, assets, constraints and the ambition the brief really asks for.'],
  ['Direct', 'Three experientially distinct directions, one chosen with reasons, and a signature moment that can be verified.'],
  ['Document', 'A DESIGN.md with tokens, states, motion and acceptance criteria. The system is written down before it is built.'],
  ['Build', 'Vertical slices. For ambitious work the defining viewport is prototyped first, reviewed, and only then scaled.'],
  ['Prove', 'Real browsers at 375, 768, 1440 and 1920. Every gate is reported as pass, fail or not run.'],
];
// The three directions actually considered for this site (DESIGN.md).
const directions = [['A', 'Motion lab', false], ['B', 'The continuous take', true], ['C', 'Type tunnel', false]];
const kinetic =['Composition', 'Rhythm', 'Contrast', 'Light', 'Motion', 'Proof'];
const installCommand = 'npx skills add AVL05/premium-frontend-director --skill premium-frontend-director -a claude-code';
const prompt = 'Use $premium-frontend-director to redesign this frontend. Audit the current repository, select a creative ambition mode, propose three brand-appropriate directions, prototype the defining moment, implement one coherent system, review actual desktop and mobile rendering, and report objective quality gates.';
const sessionLines = [
  ['Discover', 'framework, routes, tokens, fonts and assets inventoried'],
  ['Direct', 'ambition: Immersive · three directions · one chosen'],
  ['Document', 'DESIGN.md written: tokens, motion, fallbacks'],
  ['Build', 'first viewport prototyped before the rest'],
  ['Prove', '375 · 768 · 1440 · 1920 reviewed in a real browser'],
  ['Report', 'G1–G11, each pass, fail or not run, with evidence'],
];

function FrameMarks({ className }) {
  return <span className={'frame-marks ' + className} aria-hidden="true"><i/><i/><i/><i/></span>;
}

function Monument({ id, kicker, word, fit, className = 'chapter-title', children }) {
  return <h2 id={id} className={className} style={fit ? { '--fit': fit } : undefined}>
    <span className="t-kicker">{kicker}</span>
    <span className="t-word"><span className="t-text">{word}<b>.</b></span>{children}</span>
  </h2>;
}

export default function Home() {
  return <main id="top">
    <a className="skip-link" href="#content">Skip to content</a>
    <Experience/>
    <Header/>
    <div id="content">
      {/* Signature scene. Static: two stacked chapters with the SVG sculpture.
          With motion: one pinned stage, the WebGL object, an iris into night and a letterbox. */}
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
                <a className="button magnetic" href="#install">Install the skill</a>
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
            <Monument id="cinema-title" className="cinema-title" kicker="Beyond" word="the template">
              <span className="ring-box ring-box--night"><Sculpture className="ring-svg" variant="night"/></span>
            </Monument>
            <p className="cinema-subtitle">Same object. New light. Direction decides what changes, and what stays.</p>
          </div>
        </section>
      </div>

      <section className="process" id="process" aria-labelledby="process-title">
        <div className="process-track">
          <div className="take take--head">
            <Monument id="process-title" kicker="From noise" word="to form" fit={5}/>
            <p className="chapter-lede">Not another prompt for prettier buttons. A disciplined workflow that takes a project from raw material to a directed, proven experience, in five takes.</p>
          </div>
          {takes.map(([name, copy], i) => <article className="take" key={name} aria-labelledby={'take-' + i}>
            <p className="take-slate"><span>Take {String(i + 1).padStart(2, '0')}</span><span aria-hidden="true">/ 05</span></p>
            <h3 id={'take-' + i} className="take-name">{name}<b>.</b></h3>
            <p className="take-copy">{copy}</p>
            {name === 'Direct' && <ul className="take-meta" aria-label="The three directions considered for this site">
              {directions.map(([id, label, chosen]) => <li key={id} className={chosen ? 'is-chosen' : undefined}>
                <span>{id}</span>{label}<em>{chosen ? 'Chosen' : 'Set aside'}</em>
              </li>)}
            </ul>}
          </article>)}
        </div>
        <div className="process-hud" aria-hidden="true">
          <span className="hud-tc">00:00:00:00</span>
          <span className="hud-bar"><i/></span>
          <span className="hud-label">Noise to form</span>
        </div>
      </section>

      <section className="chapter chapter--craft" id="craft" aria-labelledby="craft-title">
        <Monument id="craft-title" kicker="Three disciplines." word="One direction" fit={7.1}/>
        <div className="kinetic" aria-hidden="true">
          {[0, 1].map(row => <div className={'kinetic-row kinetic-row--' + row} key={row}>
            <div className="kinetic-track">{[...kinetic, ...kinetic].map((w, i) => <span key={i}>{w}<b>·</b></span>)}</div>
          </div>)}
        </div>
        <ul className="disciplines">
          <li><h3>Art direction</h3><p>Creative concepts, typography, composition and an unmistakable point of view.</p></li>
          <li><h3>Frontend engineering</h3><p>Production-minded components, semantic markup and intentional interactions.</p></li>
          <li><h3>Visual proof</h3><p>Real browser inspection, device coverage and explicit quality gates. No imaginary scores.</p></li>
        </ul>
      </section>

      <section className="chapter chapter--session" id="session" aria-labelledby="session-title">
        <Monument id="session-title" kicker="One prompt." word="The whole take" fit={6.4}/>
        <figure className="session">
          <figcaption className="session-bar"><span className="session-dots" aria-hidden="true"><i/><i/><i/></span><span>Illustrative session</span></figcaption>
          <div className="session-body">
            <p className="session-prompt"><span className="session-caret" aria-hidden="true">›</span><span className="session-typed">{prompt}</span></p>
            <ol className="session-log">
              {sessionLines.map(([phase, line]) => <li key={phase}><span className="session-phase">{phase}</span><span>{line}</span></li>)}
            </ol>
          </div>
        </figure>
        <p className="session-note">The prompt is the one suggested in the skill. The log shows the order of the workflow, not the result of a real run.</p>
      </section>

      <section className="chapter chapter--standard" id="standard" aria-labelledby="standard-title">
        <Monument id="standard-title" kicker="Looks are not" word="enough" fit={3.6}/>
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
        <Monument id="install-title" kicker="Make something" word="matter" fit={4.2}>
          <span className="ring-box ring-box--close"><Sculpture className="ring-svg" variant="night"/></span>
        </Monument>
        <p className="chapter-lede">Install the skill and give your next frontend project a point of view. Open source under MIT, compatible with Claude Code and Codex.</p>
        <CopyCommand command={installCommand}/>
        <div className="install-actions"><a className="text-link" href={repository} target="_blank" rel="noopener noreferrer">Explore the skill <Arrow diagonal/></a><a className="text-link" href={showcaseRepo} target="_blank" rel="noopener noreferrer">View showcase source <Arrow diagonal/></a></div>
      </section>
    </div>
    <footer className="footer"><span>© {new Date().getFullYear()} Premium Frontend Director</span><span>An independent open-source showcase</span><a href="#top">Back to top <span aria-hidden="true">↑</span></a></footer>
  </main>;
}
