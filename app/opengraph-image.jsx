import { ImageResponse } from 'next/og';

// The social card, drawn at build time with the page's own palette: paper, ink, signal red, and the two rings.
export const alt = 'The web deserves Direction. Premium Frontend Director, an open-source Agent Skill.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const paper = '#f3f0e9', ink = '#171817', signal = '#cd4f38', muted = '#5f605a';

export default function Image() {
  const ring = (left, top, color) => <div style={{ position: 'absolute', left, top, width: 260, height: 260, borderRadius: 260, border: `26px solid ${color}`, display: 'flex' }}/>;
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', background: paper, color: ink, padding: 72, flexDirection: 'column', justifyContent: 'space-between' }}>
      {ring(870, 100, ink)}
      {ring(940, 200, signal)}
      <div style={{ display: 'flex', fontSize: 30, letterSpacing: 6, textTransform: 'uppercase', color: muted }}>The web deserves</div>
      <div style={{ display: 'flex', fontSize: 150, lineHeight: 0.9, letterSpacing: -4, textTransform: 'uppercase', marginTop: -120 }}>
        Direction<span style={{ color: signal }}>.</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', fontSize: 32, lineHeight: 1.3, width: 700 }}>
        <div style={{ display: 'flex', fontWeight: 700 }}>Premium Frontend Director</div>
        <div style={{ display: 'flex', color: muted }}>An open-source Agent Skill for Claude Code, Codex and compatible agents</div>
      </div>
    </div>,
    size,
  );
}
