import React from 'react';
import { ArrowRight, BookOpen, ShieldCheck, Sparkles, Database, Lock, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface SplashViewProps {
  onContinue: () => void;
}

export const SplashView: React.FC<SplashViewProps> = ({ onContinue }) => {
  return (
    <div 
      id="phase-1-splash-screen"
      className="relative min-h-screen w-full flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white overflow-hidden transition-colors duration-300 select-none"
    >
      {/* Top Header Bar */}
      <header className="h-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 sm:px-12 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-md shadow-blue-500/20">
            D
          </div>
          <span className="text-xl font-extrabold tracking-tight text-blue-950 dark:text-white">
            devsphere<span className="text-blue-600 dark:text-blue-400">Africa</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
          <span className="text-blue-600 dark:text-blue-400">Phase 1: Welcome</span>
          <span>Phase 2: Overview</span>
          <span>Phase 3: Gateway</span>
          <span>Phase 4: Vault</span>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle id="splash-theme-toggle" variant="floating" />
          <button 
            onClick={onContinue}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-md shadow-blue-500/20 transition-all hover:scale-105 cursor-pointer"
          >
            Enter Vault
          </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-12 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
        
        {/* Left Column: Bold Typography Display */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-7">
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
            <span className="text-sm font-black uppercase tracking-[0.35em]">Official Academic Resource Hub</span>
            <div className="h-1 w-20 sm:w-28 bg-blue-500/50 rounded-full"></div>
          </div>

          <h1 
            id="splash-main-header"
            className="text-6xl sm:text-8xl md:text-9xl lg:text-[108px] font-black text-blue-950 dark:text-white tracking-tighter leading-[0.85] uppercase"
          >
            BRANDOZ<br/>
            <span className="text-blue-600 dark:text-blue-400">DEVSPHERE</span>
          </h1>

          <p 
            id="splash-subtext"
            className="text-xl sm:text-2xl md:text-3xl text-slate-700 dark:text-slate-200 font-semibold max-w-xl leading-relaxed"
          >
            Over <span className="text-blue-600 dark:text-blue-400 font-black italic underline decoration-blue-400 underline-offset-4">10,000+</span> past examination papers from top African universities. Instant canvas streaming with zero-download DRM protection.
          </p>

          {/* High-Impact Stat Blocks */}
          <div className="pt-6 flex flex-wrap items-center gap-8 sm:gap-14 border-t-2 border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-4xl sm:text-5xl font-black text-blue-950 dark:text-white tracking-tight">24/7</div>
              <div className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1.5">AI Copilot</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-slate-200 dark:bg-slate-800"></div>
            <div>
              <div className="text-4xl sm:text-5xl font-black text-blue-950 dark:text-white tracking-tight">0.0kb</div>
              <div className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1.5">Storage Needed</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-slate-200 dark:bg-slate-800"></div>
            <div>
              <div className="text-4xl sm:text-5xl font-black text-blue-950 dark:text-white tracking-tight">48+</div>
              <div className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1.5">Institutions</div>
            </div>
          </div>
        </div>

        {/* Right Column: Activation Hero Card with Typography Watermark */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl relative overflow-hidden flex flex-col items-center justify-center p-8 sm:p-10 shadow-2xl shadow-blue-500/20 text-white">
          
          {/* Large Bold Typography Watermark */}
          <div className="absolute top-2 right-2 p-4 pointer-events-none select-none">
            <span className="text-blue-300 dark:text-blue-900/60 text-[130px] sm:text-[160px] font-black leading-none opacity-20">
              VAULT
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl shadow-2xl p-8 sm:p-9 w-full max-w-sm relative z-10 border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/80 rounded-2xl flex items-center justify-center mb-5 text-blue-600 dark:text-blue-400 ring-8 ring-blue-50/50 dark:ring-blue-950/30">
                <BookOpen className="w-8 h-8" />
              </div>
              
              <h2 className="text-2xl font-black text-blue-950 dark:text-white mb-2 tracking-tight">
                Phase 1 Activation
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
                Enter the revision vault to start your exam preparation journey with devsphereAfrica.
              </p>

              <button 
                id="splash-continue-btn"
                onClick={onContinue}
                className="w-full py-4 sm:py-4.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-2xl font-black text-base sm:text-lg uppercase tracking-widest shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>CONTINUE</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="mt-5 flex items-center gap-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-blue-500" />
                <span>End-to-End Encrypted Access</span>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-8 w-full max-w-xs relative z-10">
            <div className="h-2 w-full bg-blue-500/50 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-white rounded-full"></div>
            </div>
            <div className="flex justify-between mt-2.5 text-[10px] font-bold text-blue-100 uppercase tracking-widest">
              <span>Initializing Portal</span>
              <span>Phase 1 Active</span>
            </div>
          </div>

        </div>

      </main>

      {/* Footer Bar */}
      <footer className="h-14 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 sm:px-12 flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest shrink-0">
        <div className="flex gap-4 sm:gap-8">
          <span>© 2026 Devsphere Africa</span>
          <span className="hidden sm:inline">Zero-Download DRM</span>
          <span className="hidden sm:inline">10,000+ Exam Papers</span>
        </div>
        <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
          <span>Server Status: Online</span>
          <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></div>
        </div>
      </footer>
    </div>
  );
};

