import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { incomeTransactions, expenseTransactions, getBusinessLineName } from '@/data/mockData';

export const PLChartWidget = () => {
  // Aggregate data by business line
  const solarIncome = incomeTransactions
    .filter(t => t.business_line_id === 'bl-1')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const solarExpenses = expenseTransactions
    .filter(t => t.business_line_id === 'bl-1')
    .reduce((sum, t) => sum + t.amount, 0);

  const hiIncome = incomeTransactions
    .filter(t => t.business_line_id === 'bl-2')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const hiExpenses = expenseTransactions
    .filter(t => t.business_line_id === 'bl-2')
    .reduce((sum, t) => sum + t.amount, 0);

  const data = [
    {
      name: 'Solar',
      Revenue: solarIncome,
      Expenses: solarExpenses,
      Net: solarIncome - solarExpenses,
    },
    {
      name: 'Home Improvement',
      Revenue: hiIncome,
      Expenses: hiExpenses,
      Net: hiIncome - hiExpenses,
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Monthly P&L by Business Line</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis 
                className="text-xs" 
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="Revenue" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expenses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
