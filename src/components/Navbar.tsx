import React, { useState } from 'react';
import { BookOpen, Shield, Sparkles, LogOut, User as UserIcon, Menu, X, UploadCloud, ShieldCheck, GraduationCap } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { UserProfile, AppPhase } from '../types';

interface NavbarProps {
  currentPhase: AppPhase;
  onNavigate: (phase: AppPhase) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  onScrollToSection?: (sectionId: string) => void;
  onOpenUpload?: () => void;
  onOpenArchitecture?: () => void;
  onOpenAdminTeamPanel?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPhase,
  onNavigate,
  currentUser,
  onLogout,
  onScrollToSection,
  onOpenUpload,
  onOpenArchitecture,
  onOpenAdminTeamPanel
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = currentUser?.role === 'admin' || currentUser?.school_email?.toLowerCase().includes('branol123');
  const canUpload = isAdmin || currentUser?.role === 'team_member' || currentUser?.can_upload === true;

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (currentPhase !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        if (onScrollToSection) onScrollToSection(sectionId);
      }, 150);
    } else if (onScrollToSection) {
      onScrollToSection(sectionId);
    }
  };

  return (
    <header 
      id="main-global-header"
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-b border-blue-100 dark:border-slate-800 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <div 
          id="nav-brand-logo"
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-blue-900 dark:text-blue-100 font-sans">
              Brandoz <span className="text-blue-600 dark:text-blue-400">devsphereAfrica</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium -mt-1 flex items-center gap-1">
              <Shield className="w-2.5 h-2.5 text-blue-500" />
              Secure Revision Vault
            </span>
          </div>
        </div>

        {/* Desktop Navigation Matrix */}
        <nav className="hidden md:flex items-center gap-7">
          <button
            id="nav-features-link"
            onClick={() => handleNavClick('features')}
            className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            Features
          </button>

          <button
            id="nav-pricing-link"
            onClick={() => handleNavClick('pricing')}
            className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            Free Access
          </button>

          <button
            id="nav-security-link"
            onClick={() => handleNavClick('security')}
            className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            DRM Security
          </button>

          <button
            id="nav-ai-link"
            onClick={() => handleNavClick('ai-copilot')}
            className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            AI Copilot
          </button>

          {/* Admin Team & Client Database Panel */}
          {isAdmin && onOpenAdminTeamPanel && (
            <button
              id="nav-admin-team-panel-btn"
              onClick={onOpenAdminTeamPanel}
              className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-400/30"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Admin Panel</span>
            </button>
          )}

          {/* Architecture link - Only visible for Admin */}
          {isAdmin && onOpenArchitecture && (
            <button
              id="nav-architecture-link"
              onClick={onOpenArchitecture}
              className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-400/30"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Architecture</span>
            </button>
          )}
        </nav>

        {/* Right side actions: Upload, Role Pill, Dark Mode Toggle & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Upload Paper Action Trigger - Admin & Team Member */}
          {canUpload && onOpenUpload && (
            <button
              id="nav-upload-paper-btn"
              onClick={onOpenUpload}
              className="px-3 sm:px-3.5 py-2 text-xs font-black uppercase tracking-wider rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer hover:scale-105 bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-500/20"
            >
              <UploadCloud className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Paper</span>
              <span className="sm:hidden">Upload</span>
            </button>
          )}

          {/* User Role Badge if logged in */}
          {currentUser && (
            <div className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
              isAdmin
                ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                : currentUser.role === 'team_member'
                ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}>
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Admin</span>
                </>
              ) : currentUser.role === 'team_member' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Team Moderator</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Student</span>
                </>
              )}
            </div>
          )}

          {/* Global Dark Mode Toggle */}
          <ThemeToggle id="header-theme-toggle" />

          {/* Primary Action Button: Enter Vault / Sign In */}
          {currentUser ? (
            <div className="flex items-center gap-1.5">
              <button
                id="nav-enter-vault-btn"
                onClick={() => onNavigate('vault')}
                className="px-3.5 sm:px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer hover:scale-105"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">My Vault</span>
                <span className="sm:hidden">Vault</span>
              </button>

              <button
                id="nav-logout-btn"
                onClick={onLogout}
                title="Log Out of Session"
                className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="nav-find-papers-btn"
              onClick={() => onNavigate('auth')}
              className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-black uppercase tracking-widest rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Sign In
            </button>
          )}

          {/* Mobile menu hamburger toggle */}
          <button
            id="mobile-nav-toggle-btn"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <div 
          id="mobile-nav-menu"
          className="md:hidden border-b border-blue-100 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 px-4 pt-3 pb-5 space-y-3"
        >
          <div className="flex flex-col space-y-2">
            {/* Admin Panel */}
            {isAdmin && onOpenAdminTeamPanel && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminTeamPanel();
                }}
                className="text-left px-3 py-2 text-xs font-black uppercase tracking-widest rounded-xl flex items-center gap-2 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin & Team Panel</span>
              </button>
            )}

            {/* Upload Paper - Admin & Team */}
            {canUpload && onOpenUpload && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenUpload();
                }}
                className="text-left px-3 py-2 text-xs font-black uppercase tracking-widest rounded-xl flex items-center gap-2 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Paper</span>
              </button>
            )}

            {/* System Architecture - Strictly Admin Only */}
            {isAdmin && onOpenArchitecture && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenArchitecture();
                }}
                className="text-left px-3 py-2 text-xs font-black uppercase tracking-widest rounded-xl flex items-center gap-2 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>System Architecture (Admin)</span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('features')}
              className="text-left px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg"
            >
              Core Features
            </button>
            <button
              onClick={() => handleNavClick('pricing')}
              className="text-left px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg"
            >
              100% Free Access
            </button>
            <button
              onClick={() => handleNavClick('security')}
              className="text-left px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-blue-600" />
              DRM Security Specs
            </button>
            <button
              onClick={() => handleNavClick('ai-copilot')}
              className="text-left px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              AI Exam Assistant
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate(currentUser ? 'vault' : 'auth');
              }}
              className="w-full py-3 text-center text-xs font-black uppercase tracking-widest rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20"
            >
              {currentUser ? 'Enter Secure Vault' : 'Sign In / Register'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
