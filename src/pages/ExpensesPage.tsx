import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BusinessLineBadge } from '@/components/ui/BusinessLineBadge';
import { businessLines, getBusinessLineName, getAccountName, getIncentiveTypeName, formatCurrency, formatDate } from '@/data/mockData';
import { usePeople } from '@/hooks/usePeople';
import { useExpenses, useDeleteExpense, ExpenseRecord } from '@/hooks/useExpenses';
import { Search, ArrowUpCircle, RotateCcw, CalendarIcon, X, Pencil, Trash2 } from 'lucide-react';
import { ExpenseFormDialog } from '@/components/forms/ExpenseFormDialog';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const ExpensesPage = () => {
  const { data: people = [] } = usePeople();
  const { data: expenses = [], isLoading } = useExpenses();
  const deleteExpense = useDeleteExpense();
  const [searchTerm, setSearchTerm] = useState('');
  const [businessLineFilter, setBusinessLineFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [personFilter, setPersonFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [editingExpense, setEditingExpense] = useState<ExpenseRecord | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);

  const categories = [...new Set(expenses.map(e => e.category))];

  const getPersonNameById = (id: string): string => {
    return people.find(p => p.id === id)?.name || 'Unknown';
  };

  const filteredTransactions = expenses.filter(transaction => {
    const person = transaction.person_id ? people.find(p => p.id === transaction.person_id) : null;
    const matchesSearch = 
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesBusinessLine = businessLineFilter === 'all' || transaction.business_line_id === businessLineFilter;
    const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
    const matchesPerson = personFilter === 'all' || transaction.person_id === personFilter;
    
    const transactionDate = new Date(transaction.date);
    const matchesStartDate = !startDate || transactionDate >= startDate;
    const matchesEndDate = !endDate || transactionDate <= endDate;

    return matchesSearch && matchesBusinessLine && matchesCategory && matchesPerson && matchesStartDate && matchesEndDate;
  });

  const totalExpenses = filteredTransactions
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const recurringExpenses = filteredTransactions
    .filter(t => t.recurring)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const commissionsTotal = expenses
    .filter(e => e.category === 'Commissions')
    .reduce((s, e) => s + Number(e.amount), 0);

  const marketingTotal = expenses
    .filter(e => e.category === 'Marketing')
    .reduce((s, e) => s + Number(e.amount), 0);

  return (
    <AppLayout 
      title="Expenses" 
      subtitle="Track all operating expenses and costs"
      actions={<ExpenseFormDialog />}
    >
      <div className="space-y-4 animate-fade-in">
        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4 border-l-4 border-l-destructive">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses)}</p>
            <p className="text-xs text-muted-foreground">Filtered total</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Recurring</p>
            <p className="text-2xl font-bold">{formatCurrency(recurringExpenses)}</p>
            <p className="text-xs text-muted-foreground">Monthly fixed</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Commissions</p>
            <p className="text-2xl font-bold">{formatCurrency(commissionsTotal)}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Marketing</p>
            <p className="text-2xl font-bold">{formatCurrency(marketingTotal)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4">
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
            <div className="flex flex-wrap gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[140px] justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "MMM d, yyyy") : "From"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[140px] justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "MMM d, yyyy") : "To"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className="pointer-events-auto" />
                </PopoverContent>
              </Popover>
              {(startDate || endDate) && (
                <Button variant="ghost" size="icon" onClick={() => { setStartDate(undefined); setEndDate(undefined); }} className="h-10 w-10">
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={personFilter} onValueChange={setPersonFilter}>
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="Person" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All People</SelectItem>
                  {people.filter(p => p.active).map(person => (
                    <SelectItem key={person.id} value={person.id}>{person.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={businessLineFilter} onValueChange={setBusinessLineFilter}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Business Line" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Business Lines</SelectItem>
                  {businessLines.map(bl => <SelectItem key={bl.id} value={bl.id}>{bl.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
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
                <TableHead>Notes</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                    <TableCell colSpan={10} className="py-12 text-center">
                     <p className="text-muted-foreground">Loading expenses...</p>
                   </TableCell>
                 </TableRow>
               ) : filteredTransactions.length === 0 ? (
                 <TableRow>
                   <TableCell colSpan={10} className="py-12 text-center">
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
                      {transaction.person_id ? getPersonNameById(transaction.person_id) : '—'}
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
                      -{formatCurrency(Number(transaction.amount))}
                    </TableCell>
                    <TableCell>
                       <StatusBadge status={transaction.status} />
                     </TableCell>
                     <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                       {transaction.notes || '—'}
                     </TableCell>
                     <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingExpense(transaction)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeletingExpenseId(transaction.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        {editingExpense && (
          <ExpenseFormDialog
            expense={editingExpense}
            open={!!editingExpense}
            onOpenChange={(open) => { if (!open) setEditingExpense(null); }}
          />
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deletingExpenseId} onOpenChange={(open) => { if (!open) setDeletingExpenseId(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Expense</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this expense? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  if (deletingExpenseId) {
                    deleteExpense.mutate(deletingExpenseId);
                    setDeletingExpenseId(null);
                  }
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
};

export default ExpensesPage;
