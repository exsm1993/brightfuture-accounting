import { Payout, Payable, Deal, ExpenseTransaction } from '@/types/finance';
import { incentiveTypes } from '@/data/mockData';

/**
 * Derives category and incentive type for an expense created from a payout.
 * - call_center role → "Bonus"
 * - all other roles → "Commissions"
 * Incentive type mapping:
 * - SIGNED + Commissions → "Commission - Sale"
 * - SIGNED + Bonus → "Bonus - Sale"
 * - INSTALLER_PAYMENT + Commissions → "Commission - Installation"
 * - INSTALLER_PAYMENT + Bonus → "Bonus - Installation"
 */
function deriveExpenseCategory(payable: Payable): { category: string; incentive_type_id?: string } {
  const category = payable.role === 'call_center' ? 'Bonus' : 'Commissions';

  const incentiveNameMap: Record<string, Record<string, string>> = {
    SIGNED: { Commissions: 'Commission - Sale', Bonus: 'Bonus - Sale' },
    INSTALLER_PAYMENT: { Commissions: 'Commission - Installation', Bonus: 'Bonus - Installation' },
  };

  const incentiveName = incentiveNameMap[payable.event_type]?.[category];
  const incentiveType = incentiveName
    ? incentiveTypes.find(it => it.name === incentiveName)
    : undefined;

  return { category, incentive_type_id: incentiveType?.id };
}

/**
 * Creates an ExpenseTransaction from a Payout record.
 * Ensures idempotency by including payout_id on the expense.
 */
export function createExpenseFromPayout(
  payout: Payout,
  payable: Payable,
  deal: Deal | undefined,
  existingExpenses: ExpenseTransaction[],
): ExpenseTransaction | null {
  // Idempotency check – don't create duplicate
  if (existingExpenses.some(e => e.payout_id === payout.id)) {
    return null;
  }

  const { category, incentive_type_id } = deriveExpenseCategory(payable);

  const expense: ExpenseTransaction = {
    id: `exp-auto-${payout.id}`,
    date: payout.paid_date,
    amount: payout.amount_paid,
    business_line_id: deal?.business_line_id || '',
    category,
    incentive_type_id,
    person_id: payable.person_id,
    deal_id: payable.deal_id,
    account_id: payout.paid_from_account_id,
    recurring: false,
    status: 'Completed',
    payout_id: payout.id,
  };

  return expense;
}
