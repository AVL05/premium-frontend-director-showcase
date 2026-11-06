// Original vector sculpture: two interlocked elliptical rings (a true link, not an overlap).
// Ring A passes over ring B at the left/right crossings and under it at the top/bottom ones.
// Geometry: centre (400,400), rx 236, ry 108, A rotated -30deg, B rotated 42deg.
// The red core is normally the headline full stop itself; pass dot to draw it.
// Crossings of the two centre lines: right (555,416), left (245,384), top (413,274), bottom (387,526).

const LIGHT = {
  paper: {
    base: ['#fbf9f4', '#e4dfd5', '#a9a49a', '#6f6c65'],
    rim: '#ffffff',
    rimOpacity: 0.85,
    shade: '#4a4843',
    shadeOpacity: 0.5,
  },
  night: {
    base: ['#3b3f41', '#212527', '#141719', '#0b0d0e'],
    rim: '#ee7a5f',
    rimOpacity: 0.95,
    shade: '#000000',
    shadeOpacity: 0.65,
    engrave: true,
  },
};

function Ring({ id, rot, light }) {
  return (
    <g transform={`rotate(${rot} 400 400)`}>
      <ellipse cx="400" cy="400" rx="236" ry="108" fill="none" stroke={`url(#${id}-base)`} strokeWidth="78" />
      <ellipse cx="400" cy="400" rx="268" ry="140" fill="none" stroke={`url(#${id}-rim)`} strokeWidth="9" />
      <ellipse cx="400" cy="400" rx="205" ry="77" fill="none" stroke={light.shade} strokeOpacity={light.shadeOpacity} strokeWidth="12" />
      {light.engrave && <ellipse cx="400" cy="400" rx="252" ry="124" fill="none" stroke={light.rim} strokeOpacity={light.rimOpacity * 0.3} strokeWidth="2" />}
    </g>
  );
}

export default function Sculpture({ variant = 'paper', part = 'full', dot = false, className = '' }) {
  const light = LIGHT[variant];
  const p = `${variant}-${part}`;
  const front = part === 'front';
  return (
    <svg className={className} viewBox="0 0 800 800" aria-hidden="true" focusable="false">
      <defs>
        {[['a', 30], ['b', -42]].map(([k, counter]) => (
          <g key={k}>
            <linearGradient id={`${p}-${k}-base`} gradientUnits="userSpaceOnUse" x1="250" y1="250" x2="560" y2="560" gradientTransform={`rotate(${counter} 400 400)`}>
              {light.base.map((c, i) => <stop key={c} offset={i / (light.base.length - 1)} stopColor={c} />)}
            </linearGradient>
            <linearGradient id={`${p}-${k}-rim`} gradientUnits="userSpaceOnUse" x1={variant === 'night' ? '660' : '160'} y1="200" x2={variant === 'night' ? '300' : '520'} y2="600" gradientTransform={`rotate(${counter} 400 400)`}>
              <stop offset="0" stopColor={light.rim} stopOpacity={light.rimOpacity} />
              <stop offset=".55" stopColor={light.rim} stopOpacity="0" />
            </linearGradient>
          </g>
        ))}
        <clipPath id={`${p}-over`}>
          <circle cx="555" cy="416" r="82" />
          <circle cx="245" cy="384" r="82" />
        </clipPath>
        {front && (
          <clipPath id={`${p}-lower`}>
            <rect x="0" y="400" width="800" height="400" />
          </clipPath>
        )}
        {variant === 'paper' && !front && (
          <filter id={`${p}-blur`} x="-30%" y="-100%" width="160%" height="300%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
        )}
      </defs>
      {variant === 'paper' && !front && <ellipse cx="410" cy="708" rx="230" ry="30" fill="#2b2a26" opacity=".16" filter={`url(#${p}-blur)`} />}
      <g clipPath={front ? `url(#${p}-lower)` : undefined}>
        <Ring id={`${p}-a`} rot={-30} light={light} />
        <Ring id={`${p}-b`} rot={42} light={light} />
        <g clipPath={`url(#${p}-over)`}>
          <Ring id={`${p}-a`} rot={-30} light={light} />
        </g>
      </g>
      {dot && <circle cx="400" cy="400" r="15" fill="#cd4f38" />}
    </svg>
  );
}
