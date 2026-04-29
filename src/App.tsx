/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Playlist } from './components/Playlist';
import { Activity, Gamepad2, Headphones } from 'lucide-react';
import { motion } from 'motion/react';
import { TRACKS } from './constants';

export default function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  const prevTrack = () => setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);

  return (
    <div className="h-screen w-screen bg-dark-bg text-white font-sans flex flex-col overflow-hidden">
      {/* Scanline Effect */}
      <div className="fixed inset-0 scanline z-50 pointer-events-none opacity-20" />

      {/* Header */}
      <header className="h-20 border-b border-border-dark flex items-center justify-between px-8 bg-panel-bg shrink-0">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black tracking-[4px] text-matrix-green shadow-[0_0_10px_rgba(0,255,65,0.3)] uppercase">Synth_Snake_V1</h1>
          <span className="text-[10px] text-matrix-green opacity-50 font-mono tracking-[2px] uppercase">Authorized_User_Only</span>
        </div>
        <div className="flex items-center gap-8 text-[10px] font-mono tracking-[2px] text-white/40">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-matrix-green animate-pulse shadow-[0_0_8px_#00ff41]" />
             <span>UPLINK: ACTIVE</span>
           </div>
           <span>FPS: 60.00</span>
           <span>LATENCY: 14MS</span>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="flex-1 grid grid-cols-[300px_1fr_300px] gap-[2px] bg-border-dark overflow-hidden">
        {/* Left Panel: Playlist */}
        <aside className="bg-panel-bg p-8 flex flex-col overflow-y-auto border-r border-border-dark">
          <Playlist 
            currentTrackIndex={currentTrackIndex} 
            onTrackSelect={(idx) => {
              setCurrentTrackIndex(idx);
              setIsPlaying(true);
            }} 
            isPlaying={isPlaying} 
          />

          <div className="mt-auto pt-8">
             <div className="p-6 border border-matrix-green/10 bg-matrix-green/5 rounded-sm">
                <p className="text-[10px] leading-relaxed text-white/40 font-mono italic">
                  "Collect Magenta orbs to increase system throughput. Maintain high-speed execution for optimal score yields."
                </p>
             </div>
          </div>
        </aside>

        {/* Center: Main Game View */}
        <main className="bg-dark-bg flex items-center justify-center p-8 relative">
           <SnakeGame 
            onScoreChange={setScore}
            onHighScoreChange={setHighScore}
           />
        </main>

        {/* Right Panel: Stats */}
        <aside className="bg-panel-bg p-8 flex flex-col gap-6 border-l border-border-dark">
          <h3 className="text-[10px] uppercase tracking-[4px] text-white/40 mb-2">Live_Telemetry</h3>
          
          <div className="stat-card">
            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-mono">Current_Yield</div>
            <div className="text-4xl font-black text-white font-mono tracking-tighter">
              {score.toString().padStart(6, '0')}
            </div>
          </div>

          <div className="stat-card">
            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-mono">System_Peak</div>
            <div className="text-2xl font-black text-matrix-green font-mono">
              {highScore.toString().padStart(6, '0')}
            </div>
          </div>

          <div className="stat-card border-neon-pink/20">
            <div className="text-[10px] text-neon-pink opacity-60 uppercase tracking-widest mb-2 font-mono">Multiplier</div>
            <div className="text-4xl font-black text-neon-pink font-mono shadow-[0_0_10px_rgba(255,0,255,0.2)]">X4.2</div>
          </div>

          <div className="mt-auto h-12 bg-matrix-green/10 border border-matrix-green/30 flex items-center justify-center text-matrix-green font-black tracking-[2px] text-xs uppercase italic">
             Interface_Stable
          </div>
        </aside>
      </div>

      {/* Footer: Player Bar */}
      <footer className="h-32 border-t border-border-dark bg-panel-bg px-8 relative shrink-0">
         <MusicPlayer 
            currentTrackIndex={currentTrackIndex}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            onNext={nextTrack}
            onPrev={prevTrack}
         />
      </footer>
    </div>
  );
}
