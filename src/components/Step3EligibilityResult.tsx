import React from 'react';
import { PartyPopper, CheckCircle2, ShieldAlert, ArrowRight, Sparkles, Building2, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';
import { LoanDetails } from '../types';
import { AppDownloadButton } from './AppDownloadButton';

interface Step3EligibilityResultProps {
  loanDetails: LoanDetails;
  onProceedToPayment: () => void;
}

export const Step3EligibilityResult: React.FC<Step3EligibilityResultProps> = ({
  loanDetails,
  onProceedToPayment,
}) => {
  const annualInterestRate = 10.5;
  const monthlyRate = annualInterestRate / 12 / 100;
  const emi = Math.round(
    (loanDetails.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanDetails.loanTenure)) /
      (Math.pow(1 + monthlyRate, loanDetails.loanTenure) - 1)
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="max-w-2xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xl p-3.5 sm:p-6"
    >
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 text-white text-center shadow-md shadow-emerald-600/20 relative overflow-hidden mb-4 sm:mb-5">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-2 border border-white/30">
          <PartyPopper className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300" />
        </div>

        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] sm:text-xs font-bold text-white mb-1.5">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Pre-Approved Loan Sanction</span>
        </span>

        <h2 className="text-lg sm:text-2xl font-black tracking-tight">Congratulations, {loanDetails.name || 'Applicant'}!</h2>
        <p className="text-emerald-100 text-[11px] sm:text-xs mt-1 max-w-md mx-auto">
          Your loan application has been approved with zero collateral and instant bank transfer authorization.
        </p>
      </div>

      {/* Approved Loan Breakdown */}
      <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 space-y-3 mb-4 sm:mb-5">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sanctioned Amount</span>
          <span className="text-xl sm:text-2xl font-black text-slate-900">
            ₹{loanDetails.loanAmount.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
          <div>
            <p className="text-[10px] sm:text-xs text-slate-500">Employment Type</p>
            <p className="font-bold text-slate-800">{loanDetails.employmentType}</p>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-slate-500">Selected Tenure</p>
            <p className="font-bold text-slate-800">{loanDetails.loanTenure} Months</p>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-slate-500">Interest Rate</p>
            <p className="font-bold text-emerald-600">10.5% p.a. (Fixed)</p>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-slate-500">Monthly EMI</p>
            <p className="font-bold text-slate-900">₹{emi.toLocaleString('en-IN')}/mo</p>
          </div>
        </div>
      </div>

      {/* Disbursement Verification Fee Callout */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 mb-4 sm:mb-5 flex items-start space-x-3">
        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-amber-100 text-amber-800 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
          <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-amber-950">Loan Disbursement Token Fee: ₹1.00 Charge</h4>
          <p className="text-[11px] sm:text-xs text-amber-800/90 mt-0.5 leading-relaxed">
            As per RBI guidelines for instant online credit transfers, a refundable token charge of <strong>₹1.00</strong> is required via Debit Card to verify account ownership before final funds release.
          </p>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onProceedToPayment}
        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-2 group cursor-pointer"
      >
        <span>Verify</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* App Download Button */}
      <AppDownloadButton />

      <div className="mt-4 text-center">
        <p className="text-xs text-slate-400 flex items-center justify-center space-x-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Funds will be disbursed directly to your linked bank account within 5 minutes</span>
        </p>
      </div>
    </motion.div>
  );
};
