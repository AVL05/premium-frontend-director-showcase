// Viewer motion preference: the OS setting always wins; the header toggle can also turn motion off.
// Stored per viewer only (a convenience), so every access is guarded.
// The directed state of the stage object (stage.js renders it, Experience.jsx tweens it).
// Kept here, away from three, so importing it never pulls the WebGL bundle into first load.
// ghost/choose: three directions -> one; face: ring A turned flat to the lens (portal);
// front: threading pass over the headline; anno/frames/portal drive the DOM overlays.
export const DEFAULT_STATE = {
  x: .5, y: .5, size: .5, zoom: 1, twist: 0, night: 0, solid: 1, wire: 0, points: 0, scatter: 0,
  ghost: 1, choose: 0, face: 0, front: 0, anno: 0, frames: 0, portal: 0, intro: 1, introMove: 1,
  distort: 0, rot: 0, opacity: 1, shadow: 1, idle: 1,
};

export const MOTION_KEY = 'pfd-motion';
export const MOTION_EVENT = 'pfd-motion-change';

export function prefersReduced() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function motionSwitch() {
  try { return localStorage.getItem(MOTION_KEY) !== 'off'; } catch { return true; }
}

export function motionAllowed() {
  return !prefersReduced() && motionSwitch();
}

export function setMotionSwitch(on) {
  try { localStorage.setItem(MOTION_KEY, on ? 'on' : 'off'); } catch { /* storage unavailable: session-only */ }
  window.dispatchEvent(new CustomEvent(MOTION_EVENT, { detail: on }));
}
