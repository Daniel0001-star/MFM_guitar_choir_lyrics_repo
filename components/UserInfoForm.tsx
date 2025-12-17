import React, { useState, useMemo } from 'react';
import { User, MapPin, Shield, MessageSquare, ArrowRight, Mail, CheckCircle2 } from 'lucide-react';

const StarField = () => {
  const stars = useMemo(() => {
    return [...Array(100)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 30 + 20,
      delay: Math.random() * 20,
      opacity: Math.random() * 0.7 + 0.3,
      color: `hsl(${Math.random() * 360}, 100%, 70%)`
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <style>{`
        @keyframes space-drift {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: var(--target-opacity); }
          90% { opacity: var(--target-opacity); }
          100% { transform: translateY(-150px) translateX(-30px); opacity: 0; }
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
            boxShadow: `0 0 ${star.size + 2}px ${star.color}`,
            opacity: 0,
            '--target-opacity': star.opacity,
            animation: `space-drift ${star.duration}s linear infinite`,
            animationDelay: `-${star.delay}s`
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

interface UserInfoFormProps {
  onSubmit: (name: string) => void;
}

export const UserInfoForm: React.FC<UserInfoFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('');
  const [leader, setLeader] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Your name is required to continue.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('A valid email is required to send you the welcome package.');
      return;
    }
    
    setError('');
    setIsSubmitting(true);

    // Simulate sending welcome email/image
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Auto-redirect after showing success message
      setTimeout(() => {
        onSubmit(name);
      }, 2000);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-indigo-950 relative overflow-hidden">
        <StarField />
        <div className="relative z-10 w-full max-w-lg p-8 animate-fade-in text-center">
           <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-12 flex flex-col items-center">
             <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.5)] animate-bounce">
               <CheckCircle2 className="text-white w-10 h-10" />
             </div>
             <h2 className="text-3xl font-bold text-white mb-4">Welcome Package Sent!</h2>
             <p className="text-purple-200 text-lg mb-6">
               Check your inbox at <span className="text-white font-semibold">{email}</span> for your Guitar Choir welcome image.
             </p>
             <p className="text-sm text-purple-300/60 animate-pulse">Entering Repository...</p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-950 to-indigo-950 relative overflow-hidden">
      <StarField />
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />

      <div className="relative z-10 w-full max-w-lg p-8">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-8 transform transition-all hover:scale-[1.01] duration-500 animate-fade-in">
          
          <div className="flex flex-col items-center mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Almost there...</h1>
            <p className="text-purple-300/80">Tell us about yourself to receive your welcome pack.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <label htmlFor="name" className="text-xs font-semibold text-purple-300 uppercase tracking-wider ml-1">What is your name?</label>
              <div className="relative mt-1">
                 <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                 <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="block w-full pl-10 pr-3 py-3 bg-black/20 border border-purple-500/30 rounded-lg text-purple-100 placeholder-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" placeholder="e.g. John Doe" required />
              </div>
            </div>

            <div className="relative group">
               <label htmlFor="email" className="text-xs font-semibold text-purple-300 uppercase tracking-wider ml-1">Email Address (For Welcome Image)</label>
               <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-10 pr-3 py-3 bg-black/20 border border-purple-500/30 rounded-lg text-purple-100 placeholder-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" placeholder="e.g. john@example.com" required />
               </div>
            </div>

            <div className="relative group">
               <label htmlFor="region" className="text-xs font-semibold text-purple-300 uppercase tracking-wider ml-1">What region are you from?</label>
               <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <input id="region" type="text" value={region} onChange={(e) => setRegion(e.target.value)} className="block w-full pl-10 pr-3 py-3 bg-black/20 border border-purple-500/30 rounded-lg text-purple-100 placeholder-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" placeholder="e.g. Lagos Region 1" />
               </div>
            </div>
            
            <div className="relative group">
                <label htmlFor="leader" className="text-xs font-semibold text-purple-300 uppercase tracking-wider ml-1">What is your region leader's name?</label>
                <div className="relative mt-1">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                    <input id="leader" type="text" value={leader} onChange={(e) => setLeader(e.target.value)} className="block w-full pl-10 pr-3 py-3 bg-black/20 border border-purple-500/30 rounded-lg text-purple-100 placeholder-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" placeholder="e.g. Pastor John" />
                </div>
            </div>

            <div className="relative group">
                <label htmlFor="comment" className="text-xs font-semibold text-purple-300 uppercase tracking-wider ml-1">Say something about guitar choir</label>
                <div className="relative mt-1">
                    <MessageSquare className="absolute left-3 top-4 h-5 w-5 text-purple-400" />
                    <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} className="block w-full pl-10 pr-3 py-3 bg-black/20 border border-purple-500/30 rounded-lg text-purple-100 placeholder-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none h-24" placeholder="It's been an amazing journey..."></textarea>
                </div>
            </div>

            {error && <p className="text-red-400 text-xs text-center animate-pulse">{error}</p>}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium shadow-lg shadow-purple-900/40 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Enter Repository</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};