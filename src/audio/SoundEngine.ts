export class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private humOsc: OscillatorNode | null = null;
  private humGain: GainNode | null = null;

  constructor() {
    // Autoplay policy: AudioContext will be initialized on first user interaction in browser
  }

  public setContext(context: AudioContext): void {
    this.ctx = context;
  }

  public isAudioReady(): boolean {
    return this.ctx !== null && this.ctx.state === 'running';
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled && this.humGain) {
      this.stopHum();
    }
  }

  public ensureContext(): AudioContext | null {
    if (!this.enabled) return null;

    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public playPopUp(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    
    // Spring chime oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(1320, t + 0.15);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.36);

    // Mechanical snap oscillator
    const snap = ctx.createOscillator();
    const snapGain = ctx.createGain();

    snap.type = 'triangle';
    snap.frequency.setValueAtTime(800, t);
    snap.frequency.exponentialRampToValueAtTime(150, t + 0.08);

    snapGain.gain.setValueAtTime(0.4, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    snap.connect(snapGain);
    snapGain.connect(ctx.destination);

    snap.start(t);
    snap.stop(t + 0.1);
  }

  public playDialTurn(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(350, t + 0.04);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  public playSlam(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Heavy bass thump
    const bass = ctx.createOscillator();
    const bassGain = ctx.createGain();

    bass.type = 'sine';
    bass.frequency.setValueAtTime(180, t);
    bass.frequency.exponentialRampToValueAtTime(35, t + 0.25);

    bassGain.gain.setValueAtTime(0.5, t);
    bassGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    bass.connect(bassGain);
    bassGain.connect(ctx.destination);

    bass.start(t);
    bass.stop(t + 0.31);
  }

  public playTransform(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Deep power surge
    const surge = ctx.createOscillator();
    const surgeGain = ctx.createGain();

    surge.type = 'sawtooth';
    surge.frequency.setValueAtTime(60, t);
    surge.frequency.exponentialRampToValueAtTime(440, t + 0.4);
    surge.frequency.exponentialRampToValueAtTime(880, t + 0.8);

    surgeGain.gain.setValueAtTime(0.1, t);
    surgeGain.gain.linearRampToValueAtTime(0.4, t + 0.3);
    surgeGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

    surge.connect(surgeGain);
    surgeGain.connect(ctx.destination);

    surge.start(t);
    surge.stop(t + 1.25);

    // Alien energy beam resonance
    const beam = ctx.createOscillator();
    const beamGain = ctx.createGain();

    beam.type = 'sine';
    beam.frequency.setValueAtTime(587.33, t + 0.1); // D5
    beam.frequency.exponentialRampToValueAtTime(1174.66, t + 0.6); // D6

    beamGain.gain.setValueAtTime(0.001, t);
    beamGain.gain.linearRampToValueAtTime(0.25, t + 0.3);
    beamGain.gain.exponentialRampToValueAtTime(0.001, t + 1.1);

    beam.connect(beamGain);
    beamGain.connect(ctx.destination);

    beam.start(t + 0.1);
    beam.stop(t + 1.15);
  }

  public playUltimateEvolve(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // 4 rapid metallic clanks (spikes extending)
    for (let i = 0; i < 4; i++) {
      const clickTime = t + i * 0.06;
      const clank = ctx.createOscillator();
      const clankGain = ctx.createGain();

      clank.type = 'triangle';
      clank.frequency.setValueAtTime(1400 + i * 200, clickTime);
      clank.frequency.exponentialRampToValueAtTime(200, clickTime + 0.05);

      clankGain.gain.setValueAtTime(0.35, clickTime);
      clankGain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.055);

      clank.connect(clankGain);
      clankGain.connect(ctx.destination);

      clank.start(clickTime);
      clank.stop(clickTime + 0.06);
    }

    // Heavy evolutionary energy explosion chord
    const freqs = [110, 220, 277.18, 329.63, 659.25]; // A major / cosmic power
    freqs.forEach((freq, idx) => {
      const chordOsc = ctx.createOscillator();
      const chordGain = ctx.createGain();

      chordOsc.type = idx % 2 === 0 ? 'sawtooth' : 'sine';
      chordOsc.frequency.setValueAtTime(freq, t + 0.25);
      chordOsc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.9);

      chordGain.gain.setValueAtTime(0.01, t + 0.25);
      chordGain.gain.linearRampToValueAtTime(0.12, t + 0.45);
      chordGain.gain.exponentialRampToValueAtTime(0.001, t + 1.6);

      chordOsc.connect(chordGain);
      chordGain.connect(ctx.destination);

      chordOsc.start(t + 0.25);
      chordOsc.stop(t + 1.65);
    });
  }

  public playTimeout(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const beepTime = t + i * 0.14;
      const beep = ctx.createOscillator();
      const beepGain = ctx.createGain();

      beep.type = 'square';
      beep.frequency.setValueAtTime(987.77, beepTime); // B5 warning

      beepGain.gain.setValueAtTime(0.2, beepTime);
      beepGain.gain.exponentialRampToValueAtTime(0.001, beepTime + 0.09);

      beep.connect(beepGain);
      beepGain.connect(ctx.destination);

      beep.start(beepTime);
      beep.stop(beepTime + 0.1);
    }
  }

  public startHum(): void {
    if (!this.enabled || this.humOsc) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    this.humOsc = ctx.createOscillator();
    this.humGain = ctx.createGain();

    this.humOsc.type = 'sine';
    this.humOsc.frequency.setValueAtTime(65, t); // Low reactor rumble

    this.humGain.gain.setValueAtTime(0.001, t);
    this.humGain.gain.linearRampToValueAtTime(0.05, t + 1.0);

    this.humOsc.connect(this.humGain);
    this.humGain.connect(ctx.destination);

    this.humOsc.start(t);
  }

  public stopHum(): void {
    if (this.humOsc && this.humGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.humGain.gain.linearRampToValueAtTime(0.0001, t + 0.3);
      this.humOsc.stop(t + 0.35);
      this.humOsc = null;
      this.humGain = null;
    }
  }
}
