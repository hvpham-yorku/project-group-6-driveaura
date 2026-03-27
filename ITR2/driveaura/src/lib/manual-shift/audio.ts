/** Synthesized engine audio using Web Audio API — no audio files needed. */
export class EngineAudio {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private started = false;

  init(): void {
    if (this.started || typeof window === "undefined") return;
    try {
      this.ctx = new window.AudioContext();

      this.osc1 = this.ctx.createOscillator();
      this.osc2 = this.ctx.createOscillator();
      this.osc1.type = "sawtooth";
      this.osc2.type = "square";

      const dist = this.ctx.createWaveShaper();
      dist.curve = EngineAudio.makeDistortionCurve(120);
      dist.oversample = "4x";

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = 0.04;

      this.osc1.connect(dist);
      this.osc2.connect(dist);
      dist.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      const initFreq = this.rpmToFreq(850);
      this.osc1.frequency.value = initFreq;
      this.osc2.frequency.value = initFreq * 1.5;

      this.osc1.start();
      this.osc2.start();
      this.started = true;
    } catch {
      // Audio blocked or unavailable — silent fallback
    }
  }

  update(rpm: number, throttle: boolean, stalled: boolean): void {
    if (!this.ctx || !this.osc1 || !this.osc2 || !this.gainNode) return;
    const t = this.ctx.currentTime;
    const freq = this.rpmToFreq(stalled ? 0 : rpm);
    const lag = 0.07;
    this.osc1.frequency.setTargetAtTime(freq, t, lag);
    this.osc2.frequency.setTargetAtTime(freq * 1.5, t, lag);
    const gain = stalled ? 0 : throttle ? 0.07 : 0.04;
    this.gainNode.gain.setTargetAtTime(gain, t, lag);
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
      this.ctx?.close();
    } catch { /* intentional */ }
    this.ctx = null;
    this.osc1 = null;
    this.osc2 = null;
    this.gainNode = null;
    this.started = false;
  }

  private rpmToFreq(rpm: number): number {
    return Math.max(30, (rpm / 60) * 2.5);
  }

  static makeDistortionCurve(amount: number): Float32Array<ArrayBuffer> {
    const n = 256;
    const buf = new ArrayBuffer(n * 4);
    const curve = new Float32Array(buf);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      curve[i] = ((Math.PI + amount) * x) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }
}
