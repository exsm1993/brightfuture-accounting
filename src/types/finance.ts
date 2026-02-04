// Core Business Types for Finance & Commissions App

export type BusinessLineType = 'Solar' | 'Home Improvement';

export interface BusinessLine {
  id: string;
  name: BusinessLineType;
}

export type AccountType = 'bank';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  description: string;
}

export type DealStatus = 'Signed' | 'In Progress' | 'Completed' | 'Cancelled';
export type SourceSystem = 'Initiate365' | 'Flowspot' | 'Manual';

export interface Deal {
  deal_id: string;
  date_created: string;
  business_line_id: string;
  customer_name: string;
  installer: string;
  system_or_type_of_work: string;
  deal_amount: number;
  status: DealStatus;
  source_system: SourceSystem;
}

export type PersonRole = 'closer' | 'setter' | 'team_leader' | 'call_center';

export interface Person {
  id: string;
  name: string;
  role: PersonRole;
  active: boolean;
}

export type EventType = 'SIGNED' | 'INSTALLER_PAYMENT';
export type PaySchedule = 'FRIDAY' | 'BIWEEKLY';
export type PayableStatus = 'Pending' | 'Ready' | 'Paid' | 'Hold';

export interface Payable {
  id: string;
  deal_id?: string;
  person_id: string;
  role: PersonRole;
  event_type: EventType;
  total_amount: number;
  earned_date: string;
  pay_schedule: PaySchedule;
  status: PayableStatus;
}

export type PaymentRail = 'ACH' | 'Stripe' | 'PayPal' | 'Payoneer';

export interface Payout {
  id: string;
  payable_id: string;
  paid_date: string;
  amount_paid: number;
  paid_from_account_id: string;
  payment_rail: PaymentRail;
  reference: string;
}

export interface DealPayment {
  id: string;
  deal_id: string;
  payment_date: string;
  amount_received: number;
  received_to_account_id: string;
  payment_method: string;
  reference: string;
}

export type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

export interface IncomeTransaction {
  id: string;
  date: string;
  amount: number;
  deal_id?: string;
  business_line_id: string;
  account_id: string;
  source: string;
  status: TransactionStatus;
}

export interface ExpenseTransaction {
  id: string;
  date: string;
  amount: number;
  business_line_id: string;
  category: string;
  person_id?: string;
  deal_id?: string;
  account_id: string;
  recurring: boolean;
  status: TransactionStatus;
}

// Dashboard Summary Types
export interface DashboardMetrics {
  totalDeals: number;
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  outstandingPayables: number;
  fridayPayroll: number;
  biweeklyPayroll: number;
  cashByAccount: { accountId: string; accountName: string; balance: number }[];
}

export interface MonthlyPL {
  month: string;
  revenue: number;
  expenses: number;
  net: number;
  businessLine: BusinessLineType;
}
