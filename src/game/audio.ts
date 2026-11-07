/**
 * Diegetic Web Audio Synthesizer for The Group Project
 * Zero-dependency procedural sound effects and Kunal's Lo-Fi playlists.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMuted: boolean = false;
  private currentTrackIndex: number = 0;
  private isPlayingMusic: boolean = false;
  private musicLoopTimeout: number | null = null;
  private noiseNode: AudioNode | null = null;
  private activeOscillators: OscillatorNode[] = [];

  public tracks = [
    {
      id: 'agile_beats',
      title: 'Agile Beats to Code/Cry To Vol. 1',
      artist: 'DJ Kunal feat. Western Railway Flyover',
      bpm: 76,
      genre: 'Lo-Fi Chillhop',
      description: 'Mellow 7th chords with simulated vinyl crackle. Guaranteed to increase sprint velocity by 2.4%.',
    },
    {
      id: 'deploy_or_die',
      title: 'Deploy or Die (At 3:42 AM)',
      artist: 'Aarav & The 19 Dependencies',
      bpm: 118,
      genre: 'Vibe Synthwave',
      description: 'Urgent arpeggiated bassline for when localhost works but production refuses to acknowledge your existence.',
    },
    {
      id: 'cold_focused',
      title: 'Cold but Focused (Nikhil Focus Drone)',
      artist: 'Nikhil (Status: In a Tunnel)',
      bpm: 60,
      genre: 'Ambient Space',
      description: 'Hypnotic sub-bass waves for staring at a blank terminal until the git push miraculously passes.',
    },
    {
      id: 'tested_this',
      title: 'We Definitely Tested This',
      artist: 'Meera & The QA Symphony',
      bpm: 94,
      genre: 'Optimistic Chiptune',
      description: 'Joyful daytime groove with an uneasy undertone of unhandled promise rejections.',
    },
  ];

  constructor() {
    // AudioContext will be initialized on first user gesture
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('panic_labs_audio_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
    }
  }

  private initContext() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    } catch (e) {
      console.warn('Web Audio not supported or blocked:', e);
    }
  }

  public ensureUnlocked() {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.initContext();
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
    }
    try {
      localStorage.setItem('panic_labs_audio_muted', String(this.isMuted));
    } catch {}
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getPlayingTrack() {
    return {
      track: this.tracks[this.currentTrackIndex],
      isPlaying: this.isPlayingMusic,
      index: this.currentTrackIndex,
    };
  }

  // --- DIEGETIC SOUND EFFECTS ---

  public playClick(highPitch = false) {
    this.ensureUnlocked();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const baseFreq = highPitch ? 880 : 540;
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playNotification() {
    this.ensureUnlocked();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    // Pleasant Slack/Teams style two-tone chord
    const now = this.ctx.currentTime;
    [
      { f: 659.25, start: 0, dur: 0.12 }, // E5
      { f: 880.0, start: 0.08, dur: 0.22 }, // A5
    ].forEach(({ f, start, dur }) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + start);

      gain.gain.setValueAtTime(0.15, now + start);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + start);
      osc.stop(now + start + dur);
    });
  }

  public playBuzzer() {
    this.ensureUnlocked();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    // Comic error buzz for defects or failed builds
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.setValueAtTime(115, now + 0.08);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.24);
  }

  public playCash() {
    this.ensureUnlocked();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    // Shimmering cash register / coin ding
    const now = this.ctx.currentTime;
    const notes = [784, 987.77, 1174.66, 1567.98]; // G5, B5, D6, G6
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0.14, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.26);
    });
  }

  public playSuccess() {
    this.ensureUnlocked();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    // Rich C Major 9 victory arpeggio
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5]; // C5, E5, G5, B5, C6
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);

      gain.gain.setValueAtTime(0.16, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.5);
    });
  }

  public playGitPush() {
    this.ensureUnlocked();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playCoffee() {
    this.ensureUnlocked();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Pleasant warm coffee chord with slight bubbling modulation
    const chord = [392, 493.88, 587.33]; // G4, B4, D5
    chord.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.14, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.35);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.4);
    });
  }

  public playFoodDelivery() {
    this.ensureUnlocked();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    // Two-tone cheerful doorbell: Ding (E5) - Dong (C5)
    const bellNotes = [{ freq: 659.25, time: 0, dur: 0.35 }, { freq: 523.25, time: 0.22, dur: 0.55 }];
    bellNotes.forEach(({ freq, time, dur }) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);
      gain.gain.setValueAtTime(0.2, now + time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now + time);
      osc.stop(now + time + dur + 0.05);
    });
  }

  public playReelLike() {
    this.ensureUnlocked();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(550, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.08);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  // --- KUNAL'S PROCEDURAL MUSIC ENGINE ---

  public playTrack(index?: number) {
    this.ensureUnlocked();
    if (!this.ctx || !this.musicGain) return;

    if (typeof index === 'number') {
      this.currentTrackIndex = (index + this.tracks.length) % this.tracks.length;
    }

    this.stopMusic();
    this.isPlayingMusic = true;

    const trackId = this.tracks[this.currentTrackIndex].id;
    this.renderMusicLoop(trackId);
  }

  public pauseMusic() {
    this.stopMusic();
    this.isPlayingMusic = false;
  }

  public togglePlayPause() {
    if (this.isPlayingMusic) {
      this.pauseMusic();
    } else {
      this.playTrack(this.currentTrackIndex);
    }
    return this.isPlayingMusic;
  }

  public nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.playTrack(this.currentTrackIndex);
    return this.tracks[this.currentTrackIndex];
  }

  public prevTrack() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.playTrack(this.currentTrackIndex);
    return this.tracks[this.currentTrackIndex];
  }

  public stopMusic() {
    if (this.musicLoopTimeout !== null) {
      window.clearTimeout(this.musicLoopTimeout);
      this.musicLoopTimeout = null;
    }

    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.activeOscillators = [];

    if (this.noiseNode) {
      try {
        this.noiseNode.disconnect();
      } catch {}
      this.noiseNode = null;
    }
  }

  private renderMusicLoop(trackId: string) {
    if (!this.ctx || !this.musicGain || !this.isPlayingMusic) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    switch (trackId) {
      case 'agile_beats':
        this.playLofiChordsLoop(now);
        break;
      case 'deploy_or_die':
        this.playSynthwaveLoop(now);
        break;
      case 'cold_focused':
        this.playFocusDroneLoop(now);
        break;
      case 'tested_this':
      default:
        this.playChiptuneLoop(now);
        break;
    }
  }

  // Track 1: Lo-Fi 7th Chords
  private playLofiChordsLoop(startTime: number) {
    if (!this.ctx || !this.musicGain || !this.isPlayingMusic) return;
    const ctx = this.ctx;
    const barDuration = 3.15; // 4 bars = ~12.6s loop

    // Chord progressions (Dm9, G13, Cmaj9, Am9)
    const chords = [
      [146.83, 220.0, 261.63, 329.63, 392.0], // D3, A3, C4, E4, G4
      [196.0, 246.94, 293.66, 370.0, 440.0],  // G3, B3, D4, F#4, A4
      [130.81, 196.0, 246.94, 329.63, 392.0], // C3, G3, B3, E4, G4
      [110.0, 164.81, 220.0, 261.63, 329.63], // A2, E3, A3, C4, E4
    ];

    chords.forEach((chord, chordIdx) => {
      const chordTime = startTime + chordIdx * barDuration;

      // Warm low-pass filter for lofi character
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, chordTime);

      chord.forEach((freq, noteIdx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = noteIdx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 0.8, chordTime);

        // Gentle strum offset
        const noteStart = chordTime + noteIdx * 0.035;
        gain.gain.setValueAtTime(0, noteStart);
        gain.gain.linearRampToValueAtTime(0.035, noteStart + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + barDuration - 0.1);

        osc.connect(gain);
        gain.connect(filter);

        osc.start(noteStart);
        osc.stop(noteStart + barDuration);
        this.activeOscillators.push(osc);
      });

      filter.connect(this.musicGain!);
    });

    const totalLoopDuration = barDuration * 4;
    this.musicLoopTimeout = window.setTimeout(() => {
      if (this.isPlayingMusic) {
        this.renderMusicLoop('agile_beats');
      }
    }, totalLoopDuration * 1000 - 60);
  }

  // Track 2: 80s Synthwave Bass Arpeggio
  private playSynthwaveLoop(startTime: number) {
    if (!this.ctx || !this.musicGain || !this.isPlayingMusic) return;
    const ctx = this.ctx;
    const stepTime = 0.13; // 16th notes
    const bassNotes = [
      110, 110, 220, 164.81, 110, 110, 220, 146.83, // A2, E3, D3
      87.31, 87.31, 174.61, 130.81, 87.31, 87.31, 174.61, 146.83, // F2, C3, D3
      130.81, 130.81, 261.63, 196.0, 130.81, 130.81, 261.63, 220.0, // C3, G3, A3
      98.0, 98.0, 196.0, 146.83, 98.0, 98.0, 196.0, 164.81, // G2, D3, E3
    ];

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, startTime);
    filter.Q.setValueAtTime(3.5, startTime);
    filter.connect(this.musicGain);

    bassNotes.forEach((freq, idx) => {
      const noteTime = startTime + idx * stepTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.045, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + stepTime * 0.9);

      osc.connect(gain);
      gain.connect(filter);

      osc.start(noteTime);
      osc.stop(noteTime + stepTime);
      this.activeOscillators.push(osc);
    });

    const totalDuration = bassNotes.length * stepTime;
    this.musicLoopTimeout = window.setTimeout(() => {
      if (this.isPlayingMusic) {
        this.renderMusicLoop('deploy_or_die');
      }
    }, totalDuration * 1000 - 50);
  }

  // Track 3: Ambient Focus Drone
  private playFocusDroneLoop(startTime: number) {
    if (!this.ctx || !this.musicGain || !this.isPlayingMusic) return;
    const ctx = this.ctx;
    const loopDuration = 10;

    const dronePitches = [65.41, 98.0, 130.81, 196.0]; // C2, G2, C3, G3
    dronePitches.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.linearRampToValueAtTime(freq + (idx === 1 ? 1.5 : -1.2), startTime + loopDuration);

      gain.gain.setValueAtTime(0.02, startTime);
      gain.gain.linearRampToValueAtTime(0.06, startTime + loopDuration * 0.5);
      gain.gain.linearRampToValueAtTime(0.02, startTime + loopDuration);

      osc.connect(gain);
      gain.connect(this.musicGain!);

      osc.start(startTime);
      osc.stop(startTime + loopDuration);
      this.activeOscillators.push(osc);
    });

    this.musicLoopTimeout = window.setTimeout(() => {
      if (this.isPlayingMusic) {
        this.renderMusicLoop('cold_focused');
      }
    }, loopDuration * 1000 - 60);
  }

  // Track 4: Optimistic Chiptune Daytime
  private playChiptuneLoop(startTime: number) {
    if (!this.ctx || !this.musicGain || !this.isPlayingMusic) return;
    const ctx = this.ctx;
    const stepTime = 0.22;
    const melody = [
      523.25, 659.25, 783.99, 1046.5, 880.0, 783.99, 659.25, 587.33,
      523.25, 659.25, 783.99, 987.77, 783.99, 659.25, 523.25, 0,
    ];

    melody.forEach((freq, idx) => {
      if (freq === 0) return;
      const noteTime = startTime + idx * stepTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.025, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + stepTime * 0.85);

      osc.connect(gain);
      gain.connect(this.musicGain!);

      osc.start(noteTime);
      osc.stop(noteTime + stepTime);
      this.activeOscillators.push(osc);
    });

    const totalDuration = melody.length * stepTime;
    this.musicLoopTimeout = window.setTimeout(() => {
      if (this.isPlayingMusic) {
        this.renderMusicLoop('tested_this');
      }
    }, totalDuration * 1000 - 40);
  }
}

export const sound = new SoundEngine();

