import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: "ERR_01: NOISE_FLOOR",
    artist: "SYS.ADMIN",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:12"
  },
  {
    id: 2,
    title: "CORRUPT_SECTOR_9",
    artist: "UNKNOWN_ENTITY",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "7:05"
  },
  {
    id: 3,
    title: "KERNEL_PANIC",
    artist: "DAEMON_PROCESS",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:44"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full max-w-md bg-black border-2 border-cyan-glitch p-6 hard-shadow-sm font-terminal relative">
      <div className="absolute -top-3 right-4 bg-black px-2 text-cyan-glitch font-pixel text-sm border border-cyan-glitch">
        [ AUDIO_STREAM ]
      </div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="flex flex-col mb-6 border-b-2 border-magenta-glitch pb-4 border-dashed">
        <h3 className="text-white font-pixel text-lg uppercase tracking-wide mb-1">
          &gt; {currentTrack.title}
        </h3>
        <p className="text-cyan-glitch text-md uppercase">
          SRC: {currentTrack.artist}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-4 bg-black border border-cyan-glitch mb-6 relative">
        <div 
          className="h-full bg-magenta-glitch transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-between px-2 text-xs text-white mix-blend-difference pointer-events-none">
          <span>{Math.floor(progress)}%</span>
          <span>{currentTrack.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button 
          onClick={toggleMute}
          className="text-cyan-glitch hover:bg-cyan-glitch hover:text-black px-2 py-1 border border-transparent hover:border-cyan-glitch transition-none uppercase"
        >
          {isMuted ? '[ UNMUTE ]' : '[ MUTE ]'}
        </button>

        <div className="flex items-center space-x-4">
          <button 
            onClick={handlePrev}
            className="text-magenta-glitch hover:bg-magenta-glitch hover:text-black px-2 py-1 border border-transparent hover:border-magenta-glitch transition-none"
          >
            [ &lt;&lt; ]
          </button>
          
          <button 
            onClick={togglePlay}
            className="text-white hover:bg-white hover:text-black px-4 py-1 border border-white transition-none font-bold"
          >
            {isPlaying ? '[ || ]' : '[ > ]'}
          </button>
          
          <button 
            onClick={handleNext}
            className="text-magenta-glitch hover:bg-magenta-glitch hover:text-black px-2 py-1 border border-transparent hover:border-magenta-glitch transition-none"
          >
            [ &gt;&gt; ]
          </button>
        </div>
      </div>
    </div>
  );
}
