import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ZoomIn, ZoomOut, Maximize2, Minimize2, ShieldAlert, 
  Sparkles, Clock, Lock, ChevronLeft, ChevronRight, BookOpen, 
  Eye, HelpCircle, AlertCircle, FileText, CheckCircle2, Type,
  BookMarked
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
  const [zoomLevel, setZoomLevel] = useState<number>(105);
  const [paperFontScale, setPaperFontScale] = useState<number>(1.35); // Generous, clear, human-readable font scale
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(paper.duration_hours * 3600);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate pages: Cover Page + Question Pages
  const questionsList = paper.questions || [];
  const totalPages = Math.max(1, 1 + questionsList.length);

  const cyclePaperFontScale = () => {
    setPaperFontScale(prev => {
      if (prev < 1.2) return 1.35;
      if (prev < 1.45) return 1.55;
      if (prev < 1.65) return 1.75;
      return 1.15;
    });
  };

  // Intercept keyboard shortcuts (Ctrl+P, Cmd+P, Ctrl+S, PrintScreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        onSecurityTrigger('Study Mode Notice: Exam papers are formatted for online interactive revision.');
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        onSecurityTrigger('Study Mode Notice: Revision papers are streamed directly from the university archive.');
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      onSecurityTrigger('Right-click is disabled to preserve the examination layout.');
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

  // Render High-DPI Canvas Paper with crisp typography and human academic layout
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High-resolution canvas scaling for crystal clear text
    const width = 900;
    const height = 1280; // Generous page proportion
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // Canvas Background (Clean, bright, academic paper texture)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Outer subtle border
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(24, 24, width - 48, height - 48);

    // Academic Authenticity Watermark (Subtle, clean, respectful)
    ctx.save();
    ctx.rotate((-25 * Math.PI) / 180);
    ctx.font = `500 ${Math.round(14 * paperFontScale)}px sans-serif`;
    ctx.fillStyle = 'rgba(37, 99, 235, 0.04)';
    const watermarkText = `devsphereAfrica Archive • ${currentUser?.school_email || 'Student Revision'} • ${paper.course_code}`;
    
    for (let x = -500; x < width + 600; x += 360) {
      for (let y = -200; y < height + 800; y += 150) {
        ctx.fillText(watermarkText, x, y);
      }
    }
    ctx.restore();

    // Render Canvas Content based on Page Index
    if (activePageIndex === 0) {
      // Cover Page
      ctx.fillStyle = '#1E3A8A';
      ctx.font = `bold ${Math.round(28 * paperFontScale)}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText(paper.university_name.toUpperCase(), width / 2, 95);

      ctx.fillStyle = '#475569';
      ctx.font = `600 ${Math.round(17 * paperFontScale)}px sans-serif`;
      ctx.fillText(paper.faculty_department.toUpperCase(), width / 2, 132);

      ctx.fillStyle = '#0F172A';
      ctx.font = `bold ${Math.round(22 * paperFontScale)}px sans-serif`;
      ctx.fillText(`UNIVERSITY EXAMINATIONS — ${paper.exam_year}`, width / 2, 180);

      ctx.fillStyle = '#2563EB';
      ctx.font = `bold ${Math.round(20 * paperFontScale)}px monospace`;
      ctx.fillText(`${paper.course_code}: ${paper.unit_title.toUpperCase()}`, width / 2, 222);

      // Horizontal Divider
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 248);
      ctx.lineTo(width - 80, 248);
      ctx.stroke();

      // Exam Metadata Box
      ctx.textAlign = 'left';
      ctx.fillStyle = '#1E293B';
      ctx.font = `600 ${Math.round(16 * paperFontScale)}px sans-serif`;
      ctx.fillText(`DURATION: ${paper.duration_hours} HOURS`, 90, 290);
      ctx.fillText(`TOTAL MARKS: ${paper.total_marks} MARKS`, width - 300, 290);
      ctx.fillText(`ACADEMIC TERM: ${paper.semester}`, 90, 328);
      ctx.fillText(`STUDY LEVEL: ${paper.year_of_study}`, width - 300, 328);

      // Instructions Box
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(80, 370, width - 160, 230);
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(80, 370, width - 160, 230);

      ctx.fillStyle = '#0F172A';
      ctx.font = `bold ${Math.round(17 * paperFontScale)}px sans-serif`;
      ctx.fillText('INSTRUCTIONS TO CANDIDATES:', 105, 410);

      ctx.font = `${Math.round(16 * paperFontScale)}px sans-serif`;
      ctx.fillStyle = '#334155';
      ctx.fillText('1. Answer ALL questions in SECTION A (Compulsory — 30 Marks).', 105, 450);
      ctx.fillText('2. Answer any TWO (2) questions from SECTION B (20 Marks each).', 105, 490);
      ctx.fillText('3. Write legibly and present all mathematical derivations and code clearly.', 105, 530);
      ctx.fillText('4. You can use the AI Academic Copilot anytime for step-by-step solutions.', 105, 570);

      // Verified Archive Box
      ctx.fillStyle = '#EFF6FF';
      ctx.fillRect(80, 630, width - 160, 145);
      ctx.strokeStyle = '#BFDBFE';
      ctx.strokeRect(80, 630, width - 160, 145);

      ctx.fillStyle = '#1E40AF';
      ctx.font = `bold ${Math.round(16 * paperFontScale)}px sans-serif`;
      ctx.fillText('📘 VERIFIED UNIVERSITY PAST PAPER ARCHIVE', 105, 670);
      ctx.font = `${Math.round(14 * paperFontScale)}px sans-serif`;
      ctx.fillStyle = '#475569';
      ctx.fillText(`Authenticated for student study: ${currentUser?.school_email || 'Student Account'}`, 105, 705);
      ctx.fillText(`Curriculum: ${paper.faculty_department} • ${paper.university_name}`, 105, 735);
      ctx.fillText('Interactive study mode active • Click "Next Page" or question tabs below to start.', 105, 760);

      // Footer
      ctx.textAlign = 'center';
      ctx.font = `italic ${Math.round(15 * paperFontScale)}px serif`;
      ctx.fillStyle = '#64748B';
      if (totalPages > 1) {
        ctx.fillText('Turn to Page 2 to begin examination questions >>', width / 2, 830);
      } else {
        ctx.fillText('Verified Past Examination Paper • Study Archive', width / 2, 830);
      }

    } else {
      // Question Pages (1-indexed into paper.questions)
      const currentQuestion = paper.questions[activePageIndex - 1];
      if (currentQuestion) {
        
        // Header Banner
        ctx.fillStyle = '#1E40AF';
        ctx.font = `bold ${Math.round(17 * paperFontScale)}px sans-serif`;
        ctx.fillText(currentQuestion.section, 60, 75);

        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(60, 92);
        ctx.lineTo(width - 60, 92);
        ctx.stroke();

        // Question Title & Marks
        ctx.fillStyle = '#0F172A';
        ctx.font = `bold ${Math.round(21 * paperFontScale)}px sans-serif`;
        ctx.fillText(`QUESTION ${currentQuestion.questionNumber}: ${currentQuestion.title.toUpperCase()}`, 60, 135);

        ctx.fillStyle = '#2563EB';
        ctx.font = `bold ${Math.round(17 * paperFontScale)}px monospace`;
        ctx.textAlign = 'right';
        ctx.fillText(`[${currentQuestion.marks} MARKS]`, width - 60, 135);

        // Scenario text if present
        let currentY = 180;
        ctx.textAlign = 'left';
        if (currentQuestion.scenario) {
          ctx.fillStyle = '#334155';
          ctx.font = `italic ${Math.round(17 * paperFontScale)}px serif`;
          const scenarioLines = wrapText(ctx, `Scenario: ${currentQuestion.scenario}`, width - 120);
          scenarioLines.forEach((line: string) => {
            ctx.fillText(line, 60, currentY);
            currentY += Math.round(28 * paperFontScale);
          });
          currentY += 22;
        }

        // Question Parts
        currentQuestion.parts.forEach((part) => {
          ctx.fillStyle = '#0F172A';
          ctx.font = `bold ${Math.round(18 * paperFontScale)}px monospace`;
          ctx.fillText(part.label, 60, currentY);

          ctx.font = `${Math.round(17 * paperFontScale)}px sans-serif`;
          ctx.fillStyle = '#1E293B';
          const promptLines = wrapText(ctx, part.prompt, width - 210);
          promptLines.forEach((line: string) => {
            ctx.fillText(line, 105, currentY);
            currentY += Math.round(27 * paperFontScale);
          });

          ctx.textAlign = 'right';
          ctx.font = `italic ${Math.round(15 * paperFontScale)}px sans-serif`;
          ctx.fillText(`(${part.marks} marks)`, width - 60, currentY - 5);
          ctx.textAlign = 'left';

          currentY += Math.round(30 * paperFontScale);
        });

        // Key Revision Topics Tag Bar at bottom
        ctx.fillStyle = '#F1F5F9';
        ctx.fillRect(60, height - 135, width - 120, 55);
        ctx.fillStyle = '#334155';
        ctx.font = `600 ${Math.round(14 * paperFontScale)}px sans-serif`;
        ctx.fillText(`Key Revision Topics: ${currentQuestion.keyTopics.join(' • ')}`, 80, height - 102);
      }
    }

    // Bottom page numbering
    ctx.textAlign = 'center';
    ctx.font = `${Math.round(14 * paperFontScale)}px sans-serif`;
    ctx.fillStyle = '#64748B';
    ctx.fillText(`Page ${activePageIndex + 1} of ${totalPages} • ${paper.course_code} ${paper.exam_year}`, width / 2, height - 35);

  }, [paper, activePageIndex, totalPages, currentUser, paperFontScale]);

  // Helper text wrapper for canvas supporting multi-line strings and newlines
  function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const lines: string[] = [];
    const paragraphs = text.split('\n');

    paragraphs.forEach(para => {
      const words = para.split(' ');
      let currentLine = '';

      for (let n = 0; n < words.length; n++) {
        const testLine = currentLine + (currentLine ? ' ' : '') + words[n];
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          lines.push(currentLine);
          currentLine = words[n];
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }
    });

    return lines;
  }

  const currentExamQuestion = activePageIndex > 0 ? paper.questions[activePageIndex - 1] : null;

  return (
    <div 
      id="secure-canvas-viewer-modal"
      className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex flex-col justify-between select-none animate-in fade-in duration-200"
    >
      
      {/* Top Navigation & Status Bar */}
      <div className="h-18 px-4 sm:px-6 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between shrink-0 z-10 shadow-md">
        
        {/* Left: Paper info */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/20 text-blue-300 font-bold text-xs border border-blue-400/30">
            <BookMarked className="w-4 h-4 text-blue-400" />
            <span>Verified Exam Paper</span>
          </div>

          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
              <span>{paper.course_code}: {paper.unit_title}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-lg bg-blue-900/80 text-blue-300 font-mono font-bold">
                {paper.exam_year}
              </span>
            </span>
            <span className="text-xs sm:text-sm text-slate-300">
              {paper.university_name} &bull; {paper.semester}
            </span>
          </div>
        </div>

        {/* Center: Exam Practice Countdown Timer */}
        <div className="hidden md:flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="font-mono text-base font-bold text-white">
            {formatTimer(timerSeconds)}
          </span>
          <button
            onClick={() => setIsTimerRunning(prev => !prev)}
            className="text-xs px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer transition-colors"
          >
            {isTimerRunning ? 'Pause' : 'Practice Timer'}
          </button>
        </div>

        {/* Right: Controls & AI Assistant Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Paper Font Scale Control */}
          <button
            onClick={cyclePaperFontScale}
            title="Click to toggle exam paper font size: Standard, Large, Extra Large, Huge"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl px-3 py-2 border border-slate-700 text-xs sm:text-sm font-bold text-slate-100 transition-colors cursor-pointer"
          >
            <Type className="w-4 h-4 text-blue-400" />
            <span>Text: {Math.round(paperFontScale * 100)}%</span>
          </button>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
            <button
              onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
              className="p-1.5 text-slate-300 hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold px-2 text-slate-200">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(160, prev + 10))}
              className="p-1.5 text-slate-300 hover:text-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* AI Assistant Button */}
          <button
            id="viewer-ai-assistant-btn"
            onClick={() => onOpenAI(currentExamQuestion || undefined)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-md shadow-blue-500/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Study Copilot</span>
          </button>

          {/* Dark Mode Toggle */}
          <ThemeToggle variant="floating" className="!p-2" />

          {/* Close Viewer */}
          <button
            id="close-viewer-modal-btn"
            onClick={onClose}
            aria-label="Close Viewer"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

      </div>

      {/* Main Canvas Scroll Area with generous lighting & clean canvas container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-slate-950/80"
      >
        <div 
          className="transition-transform duration-150 origin-center shadow-2xl rounded-2xl overflow-hidden relative border-4 border-slate-700/50 bg-white"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          {/* HTML5 Document Canvas */}
          <canvas 
            id="secure-exam-paper-canvas"
            ref={canvasRef} 
            className="block max-w-full h-auto bg-white rounded shadow-2xl"
          />

          {/* Click guard */}
          <div 
            className="absolute inset-0 z-20 cursor-default"
            onContextMenu={(e) => {
              e.preventDefault();
              onSecurityTrigger('Online Study Mode: Text and questions are formatted for interactive revision.');
            }}
          />
        </div>
      </div>

      {/* Bottom Navigation & Question Jump Bar */}
      <div className="h-18 px-4 sm:px-6 bg-slate-900 border-t border-slate-800 text-white flex items-center justify-between shrink-0 z-10">
        
        {/* Pagination Prev/Next */}
        <div className="flex items-center gap-2">
          <button
            id="viewer-prev-page-btn"
            disabled={activePageIndex === 0}
            onClick={() => setActivePageIndex(prev => Math.max(0, prev - 1))}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-sm font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous Page</span>
          </button>

          <span className="text-sm font-semibold text-slate-200 px-2 font-mono">
            Page {activePageIndex + 1} of {totalPages}
          </span>

          <button
            id="viewer-next-page-btn"
            disabled={activePageIndex === totalPages - 1}
            onClick={() => setActivePageIndex(prev => Math.min(totalPages - 1, prev + 1))}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-sm font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span className="hidden sm:inline">Next Page</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Direct Question Jump Tabs */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => setActivePageIndex(0)}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activePageIndex === 0 ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Cover Page
          </button>
          {paper.questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setActivePageIndex(idx + 1)}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                activePageIndex === idx + 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Question {q.questionNumber} ({q.marks}M)
            </button>
          ))}
        </div>

        {/* Quick Solution Hints Toggle */}
        <div className="flex items-center gap-2.5">
          {currentExamQuestion?.solutionHints && (
            <button
              id="viewer-toggle-hints-btn"
              onClick={() => setShowHints(prev => !prev)}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                showHints ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>{showHints ? 'Hide Study Hints' : 'Quick Study Hints'}</span>
            </button>
          )}

          <button
            onClick={() => onOpenAI(currentExamQuestion || undefined)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">Ask AI To Solve This Question</span>
          </button>
        </div>

      </div>

      {/* Hints Overlay Sheet if active */}
      {showHints && currentExamQuestion?.solutionHints && (
        <div className="absolute bottom-22 right-6 z-30 max-w-lg bg-slate-900/95 border border-amber-500/50 p-5 rounded-2xl shadow-2xl backdrop-blur-md text-sm text-slate-100 space-y-3 animate-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between text-amber-300 font-bold text-base">
            <span className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Revision Key Hints (Question {currentExamQuestion.questionNumber})
            </span>
            <button onClick={() => setShowHints(false)} className="text-slate-400 hover:text-white cursor-pointer p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
          <ul className="space-y-2 list-disc pl-5 text-slate-200 leading-relaxed font-medium">
            {currentExamQuestion.solutionHints.map((hint, i) => (
              <li key={i}>{hint}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};
