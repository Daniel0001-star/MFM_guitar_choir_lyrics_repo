import React, { useState } from 'react';
import { Loader2, CheckCircle, AlertTriangle, Music, User, Image as ImageIcon, Link as LinkIcon, Mic, Type, Key, Star, UploadCloud } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface UploadFormProps {
  onUploadSuccess: () => void;
}

const InputField = ({ id, label, value, onChange, icon: Icon, placeholder, required = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-purple-300 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        type="text"
        name={id}
        id={id}
        value={value}
        onChange={onChange}
        className="block w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-slate-900/50 bg-white py-3 pl-10 pr-3 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm transition-colors"
        placeholder={placeholder}
        required={required}
      />
    </div>
  </div>
);

export const UploadForm: React.FC<UploadFormProps> = ({ onUploadSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    composer: 'MFM Guitar Choir',
    arranger: '',
    difficulty: 'Medium',
    key: '',
    album_cover: '',
    youtube_url: '',
    spotify_url: '',
    audio_url: '',
    lyrics: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '', composer: 'MFM Guitar Choir', arranger: '', difficulty: 'Medium', key: '',
      album_cover: '', youtube_url: '', spotify_url: '', audio_url: '', lyrics: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.title) {
      setError("Song title is required.");
      return;
    }

    setIsLoading(true);

    try {
      // Map form fields to Supabase database columns
      const { error: dbError } = await supabase
        .from('songs')
        .insert([{
          title: formData.title,
          composer: formData.composer,
          arranger: formData.arranger,
          difficulty: formData.difficulty,
          key: formData.key,
          coverUrl: formData.album_cover,
          youtubeUrl: formData.youtube_url,
          spotifyUrl: formData.spotify_url,
          audioUrl: formData.audio_url,
          lyrics: formData.lyrics,
          uploadDate: new Date().toISOString()
        }]);

      if (dbError) throw dbError;

      setIsLoading(false);
      setSuccess(true);
      resetForm();
      
      // Auto-redirect after success
      setTimeout(() => {
        setSuccess(false);
        onUploadSuccess();
      }, 2000);

    } catch (err: any) {
      console.error("Supabase Upload Error:", err);
      setError(err.message || "Failed to save ministration to the database. Please check your connection.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
      <form onSubmit={handleSubmit} className="dark:bg-slate-900/50 bg-white/80 backdrop-blur-lg rounded-2xl border dark:border-white/10 border-purple-100 shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            <div className="space-y-6">
              <InputField id="title" label="Song Title" value={formData.title} onChange={handleChange} icon={Music} placeholder="e.g., Great Faith" required />
              <InputField id="composer" label="Composer" value={formData.composer} onChange={handleChange} icon={User} placeholder="e.g., MFM Guitar Choir" />
              <InputField id="arranger" label="Arranger" value={formData.arranger} onChange={handleChange} icon={Mic} placeholder="e.g., Choir Director" />
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-purple-300 mb-1">
                  Difficulty
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Star className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-slate-900/50 bg-white py-3 pl-10 pr-3 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm transition-colors"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
              <InputField id="key" label="Musical Key" value={formData.key} onChange={handleChange} icon={Key} placeholder="e.g., G Major" />
            </div>

            <div className="space-y-6">
              <InputField id="album_cover" label="Album Cover URL" value={formData.album_cover} onChange={handleChange} icon={ImageIcon} placeholder="https://..." />
              <div className="w-full aspect-square bg-gray-100 dark:bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden border dark:border-white/10">
                {formData.album_cover ? (
                  <img src={formData.album_cover} alt="Album cover preview" className="w-full h-full object-cover object-top" onError={(e) => e.currentTarget.style.display = 'none'} onLoad={(e) => e.currentTarget.style.display = 'block'}/>
                ) : (
                  <div className="text-center text-gray-400">
                    <ImageIcon size={48} className="mx-auto" />
                    <p className="text-sm mt-2">Cover Preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 space-y-6">
            <InputField id="youtube_url" label="YouTube URL" value={formData.youtube_url} onChange={handleChange} icon={LinkIcon} placeholder="https://youtube.com/..." />
            <InputField id="spotify_url" label="Spotify URL" value={formData.spotify_url} onChange={handleChange} icon={LinkIcon} placeholder="https://spotify.com/..." />
            <InputField id="audio_url" label="Audio File URL" value={formData.audio_url} onChange={handleChange} icon={LinkIcon} placeholder="https://.../song.mp3" />
          </div>

          <div className="mt-8">
            <label htmlFor="lyrics" className="block text-sm font-medium text-gray-700 dark:text-purple-300 mb-1">
              Lyrics
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute top-3 left-0 flex items-center pl-3">
                <Type className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="lyrics"
                name="lyrics"
                rows={6}
                value={formData.lyrics}
                onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-slate-900/50 bg-white py-3 pl-10 pr-3 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm transition-colors"
                placeholder="[Verse 1]..."
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-black/20 p-6">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-500 dark:text-red-300 border border-red-500/20">
              <AlertTriangle size={16} /> {error}
            </div>
          )}
          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-300 border border-green-500/20 animate-pulse">
              <CheckCircle size={16} /> Ministration saved to Supabase Repository!
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || success}
              className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="h-5 w-5" />
                  Save to Repository
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};