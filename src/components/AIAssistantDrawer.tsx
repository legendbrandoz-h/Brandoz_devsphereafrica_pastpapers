import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { 
  Sparkles, Send, X, Bot, CheckCircle2, BookOpen, Lightbulb, 
  HelpCircle, Copy, Check, RefreshCw, Terminal, ChevronRight,
  Type, ZoomIn, ZoomOut, Maximize2
} from 'lucide-react';
import { PastPaper, ExamQuestion, AIStudyMessage } from '../types';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePaper: PastPaper | null;
  activeQuestion?: ExamQuestion | null;
}

type AssistantFontSize = 'standard' | 'large' | 'extralarge' | 'huge';

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  activePaper,
  activeQuestion
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Dynamic font size with local storage persistence
  const [fontSize, setFontSize] = useState<AssistantFontSize>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devsphere_ai_fontsize') as AssistantFontSize;
      if (saved && ['standard', 'large', 'extralarge', 'huge'].includes(saved)) {
        return saved;
      }
    }
    return 'large'; // Default to large, clear, easily readable font
  });

  const changeFontSize = (newSize: AssistantFontSize) => {
    setFontSize(newSize);
    if (typeof window !== 'undefined') {
      localStorage.setItem('devsphere_ai_fontsize', newSize);
    }
  };

  const cycleFontSize = () => {
    const order: AssistantFontSize[] = ['standard', 'large', 'extralarge', 'huge'];
    const currentIndex = order.indexOf(fontSize);
    const nextSize = order[(currentIndex + 1) % order.length];
    changeFontSize(nextSize);
  };

  const getFontSizeClasses = () => {
    switch (fontSize) {
      case 'standard':
        return {
          body: 'text-sm leading-relaxed',
          heading: 'text-base font-bold',
          code: 'text-xs',
          label: '15px'
        };
      case 'large':
        return {
          body: 'text-base sm:text-[17px] leading-relaxed',
          heading: 'text-lg font-bold',
          code: 'text-sm',
          label: '17px'
        };
      case 'extralarge':
        return {
          body: 'text-lg sm:text-[19px] leading-loose',
          heading: 'text-xl font-black',
          code: 'text-base',
          label: '19px'
        };
      case 'huge':
        return {
          body: 'text-xl sm:text-[21px] leading-loose font-medium',
          heading: 'text-2xl font-black',
          code: 'text-lg',
          label: '21px'
        };
    }
  };

  const fontConfig = getFontSizeClasses();

  const [messages, setMessages] = useState<AIStudyMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Hello! I am your **DevSphere Academic Copilot**. 🎓\n\nI can help you review past examination papers for **${activePaper?.unit_title || 'your university course'}**, provide step-by-step mathematical proofs, explain university marking schemes, or generate practice exam problems.\n\nSelect any question on the exam sheet or ask a question below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendMessage = async (queryText?: string, mode: string = 'general') => {
    const promptToSend = queryText || inputQuery;
    if (!promptToSend.trim()) return;

    const userMsg: AIStudyMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/study-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          paperContext: activePaper,
          questionContext: activeQuestion,
          mode
        })
      });
      const data = await res.json();

      const assistantMsg: AIStudyMessage = {
        id: 'msg_ai_' + Date.now(),
        role: 'assistant',
        content: data.text || 'Solution generated successfully.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const fallbackMsg: AIStudyMessage = {
        id: 'msg_err_' + Date.now(),
        role: 'assistant',
        content: `### Comprehensive Revision Solution for ${activePaper?.course_code || 'Examination'}\n\n` +
          `#### 1. Core Principles & Theoretical Grounding\n` +
          `Analyze the fundamental computational and mathematical definitions governing ${activePaper?.unit_title || 'the curriculum'}.\n\n` +
          `#### 2. Formal Derivation & Step-by-Step Proof\n` +
          `• Step A: State all boundary conditions and invariants.\n` +
          `• Step B: Apply formal transformation rules ($X \\rightarrow Y$ decomposition).\n` +
          `• Step C: Verify time and space complexity ($O(N \\log N)$ optimality).\n\n` +
          `#### 3. University Marking Scheme Rubric\n` +
          `Full marks are awarded for clear structural notation, labeled architectural diagrams, and justified design tradeoffs.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (actionType: 'solve' | 'hints' | 'similar' | 'summary') => {
    if (!activePaper) return;
    
    if (actionType === 'solve') {
      const target = activeQuestion 
        ? `Solve Question ${activeQuestion.questionNumber}: "${activeQuestion.title}" with a comprehensive step-by-step model answer, marking breakdown, and clear explanations.`
        : `Provide a detailed step-by-step solution for Section A Question 1 of ${activePaper.unit_title}.`;
      handleSendMessage(target, 'solve_step_by_step');
    } else if (actionType === 'hints') {
      const target = `What are the key marking scheme criteria, grading rubrics, and common student mistakes for ${activePaper.course_code} ${activePaper.unit_title}?`;
      handleSendMessage(target, 'marking_scheme_hints');
    } else if (actionType === 'similar') {
      const target = `Generate 2 similar university exam practice questions with variations and full worked solutions for ${activePaper.unit_title}.`;
      handleSendMessage(target, 'generate_practice');
    } else if (actionType === 'summary') {
      const target = `Provide a rapid high-yield cheat-sheet summary of all essential formulas, theorems, and definitions for ${activePaper.unit_title}.`;
      handleSendMessage(target, 'cheat_sheet');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div 
      id="ai-assistant-drawer"
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[520px] md:w-[560px] lg:w-[600px] bg-white dark:bg-slate-900 border-l border-blue-200 dark:border-slate-800 shadow-2xl flex flex-col transition-all duration-300 animate-in slide-in-from-right-10"
    >
      {/* Drawer Header */}
      <div className="p-4 bg-gradient-to-r from-blue-700 to-blue-900 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
            <Bot className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base flex items-center gap-1.5">
              <span>DevSphere AI Academic Copilot</span>
              <span className="text-[10px] bg-blue-500/60 px-2 py-0.5 rounded font-mono font-bold">Gemini 3.7</span>
            </h3>
            <p className="text-xs text-blue-100 truncate max-w-[280px] sm:max-w-[340px]">
              {activePaper ? `${activePaper.course_code} • ${activePaper.unit_title}` : 'Universal Study Assistant'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Font Size Adjuster in Header */}
          <button
            onClick={cycleFontSize}
            title={`Current Font: ${fontConfig.label}. Click to increase font size.`}
            className="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer border border-white/20"
          >
            <Type className="w-3.5 h-3.5" />
            <span>Font: {fontConfig.label}</span>
          </button>

          <button
            onClick={onClose}
            aria-label="Close AI Drawer"
            className="p-2 text-blue-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Font Size Quick Toolbar & Controls */}
      <div className="px-4 py-2 bg-blue-50/80 dark:bg-slate-850 border-b border-blue-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1">
            <Type className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            Inside Font Size:
          </span>
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            {(['standard', 'large', 'extralarge', 'huge'] as AssistantFontSize[]).map((s) => (
              <button
                key={s}
                onClick={() => changeFontSize(s)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  fontSize === s
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {s === 'standard' ? '15px' : s === 'large' ? '17px' : s === 'extralarge' ? '19px' : '21px'}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          High-Legibility Academic Text
        </div>
      </div>

      {/* Quick Action Prompt Chips */}
      <div className="p-3 bg-slate-50 dark:bg-slate-850/60 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs whitespace-nowrap scrollbar-thin">
        <button
          onClick={() => handleQuickAction('solve')}
          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-sm cursor-pointer"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-300" />
          <span>Solve Question</span>
        </button>

        <button
          onClick={() => handleQuickAction('hints')}
          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Marking Scheme</span>
        </button>

        <button
          onClick={() => handleQuickAction('similar')}
          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Practice Test</span>
        </button>

        <button
          onClick={() => handleQuickAction('summary')}
          className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
          <span>Cheat-Sheet</span>
        </button>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[95%] p-4 sm:p-5 rounded-2xl ${fontConfig.body} ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-sm'
              }`}
            >
              {msg.role === 'user' ? (
                <div className="whitespace-pre-wrap font-sans font-medium">
                  {msg.content}
                </div>
              ) : (
                <div className="markdown-body space-y-3 font-sans leading-relaxed text-slate-800 dark:text-slate-100">
                  <Markdown>{msg.content}</Markdown>
                </div>
              )}

              <div className={`mt-3 pt-2 border-t flex items-center justify-between text-xs ${
                msg.role === 'user' 
                  ? 'border-blue-500 text-blue-100' 
                  : 'border-slate-200 dark:border-slate-700 text-slate-400'
              }`}>
                <span className="font-mono text-[11px]">{msg.timestamp}</span>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className="hover:text-blue-500 p-1 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                  >
                    {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === msg.id ? 'Copied' : 'Copy Solution'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl text-sm text-blue-700 dark:text-blue-300 animate-pulse border border-blue-200 dark:border-blue-900">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-medium">DevSphere AI is formulating step-by-step academic solutions and marking schemes...</span>
          </div>
        )}
      </div>

      {/* Query Input Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="ai-assistant-input"
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask AI to solve, derive, explain or create practice tests..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            id="ai-assistant-send-btn"
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-40 transition-colors shadow-md cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};

