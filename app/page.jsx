import Sculpture from './components/Sculpture';
import { Arrow } from './components/Arrow';
import { Header } from './components/interactive';
import Experience from './components/Experience';
import Setup from './components/Setup';
import { FrameMarks, Monument } from './components/shared';
import { DOCS } from './components/setup-data';

const gatesUrl = DOCS.gates;
// Gate names and the evidence each one asks for, from the skill's references/quality-gates.md.
const gates = [
  ['G1', 'Design brief', 'Audience, goal, the chosen creative thesis, a content plan and its trade-offs.'],
  ['G2', 'Design system', 'A design.md with tokens, states, responsive and motion decisions.'],
  ['G3', 'Visual review', 'Real browser screenshots at 375, 768, 1440 and 1920 px.'],
  ['G4', 'Interactions', 'Keyboard navigation, links and buttons, states, forms and the mobile menu.'],
  ['G5', 'Responsive', 'No unintended horizontal overflow; cropping and wrapping that hold up.'],
  ['G6', 'Accessibility', 'Semantics, contrast, focus, labels and reduced motion, with manual limits noted.'],
  ['G7', 'Engineering', 'The project’s own lint, tests and build, with their actual results.'],
  ['G8', 'Performance', 'Measured load and bundle data when tools permit; otherwise not run.'],
  ['G9', 'Assets and content', 'Asset licences, no fabricated claims, appropriate alt text.'],
  ['G10', 'Regression', 'Existing business flows checked, unknowns made explicit.'],
  ['G11', 'Visual ambition', 'Matched before and after views and a proven signature moment. Stops a cosmetic refresh from passing as an immersive redesign.'],
];
const states = ['Pass', 'Fail', 'Not run'];
// The three disciplines, each with its own drawing (DisciplineArt).
const disciplines = [
  ['Art direction', 'Creative concepts, typography, composition and an unmistakable point of view.', 'compose'],
  ['Frontend engineering', 'Production-minded components, semantic markup and intentional interactions.', 'build'],
  ['Visual proof', 'Real browser inspection, device coverage and explicit quality gates. No imaginary scores.', 'prove'],
];
// The five phases of the skill's workflow (SKILL.md, "Workflow"), one take each, with what each one leaves behind.
const takes = [
  ['Discover', 'Read the project before touching it: routes, tokens, fonts, assets, constraints and the ambition the brief really asks for.', 'Your constraints, scoped and written down'],
  ['Direct', 'Three experientially distinct directions, one chosen with reasons, and a signature moment that can be verified.', 'A creative brief with one chosen direction'],
  ['Document', 'A DESIGN.md with tokens, states, motion and acceptance criteria. The system is written down before it is built.', 'DESIGN.md in your project'],
  ['Build', 'Vertical slices in your existing stack. For ambitious work the defining viewport is prototyped first, reviewed, and only then scaled.', 'A working implementation, not a mockup'],
  ['Prove', 'Real browsers at 375, 768, 1440 and 1920, when browser tooling is available. Every gate is reported as pass, fail or not run.', 'Gate results with evidence'],
];
// The three directions actually considered for this site (DESIGN.md).
const directions = [['A', 'Motion lab', false], ['B', 'The continuous take', true], ['C', 'Type tunnel', false]];
const kinetic =['Composition', 'Rhythm', 'Contrast', 'Light', 'Motion', 'Proof'];
const prompt = 'Use $premium-frontend-director to redesign this frontend. Audit the current repository, select a creative ambition mode, propose three brand-appropriate directions, prototype the defining moment, implement one coherent system, review actual desktop and mobile rendering, and report objective quality gates.';
const sessionLines = [
  ['Discover', 'framework, routes, tokens, fonts and assets inventoried'],
  ['Direct', 'ambition: Immersive · three directions · one chosen'],
  ['Document', 'DESIGN.md written: tokens, motion, fallbacks'],
  ['Build', 'first viewport prototyped before the rest'],
  ['Prove', '375 · 768 · 1440 · 1920 reviewed in a real browser'],
  ['Report', 'G1–G11, each pass, fail or not run, with evidence'],
];

// A drawing per discipline, stroked so it can be drawn in by scroll (--p, 0..1; static: drawn).
// compose: a frame, its thirds and the focal point. build: a layout resolving into components.
// prove: the four review viewports, crossed by a scan line.
function DisciplineArt({ kind }) {
  const d = (path, i, extra = '') => <path key={i} className={'da-line ' + extra} d={path} pathLength="1" style={{ '--i': i }}/>;
  const art = {
    compose: [
      d('M8 8H232V142H8Z', 0), d('M82.7 8V142M157.3 8V142M8 52.7H232M8 97.3H232', 1, 'da-faint'),
      d('M8 142L232 8', 2, 'da-faint'), <circle key="c" className="da-line" cx="157.3" cy="52.7" r="26" pathLength="1" style={{ '--i': 3 }}/>,
      <circle key="dot" className="da-dot" cx="157.3" cy="52.7" r="5"/>,
    ],
    build: [
      d('M8 8H232V142H8Z', 0), d('M8 30H232', 1), d('M8 30V142M64 30V142', 2, 'da-faint'),
      d('M78 44H218V80H78Z', 3), d('M78 92H142V130H78ZM154 92H218V130H154Z', 4),
      <rect key="dot" className="da-dot" x="20" y="15" width="8" height="8"/>,
    ],
    prove: [
      d('M8 28H118V90H8Z', 0), d('M128 18H178V84H128Z', 1), d('M188 34H214V90H188Z', 2), d('M220 44H232V82H220Z', 3),
      d('M8 110H232', 4, 'da-faint'), <rect key="scan" className="da-scan" x="6" y="12" width="2" height="104"/>,
    ],
  }[kind];
  return <svg className={'discipline-art discipline-art--' + kind} viewBox="0 0 240 150" aria-hidden="true">{art}</svg>;
}

export default function Home() {
  // header and footer sit outside <main> so they keep their banner and contentinfo landmarks.
  return <div id="top">
    <a className="skip-link" href="#content">Skip to content</a>
    <Experience/>
    <Header/>
    <main id="content">
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
              <p className="hero-lede">Premium Frontend Director is an open-source Agent Skill for Claude Code, Codex and compatible agents. It guides them to art-direct a frontend, build it, and prove it in a real browser against 11 named quality gates.</p>
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
          {takes.map(([name, copy, out], i) => <article className="take" key={name} aria-labelledby={'take-' + i}>
            <p className="take-slate"><span>Take {String(i + 1).padStart(2, '0')}</span><span aria-hidden="true">/ 05</span></p>
            <h3 id={'take-' + i} className="take-name">{name}<b>.</b></h3>
            <p className="take-copy">{copy}</p>
            <p className="take-out"><span>You get</span>{out}</p>
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
          {disciplines.map(([name, copy, kind]) => <li key={kind}>
            <h3>{name}</h3>
            <DisciplineArt kind={kind}/>
            <p>{copy}</p>
          </li>)}
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
            {/* The slate: a visual copy of the active gate while the list is pinned (the list holds the real content). */}
            <div className="slate" aria-hidden="true">
              <div className="slate-head"><span className="slate-count"><span className="slate-n">01</span> / 11</span><span>Quality gate</span></div>
              <p className="slate-id">G1</p>
              <p className="slate-name">Design brief</p>
              <p className="slate-evidence">{gates[0][2]}</p>
              <ul className="slate-states">{states.map(s => <li key={s}><i/>{s}</li>)}</ul>
            </div>
          </div>
          <ol className="gates" aria-label="The 11 quality gates">
            {gates.map(([id, name, evidence]) => <li key={id} className={id === 'G11' ? 'gate gate--key' : 'gate'}>
              <span className="gate-id">{id}</span>
              <span className="gate-name"><span className="gate-title">{name}</span><span className="gate-note">{evidence}</span></span>
            </li>)}
          </ol>
        </div>
      </section>

      <Setup/>
    </main>
    <footer className="footer"><span>© {new Date().getFullYear()} Premium Frontend Director</span><span>An independent open-source showcase</span><a href="#top">Back to top <span aria-hidden="true">↑</span></a></footer>
  </div>;
}
