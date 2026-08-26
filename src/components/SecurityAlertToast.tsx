import React, { useEffect, useState } from 'react';
import { ShieldAlert, Lock, X } from 'lucide-react';

interface SecurityAlertToastProps {
  showAlert: boolean;
  message?: string;
  onClose: () => void;
}

export const SecurityAlertToast: React.FC<SecurityAlertToastProps> = ({
  showAlert,
  message = 'Zero-Download Security Policy: Past papers are encrypted and read-only. File downloads, printing, and clipboard copying are strictly disabled to protect academic integrity.',
  onClose
}) => {
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert, onClose]);

  if (!showAlert) return null;

  return (
    <div 
      id="security-alert-toast"
      className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900/95 text-white border border-blue-500/40 p-4 rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg shrink-0 border border-blue-500/30">
          <ShieldAlert className="w-5 h-5 text-blue-400 animate-pulse" />
        </div>
        <div className="flex-1 text-sm">
          <div className="flex items-center gap-1.5 font-semibold text-blue-300 mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>DevSphere DRM Shield Active</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed">{message}</p>
        </div>
        <button 
          onClick={onClose}
          aria-label="Dismiss security notice"
          className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
