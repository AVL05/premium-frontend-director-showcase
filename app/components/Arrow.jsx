export function Arrow({ diagonal = false, down = false }) {
  const d = diagonal ? 'M5 19 19 5M8 5h11v11' : down ? 'M12 4v16m-6-6 6 6 6-6' : 'M4 12h16m-6-6 6 6-6 6';
  return <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
}
