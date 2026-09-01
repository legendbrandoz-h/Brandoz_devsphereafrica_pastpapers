import React, { useState } from 'react';
import { X, Check, ShieldCheck, Building, Sparkles, ChevronRight, User, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';
import { AFRICAN_UNIVERSITIES } from '../data/universities';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile, preFilterQuery?: string) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [step, setStep] = useState<'choose_account' | 'add_account'>('choose_account');
  const [selectedUniversity, setSelectedUniversity] = useState('Zetech University');
  const [selectedYear, setSelectedYear] = useState('Year 2');
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const defaultAccounts = [
    {
      name: 'Brandoz (DevSphere)',
      email: 'legendbrandoz@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      initials: 'LB'
    },
    {
      name: 'Zetech Tech Scholar',
      email: 'scholar.tech@zetech.ac.ke',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      initials: 'ZS'
    }
  ];

  const handleSelectAccount = (account: { name: string; email: string }) => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      setIsLoading(false);
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
      } catch (e) {}

      const userProfile: UserProfile = {
        user_id: 'usr_google_' + Math.random().toString(36).substring(2, 9),
        full_name: account.name,
        school_email: account.email,
        school_name: selectedUniversity,
        year_of_study: selectedYear,
        unit_papers_required: 'Software Engineering (1.1 - 4.2)',
        email_verified: true,
        role: account.email.includes('admin') ? 'admin' : 'student',
        plan: 'semester',
        joined_at: new Date().toISOString()
      };

      onSuccess(userProfile, '1.1');
      onClose();
    }, 600);
  };

  const handleCustomAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) {
      setError('Please enter a valid Google or University email address.');
      return;
    }

    handleSelectAccount({
      name: customName || customEmail.split('@')[0],
      email: customEmail
    });
  };

  return (
    <div 
      id="google-sso-modal-overlay" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-white my-8">
        
        {/* Google OAuth Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Sign in with Google
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                to continue to <span className="font-semibold text-blue-600 dark:text-blue-400">DevSphere Revision Vault</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Institution & Year Selection Context */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-850/70 border-b border-slate-100 dark:border-slate-800 text-xs flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px]">Your University:</span>
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none max-w-[220px] truncate"
            >
              {AFRICAN_UNIVERSITIES.map(u => (
                <option key={u.id} value={u.name}>{u.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px]">Level / Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="Year 1">Year 1 (1.1 / 1.2)</option>
              <option value="Year 2">Year 2 (2.1 / 2.2)</option>
              <option value="Year 3">Year 3 (3.1 / 3.2)</option>
              <option value="Year 4">Year 4 (4.1 / 4.2)</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 'choose_account' ? (
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-3">
                Choose an account to continue:
              </p>

              {defaultAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAccount(acc)}
                  disabled={isLoading}
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all flex items-center justify-between text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
                      {acc.initials}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {acc.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {acc.email}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
                </button>
              ))}

              <button
                onClick={() => { setStep('add_account'); setError(null); }}
                className="w-full p-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-center gap-3 text-left cursor-pointer mt-2"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Use another Google account
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomAccountSubmit} className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Brandon Dev"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Google Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setStep('choose_account'); setError(null); }}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <span>Continue with Google</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Privacy note */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center leading-relaxed">
            By continuing, Google will share your name, email address, and profile picture with DevSphere Africa under academic privacy standards.
          </div>

        </div>

      </div>
    </div>
  );
};
