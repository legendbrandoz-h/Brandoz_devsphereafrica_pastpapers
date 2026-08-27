import React, { useState } from 'react';
import { 
  Shield, Server, Cpu, Database, Lock, Sparkles, Terminal, 
  Layers, CheckCircle2, X, Activity, Globe, Eye, Zap, KeyRound
} from 'lucide-react';
import { UserProfile } from '../types';

interface SystemArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
}

export const SystemArchitectureModal: React.FC<SystemArchitectureModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'drm' | 'ai' | 'infra' | 'data'>('overview');

  if (!isOpen) return null;

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div 
      id="system-architecture-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        id="system-architecture-modal-card"
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 flex items-center justify-between border-b border-blue-900/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shadow-inner">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Admin Only View
                </span>
                <span className="text-xs text-blue-300 font-mono font-bold">
                  DevSphere v2.4 Architecture
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-white mt-0.5">
                SYSTEM & REVISION VAULT ARCHITECTURE
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Architecture Modal"
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs font-black uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Overview & Topology</span>
          </button>

          <button
            onClick={() => setActiveTab('drm')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'drm'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>No-Download DRM Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini AI Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'data'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Curriculum & RBAC Layer</span>
          </button>

          <button
            onClick={() => setActiveTab('infra')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'infra'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Cloud Run Ingress</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300">
          
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-blue-950 dark:text-blue-200 uppercase text-xs tracking-wider">
                    Full-Stack System Topology
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    DevSphere utilizes an Express + Vite architecture running on Google Cloud Run containers. The frontend executes a protected, zero-download HTML5 Canvas render pipeline while all authentication, rate limits, and Gemini AI inference run server-side behind port 3000.
                  </p>
                </div>
              </div>

              {/* Visual Flow Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="w-8 h-8 mx-auto rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">1</div>
                  <h5 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">Client Edge</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Vite React 18 SPA with Tailwind styling & DRM input interception</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="w-8 h-8 mx-auto rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">2</div>
                  <h5 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">Nginx & Express</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Port 3000 reverse proxy routing, session validation, & CORS enforcement</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="w-8 h-8 mx-auto rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">3</div>
                  <h5 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">AI Copilot Proxy</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Server-side Gemini 2.5 Flash SDK proxy with syllabus context grounding</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="w-8 h-8 mx-auto rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">4</div>
                  <h5 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">Secure Stores</h5>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">56 SE curriculum units (1.1-4.2), RBAC store (Branol123), & DRM repository</p>
                </div>
              </div>

              {/* Status Overview Matrix */}
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-blue-400 border-b border-slate-800 pb-2">
                  <span>SYSTEM_HEALTH_METRICS</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">● ALL SYSTEMS NOMINAL</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                  <div><span className="text-slate-500">RUNTIME:</span> Node 20 LTS</div>
                  <div><span className="text-slate-500">CONTAINER:</span> Cloud Run</div>
                  <div><span className="text-slate-500">PORT:</span> 3000 (Ingress)</div>
                  <div><span className="text-slate-500">DRM STATUS:</span> ACTIVE</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'drm' && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" />
                Zero-Download Canvas DRM Security Mechanics
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Traditional exam repositories expose raw PDF URLs that allow students to scrape or distribute copyright-protected academic content. DevSphere eliminates download vectors through a 4-tier security perimeter:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="font-bold text-xs text-blue-600 dark:text-blue-400 uppercase">1. Vector Rasterization</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Exam questions render onto isolated HTML5 2D Canvas buffers rather than downloadable PDF DOM elements.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="font-bold text-xs text-blue-600 dark:text-blue-400 uppercase">2. Dynamic Student Watermark</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Overlays user email, IP stamp, timestamp, and institutional ID directly onto rendered frames at 45° angle.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="font-bold text-xs text-blue-600 dark:text-blue-400 uppercase">3. Keystroke & Print Hook</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Intercepts Ctrl+P, Ctrl+S, Alt+PrintScreen, and browser context menus, raising active security notices.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="font-bold text-xs text-blue-600 dark:text-blue-400 uppercase">4. Encrypted In-Memory Payloads</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Exam streams are ephemeral in memory with strict CORS, preventing curl or automated wget scraping.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Gemini 2.5 Flash Server-Side AI Pipeline
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                All AI queries are proxied via server endpoint <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-400 font-mono">/api/ai/copilot</code> using the official <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">@google/genai</code> SDK. The GEMINI_API_KEY secret remains strictly server-side.
              </p>

              <div className="p-4 rounded-2xl bg-slate-900 font-mono text-xs text-slate-200 space-y-2">
                <div className="text-indigo-400 font-bold">// AI Prompt Ingestion Flow</div>
                <div className="text-slate-400">1. Client requests hint for Exam Question (e.g. Q2b: B-Tree Indexing vs Hash Indexing)</div>
                <div className="text-slate-400">2. Server injects university grading schema and syllabus constraints</div>
                <div className="text-slate-400">3. Gemini 2.5 Flash calculates marks distribution, model answer, & key pitfalls</div>
                <div className="text-emerald-400">4. Streamed back to client with markdown equations and structured marks</div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-500" />
                Curriculum Dataset & RBAC Authorization
              </h3>
              <div className="space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  The repository manages complete 4-year degree programs, including 56 Software Engineering units across Semesters 1.1 to 4.2.
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                    Administrative Access Credentials
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 text-[11px] block">ADMIN USERNAME</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">Branol123</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 text-[11px] block">SECURITY HASH PASS</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">Branol@006</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Administrator accounts have exclusive rights to upload past papers, verify moderation, manage semester curricula, and access system architecture diagnostics.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'infra' && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                <Server className="w-4 h-4 text-purple-500" />
                Cloud Run & Networking Specifications
              </h3>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-900 font-mono text-xs text-slate-300 space-y-2">
                  <div className="text-purple-400 font-bold">// Container Network Specifications</div>
                  <div>• HTTP Reverse Proxy: Nginx on port 3000 (0.0.0.0:3000)</div>
                  <div>• SSL Termination: Automatic Google Cloud HTTPS certificates</div>
                  <div>• Build Pipeline: <code className="text-amber-300">vite build && esbuild server.ts --bundle</code></div>
                  <div>• Server Entry: <code className="text-amber-300">dist/server.cjs</code> (CommonJS Bundle)</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-mono">
            Authenticated Admin: <strong className="text-slate-900 dark:text-white">{currentUser?.full_name || 'Branol (Admin)'}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider transition-all cursor-pointer"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
