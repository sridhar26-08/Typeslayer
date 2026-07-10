/** Small synthesized sound palette: original, instant, and safe to ship without audio files. */
export class AudioSystem {
  constructor(scene) {
    this.scene = scene;
    this.context = null;
    try { this.enabled = localStorage.getItem('spellstrike-muted') !== 'true'; } catch (_) { this.enabled = true; }
    this.ambientTimer = null;
    this.ambientStep = 0;
  }

  ensureContext() {
    if (!this.enabled) return null;
    if (!this.context) this.context = new (window.AudioContext || window.webkitAudioContext)();
    if (this.context.state === 'suspended') this.context.resume();
    return this.context;
  }

  tone(frequency, duration, { type = 'sine', volume = 0.05, slide = 0 } = {}) {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, frequency + slide), now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now); osc.stop(now + duration + 0.03);
  }

  startAmbient() {
    if (!this.ensureContext() || this.ambientTimer) return;
    const notes = [82.41, 98, 123.47, 92.5];
    this.ambientTimer = window.setInterval(() => {
      const note = notes[this.ambientStep++ % notes.length];
      this.tone(note, 1.1, { type: 'sine', volume: 0.012, slide: 5 });
    }, 1450);
  }

  correct() { this.startAmbient(); this.tone(440, 0.07, { type: 'triangle', volume: 0.035, slide: 110 }); }
  error() { this.tone(135, 0.13, { type: 'sawtooth', volume: 0.05, slide: -50 }); }
  cast() { this.tone(260, 0.23, { type: 'sine', volume: 0.075, slide: 700 }); this.tone(640, 0.18, { type: 'triangle', volume: 0.035, slide: 450 }); }
  hit() { this.tone(195, 0.1, { type: 'square', volume: 0.04, slide: -70 }); }
  coin() { this.tone(740, 0.09, { type: 'sine', volume: 0.04, slide: 240 }); }
  choice() { this.tone(520, 0.13, { type: 'triangle', volume: 0.055, slide: 210 }); }
  boss() { this.startAmbient(); this.tone(72, 0.7, { type: 'sawtooth', volume: 0.045, slide: -14 }); }
  destroy() { if (this.ambientTimer) window.clearInterval(this.ambientTimer); this.ambientTimer = null; }
}
