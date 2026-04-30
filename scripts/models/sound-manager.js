// Synthesizes and plays game sounds using the Web Audio API
class SoundManager {
  constructor() {
    this.muted = localStorage.getItem('c4:soundMuted') === 'true';
    this._context = null;
  }

  get context() {
    if (!this._context) {
      this._context = new AudioContext();
    }
    return this._context;
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('c4:soundMuted', this.muted);
    return this.muted;
  }

  // Play a single oscillator tone with a quick attack/decay envelope
  _playTone({ frequency, type = 'sine', startTime, duration, gain = 0.25 }) {
    const ctx = this.context;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, startTime);
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
  }

  // Short thud when a chip is dropped
  drop() {
    if (this.muted) return;
    const now = this.context.currentTime;
    this._playTone({ frequency: 280, startTime: now, duration: 0.08, gain: 0.3 });
    this._playTone({ frequency: 160, startTime: now + 0.03, duration: 0.18, gain: 0.2 });
  }

  // Ascending arpeggio when a player wins
  win() {
    if (this.muted) return;
    const now = this.context.currentTime;
    [523, 659, 784, 1047].forEach((freq, i) => {
      this._playTone({ frequency: freq, startTime: now + i * 0.11, duration: 0.28, gain: 0.22 });
    });
  }

  // Two descending tones for a tie
  tie() {
    if (this.muted) return;
    const now = this.context.currentTime;
    this._playTone({ frequency: 392, startTime: now, duration: 0.22, gain: 0.2 });
    this._playTone({ frequency: 311, startTime: now + 0.18, duration: 0.32, gain: 0.18 });
  }
}

export default new SoundManager();
