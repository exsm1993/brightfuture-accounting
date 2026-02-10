import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { payouts, payables, accounts, expenseTransactions, formatCurrency, formatDate } from '@/data/mockData';
import { usePeople } from '@/hooks/usePeople';
import { Plus, Wallet, FileText, Link } from 'lucide-react';

const PayoutsPage = () => {
  const { data: people = [] } = usePeople();
  // Enrich payout data
  const enrichedPayouts = payouts.map(payout => {
    const payable = payables.find(p => p.id === payout.payable_id);
    const person = payable ? people.find(p => p.id === payable.person_id) : null;
    const account = accounts.find(a => a.id === payout.paid_from_account_id);
    const linkedExpense = expenseTransactions.find(e => e.payout_id === payout.id);
    
    return {
      ...payout,
      personName: person?.name || 'Unknown',
      accountName: account?.name || 'Unknown',
      role: payable?.role || 'unknown',
      payableId: payable?.id,
      linkedExpenseId: linkedExpense?.id,
      linkedExpenseCategory: linkedExpense?.category,
    };
  });

  const totalPaid = payouts.reduce((sum, p) => sum + p.amount_paid, 0);

  return (
    <AppLayout 
      title="Payouts" 
      subtitle="Track all payments made to team members"
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Record Payout
        </Button>
      }
    >
      <div className="space-y-4 animate-fade-in">
        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Paid Out</p>
            <p className="text-2xl font-bold text-success">{formatCurrency(totalPaid)}</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Payouts</p>
            <p className="text-2xl font-bold">{payouts.length}</p>
            <p className="text-xs text-muted-foreground">Transactions</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Primary Rail</p>
            <p className="text-2xl font-bold">ACH</p>
            <p className="text-xs text-muted-foreground">Most common method</p>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Reference</TableHead>
                <TableHead>Person</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Payment Rail</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Linked</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrichedPayouts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center">
                    <Wallet className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No payouts recorded yet</p>
                  </TableCell>
                </TableRow>
              ) : (
                enrichedPayouts.map((payout) => (
                  <TableRow key={payout.id} className="data-table-row">
                    <TableCell className="font-mono text-sm">{payout.reference}</TableCell>
                    <TableCell className="font-medium">{payout.personName}</TableCell>
                    <TableCell className="capitalize text-muted-foreground">
                      {payout.role.replace('_', ' ')}
                    </TableCell>
                    <TableCell className="font-semibold text-success">
                      {formatCurrency(payout.amount_paid)}
                    </TableCell>
                    <TableCell>{payout.accountName}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
                        {payout.payment_rail}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(payout.paid_date)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {payout.payableId && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a href="/payables" className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                                <Link className="h-3 w-3" />
                                Payable
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>Payable: {payout.payableId}</TooltipContent>
                          </Tooltip>
                        )}
                        {payout.linkedExpenseId && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a href="/expenses" className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
                                <FileText className="h-3 w-3" />
                                Expense
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>{payout.linkedExpenseCategory} — {payout.linkedExpenseId}</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
};

export default PayoutsPage;
