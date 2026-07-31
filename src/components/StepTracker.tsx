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
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <div className="relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 sm:h-1 bg-slate-800 rounded-full -z-0" />

        {/* Active Line Fill */}
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 sm:h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-in-out -z-0"
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
                  className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center font-semibold text-xs transition-all duration-300 shadow-xs ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-emerald-500/20 scale-100'
                      : isCurrent
                      ? 'bg-slate-900 text-emerald-400 ring-2 sm:ring-3 ring-emerald-500/30 border border-emerald-500 scale-105'
                      : 'bg-slate-800 text-slate-400 border border-slate-700/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isCurrent ? 'animate-pulse' : ''}`} />
                </div>
                <span
                  className={`mt-1 text-[8px] sm:text-[10px] font-semibold text-center max-w-[56px] sm:max-w-[80px] leading-tight tracking-tight ${
                    isCurrent
                      ? 'text-white font-bold'
                      : isCompleted
                      ? 'text-emerald-400'
                      : 'text-slate-500'
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
