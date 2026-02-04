import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { accounts, incomeTransactions, expenseTransactions, formatCurrency } from '@/data/mockData';
import { Plus, Building2, TrendingUp, TrendingDown } from 'lucide-react';

const AccountsPage = () => {
  // Calculate balance per account
  const accountsWithBalance = accounts.map(account => {
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

  const totalBalance = accountsWithBalance.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <AppLayout 
      title="Accounts" 
      subtitle="Manage bank accounts and payment rails"
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      }
    >
      <div className="space-y-6 animate-fade-in">
        {/* Total Balance */}
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cash Position</p>
                <p className="text-3xl font-bold">{formatCurrency(totalBalance)}</p>
                <p className="text-sm text-muted-foreground mt-1">Across all accounts</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {accountsWithBalance.map((account) => (
            <Card key={account.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{account.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{account.description}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Balance</p>
                    <p className="text-2xl font-bold">{formatCurrency(account.balance)}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10">
                        <TrendingUp className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Income</p>
                        <p className="text-sm font-semibold text-success">
                          +{formatCurrency(account.monthlyIncome)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10">
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Expenses</p>
                        <p className="text-sm font-semibold text-destructive">
                          -{formatCurrency(account.monthlyExpenses)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Rails Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Supported Payment Rails</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {['ACH', 'Stripe', 'PayPal', 'Payoneer'].map((rail) => (
                <div key={rail} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                    <span className="text-xs font-bold text-muted-foreground">
                      {rail.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{rail}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AccountsPage;
