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

// Nature Sound Player using actual audio files
class NatureSoundPlayer {
  private audioElement: HTMLAudioElement | null = null;
  private isPlaying = false;
  private currentSoundIndex = 0;
  private soundTracks = [
    '/audio/forest-ambience.mp3',
    '/audio/rain-forest.mp3'
  ];

  private initAudio() {
    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.loop = true;
      this.audioElement.volume = 0.3;
    }
    return this.audioElement;
  }

  async start() {
    if (this.isPlaying) return;
    
    try {
      const audio = this.initAudio();
      const track = this.soundTracks[this.currentSoundIndex];
      audio.src = track;
      
      // Fade in
      audio.volume = 0;
      await audio.play().catch(err => console.log('Audio play error:', err));
      
      // Smooth fade in
      const fadeInterval = setInterval(() => {
        if (audio.volume < 0.3) {
          audio.volume = Math.min(0.3, audio.volume + 0.05);
        } else {
          clearInterval(fadeInterval);
        }
      }, 100);
      
      this.isPlaying = true;
    } catch (err) {
      console.error('Failed to start nature sounds:', err);
    }
  }

  stop() {
    if (!this.isPlaying || !this.audioElement) return;
    
    // Fade out
    const fadeOutInterval = setInterval(() => {
      if (this.audioElement!.volume > 0) {
        this.audioElement!.volume = Math.max(0, this.audioElement!.volume - 0.05);
      } else {
        this.audioElement!.pause();
        clearInterval(fadeOutInterval);
        this.isPlaying = false;
      }
    }, 100);
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
export const ambientMusicPlayer = new NatureSoundPlayer();
