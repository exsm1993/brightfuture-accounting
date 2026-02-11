import { Payout, Payable, Deal, ExpenseTransaction } from '@/types/finance';
import { incentiveTypes, businessLines } from '@/data/mockData';
import { DbPerson } from '@/hooks/usePeople';

/**
 * Derives category and incentive type for an expense created from a payout.
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
 * Resolves business_line_id from a Deal or from the Person's business_line_assignment.
 */
function resolveBusinessLineId(deal: Deal | undefined, person: DbPerson | undefined): string {
  if (deal?.business_line_id) return deal.business_line_id;
  if (!person) return '';
  if (person.business_line_assignment === 'Solar') {
    return businessLines.find(bl => bl.name === 'Solar')?.id || '';
  }
  if (person.business_line_assignment === 'Home Improvement') {
    return businessLines.find(bl => bl.name === 'Home Improvement')?.id || '';
  }
  return '';
}

/**
 * Creates ExpenseTransaction(s) from a Payout record.
 * Handles percentage-based splitting for "Both" business line persons.
 */
export function createExpenseFromPayout(
  payout: Payout,
  payable: Payable,
  deal: Deal | undefined,
  existingExpenses: ExpenseTransaction[],
  person?: DbPerson,
): ExpenseTransaction[] {
  // Idempotency check
  if (existingExpenses.some(e => e.payout_id === payout.id)) {
    return [];
  }

  const { category, incentive_type_id } = deriveExpenseCategory(payable);

  const baseExpense = {
    date: payout.paid_date,
    category,
    incentive_type_id,
    person_id: payable.person_id,
    deal_id: payable.deal_id,
    account_id: payout.paid_from_account_id,
    recurring: false,
    status: 'Completed' as const,
    payout_id: payout.id,
  };

  // If person has "Both" and no deal to derive from, split
  if (!deal && person?.business_line_assignment === 'Both') {
    const solarBLId = businessLines.find(bl => bl.name === 'Solar')?.id || '';
    const hiBLId = businessLines.find(bl => bl.name === 'Home Improvement')?.id || '';
    const solarPart = Math.round(payout.amount_paid * person.solar_percentage) / 100;
    const hiPart = payout.amount_paid - solarPart;
    const sharedGroupId = `grp-${payout.id}`;

    return [
      {
        ...baseExpense,
        id: `exp-auto-${payout.id}-solar`,
        amount: solarPart,
        business_line_id: solarBLId,
      },
      {
        ...baseExpense,
        id: `exp-auto-${payout.id}-hi`,
        amount: hiPart,
        business_line_id: hiBLId,
      },
    ];
  }

  const business_line_id = resolveBusinessLineId(deal, person);

  return [{
    ...baseExpense,
    id: `exp-auto-${payout.id}`,
    amount: payout.amount_paid,
    business_line_id,
  }];
}
