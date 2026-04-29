import React from 'react';
import { motion } from 'motion/react';
import { Music } from 'lucide-react';
import { TRACKS } from '../constants';

interface PlaylistProps {
  currentTrackIndex: number;
  onTrackSelect: (index: number) => void;
  isPlaying: boolean;
}

export const Playlist: React.FC<PlaylistProps> = ({ currentTrackIndex, onTrackSelect, isPlaying }) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[10px] uppercase tracking-[4px] text-white/40 mb-4 px-2">Current_Playlist</h3>
      {TRACKS.map((track, idx) => (
        <button
          key={track.id}
          onClick={() => onTrackSelect(idx)}
          className={`w-full flex items-center gap-4 p-4 rounded-sm transition-all group border-l-2 ${
            idx === currentTrackIndex 
              ? 'bg-matrix-green/5 border-matrix-green text-white' 
              : 'hover:bg-white/5 border-transparent text-white/50'
          }`}
        >
          <div className="w-10 h-10 bg-black border border-white/10 flex items-center justify-center shrink-0">
             {idx === currentTrackIndex && isPlaying ? (
                <div className="flex items-end gap-0.5 h-3">
                  {[0.4, 0.7, 0.3, 0.8].map((s, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ['20%', '100%', '40%'] }}
                      transition={{ duration: s + 0.2, repeat: Infinity, repeatType: 'mirror' }}
                      className="w-1 bg-matrix-green"
                    />
                  ))}
                </div>
             ) : (
               <Music className="w-4 h-4 opacity-30" />
             )}
          </div>
          <div className="flex flex-col items-start overflow-hidden">
            <span className="text-xs font-black uppercase tracking-widest truncate w-full">{track.title}</span>
            <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest truncate w-full">{track.artist}</span>
          </div>
        </button>
      ))}
    </div>
  );
};
