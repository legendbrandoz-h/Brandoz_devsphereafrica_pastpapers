import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  id?: string;
  className?: string;
  variant?: 'header' | 'floating' | 'compact';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  id = 'theme-toggle-btn', 
  className = '',
  variant = 'header'
}) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('devsphere_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('devsphere_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('devsphere_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  if (variant === 'floating') {
    return (
      <button
        id={id}
        onClick={toggleTheme}
        aria-label="Toggle theme"
        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode (Night Study)'}
        className={`p-2.5 rounded-xl border transition-all duration-200 shadow-sm flex items-center justify-center ${
          isDark 
            ? 'bg-slate-800/90 text-amber-300 border-slate-700 hover:bg-slate-700' 
            : 'bg-white text-slate-700 border-blue-200 hover:bg-blue-50/80 hover:text-blue-600'
        } ${className}`}
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-blue-700" />}
      </button>
    );
  }

  return (
    <button
      id={id}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode for late-night study'}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 ${
        isDark 
          ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-750 hover:text-white' 
          : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100/80'
      } ${className}`}
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-amber-300" />
          <span className="hidden sm:inline text-xs">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline text-xs">Night Mode</span>
        </>
      )}
    </button>
  );
};
