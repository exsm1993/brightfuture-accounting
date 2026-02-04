import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { accounts, incomeTransactions, expenseTransactions, formatCurrency } from '@/data/mockData';
import { Building2 } from 'lucide-react';

export const AccountsWidget = () => {
  // Calculate balance per account
  const accountBalances = accounts.map(account => {
    const totalIncome = incomeTransactions
      .filter(t => t.account_id === account.id && t.status === 'Completed')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = expenseTransactions
      .filter(t => t.account_id === account.id && t.status === 'Completed')
      .reduce((sum, t) => sum + t.amount, 0);

    // Add a base balance for demo purposes
    const baseBalance = account.id === 'acc-1' ? 150000 : 75000;
    
    return {
      ...account,
      balance: baseBalance + totalIncome - totalExpenses,
      monthlyIncome: totalIncome,
      monthlyExpenses: totalExpenses,
    };
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Bank Accounts</CardTitle>
          <a href="/accounts" className="text-sm font-medium text-primary hover:underline">
            Manage
          </a>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {accountBalances.map((account) => (
          <div 
            key={account.id} 
            className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-4"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{account.name}</p>
              <p className="text-xs text-muted-foreground">{account.description}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{formatCurrency(account.balance)}</p>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
