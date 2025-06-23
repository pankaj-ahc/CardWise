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
  id: string;
  name: string;
  type: 'Annual' | 'Quarterly' | 'Monthly';
  targetAmount: number;
  currentSpend: number;
  startDate: string;
  endDate: string;
}

export interface CardData {
  id: string;
  cardName: string;
  last4Digits: string;
  bankName: string;
  billDate: number; // Day of the month
  dueDate: number; // Day of the month
  annualFee: number;
  billingCycleStartMonth: string;
  feeWaiverCriteria: string;
  perks: string[];
  bills: Bill[];
  spendTrackers: SpendTracker[];
  color: string;
}
