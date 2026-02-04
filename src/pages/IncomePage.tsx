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
import { incomeTransactions, deals, businessLines, accounts, getBusinessLineName, getAccountName, formatCurrency, formatDate } from '@/data/mockData';
import { Plus, Search, ArrowDownCircle } from 'lucide-react';

const IncomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [businessLineFilter, setBusinessLineFilter] = useState<string>('all');

  const filteredTransactions = incomeTransactions.filter(transaction => {
    const deal = transaction.deal_id ? deals.find(d => d.deal_id === transaction.deal_id) : null;
    const matchesSearch = 
      deal?.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.deal_id?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesBusinessLine = businessLineFilter === 'all' || transaction.business_line_id === businessLineFilter;

    return matchesSearch && matchesBusinessLine;
  });

  const totalIncome = filteredTransactions
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <AppLayout 
      title="Income" 
      subtitle="Track all incoming payments and revenue"
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Record Income
        </Button>
      }
    >
      <div className="space-y-4 animate-fade-in">
        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4 border-l-4 border-l-success">
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-2xl font-bold text-success">{formatCurrency(totalIncome)}</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Solar Revenue</p>
            <p className="text-2xl font-bold">
              {formatCurrency(incomeTransactions.filter(t => t.business_line_id === 'bl-1').reduce((s, t) => s + t.amount, 0))}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Home Improvement</p>
            <p className="text-2xl font-bold">
              {formatCurrency(incomeTransactions.filter(t => t.business_line_id === 'bl-2').reduce((s, t) => s + t.amount, 0))}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search income..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
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

        {/* Table */}
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Deal</TableHead>
                <TableHead>Business Line</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center">
                    <ArrowDownCircle className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No income transactions found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="data-table-row">
                    <TableCell className="text-muted-foreground">{formatDate(transaction.date)}</TableCell>
                    <TableCell className="font-medium">{transaction.source}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {transaction.deal_id || '—'}
                    </TableCell>
                    <TableCell>
                      <BusinessLineBadge businessLine={getBusinessLineName(transaction.business_line_id)} />
                    </TableCell>
                    <TableCell>{getAccountName(transaction.account_id)}</TableCell>
                    <TableCell className="font-semibold text-success">
                      +{formatCurrency(transaction.amount)}
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

export default IncomePage;
