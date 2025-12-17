
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Play, Trophy, RotateCcw } from 'lucide-react';

export const PitchGame: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentNote, setCurrentNote] = useState('--');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const requestRef = useRef<number>();
  
  // Game State
  const gameState = useRef({
    ballY: 200,
    ballVelocity: 0,
    obstacles: [] as { x: number; gapY: number; gapHeight: number; passed: boolean; noteName: string }[],
    speed: 3,
    pitch: 0
  });

  // Notes in C Major Scale for gaps
  const TARGET_NOTES = [
    { name: 'C3', freq: 130.81, y: 0.9 },
    { name: 'D3', freq: 146.83, y: 0.8 },
    { name: 'E3', freq: 164.81, y: 0.7 },
    { name: 'F3', freq: 174.61, y: 0.6 },
    { name: 'G3', freq: 196.00, y: 0.5 },
    { name: 'A3', freq: 220.00, y: 0.4 },
    { name: 'B3', freq: 246.94, y: 0.3 },
    { name: 'C4', freq: 261.63, y: 0.2 },
  ];

  const autoCorrelate = (buf: Float32Array, sampleRate: number) => {
    let size = buf.length;
    let rms = 0;
    for (let i = 0; i < size; i++) {
      const val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / size);
    if (rms < 0.01) return -1; 

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

  const mapPitchToY = (pitch: number, height: number) => {
    // Map approx 100Hz (low) to height, and 400Hz (high) to 0
    // Using simple linear mapping for now, log scale would be better but this is a simple game
    if (pitch < 80) return height - 50; // Fall to bottom if silence/low
    
    // Clamp pitch range for playability
    const minFreq = 110; // A2
    const maxFreq = 300; // D4+
    
    const percent = Math.max(0, Math.min(1, (pitch - minFreq) / (maxFreq - minFreq)));
    return height - (percent * height);
  };

  const getNoteName = (freq: number) => {
      const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const noteNum = 12 * (Math.log(freq / 440) / Math.log(2)) + 69;
      return notes[Math.round(noteNum) % 12];
  };

  const updateGame = () => {
    if (!canvasRef.current || gameOver) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Detect Pitch
    if (analyserRef.current && audioContextRef.current) {
        const buf = new Float32Array(2048);
        analyserRef.current.getFloatTimeDomainData(buf);
        const ac = autoCorrelate(buf, audioContextRef.current.sampleRate);
        if (ac !== -1) {
            gameState.current.pitch = ac;
            const targetY = mapPitchToY(ac, canvas.height);
            // Smooth movement
            gameState.current.ballY += (targetY - gameState.current.ballY) * 0.1;
            setCurrentNote(getNoteName(ac));
        } else {
            // Gravity effect if no sound
            gameState.current.ballY += (canvas.height - gameState.current.ballY) * 0.05;
        }
    }

    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Background Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGradient.addColorStop(0, '#0f172a'); // Slate 900
    bgGradient.addColorStop(1, '#312e81'); // Indigo 900
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Pitch Lines (Reference)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    TARGET_NOTES.forEach(note => {
        const y = canvas.height - (canvas.height * ((note.freq - 110) / (300 - 110)));
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.font = '10px monospace';
        ctx.fillText(note.name, 10, y - 5);
    });

    // Spawn Obstacles
    if (gameState.current.obstacles.length === 0 || 
        gameState.current.obstacles[gameState.current.obstacles.length - 1].x < canvas.width - 300) {
        
        // Pick a random note target
        const target = TARGET_NOTES[Math.floor(Math.random() * TARGET_NOTES.length)];
        // Calculate Y based on our simple mapping logic
        const yPercent = (target.freq - 110) / (300 - 110);
        const gapY = canvas.height - (canvas.height * yPercent);

        gameState.current.obstacles.push({
            x: canvas.width,
            gapY: gapY,
            gapHeight: 120, // Easy gap size
            passed: false,
            noteName: target.name
        });
    }

    // Update & Draw Obstacles
    ctx.fillStyle = '#a855f7'; // Purple 500
    gameState.current.obstacles.forEach((obs, index) => {
        obs.x -= gameState.current.speed;

        // Top Wall
        ctx.fillRect(obs.x, 0, 40, obs.gapY - obs.gapHeight / 2);
        // Bottom Wall
        ctx.fillRect(obs.x, obs.gapY + obs.gapHeight / 2, 40, canvas.height);

        // Draw Target Note Label inside gap
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(obs.noteName, obs.x + 5, obs.gapY + 5);
        ctx.fillStyle = '#a855f7'; // Reset for next wall

        // Collision Logic
        const ballX = 100;
        const ballRadius = 15;
        
        // Check X overlap
        if (ballX + ballRadius > obs.x && ballX - ballRadius < obs.x + 40) {
            // Check Y Collision (if NOT in gap)
            if (gameState.current.ballY - ballRadius < obs.gapY - obs.gapHeight / 2 || 
                gameState.current.ballY + ballRadius > obs.gapY + obs.gapHeight / 2) {
                setGameOver(true);
                setIsPlaying(false);
            }
        }

        // Score
        if (!obs.passed && obs.x < ballX) {
            obs.passed = true;
            setScore(prev => prev + 1);
            if (score > 0 && score % 5 === 0) gameState.current.speed += 0.5; // Speed up
        }
    });

    // Remove off-screen obstacles
    gameState.current.obstacles = gameState.current.obstacles.filter(obs => obs.x > -50);

    // Draw Ball
    const ballColor = `hsl(${Math.min(gameState.current.pitch, 360)}, 70%, 60%)`;
    ctx.beginPath();
    ctx.arc(100, gameState.current.ballY, 15, 0, Math.PI * 2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Glow
    const gradient = ctx.createRadialGradient(100, gameState.current.ballY, 5, 100, gameState.current.ballY, 30);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();

    requestRef.current = requestAnimationFrame(updateGame);
  };

  const startGame = async () => {
    try {
      setScore(0);
      setGameOver(false);
      gameState.current = {
        ballY: 200,
        ballVelocity: 0,
        obstacles: [],
        speed: 3,
        pitch: 0
      };
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new window.AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      
      setIsPlaying(true);
      requestRef.current = requestAnimationFrame(updateGame);
    } catch (err) {
      console.error("Microphone access denied", err);
      alert("Please allow microphone access to play!");
    }
  };

  const stopGame = () => {
    setIsPlaying(false);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    if (sourceRef.current) sourceRef.current.disconnect();
    if (audioContextRef.current) audioContextRef.current.close();
  };

  useEffect(() => {
    return () => {
      stopGame();
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in flex flex-col items-center">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold dark:text-white text-gray-900 brand-font flex items-center justify-center gap-2">
          <Trophy className="text-yellow-500" />
          Pitch Perfect Challenge
        </h2>
        <p className="dark:text-purple-300 text-purple-600">
          Sing or play the notes to guide the ball through the gates! 
          <br/>Higher pitch = Moves Up. Lower pitch = Moves Down.
        </p>
      </div>

      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-500/30">
        <canvas 
            ref={canvasRef} 
            width={800} 
            height={400} 
            className="bg-slate-900 w-full max-w-[800px]"
        />
        
        {/* Overlay UI */}
        <div className="absolute top-4 left-4 flex gap-4">
            <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-white font-mono font-bold text-xl">
                Score: {score}
            </div>
            {isPlaying && (
                <div className="bg-purple-600/80 backdrop-blur-md px-4 py-2 rounded-xl border border-purple-400 text-white font-bold">
                    Note: {currentNote}
                </div>
            )}
        </div>

        {(!isPlaying || gameOver) && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8">
                {gameOver && (
                    <div className="mb-6 animate-bounce">
                        <h3 className="text-4xl font-bold text-red-500 mb-2">Game Over!</h3>
                        <p className="text-white text-xl">Final Score: {score}</p>
                    </div>
                )}
                
                <button 
                    onClick={startGame}
                    className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full font-bold text-white text-xl shadow-[0_0_20px_rgba(147,51,234,0.6)] hover:scale-110 transition-transform overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {gameOver ? <RotateCcw /> : <Play />}
                        {gameOver ? 'Try Again' : 'Start Game'}
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
                <p className="mt-4 text-gray-400 text-sm">Requires Microphone</p>
            </div>
        )}
      </div>
      
      <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-sm text-gray-400 max-w-lg text-center">
        <span className="text-purple-400 font-bold">Tip:</span> Try humming or whistling if your guitar isn't handy. Aim for clear, steady notes in the 3rd and 4th octave (C3 - C4).
      </div>
    </div>
  );
};
