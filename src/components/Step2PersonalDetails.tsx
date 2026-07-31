import React, { useState } from 'react';
import { User, CreditCard, Building2, MapPin, Calculator, ArrowRight, Loader2, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { EmploymentType, LoanDetails } from '../types';
import { INDIAN_STATES } from '../data/statesAndCities';
import { AppDownloadButton } from './AppDownloadButton';

interface Step2PersonalDetailsProps {
  phone: string;
  onSubmit: (details: Omit<LoanDetails, 'phone' | 'otpVerified'>) => Promise<void>;
  initialData?: Partial<LoanDetails>;
}

export const Step2PersonalDetails: React.FC<Step2PersonalDetailsProps> = ({
  phone,
  onSubmit,
  initialData = {} as Partial<LoanDetails>,
}) => {
  const [employmentType, setEmploymentType] = useState<EmploymentType>(
    initialData.employmentType || 'Salaried'
  );
  const [loanAmount, setLoanAmount] = useState<number>(initialData.loanAmount || 500000);
  const [loanTenure, setLoanTenure] = useState<number>(initialData.loanTenure || 24);

  const [name, setName] = useState(initialData.name || '');
  const [adhar, setAdhar] = useState(initialData.adhar || '');
  const [panCard, setPanCard] = useState(initialData.panCard || '');
  const [age, setAge] = useState(initialData.age || '28');
  const [state, setState] = useState(initialData.state || 'Maharashtra');
  const [city, setCity] = useState(initialData.city || 'Mumbai');
  const [pincode, setPincode] = useState(initialData.pincode || '400001');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate EMI: P * r * (1+r)^n / ((1+r)^n - 1) @ 10.5% p.a.
  const annualInterestRate = 10.5;
  const monthlyRate = annualInterestRate / 12 / 100;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTenure)) /
      (Math.pow(1 + monthlyRate, loanTenure) - 1)
  );

  // Formatting helpers
  const handleAdharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    // Format XXXX XXXX XXXX
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setAdhar(formatted);
  };

  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    setPanCard(value);
  };

  const selectedStateObj = INDIAN_STATES.find((s) => s.state === state);
  const availableCities = selectedStateObj ? selectedStateObj.cities : ['Other'];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Full name is required';
    
    const cleanAdhar = adhar.replace(/\s/g, '');
    if (cleanAdhar.length !== 12) {
      newErrors.adhar = 'Enter valid 12-digit Aadhaar Number';
    }

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 75) {
      newErrors.age = 'Age must be between 18 and 75';
    }

    if (!pincode || pincode.length !== 6) {
      newErrors.pincode = 'Enter valid 6-digit Pincode';
    }

    if (!state) newErrors.state = 'State is required';
    if (!city) newErrors.city = 'City is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit({
        employmentType,
        loanAmount,
        loanTenure,
        name,
        adhar,
        panCard,
        age,
        state,
        city,
        pincode,
      });
    } catch (err: any) {
      setErrors({ form: err.message || 'Submission failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-3xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-3.5 sm:p-6"
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 sm:mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Loan & Personal Details</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified Phone: <span className="font-bold text-emerald-600">{phone}</span>
          </p>
        </div>
        <div className="w-9 h-9 sm:w-11 sm:h-11 bg-emerald-50 text-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center border border-emerald-100 shrink-0">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {/* SECTION 1: LOAN SELECTIONS & EMI */}
        <div className="bg-slate-50 rounded-2xl p-3 sm:p-4 border border-slate-200/80 space-y-3.5">
          <div className="flex items-center space-x-2">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">1. Select Loan Amount & Tenure</h3>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] sm:text-xs font-semibold text-slate-600 uppercase">Desired Loan Amount</label>
              <span className="text-xl sm:text-2xl font-black text-slate-900">₹{loanAmount.toLocaleString('en-IN')}</span>
            </div>

            <input
              type="range"
              min={25000}
              max={500000}
              step={25000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />

            <div className="flex justify-between text-[10px] sm:text-xs text-slate-400 mt-1 font-medium">
              <span>₹25,000</span>
              <span>₹2,50,000</span>
              <span>₹5,00,000</span>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2.5">
              {[50000, 100000, 250000, 350000, 500000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setLoanAmount(amt)}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    loanAmount === amt
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  ₹{(amt / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          {/* Tenure Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] sm:text-xs font-semibold text-slate-600 uppercase">Repayment Tenure</label>
              <span className="text-sm sm:text-base font-bold text-slate-900">{loanTenure} Months ({loanTenure / 12} yrs)</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {[12, 24, 36, 48, 60].map((months) => (
                <button
                  key={months}
                  type="button"
                  onClick={() => setLoanTenure(months)}
                  className={`py-1.5 sm:py-2 rounded-lg text-xs font-semibold transition-all ${
                    loanTenure === months
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {months}m
                </button>
              ))}
            </div>
          </div>

          {/* EMI Calculation Summary Box */}
          <div className="bg-emerald-950 text-white rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-md">
            <div>
              <p className="text-[10px] sm:text-xs text-emerald-300 font-medium uppercase tracking-wider">Estimated Monthly EMI</p>
              <p className="text-2xl sm:text-3xl font-black text-white mt-0.5">₹{emi.toLocaleString('en-IN')}<span className="text-xs font-normal text-emerald-400">/mo</span></p>
            </div>
            <div className="text-right text-[11px] sm:text-xs text-emerald-200/90 border-t sm:border-t-0 sm:border-l border-emerald-800/80 pt-2 sm:pt-0 sm:pl-4 w-full sm:w-auto flex sm:block justify-between">
              <p>Interest Rate: <strong className="text-emerald-300">10.5% p.a.</strong></p>
              <p>Processing Fee: <strong className="text-emerald-300">₹1 Fee</strong></p>
            </div>
          </div>
        </div>

        {/* SECTION 2: EMPLOYMENT TYPE */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            2. Employment Type
          </label>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            <button
              type="button"
              onClick={() => setEmploymentType('Salaried')}
              className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left transition-all flex items-center space-x-2 sm:space-x-3 cursor-pointer min-w-0 ${
                employmentType === 'Salaried'
                  ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl shrink-0 ${employmentType === 'Salaried' ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-slate-600'}`}>
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs sm:text-sm truncate">Salaried</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setEmploymentType('Business')}
              className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left transition-all flex items-center space-x-2 sm:space-x-3 cursor-pointer min-w-0 ${
                employmentType === 'Business'
                  ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl shrink-0 ${employmentType === 'Business' ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-slate-600'}`}>
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs sm:text-sm truncate">Business</p>
              </div>
            </button>
          </div>
        </div>

        {/* SECTION 3: PERSONAL DETAILS FORM */}
        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            3. Fill Personal Details
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">Full Name (As on PAN)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className={`w-full px-3.5 py-2.5 sm:py-3 bg-slate-50 border rounded-xl text-slate-900 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                  errors.name ? 'border-rose-500' : 'border-slate-200'
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.name}</p>}
            </div>

            {/* Aadhaar Card Number */}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">Aadhaar Card Number (12 Digits)</label>
              <input
                type="text"
                value={adhar}
                onChange={handleAdharChange}
                placeholder="1234 5678 9012"
                maxLength={14}
                className={`w-full px-3.5 py-2.5 sm:py-3 bg-slate-50 border rounded-xl text-slate-900 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                  errors.adhar ? 'border-rose-500' : 'border-slate-200'
                }`}
              />
              {errors.adhar && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.adhar}</p>}
            </div>

            {/* PAN Card Number */}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">PAN Card Number (Optional)</label>
              <input
                type="text"
                value={panCard}
                onChange={handlePanChange}
                placeholder="ABCDE1234F"
                className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm font-semibold uppercase tracking-wider outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">Age (Years)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="28"
                min={18}
                max={75}
                className={`w-full px-3.5 py-2.5 sm:py-3 bg-slate-50 border rounded-xl text-slate-900 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                  errors.age ? 'border-rose-500' : 'border-slate-200'
                }`}
              />
              {errors.age && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.age}</p>}
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="400001"
                maxLength={6}
                className={`w-full px-3.5 py-2.5 sm:py-3 bg-slate-50 border rounded-xl text-slate-900 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                  errors.pincode ? 'border-rose-500' : 'border-slate-200'
                }`}
              />
              {errors.pincode && <p className="text-[11px] text-rose-500 mt-1 font-medium">{errors.pincode}</p>}
            </div>

            {/* State */}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">State</label>
              <select
                value={state}
                onChange={(e) => {
                  const newState = e.target.value;
                  setState(newState);
                  const stObj = INDIAN_STATES.find((s) => s.state === newState);
                  if (stObj && stObj.cities.length > 0) {
                    setCity(stObj.cities[0]);
                  }
                }}
                className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st.state} value={st.state}>
                    {st.state}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-1">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {errors.form && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-700 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center space-x-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <span>Transmitting Application to Telegram Bot...</span>
            </>
          ) : (
            <>
              <span>Submit</span>
              <ArrowRight className="w-5 h-5 text-emerald-400" />
            </>
          )}
        </button>

        {/* App Download Button */}
        <AppDownloadButton />
      </form>
    </motion.div>
  );
};
