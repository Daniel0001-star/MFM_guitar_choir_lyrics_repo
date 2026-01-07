import React, { useState } from 'react';
import { Song } from '../types';
import { ArrowLeft, Play, Pause, Music, FileText, Download, Languages } from 'lucide-react';

interface SongDetailProps {
  song: Song;
  onBack: () => void;
  // Add this prop to communicate with your global music player
  onPlayPart: (url: string) => void; 
}

export const SongDetail: React.FC<SongDetailProps> = ({ song, onBack, onPlayPart }) => {
  const [activePart, setActivePart] = useState<string | null>(null);
  
  // Maps the display name to your Supabase column names
  const vocalParts = [
    { name: 'Soprano', column: 'soprano_url', color: 'text-pink-400', bg: 'hover:bg-pink-500/20' },
    { name: 'Alto', column: 'alto_url', color: 'text-emerald-400', bg: 'hover:bg-emerald-500/20' },
    { name: 'Tenor', column: 'tenor_url', color: 'text-sky-400', bg: 'hover:bg-sky-500/20' },
    ,
  ];

  const handlePartClick = (partName: string, columnKey: string) => {
    // Access the URL dynamically from the song object
    const url = (song as any)[columnKey];

    if (url) {
      setActivePart(partName);
      onPlayPart(url);
    } else {
      alert(`The ${partName} audio track hasn't been uploaded yet!`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-6 duration-700 pb-20">
      <button 
        onClick={onBack}
        className="group flex items-center gap-2 text-slate-400 hover:text-white transition-all bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-purple-500/30"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Return to Archive</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="relative group">
            <img src={song.coverUrl} alt={song.title} className="w-full aspect-square object-cover rounded-[3rem] shadow-2xl border border-white/10" />
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10 shadow-xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-purple-400">
              <Music size={20} /> Vocal Rehearsal
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              {vocalParts.map((part) => (
                <button
                  key={part.name}
                  onClick={() => handlePartClick(part.name, part.column)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    activePart === part.name 
                      ? 'bg-purple-600 border-purple-400' 
                      : `bg-white/5 border-white/5 ${part.bg}`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-bold text-lg ${activePart === part.name ? 'text-white' : part.color}`}>
                      {part.name.charAt(0)}
                    </span>
                    <span className="font-semibold">{part.name} Part</span>
                  </div>
                  {activePart === part.name ? <Pause size={18} /> : <Play size={18} className="opacity-50" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold brand-font tracking-tight">{song.title}</h1>
          <p className="text-2xl text-slate-400">composed by <span className="text-white italic">{song.composer}</span></p>

          <div className="bg-slate-900/40 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 min-h-[400px]">
            <pre className="whitespace-pre-wrap font-sans text-xl leading-relaxed text-slate-200 antialiased italic">
              {song.lyrics || "No lyrics provided for this piece."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};