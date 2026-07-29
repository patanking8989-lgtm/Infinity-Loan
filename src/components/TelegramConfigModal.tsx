import React, { useState } from 'react';
import { X, Send, Key, MessageSquare, Check, Loader2, Sparkles, AlertCircle, Info } from 'lucide-react';
import { TelegramConfig } from '../types';

interface TelegramConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: TelegramConfig;
  onSaveConfig: (token: string, chatId: string) => Promise<void>;
  onSendTestMessage: () => Promise<void>;
}

export const TelegramConfigModal: React.FC<TelegramConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onSendTestMessage,
}) => {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      const savedToken = localStorage.getItem('telegram_bot_token') || '';
      const savedChatId = localStorage.getItem('telegram_chat_id') || config.chatId || '';
      if (savedToken) setBotToken(savedToken);
      if (savedChatId) setChatId(savedChatId);
    }
  }, [isOpen, config.chatId]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);
    try {
      const tokenToSave = botToken.trim() || localStorage.getItem('telegram_bot_token') || '';
      const chatIdToSave = chatId.trim() || localStorage.getItem('telegram_chat_id') || '';

      if (!tokenToSave || !chatIdToSave) {
        throw new Error('Please provide both Bot Token and Chat ID.');
      }

      localStorage.setItem('telegram_bot_token', tokenToSave);
      localStorage.setItem('telegram_chat_id', chatIdToSave);
      
      await onSaveConfig(tokenToSave, chatIdToSave);
      setStatusMessage({ type: 'success', text: 'Telegram credentials saved! Alerts are active.' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to update config' });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setTestLoading(true);
    setStatusMessage(null);
    try {
      await onSendTestMessage();
      setStatusMessage({ type: 'success', text: 'Test message sent to Telegram bot successfully!' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to send test message' });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Telegram Bot Configuration</h3>
            <p className="text-xs text-slate-500">Configure your bot credentials for real-time lead alerts</p>
          </div>
        </div>

        {/* Current Connection Status */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-5 text-xs space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-600">Bot Token Status:</span>
            <span
              className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                config.hasToken
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {config.hasToken ? `Active (${config.maskedToken})` : 'Not Configured'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-600">Target Chat ID:</span>
            <span className="font-mono font-bold text-slate-900">{config.chatId || 'Not Configured'}</span>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-3 rounded-2xl mb-4 text-xs font-medium flex items-center space-x-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Config Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Bot API Token</span>
              <span className="text-[11px] font-normal text-slate-400">e.g. 123456789:ABCdef...</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder={config.hasToken ? '•••••••••••••••••••• (Leave blank to keep existing)' : 'Enter Bot Token from @BotFather'}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Telegram Chat / Channel ID</span>
              <span className="text-[11px] font-normal text-slate-400">e.g. 987654321 or -100xxx</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="Enter Chat ID or Channel ID"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl transition-all shadow-md flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Save Credentials</span>
            </button>

            <button
              type="button"
              onClick={handleTest}
              disabled={testLoading || (!config.hasToken && !botToken)}
              className="px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-2xl transition-all flex items-center space-x-1.5"
            >
              {testLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Test Bot</span>
            </button>
          </div>
        </form>

        {/* How to set up guide */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500 space-y-2">
          <p className="font-bold text-slate-700 flex items-center space-x-1">
            <Info className="w-3.5 h-3.5 text-emerald-600" />
            <span>Quick Setup Guide:</span>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
            <li>Open Telegram and search for <strong>@BotFather</strong> to create a new bot and copy the API Token.</li>
            <li>Send a message to <strong>@userinfobot</strong> to get your numeric Telegram <strong>Chat ID</strong>.</li>
            <li>Paste both fields above and click <strong>Save Credentials</strong>.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
