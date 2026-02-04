import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BusinessLineBadge } from '@/components/ui/BusinessLineBadge';
import { expenseTransactions, businessLines, people, getBusinessLineName, getAccountName, getPersonName, formatCurrency, formatDate } from '@/data/mockData';
import { Plus, Search, ArrowUpCircle, RotateCcw } from 'lucide-react';

const ExpensesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [businessLineFilter, setBusinessLineFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = [...new Set(expenseTransactions.map(e => e.category))];

  const filteredTransactions = expenseTransactions.filter(transaction => {
    const person = transaction.person_id ? people.find(p => p.id === transaction.person_id) : null;
    const matchesSearch = 
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesBusinessLine = businessLineFilter === 'all' || transaction.business_line_id === businessLineFilter;
    const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;

    return matchesSearch && matchesBusinessLine && matchesCategory;
  });

  const totalExpenses = filteredTransactions
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const recurringExpenses = filteredTransactions
    .filter(t => t.recurring)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <AppLayout 
      title="Expenses" 
      subtitle="Track all operating expenses and costs"
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Record Expense
        </Button>
      }
    >
      <div className="space-y-4 animate-fade-in">
        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4 border-l-4 border-l-destructive">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Recurring</p>
            <p className="text-2xl font-bold">{formatCurrency(recurringExpenses)}</p>
            <p className="text-xs text-muted-foreground">Monthly fixed</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Commissions</p>
            <p className="text-2xl font-bold">
              {formatCurrency(expenseTransactions.filter(e => e.category === 'Commissions').reduce((s, e) => s + e.amount, 0))}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Marketing</p>
            <p className="text-2xl font-bold">
              {formatCurrency(expenseTransactions.filter(e => e.category === 'Marketing').reduce((s, e) => s + e.amount, 0))}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={businessLineFilter} onValueChange={setBusinessLineFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Business Line" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Business Lines</SelectItem>
                {businessLines.map(bl => (
                  <SelectItem key={bl.id} value={bl.id}>{bl.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Business Line</TableHead>
                <TableHead>Person</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Recurring</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center">
                    <ArrowUpCircle className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No expense transactions found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="data-table-row">
                    <TableCell className="text-muted-foreground">{formatDate(transaction.date)}</TableCell>
                    <TableCell className="font-medium">{transaction.category}</TableCell>
                    <TableCell>
                      <BusinessLineBadge businessLine={getBusinessLineName(transaction.business_line_id)} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {transaction.person_id ? getPersonName(transaction.person_id) : '—'}
                    </TableCell>
                    <TableCell>{getAccountName(transaction.account_id)}</TableCell>
                    <TableCell>
                      {transaction.recurring ? (
                        <span className="inline-flex items-center gap-1 text-xs text-info">
                          <RotateCcw className="h-3 w-3" />
                          Yes
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">No</span>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold text-destructive">
                      -{formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={transaction.status} />
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

export default ExpensesPage;
