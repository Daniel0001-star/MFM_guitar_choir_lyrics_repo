import React, { useState, useEffect } from 'react';
import { Song } from '../types';
import { Play, ChevronLeft, ChevronRight, Music4, ExternalLink, Search, Music, Mic2, ImageOff, Loader2, Database, Upload, RefreshCw, Code, Wifi, WifiOff, Check, ShieldAlert } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

// Fallback/Demo Database
const FALLBACK_SONGS: Song[] = [
  { 
    id: '1', 
    title: 'Great Faith (Live)', 
    composer: 'MFM Guitar Choir', 
    arranger: 'Choir Director', 
    difficulty: 'Medium', 
    key: 'G Major', 
    uploadDate: '2024-01-15',
    coverUrl: 'https://imgur.com/a/A3A4a7c',
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
    coverUrl: 'https://imgur.com/a/D2EATNm',
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
    coverUrl: 'https://imgur.com/a/QVYnS39',
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
    coverUrl: 'https://imgur.com/a/i99ROeE',
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
    coverUrl: 'https://imgur.com/a/QVYnS39',
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
    coverUrl: 'https://imgur.com/a/GcCiqle',
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
    coverUrl: 'https://imgur.com/a/bJCsjkk#YYo028X',
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
    coverUrl: 'https://imgur.com/a/QpZnCIS',
    youtubeUrl: 'https://www.shazam.com/song/1746053483',
    spotifyUrl: 'https://www.shazam.com/song/1746053483',
    audioUrl: 'https://cdn.pixabay.com/audio/2023/01/10/audio_24e3752e25.mp3',
    lyrics: "[Featured track with Temitope Abraham]",
    parts: { S: "Bright Lead", A: "Harmonic Third", T: "Fillers", B: "Strong Root" }
  },
  { 
    id: '9', 
    title: 'You Showed Me Your Mercy', 
    composer: 'MFM Guitar Choir', 
    arranger: 'Worship Team', 
    difficulty: 'Medium', 
    key: 'E Major', 
    uploadDate: '2024-04-05',
    coverUrl: 'https://imgur.com/a/9ibU9Uz',
    youtubeUrl: 'https://www.shazam.com/song/1672304608',
    spotifyUrl: 'https://www.shazam.com/song/1672304608',
    audioUrl: 'https://cdn.pixabay.com/audio/2023/05/22/audio_1311059345.mp3',
    lyrics: "[Lyrics of thanksgiving and mercy]",
    parts: { S: "Soft Lead", A: "Mid", T: "Supporting", B: "Quiet Bass" }
  },
  { 
    id: '10', 
    title: 'Hakuna Mungu', 
    composer: 'MFM Guitar Choir', 
    arranger: 'International Team', 
    difficulty: 'Medium', 
    key: 'F Major', 
    uploadDate: '2024-04-12',
    coverUrl: 'https://imgur.com/a/bJCsjkk#YYo028X',
    youtubeUrl: 'https://www.shazam.com/song/1672304609',
    spotifyUrl: 'https://www.shazam.com/song/1672304609',
    audioUrl: 'https://cdn.pixabay.com/audio/2023/10/01/audio_1087405238.mp3',
    lyrics: "[Swahili lyrics: There is no God like You]",
    parts: { S: "Pulsing Lead", A: "Syncopated", T: "High Support", B: "Rhythmic" }
  }
];

interface RepositoryListProps {
  onPlaySong?: (song: Song) => void;
}

export const RepositoryList: React.FC<RepositoryListProps> = ({ onPlaySong }) => {
  const [songs, setSongs] = useState<Song[]>(FALLBACK_SONGS);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [useSupabase, setUseSupabase] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [rawSupabaseData, setRawSupabaseData] = useState<any[]>([]);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const fetchSongs = async () => {
    setLoading(true);
    setConnectionError(null);
    try {
      // Add timestamp to prevent caching
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error:', error);
        setUseSupabase(false);
        setSongs(FALLBACK_SONGS);
        
        // Detailed error analysis
        if (error.code === '42501' || error.message.toLowerCase().includes('permission')) {
          setConnectionError("Permission Denied: Check RLS policies for 'SELECT' on 'songs' table.");
        } else if (error.code === 'PGRST116') {
           setConnectionError("Table not found or schema mismatch.");
        } else {
          setConnectionError(error.message);
        }
      } else if (data) {
        setRawSupabaseData(data); // Store raw data for debug view
        const mappedSongs: Song[] = data.map((item: any) => ({
          id: item.id || Math.random().toString(),
          title: item.title || 'Untitled',
          composer: item.composer || 'Unknown',
          arranger: item.arranger || 'Unknown',
          difficulty: item.difficulty || 'Medium',
          key: item.key || 'C',
          uploadDate: item.upload_date || item.created_at || new Date().toISOString(),
          // STRICTLY Prioritize 'album_cover' from Supabase
          coverUrl: item.album_cover || item.cover_url || item.coverUrl || 'https://images.unsplash.com/photo-1510915361408-d59c2d4cd330?auto=format&fit=crop&q=80&w=800',
          youtubeUrl: item.youtube_url || item.youtubeUrl || '',
          spotifyUrl: item.spotify_url || item.spotifyUrl || '',
          audioUrl: item.audio_url || item.audioUrl || '',
          lyrics: item.lyrics || '',
          parts: item.parts || { S: '', A: '', T: '', B: '' }
        }));
        setSongs(mappedSongs);
        setUseSupabase(true);
      } else {
        // Connected but empty table
        setRawSupabaseData([]);
        setUseSupabase(true);
        setSongs([]);
      }
    } catch (err: any) {
      console.warn('Connection failed, using offline mode.', err);
      setUseSupabase(false);
      setConnectionError(err.message || "Network Error");
      setSongs(FALLBACK_SONGS);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      // Lightest possible query
      const { count, error } = await supabase
        .from('songs')
        .select('*', { count: 'exact', head: true });
        
      if (error) {
        alert(`Connection Test Failed:\n${error.message}\n\nCode: ${error.code}\nHint: Check RLS policies for 'anon' role.`);
        setConnectionError(error.message);
      } else {
        alert(`Connection Successful!\nRead Access: OK\nRows found: ${count}`);
        setUseSupabase(true);
        fetchSongs(); // Re-fetch actual data
      }
    } catch (err: any) {
      alert(`Network Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
    
    // Auto-refresh when window regains focus to check for updates
    const onFocus = () => fetchSongs();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const handleUploadToDatabase = async () => {
    if (!confirm("This will upload local demo songs to your Supabase 'songs' table. If rows exist, they will be duplicated unless you have unique constraints. Continue?")) return;
    
    setIsUploading(true);
    try {
      // Prepare data for insertion (map to snake_case, prioritizing album_cover)
      const songsToUpload = FALLBACK_SONGS.map(song => ({
        title: song.title,
        composer: song.composer,
        arranger: song.arranger,
        difficulty: song.difficulty,
        key: song.key,
        upload_date: song.uploadDate,
        album_cover: song.coverUrl, // CRITICAL: Map local coverUrl to album_cover column
        youtube_url: song.youtubeUrl,
        spotify_url: song.spotifyUrl,
        audio_url: song.audioUrl,
        lyrics: song.lyrics,
        parts: song.parts
      }));

      const { error } = await supabase.from('songs').insert(songsToUpload);

      if (error) {
        // Specific help for RLS errors on Insert
        if (error.code === '42501') {
             throw new Error("Permission Denied: You have Read access but missing Insert access. Add 'INSERT' policy for 'anon' role in Supabase.");
        }
        throw error;
      }
      
      alert('Songs uploaded successfully! Refreshing view...');
      await fetchSongs();
    } catch (err: any) {
      console.error("Upload failed", err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  // Filter Logic
  const filteredSongs = songs.length > 0 ? songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.composer.toLowerCase().includes(searchQuery.toLowerCase())
  ) : FALLBACK_SONGS.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.composer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const displaySongs = songs.length > 0 ? filteredSongs : (useSupabase ? [] : filteredSongs);

  // Trending/Featured Logic (Take first 4 of whatever is available)
  const trendingSongs = displaySongs.slice(0, 4);

  useEffect(() => {
    if (trendingSongs.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % trendingSongs.length);
    }, 5000);
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
    if(url) window.open(url, '_blank');
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null; 
    e.currentTarget.src = 'https://images.unsplash.com/photo-1510915361408-d59c2d4cd330?auto=format&fit=crop&q=80&w=800'; 
  };

  return (
    <div className="space-y-12 animate-fade-in pb-12 relative">
      
      {/* Loading Overlay */}
      {(loading || isUploading) && (
        <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-2xl h-[400px]">
          <Loader2 className="animate-spin text-purple-600 w-10 h-10 mb-4" />
          {isUploading && <p className="text-purple-900 dark:text-purple-100 font-bold">Syncing to Database...</p>}
        </div>
      )}

      {/* Featured Ministrations Slider */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-xl font-bold dark:text-white text-gray-900 brand-font tracking-wide flex items-center gap-2">
            <span className="w-2 h-8 bg-purple-600 rounded-full"></span>
            Featured Ministrations
          </h2>
          <div className="flex items-center gap-4 flex-wrap">
             {/* Connection Indicator & Sync Button */}
             <div className="flex items-center gap-2">
               <button
                 onClick={testConnection}
                 className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${useSupabase ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'}`}
                 title={useSupabase ? "Connection OK" : connectionError || "Click to Test Connection"}
               >
                 {useSupabase ? <Wifi size={12} /> : <WifiOff size={12} />}
                 {useSupabase ? 'Connected' : 'Offline'}
               </button>
               
               {/* Sync Button */}
               <button 
                 onClick={handleUploadToDatabase}
                 disabled={isUploading}
                 className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-purple-600/10 text-purple-600 border-purple-600/20 hover:bg-purple-600 hover:text-white transition-all"
                 title="Upload local fallback songs to Supabase"
               >
                 <Upload size={12} />
                 Sync
               </button>

               {/* Debug View Button */}
               <button 
                 onClick={() => setShowDebug(!showDebug)}
                 className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-blue-600/10 text-blue-600 border-blue-600/20 hover:bg-blue-600 hover:text-white transition-all"
                 title="View Raw Supabase Data"
               >
                 <Code size={12} />
                 Debug
               </button>
               
               <button 
                 onClick={fetchSongs}
                 className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 transition-colors"
                 title="Refresh Data"
               >
                 <RefreshCw size={14} className={`${loading ? 'animate-spin' : ''}`} />
               </button>
             </div>

             <div className="flex gap-2">
                <button onClick={prevSlide} className="p-2 rounded-full dark:bg-white/5 bg-gray-200 dark:hover:bg-white/20 hover:bg-gray-300 transition-colors dark:text-white text-gray-700">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={nextSlide} className="p-2 rounded-full dark:bg-white/5 bg-gray-200 dark:hover:bg-white/20 hover:bg-gray-300 transition-colors dark:text-white text-gray-700">
                  <ChevronRight size={20} />
                </button>
             </div>
          </div>
        </div>

        {/* Debug Modal */}
        {showDebug && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowDebug(false)}>
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-slate-800">
                <h3 className="font-bold text-lg dark:text-white text-gray-900 font-mono flex items-center gap-2">
                  <Database size={18} className="text-blue-500"/>
                  Raw Supabase Response
                </h3>
                <button onClick={() => setShowDebug(false)} className="px-3 py-1 text-xs bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors">
                  Close
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4 bg-gray-100 dark:bg-black font-mono text-xs text-gray-800 dark:text-green-400">
                {connectionError && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 text-red-200 rounded-lg">
                    <strong>Last Error:</strong> {connectionError}
                  </div>
                )}
                <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500/50 text-blue-200 rounded-lg">
                    <strong>Connection Config:</strong><br/>
                    URL: {supabase.supabaseUrl}<br/>
                    Key (Last 4): ...{supabase.supabaseKey.slice(-4)}
                </div>
                {rawSupabaseData.length > 0 ? (
                  <pre>{JSON.stringify(rawSupabaseData, null, 2)}</pre>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                    <p>No data found in 'songs' table.</p>
                    <p className="mt-2 text-xs">If you see this but expect data, check RLS policies for 'anon' role.</p>
                    <button onClick={testConnection} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full text-xs">Test Read Access</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl dark:shadow-black/50 shadow-purple-900/20 group bg-gray-900">
          {trendingSongs.length > 0 ? (
             trendingSongs.map((song, index) => (
            <div
              key={song.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img 
                src={song.coverUrl} 
                alt={song.title} 
                onError={handleImageError}
                className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-[10s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full md:w-2/3 bg-gradient-to-r from-black/80 to-transparent">
                <span className="inline-block px-3 py-1 mb-3 rounded-full bg-purple-600/90 text-white text-xs font-bold uppercase tracking-wider shadow-lg border border-purple-400/50">
                  Featured
                </span>
                <h3 className="text-4xl md:text-6xl font-bold text-white mb-2 brand-font leading-tight drop-shadow-lg">
                  {song.title}
                </h3>
                <p className="text-xl text-purple-200/90 font-light mb-6 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-purple-400 inline-block"></span>
                  {song.composer}
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handlePlaySong(song)}
                    className="px-8 py-3 bg-white text-purple-900 rounded-full font-bold hover:bg-purple-100 transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-white/20"
                  >
                    <Play size={20} fill="currentColor" /> Play Now
                  </button>
                  <button 
                    onClick={() => handleOpenLink(song.youtubeUrl)}
                    className="px-6 py-3 bg-black/40 text-white border border-white/20 rounded-full font-bold hover:bg-black/60 transition-all hover:scale-105 flex items-center gap-2 backdrop-blur-sm"
                  >
                    <ExternalLink size={20} /> Info
                  </button>
                </div>
              </div>
            </div>
          ))
         ) : (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 bg-gray-900 p-8 text-center">
             {connectionError ? (
                <>
                  <ShieldAlert className="w-12 h-12 mb-4 text-red-500 opacity-80" />
                  <p className="text-lg font-medium text-red-200">Connection Issue</p>
                  <p className="text-sm opacity-60 mb-6 max-w-md">{connectionError}</p>
                  <button 
                   onClick={testConnection}
                   className="px-6 py-2 bg-red-600/20 border border-red-500 hover:bg-red-600 hover:text-white rounded-full text-red-200 font-medium flex items-center gap-2 transition-colors"
                  >
                   <RefreshCw size={16} />
                   Test Connection Again
                  </button>
                </>
             ) : (
                <>
                  <Database className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">Database Connected but Empty</p>
                  <p className="text-sm opacity-60 mb-6">No songs found in the 'songs' table.</p>
                  <button 
                    onClick={handleUploadToDatabase}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-full text-white font-medium flex items-center gap-2 transition-colors"
                  >
                    <Upload size={16} />
                    Sync Demo Data Now
                  </button>
                </>
             )}
           </div>
         )}
          
          {/* Slider Indicators */}
          {trendingSongs.length > 0 && (
            <div className="absolute bottom-8 right-8 flex gap-3 z-20">
               {trendingSongs.map((_, idx) => (
                 <button 
                   key={idx}
                   onClick={() => setCurrentSlide(idx)}
                   className={`h-1.5 rounded-full transition-all duration-500 ${
                     currentSlide === idx ? 'w-12 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]' : 'w-3 bg-white/30 hover:bg-white/50'
                   }`}
                 />
               ))}
            </div>
          )}
        </div>
      </section>

      {/* Database Search & Grid */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
           <div>
             <h2 className="text-xl font-bold dark:text-white text-gray-900 brand-font tracking-wide">
               Repertoire Database
             </h2>
             <span className="text-sm dark:text-purple-300/50 text-purple-600/60">
               {displaySongs.length} Songs Available
             </span>
           </div>

           {/* Search Input */}
           <div className="relative w-full md:w-72">
             <input
               type="text"
               placeholder="Search database..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full pl-10 pr-4 py-2 rounded-xl dark:bg-slate-900/50 bg-white border dark:border-white/10 border-gray-300 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:text-white text-gray-900 transition-all placeholder:text-gray-500"
             />
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
           </div>
        </div>

        {displaySongs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displaySongs.map((song, index) => (
              <div 
                key={song.id}
                onClick={() => handlePlaySong(song)}
                className="group relative dark:bg-slate-900/40 bg-white/60 rounded-xl overflow-hidden border dark:border-white/5 border-purple-100 hover:border-purple-500/30 transition-all duration-300 hover:shadow-xl dark:hover:shadow-purple-900/20 hover:shadow-purple-200/50 hover:-translate-y-2 flex flex-col h-full cursor-pointer backdrop-blur-sm"
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {/* Image Header */}
                <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-800">
                  <img 
                    src={song.coverUrl} 
                    alt={song.title} 
                    onError={handleImageError}
                    className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t dark:from-slate-900 from-gray-900/50 via-transparent to-transparent opacity-80" />
                  
                  {/* Overlay Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                     <button className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300 hover:bg-purple-500">
                       <Play size={24} fill="currentColor" className="ml-1" />
                     </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold dark:text-white text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
                      {song.title}
                    </h3>
                  </div>
                  
                  <div className="space-y-1 mb-4">
                    <p className="text-sm dark:text-gray-400 text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      {song.composer}
                    </p>
                    {song.parts && (
                      <p className="text-xs text-purple-500/80 dark:text-purple-400/80 flex items-center gap-1.5 mt-1">
                         <Mic2 size={10} />
                         <span>Part: {song.parts.S?.split(' ')[0]} / {song.parts.A?.split(' ')[0]}</span>
                      </p>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t dark:border-white/5 border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs dark:text-gray-500 text-gray-500">
                      <Music4 size={12} />
                      <span>{song.key}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handlePlaySong(song); }}
                        className="text-purple-500 hover:text-purple-700 transition-colors flex items-center gap-1.5 text-xs font-semibold group/btn"
                      >
                        <Play size={14} className="group-hover/btn:scale-110 transition-transform" />
                        Play
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
             <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
               <Search className="text-gray-400 w-8 h-8" />
             </div>
             <h3 className="text-xl font-medium dark:text-white text-gray-900 mb-2">No songs found</h3>
             <p className="text-gray-500 dark:text-gray-400">
                {useSupabase 
                  ? "The database is connected but empty. Use the 'Sync' button above to populate it." 
                  : "Try searching for 'Great Faith' or 'Vanity'."}
             </p>
          </div>
        )}
      </section>
    </div>
  );
};