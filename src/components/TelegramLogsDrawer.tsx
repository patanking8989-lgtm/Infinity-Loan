import React from 'react';
import { X, Terminal, RefreshCw, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { TelegramLog } from '../types';

interface TelegramLogsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  logs: TelegramLog[];
  onRefresh: () => void;
}

export const TelegramLogsDrawer: React.FC<TelegramLogsDrawerProps> = ({
  isOpen,
  onClose,
  logs,
  onRefresh,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 text-slate-100 w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-slate-800 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-2.5">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base text-white">Telegram Payload Inspector</h3>
              <p className="text-xs text-slate-400">Real-time webhook events & formatted bot messages</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onRefresh}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Refresh Logs"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Body - Log List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {logs.length === 0 ? (
            <div className="text-center py-16 text-slate-500 space-y-3">
              <Terminal className="w-12 h-12 mx-auto text-slate-700" />
              <p className="text-sm font-medium">No payload events recorded yet.</p>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Complete any step in the loan portal to generate live Telegram notification logs here.
              </p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-950 rounded-2xl border border-slate-800/80 p-4 font-mono text-xs space-y-3 shadow-lg"
              >
                <div className="flex justify-between items-center border-b border-slate-800/80 pb-2.5">
                  <span className="font-bold text-emerald-400 text-xs flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="uppercase">{log.type}</span>
                  </span>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        log.status === 'sent'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : log.status === 'simulated'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {log.status === 'sent'
                        ? 'SENT LIVE'
                        : log.status === 'simulated'
                        ? 'DEMO MODE'
                        : 'FAILED'}
                    </span>
                  </div>
                </div>

                {/* Formatted Telegram Message Preview */}
                <div className="bg-slate-900 rounded-xl p-3 border border-slate-800 text-slate-300 leading-relaxed font-mono whitespace-pre-wrap text-[11px]">
                  {log.formattedMessage.replace(/<[^>]*>?/gm, '')}
                </div>

                {/* Raw JSON Toggle Details */}
                <details className="text-[10px] text-slate-500 cursor-pointer">
                  <summary className="hover:text-slate-300 font-sans font-medium">View Raw JSON Payload</summary>
                  <pre className="mt-2 p-2 bg-slate-900 rounded-lg text-slate-400 overflow-x-auto text-[10px]">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                </details>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 text-center text-slate-500 text-xs">
          <p className="flex items-center justify-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Captured via Express Backend Server API `/api/telegram/send`</span>
          </p>
        </div>
      </div>
    </div>
  );
};
