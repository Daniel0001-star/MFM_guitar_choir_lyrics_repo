import React, { useState, useEffect, useMemo, useRef } from 'react';
import { DashboardTab, Song } from '../types';
import { RepositoryList } from './RepositoryList';
import { SongGenerator } from './SongGenerator';
import { Tuner } from './Tuner';
import { SpotifyPlayer } from './SpotifyPlayer';
import { MusicPlayerBar } from './MusicPlayerBar';
import { PitchGame } from './PitchGame';
import { UploadForm } from './UploadForm'; // Import the new component
import { 
  Library, 
  UploadCloud, 
  LogOut,
  Guitar, 
  Sparkles,
  Mic2,
  Sun,
  Moon,
  Headphones,
  Gamepad2
} from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
  userName: string;
}

// Cosmology Effect Component with Motion
const StarField = () => {
  // Generate random stars once
  const stars = useMemo(() => {
    return [...Array(150)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 30 + 20, // 20-50s duration for slow drift
      delay: Math.random() * 20,
      opacity: Math.random() * 0.7 + 0.3,
      // Rainbow colors
      color: `hsl(${Math.random() * 360}, 100%, 75%)`
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <style>{`
        @keyframes space-drift {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: var(--target-opacity); }
          90% { opacity: var(--target-opacity); }
          100% { transform: translateY(-150px) translateX(-20px); opacity: 0; }
        }
      `}</style>
      
      {stars.map((star) => (
        <div 
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            boxShadow: `0 0 ${star.size + 1}px ${star.color}`,
            opacity: 0,
            '--target-opacity': star.opacity,
            animation: `space-drift ${star.duration}s linear infinite`,
            animationDelay: `-${star.delay}s`
          } as React.CSSProperties}
        />
      ))}
      
      {/* Cosmic Dust / Nebulae */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px] mix-blend-screen animate-pulse" style={{ animationDuration: '15s' }} />
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, userName }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.REPOSITORY);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Global Player State
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const backgroundAudioRef = useRef<HTMLAudioElement>(null);

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Toggle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Voice Welcome Effect
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`Welcome, ${userName}, to the Guitar Choir lyrics repository`);
      utterance.rate = 0.9; 
      utterance.pitch = 1;
      utterance.volume = 1;
      const timer = setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 500);
      return () => {
        clearTimeout(timer);
        window.speechSynthesis.cancel();
      };
    }
  }, [userName]);

  // Background Music Effect
  useEffect(() => {
    const audio = backgroundAudioRef.current;
    if (audio) {
      audio.volume = 0.2; // Set a low volume for background music
      audio.play().catch(error => {
        console.log("Background audio autoplay was prevented. User interaction is required.", error);
      });
    }
  }, []);

  // Pause background music when a song is played
  useEffect(() => {
    const audio = backgroundAudioRef.current;
    if (audio) {
      if (isPlaying && currentSong) {
        audio.pause();
      } else if (audio.paused) {
        audio.play().catch(e => console.log("BG audio resume failed", e));
      }
    }
  }, [isPlaying, currentSong]);

  return (
    <div className="flex h-screen w-full transition-colors duration-300 dark:bg-slate-950 bg-gray-50 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-indigo-950 dark:via-slate-950 dark:to-black text-slate-900 dark:text-white overflow-hidden relative">
      
      {/* Background Music Player */}
      <audio 
        ref={backgroundAudioRef} 
        src="https://cdn.pixabay.com/audio/2022/10/18/audio_731a559272.mp3"
        loop 
        preload="auto"
      />

      {/* Background Stars - Only visible in dark mode primarily, or subtle in light */}
      {isDarkMode && <StarField />}

      {/* Sidebar */}
      <aside className="w-20 lg:w-64 flex flex-col border-r dark:border-white/10 border-gray-200 dark:bg-slate-900/50 bg-white/80 backdrop-blur-xl z-20 transition-all">
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b dark:border-white/10 border-gray-200">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20 group">
             {/* Guitar Icon */}
             <Guitar className="text-white w-6 h-6 group-hover:scale-110 transition-transform" />
          </div>
          <span className="ml-3 font-bold text-xl brand-font hidden lg:block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-200 dark:to-white">
            Guitar Choir
          </span>
        </div>

        <nav className="flex-1 py-8 flex flex-col gap-2 px-2 lg:px-4">
          <button
            onClick={() => setActiveTab(DashboardTab.REPOSITORY)}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
              activeTab === DashboardTab.REPOSITORY 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-purple-600 dark:hover:text-white'
            }`}
          >
            <Library size={20} />
            <span className="hidden lg:block font-medium">Repository</span>
          </button>

          <button
            onClick={() => setActiveTab(DashboardTab.SPOTIFY)}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
              activeTab === DashboardTab.SPOTIFY
                ? 'bg-[#1DB954] text-black font-semibold shadow-lg shadow-[#1DB954]/20' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#1DB954] dark:hover:text-[#1DB954]'
            }`}
          >
            <Headphones size={20} />
            <span className="hidden lg:block font-medium">Spotify Player</span>
          </button>
          
          <button
            onClick={() => setActiveTab(DashboardTab.GENERATOR)}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
              activeTab === DashboardTab.GENERATOR
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-purple-600 dark:hover:text-white'
            }`}
          >
            <Sparkles size={20} />
            <span className="hidden lg:block font-medium">Lyrics Generator</span>
          </button>

          <button
            onClick={() => setActiveTab(DashboardTab.TUNER)}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
              activeTab === DashboardTab.TUNER
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-purple-600 dark:hover:text-white'
            }`}
          >
            <Mic2 size={20} />
            <span className="hidden lg:block font-medium">Tuner</span>
          </button>
          
          <button
            onClick={() => setActiveTab(DashboardTab.GAME)}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
              activeTab === DashboardTab.GAME
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-purple-600 dark:hover:text-white'
            }`}
          >
            <Gamepad2 size={20} />
            <span className="hidden lg:block font-medium">Pitch Game</span>
          </button>

          <button
            onClick={() => setActiveTab(DashboardTab.UPLOAD)}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
              activeTab === DashboardTab.UPLOAD
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-purple-600 dark:hover:text-white'
            }`}
          >
            <UploadCloud size={20} />
            <span className="hidden lg:block font-medium">Upload Songs</span>
          </button>
        </nav>

        <div className="p-4 border-t dark:border-white/10 border-gray-200 space-y-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center gap-3 p-3 w-full rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span className="hidden lg:block font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          
          <button
            onClick={onLogout}
            className="flex items-center gap-3 p-3 w-full rounded-xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 transition-colors"
          >
            <LogOut size={20} />
            <span className="hidden lg:block font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* Top Gradient Overlay */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b dark:from-indigo-900/20 from-purple-100/50 to-transparent pointer-events-none" />

        {/* Content Container */}
        <div className={`flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 relative z-10 ${currentSong ? 'pb-32' : ''}`}>
          <div className="max-w-6xl mx-auto">
            
            {/* Header Area */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-purple-300 mb-1">Welcome, {userName}!</h2>
              <h1 className="text-3xl font-bold mb-2 dark:text-white text-gray-900 relative">
                {activeTab === DashboardTab.REPOSITORY && "Repository"}
                {activeTab === DashboardTab.SPOTIFY && "Spotify Music Player"}
                {activeTab === DashboardTab.GENERATOR && "Lyrics Generator"}
                {activeTab === DashboardTab.TUNER && "Instrument Tuner"}
                {activeTab === DashboardTab.GAME && "Pitch Perfect"}
                {activeTab === DashboardTab.UPLOAD && "Upload New Song"}
              </h1>
              <div className={`h-1 w-20 rounded-full ${activeTab === DashboardTab.SPOTIFY ? 'bg-[#1DB954]' : 'bg-purple-600'}`} />
            </div>

            {/* View Switching */}
            {activeTab === DashboardTab.REPOSITORY && (
              <RepositoryList onPlaySong={handlePlaySong} />
            )}

            {activeTab === DashboardTab.SPOTIFY && (
              <SpotifyPlayer 
                currentSong={currentSong} 
                isPlaying={isPlaying} 
                onTogglePlay={togglePlay}
              />
            )}
            
            {activeTab === DashboardTab.GENERATOR && <SongGenerator />}
            
            {activeTab === DashboardTab.TUNER && <Tuner />}
            
            {activeTab === DashboardTab.GAME && <PitchGame />}
            
            {activeTab === DashboardTab.UPLOAD && (
              <UploadForm onUploadSuccess={() => setActiveTab(DashboardTab.REPOSITORY)} />
            )}
          </div>
        </div>

        {/* Global Music Player Bar */}
        <MusicPlayerBar 
          currentSong={currentSong}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          onNext={() => {}} // Placeholder
          onPrev={() => {}} // Placeholder
        />
      </main>
    </div>
  );
};