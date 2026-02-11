import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToolsSubscriptions } from '@/hooks/useToolsSubscriptions';
import { useCallCenters } from '@/hooks/useCallCenters';
import { formatCurrency } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--solar))', 'hsl(var(--home-improvement))', '#8884d8', '#82ca9d', '#ffc658', '#ff7c43', '#a4de6c'];

const ToolsDashboardPage = () => {
  const { data: subs = [], isLoading } = useToolsSubscriptions();
  const { data: callCenters = [] } = useCallCenters();

  const active = subs.filter(s => s.status === 'Active');

  const monthlyTotal = active.reduce((sum, s) => {
    if (s.billing_frequency === 'Monthly') return sum + s.billing_amount;
    if (s.billing_frequency === 'Annual') return sum + s.billing_amount / 12;
    return sum;
  }, 0);

  // By category
  const byCategory = active.reduce<Record<string, number>>((acc, s) => {
    const monthly = s.billing_frequency === 'Annual' ? s.billing_amount / 12 : s.billing_amount;
    acc[s.category] = (acc[s.category] || 0) + monthly;
    return acc;
  }, {});
  const categoryData = Object.entries(byCategory).map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 })).sort((a, b) => b.value - a.value);

  // By business line
  const blData = [
    { name: 'Solar', value: 0 },
    { name: 'Home Improvement', value: 0 },
  ];
  active.forEach(s => {
    const monthly = s.billing_frequency === 'Annual' ? s.billing_amount / 12 : s.billing_amount;
    if (s.business_line_allocation === 'Solar') blData[0].value += monthly;
    else if (s.business_line_allocation === 'Home Improvement') blData[1].value += monthly;
    else {
      blData[0].value += monthly * (s.solar_percentage / 100);
      blData[1].value += monthly * (s.home_improvement_percentage / 100);
    }
  });
  blData.forEach(d => d.value = Math.round(d.value * 100) / 100);

  // By call center
  const ccMap = new Map(callCenters.map(cc => [cc.id, cc.call_center_name]));
  const byCCRaw = active.reduce<Record<string, number>>((acc, s) => {
    if (s.call_center_id) {
      const name = ccMap.get(s.call_center_id) || 'Unknown';
      const monthly = s.billing_frequency === 'Annual' ? s.billing_amount / 12 : s.billing_amount;
      acc[name] = (acc[name] || 0) + monthly;
    }
    return acc;
  }, {});
  const ccData = Object.entries(byCCRaw).map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }));

  if (isLoading) {
    return <AppLayout title="Tools Dashboard" subtitle="Overview of software subscriptions"><p className="text-muted-foreground p-8">Loading...</p></AppLayout>;
  }

  return (
    <AppLayout title="Tools Dashboard" subtitle="Overview of software & tool subscriptions">
      <div className="space-y-6 animate-fade-in">
        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Active Subscriptions</p><p className="text-3xl font-bold">{active.length}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Monthly Recurring</p><p className="text-3xl font-bold text-primary">{formatCurrency(monthlyTotal)}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Annual Projected</p><p className="text-3xl font-bold">{formatCurrency(monthlyTotal * 12)}</p></CardContent></Card>
          <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Tools</p><p className="text-3xl font-bold">{subs.length}</p></CardContent></Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* By Category */}
          <Card>
            <CardHeader><CardTitle className="text-base">Monthly Cost by Category</CardTitle></CardHeader>
            <CardContent>
              {categoryData.length === 0 ? (
                <p className="text-muted-foreground text-sm py-8 text-center">No active subscriptions</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData} layout="vertical" margin={{ left: 80 }}>
                    <XAxis type="number" tickFormatter={(v) => `$${v}`} />
                    <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* By Business Line */}
          <Card>
            <CardHeader><CardTitle className="text-base">Monthly Cost by Business Line</CardTitle></CardHeader>
            <CardContent>
              {blData.every(d => d.value === 0) ? (
                <p className="text-muted-foreground text-sm py-8 text-center">No active subscriptions</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={blData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${formatCurrency(value)}`}>
                      {blData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* By Call Center */}
        {ccData.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Monthly Cost by Call Center</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ccData}>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default ToolsDashboardPage;
