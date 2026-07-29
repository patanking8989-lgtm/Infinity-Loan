import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WhatsAppWidgetProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const WhatsAppWidget: React.FC<WhatsAppWidgetProps> = ({
  phoneNumber = '916302235986',
  defaultMessage = 'Hello! I need assistance with my loan application.',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const quickQueries = [
    'What is the interest rate?',
    'How much loan can I get?',
    'Is any document required?',
    'Loan Disbursement query',
  ];

  const handleSend = (textToSend?: string) => {
    const finalMsg = textToSend || message || defaultMessage;
    const encodedMsg = encodeURIComponent(finalMsg);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMsg}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40 flex flex-col items-end">
      {/* Popover Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-3 w-[calc(100vw-2rem)] max-w-[320px] sm:w-80 bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden text-slate-900"
          >
            {/* Header */}
            <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg border border-white/30">
                    💬
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-emerald-600 animate-ping" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight">FlexiCredit WhatsApp Care</h4>
                  <p className="text-[11px] text-emerald-100 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                    <span>Loan Officer Online</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-emerald-100 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 bg-emerald-50/40 space-y-3 max-h-72 overflow-y-auto">
              <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 text-xs text-slate-700 leading-relaxed max-w-[85%]">
                <p className="font-bold text-emerald-800 mb-1">FlexiCredit Support 👋</p>
                <p>Hello! Welcome to FlexiCredit Instant Loan Support. How can we help you today?</p>
                <span className="text-[10px] text-slate-400 mt-1 block text-right flex items-center justify-end space-x-0.5">
                  <span>Just now</span>
                  <CheckCheck className="w-3 h-3 text-emerald-500 inline" />
                </span>
              </div>

              {/* Quick Questions Chips */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Inquiries:</p>
                <div className="flex flex-wrap gap-1.5">
                  {quickQueries.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="text-[11px] bg-white hover:bg-emerald-600 hover:text-white text-slate-700 font-semibold px-2.5 py-1 rounded-xl border border-slate-200 transition-all text-left shadow-2xs"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input & Send Footer */}
            <div className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your loan question..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleSend()}
                className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md transition-all shrink-0"
                title="Send via WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 sm:p-4 rounded-full shadow-2xl shadow-emerald-600/40 transition-all duration-300 flex items-center space-x-2 hover:scale-105 active:scale-95 cursor-pointer border-2 border-emerald-400/50"
        title="Chat on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300" />
        </span>

        {/* WhatsApp Icon */}
        <svg
          className="w-6 h-6 fill-current text-white"
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>

        <span className="hidden sm:inline font-bold text-xs">WhatsApp Support</span>
      </button>
    </div>
  );
};
