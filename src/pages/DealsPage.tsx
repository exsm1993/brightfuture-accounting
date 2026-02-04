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
import { deals, businessLines, getBusinessLineName, formatCurrency, formatDate } from '@/data/mockData';
import { Plus, Search, Filter } from 'lucide-react';

const DealsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [businessLineFilter, setBusinessLineFilter] = useState<string>('all');

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = 
      deal.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.deal_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.installer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || deal.status === statusFilter;
    const matchesBusinessLine = businessLineFilter === 'all' || deal.business_line_id === businessLineFilter;

    return matchesSearch && matchesStatus && matchesBusinessLine;
  });

  return (
    <AppLayout 
      title="Deals" 
      subtitle="Manage all deals across business lines"
      actions={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Deal
        </Button>
      }
    >
      <div className="space-y-4 animate-fade-in">
        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Signed">Signed</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
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
                <TableHead>Deal ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Business Line</TableHead>
                <TableHead>Type of Work</TableHead>
                <TableHead>Installer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.map((deal) => (
                <TableRow key={deal.deal_id} className="data-table-row cursor-pointer">
                  <TableCell className="font-mono text-sm">{deal.deal_id}</TableCell>
                  <TableCell className="font-medium">{deal.customer_name}</TableCell>
                  <TableCell>
                    <BusinessLineBadge businessLine={getBusinessLineName(deal.business_line_id)} />
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{deal.system_or_type_of_work}</TableCell>
                  <TableCell>{deal.installer}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(deal.deal_amount)}</TableCell>
                  <TableCell>
                    <StatusBadge status={deal.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(deal.date_created)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredDeals.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Filter className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No deals found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default DealsPage;
