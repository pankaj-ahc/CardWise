export interface Bill {
  id: string;
  month: string;
  amount: number;
  paid: boolean;
  paymentDate?: string;
  dueDate: string;
  notes?: string;
}

export interface SpendTracker {
  id:string;
  name: string;
  type: 'Annual' | 'Quarterly' | 'Monthly';
  targetAmount: number;
  startDate: string;
}

export const CARD_VARIANTS = ['Visa', 'Mastercard', 'American Express', 'Discover', 'RuPay', 'Maestro', 'Other'] as const;
export type CardVariant = typeof CARD_VARIANTS[number];

export interface CardData {
  id: string;
  cardName: string;
  last4Digits?: string;
  bankName: string;
  cardVariant: CardVariant;
  dueDate: number; // Day of the month
  annualFee: number;
  billingCycleStartMonth: string;
  feeWaiverCriteria: string;
  perks: string[];
  bills: Bill[];
  spendTrackers: SpendTracker[];
  color: string;
  extraInfo?: string;
}
