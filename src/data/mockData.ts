import { 
  BusinessLine, 
  Account, 
  Deal, 
  Person, 
  Payable, 
  Payout, 
  DealPayment,
  IncomeTransaction,
  ExpenseTransaction,
  Installer,
  IncentiveType
} from '@/types/finance';

// Incentive Types (extensible list)
export const incentiveTypes: IncentiveType[] = [];

// Installers
export const installers: Installer[] = [];

// Default Business Lines
export const businessLines: BusinessLine[] = [
  { id: 'bl-1', name: 'Solar' },
  { id: 'bl-2', name: 'Home Improvement' },
];

// Default Accounts
export const accounts: Account[] = [];

// Sample People
// People are now stored in the database - this empty array is kept for backward compatibility
export const people: Person[] = [];

// Sample Deals
export const deals: Deal[] = [];

// Sample Payables
export const payables: Payable[] = [];

// Sample Payouts
export const payouts: Payout[] = [];

// Sample Deal Payments (Installer payments received)
export const dealPayments: DealPayment[] = [];

// Sample Income Transactions
export const incomeTransactions: IncomeTransaction[] = [];

// Sample Expense Transactions
export const expenseTransactions: ExpenseTransaction[] = [];

// Helper functions
export const getBusinessLineName = (id: string): string => {
  return businessLines.find(bl => bl.id === id)?.name || 'Unknown';
};

export const getAccountName = (id: string): string => {
  return accounts.find(acc => acc.id === id)?.name || 'Unknown';
};

export const getPersonName = (id: string): string => {
  return people.find(p => p.id === id)?.name || 'Unknown';
};

export const getInstallerName = (id: string): string => {
  return installers.find(i => i.id === id)?.installer_name || 'Unknown';
};

export const getIncentiveTypeName = (id: string): string => {
  return incentiveTypes.find(it => it.id === id)?.name || 'Unknown';
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
