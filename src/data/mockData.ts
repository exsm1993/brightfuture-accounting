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
export const incentiveTypes: IncentiveType[] = [
  { id: 'it-1', name: 'Commission - Sale', active: true },
  { id: 'it-2', name: 'Commission - Installation', active: true },
  { id: 'it-3', name: 'Bonus - Appointment', active: true },
  { id: 'it-4', name: 'Bonus - Sale', active: true },
  { id: 'it-5', name: 'Bonus - Installation', active: true },
];

// Installers
export const installers: Installer[] = [
  { id: 'inst-1', installer_name: 'SunPower Pro', business_line: 'Solar', contact_email: 'contact@sunpowerpro.com', installer_phone: '555-0101', active: true },
  { id: 'inst-2', installer_name: 'Green Energy Solutions', business_line: 'Solar', contact_email: 'info@greenenergy.com', installer_phone: '555-0102', active: true },
  { id: 'inst-3', installer_name: 'SolarTech Inc', business_line: 'Solar', contact_email: 'sales@solartech.com', installer_phone: '555-0103', active: true },
  { id: 'inst-4', installer_name: 'Premium Renovations', business_line: 'Home Improvement', contact_email: 'hello@premiumreno.com', installer_phone: '555-0201', active: true },
  { id: 'inst-5', installer_name: 'HomePro Builders', business_line: 'Home Improvement', contact_email: 'info@homeprobuilders.com', installer_phone: '555-0202', active: true },
  { id: 'inst-6', installer_name: 'Elite Home Services', business_line: 'Both', contact_email: 'contact@elitehome.com', installer_phone: '555-0301', active: true },
  { id: 'inst-7', installer_name: 'Legacy Contractors', business_line: 'Home Improvement', contact_email: 'legacy@contractors.com', installer_phone: '555-0203', active: false, notes: 'No longer in service area' },
];

// Default Business Lines
export const businessLines: BusinessLine[] = [
  { id: 'bl-1', name: 'Solar' },
  { id: 'bl-2', name: 'Home Improvement' },
];

// Default Accounts
export const accounts: Account[] = [
  { id: 'acc-1', name: 'Chase 2921', type: 'bank', description: 'Main & Payroll' },
  { id: 'acc-2', name: 'Chase 8557', type: 'bank', description: 'Apps & Call Center' },
];

// Sample People
export const people: Person[] = [
  { id: 'p-1', name: 'Marcus Johnson', role: 'closer', active: true },
  { id: 'p-2', name: 'Sarah Williams', role: 'closer', active: true },
  { id: 'p-3', name: 'David Chen', role: 'setter', active: true },
  { id: 'p-4', name: 'Emily Rodriguez', role: 'setter', active: true },
  { id: 'p-5', name: 'Michael Thompson', role: 'team_leader', active: true },
  { id: 'p-6', name: 'Jennifer Garcia', role: 'call_center', active: true },
  { id: 'p-7', name: 'Robert Martinez', role: 'call_center', active: true },
  { id: 'p-8', name: 'Lisa Anderson', role: 'call_center', active: false },
];

// Sample Deals
export const deals: Deal[] = [
  {
    deal_id: 'D-2024-001',
    date_created: '2024-01-15',
    business_line_id: 'bl-1',
    customer_name: 'The Wilson Family',
    installer_id: 'inst-1',
    system_or_type_of_work: '12kW Solar System',
    deal_amount: 45000,
    status: 'Completed',
    source_system: 'Initiate365',
  },
  {
    deal_id: 'D-2024-002',
    date_created: '2024-01-18',
    business_line_id: 'bl-1',
    customer_name: 'James Patterson',
    installer_id: 'inst-2',
    system_or_type_of_work: '8kW Solar + Battery',
    deal_amount: 38000,
    status: 'In Progress',
    source_system: 'Flowspot',
  },
  {
    deal_id: 'D-2024-003',
    date_created: '2024-01-20',
    business_line_id: 'bl-2',
    customer_name: 'Maria Santos',
    installer_id: 'inst-4',
    system_or_type_of_work: 'Kitchen Remodel',
    deal_amount: 28000,
    status: 'Signed',
    source_system: 'Manual',
  },
  {
    deal_id: 'D-2024-004',
    date_created: '2024-01-22',
    business_line_id: 'bl-2',
    customer_name: 'Thomas & Linda Brown',
    installer_id: 'inst-5',
    system_or_type_of_work: 'Bathroom + Flooring',
    deal_amount: 18500,
    status: 'Completed',
    source_system: 'Initiate365',
  },
  {
    deal_id: 'D-2024-005',
    date_created: '2024-01-25',
    business_line_id: 'bl-1',
    customer_name: 'Kevin O\'Brien',
    installer_id: 'inst-3',
    system_or_type_of_work: '15kW Commercial Solar',
    deal_amount: 72000,
    status: 'In Progress',
    source_system: 'Flowspot',
  },
  {
    deal_id: 'D-2024-006',
    date_created: '2024-01-28',
    business_line_id: 'bl-2',
    customer_name: 'Angela Davis',
    installer_id: 'inst-6',
    system_or_type_of_work: 'HVAC Replacement',
    deal_amount: 12000,
    status: 'Signed',
    source_system: 'Manual',
  },
];

// Sample Payables
export const payables: Payable[] = [
  {
    id: 'pay-1',
    deal_id: 'D-2024-001',
    person_id: 'p-1',
    role: 'closer',
    event_type: 'SIGNED',
    total_amount: 2250,
    earned_date: '2024-01-15',
    pay_schedule: 'FRIDAY',
    status: 'Paid',
  },
  {
    id: 'pay-2',
    deal_id: 'D-2024-001',
    person_id: 'p-3',
    role: 'setter',
    event_type: 'SIGNED',
    total_amount: 500,
    earned_date: '2024-01-15',
    pay_schedule: 'FRIDAY',
    status: 'Paid',
  },
  {
    id: 'pay-3',
    deal_id: 'D-2024-002',
    person_id: 'p-2',
    role: 'closer',
    event_type: 'SIGNED',
    total_amount: 1900,
    earned_date: '2024-01-18',
    pay_schedule: 'FRIDAY',
    status: 'Ready',
  },
  {
    id: 'pay-4',
    deal_id: 'D-2024-003',
    person_id: 'p-1',
    role: 'closer',
    event_type: 'SIGNED',
    total_amount: 1400,
    earned_date: '2024-01-20',
    pay_schedule: 'FRIDAY',
    status: 'Ready',
  },
  {
    id: 'pay-5',
    deal_id: 'D-2024-001',
    person_id: 'p-1',
    role: 'closer',
    event_type: 'INSTALLER_PAYMENT',
    total_amount: 1125,
    earned_date: '2024-01-25',
    pay_schedule: 'FRIDAY',
    status: 'Pending',
  },
  {
    id: 'pay-6',
    person_id: 'p-6',
    role: 'call_center',
    event_type: 'SIGNED',
    total_amount: 800,
    earned_date: '2024-01-15',
    pay_schedule: 'BIWEEKLY',
    status: 'Ready',
  },
  {
    id: 'pay-7',
    person_id: 'p-7',
    role: 'call_center',
    event_type: 'SIGNED',
    total_amount: 650,
    earned_date: '2024-01-18',
    pay_schedule: 'BIWEEKLY',
    status: 'Ready',
  },
  {
    id: 'pay-8',
    deal_id: 'D-2024-005',
    person_id: 'p-5',
    role: 'team_leader',
    event_type: 'SIGNED',
    total_amount: 1800,
    earned_date: '2024-01-25',
    pay_schedule: 'FRIDAY',
    status: 'Ready',
  },
];

// Sample Payouts
export const payouts: Payout[] = [
  {
    id: 'payout-1',
    payable_id: 'pay-1',
    paid_date: '2024-01-19',
    amount_paid: 2250,
    paid_from_account_id: 'acc-1',
    payment_rail: 'ACH',
    reference: 'PAY-2024-0001',
  },
  {
    id: 'payout-2',
    payable_id: 'pay-2',
    paid_date: '2024-01-19',
    amount_paid: 500,
    paid_from_account_id: 'acc-1',
    payment_rail: 'ACH',
    reference: 'PAY-2024-0002',
  },
];

// Sample Deal Payments (Installer payments received)
export const dealPayments: DealPayment[] = [
  {
    id: 'dp-1',
    deal_id: 'D-2024-001',
    payment_date: '2024-01-20',
    amount_received: 22500,
    received_to_account_id: 'acc-1',
    payment_method: 'Wire',
    reference: 'INV-SP-2024-001',
    installer_id: 'inst-1',
  },
  {
    id: 'dp-2',
    deal_id: 'D-2024-001',
    payment_date: '2024-01-25',
    amount_received: 22500,
    received_to_account_id: 'acc-1',
    payment_method: 'Wire',
    reference: 'INV-SP-2024-002',
    installer_id: 'inst-1',
  },
  {
    id: 'dp-3',
    deal_id: 'D-2024-004',
    payment_date: '2024-01-28',
    amount_received: 18500,
    received_to_account_id: 'acc-1',
    payment_method: 'Check',
    reference: 'CHK-4521',
    installer_id: 'inst-5',
  },
];

// Sample Income Transactions
export const incomeTransactions: IncomeTransaction[] = [
  {
    id: 'inc-1',
    date: '2024-01-20',
    amount: 22500,
    deal_id: 'D-2024-001',
    business_line_id: 'bl-1',
    account_id: 'acc-1',
    income_type: 'Installer Payment',
    installer_id: 'inst-1',
    status: 'Completed',
  },
  {
    id: 'inc-2',
    date: '2024-01-25',
    amount: 22500,
    deal_id: 'D-2024-001',
    business_line_id: 'bl-1',
    account_id: 'acc-1',
    income_type: 'Installer Payment',
    installer_id: 'inst-1',
    status: 'Completed',
  },
  {
    id: 'inc-3',
    date: '2024-01-28',
    amount: 18500,
    deal_id: 'D-2024-004',
    business_line_id: 'bl-2',
    account_id: 'acc-1',
    income_type: 'Installer Payment',
    installer_id: 'inst-5',
    status: 'Completed',
  },
];

// Sample Expense Transactions
export const expenseTransactions: ExpenseTransaction[] = [
  {
    id: 'exp-1',
    date: '2024-01-19',
    amount: 2750,
    business_line_id: 'bl-1',
    category: 'Commissions',
    incentive_type_id: 'it-1',
    person_id: 'p-1',
    deal_id: 'D-2024-001',
    account_id: 'acc-1',
    recurring: false,
    status: 'Completed',
  },
  {
    id: 'exp-2',
    date: '2024-01-15',
    amount: 5000,
    business_line_id: 'bl-1',
    category: 'Marketing',
    account_id: 'acc-2',
    recurring: true,
    status: 'Completed',
  },
  {
    id: 'exp-3',
    date: '2024-01-01',
    amount: 3500,
    business_line_id: 'bl-2',
    category: 'Office Rent',
    account_id: 'acc-1',
    recurring: true,
    status: 'Completed',
  },
  {
    id: 'exp-4',
    date: '2024-01-10',
    amount: 1200,
    business_line_id: 'bl-1',
    category: 'Software',
    account_id: 'acc-2',
    recurring: true,
    status: 'Completed',
  },
  {
    id: 'exp-5',
    date: '2024-01-22',
    amount: 500,
    business_line_id: 'bl-1',
    category: 'Bonus',
    incentive_type_id: 'it-3',
    person_id: 'p-3',
    account_id: 'acc-1',
    recurring: false,
    status: 'Completed',
  },
  // Auto-generated from payout-1 (Marcus Johnson closer, SIGNED, D-2024-001)
  {
    id: 'exp-auto-payout-1',
    date: '2024-01-19',
    amount: 2250,
    business_line_id: 'bl-1',
    category: 'Commissions',
    incentive_type_id: 'it-1',
    person_id: 'p-1',
    deal_id: 'D-2024-001',
    account_id: 'acc-1',
    recurring: false,
    status: 'Completed',
    payout_id: 'payout-1',
  },
  // Auto-generated from payout-2 (David Chen setter, SIGNED, D-2024-001)
  {
    id: 'exp-auto-payout-2',
    date: '2024-01-19',
    amount: 500,
    business_line_id: 'bl-1',
    category: 'Commissions',
    incentive_type_id: 'it-1',
    person_id: 'p-3',
    deal_id: 'D-2024-001',
    account_id: 'acc-1',
    recurring: false,
    status: 'Completed',
    payout_id: 'payout-2',
  },
];

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
