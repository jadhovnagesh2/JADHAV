import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { TRACKS } from '../constants';

interface MusicPlayerProps {
  currentTrackIndex: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  currentTrackIndex, 
  isPlaying, 
  onTogglePlay, 
  onNext, 
  onPrev 
}) => {
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => onTogglePlay());
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setProgress(val);
    if (audioRef.current) {
      audioRef.current.currentTime = (val / 100) * (audioRef.current.duration || 0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full grid grid-cols-[1fr_2fr_1fr] items-center gap-12">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onNext}
      />

      {/* Track Info */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-stat-bg border border-white/10 shrink-0 relative overflow-hidden">
           <img src={currentTrack.cover} className="w-full h-full object-cover grayscale opacity-60" />
           <div className="absolute inset-0 bg-matrix-green/10" />
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="text-sm font-black uppercase tracking-widest truncate">{currentTrack.title}</h4>
          <p className="text-[10px] font-mono opacity-50 uppercase tracking-[2px] truncate">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Controls & Progress */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-12">
          <button onClick={onPrev} className="text-white/60 hover:text-matrix-green transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button 
            onClick={onTogglePlay}
            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-matrix-green transition-colors shadow-[0_0_15px_#fff]"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-0.5" />}
          </button>
          <button onClick={onNext} className="text-white/60 hover:text-matrix-green transition-colors">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>

        <div className="w-full flex flex-col gap-1">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-matrix-green"
          />
          <div className="flex justify-between text-[8px] font-mono opacity-30 tracking-[1px]">
            <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
            <span>{formatTime(audioRef.current?.duration || 0)}</span>
          </div>
        </div>
      </div>

      {/* Volume / Extra */}
      <div className="flex justify-end items-center gap-6 text-white/40">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono tracking-widest">VOL</span>
          <div className="w-24 h-0.5 bg-white/10 relative">
             <div className="absolute left-0 top-0 h-full bg-white w-[70%]" />
          </div>
        </div>
        <Volume2 className="w-4 h-4" />
      </div>
    </div>
  );
};
