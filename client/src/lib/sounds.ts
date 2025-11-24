// Sound effects using Web Audio API

class SoundManager {
  private audioContext: AudioContext | null = null;

  private getContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Play XP gain sound - cheerful blip
  playXPGain() {
    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }

  // Play level up sound - triumphant sequence
  playLevelUp() {
    const ctx = this.getContext();
    const notes = [523.25, 659.25, 783.99]; // C, E, G chord
    const startTime = ctx.currentTime;

    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(freq, startTime + i * 0.1);
      gainNode.gain.setValueAtTime(0.2, startTime + i * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.1 + 0.3);

      oscillator.start(startTime + i * 0.1);
      oscillator.stop(startTime + i * 0.1 + 0.3);
    });
  }

  // Play achievement unlock sound - magical chime
  playAchievementUnlock() {
    const ctx = this.getContext();
    const notes = [1046.50, 1318.51, 1567.98, 2093.00]; // C6, E6, G6, C7
    const startTime = ctx.currentTime;

    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, startTime + i * 0.08);
      
      gainNode.gain.setValueAtTime(0.15, startTime + i * 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.08 + 0.5);

      oscillator.start(startTime + i * 0.08);
      oscillator.stop(startTime + i * 0.08 + 0.5);
    });
  }

  // Play streak bonus sound - energetic rising tone
  playStreakBonus() {
    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.4);
  }

  // Play button click sound - subtle click
  playClick() {
    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  }

  // Play alarm sound when timer ends - gentle but noticeable
  playTimerEnd() {
    const ctx = this.getContext();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C chord
    const startTime = ctx.currentTime;

    notes.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, startTime + i * 0.2);
      
      gainNode.gain.setValueAtTime(0.3, startTime + i * 0.2);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.2 + 0.6);

      oscillator.start(startTime + i * 0.2);
      oscillator.stop(startTime + i * 0.2 + 0.6);
    });
  }

  // Resume audio context (needed for some browsers)
  async resumeContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
}

// Ambient Music Player for focus sessions
class AmbientMusicPlayer {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private isPlaying = false;

  private getContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  async start() {
    if (this.isPlaying) return;
    
    const ctx = this.getContext();
    await ctx.resume();
    
    // Create ambient binaural-style tones
    const frequencies = [220, 329.63, 440]; // A3, E4, A4
    
    frequencies.forEach((baseFreq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const panner = ctx.createStereoPanner();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = baseFreq;
      
      gainNode.gain.value = 0;
      gainNode.gain.linearRampToValueAtTime(0.03 + i * 0.01, ctx.currentTime + 2);
      
      panner.pan.value = (i - 1) * 0.3;
      
      oscillator.connect(gainNode);
      gainNode.connect(panner);
      panner.connect(ctx.destination);
      
      oscillator.start();
      
      this.oscillators.push(oscillator);
      this.gainNodes.push(gainNode);
    });
    
    this.isPlaying = true;
  }

  stop() {
    if (!this.isPlaying) return;
    
    const ctx = this.getContext();
    
    this.gainNodes.forEach(gainNode => {
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    });
    
    setTimeout(() => {
      this.oscillators.forEach(osc => osc.stop());
      this.oscillators = [];
      this.gainNodes = [];
      this.isPlaying = false;
    }, 1100);
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  getIsPlaying() {
    return this.isPlaying;
  }
}

export const soundManager = new SoundManager();
export const ambientMusicPlayer = new AmbientMusicPlayer();
