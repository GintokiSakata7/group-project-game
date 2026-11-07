import { useState, useEffect } from 'react';
import {
  Disc3,
  FastForward,
  Headphones,
  Music,
  Pause,
  Play,
  Rewind,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { sound } from '../game/audio';
import { AppHeading, Pill } from './shared';

export default function MusicApp() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  useEffect(() => {
    const status = sound.getPlayingTrack();
    setIsPlaying(status.isPlaying);
    setCurrentIdx(status.index);
    setIsMuted(sound.getMuted());
  }, []);

  const tracks = sound.tracks;
  const track = tracks[currentIdx];

  const handleTogglePlay = () => {
    sound.playClick();
    const playing = sound.togglePlayPause();
    setIsPlaying(playing);
  };

  const handleNext = () => {
    sound.playClick();
    const next = sound.nextTrack();
    setCurrentIdx(sound.getPlayingTrack().index);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    sound.playClick();
    sound.prevTrack();
    setCurrentIdx(sound.getPlayingTrack().index);
    setIsPlaying(true);
  };

  const handleSelectTrack = (index: number) => {
    sound.playClick();
    sound.playTrack(index);
    setCurrentIdx(index);
    setIsPlaying(true);
  };

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    sound.playClick();
  };

  return (
    <div className="app-scroll music-app">
      <AppHeading
        kicker="AUDIO WORKSTATION / PANICBEATS"
        title="PanicBeats · Kunal's Lo-Fi Jukebox"
        subtitle="Music to code, cry, and deploy to. Curated with unearned optimism."
        right={
          <button className={`music-mute-btn ${isMuted ? 'is-muted' : ''}`} onClick={handleToggleMute}>
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span>{isMuted ? 'MUTED' : 'AUDIO ON'}</span>
          </button>
        }
      />

      <div className="music-hero-card">
        {/* Spinning Vinyl Record Visual */}
        <div className="music-vinyl-container">
          <div className={`music-vinyl ${isPlaying && !isMuted ? 'is-spinning' : ''}`}>
            <div className="vinyl-grooves" />
            <div className="vinyl-label">
              <Disc3 size={32} />
              <small>PANIC LABS</small>
            </div>
          </div>
        </div>

        {/* Current Track Info */}
        <div className="music-track-details">
          <div className="music-genre-row">
            <Pill tone="blue">{track.genre}</Pill>
            <span className="music-bpm">{track.bpm} BPM</span>
          </div>

          <h2>{track.title}</h2>
          <strong className="music-artist">{track.artist}</strong>
          <p className="music-description">{track.description}</p>

          {/* Equalizer Visualizer Bars */}
          <div className="music-eq-bars">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bar) => (
              <span
                key={bar}
                className={`eq-bar ${isPlaying && !isMuted ? 'is-dancing' : ''}`}
                style={{
                  animationDelay: `${(bar * 0.12) % 0.8}s`,
                  animationDuration: `${0.4 + (bar % 3) * 0.25}s`,
                }}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="music-controls-row">
            <button className="music-btn" onClick={handlePrev} title="Previous track">
              <Rewind size={18} />
            </button>
            <button className="music-btn-play" onClick={handleTogglePlay} title="Play / Pause">
              {isPlaying && !isMuted ? <Pause size={22} /> : <Play size={22} />}
            </button>
            <button className="music-btn" onClick={handleNext} title="Next track">
              <FastForward size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Playlist Grid */}
      <section className="music-playlist-section">
        <div className="playlist-heading">
          <Headphones size={16} />
          <strong>KUNAL'S OFFICIAL PLAYLIST SELECTION</strong>
          <small>Generated in real-time via Web Audio synthesizer</small>
        </div>

        <div className="music-track-list">
          {tracks.map((t, idx) => (
            <button
              key={t.id}
              className={`music-track-row ${currentIdx === idx ? 'is-active' : ''}`}
              onClick={() => handleSelectTrack(idx)}
            >
              <div className="track-number">
                {currentIdx === idx && isPlaying && !isMuted ? '▶' : `0${idx + 1}`}
              </div>
              <div className="track-meta">
                <strong>{t.title}</strong>
                <small>{t.artist}</small>
              </div>
              <div className="track-genre-tag">{t.genre}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Kunal Note */}
      <div className="music-kunal-quote">
        <Sparkles size={16} />
        <div>
          <b>Kunal's Note (Client Relations & Hype):</b>
          <p>
            “Music doesn't fix memory leaks, but it definitely makes the error stack trace feel more cinematic. Keep vibing legends!”
          </p>
        </div>
      </div>
    </div>
  );
}

