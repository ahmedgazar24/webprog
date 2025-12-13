export interface Student {
  id: number;
  name: string;
  email: string;
  feesPaid: number;
  totalFees: number;
  paymentHistory: { date: string; amount: number }[];
}

