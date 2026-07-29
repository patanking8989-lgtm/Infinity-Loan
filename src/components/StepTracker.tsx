import React from 'react';
import { Phone, UserCheck, Award, CreditCard, CheckCircle2 } from 'lucide-react';
import { Step } from '../types';

interface StepTrackerProps {
  currentStep: Step;
}

export const StepTracker: React.FC<StepTrackerProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Phone Verification', icon: Phone },
    { id: 2, name: 'Loan & Details', icon: UserCheck },
    { id: 3, name: 'Eligibility', icon: Award },
    { id: 4, name: 'Disbursement Fee', icon: CreditCard },
    { id: 5, name: 'Transfer Active', icon: CheckCircle2 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-slate-200 rounded-full -z-0" />

        {/* Active Line Fill */}
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-in-out -z-0"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps Nodes */}
        <div className="flex justify-between items-center relative z-10">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center font-semibold text-xs sm:text-sm transition-all duration-300 shadow-sm ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-emerald-500/20 scale-100'
                      : isCurrent
                      ? 'bg-slate-900 text-emerald-400 ring-2 sm:ring-4 ring-emerald-500/20 border-2 border-emerald-500 scale-105 sm:scale-110'
                      : 'bg-white text-slate-400 border border-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isCurrent ? 'animate-bounce' : ''}`} />
                </div>
                <span
                  className={`mt-1.5 text-[9px] sm:text-[11px] font-semibold text-center max-w-[64px] sm:max-w-[90px] leading-tight tracking-tight ${
                    isCurrent
                      ? 'text-slate-900 font-bold'
                      : isCompleted
                      ? 'text-emerald-700'
                      : 'text-slate-400'
                  }`}
                >
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
