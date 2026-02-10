import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
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
import { useDeals } from '@/hooks/useDeals';
import { installers, getInstallerName, formatCurrency, formatDate } from '@/data/mockData';
import { Search, Filter, CalendarIcon, X, Database, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const DealsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [installerFilter, setInstallerFilter] = useState<string>('all');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [campaignFilter, setCampaignFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [dateField, setDateField] = useState<string>('crc_date');

  const { data, isLoading, error } = useDeals({
    search: searchTerm || undefined,
    outcome: statusFilter !== 'all' ? statusFilter : undefined,
    installer_id: installerFilter !== 'all' ? installerFilter : undefined,
    state_id: stateFilter !== 'all' ? stateFilter : undefined,
    campaign: campaignFilter !== 'all' ? campaignFilter : undefined,
    source: sourceFilter !== 'all' ? sourceFilter : undefined,
    date_from: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
    date_to: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
    date_field: dateField,
  });

  const deals = data?.deals ?? [];
  const filterOptions = data?.filterOptions;

  const resolveInstallerName = (installerId: string | null) => {
    if (!installerId) return '—';
    const local = installers.find(i => i.id === installerId);
    if (local) return local.installer_name;
    return installerId;
  };

  return (
    <AppLayout
      title="Deals"
      subtitle="Read-only view from external database"
      actions={
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Database className="h-4 w-4" />
          <span>MySQL Source</span>
        </div>
      }
    >
      <div className="space-y-4 animate-fade-in">
        {/* Filters Row 1 */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by customer or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {/* Date field selector */}
            <Select value={dateField} onValueChange={setDateField}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crc_date">Signed Date</SelectItem>
                <SelectItem value="date_created">Created Date</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[130px] justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "MMM d") : "From"}
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
                    "w-[130px] justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "MMM d") : "To"}
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
          </div>
        </div>

        {/* Filters Row 2 */}
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Outcomes</SelectItem>
              {filterOptions?.outcomes?.map(o => (
                <SelectItem key={o} value={o}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={installerFilter} onValueChange={setInstallerFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Installer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Installers</SelectItem>
              {filterOptions?.installerIds?.map(id => (
                <SelectItem key={id} value={id}>{resolveInstallerName(id)}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {filterOptions?.states?.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={campaignFilter} onValueChange={setCampaignFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              {filterOptions?.campaigns?.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {filterOptions?.sources?.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            Failed to load deals: {error.message}
          </div>
        )}

        {/* Table */}
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Deal ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Business Line</TableHead>
                <TableHead>Installer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Signed Date</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : deals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center">
                    <Filter className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No deals found</p>
                  </TableCell>
                </TableRow>
              ) : (
                deals.map((deal) => (
                  <TableRow
                    key={deal.deal_id}
                    className="data-table-row cursor-pointer"
                    onClick={() => navigate(`/deals/${deal.deal_id}`)}
                  >
                    <TableCell className="font-mono text-sm">{deal.deal_id}</TableCell>
                    <TableCell className="font-medium">{deal.customer_name}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {deal.business_line}
                      </span>
                    </TableCell>
                    <TableCell>{resolveInstallerName(deal.installer_id)}</TableCell>
                    <TableCell className="font-semibold">
                      {deal.deal_amount > 0 ? formatCurrency(deal.deal_amount) : '—'}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
                        {deal.status || '—'}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {deal.date_signed ? formatDate(deal.date_signed) : '—'}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {deal.date_created ? formatDate(deal.date_created) : '—'}
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

export default DealsPage;
