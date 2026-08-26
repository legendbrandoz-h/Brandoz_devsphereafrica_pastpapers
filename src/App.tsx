import React, { useState, useEffect } from 'react';
import { AppPhase, PastPaper, UserProfile, ExamQuestion } from './types';
import { Navbar } from './components/Navbar';
import { SplashView } from './components/SplashView';
import { LandingView } from './components/LandingView';
import { AuthHub } from './components/AuthHub';
import { SecureRevisionVault } from './components/SecureRevisionVault';
import { SecureCanvasViewer } from './components/SecureCanvasViewer';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { SecurityAlertToast } from './components/SecurityAlertToast';
import { UploadPaperModal } from './components/UploadPaperModal';
import { SAMPLE_PAST_PAPERS } from './data/pastPapers';

export default function App() {
  const [currentPhase, setCurrentPhase] = useState<AppPhase>('splash');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('devsphere_user');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch (e) {}
      }
    }
    return null;
  });

  // Custom User Uploaded Papers state
  const [customPapers, setCustomPapers] = useState<PastPaper[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devsphere_uploaded_papers');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return [];
  });

  const [activeSearchQuery, setActiveSearchQuery] = useState<string>('2.1 data basemanagement');
  const [activeViewingPaper, setActiveViewingPaper] = useState<PastPaper | null>(null);
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [aiSelectedPaper, setAiSelectedPaper] = useState<PastPaper | null>(null);
  const [aiSelectedQuestion, setAiSelectedQuestion] = useState<ExamQuestion | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  // Security Toast State
  const [securityToast, setSecurityToast] = useState<{ show: boolean; reason?: string }>({
    show: false
  });

  // Global DRM Protection Handlers
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Disallow right click on vault and viewer
      if (currentPhase === 'vault' || activeViewingPaper) {
        e.preventDefault();
        triggerSecurityNotice('Right-click context menu is restricted to prevent unauthorized document scraping.');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        triggerSecurityNotice('Printing is disabled by DevSphere DRM to ensure read-only academic integrity.');
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        triggerSecurityNotice('File saving is disabled. Past papers are encrypted read-only streams.');
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPhase, activeViewingPaper]);

  const triggerSecurityNotice = (reason: string) => {
    setSecurityToast({ show: true, reason });
  };

  // Auth Success Handlers
  const handleAuthSuccess = (user: UserProfile, preFilterQuery?: string) => {
    setCurrentUser(user);
    localStorage.setItem('devsphere_user', JSON.stringify(user));
    if (preFilterQuery) {
      setActiveSearchQuery(preFilterQuery);
    }
    setCurrentPhase('vault');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('devsphere_user');
    setCurrentPhase('landing');
  };

  // Upload Paper Handlers
  const handleUploadSuccess = (newPaper: PastPaper) => {
    const updated = [newPaper, ...customPapers.filter(p => p.paper_id !== newPaper.paper_id)];
    setCustomPapers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('devsphere_uploaded_papers', JSON.stringify(updated));
    }
    
    // Automatically set active query to the new paper's course code for easy discovery
    setActiveSearchQuery(newPaper.course_code);
  };

  // AI Assistant Trigger
  const handleOpenAI = (paper?: PastPaper | null, question?: ExamQuestion) => {
    setAiSelectedPaper(paper || activeViewingPaper || customPapers[0] || SAMPLE_PAST_PAPERS[0]);
    setAiSelectedQuestion(question || null);
    setIsAIOpen(true);
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200 selection:bg-blue-600 selection:text-white">
      
      {/* Global Navigation Matrix (Shown in Landing, Auth, and Vault) */}
      {currentPhase !== 'splash' && (
        <Navbar
          currentPhase={currentPhase}
          onNavigate={(phase) => setCurrentPhase(phase)}
          currentUser={currentUser}
          onLogout={handleLogout}
          onScrollToSection={handleScrollToSection}
          onOpenUpload={() => setIsUploadOpen(true)}
        />
      )}

      {/* Phase 1: The Welcome Screen (Splash Page) */}
      {currentPhase === 'splash' && (
        <SplashView
          onContinue={() => setCurrentPhase('landing')}
        />
      )}

      {/* Phase 2: The Pitch (Landing Page) */}
      {currentPhase === 'landing' && (
        <LandingView
          onFindPapers={() => {
            if (currentUser) {
              setCurrentPhase('vault');
            } else {
              setCurrentPhase('auth');
            }
          }}
          onSelectSamplePaper={(paper) => {
            if (currentUser) {
              setActiveViewingPaper(paper);
            } else {
              setCurrentPhase('auth');
            }
          }}
          onOpenUpload={() => setIsUploadOpen(true)}
        />
      )}

      {/* Phase 3: The Gateway (Authentication Hub) */}
      {currentPhase === 'auth' && (
        <AuthHub
          onAuthSuccess={handleAuthSuccess}
          onBackToLanding={() => setCurrentPhase('landing')}
        />
      )}

      {/* Phase 4: The Secure Revision Vault */}
      {currentPhase === 'vault' && currentUser && (
        <SecureRevisionVault
          currentUser={currentUser}
          initialQuery={activeSearchQuery}
          customPapers={customPapers}
          onOpenPaper={(paper) => setActiveViewingPaper(paper)}
          onOpenAI={handleOpenAI}
          onOpenUpload={() => setIsUploadOpen(true)}
        />
      )}

      {/* Fallback if user navigates to vault without profile */}
      {currentPhase === 'vault' && !currentUser && (
        <AuthHub
          onAuthSuccess={handleAuthSuccess}
          onBackToLanding={() => setCurrentPhase('landing')}
        />
      )}

      {/* 1-Click Instant Secure View Modal (Read-Only Canvas PDF Wrapper) */}
      {activeViewingPaper && (
        <SecureCanvasViewer
          paper={activeViewingPaper}
          currentUser={currentUser}
          onClose={() => setActiveViewingPaper(null)}
          onOpenAI={(q) => handleOpenAI(activeViewingPaper, q)}
          onSecurityTrigger={triggerSecurityNotice}
        />
      )}

      {/* Gemini AI Study Copilot Side Drawer */}
      <AIAssistantDrawer
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        activePaper={aiSelectedPaper}
        activeQuestion={aiSelectedQuestion}
      />

      {/* Upload Past Paper Modal (Admin Guarded) */}
      <UploadPaperModal
        isOpen={isUploadOpen}
        currentUser={currentUser}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        onSwitchToAdminLogin={() => {
          setIsUploadOpen(false);
          setCurrentPhase('auth');
        }}
      />

      {/* DRM Security Alert Toast */}
      <SecurityAlertToast
        showAlert={securityToast.show}
        message={securityToast.reason}
        onClose={() => setSecurityToast({ show: false })}
      />

    </div>
  );
}
