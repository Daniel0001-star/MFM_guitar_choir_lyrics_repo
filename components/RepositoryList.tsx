import React, { useState, useEffect } from 'react';
import { Song } from '../types';
import { Play, ChevronLeft, ChevronRight, Music4, ExternalLink, Search, Music, Mic2, ImageOff, Loader2, Database, Upload, RefreshCw, Code, Wifi, WifiOff, Check, ShieldAlert, CloudOff } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const FALLBACK_SONGS: Song[] = [
  { 
    id: '1', 
    title: 'Great Faith (Live)', 
    composer: 'MFM Guitar Choir', 
    arranger: 'Choir Director', 
    difficulty: 'Medium', 
    key: 'G Major', 
    uploadDate: '2024-01-15',
    coverUrl: 'https://i.imgur.com/9ibU9Uz.jpg', 
    youtubeUrl: 'https://www.shazam.com/song/1761664407',
    spotifyUrl: 'https://www.shazam.com/song/1761664407',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
    lyrics: "Great is Thy faithfulness, O God my Father; There is no shadow of turning with Thee...",
    parts: { S: "Strong Lead", A: "Mid Harmony", T: "Counter", B: "Deep Foundation" }
  },
  { 
    id: '2', 
    title: 'VANITY', 
    composer: 'MFM Guitar Choir', 
    arranger: 'Ensemble Lead', 
    difficulty: 'Hard', 
    key: 'A Minor', 
    uploadDate: '2024-01-20',
    coverUrl: 'https://i.imgur.com/bJCsjkk.jpg',
    youtubeUrl: 'https://www.shazam.com/song/1761655077',
    spotifyUrl: 'https://www.shazam.com/song/1761655077',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3',
    lyrics: "[Lyrics concerning spiritual reflection and vanity]",
    parts: { S: "Vibrant Lead", A: "Subdued", T: "High Tenor", B: "Steady Root" }
  },
  { 
    id: '3', 
    title: 'Going Greater', 
    composer: 'MFM Guitar Choir', 
    arranger: 'All Stars', 
    difficulty: 'Medium', 
    key: 'E Major', 
    uploadDate: '2024-02-01',
    coverUrl: 'https://i.imgur.com/QpZnCIS.jpg',
    youtubeUrl: 'https://www.shazam.com/song/1775928812',
    spotifyUrl: 'https://www.shazam.com/song/1775928812',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/10/25/audio_51770e0653.mp3',
    lyrics: "[Featured track lyrics with MFM Guitar Choir]",
    parts: { S: "Anthem Lead", A: "Warm", T: "Driving", B: "Punchy" }
  },
  { 
    id: '4', 
    title: 'Egberun Ahon', 
    composer: 'MFM Guitar Choir', 
    arranger: 'Yoruba Section',
    difficulty: 'Medium', 
    key: 'F Major', 
    uploadDate: '2024-02-10',
    coverUrl: 'https://i.imgur.com/GcCiqle.jpg',
    youtubeUrl: 'https://www.shazam.com/song/1757833424',
    spotifyUrl: 'https://www.shazam.com/song/1757833424',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/03/15/audio_73685e9447.mp3',
    lyrics: "[Yoruba lyrics: A thousand tongues to sing...]",
    parts: { S: "Choral Lead", A: "Standard", T: "Standard", B: "Root Notes" }
  },
  { 
    id: '5', 
    title: 'Oghene Woruna', 
    composer: 'MFM Guitar Choir', 
    arranger: 'feat. Kehinde Adeyemo', 
    difficulty: 'Hard', 
    key: 'D Major', 
    uploadDate: '2024-02-15',
    coverUrl: 'https://i.imgur.com/QVYnS39.jpg',
    youtubeUrl: 'https://www.shazam.com/song/1753020937',
    spotifyUrl: 'https://www.shazam.com/song/1753020937',
    audioUrl: 'https://cdn.pixabay.com/audio/2024/01/16/audio_e2b992254f.mp3',
    lyrics: "[Featured track with Kehinde Adeyemo]",
    parts: { S: "High Lead", A: "Alt-Harmony", T: "Support", B: "Melodic Bass" }
  },
  { 
    id: '6', 
    title: 'Deliverance We Pray', 
    composer: 'MFM Guitar Choir', 
    arranger: 'Prayer Unit', 
    difficulty: 'Medium', 
    key: 'A Minor', 
    uploadDate: '2024-03-01',
    coverUrl: 'https://i.imgur.com/i99ROeE.jpg',
    youtubeUrl: 'https://www.shazam.com/song/1672304605',
    spotifyUrl: 'https://www.shazam.com/song/1672304605',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3',
    lyrics: "[Spiritual warfare/Deliverance prayer lyrics]",
    parts: { S: "Warfare Lead", A: "Sharp", T: "Aggressive", B: "Steady" }
  },
  { 
    id: '7', 
    title: 'By The Rivers Of Babylon', 
    composer: 'MFM Guitar Choir', 
    arranger: 'feat. Vincent Edeigba', 
    difficulty: 'Easy', 
    key: 'C Major', 
    uploadDate: '2024-03-10',
    coverUrl: 'https://i.imgur.com/D2EATNm.jpg',
    youtubeUrl: 'https://www.shazam.com/song/167179891',
    spotifyUrl: 'https://www.shazam.com/song/167179891',
    audioUrl: 'https://cdn.pixabay.com/audio/2023/04/24/audio_924250262b.mp3',
    lyrics: "[Biblical/Psalm lyrics feat. Vincent Edeigba]",
    parts: { S: "Emotional Lead", A: "Deep Harmony", T: "Tenor Solo", B: "Depth" }
  },
  { 
    id: '8', 
    title: 'Omeriwo', 
    composer: 'MFM Guitar Choir', 
    arranger: 'feat. Temitope Abraham', 
    difficulty: 'Medium', 
    key: 'G Major', 
    uploadDate: '2024-03-20',
    coverUrl: 'https://i.imgur.com/A3A4a7c.jpg',
    youtubeUrl: 'https://www.shazam.com/song/1746053483',
    spotifyUrl: 'https://www.shazam.com/song/1746053483',
    audioUrl: 'https://cdn.pixabay.com/audio/2023/01/10/audio_24e3752e25.mp3',
    lyrics: "[Featured track with Temitope Abraham]",
    parts: { S: "Bright Lead", A: "Harmonic Third", T: "Fillers", B: "Strong Root" }
  },
  { 
    id: '9', 
    title: 'Latest Ensemble', 
    composer: 'MFM Guitar Choir', 
    arranger: 'Choir Ensemble', 
    difficulty: 'Medium', 
    key: 'C Major', 
    uploadDate: '2024-04-10',
    coverUrl: 'https://i.imgur.com/9ibU9Uz.jpg', 
    youtubeUrl: 'https://www.shazam.com/',
    spotifyUrl: 'https://www.shazam.com/',
    audioUrl: 'https://cdn.pixabay.com/audio/2023/05/22/audio_1311059345.mp3',
    lyrics: "[Newly updated ministration with the full choir]",
    parts: { S: "Lead", A: "Harmony", T: "Harmony", B: "Bass" }
  }
];

interface RepositoryListProps {
  onPlaySong?: (song: Song) => void;
}

export const RepositoryList: React.FC<RepositoryListProps> = ({ onPlaySong }) => {
  const [songs, setSongs] = useState<Song[]>(FALLBACK_SONGS);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const { data, error } = await supabase
          .from('songs')
          .select('*')
          .order('uploadDate', { ascending: false });

        if (error) {
           console.warn(`Supabase Sync: ${error.message}`);
           // If table doesn't exist, we stay in fallback mode
           setIsLive(false);
           return;
        }

        if (data && data.length > 0) {
          setSongs(data as Song[]);
          setIsLive(true);
        } else {
          setIsLive(false);
        }
      } catch (err: any) {
        console.warn("Using Fallback Repository: ", err.message || "Connection issue");
        setIsLive(false);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);
  
  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.composer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const displaySongs = filteredSongs;
  const trendingSongs = displaySongs.slice(0, 4);

  useEffect(() => {
    if (trendingSongs.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % trendingSongs.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [trendingSongs.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % trendingSongs.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + trendingSongs.length) % trendingSongs.length);

  const handlePlaySong = (song: Song) => {
    if (onPlaySong) {
      onPlaySong(song);
    }
  };

  const handleOpenLink = (url: string) => {
    if(url && url !== '#' && url !== 'https://www.shazam.com/') window.open(url, '_blank');
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null; 
    e.currentTarget.src = 'https://images.unsplash.com/photo-1510915361408-d59c2d4cd330?auto=format&fit=crop&q=80&w=800'; 
  };

  return (
    <div className="space-y-12 animate-fade-in pb-12 relative">
      {loading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-2xl h-[400px]">
          <Loader2 className="animate-spin text-purple-600 w-10 h-10 mb-4" />
          <p className="text-purple-600 font-bold animate-pulse">Syncing with Repository...</p>
        </div>
      )}

      {/* Featured Slider */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold dark:text-white text-gray-900 brand-font tracking-wide flex items-center gap-3">
              <span className="w-2 h-8 bg-purple-600 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
              Featured Ministrations
            </h2>
            {!isLive && !loading && (
              <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest mt-1 ml-5 flex items-center gap-1.5">
                <CloudOff size={10} /> Local Archive Mode
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={prevSlide} className="p-3 rounded-full dark:bg-white/5 bg-gray-200 dark:hover:bg-white/10 hover:bg-gray-300 transition-all dark:text-white text-gray-700 shadow-sm hover:scale-110 active:scale-95">
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextSlide} className="p-3 rounded-full dark:bg-white/5 bg-gray-200 dark:hover:bg-white/10 hover:bg-gray-300 transition-all dark:text-white text-gray-700 shadow-sm hover:scale-110 active:scale-95">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="relative h-[480px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl dark:shadow-purple-900/10 shadow-purple-900/20 group bg-gray-900 border border-white/5">
          {trendingSongs.length > 0 ? (
             trendingSongs.map((song, index) => (
            <div
              key={song.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img 
                src={song.coverUrl} 
                alt={song.title} 
                onError={handleImageError}
                className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-[20s] ease-linear"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-10 md:p-14 w-full md:w-3/4 bg-gradient-to-r from-black/70 to-transparent">
                <span className="inline-block px-5 py-2 mb-5 rounded-xl bg-purple-600/90 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl border border-purple-400/30 backdrop-blur-md">
                  Spotlight
                </span>
                <h3 className="text-5xl md:text-7xl font-bold text-white mb-4 brand-font leading-[1.1] drop-shadow-2xl">
                  {song.title}
                </h3>
                <p className="text-2xl text-purple-200/80 font-light mb-10 flex items-center gap-4">
                  <span className="w-12 h-[1px] bg-purple-500/40 inline-block"></span>
                  {song.composer}
                </p>
                <div className="flex flex-wrap gap-5">
                  <button 
                    onClick={() => handlePlaySong(song)}
                    className="px-12 py-5 bg-white text-purple-950 rounded-2xl font-black hover:bg-purple-50 transition-all hover:scale-105 flex items-center gap-3 shadow-2xl shadow-white/5 active:scale-95"
                  >
                    <Play size={24} fill="currentColor" /> Play Now
                  </button>
                  <button 
                    onClick={() => handleOpenLink(song.youtubeUrl)}
                    className="px-10 py-5 bg-black/40 text-white border border-white/10 rounded-2xl font-bold hover:bg-black/60 transition-all hover:scale-105 flex items-center gap-3 backdrop-blur-xl active:scale-95"
                  >
                    <ExternalLink size={24} /> Archives
                  </button>
                </div>
              </div>
            </div>
          ))
         ) : (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 bg-gray-900 p-8 text-center">
              <Database className="w-20 h-20 mb-6 opacity-20" />
              <p className="text-2xl font-bold tracking-tight">Repository Offline</p>
           </div>
         )}
          
          {trendingSongs.length > 0 && (
            <div className="absolute bottom-14 right-14 flex gap-5 z-20">
               {trendingSongs.map((_, idx) => (
                 <button 
                   key={idx}
                   onClick={() => setCurrentSlide(idx)}
                   className={`h-2.5 rounded-full transition-all duration-700 ${
                     currentSlide === idx ? 'w-16 bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.9)]' : 'w-4 bg-white/10 hover:bg-white/30'
                   }`}
                 />
               ))}
            </div>
          )}
        </div>
      </section>

      {/* Repertoire Grid */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
           <div className="space-y-1">
             <h2 className="text-3xl font-bold dark:text-white text-gray-900 brand-font tracking-tight">
               Spiritual Archive
             </h2>
             <span className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400/70">
               <Music size={14} />
               {displaySongs.length} Recordings {isLive ? 'Online' : 'Loaded'}
             </span>
           </div>

           <div className="relative w-full md:w-96 group">
             <input
               type="text"
               placeholder="Filter ministrations..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-14 pr-6 py-4 rounded-[1.25rem] dark:bg-white/5 bg-white border-2 dark:border-white/5 border-gray-100 focus:border-purple-500/50 focus:outline-none focus:ring-0 dark:text-white text-gray-900 transition-all placeholder:text-gray-400 shadow-sm group-hover:border-purple-400/20"
             />
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-purple-500 transition-colors" />
           </div>
        </div>

        {displaySongs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {displaySongs.map((song, index) => (
              <div 
                key={song.id}
                onClick={() => handlePlaySong(song)}
                className="group relative dark:bg-white/5 bg-white rounded-[2rem] overflow-hidden border dark:border-white/5 border-gray-50 hover:border-purple-500/40 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.15)] hover:-translate-y-3 flex flex-col h-full cursor-pointer backdrop-blur-md"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-80 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img 
                    src={song.coverUrl} 
                    alt={song.title} 
                    onError={handleImageError}
                    className="w-full h-full object-cover object-top transform group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t dark:from-slate-950 from-gray-900/70 via-transparent to-transparent opacity-90" />
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/40 backdrop-blur-[6px]">
                     <div className="w-20 h-20 bg-purple-600 rounded-3xl flex items-center justify-center text-white shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-500 hover:bg-purple-500 rotate-12 group-hover:rotate-0">
                       <Play size={36} fill="currentColor" className="ml-1" />
                     </div>
                  </div>
                  
                  <div className="absolute top-6 left-6">
                     <span className="px-4 py-1.5 bg-black/50 backdrop-blur-xl rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
                       {song.difficulty}
                     </span>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold dark:text-white text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1 mb-3 brand-font">
                    {song.title}
                  </h3>
                  
                  <div className="space-y-2 mb-8">
                    <p className="text-sm dark:text-gray-400 text-gray-500 flex items-center gap-3 font-medium">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.6)]"></span>
                      {song.composer}
                    </p>
                  </div>

                  <div className="mt-auto pt-6 border-t dark:border-white/5 border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs dark:text-gray-400 text-gray-500 font-bold uppercase tracking-wider">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-lg border border-transparent dark:border-white/5">
                        <Music4 size={16} className="text-purple-500" />
                        <span>{song.key}</span>
                      </div>
                    </div>
                    
                    <button className="px-6 py-2.5 bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 dark:hover:text-white rounded-2xl transition-all flex items-center gap-2 text-xs font-black border border-purple-500/10 active:scale-95">
                      <Play size={16} />
                      Stream
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 text-center">
             <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 border border-gray-100 dark:border-white/5">
               <Search className="text-gray-300 dark:text-gray-700 w-12 h-12" />
             </div>
             <h3 className="text-3xl font-bold dark:text-white text-gray-900 mb-3 brand-font">Archive Entry Not Found</h3>
             <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto font-medium">
                We couldn't find any recordings matching your current filters. Try refining your search.
             </p>
          </div>
        )}
      </section>
    </div>
  );
};