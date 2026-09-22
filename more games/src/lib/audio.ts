// Tiny WebAudio SFX kit: cardboard clicks, clatters and a completion arpeggio.

let ac: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;

export function ensureAudio() {
  if (ac) {
    if (ac.state === "suspended") void ac.resume();
    return;
  }
  try {
    const Ctor: typeof AudioContext | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    ac = new Ctor();
    master = ac.createGain();
    master.gain.value = muted ? 0 : 0.45;
    master.connect(ac.destination);
  } catch {
    ac = null;
  }
}

export function setMuted(m: boolean) {
  muted = m;
  if (master && ac) master.gain.setTargetAtTime(m ? 0 : 0.45, ac.currentTime, 0.02);
}

function tone(
  freq: number,
  dur: number,
  type: OscillatorType,
  gain: number,
  slideTo?: number,
  delay = 0,
) {
  if (!ac || !master) return;
  const t0 = ac.currentTime + delay;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(master);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

function noise(dur: number, freq: number, q: number, gain: number, delay = 0) {
  if (!ac || !master) return;
  const t0 = ac.currentTime + delay;
  const frames = Math.max(1, Math.floor(ac.sampleRate * dur));
  const buf = ac.createBuffer(1, frames, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  const src = ac.createBufferSource();
  src.buffer = buf;
  const bp = ac.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = freq;
  bp.Q.value = q;
  const g = ac.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(bp).connect(g).connect(master);
  src.start(t0);
  src.stop(t0 + dur + 0.02);
}

export function pickup() {
  ensureAudio();
  tone(560, 0.07, "triangle", 0.12, 760);
}

export function snap(combo: number) {
  ensureAudio();
  const semis = (Math.min(5, combo) - 1) * 2;
  const f = 330 * Math.pow(2, semis / 12);
  noise(0.055, 2100, 1.4, 0.5);
  tone(f, 0.14, "triangle", 0.2);
  tone(f * 2, 0.1, "sine", 0.09, undefined, 0.015);
}

export function clatter() {
  ensureAudio();
  noise(0.14, 420, 0.9, 0.3);
  tone(120, 0.16, "sine", 0.16, 70);
}

export function tick(urgent: boolean) {
  ensureAudio();
  tone(urgent ? 1500 : 1050, 0.035, "square", urgent ? 0.1 : 0.055);
}

export function clear() {
  ensureAudio();
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((n, i) => {
    tone(n, 0.34, "triangle", 0.2, undefined, i * 0.085);
    noise(0.09, 3200, 1.1, 0.14, i * 0.085);
  });
  tone(1318.5, 0.5, "sine", 0.14, undefined, 0.36);
}

export function over() {
  ensureAudio();
  tone(330, 0.75, "sawtooth", 0.16, 82);
  noise(0.4, 260, 0.8, 0.22);
}

export function start() {
  ensureAudio();
  tone(392, 0.12, "triangle", 0.18);
  tone(587, 0.2, "triangle", 0.18, undefined, 0.1);
}
