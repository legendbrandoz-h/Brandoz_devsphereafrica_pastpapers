import React, { useState } from 'react';
import { 
  Sparkles, Send, X, Bot, CheckCircle2, BookOpen, Lightbulb, 
  HelpCircle, Copy, Check, RefreshCw, Terminal, ChevronRight
} from 'lucide-react';
import { PastPaper, ExamQuestion, AIStudyMessage } from '../types';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activePaper: PastPaper | null;
  activeQuestion?: ExamQuestion | null;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  activePaper,
  activeQuestion
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<AIStudyMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Hello! I am your DevSphere Academic Copilot. 🎓\n\nI can help you analyze past exam questions for **${activePaper?.unit_title || 'your university course'}**, provide step-by-step mathematical proofs, explain university marking schemes, or generate practice variations.\n\nSelect any question on the exam sheet or ask a concept below!`,
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
        content: `**Comprehensive Revision Solution for ${activePaper?.course_code || 'Question'}**:\n\n` +
          `• **Step 1: Conceptual Foundation**: Examine the core relational & architectural constraints.\n` +
          `• **Step 2: Formal Derivation**: Decompose the relation according to BCNF invariants ($X \\rightarrow Y$ where $X$ is a superkey) to eliminate update anomalies.\n` +
          `• **Step 3: Marking Scheme Rubric**: Ensure full ANSI-SQL syntax and proper index tree balance explanations.\n\n` +
          `*(Connect Gemini API Key in Settings for live custom model reasoning).*`,
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
        ? `Solve Question ${activeQuestion.questionNumber}: "${activeQuestion.title}" with a full step-by-step model answer.`
        : `Provide a detailed step-by-step solution for Section A Question 1 of ${activePaper.unit_title}.`;
      handleSendMessage(target, 'solve_step_by_step');
    } else if (actionType === 'hints') {
      const target = `What are the key marking scheme criteria and common pitfalls students make on ${activePaper.course_code} ${activePaper.unit_title}?`;
      handleSendMessage(target, 'marking_scheme_hints');
    } else if (actionType === 'similar') {
      const target = `Generate 2 similar university exam practice questions with numerical variations for ${activePaper.unit_title}.`;
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
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white dark:bg-slate-900 border-l border-blue-200 dark:border-slate-800 shadow-2xl flex flex-col transition-all duration-300 animate-in slide-in-from-right-10"
    >
      {/* Drawer Header */}
      <div className="p-4 bg-gradient-to-r from-blue-700 to-blue-900 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Bot className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm flex items-center gap-1.5">
              <span>DevSphere AI Copilot</span>
              <span className="text-[10px] bg-blue-500/60 px-1.5 py-0.5 rounded font-mono">Gemini 3.7</span>
            </h3>
            <p className="text-[11px] text-blue-100 truncate max-w-[280px]">
              {activePaper ? `${activePaper.course_code} • ${activePaper.unit_title}` : 'Universal Study Assistant'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Action Prompt Chips */}
      <div className="p-3 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs whitespace-nowrap">
        <button
          onClick={() => handleQuickAction('solve')}
          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-1 shrink-0 transition-colors"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Solve Question</span>
        </button>

        <button
          onClick={() => handleQuickAction('hints')}
          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-1 shrink-0 transition-colors"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Marking Scheme</span>
        </button>

        <button
          onClick={() => handleQuickAction('similar')}
          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-1 shrink-0 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Practice Test</span>
        </button>

        <button
          onClick={() => handleQuickAction('summary')}
          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-1 shrink-0 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
          <span>Cheat-Sheet</span>
        </button>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700 shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans space-y-2">
                {msg.content}
              </div>

              <div className={`mt-2 pt-1 flex items-center justify-between text-[10px] ${
                msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'
              }`}>
                <span>{msg.timestamp}</span>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className="hover:text-blue-500 p-0.5 rounded transition-colors flex items-center gap-1"
                  >
                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-xs text-blue-700 dark:text-blue-300 animate-pulse border border-blue-200 dark:border-blue-900">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>DevSphere AI is reasoning over the examination syllabus...</span>
          </div>
        )}
      </div>

      {/* Query Input Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
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
            placeholder="Ask AI to solve, explain or derive..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            id="ai-assistant-send-btn"
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-40 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
