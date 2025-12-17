
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, CheckCircle2, Volume2, Volume1 } from 'lucide-react';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const GUITAR_STRINGS = [
  { note: 'E', freq: 82.41, label: 'Low E' },
  { note: 'A', freq: 110.00, label: 'A' },
  { note: 'D', freq: 146.83, label: 'D' },
  { note: 'G', freq: 196.00, label: 'G' },
  { note: 'B', freq: 246.94, label: 'B' },
  { note: 'E', freq: 329.63, label: 'High E' },
];

export const Tuner: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [pitch, setPitch] = useState<number>(0);
  const [note, setNote] = useState<string>('--');
  const [cents, setCents] = useState<number>(0);
  const [playingString, setPlayingString] = useState<number | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const requestRef = useRef<number>();
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const autoCorrelate = (buf: Float32Array, sampleRate: number) => {
    let size = buf.length;
    let rms = 0;
    for (let i = 0; i < size; i++) {
      const val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / size);
    if (rms < 0.01) return -1; // Not enough signal

    let r1 = 0, r2 = size - 1, thres = 0.2;
    for (let i = 0; i < size / 2; i++) {
      if (Math.abs(buf[i]) < thres) { r1 = i; break; }
    }
    for (let i = 1; i < size / 2; i++) {
      if (Math.abs(buf[size - i]) < thres) { r2 = size - i; break; }
    }

    buf = buf.slice(r1, r2);
    size = buf.length;

    const c = new Array(size).fill(0);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size - i; j++) {
        c[i] = c[i] + buf[j] * buf[j + i];
      }
    }

    let d = 0; while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < size; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;

    const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  };

  const updatePitch = () => {
    if (!analyserRef.current) return;
    const buf = new Float32Array(2048);
    analyserRef.current.getFloatTimeDomainData(buf);
    const ac = autoCorrelate(buf, audioContextRef.current!.sampleRate);

    if (ac !== -1) {
      setPitch(Math.round(ac));
      const noteNum = 12 * (Math.log(ac / 440) / Math.log(2)) + 69;
      const roundedNote = Math.round(noteNum);
      const noteName = NOTES[roundedNote % 12];
      
      // Calculate cents off
      const centsOff = Math.floor((noteNum - roundedNote) * 100);
      
      setNote(noteName);
      setCents(centsOff);
    }
    requestRef.current = requestAnimationFrame(updatePitch);
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new window.AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      
      setIsListening(true);
      updatePitch();
    } catch (err) {
      console.error("Microphone access denied", err);
    }
  };

  const stopListening = () => {
    if (sourceRef.current) sourceRef.current.disconnect();
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      // Don't close if we are playing a tone, just suspend listener
      // But for simplicity in this component structure, we usually keep context alive
      // logic handled in cleanup mainly
    }
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setIsListening(false);
    setPitch(0);
    setNote('--');
  };

  // Play Tone Function
  const playTone = (freq: number, index: number) => {
    // If already playing this string, stop it
    if (playingString === index) {
      stopTone();
      return;
    }

    // Stop any existing tone first
    if (oscRef.current) stopTone();

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle'; // Guitar-like ish
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    // Envelope
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 4); // Long sustain

    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    
    oscRef.current = osc;
    gainRef.current = gain;
    setPlayingString(index);

    // Auto stop after 4 seconds
    setTimeout(() => {
        if (playingString === index) setPlayingString(null);
    }, 4000);
  };

  const stopTone = () => {
    if (gainRef.current && oscRef.current) {
      const ctx = gainRef.current.context;
      gainRef.current.gain.cancelScheduledValues(ctx.currentTime);
      gainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
      oscRef.current.stop(ctx.currentTime + 0.1);
    }
    setPlayingString(null);
  };

  useEffect(() => {
    return () => {
      stopListening();
      stopTone();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full max-w-2xl mx-auto space-y-8 animate-fade-in pb-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold dark:text-white text-gray-900 brand-font mb-2">Pro Tuner & Reference</h2>
        <p className="dark:text-gray-400 text-gray-600">Click a note to hear it, or start tuner to detect.</p>
      </div>

      <div className="relative w-72 h-72 rounded-full border-8 dark:border-slate-800 border-gray-200 bg-white dark:bg-slate-900 shadow-[0_0_50px_rgba(139,92,246,0.3)] flex flex-col items-center justify-center transition-colors">
        {/* Tuner Gauge UI */}
        <div className={`text-6xl font-bold mb-2 transition-colors ${
          Math.abs(cents) < 5 && pitch > 0 ? 'text-green-500 scale-110' : 'dark:text-white text-gray-900'
        }`}>
          {note}
        </div>
        
        {pitch > 0 ? (
          <div className="flex items-center gap-2">
             <span className="text-sm dark:text-gray-400 text-gray-500 font-mono">{pitch} Hz</span>
             {Math.abs(cents) < 5 && <CheckCircle2 className="text-green-500 w-5 h-5 animate-pulse" />}
          </div>
        ) : (
          <div className="text-xs text-gray-400">Listening...</div>
        )}

        {/* Needle */}
        <div 
          className="absolute w-1 h-24 bg-red-500 origin-bottom rounded-full transition-transform duration-100 ease-out"
          style={{ 
            bottom: '50%', 
            transform: `rotate(${Math.min(Math.max(cents * 1.5, -90), 90)}deg)`,
            backgroundColor: Math.abs(cents) < 5 ? '#22c55e' : '#ef4444',
            boxShadow: Math.abs(cents) < 5 ? '0 0 10px #22c55e' : 'none'
          }}
        />
        
        {/* Needle Hub */}
        <div className="absolute w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full z-10" />
        
        {/* Ticks */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent pointer-events-none">
           <div className="absolute top-4 left-1/2 w-0.5 h-3 bg-gray-300 dark:bg-gray-700 -translate-x-1/2" />
           <div className="absolute bottom-4 left-1/2 w-0.5 h-3 bg-gray-300 dark:bg-gray-700 -translate-x-1/2" />
           <div className="absolute left-4 top-1/2 h-0.5 w-3 bg-gray-300 dark:bg-gray-700 -translate-y-1/2" />
           <div className="absolute right-4 top-1/2 h-0.5 w-3 bg-gray-300 dark:bg-gray-700 -translate-y-1/2" />
        </div>
      </div>

      <div className="flex flex-col items-center space-y-6 w-full">
        {/* String Reference Buttons */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 w-full max-w-lg">
          {GUITAR_STRINGS.map((s, idx) => (
             <button
               key={s.freq} 
               onClick={() => playTone(s.freq, idx)}
               className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all transform hover:scale-105 active:scale-95 ${
                 playingString === idx
                   ? 'bg-purple-600 text-white border-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.5)]'
                   : note === s.note && Math.abs(pitch - s.freq) < 10 
                     ? 'bg-green-500/10 text-green-500 border-green-500' 
                     : 'dark:bg-slate-800 bg-white dark:text-gray-400 text-gray-600 dark:border-slate-700 border-gray-300 hover:border-purple-400'
             }`}
           >
               <span className="text-lg font-bold">{s.note}</span>
               <span className="text-[10px] opacity-70">{s.label}</span>
               {playingString === idx && <Volume2 size={12} className="mt-1 animate-pulse" />}
             </button>
          ))}
        </div>

        <button
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg w-64 justify-center ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30' 
              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/30'
          }`}
        >
          {isListening ? <><MicOff size={20} /> Stop Tuner</> : <><Mic size={20} /> Start Tuner</>}
        </button>
      </div>
    </div>
  );
};
