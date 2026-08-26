import React, { useState } from 'react';
import { 
  Lock, Mail, Building, GraduationCap, BookOpen, Search, 
  ArrowRight, CheckCircle2, AlertCircle, Sparkles, KeyRound, X, RefreshCw,
  ShieldCheck, UserCheck, HelpCircle, ArrowLeft, Code2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';
import { AFRICAN_UNIVERSITIES, isValidUniversity } from '../data/universities';
import { GoogleAuthModal } from './GoogleAuthModal';
import { SE_SEMESTERS, SOFTWARE_ENGINEERING_UNITS } from '../data/softwareEngineeringCurriculum';

interface AuthHubProps {
  onAuthSuccess: (user: UserProfile, preFilterQuery?: string) => void;
  onBackToLanding: () => void;
}

export const AuthHub: React.FC<AuthHubProps> = ({
  onAuthSuccess,
  onBackToLanding
}) => {
  const [authTab, setAuthTab] = useState<'login' | 'signup' | 'forgot'>('login');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  
  // Registration Form State
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupSchoolName, setSignupSchoolName] = useState('University of Nairobi');
  const [signupYearOfStudy, setSignupYearOfStudy] = useState('Year 2');
  const [signupUnitRequired, setSignupUnitRequired] = useState('Software Engineering (2.1 - BDM 121 / BSD 211)');
  const [signupRole, setSignupRole] = useState<'student' | 'admin'>('student');
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState('student@uonbi.ac.ke');
  const [loginPassword, setLoginPassword] = useState('student123');
  const [loginPreFilterSearch, setLoginPreFilterSearch] = useState('2.1');

  // UI Flow States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formNotice, setFormNotice] = useState<string | null>(null);
  const [existingUserPrompt, setExistingUserPrompt] = useState<boolean>(false);
  
  // Verification Modal State
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [receivedCodePreview, setReceivedCodePreview] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  // Forgot Password Flow State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'verify' | 'done'>('request');
  const [forgotCode, setForgotCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotCodePreview, setForgotCodePreview] = useState('');

  // University Autocomplete State
  const [showUniDropdown, setShowUniDropdown] = useState(false);
  const filteredUniversities = AFRICAN_UNIVERSITIES.filter(u => 
    u.name.toLowerCase().includes(signupSchoolName.toLowerCase()) ||
    u.acronym.toLowerCase().includes(signupSchoolName.toLowerCase())
  );

  // Quick fill demo accounts
  const quickFillAdmin = () => {
    setAuthTab('login');
    setLoginEmail('Branol123');
    setLoginPassword('Branol@006');
    setFormError(null);
    setExistingUserPrompt(false);
  };

  const quickFillStudent = () => {
    setAuthTab('login');
    setLoginEmail('student@uonbi.ac.ke');
    setLoginPassword('student123');
    setFormError(null);
    setExistingUserPrompt(false);
  };

  // Google SSO Simulation
  const handleGoogleAuth = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      try {
        confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}

      const user: UserProfile = {
        user_id: 'usr_google_' + Math.random().toString(36).substring(2, 7),
        full_name: 'African Academic Scholar',
        school_email: 'scholar.african@university.ac.ke',
        school_name: 'University of Nairobi',
        year_of_study: 'Year 2',
        unit_papers_required: 'CS 2.1 Data Base Management',
        email_verified: true,
        role: 'student',
        plan: 'semester',
        joined_at: new Date().toISOString()
      };
      onAuthSuccess(user, '2.1 data basemanagement');
    }, 600);
  };

  // Real Sign Up Handler
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormNotice(null);
    setExistingUserPrompt(false);

    if (!signupEmail || !signupPassword) {
      setFormError('Please enter your school email and password.');
      return;
    }

    if (!signupEmail.includes('@')) {
      setFormError('Please provide a valid academic/school email address.');
      return;
    }

    if (signupPassword.length < 6) {
      setFormError('Password must be at least 6 characters in length.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setFormError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!isValidUniversity(signupSchoolName)) {
      setFormError(`"${signupSchoolName}" is not recognized in our African University registry.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: signupFullName || 'DevSphere Student',
          school_email: signupEmail,
          password: signupPassword,
          school_name: signupSchoolName,
          year_of_study: signupYearOfStudy,
          unit_papers_required: signupUnitRequired,
          role: signupRole
        })
      });

      const data = await res.json();

      if (res.status === 409 || data.isExistingUser) {
        setExistingUserPrompt(true);
        setFormError(data.error || 'This email is already registered. Please log in or reset your password.');
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Success: open 6-digit verification modal
      setPendingEmail(signupEmail);
      setReceivedCodePreview(data.simulatedCode || '839201');
      setVerificationCode(data.simulatedCode || '');
      setShowVerifyModal(true);
    } catch (err: any) {
      setFormError(err?.message || 'Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Real Verification Code Submit
  const handleVerifyCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsVerifying(true);

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_email: pendingEmail || signupEmail,
          code: verificationCode
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid verification code');
      }

      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
      } catch (e) {}

      setShowVerifyModal(false);
      onAuthSuccess(data.user, '2.1 data basemanagement');
    } catch (err: any) {
      setFormError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Real Login Handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormNotice(null);
    setExistingUserPrompt(false);

    if (!loginEmail || !loginPassword) {
      setFormError('Please enter both your registered school username/email and password.');
      return;
    }

    const cleanInput = loginEmail.trim();
    const cleanLower = cleanInput.toLowerCase();

    // Instant validation for Branol123 master admin credentials
    if ((cleanLower === 'branol123' || cleanLower === 'branol123@devsphere.africa' || cleanLower === 'admin@devsphere.africa') && loginPassword === 'Branol@006') {
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 } });
      } catch (e) {}
      
      const adminUser: UserProfile = {
        user_id: 'usr_admin_branol_01',
        full_name: 'Branol (Lead Administrator)',
        school_email: cleanInput.includes('@') ? cleanInput : 'Branol123',
        school_name: 'DevSphere Central Administration',
        year_of_study: 'Staff / Admin',
        unit_papers_required: 'Admin Repository & Curriculum Controller',
        email_verified: true,
        role: 'admin',
        plan: 'semester',
        joined_at: new Date().toISOString()
      };
      onAuthSuccess(adminUser, loginPreFilterSearch);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_email: loginEmail,
          password: loginPassword
        })
      });

      const data = await res.json();

      if (res.status === 404) {
        setFormError('No account found for this username/email address. Please click Register to create your account.');
        return;
      }

      if (res.status === 401) {
        setFormError('Incorrect password entered. (Admin: Branol123 / Branol@006). Please try again.');
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      try {
        confetti({ particleCount: 70, spread: 50, origin: { y: 0.5 } });
      } catch (e) {}

      onAuthSuccess(data.user, loginPreFilterSearch);
    } catch (err: any) {
      setFormError(err.message || 'An error occurred while logging in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Real Forgot Password - Step 1: Send Reset Code
  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!forgotEmail || !forgotEmail.includes('@')) {
      setFormError('Please enter a valid registered school email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ school_email: forgotEmail })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch reset code');
      }

      setForgotCodePreview(data.simulatedCode || '729481');
      setForgotCode(data.simulatedCode || '');
      setForgotStep('verify');
    } catch (err: any) {
      setFormError(err.message || 'Failed to send password reset code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Real Forgot Password - Step 2: Reset Password with Code
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!forgotCode || forgotCode.length < 6) {
      setFormError('Please enter the 6-digit reset code sent to your email.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setFormError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setFormError('New passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_email: forgotEmail,
          code: forgotCode,
          new_password: newPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      setForgotStep('done');
      setTimeout(() => {
        // Automatically switch to login with new credentials prefilled
        setAuthTab('login');
        setLoginEmail(forgotEmail);
        setLoginPassword(newPassword);
        setForgotStep('request');
        setFormNotice('Password reset successful! You can now log in.');
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || 'Password reset failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="phase-3-auth-gateway" className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center transition-colors duration-200">
      
      {/* Header Breadcrumb */}
      <div className="w-full max-w-lg mb-5 flex items-center justify-between">
        <button
          onClick={onBackToLanding}
          className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          &larr; Back to Overview
        </button>
        <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          DevSphere Security Gateway
        </span>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Card Top Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-6 sm:p-7 text-white text-center relative">
          <div className="w-13 h-13 rounded-2xl bg-white/10 backdrop-blur-md mx-auto flex items-center justify-center mb-3 shadow-inner">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
            ACADEMIC ACCESS GATEWAY
          </h2>
          <p className="text-xs text-blue-100 mt-1.5 max-w-sm mx-auto font-medium">
            Authenticate to unlock 10,000+ encrypted African past examination papers with zero-download protection.
          </p>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-center gap-2 flex-wrap text-[11px]">
            <span className="text-blue-200">Quick Test:</span>
            <button
              type="button"
              onClick={quickFillAdmin}
              className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold transition-all flex items-center gap-1 cursor-pointer border border-white/20"
            >
              <ShieldCheck className="w-3 h-3 text-amber-300" />
              <span>Admin (Branol123)</span>
            </button>
            <button
              type="button"
              onClick={quickFillStudent}
              className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white font-semibold transition-all flex items-center gap-1 cursor-pointer border border-white/20"
            >
              <GraduationCap className="w-3 h-3 text-blue-300" />
              <span>Student Account</span>
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          
          {/* Master Google SSO Option */}
          {authTab !== 'forgot' && (
            <div>
              <button
                id="auth-google-master-btn"
                type="button"
                onClick={() => setShowGoogleModal(true)}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.01] hover:border-blue-500 group"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Continue with Google
                </span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-bold text-[10px] tracking-widest">
                    Or continue with credentials
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Form Tabs: Login vs Register vs Forgot Password */}
          {authTab !== 'forgot' ? (
            <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                id="tab-login-btn"
                type="button"
                onClick={() => { setAuthTab('login'); setFormError(null); setExistingUserPrompt(false); }}
                className={`py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  authTab === 'login'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Log In
              </button>
              <button
                id="tab-signup-btn"
                type="button"
                onClick={() => { setAuthTab('signup'); setFormError(null); setExistingUserPrompt(false); }}
                className={`py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  authTab === 'signup'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign Up (Register)
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => { setAuthTab('login'); setFormError(null); }}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Log In
              </button>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Password Recovery
              </span>
            </div>
          )}

          {/* Success Notice */}
          {formNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{formNotice}</span>
            </div>
          )}

          {/* Error Message Toast */}
          {formError && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/80 text-red-800 dark:text-red-200 text-xs space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <div className="flex-1 font-medium">{formError}</div>
              </div>
              
              {/* Existing User Action Prompt */}
              {existingUserPrompt && (
                <div className="pt-2 border-t border-red-200 dark:border-red-800 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail(signupEmail);
                      setAuthTab('login');
                      setFormError(null);
                      setExistingUserPrompt(false);
                    }}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    Log In Now &rarr;
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(signupEmail);
                      setAuthTab('forgot');
                      setForgotStep('request');
                      setFormError(null);
                      setExistingUserPrompt(false);
                    }}
                    className="px-3 py-1 bg-white dark:bg-slate-800 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700 rounded-lg font-bold text-[11px] hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Reset Password
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================= */}
          {/* TAB 1: LOGIN FORM */}
          {/* ========================================= */}
          {authTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Username or Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Username or Academic Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="login-email-input"
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. Branol123 or student@uonbi.ac.ke"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    id="login-forgot-password-link"
                    onClick={() => {
                      setForgotEmail(loginEmail);
                      setAuthTab('forgot');
                      setForgotStep('request');
                      setFormError(null);
                    }}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="login-password-input"
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Internal Pre-Filter Query */}
              <div className="pt-1">
                <label className="block text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" />
                  <span>Target Unit or Exam Search (optional filter):</span>
                </label>
                <input
                  id="login-prefilter-search-input"
                  type="text"
                  value={loginPreFilterSearch}
                  onChange={(e) => setLoginPreFilterSearch(e.target.value)}
                  placeholder="e.g. 2.1 data basemanagement"
                  className="w-full px-3 py-2 rounded-xl bg-blue-50/50 dark:bg-slate-800/80 border border-blue-200 dark:border-blue-900/60 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Revision Vault</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========================================= */}
          {/* TAB 2: SIGN UP (REGISTRATION) FORM */}
          {/* ========================================= */}
          {authTab === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  id="signup-fullname-input"
                  type="text"
                  required
                  value={signupFullName}
                  onChange={(e) => setSignupFullName(e.target.value)}
                  placeholder="e.g. Brian Omondi"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* School Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Academic / School Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="signup-email-input"
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="student@university.ac.ke"
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Create Password
                  </label>
                  <input
                    id="signup-password-input"
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="signup-confirm-password-input"
                    type="password"
                    required
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* African University Selector */}
              <div className="relative">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span>University (African Registry)</span>
                  {isValidUniversity(signupSchoolName) ? (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-500">Registry search</span>
                  )}
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="signup-school-input"
                    type="text"
                    required
                    value={signupSchoolName}
                    onFocus={() => setShowUniDropdown(true)}
                    onChange={(e) => {
                      setSignupSchoolName(e.target.value);
                      setShowUniDropdown(true);
                    }}
                    placeholder="Search university..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {showUniDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-30 max-h-44 overflow-y-auto">
                    {filteredUniversities.length > 0 ? (
                      filteredUniversities.map((uni) => (
                        <button
                          type="button"
                          key={uni.id}
                          onClick={() => {
                            setSignupSchoolName(uni.name);
                            setShowUniDropdown(false);
                          }}
                          className="w-full text-left px-3.5 py-2 text-xs hover:bg-blue-50 dark:hover:bg-slate-750 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 last:border-0"
                        >
                          <span className="font-semibold text-slate-900 dark:text-white">{uni.name}</span>
                          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">({uni.acronym}) &bull; {uni.country}</span>
                        </button>
                      ))
                    ) : (
                      <div className="p-3 text-xs text-slate-400 text-center">
                        No matching African university found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Year of Study & Account Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Year of Study
                  </label>
                  <select
                    id="signup-year-select"
                    value={signupYearOfStudy}
                    onChange={(e) => setSignupYearOfStudy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Year 1">Year 1 (1.1 / 1.2)</option>
                    <option value="Year 2">Year 2 (2.1 / 2.2)</option>
                    <option value="Year 3">Year 3 (3.1 / 3.2)</option>
                    <option value="Year 4">Year 4 (4.1 / 4.2)</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Account Role
                  </label>
                  <select
                    id="signup-role-select"
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value as 'student' | 'admin')}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="student">🎓 Student (Access Papers)</option>
                    <option value="admin">🛡️ Administrator (Can Upload)</option>
                  </select>
                </div>
              </div>

              {/* Notice */}
              <div className="p-2.5 bg-blue-50/80 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/50 text-[11px] text-blue-800 dark:text-blue-300">
                🔒 A 6-digit verification code will be sent directly to your email to verify student/admin status.
              </div>

              {/* Submit */}
              <button
                id="signup-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending Code to Email...</span>
                  </>
                ) : (
                  <>
                    <span>Register & Dispatch Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ========================================= */}
          {/* TAB 3: FORGOT PASSWORD FLOW */}
          {/* ========================================= */}
          {authTab === 'forgot' && (
            <div className="space-y-4">
              
              {forgotStep === 'request' && (
                <form onSubmit={handleSendResetCode} className="space-y-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-xl border border-blue-200 dark:border-blue-800/80 text-xs text-blue-900 dark:text-blue-200">
                    Enter your registered school email. We will send a secure 6-digit recovery code directly to your inbox.
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Registered School Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        id="forgot-email-input"
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="student@uonbi.ac.ke or admin@devsphere.africa"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    id="forgot-send-token-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sending Reset Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Send 6-Digit Reset Code to Email</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {forgotStep === 'verify' && (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-xl border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span>📧 Reset Code Sent</span>
                      <span className="font-mono bg-blue-600 text-white px-2 py-0.5 rounded text-[11px]">
                        OTP: {forgotCodePreview}
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-700 dark:text-blue-300">
                      Code dispatched to <strong className="font-mono">{forgotEmail}</strong>.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Enter 6-Digit Reset Code
                    </label>
                    <input
                      id="forgot-code-input"
                      type="text"
                      maxLength={6}
                      required
                      value={forgotCode}
                      onChange={(e) => setForgotCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="6-digit code"
                      className="w-full text-center font-mono tracking-widest text-lg font-bold py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-blue-500 text-blue-600 dark:text-blue-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      New Password
                    </label>
                    <input
                      id="forgot-new-password-input"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      id="forgot-confirm-password-input"
                      type="password"
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <button
                    id="forgot-reset-submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Reset Password & Log In</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {forgotStep === 'done' && (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/80 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Password Successfully Updated!
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Redirecting you to log in with your new credentials...
                  </p>
                </div>
              )}

            </div>
          )}

        </div>
      </div>

      {/* Verification Code Modal (Sign Up Verification Loop) */}
      {showVerifyModal && (
        <div 
          id="verification-modal-overlay"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-blue-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-2xl">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Enter Verification Code
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sent to: <span className="font-mono text-blue-600 dark:text-blue-400">{pendingEmail || signupEmail}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowVerifyModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email dispatch simulator box */}
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-xs text-blue-900 dark:text-blue-200 space-y-1">
              <div className="font-bold flex items-center justify-between">
                <span>📧 Simulated Academic Mailbox</span>
                <span className="font-mono text-[11px] bg-blue-600 text-white px-2 py-0.5 rounded">
                  OTP Code: {receivedCodePreview}
                </span>
              </div>
              <p className="text-[11px] text-blue-700 dark:text-blue-300">
                Your one-time 6-digit DevSphere activation token has arrived.
              </p>
            </div>

            <form onSubmit={handleVerifyCodeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-center">
                  6-Digit Activation Code
                </label>
                <input
                  id="verification-code-input"
                  type="text"
                  maxLength={6}
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.5em] font-mono text-2xl font-bold py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-blue-500 text-blue-600 dark:text-blue-400 focus:outline-none"
                />
              </div>

              <button
                id="verify-code-submit-btn"
                type="submit"
                disabled={isVerifying || verificationCode.length < 6}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Activating Account...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Activate Account & Enter Vault</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Google OAuth Single Sign-On Modal */}
      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSuccess={(user, preFilter) => {
          onAuthSuccess(user, preFilter);
        }}
      />

    </div>
  );
};
