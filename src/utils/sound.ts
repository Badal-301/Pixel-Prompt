/**
 * Web Audio API Procedural Sound Engine
 * Zero external mp3/wav files required. Synthesizes authentic sci-fi UI frequencies.
 * Default is strictly OFF as specified in requirements.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;
  private listeners: Set<(enabled: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pixel_audio_enabled');
      this.isEnabled = stored === 'true'; // Defaults to false
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggle(): boolean {
    this.isEnabled = !this.isEnabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('pixel_audio_enabled', String(this.isEnabled));
    }
    if (this.isEnabled) {
      this.initCtx();
      this.playBeep(880, 0.08, 'sine', 0.1);
    }
    this.listeners.forEach((fn) => fn(this.isEnabled));
    return this.isEnabled;
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public subscribe(listener: (enabled: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public playBeep(freq = 440, duration = 0.05, type: OscillatorType = 'sine', volume = 0.05) {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // AudioContext policy catch
    }
  }

  public playTerminalKeystroke() {
    if (!this.isEnabled) return;
    const freqs = [1200, 1400, 1600, 1800];
    const f = freqs[Math.floor(Math.random() * freqs.length)];
    this.playBeep(f, 0.02, 'square', 0.015);
  }

  public playDecryptProgress() {
    if (!this.isEnabled) return;
    this.playBeep(700 + Math.random() * 500, 0.04, 'triangle', 0.03);
  }

  public playAccessGranted() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const notes = [587.33, 739.99, 880, 1174.66]; // D5, F#5, A5, D6 triumphant cyber chord
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.06);
        gain.gain.setValueAtTime(0.04, t + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.06 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(t + idx * 0.06);
        osc.stop(t + idx * 0.06 + 0.35);
      });
    } catch {
      // Audio safety
    }
  }

  public playGlitch() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(40, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {
      // Audio safety
    }
  }

  public playSubDrone() {
    if (!this.isEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 1.2);
    } catch {
      // Audio safety
    }
  }
}

export const soundEngine = new SoundEngine();
