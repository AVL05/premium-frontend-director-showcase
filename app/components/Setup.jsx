'use client';

// The Setup and Install chapters: choose a tool profile and a creative ambition (independent choices),
// then a coding agent, and get the exact commands, a way to verify and a first prompt for that setup.
// The choices only change what is shown: every profile, ambition and companion stays readable on the page.
import { useEffect, useId, useRef, useState } from 'react';
import { Arrow } from './Arrow';
import { CopyBlock } from './interactive';
import { FrameMarks, Monument } from './shared';
import Sculpture from './Sculpture';
import {
  AGENTS, AMBITIONS, COMPANIONS, DOCS, PROFILES, REPO, SHOWCASE_REPO,
  companionCommands, coreCommand, firstPrompt, listCommand, profileRank, verifyPrompt, verifyPremiumPrompt,
} from './setup-data';

// Layout events: choices and disclosures change the height of the page below them, so the director
// (Experience.jsx) re-measures its scroll triggers.
const relayout = () => window.dispatchEvent(new Event('pfd-layout'));

// One radio group. Native radios: arrow keys, focus and form semantics come for free.
function Choice({ name, value, label, describe = false, selected, onChange, children, className = '' }) {
  const uid = useId();
  // The accessible name is the short label; the card text is its description.
  return <label className={'choice ' + className + (selected ? ' is-selected' : '')}>
    <input className="choice-input" type="radio" name={name} value={value} checked={selected} aria-label={label}
      aria-describedby={describe ? uid : undefined} onChange={() => onChange(value)}/>
    <span className="choice-body" id={describe ? uid : undefined}>{children}</span>
  </label>;
}

// Stroke drawings for the three ambitions, in the language of the discipline drawings. Decorative.
function AmbitionArt({ kind }) {
  const d = (path, i, extra = '') => <path key={i} className={'da-line ' + extra} d={path} pathLength="1" style={{ '--i': i }}/>;
  const art = {
    // One precise frame, an aligned column grid and a measured block of text lines.
    refined: [d('M8 8H232V142H8Z', 0), d('M62 8V142', 1, 'da-faint'), d('M78 34H212M78 50H188M78 66H204', 2), d('M78 108H212', 3, 'da-faint'),
      <rect key="dot" className="da-dot" x="24" y="30" width="8" height="8"/>],
    // A broken grid: a circle that leaves the frame, a diagonal and a heavy bar.
    expressive: [d('M8 8H232V142H8Z', 0), <circle key="c" className="da-line" cx="168" cy="62" r="54" pathLength="1" style={{ '--i': 1 }}/>,
      d('M8 142L150 8', 2, 'da-faint'), d('M24 116H132', 3),
      <circle key="dot" className="da-dot" cx="168" cy="62" r="5"/>],
    // Frames receding towards a point: depth.
    immersive: [d('M8 8H232V142H8Z', 0), d('M44 30H196V120H44Z', 1), d('M82 52H158V98H82Z', 2), d('M108 66H132V84H108Z', 3),
      d('M8 8L108 66M232 8L132 66M8 142L108 84M232 142L132 84', 4, 'da-faint'),
      <circle key="dot" className="da-dot" cx="120" cy="75" r="4"/>],
  }[kind];
  return <svg className="ambition-art" viewBox="0 0 240 150" aria-hidden="true">{art}</svg>;
}

// 3 x 3: every profile with every ambition is valid. The selected pair is marked.
function Matrix({ profile, ambition }) {
  return <div className="matrix" aria-hidden="true">
    <span/>
    {AMBITIONS.map(a => <span key={a.id} className="matrix-head">{a.name}</span>)}
    {PROFILES.map(p => <div className="matrix-row" key={p.id}>
      <span className="matrix-head">{p.name}</span>
      {AMBITIONS.map(a => <span key={a.id} className={'matrix-cell' + (p.id === profile && a.id === ambition ? ' is-on' : '')}/>)}
    </div>)}
  </div>;
}

function Companion({ c, rank }) {
  const included = c.tier <= rank;
  return <li className={'ledger-row reveal' + (included ? ' is-in' : '') + (c.situational ? ' is-situational' : '')}>
    <span className="ledger-name">
      {c.url ? <a href={c.url} target="_blank" rel="noopener noreferrer">{c.name}</a> : c.name}
      <em className={'ledger-role ledger-role--' + (c.role === 'Required' ? 'required' : 'optional')}>{c.role}</em>
      {included && <span className="visually-hidden">, in your setup</span>}
    </span>
    <span className="ledger-does">{c.does}</span>
    <span className="ledger-setup">{c.setup}</span>
  </li>;
}

export default function Setup() {
  const [profile, setProfile] = useState('core');
  const [ambition, setAmbition] = useState('expressive');
  const [agentId, setAgentId] = useState('claude-code');
  const agent = AGENTS.find(a => a.id === agentId);
  const rank = profileRank(profile);
  const profileName = PROFILES[rank].name;
  const ambitionName = AMBITIONS.find(a => a.id === ambition).name;
  const commands = companionCommands(agent);
  const first = useRef(true);
  useEffect(() => { if (first.current) { first.current = false; return; } relayout(); }, [profile, ambition, agentId]);

  const premiumCompanions = COMPANIONS.filter(c => c.tier === 1);
  const studioCompanions = COMPANIONS.filter(c => c.tier === 2);

  return <>
    <section className="chapter chapter--setup" id="setup" aria-labelledby="setup-title">
      <Monument id="setup-title" kicker="Two choices." word="Set the scene" fit={5.4}/>
      <p className="chapter-lede">Premium Frontend Director is an Agent Skill: instructions your coding agent reads. It is not a template, a component library or a hosted service. Core is the only required install.</p>

      <div className="setup-group">
        <div className="setup-label reveal"><span>01</span><h3>Tool profile</h3><p>Decides which specialist tools your agent may consult.</p></div>
        <fieldset className="choices choices--profile">
          <legend className="visually-hidden">Tool profile</legend>
          {PROFILES.map(p => <Choice key={p.id} name="profile" value={p.id} label={p.name} describe selected={p.id === profile} onChange={setProfile} className="reveal">
            <span className="choice-tag">{p.tag}</span>
            <span className="choice-name">{p.name}<b>.</b></span>
            <span className="choice-copy">{p.summary}</span>
            <span className="choice-fit">{p.fit}</span>
            <span className="choice-state" aria-hidden="true"><i/>{p.id === profile ? 'Selected' : 'Select'}</span>
          </Choice>)}
        </fieldset>

        <div className="ledger">
          <h4 className="ledger-title reveal">What each tool contributes <span>Only Premium Frontend Director is required. The rest are independent, third-party and optional.</span></h4>
          <ul className="ledger-list" aria-label="Skills by profile">
            <li className="ledger-group" aria-hidden="true">Core</li>
            {COMPANIONS.filter(c => c.tier === 0).map(c => <Companion key={c.id} c={c} rank={rank}/>)}
            <li className="ledger-group" aria-hidden="true">Added by Premium</li>
            {premiumCompanions.map(c => <Companion key={c.id} c={c} rank={rank}/>)}
            <li className="ledger-group" aria-hidden="true">Added by Studio: choose by need</li>
            {studioCompanions.map(c => <Companion key={c.id} c={c} rank={rank}/>)}
          </ul>
          <p className="ledger-note reveal">Premium and Studio are not installed with Core. Each companion uses its own installer, and a missing companion never stops Core from running. The agent reports each one as used, not available or not needed.</p>
        </div>
      </div>

      <div className="setup-group">
        <div className="setup-label reveal"><span>02</span><h3>Creative ambition</h3><p>Decides how far the visual result should travel.</p></div>
        <fieldset className="choices choices--ambition">
          <legend className="visually-hidden">Creative ambition</legend>
          {AMBITIONS.map(a => <Choice key={a.id} name="ambition" value={a.id} label={a.name} describe selected={a.id === ambition} onChange={setAmbition} className="reveal">
            <AmbitionArt kind={a.art}/>
            <span className="choice-name">{a.name}<b>.</b></span>
            <span className="choice-copy">{a.summary}</span>
            <span className="choice-fit"><strong>Proof expected.</strong> {a.proof}</span>
            <span className="choice-state" aria-hidden="true"><i/>{a.id === ambition ? 'Selected' : 'Select'}</span>
          </Choice>)}
        </fieldset>
      </div>

      <div className="independence">
        <div className="independence-copy">
          <h3 className="reveal">Independent by design.</h3>
          <p className="reveal">The profile chooses tools. The ambition chooses the transformation. Any pairing is valid: Core with Immersive, Premium with Expressive, Studio with Refined. Immersive does not require Premium, and none of the ambitions requires WebGL.</p>
          <p className="independence-pick reveal">
            <span>Your setup</span><strong>{profileName} + {ambitionName}</strong>
            <a className="text-link" href="#install">Install it <Arrow down/></a>
            <span className="visually-hidden" role="status">Setup: {profileName} profile, {ambitionName} ambition.</span>
          </p>
        </div>
        <Matrix profile={profile} ambition={ambition}/>
      </div>
    </section>

    <section className="chapter chapter--install" id="install" aria-labelledby="install-title">
      <FrameMarks className="frame-marks--install"/>
      <Monument id="install-title" kicker="Make something" word="matter" fit={4.2}>
        <span className="ring-box ring-box--close"><Sculpture className="ring-svg" variant="night"/></span>
      </Monument>
      <div className="install-intro install-reveal">
        <p className="chapter-lede">Install the skill and give your next frontend project a point of view. Open source under MIT, designed for Claude Code, Codex and other Agent Skills-compatible agents.</p>
        <div className="install-pick">
          <fieldset className="agents">
            <legend>Your coding agent</legend>
            <div className="agent-options">
              {AGENTS.map(a => <Choice key={a.id} name="agent" value={a.id} label={a.name} selected={a.id === agentId} onChange={setAgentId} className="agent">{a.name}</Choice>)}
            </div>
          </fieldset>
          <p className="install-setup">Setup: <strong>{profileName} + {ambitionName}</strong> <a href="#setup">Change</a></p>
        </div>
      </div>

      <ol className="guide">
        <li className="guide-step install-reveal">
          <span className="guide-n" aria-hidden="true">01</span>
          <div className="guide-body">
            <h3>Install the skill</h3>
            <p>Open a terminal in the root of <strong>your own frontend project</strong>, not in this site or the skill repository, and run:</p>
            <CopyBlock text={coreCommand(agent)} label={'install command for ' + agent.name} magnetic/>
            <ul className="guide-notes">
              <li>Needs <strong>Node.js 22.20+</strong>. That is a requirement of the installer, not of the skill.</li>
              <li>Choose <strong>project</strong> scope if asked. Do not add <code>-g</code> unless you want a global install.</li>
              <li>Run one install route only. Core needs nothing else: no Python, no GSAP, no Three.js.</li>
            </ul>
            <details className="more" onToggle={relayout}>
              <summary>Another agent, or the Claude Code marketplace</summary>
              <p>Any agent that recognises <code>SKILL.md</code> can use the skill. Run <code translate="no">npx skills add AVL05/premium-frontend-director --skill premium-frontend-director</code> without <code>-a</code> and pick your agent in the installer.</p>
              <p>Claude Code can alternatively install it as a plugin, instead of the command above and never both. Run inside Claude Code: <code translate="no">/plugin marketplace add AVL05/premium-frontend-director</code> then <code translate="no">/plugin install premium-frontend-director@premium-frontend-director-marketplace</code>. <a href={DOCS.marketplace} target="_blank" rel="noopener noreferrer">Marketplace notes</a></p>
            </details>
          </div>
        </li>

        <li className="guide-step install-reveal">
          <span className="guide-n" aria-hidden="true">02</span>
          <div className="guide-body">
            <h3>Check that it is installed</h3>
            <p>List the project&rsquo;s skills, open a <strong>new</strong> {agent.name} session, then ask it:</p>
            <CopyBlock text={listCommand} label="skills list command"/>
            <CopyBlock text={verifyPrompt} kind="prompt" label="verification prompt"/>
            <p className="guide-note">A folder on disk is not proof. The skill is installed when the agent itself says it is registered and invocable. If it is not, restart the agent and check that the installer targeted {agent.name} at project scope. <a href={DOCS.troubleshooting} target="_blank" rel="noopener noreferrer">Troubleshooting <Arrow diagonal/></a></p>
          </div>
        </li>

        <li className="guide-step install-reveal">
          <span className="guide-n" aria-hidden="true">03</span>
          <div className="guide-body">
            <h3>Give it a first brief</h3>
            <p>Name the skill in your prompt. This one is written for <strong>{profileName} + {ambitionName}</strong>:</p>
            <CopyBlock text={firstPrompt(profile, ambition)} kind="prompt" label={`first prompt for ${profileName} and ${ambitionName}`}/>
            <p className="guide-note">The skill does not guarantee a particular result. Real-browser checks need browser tooling in your agent or project; without it those gates are reported as NOT RUN. <a href={DOCS.gates} target="_blank" rel="noopener noreferrer">The quality gates <Arrow diagonal/></a></p>
          </div>
        </li>

        <li className="guide-step install-reveal">
          <span className="guide-n" aria-hidden="true">04</span>
          <div className="guide-body">
            <h3>Add companions, only if you want them</h3>
            <p>Optional, and possible at any time: the same project, nothing reinstalled. Install each one in your project with its own installer. There is no single command for all of them.</p>
            <details className="more" key={'premium-' + profile} open={profile !== 'core'} onToggle={relayout}>
              <summary>Premium: four specialists{profile === 'core' ? '' : ' (in your setup)'}</summary>
              <ul className="companions">
                {premiumCompanions.map(c => <li key={c.id}>
                  <p><strong>{c.name}.</strong> {c.does} <span>{c.setup}</span></p>
                  <CopyBlock text={commands[c.id]} label={'install command for ' + c.name}/>
                </li>)}
              </ul>
              <p className="guide-note">Then open a new session and ask the agent to name the skills it can actually invoke: <span className="nowrap">&ldquo;{verifyPremiumPrompt}&rdquo;</span></p>
            </details>
            <details className="more" key={'studio-' + profile} open={profile === 'studio'} onToggle={relayout}>
              <summary>Studio: design-system guidance, chosen by need{profile === 'studio' ? ' (in your setup)' : ''}</summary>
              <ul className="companions">
                {studioCompanions.map(c => <li key={c.id}>
                  <p><strong>{c.name}.</strong> {c.does} <span>{c.setup}</span></p>
                  <CopyBlock text={commands[c.id]} label={'install command for ' + c.name}/>
                </li>)}
              </ul>
              <p className="guide-note">Studio builds on Premium and is not an install-everything bundle. Pick the entries that match your stack. <a href={DOCS.profiles} target="_blank" rel="noopener noreferrer">Profiles and prerequisites <Arrow diagonal/></a></p>
            </details>
          </div>
        </li>
      </ol>

      <div className="install-actions install-reveal">
        <a className="text-link" href={DOCS.start} target="_blank" rel="noopener noreferrer">Full installation guide <Arrow diagonal/></a>
        <a className="text-link" href={REPO} target="_blank" rel="noopener noreferrer">Explore the skill <Arrow diagonal/></a>
        <a className="text-link" href={SHOWCASE_REPO} target="_blank" rel="noopener noreferrer">View showcase source <Arrow diagonal/></a>
      </div>
    </section>
  </>;
}
