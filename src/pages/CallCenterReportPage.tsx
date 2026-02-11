import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { expenseTransactions, formatCurrency, formatDate, getBusinessLineName, getAccountName } from '@/data/mockData';
import { useCallCenters } from '@/hooks/useCallCenters';
import { usePeople } from '@/hooks/usePeople';
import { ArrowLeft, Phone } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BusinessLineBadge } from '@/components/ui/BusinessLineBadge';

const months = [
  { value: 'all', label: 'All Months' },
  { value: '01', label: 'January' }, { value: '02', label: 'February' },
  { value: '03', label: 'March' }, { value: '04', label: 'April' },
  { value: '05', label: 'May' }, { value: '06', label: 'June' },
  { value: '07', label: 'July' }, { value: '08', label: 'August' },
  { value: '09', label: 'September' }, { value: '10', label: 'October' },
  { value: '11', label: 'November' }, { value: '12', label: 'December' },
];

const years = ['all', '2024', '2025', '2026'];

const CallCenterReportPage = () => {
  const { data: callCenters = [] } = useCallCenters();
  const { data: people = [] } = usePeople();
  const [monthFilter, setMonthFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedCCId, setSelectedCCId] = useState<string | null>(null);

  const categories = [...new Set(expenseTransactions.map(e => e.category))];

  // Filter expenses that have a call_center_id (mock: none yet, but structure is ready)
  // For now, all expenses are included in the report; call_center_id filtering will work once expenses have it
  const filteredExpenses = useMemo(() => {
    return expenseTransactions.filter(exp => {
      const d = new Date(exp.date);
      const matchesMonth = monthFilter === 'all' || String(d.getMonth() + 1).padStart(2, '0') === monthFilter;
      const matchesYear = yearFilter === 'all' || String(d.getFullYear()) === yearFilter;
      const matchesCategory = categoryFilter === 'all' || exp.category === categoryFilter;
      const matchesCC = !selectedCCId || (exp as any).call_center_id === selectedCCId;
      return matchesMonth && matchesYear && matchesCategory && matchesCC;
    });
  }, [monthFilter, yearFilter, categoryFilter, selectedCCId]);

  // Group by call center
  const groupedData = useMemo(() => {
    const map = new Map<string, number>();
    // Add "Unassigned" for expenses without call_center_id
    expenseTransactions.forEach(exp => {
      const d = new Date(exp.date);
      const matchesMonth = monthFilter === 'all' || String(d.getMonth() + 1).padStart(2, '0') === monthFilter;
      const matchesYear = yearFilter === 'all' || String(d.getFullYear()) === yearFilter;
      const matchesCategory = categoryFilter === 'all' || exp.category === categoryFilter;
      if (!matchesMonth || !matchesYear || !matchesCategory) return;

      const ccId = (exp as any).call_center_id || 'unassigned';
      map.set(ccId, (map.get(ccId) || 0) + exp.amount);
    });

    return Array.from(map.entries()).map(([ccId, total]) => {
      const cc = callCenters.find(c => c.id === ccId);
      return {
        id: ccId,
        name: cc?.call_center_name || 'Unassigned',
        type: cc?.type || '—',
        total,
      };
    }).sort((a, b) => b.total - a.total);
  }, [callCenters, monthFilter, yearFilter, categoryFilter]);

  const totalAmount = groupedData.reduce((s, g) => s + g.total, 0);

  const getPersonName = (id?: string) => {
    if (!id) return '—';
    return people.find(p => p.id === id)?.name || id;
  };

  // Drill-down view
  if (selectedCCId) {
    const ccName = callCenters.find(c => c.id === selectedCCId)?.call_center_name || 'Unassigned';
    return (
      <AppLayout
        title={`Expenses: ${ccName}`}
        subtitle="Drill-down view of expenses for this call center"
        actions={
          <Button variant="outline" onClick={() => setSelectedCCId(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" />Back to Report
          </Button>
        }
      >
        <div className="space-y-4 animate-fade-in">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold text-destructive">{formatCurrency(filteredExpenses.reduce((s, e) => s + e.amount, 0))}</p>
          </div>
          <div className="rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Business Line</TableHead>
                  <TableHead>Person</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="py-12 text-center text-muted-foreground">No expenses found</TableCell></TableRow>
                ) : filteredExpenses.map(exp => (
                  <TableRow key={exp.id} className="data-table-row">
                    <TableCell className="text-muted-foreground">{formatDate(exp.date)}</TableCell>
                    <TableCell className="font-medium">{exp.category}</TableCell>
                    <TableCell><BusinessLineBadge businessLine={getBusinessLineName(exp.business_line_id)} /></TableCell>
                    <TableCell className="text-muted-foreground">{getPersonName(exp.person_id)}</TableCell>
                    <TableCell>{getAccountName(exp.account_id)}</TableCell>
                    <TableCell className="font-semibold text-destructive">-{formatCurrency(exp.amount)}</TableCell>
                    <TableCell><StatusBadge status={exp.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Call Center Expenses" subtitle="Expense breakdown by call center">
      <div className="space-y-4 animate-fade-in">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {months.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {years.map(y => <SelectItem key={y} value={y}>{y === 'all' ? 'All Years' : y}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Expenses by Call Center</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={groupedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Total']}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Bar dataKey="total" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Filtered Expenses</p>
          <p className="text-2xl font-bold text-destructive">{formatCurrency(totalAmount)}</p>
        </div>

        {/* Grouped Table */}
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Call Center</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Total Expenses</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedData.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="py-12 text-center">
                  <Phone className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No data</p>
                </TableCell></TableRow>
              ) : groupedData.map(row => (
                <TableRow key={row.id} className="data-table-row cursor-pointer" onClick={() => setSelectedCCId(row.id)}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{row.type}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-destructive">-{formatCurrency(row.total)}</TableCell>
                  <TableCell className="text-right text-xs text-primary hover:underline">View Details →</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
};

export default CallCenterReportPage;
