// Small presentational pieces shared by the server page and the client setup guide.

export function FrameMarks({ className }) {
  return <span className={'frame-marks ' + className} aria-hidden="true"><i/><i/><i/><i/></span>;
}

// A chapter title: a wide light kicker over a condensed black word ending in the signal-red full stop.
// --fit is the word's width in em, so each monument fills the measure without overflowing.
export function Monument({ id, kicker, word, fit, className = 'chapter-title', children }) {
  return <h2 id={id} className={className} style={fit ? { '--fit': fit } : undefined}>
    <span className="t-kicker">{kicker}</span>
    <span className="t-word"><span className="t-text">{word}<b>.</b></span>{children}</span>
  </h2>;
}
