class AudioService {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private volume: number = 0.8;
  private crowdNode: AudioNode | null = null;
  private crowdGainNode: GainNode | null = null;
  private isCrowdPlaying: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!enabled && this.isCrowdPlaying) {
      this.stopCrowdAtmosphere();
    } else if (enabled && !this.isCrowdPlaying) {
      this.startCrowdAtmosphere();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.crowdGainNode && this.ctx) {
      this.crowdGainNode.gain.setValueAtTime(0.15 * this.volume, this.ctx.currentTime);
    }
  }

  public isEnabled(): { sound: boolean; music: boolean; volume: number } {
    return {
      sound: this.soundEnabled,
      music: this.musicEnabled,
      volume: this.volume,
    };
  }

  // Button click
  public playClick() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.2 * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Ignored if audio blocked
    }
  }

  // Referee whistle
  public playWhistle() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [2800, 2980].forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.setValueAtTime(freq * 1.05, now + 0.08);
        osc.frequency.setValueAtTime(freq, now + 0.16);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3 * this.volume, now + 0.02);
        gain.gain.linearRampToValueAtTime(0.25 * this.volume, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      });
    } catch {
      // safe fallback
    }
  }

  // Ball Kick (Deep thump with leather snap)
  public playKick(powerLevel: number = 70) {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();

      const intensity = Math.max(0.4, powerLevel / 100);
      kickOsc.type = 'sine';
      kickOsc.frequency.setValueAtTime(160, now);
      kickOsc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

      kickGain.gain.setValueAtTime(0.8 * intensity * this.volume, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      kickOsc.connect(kickGain);
      kickGain.connect(this.ctx.destination);
      kickOsc.start(now);
      kickOsc.stop(now + 0.22);

      // Noise snap for the boot striking the leather
      const bufferSize = this.ctx.sampleRate * 0.06;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1400;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4 * this.volume, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.06);
    } catch {
      // safe fallback
    }
  }

  // Goalkeeper save / parry thud
  public playSave() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);

      gain.gain.setValueAtTime(0.6 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // safe fallback
    }
  }

  // Crossbar / post hit (metallic clang)
  public playPostHit() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [840, 1260, 2300].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.5 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      });
    } catch {
      // safe fallback
    }
  }

  // Goal explosion & crowd celebration cheer
  public playGoal() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Net swish / rustle sound
      const bufferSize = this.ctx.sampleRate * 0.35;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2500, now);
      filter.frequency.exponentialRampToValueAtTime(500, now + 0.35);

      const netGain = this.ctx.createGain();
      netGain.gain.setValueAtTime(0.5 * this.volume, now);
      netGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      noise.connect(filter);
      filter.connect(netGain);
      netGain.connect(this.ctx.destination);
      noise.start(now);

      // Huge stadium cheer roar
      const cheerSize = this.ctx.sampleRate * 2.2;
      const cheerBuffer = this.ctx.createBuffer(1, cheerSize, this.ctx.sampleRate);
      const cheerData = cheerBuffer.getChannelData(0);
      for (let i = 0; i < cheerSize; i++) {
        cheerData[i] = Math.random() * 2 - 1;
      }
      const cheerSource = this.ctx.createBufferSource();
      cheerSource.buffer = cheerBuffer;
      const cheerFilter = this.ctx.createBiquadFilter();
      cheerFilter.type = 'bandpass';
      cheerFilter.frequency.setValueAtTime(700, now);
      cheerFilter.Q.setValueAtTime(1.5, now);

      const cheerGain = this.ctx.createGain();
      cheerGain.gain.setValueAtTime(0.1, now);
      cheerGain.gain.linearRampToValueAtTime(0.8 * this.volume, now + 0.3);
      cheerGain.gain.exponentialRampToValueAtTime(0.01, now + 2.2);

      cheerSource.connect(cheerFilter);
      cheerFilter.connect(cheerGain);
      cheerGain.connect(this.ctx.destination);
      cheerSource.start(now);
    } catch {
      // safe fallback
    }
  }

  // Winner Fanfare & Trophy lifting chords
  public playTrophyFanfare() {
    if (!this.soundEnabled && !this.musicEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Melodic triumphal brass sequence: C4, E4, G4, C5, E5, G5
      const notes = [
        { freq: 261.63, time: 0, dur: 0.25 },
        { freq: 329.63, time: 0.25, dur: 0.25 },
        { freq: 392.00, time: 0.5, dur: 0.3 },
        { freq: 523.25, time: 0.8, dur: 0.4 },
        { freq: 659.25, time: 1.25, dur: 0.3 },
        { freq: 783.99, time: 1.6, dur: 1.4 },
      ];

      notes.forEach((note) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(note.freq, now + note.time);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, now + note.time);

        gain.gain.setValueAtTime(0, now + note.time);
        gain.gain.linearRampToValueAtTime(0.35 * this.volume, now + note.time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + note.time + note.dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + note.time);
        osc.stop(now + note.time + note.dur);
      });
    } catch {
      // safe fallback
    }
  }

  // Continuous background ambient stadium murmur
  public startCrowdAtmosphere() {
    if (!this.musicEnabled || this.isCrowdPlaying) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      // Create a 5-second pink/filtered noise loop
      const bufferSize = this.ctx.sampleRate * 5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.3;
      }

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 550;
      filter.Q.value = 0.8;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12 * this.volume, this.ctx.currentTime);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      source.start();
      this.crowdNode = source;
      this.crowdGainNode = gain;
      this.isCrowdPlaying = true;
    } catch {
      // safe fallback
    }
  }

  public stopCrowdAtmosphere() {
    if (this.crowdNode) {
      try {
        (this.crowdNode as AudioScheduledSourceNode).stop();
        this.crowdNode.disconnect();
      } catch {
        // ignore
      }
      this.crowdNode = null;
      this.crowdGainNode = null;
      this.isCrowdPlaying = false;
    }
  }
}

export const audio = new AudioService();
