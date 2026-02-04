import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { PayablesWidget } from '@/components/dashboard/PayablesWidget';
import { RecentDealsWidget } from '@/components/dashboard/RecentDealsWidget';
import { AccountsWidget } from '@/components/dashboard/AccountsWidget';
import { PLChartWidget } from '@/components/dashboard/PLChartWidget';
import { 
  deals, 
  payables, 
  incomeTransactions, 
  expenseTransactions,
  formatCurrency 
} from '@/data/mockData';
import { 
  FileText, 
  DollarSign, 
  TrendingUp, 
  CreditCard,
  Calendar,
  Users
} from 'lucide-react';

const Dashboard = () => {
  // Calculate metrics
  const totalDeals = deals.length;
  const totalRevenue = incomeTransactions
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTransactions
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);
  const netIncome = totalRevenue - totalExpenses;

  // Outstanding payables
  const outstandingPayables = payables
    .filter(p => p.status === 'Ready' || p.status === 'Pending')
    .reduce((sum, p) => sum + p.total_amount, 0);

  // Friday payroll (closers, setters, team leaders)
  const fridayPayroll = payables
    .filter(p => p.pay_schedule === 'FRIDAY' && p.status === 'Ready')
    .reduce((sum, p) => sum + p.total_amount, 0);

  // Bi-weekly payroll (call center)
  const biweeklyPayroll = payables
    .filter(p => p.pay_schedule === 'BIWEEKLY' && p.status === 'Ready')
    .reduce((sum, p) => sum + p.total_amount, 0);

  return (
    <AppLayout title="Dashboard" subtitle="Financial overview and key metrics">
      <div className="space-y-6 animate-fade-in">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Deals"
            value={totalDeals.toString()}
            subtitle="This month"
            icon={<FileText className="h-5 w-5 text-muted-foreground" />}
            trend={{ value: 12, label: 'vs last month' }}
          />
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            subtitle="Collected"
            icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
            trend={{ value: 8, label: 'vs last month' }}
            variant="success"
          />
          <StatCard
            title="Total Expenses"
            value={formatCurrency(totalExpenses)}
            subtitle="This month"
            icon={<TrendingUp className="h-5 w-5 text-muted-foreground" />}
            trend={{ value: -5, label: 'vs last month' }}
          />
          <StatCard
            title="Net Income"
            value={formatCurrency(netIncome)}
            subtitle="Profit"
            icon={<TrendingUp className="h-5 w-5 text-muted-foreground" />}
            variant={netIncome >= 0 ? 'success' : 'warning'}
          />
        </div>

        {/* Payroll Overview */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            title="Outstanding Payables"
            value={formatCurrency(outstandingPayables)}
            subtitle="Pending + Ready"
            icon={<CreditCard className="h-5 w-5 text-muted-foreground" />}
            variant="warning"
          />
          <StatCard
            title="Friday Payroll"
            value={formatCurrency(fridayPayroll)}
            subtitle="Closers, Setters, TLs"
            icon={<Calendar className="h-5 w-5 text-muted-foreground" />}
            variant="info"
          />
          <StatCard
            title="Bi-Weekly Payroll"
            value={formatCurrency(biweeklyPayroll)}
            subtitle="Call Center"
            icon={<Users className="h-5 w-5 text-muted-foreground" />}
            variant="info"
          />
        </div>

        {/* Charts and Widgets */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <PLChartWidget />
          <AccountsWidget />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RecentDealsWidget />
          <PayablesWidget />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
