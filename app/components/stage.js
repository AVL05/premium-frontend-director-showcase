// The stage: one WebGL object directed through every chapter.
// Not a React component. Experience.jsx owns the lifecycle and drives `stage.state` with GSAP;
// this module only turns that state into pixels. One renderer, one draw loop (gsap.ticker).
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Points, LineSegments,
  TorusGeometry, PlaneGeometry, BufferGeometry, Float32BufferAttribute,
  ShaderMaterial, LineBasicMaterial, Color, MathUtils, NormalBlending,
} from 'three';
import { DEFAULT_STATE } from './motion';

// Two linked tori: A lies in XY, B in XZ, offset so each threads the other's hole (a real link).
const R = 1, TUBE = 0.2, OFFSET = 0.45;
const RINGS = [
  { c: [-OFFSET, 0, 0], plane: 'xy' },
  { c: [OFFSET, 0, 0], plane: 'xz' },
];

const NOISE = /* glsl */`
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.5-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 105.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

// Solid: porcelain under paper light, near-black with a warm rim under cinema light.
// uSolid dissolves the surface through noise with a signal-red burning edge.
const solidVertex = /* glsl */`
uniform float uTime, uDistort;
varying vec3 vNormal, vWorld, vObj;
${NOISE}
void main(){
  vec3 p = position + normal * snoise(position * 1.7 + uTime * .35) * uDistort;
  vObj = position;
  vec4 w = modelMatrix * vec4(p, 1.);
  vWorld = w.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`;
const solidFragment = /* glsl */`
uniform float uNight, uSolid, uOpacity;
uniform vec3 uSignal, uRim;
varying vec3 vNormal, vWorld, vObj;
${NOISE}
void main(){
  float d = snoise(vObj * 2.3) * .5 + .5;
  float edge = uSolid * 1.12 - .06;
  if (d > edge) discard;
  vec3 n = normalize(vNormal);
  if (!gl_FrontFacing) n = -n;
  vec3 v = normalize(cameraPosition - vWorld);
  float nv = max(dot(n, v), 0.);
  vec3 L = normalize(vec3(-.55, .8, .65));
  float diff = max(dot(n, L), 0.);
  float spec = pow(max(dot(n, normalize(L + v)), 0.), 70.);
  float strip = smoothstep(.9, .99, dot(reflect(-v, n), normalize(vec3(-.25, .95, .2))));
  float fres = pow(1. - nv, 3.);

  vec3 porcelain = mix(vec3(.47, .45, .41), vec3(.985, .975, .955), smoothstep(-.1, 1., diff));
  porcelain += spec * .45 + strip * .18 + fres * .12;

  vec3 Lr = normalize(vec3(.95, .25, -.45));
  float rim = pow(1. - nv, 2.2) * (max(dot(n, Lr), 0.) * 1.3 + .12);
  vec3 night = vec3(.05, .056, .06) + diff * vec3(.07, .072, .075);
  night += rim * uRim * 1.7 + spec * vec3(1., .82, .72) * .3 + strip * uRim * .25;

  vec3 col = mix(porcelain, night, uNight);
  float burn = smoothstep(edge - .07, edge, d) * step(uSolid, .995);
  col = mix(col, uSignal * 1.25, burn);
  gl_FragColor = vec4(col, uOpacity);
}`;

// Points: the same surface sampled, able to scatter into a cloud ("noise") and converge back ("form").
const pointsVertex = /* glsl */`
attribute vec3 aScatter;
attribute float aRand;
uniform float uScatter, uTime, uPx, uSize;
varying float vRand;
${NOISE}
void main(){
  float t = smoothstep(aRand * .35, aRand * .35 + .65, uScatter);
  vec3 p = mix(position, aScatter, t);
  float drift = .05 + .14 * t;
  p += vec3(snoise(p * .7 + uTime * .12), snoise(p * .7 + 17. + uTime * .12), snoise(p * .7 + 31. + uTime * .12)) * drift;
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPx * (.55 + aRand * .9) / -mv.z;
  vRand = aRand;
}`;
const pointsFragment = /* glsl */`
uniform float uOpacity, uNight;
uniform vec3 uInk, uWarm, uSignal;
varying float vRand;
void main(){
  float d = length(gl_PointCoord - .5);
  if (d > .5) discard;
  vec3 c = mix(uInk, uWarm, uNight);
  if (vRand > .955) c = uSignal;
  float a = smoothstep(.5, .1, d) * (.45 + .55 * vRand) * uOpacity;
  gl_FragColor = vec4(c, a);
}`;

const shadowVertex = /* glsl */`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const shadowFragment = /* glsl */`uniform float uOpacity;varying vec2 vUv;void main(){vec2 p=(vUv-.5)*vec2(2.,2.);float a=smoothstep(1.,0.,length(p));gl_FragColor=vec4(vec3(.17,.16,.15),a*a*uOpacity*.32);}`;

function torusPoint(ring, u, v, out) {
  // u: around the ring, v: around the tube
  const x = (R + TUBE * Math.cos(v)) * Math.cos(u);
  const y = (R + TUBE * Math.cos(v)) * Math.sin(u);
  const z = TUBE * Math.sin(v);
  if (ring.plane === 'xy') { out[0] = x + ring.c[0]; out[1] = y + ring.c[1]; out[2] = z + ring.c[2]; }
  else { out[0] = x + ring.c[0]; out[1] = z + ring.c[1]; out[2] = y + ring.c[2]; }
  return out;
}

function buildPoints(count) {
  const pos = new Float32Array(count * 3), scatter = new Float32Array(count * 3), rand = new Float32Array(count);
  const tmp = [0, 0, 0];
  for (let i = 0; i < count; i++) {
    torusPoint(RINGS[i % 2], Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, tmp);
    pos.set(tmp, i * 3);
    // Scatter target: a flattened, wide cloud so the noise state still reads as composed, not a ball.
    // Kept roughly within the object's half of the frame so the copy beside it stays legible.
    const r = 1.1 + Math.pow(Math.random(), .7) * 1.7, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    scatter[i * 3] = r * Math.sin(ph) * Math.cos(th) * 1.25;
    scatter[i * 3 + 1] = r * Math.cos(ph) * .85;
    scatter[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    rand[i] = Math.random();
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('aScatter', new Float32BufferAttribute(scatter, 3));
  g.setAttribute('aRand', new Float32BufferAttribute(rand, 1));
  return g;
}

// Blueprint: tube cross-sections plus lines running along each ring.
function buildWire() {
  const verts = [], a = [0, 0, 0], b = [0, 0, 0];
  const SECTIONS = 40, SEC_STEPS = 24, LONG = 8, LONG_STEPS = 140;
  for (const ring of RINGS) {
    for (let s = 0; s < SECTIONS; s++) {
      const u = (s / SECTIONS) * Math.PI * 2;
      for (let k = 0; k < SEC_STEPS; k++) {
        torusPoint(ring, u, (k / SEC_STEPS) * Math.PI * 2, a);
        torusPoint(ring, u, ((k + 1) / SEC_STEPS) * Math.PI * 2, b);
        verts.push(...a, ...b);
      }
    }
    for (let l = 0; l < LONG; l++) {
      const v = (l / LONG) * Math.PI * 2;
      for (let k = 0; k < LONG_STEPS; k++) {
        torusPoint(ring, (k / LONG_STEPS) * Math.PI * 2, v, a);
        torusPoint(ring, ((k + 1) / LONG_STEPS) * Math.PI * 2, v, b);
        verts.push(...a, ...b);
      }
    }
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(verts, 3));
  return g;
}

export function createStage(canvas, { touch = false, onContextLost, state = { ...DEFAULT_STATE } } = {}) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: !touch, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  const dprCap = touch ? 1.25 : 1.75;

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, .1, 60);
  camera.position.set(0, 0, 9);

  const rig = new Group(), form = new Group(), pose = new Group();
  pose.rotation.set(.55, 0, -.38);
  form.add(pose);
  rig.add(form);
  scene.add(rig);

  const signal = new Color('#cd4f38'), rim = new Color('#ee7a5f'), ink = new Color('#2a2b29'), warm = new Color('#f1c9b8');
  const uniforms = {
    uTime: { value: 0 }, uDistort: { value: 0 }, uNight: { value: 0 }, uSolid: { value: 1 }, uOpacity: { value: 1 },
    uSignal: { value: signal }, uRim: { value: rim },
  };
  const solidMat = new ShaderMaterial({ uniforms, vertexShader: solidVertex, fragmentShader: solidFragment, transparent: true });
  const torusGeo = new TorusGeometry(R, TUBE, touch ? 40 : 64, touch ? 160 : 260);
  const meshes = RINGS.map(ring => {
    const m = new Mesh(torusGeo, solidMat);
    m.position.set(...ring.c);
    if (ring.plane === 'xz') m.rotation.x = Math.PI / 2;
    pose.add(m);
    return m;
  });

  const pointsUniforms = {
    uTime: uniforms.uTime, uScatter: { value: 0 }, uPx: { value: 1 }, uSize: { value: touch ? 26 : 30 },
    uOpacity: { value: 0 }, uNight: uniforms.uNight, uInk: { value: ink }, uWarm: { value: warm }, uSignal: { value: signal },
  };
  const points = new Points(buildPoints(touch ? 5000 : 11000), new ShaderMaterial({
    uniforms: pointsUniforms, vertexShader: pointsVertex, fragmentShader: pointsFragment,
    transparent: true, depthWrite: false, blending: NormalBlending,
  }));
  pose.add(points);

  const wireMat = new LineBasicMaterial({ color: ink.clone(), transparent: true, opacity: 0, depthWrite: false });
  const wire = new LineSegments(buildWire(), wireMat);
  pose.add(wire);

  const shadowUniforms = { uOpacity: { value: 1 } };
  const shadow = new Mesh(new PlaneGeometry(4.2, 1), new ShaderMaterial({ uniforms: shadowUniforms, vertexShader: shadowVertex, fragmentShader: shadowFragment, transparent: true, depthWrite: false }));
  shadow.position.set(.1, -1.95, -.6);
  shadow.renderOrder = -1;
  rig.add(shadow);

  // `state` is the directed state (see DEFAULT_STATE). x/y are viewport fractions (0..1, top-left
  // origin) of the object's centre; size is its diameter as a fraction of viewport height.
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  let w = 1, h = 1, visH = 1, visW = 1, spin = 0, velocity = 0, smoothVel = 0;

  function resize() {
    w = window.innerWidth; h = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    visH = 2 * Math.tan(MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    visW = visH * camera.aspect;
    pointsUniforms.uPx.value = renderer.getPixelRatio() * (h / 900);
  }
  resize();

  function onPointer(e) {
    pointer.x = (e.clientX / w) * 2 - 1;
    pointer.y = (e.clientY / h) * 2 - 1;
  }
  if (!touch) window.addEventListener('pointermove', onPointer, { passive: true });

  const lost = e => { e.preventDefault(); onContextLost?.(); };
  canvas.addEventListener('webglcontextlost', lost);

  // The object's extent across its widest diagonal, in object units, used to convert size -> scale.
  const EXTENT = 3.1;

  function render(time, dt) {
    const s = state;
    // Velocity decays even if no further scroll event arrives (Lenis stops emitting at rest).
    velocity *= Math.max(0, 1 - dt * 6);
    smoothVel += (MathUtils.clamp(velocity, -60, 60) - smoothVel) * Math.min(1, dt * 4);
    pointer.sx += (pointer.x - pointer.sx) * Math.min(1, dt * 3);
    pointer.sy += (pointer.y - pointer.sy) * Math.min(1, dt * 3);
    spin += dt * .16 * s.idle;

    uniforms.uTime.value = time;
    uniforms.uNight.value = s.night;
    uniforms.uSolid.value = s.solid;
    uniforms.uOpacity.value = s.opacity;
    uniforms.uDistort.value = s.distort + Math.abs(smoothVel) * .0009;
    pointsUniforms.uOpacity.value = s.points * s.opacity;
    pointsUniforms.uScatter.value = s.scatter;
    wireMat.opacity = s.wire * s.opacity * (.35 + .4 * s.night);
    wireMat.color.copy(ink).lerp(rim, s.night);
    shadowUniforms.uOpacity.value = s.shadow * (1 - s.night) * s.solid * s.opacity;

    const visible = s.opacity > .002;
    meshes.forEach(m => { m.visible = visible && s.solid > .002; });
    points.visible = visible && s.points > .002;
    wire.visible = visible && s.wire > .002;
    shadow.visible = shadowUniforms.uOpacity.value > .002;

    rig.position.set((s.x - .5) * visW, (.5 - s.y) * visH, 0);
    rig.scale.setScalar((s.size * s.zoom * visH) / EXTENT);
    form.rotation.set(pointer.sy * .22 + smoothVel * .004,spin + s.rot + s.twist + pointer.sx * .35, 0);

    if (visible) renderer.render(scene, camera);
    else renderer.clear();
  }

  function setVelocity(v) { velocity = v; }

  function dispose() {
    window.removeEventListener('pointermove', onPointer);
    canvas.removeEventListener('webglcontextlost', lost);
    torusGeo.dispose(); solidMat.dispose();
    points.geometry.dispose(); points.material.dispose();
    wire.geometry.dispose(); wireMat.dispose();
    shadow.geometry.dispose(); shadow.material.dispose();
    renderer.dispose();
  }

  return { state, render, resize, setVelocity, dispose };
}

export function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch { return false; }
}
