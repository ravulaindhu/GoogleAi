/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 overflow-hidden relative font-terminal">
      {/* Overlays */}
      <div className="static-noise" />
      <div className="scanlines" />
      
      <header className="mb-8 text-center z-10 mt-8">
        <h1 
          className="text-5xl md:text-7xl font-pixel glitch text-white uppercase tracking-tighter"
          data-text="SYS.OVERRIDE"
        >
          SYS.OVERRIDE
        </h1>
        <p className="text-cyan-glitch font-terminal mt-4 tracking-[0.3em] text-lg uppercase bg-magenta-glitch/20 inline-block px-2 border border-cyan-glitch">
          &gt; EXECUTE: SNAKE.EXE
        </p>
      </header>

      <main className="flex flex-col xl:flex-row items-center justify-center gap-16 z-10 w-full max-w-6xl">
        <div className="flex-1 flex justify-center glitch-box">
          <SnakeGame onScoreChange={setScore} />
        </div>
        
        <div className="flex flex-col items-center xl:items-start gap-12 w-full max-w-md">
          <div className="w-full bg-black border-2 border-magenta-glitch p-6 hard-shadow relative">
            <div className="absolute -top-3 left-4 bg-black px-2 text-magenta-glitch font-pixel text-sm">
              [ MEMORY_DUMP ]
            </div>
            <h2 className="text-cyan-glitch font-terminal text-xl mb-2 uppercase tracking-widest border-b-2 border-cyan-glitch/50 pb-2 border-dashed">
              &gt; ALLOCATED_SCORE
            </h2>
            <div className="flex justify-between items-end mt-4">
              <span className="text-white text-lg uppercase tracking-wider animate-pulse">HEX_VAL:</span>
              <span className="text-5xl font-pixel text-magenta-glitch">
                {score.toString().padStart(4, '0')}
              </span>
            </div>
          </div>

          <div className="w-full glitch-box" style={{ animationDelay: '0.5s' }}>
            <MusicPlayer />
          </div>
        </div>
      </main>
      
      <footer className="fixed bottom-2 left-2 z-10 text-cyan-glitch/50 font-terminal text-sm">
        V. 9.9.9 // UNAUTHORIZED ACCESS DETECTED
      </footer>
    </div>
  );
}
