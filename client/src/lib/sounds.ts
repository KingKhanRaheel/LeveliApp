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

// Nature Sound Player for focus sessions
class NatureSoundPlayer {
  private audioContext: AudioContext | null = null;
  private isPlaying = false;
  private nodes: { node: AudioNode; type: string }[] = [];
  private currentSoundType = 0;
  private soundTypes = ['rain', 'forest', 'wind', 'crickets'];
  private switchInterval: NodeJS.Timeout | null = null;

  private getContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private createNoiseBuffer(ctx: AudioContext, duration: number = 2): AudioBuffer {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private playRain() {
    const ctx = this.getContext();
    const noiseBuffer = this.createNoiseBuffer(ctx);
    
    for (let i = 0; i < 3; i++) {
      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 800 + i * 400;
      filter.Q.value = 0.5;
      
      const gain = ctx.createGain();
      gain.gain.value = 0.08 - i * 0.02;
      
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();
      
      this.nodes.push({ node: source, type: 'rain' });
    }
  }

  private playForest() {
    const ctx = this.getContext();
    
    // Create forest ambience with multiple layers
    // Low rumbling layer
    const baseOsc = ctx.createOscillator();
    const baseLpf = ctx.createBiquadFilter();
    const baseGain = ctx.createGain();
    
    baseOsc.type = 'sine';
    baseOsc.frequency.value = 60;
    baseGain.gain.value = 0.05;
    
    baseLpf.type = 'lowpass';
    baseLpf.frequency.value = 200;
    
    baseOsc.connect(baseLpf);
    baseLpf.connect(baseGain);
    baseGain.connect(ctx.destination);
    baseOsc.start();
    
    this.nodes.push({ node: baseOsc, type: 'forest' });

    // Bird-like chirps (using filtered noise bursts)
    for (let i = 0; i < 2; i++) {
      const chirpOsc = ctx.createOscillator();
      const chirpGain = ctx.createGain();
      
      chirpOsc.type = 'sine';
      chirpOsc.frequency.setValueAtTime(1500 + Math.random() * 1000, ctx.currentTime);
      chirpOsc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5);
      
      chirpGain.gain.setValueAtTime(0.03, ctx.currentTime);
      chirpGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      
      chirpOsc.connect(chirpGain);
      chirpGain.connect(ctx.destination);
      
      chirpOsc.start();
      chirpOsc.stop(ctx.currentTime + 0.5);
      
      this.nodes.push({ node: chirpOsc, type: 'forest' });
    }

    // Rustling noise
    const rustleBuffer = this.createNoiseBuffer(ctx);
    const rustleSource = ctx.createBufferSource();
    rustleSource.buffer = rustleBuffer;
    rustleSource.loop = true;
    
    const rustleFilter = ctx.createBiquadFilter();
    rustleFilter.type = 'bandpass';
    rustleFilter.frequency.value = 4000;
    rustleFilter.Q.value = 1;
    
    const rustleGain = ctx.createGain();
    rustleGain.gain.value = 0.04;
    
    rustleSource.connect(rustleFilter);
    rustleFilter.connect(rustleGain);
    rustleGain.connect(ctx.destination);
    rustleSource.start();
    
    this.nodes.push({ node: rustleSource, type: 'forest' });
  }

  private playWind() {
    const ctx = this.getContext();
    const noiseBuffer = this.createNoiseBuffer(ctx);
    
    // Create layers of filtered wind noise
    for (let i = 0; i < 2; i++) {
      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1200 - i * 400;
      filter.Q.value = 0.3;
      
      const gain = ctx.createGain();
      gain.gain.value = 0.06 - i * 0.01;
      
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();
      
      this.nodes.push({ node: source, type: 'wind' });
    }

    // Subtle wind whooshes
    const whooshOsc = ctx.createOscillator();
    const whooshGain = ctx.createGain();
    
    whooshOsc.type = 'sine';
    whooshOsc.frequency.setValueAtTime(300, ctx.currentTime);
    whooshOsc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 2);
    
    whooshGain.gain.setValueAtTime(0.02, ctx.currentTime);
    whooshGain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 2);
    
    whooshOsc.connect(whooshGain);
    whooshGain.connect(ctx.destination);
    whooshOsc.start();
    
    this.nodes.push({ node: whooshOsc, type: 'wind' });
  }

  private playCrickets() {
    const ctx = this.getContext();
    
    // Cricket chirping sounds
    for (let i = 0; i < 3; i++) {
      const chirpOsc = ctx.createOscillator();
      const chirpGain = ctx.createGain();
      
      chirpOsc.type = 'sine';
      chirpOsc.frequency.value = 4000 + Math.random() * 1000;
      
      chirpGain.gain.value = 0;
      
      // Rapid on-off pattern for cricket sound
      const startTime = ctx.currentTime + i * 0.5;
      for (let j = 0; j < 5; j++) {
        chirpGain.gain.setValueAtTime(0.04, startTime + j * 0.1);
        chirpGain.gain.setValueAtTime(0, startTime + j * 0.1 + 0.05);
      }
      
      chirpOsc.connect(chirpGain);
      chirpGain.connect(ctx.destination);
      
      chirpOsc.start();
      chirpOsc.stop(ctx.currentTime + 5);
      
      this.nodes.push({ node: chirpOsc, type: 'crickets' });
    }
  }

  private stopAllNodes() {
    const ctx = this.getContext();
    this.nodes.forEach(({ node }) => {
      if (node instanceof OscillatorNode) {
        node.stop();
      } else if (node instanceof AudioBufferSourceNode) {
        node.stop();
      }
    });
    this.nodes = [];
  }

  async start() {
    if (this.isPlaying) return;
    
    const ctx = this.getContext();
    await ctx.resume();
    
    this.isPlaying = true;
    this.currentSoundType = 0;
    this.playNextSound();
    
    // Switch sounds every 20 seconds
    this.switchInterval = setInterval(() => {
      this.stopAllNodes();
      this.currentSoundType = (this.currentSoundType + 1) % this.soundTypes.length;
      this.playNextSound();
    }, 20000);
  }

  private playNextSound() {
    if (!this.isPlaying) return;
    
    const soundType = this.soundTypes[this.currentSoundType];
    
    switch (soundType) {
      case 'rain':
        this.playRain();
        break;
      case 'forest':
        this.playForest();
        break;
      case 'wind':
        this.playWind();
        break;
      case 'crickets':
        this.playCrickets();
        break;
    }
  }

  stop() {
    if (!this.isPlaying) return;
    
    this.isPlaying = false;
    
    if (this.switchInterval) {
      clearInterval(this.switchInterval);
      this.switchInterval = null;
    }
    
    const ctx = this.getContext();
    
    // Fade out all nodes
    this.nodes.forEach(({ node }) => {
      if (node instanceof GainNode) {
        node.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
      }
    });
    
    setTimeout(() => {
      this.stopAllNodes();
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
export const ambientMusicPlayer = new NatureSoundPlayer();
