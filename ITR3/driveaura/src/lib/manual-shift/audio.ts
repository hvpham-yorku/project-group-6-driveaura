/**
 * Realistic synthesized engine audio — no audio files needed.
 *
 * Models a 4-cylinder 4-stroke engine:
 *   - Firing frequency  f₀ = RPM × 4 / 120  (2 fires per rev for 4-cyl)
 *   - Three harmonic oscillators  (f₀ × 1, 2, 3)  + sub-rumble  (f₀ × 0.5)
 *   - Amplitude modulation at f₀ for the characteristic engine "chug"
 *   - White-noise layer (filtered) for intake + exhaust texture
 *   - Soft-clip distortion for harmonic richness
 *   - Dynamic low-pass filter that opens as RPM / throttle rises
 *   - Bandpass that tracks the dominant 2nd harmonic so the note stays centred
 */

const CYLINDERS = 4;

function firingFreq(rpm: number): number {
  return Math.max(10, (rpm * CYLINDERS) / 120);
}

function makeDistortionCurve(amount: number): Float32Array {
  const n = 512;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

function makeNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const length = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

export class EngineAudio {
  private ctx: AudioContext | null = null;

  // Oscillator stack
  private osc1: OscillatorNode | null = null;   // fundamental  f₀
  private osc2: OscillatorNode | null = null;   // 2nd harmonic 2f₀
  private osc3: OscillatorNode | null = null;   // 3rd harmonic 3f₀
  private oscSub: OscillatorNode | null = null; // sub-rumble   0.5f₀

  // Amplitude modulator (gives the "chug chug" pulse)
  private amOsc: OscillatorNode | null = null;
  private amGain: GainNode | null = null;

  // Noise (intake / exhaust hiss)
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private noiseGain: GainNode | null = null;

  // Processing chain
  private mixer: GainNode | null = null;
  private distortion: WaveShaperNode | null = null;
  private bandpass: BiquadFilterNode | null = null;
  private lowpass: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;

  private started = false;

  init(): void {
    if (this.started || typeof window === "undefined") return;
    try {
      const ctx = new window.AudioContext();
      this.ctx = ctx;
      const f0 = firingFreq(850); // idle baseline

      // ── Oscillators ──────────────────────────────────────────
      this.osc1 = ctx.createOscillator();
      this.osc1.type = "sawtooth";
      this.osc1.frequency.value = f0;

      this.osc2 = ctx.createOscillator();
      this.osc2.type = "sawtooth";
      this.osc2.frequency.value = f0 * 2;

      this.osc3 = ctx.createOscillator();
      this.osc3.type = "sawtooth";
      this.osc3.frequency.value = f0 * 3;

      this.oscSub = ctx.createOscillator();
      this.oscSub.type = "sine"; // pure sine keeps the sub-bass smooth
      this.oscSub.frequency.value = f0 * 0.5;

      // Harmonic level balance
      const g1   = ctx.createGain(); g1.gain.value   = 1.0;
      const g2   = ctx.createGain(); g2.gain.value   = 0.75;
      const g3   = ctx.createGain(); g3.gain.value   = 0.45;
      const gSub = ctx.createGain(); gSub.gain.value = 0.55;

      this.osc1.connect(g1);
      this.osc2.connect(g2);
      this.osc3.connect(g3);
      this.oscSub.connect(gSub);

      // ── Amplitude modulation — engine "pulse" ────────────────
      // amOsc oscillates at firing freq; amGain scales it to ±0.18.
      // Connected to mixer.gain AudioParam so it adds to the base value
      // of 1.0, producing a 0.82–1.18 breathing rhythm.
      this.amOsc = ctx.createOscillator();
      this.amOsc.type = "sine";
      this.amOsc.frequency.value = f0;

      this.amGain = ctx.createGain();
      this.amGain.gain.value = 0.18;
      this.amOsc.connect(this.amGain);

      // ── Noise layer (intake/exhaust texture) ─────────────────
      this.noiseSource = ctx.createBufferSource();
      this.noiseSource.buffer = makeNoiseBuffer(ctx);
      this.noiseSource.loop = true;

      this.noiseFilter = ctx.createBiquadFilter();
      this.noiseFilter.type = "bandpass";
      this.noiseFilter.frequency.value = 350;
      this.noiseFilter.Q.value = 0.7;

      this.noiseGain = ctx.createGain();
      this.noiseGain.gain.value = 0.07;

      this.noiseSource.connect(this.noiseFilter);
      this.noiseFilter.connect(this.noiseGain);

      // ── Mixer ─────────────────────────────────────────────────
      this.mixer = ctx.createGain();
      this.mixer.gain.value = 1.0;

      g1.connect(this.mixer);
      g2.connect(this.mixer);
      g3.connect(this.mixer);
      gSub.connect(this.mixer);
      this.noiseGain.connect(this.mixer);
      this.amGain.connect(this.mixer.gain); // AM modulates mixer gain

      // ── Distortion (soft clip — adds harmonic richness) ───────
      this.distortion = ctx.createWaveShaper();
      this.distortion.curve = makeDistortionCurve(200);
      this.distortion.oversample = "4x";

      // ── Bandpass (keeps tone centred on dominant note) ────────
      this.bandpass = ctx.createBiquadFilter();
      this.bandpass.type = "bandpass";
      this.bandpass.frequency.value = f0 * 2;
      this.bandpass.Q.value = 0.5;

      // ── Low-pass (exhaust cutoff opens with RPM/throttle) ──────
      this.lowpass = ctx.createBiquadFilter();
      this.lowpass.type = "lowpass";
      this.lowpass.frequency.value = 900;
      this.lowpass.Q.value = 1.0;

      // ── Master gain ───────────────────────────────────────────
      this.masterGain = ctx.createGain();
      this.masterGain.gain.value = 0.0; // muted until update() is called

      // ── Signal chain ──────────────────────────────────────────
      this.mixer.connect(this.distortion);
      this.distortion.connect(this.bandpass);
      this.bandpass.connect(this.lowpass);
      this.lowpass.connect(this.masterGain);
      this.masterGain.connect(ctx.destination);

      // ── Start all nodes ───────────────────────────────────────
      this.osc1.start();
      this.osc2.start();
      this.osc3.start();
      this.oscSub.start();
      this.amOsc.start();
      this.noiseSource.start();

      this.started = true;
    } catch {
      // Audio unavailable or blocked — silent fallback
    }
  }

  update(rpm: number, throttle: boolean, stalled: boolean): void {
    if (
      !this.ctx || !this.osc1 || !this.osc2 || !this.osc3 || !this.oscSub ||
      !this.amOsc || !this.noiseFilter || !this.noiseGain ||
      !this.bandpass || !this.lowpass || !this.masterGain
    ) return;

    const t = this.ctx.currentTime;
    const lag = 0.07;

    if (stalled) {
      this.masterGain.gain.setTargetAtTime(0, t, 0.05);
      return;
    }

    const f0 = firingFreq(rpm);

    // Oscillator frequencies
    this.osc1.frequency.setTargetAtTime(f0,       t, lag);
    this.osc2.frequency.setTargetAtTime(f0 * 2,   t, lag);
    this.osc3.frequency.setTargetAtTime(f0 * 3,   t, lag);
    this.oscSub.frequency.setTargetAtTime(f0 * 0.5, t, lag);

    // AM modulation tracks firing frequency
    this.amOsc.frequency.setTargetAtTime(f0, t, lag);

    // Bandpass tracks dominant 2nd harmonic
    this.bandpass.frequency.setTargetAtTime(f0 * 2, t, lag);

    // Low-pass: opens with RPM, extra boost under throttle
    const lpCutoff = 900 + (rpm / 7000) * 4600 + (throttle ? 700 : 0);
    this.lowpass.frequency.setTargetAtTime(Math.min(lpCutoff, 6000), t, lag);

    // Noise filter tracks intake frequency range
    this.noiseFilter.frequency.setTargetAtTime(300 + (rpm / 7000) * 1400, t, lag);
    this.noiseGain.gain.setTargetAtTime(throttle ? 0.13 : 0.07, t, lag);

    // Master volume — louder under throttle
    const gain = throttle ? 0.24 : 0.16;
    this.masterGain.gain.setTargetAtTime(gain, t, lag);
  }

  suspend(): void {
    this.ctx?.suspend().catch(() => {});
  }

  resume(): void {
    this.ctx?.resume().catch(() => {});
  }

  destroy(): void {
    try {
      this.osc1?.stop();
      this.osc2?.stop();
      this.osc3?.stop();
      this.oscSub?.stop();
      this.amOsc?.stop();
      this.noiseSource?.stop();
      this.ctx?.close();
    } catch { /* intentional */ }
    this.ctx = null;
    this.osc1 = this.osc2 = this.osc3 = this.oscSub = null;
    this.amOsc = null;
    this.noiseSource = null;
    this.masterGain = null;
    this.started = false;
  }
}
