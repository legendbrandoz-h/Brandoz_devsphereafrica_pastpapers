import React, { useState } from 'react';
import { 
  Sparkles, Shield, Search, Zap, CheckCircle2, ArrowRight, 
  Lock, Eye, GraduationCap, Clock, Award, ChevronRight, Terminal,
  UploadCloud, Server, ShieldCheck
} from 'lucide-react';
import { PastPaper, UserProfile } from '../types';
import { searchPastPapers } from '../data/pastPapers';

interface LandingViewProps {
  onFindPapers: () => void;
  onSelectSamplePaper?: (paper: PastPaper) => void;
  onOpenUpload?: () => void;
  currentUser?: UserProfile | null;
  onOpenArchitecture?: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onFindPapers,
  onSelectSamplePaper,
  onOpenUpload,
  currentUser,
  onOpenArchitecture
}) => {
  const [demoQuery, setDemoQuery] = useState('2.1 data basemanagement');
  const demoResults = searchPastPapers(demoQuery);
  const userEmail = (currentUser?.school_email || '').toLowerCase().trim();
  const isAdmin = currentUser?.role === 'admin' && (userEmail === 'legendbrandoz@gmail.com');

  return (
    <div id="phase-2-landing-page" className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200">
      
      {/* Hero Banner Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Background glow & subtle watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-500/10 dark:bg-blue-600/10 blur-3xl rounded-full -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-100/90 dark:bg-blue-950/90 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-black uppercase tracking-widest mb-7 shadow-sm">
          <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Zero-Download Protected Vault &bull; 10,000+ Exam Papers</span>
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-blue-950 dark:text-white tracking-tighter max-w-6xl mx-auto uppercase leading-[0.92]">
          SUPERCHARGE YOUR REVISION WITH <span className="text-blue-600 dark:text-blue-400">DEVSPHERE AFRICA</span>
        </h1>

        <p className="mt-8 text-xl sm:text-2xl md:text-3xl text-slate-700 dark:text-slate-200 max-w-4xl mx-auto font-semibold leading-relaxed">
          The official read-only past exam paper repository for African higher education institutions. Instant canvas streaming, intelligent AI marking schemes, and strict DRM security.
        </p>

        {/* Primary Call to Action */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="hero-find-papers-btn"
            onClick={onFindPapers}
            className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-black text-base uppercase tracking-widest shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group cursor-pointer"
          >
            <span>Find Past Papers Now</span>
            <ArrowRight className="w-5 h-5 text-blue-100 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Upload Button - STRICTLY ADMIN ONLY */}
          {isAdmin && onOpenUpload && (
            <button
              id="hero-upload-paper-btn"
              onClick={onOpenUpload}
              className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-amber-500/10 border border-amber-400/40 text-amber-700 dark:text-amber-300 font-bold text-sm uppercase tracking-widest hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
            >
              <UploadCloud className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>Upload Past Paper (Admin)</span>
            </button>
          )}

          {/* Explore Architecture Button - STRICTLY ADMIN ONLY */}
          {isAdmin && (
            <button
              id="hero-architecture-btn"
              onClick={() => {
                if (onOpenArchitecture) {
                  onOpenArchitecture();
                } else {
                  const el = document.getElementById('features');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700/60 text-amber-800 dark:text-amber-300 font-bold text-sm uppercase tracking-widest hover:bg-amber-50/50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              <span>System Architecture (Admin)</span>
            </button>
          )}
        </div>

        {/* Interactive Lightning-Fast Search Live Demo Box */}
        <div className="mt-16 max-w-3xl mx-auto text-left bg-white dark:bg-slate-900 rounded-3xl border border-blue-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-4.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-300" />
              <span className="font-black text-sm uppercase tracking-widest">Lightning Search Engine Demo</span>
            </div>
            <span className="text-xs bg-blue-600/60 px-3.5 py-1 rounded-full text-blue-100 font-bold uppercase tracking-wider">
              10,420 Papers Indexed
            </span>
          </div>

          <div className="p-7 space-y-4">
            <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Try searching a unit code, year, or subject (e.g., "2.1 data basemanagement", "CS 2.1", "Operating Systems", "Zetech", "ZU"):
            </label>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 dark:text-blue-400" />
              <input
                id="landing-search-demo-input"
                type="text"
                value={demoQuery}
                onChange={(e) => setDemoQuery(e.target.value)}
                placeholder='Type "2.1 data basemanagement" or "CS 2.1"...'
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-blue-200 dark:border-slate-700 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
              />
            </div>

            {/* Live Search Token Feedback */}
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
              <span className="font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[11px]">Parsed Tokens:</span>
              {demoQuery.split(/[\s,._-]+/).filter(Boolean).map((t, idx) => (
                <span key={idx} className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 rounded font-mono text-[11px] font-bold">
                  #{t}
                </span>
              ))}
            </div>

            {/* Matched Result Preview Card */}
            <div className="pt-2">
              <div className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Instant Matches ({demoResults.length} found):
              </div>
              
              <div className="space-y-2">
                {demoResults.slice(0, 2).map((paper) => (
                  <div 
                    key={paper.paper_id}
                    onClick={onFindPapers}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-blue-50/70 dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white font-black text-xs uppercase tracking-wider">
                          {paper.course_code}
                        </span>
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {paper.unit_title}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                          ({paper.exam_year})
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                        <span>{paper.university_name}</span> &bull; 
                        <span>{paper.semester}</span> &bull; 
                        <span>{paper.duration_hours}h Exam ({paper.total_marks} Marks)</span>
                      </p>
                    </div>

                    <button className="px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-wider group-hover:bg-blue-700 transition-colors flex items-center gap-1">
                      <span>Instant View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-black uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built For Academic Excellence</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-blue-950 dark:text-white tracking-tight uppercase">
            CORE ENGINEERING & STUDY MECHANICS
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium">
            A comprehensive suite of technologies designed to empower students while safeguarding educational copyright.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Feature 1: AI Assistant */}
          <div id="ai-copilot" className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                AI Exam Copilot (Gemini Protocol)
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Stuck on a tricky 12-mark question? Our integrated AI tutor analyzes exam scenarios, provides marking scheme hints, explains formulas, and generates step-by-step model derivations.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Full Step-by-Step Reasoning</span>
            </div>
          </div>

          {/* Feature 2: No-Download Security */}
          <div id="security" className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Absolute No-Download DRM Security
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Exam papers stream securely directly into read-only Canvas layers with active dynamic student watermarking. Right-click, copy-paste, printing, and file downloads are strictly prevented.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Encrypted Read-Only Canvas</span>
            </div>
          </div>

          {/* Feature 3: Lightning-Fast Search */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Lightning-Fast Tokenized Search
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Compound queries like <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">"2.1 data basemanagement"</span> are split into semantic tags and matched against university databases in under 15ms.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Sub-15ms Token Engine</span>
            </div>
          </div>

          {/* Feature 4: 1-Click Instant View */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                1-Click Instant Secure View
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                No slow 5-page redirect loops or ad walls. Click any exam paper to immediately launch our responsive, hardware-accelerated interactive modal canvas reader.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Hardware-Accelerated Overlay</span>
            </div>
          </div>

          {/* Feature 5: Universal Dark Mode */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Late-Night Eye Protection
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Students study late before exams. Our deep charcoal dark mode saves your eyes, reduces screen glare, and stays persisted across your devices.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Universal Dark Mode</span>
            </div>
          </div>

          {/* Feature 6: Mobile-First Responsive */}
          <div className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                All African Universities Registry
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                From Zetech University and Makerere to UCT, UNILAG, and Cairo University. Curated specifically for STEM, Law, Business, Medicine, and Humanities curricula.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified Directory</span>
            </div>
          </div>

        </div>
      </section>

      {/* 100% Free Open Access Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase tracking-widest mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>100% Free & Open Access Platform</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-blue-950 dark:text-white tracking-tight uppercase">
            FREE LIFETIME REVISION ACCESS
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium">
            Zero subscription fees, zero paywalls. DevSphere Africa is 100% free for all students and faculty members across African universities.
          </p>
        </div>

        <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white shadow-2xl border border-blue-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 pointer-events-none select-none opacity-10">
            <GraduationCap className="w-64 h-64 text-white" />
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-black uppercase tracking-widest inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Unlimited Free Access</span>
              </span>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
                $0.00 <span className="text-sm text-blue-200 font-bold uppercase tracking-wider">/ Free For Everyone</span>
              </h3>
              <p className="text-sm text-blue-100/90 leading-relaxed">
                Enjoy unrestricted access to all 10,000+ past exam papers, 24/7 Gemini AI study copilot assistance, and real-time cloud data synchronization.
              </p>
            </div>

            <div className="space-y-3 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>10,000+ Past Examination Papers</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>24/7 AI Exam Copilot (Gemini Protocol)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Download HTML5 Canvas DRM</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Persistent Cloud Account Storage</span>
              </div>
              
              <button
                onClick={onFindPapers}
                className="mt-4 w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/30 transition-all cursor-pointer hover:scale-[1.02]"
              >
                Access Free Vault Now &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
