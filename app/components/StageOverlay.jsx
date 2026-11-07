// Annotations drawn around the WebGL object, in its own coordinate frame: the object's diameter
// is 100 units and the frame is centred on it (viewBox -100..100). Experience.jsx positions the
// element on the object every frame and drives the draw-in through CSS variables.
// Decorative: the same information is in the take copy, so the whole layer is aria-hidden.

// Viewport frames sized to their real aspect ratios, all fitted around the object.
const FRAMES = [
  ['1920', 184, 103.5], ['1440', 162, 101.25], ['768', 86, 114.7], ['375', 56, 121.3],
];
// The three directions recorded in DESIGN.md; B was chosen.
const DIRECTIONS = [['A', 'Motion lab'], ['B', 'Continuous take'], ['C', 'Type tunnel']];

function Dim({ d, i }) {
  return <path className="ov-draw" d={d} pathLength="1" style={{ '--i': i }}/>;
}

export default function StageOverlay() {
  return <div className="overlay" aria-hidden="true">
    <svg viewBox="-100 -100 200 200" overflow="visible">
      <g className="ov-blueprint">
        <Dim i={0} d="M-7 0H7M0 -7V7"/>
        <circle className="ov-draw" cx="0" cy="0" r="50" pathLength="1" style={{ '--i': 1 }}/>
        <Dim i={2} d="M-50 60H50M-50 56V64M50 56V64"/>
        <Dim i={3} d="M62 -50V50M58 -50H66M58 50H66"/>
        <Dim i={4} d="M18 -32L44 -62H92"/>
        <Dim i={5} d="M-24 22L-50 70H-96"/>
        <text className="ov-label" x="0" y="72" textAnchor="middle">Ø 3.10</text>
        <text className="ov-label" x="70" y="2">H 3.10</text>
        <text className="ov-label" x="47" y="-66">R 1.00 · TUBE 0.20</text>
        <text className="ov-label" x="-96" y="66">LINK OFFSET 0.90</text>
      </g>
      <g className="ov-frames">
        {FRAMES.map(([label, fw, fh], i) => <g key={label} className="ov-frame" style={{ '--i': i }}>
          <rect className="ov-draw" x={-fw / 2} y={-fh / 2} width={fw} height={fh} pathLength="1"/>
          <text className="ov-label" x={-fw / 2 + 2} y={-fh / 2 - 3}>{label}</text>
        </g>)}
      </g>
      <g className="ov-directions">
        {DIRECTIONS.map(([id, name], i) => <g key={id} className={'ov-dir' + (i === 1 ? ' ov-dir--chosen' : '')} transform={`translate(${(i - 1) * 42} 0)`}>
          <text className="ov-label ov-dir-id" x="0" y="30" textAnchor="middle">{id}</text>
          <text className="ov-label" x="0" y="37" textAnchor="middle">{name}</text>
          {i !== 1 && <path className="ov-strike" d="M-14 33.5H14" pathLength="1"/>}
        </g>)}
      </g>
    </svg>
  </div>;
}
