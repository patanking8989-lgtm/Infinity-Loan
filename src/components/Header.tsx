import React from 'react';
import { ShieldCheck, Send, Terminal, Sparkles, RefreshCw } from 'lucide-react';
import { TelegramConfig } from '../types';

interface HeaderProps {
  telegramConfig: TelegramConfig;
  onOpenConfig: () => void;
  onOpenLogs: () => void;
  onReset: () => void;
  currentStep: number;
}

export const Header: React.FC<HeaderProps> = ({
  telegramConfig,
  onOpenConfig,
  onOpenLogs,
  onReset,
  currentStep,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                FlexiCredit
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Express
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Instant Personal Loan Portal</p>
          </div>
        </div>

        {/* Security & Status Badges */}
        <div className="hidden md:flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium">256-Bit SSL Encrypted</span>
          </div>

          <div
            onClick={onOpenConfig}
            className={`hidden cursor-pointer items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-medium transition-all ${
              telegramConfig.hasToken && telegramConfig.hasChatId
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/50'
                : 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:bg-amber-900/50'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {telegramConfig.hasToken && telegramConfig.hasChatId
                ? 'Telegram Bot Live'
                : 'Telegram Bot Demo Mode'}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenLogs}
            className="hidden items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            title="Inspect Telegram Output Payloads"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Bot Logs</span>
          </button>

          <button
            onClick={onOpenConfig}
            className="hidden items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-all shadow-md shadow-emerald-900/30"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bot Config</span>
          </button>

          {currentStep > 1 && (
            <button
              onClick={onReset}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Restart Application"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
