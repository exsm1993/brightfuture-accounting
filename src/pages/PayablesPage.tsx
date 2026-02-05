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
import { Checkbox } from '@/components/ui/checkbox';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { payables, people, deals, getPersonName, formatCurrency, formatDate } from '@/data/mockData';
 import { Search, CheckCircle } from 'lucide-react';
 import { PayableFormDialog } from '@/components/forms/PayableFormDialog';

const PayablesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [scheduleFilter, setScheduleFilter] = useState<string>('all');
  const [selectedPayables, setSelectedPayables] = useState<string[]>([]);

  const filteredPayables = payables.filter(payable => {
    const person = people.find(p => p.id === payable.person_id);
    const matchesSearch = person?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesStatus = statusFilter === 'all' || payable.status === statusFilter;
    const matchesSchedule = scheduleFilter === 'all' || payable.pay_schedule === scheduleFilter;

    return matchesSearch && matchesStatus && matchesSchedule;
  });

  const readyPayables = filteredPayables.filter(p => p.status === 'Ready');
  const totalReadyAmount = readyPayables.reduce((sum, p) => sum + p.total_amount, 0);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPayables(readyPayables.map(p => p.id));
    } else {
      setSelectedPayables([]);
    }
  };

  const handleSelectPayable = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedPayables([...selectedPayables, id]);
    } else {
      setSelectedPayables(selectedPayables.filter(pId => pId !== id));
    }
  };

  const selectedTotal = filteredPayables
    .filter(p => selectedPayables.includes(p.id))
    .reduce((sum, p) => sum + p.total_amount, 0);

  return (
    <AppLayout 
      title="Payables" 
      subtitle="Track commissions and bonuses owed"
      actions={
        <div className="flex gap-2">
          {selectedPayables.length > 0 && (
            <Button variant="default">
              <CheckCircle className="mr-2 h-4 w-4" />
              Pay Selected ({formatCurrency(selectedTotal)})
            </Button>
          )}
          <PayableFormDialog />
        </div>
      }
    >
      <div className="space-y-4 animate-fade-in">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Ready to Pay</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(totalReadyAmount)}</p>
            <p className="text-xs text-muted-foreground">{readyPayables.length} payables</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Friday Payroll</p>
            <p className="text-2xl font-bold">
              {formatCurrency(payables.filter(p => p.pay_schedule === 'FRIDAY' && p.status === 'Ready').reduce((s, p) => s + p.total_amount, 0))}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Bi-Weekly Payroll</p>
            <p className="text-2xl font-bold">
              {formatCurrency(payables.filter(p => p.pay_schedule === 'BIWEEKLY' && p.status === 'Ready').reduce((s, p) => s + p.total_amount, 0))}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-warning">
              {formatCurrency(payables.filter(p => p.status === 'Pending').reduce((s, p) => s + p.total_amount, 0))}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by person..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Ready">Ready</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Hold">Hold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={scheduleFilter} onValueChange={setScheduleFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schedules</SelectItem>
                <SelectItem value="FRIDAY">Friday</SelectItem>
                <SelectItem value="BIWEEKLY">Bi-Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedPayables.length === readyPayables.length && readyPayables.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Person</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Deal</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Earned Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayables.map((payable) => {
                const person = people.find(p => p.id === payable.person_id);
                const deal = payable.deal_id ? deals.find(d => d.deal_id === payable.deal_id) : null;
                const isSelectable = payable.status === 'Ready';

                return (
                  <TableRow key={payable.id} className="data-table-row">
                    <TableCell>
                      <Checkbox 
                        checked={selectedPayables.includes(payable.id)}
                        onCheckedChange={(checked) => handleSelectPayable(payable.id, checked as boolean)}
                        disabled={!isSelectable}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{person?.name || 'Unknown'}</TableCell>
                    <TableCell className="capitalize text-muted-foreground">
                      {payable.role.replace('_', ' ')}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                        payable.event_type === 'SIGNED' 
                          ? 'bg-info/10 text-info' 
                          : 'bg-success/10 text-success'
                      }`}>
                        {payable.event_type.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {deal?.deal_id || '—'}
                    </TableCell>
                    <TableCell className="font-semibold">{formatCurrency(payable.total_amount)}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium ${
                        payable.pay_schedule === 'FRIDAY' ? 'text-primary' : 'text-info'
                      }`}>
                        {payable.pay_schedule === 'FRIDAY' ? 'Friday' : 'Bi-Weekly'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={payable.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(payable.earned_date)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
};

export default PayablesPage;
