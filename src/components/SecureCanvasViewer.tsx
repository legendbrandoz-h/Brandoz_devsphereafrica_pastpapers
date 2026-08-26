import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ZoomIn, ZoomOut, Maximize2, Minimize2, ShieldAlert, 
  Sparkles, Clock, Lock, ChevronLeft, ChevronRight, BookOpen, 
  Eye, HelpCircle, AlertCircle, FileText, CheckCircle2
} from 'lucide-react';
import { PastPaper, ExamQuestion, UserProfile } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface SecureCanvasViewerProps {
  paper: PastPaper;
  currentUser: UserProfile | null;
  onClose: () => void;
  onOpenAI: (question?: ExamQuestion) => void;
  onSecurityTrigger: (reason: string) => void;
}

export const SecureCanvasViewer: React.FC<SecureCanvasViewerProps> = ({
  paper,
  currentUser,
  onClose,
  onOpenAI,
  onSecurityTrigger
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(paper.duration_hours * 3600);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate pages: Cover Page + Question Pages
  const totalPages = 1 + paper.questions.length;

  // Intercept keyboard shortcuts (Ctrl+P, Cmd+P, Ctrl+S, PrintScreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        onSecurityTrigger('Print Command Blocked: Past papers are encrypted and strictly read-only.');
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        onSecurityTrigger('Save Webpage Blocked: Local offline saving is disabled by DevSphere DRM.');
      }
      if (e.key === 'PrintScreen') {
        onSecurityTrigger('Screen Capture Detected: Dynamic watermarks identify student session identity.');
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      onSecurityTrigger('Right-click context menu is restricted on read-only exam sheets.');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [onSecurityTrigger]);

  // Exam Countdown Timer
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Render High-DPI Canvas Paper with Dynamic DRM Watermarking
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-resolution canvas scaling for crisp text
    const width = 800;
    const height = 1130; // A4 aspect ratio representation
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // Canvas Background (Simulates crisp academic paper)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Outer subtle border
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Dynamic Anti-Leak Diagonal Watermark
    ctx.save();
    ctx.rotate((-28 * Math.PI) / 180);
    ctx.font = 'bold 15px monospace';
    ctx.fillStyle = 'rgba(30, 64, 175, 0.07)';
    const watermarkText = `DEVSPHERE DRM • ${currentUser?.school_email || 'AUTHENTICATED_STUDENT'} • ${new Date().toLocaleDateString()} • ID:${paper.paper_id}`;
    
    for (let x = -600; x < width + 600; x += 320) {
      for (let y = -200; y < height + 800; y += 120) {
        ctx.fillText(watermarkText, x, y);
      }
    }
    ctx.restore();

    // Render Canvas Content based on Page Index
    if (activePageIndex === 0) {
      // Cover Page
      ctx.fillStyle = '#1E3A8A';
      ctx.font = 'bold 22px serif';
      ctx.textAlign = 'center';
      ctx.fillText(paper.university_name.toUpperCase(), width / 2, 90);

      ctx.fillStyle = '#475569';
      ctx.font = '14px sans-serif';
      ctx.fillText(paper.faculty_department.toUpperCase(), width / 2, 120);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`UNIVERSITY EXAMINATIONS - ${paper.exam_year}`, width / 2, 160);

      ctx.fillStyle = '#2563EB';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(`${paper.course_code}: ${paper.unit_title.toUpperCase()}`, width / 2, 195);

      // Horizontal Divider
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 220);
      ctx.lineTo(width - 80, 220);
      ctx.stroke();

      // Exam Metadata Box
      ctx.textAlign = 'left';
      ctx.fillStyle = '#334155';
      ctx.font = '13px sans-serif';
      ctx.fillText(`DURATION: ${paper.duration_hours} HOURS`, 90, 260);
      ctx.fillText(`TOTAL MARKS: ${paper.total_marks} MARKS`, width - 260, 260);
      ctx.fillText(`ACADEMIC TERM: ${paper.semester}`, 90, 290);
      ctx.fillText(`TARGET LEVEL: ${paper.year_of_study}`, width - 260, 290);

      // Instructions Box
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(80, 330, width - 160, 180);
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1;
      ctx.strokeRect(80, 330, width - 160, 180);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('INSTRUCTIONS TO CANDIDATES:', 100, 365);

      ctx.font = '13px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText('1. Answer ALL questions in SECTION A (Compulsory - 30 Marks).', 100, 400);
      ctx.fillText('2. Answer any TWO (2) questions from SECTION B (20 Marks each).', 100, 430);
      ctx.fillText('3. Write legibly and present all mathematical/code derivations clearly.', 100, 460);
      ctx.fillText('4. Electronic devices and unauthorized materials are strictly prohibited.', 100, 490);

      // Security Notice Seal
      ctx.fillStyle = '#EFF6FF';
      ctx.fillRect(80, 550, width - 160, 130);
      ctx.strokeStyle = '#BFDBFE';
      ctx.strokeRect(80, 550, width - 160, 130);

      ctx.fillStyle = '#1E40AF';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('🛡️ DEVSPHERE AFRICA SECURE REVISION VAULT DRM', 100, 585);
      ctx.font = '11px monospace';
      ctx.fillStyle = '#475569';
      ctx.fillText(`ENCRYPTED STREAM: ${paper.secure_storage_url}`, 100, 615);
      ctx.fillText(`AUTHORIZED TO: ${currentUser?.school_email || 'STUDENT'} (${currentUser?.school_name || 'AFRICAN_UNIVERSITY'})`, 100, 640);
      ctx.fillText('STRICTLY READ-ONLY • UNAUTHORIZED REPRODUCTION IS PROHIBITED', 100, 660);

      // Footer
      ctx.textAlign = 'center';
      ctx.font = 'italic 12px serif';
      ctx.fillStyle = '#64748B';
      ctx.fillText('Turn to Page 2 to begin examination questions >>', width / 2, 740);

    } else {
      // Question Pages
      const currentQuestion = paper.questions[activePageIndex - 1];
      if (currentQuestion) {
        ctx.textAlign = 'left';
        
        // Header Banner
        ctx.fillStyle = '#1E40AF';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(currentQuestion.section, 60, 70);

        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(60, 85);
        ctx.lineTo(width - 60, 85);
        ctx.stroke();

        // Question Title & Marks
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(`QUESTION ${currentQuestion.questionNumber}: ${currentQuestion.title.toUpperCase()}`, 60, 120);

        ctx.fillStyle = '#2563EB';
        ctx.font = 'bold 13px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`[${currentQuestion.marks} MARKS]`, width - 60, 120);

        // Scenario text if present
        let currentY = 160;
        ctx.textAlign = 'left';
        if (currentQuestion.scenario) {
          ctx.fillStyle = '#334155';
          ctx.font = 'italic 13px serif';
          const scenarioLines = wrapText(ctx, `Scenario: ${currentQuestion.scenario}`, width - 120);
          scenarioLines.forEach((line: string) => {
            ctx.fillText(line, 60, currentY);
            currentY += 22;
          });
          currentY += 15;
        }

        // Question Parts
        currentQuestion.parts.forEach((part) => {
          ctx.fillStyle = '#0F172A';
          ctx.font = 'bold 14px monospace';
          ctx.fillText(part.label, 60, currentY);

          ctx.font = '13px sans-serif';
          ctx.fillStyle = '#1E293B';
          const promptLines = wrapText(ctx, part.prompt, width - 180);
          promptLines.forEach((line: string) => {
            ctx.fillText(line, 95, currentY);
            currentY += 20;
          });

          ctx.textAlign = 'right';
          ctx.fillStyle = '#64748B';
          ctx.font = 'italic 12px sans-serif';
          ctx.fillText(`(${part.marks} marks)`, width - 60, currentY - 5);
          ctx.textAlign = 'left';

          currentY += 25;
        });

        // Key Revision Topics Tag Bar
        ctx.fillStyle = '#F1F5F9';
        ctx.fillRect(60, height - 120, width - 120, 40);
        ctx.fillStyle = '#475569';
        ctx.font = '11px sans-serif';
        ctx.fillText(`Key Syllabus Topics: ${currentQuestion.keyTopics.join(' • ')}`, 75, height - 95);
      }
    }

    // Page Number
    ctx.textAlign = 'center';
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText(`Page ${activePageIndex + 1} of ${totalPages} • DevSphere Africa Secure DRM Stream`, width / 2, height - 30);

  }, [paper, activePageIndex, totalPages, currentUser]);

  // Helper text wrapper for canvas
  function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  const currentExamQuestion = activePageIndex > 0 ? paper.questions[activePageIndex - 1] : null;

  return (
    <div 
      id="secure-canvas-viewer-modal"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col justify-between overflow-hidden secure-canvas-container select-none"
    >
      
      {/* Top Utility Header Bar */}
      <div className="h-16 px-4 sm:px-6 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between z-10 shrink-0">
        
        {/* Left: Paper info & DRM indicator */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center gap-1.5 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Zero-Download DRM Active</span>
          </div>

          <div className="flex flex-col">
            <span className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <span>{paper.course_code}: {paper.unit_title}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono">
                {paper.exam_year}
              </span>
            </span>
            <span className="text-xs text-slate-400">
              {paper.university_name} &bull; {paper.semester}
            </span>
          </div>
        </div>

        {/* Center: Exam Countdown Timer */}
        <div className="hidden md:flex items-center gap-3 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="font-mono text-sm font-bold text-white">
            {formatTimer(timerSeconds)}
          </span>
          <button
            onClick={() => setIsTimerRunning(prev => !prev)}
            className="text-[11px] px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {isTimerRunning ? 'Pause Timer' : 'Start Timer'}
          </button>
        </div>

        {/* Right: Controls & AI Assistant Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
              className="p-1 text-slate-300 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2 text-slate-300">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
              className="p-1 text-slate-300 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* AI Assistant Button */}
          <button
            id="viewer-ai-assistant-btn"
            onClick={() => onOpenAI(currentExamQuestion || undefined)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Copilot</span>
          </button>

          {/* Dark Mode Toggle */}
          <ThemeToggle variant="floating" className="!p-2" />

          {/* Close Viewer */}
          <button
            id="close-viewer-modal-btn"
            onClick={onClose}
            aria-label="Close Viewer"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Main Canvas Scroll Area */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-slate-950/95"
      >
        <div 
          className="transition-transform duration-150 origin-center shadow-2xl rounded-lg overflow-hidden relative"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          {/* HTML5 Read-Only Document Canvas */}
          <canvas 
            id="secure-exam-paper-canvas"
            ref={canvasRef} 
            className="block max-w-full h-auto bg-white rounded shadow-2xl"
          />

          {/* Transparent click guard preventing image inspection */}
          <div 
            className="absolute inset-0 z-20 cursor-default"
            onContextMenu={(e) => {
              e.preventDefault();
              onSecurityTrigger('Zero-Download Protection: Image saving & right-click is disabled.');
            }}
          />
        </div>
      </div>

      {/* Bottom Navigation & Question Jump Bar */}
      <div className="h-16 px-4 sm:px-6 bg-slate-900 border-t border-slate-800 text-white flex items-center justify-between shrink-0 z-10">
        
        {/* Pagination Prev/Next */}
        <div className="flex items-center gap-2">
          <button
            id="viewer-prev-page-btn"
            disabled={activePageIndex === 0}
            onClick={() => setActivePageIndex(prev => Math.max(0, prev - 1))}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-semibold flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <span className="text-xs font-mono text-slate-300 px-2">
            Page {activePageIndex + 1} of {totalPages}
          </span>

          <button
            id="viewer-next-page-btn"
            disabled={activePageIndex === totalPages - 1}
            onClick={() => setActivePageIndex(prev => Math.min(totalPages - 1, prev + 1))}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-semibold flex items-center gap-1"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Direct Question Jump Tabs */}
        <div className="hidden md:flex items-center gap-1.5">
          <button
            onClick={() => setActivePageIndex(0)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              activePageIndex === 0 ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Cover Sheet
          </button>
          {paper.questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setActivePageIndex(idx + 1)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activePageIndex === idx + 1 ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Question {q.questionNumber} ({q.marks}M)
            </button>
          ))}
        </div>

        {/* Quick Solution Hints Toggle */}
        <div className="flex items-center gap-2">
          {currentExamQuestion?.solutionHints && (
            <button
              id="viewer-toggle-hints-btn"
              onClick={() => setShowHints(prev => !prev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                showHints ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHints ? 'Hide Hints' : 'Quick Hints'}</span>
            </button>
          )}

          <button
            onClick={() => onOpenAI(currentExamQuestion || undefined)}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask AI To Solve</span>
          </button>
        </div>

      </div>

      {/* Hints Overlay Sheet if active */}
      {showHints && currentExamQuestion?.solutionHints && (
        <div className="absolute bottom-20 right-6 z-30 max-w-md bg-slate-900/95 border border-amber-500/40 p-4 rounded-xl shadow-2xl backdrop-blur-md text-xs text-slate-200 space-y-2 animate-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between text-amber-300 font-bold">
            <span className="flex items-center gap-1">
              <HelpCircle className="w-4 h-4" />
              Exam Invariant Hints (Q{currentExamQuestion.questionNumber})
            </span>
            <button onClick={() => setShowHints(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <ul className="space-y-1.5 list-disc pl-4 text-slate-300">
            {currentExamQuestion.solutionHints.map((hint, i) => (
              <li key={i}>{hint}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};
