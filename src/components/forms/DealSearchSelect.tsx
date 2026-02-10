import { useState, useMemo } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDeals } from '@/hooks/useDeals';
import { ChevronsUpDown, Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DealSearchSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const DealSearchSelect = ({ value, onChange, placeholder = 'Select deal (optional)' }: DealSearchSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useDeals({ date_field: 'crc_date', limit: 500 });

  const deals = data?.deals ?? [];

  const filteredDeals = useMemo(() => {
    if (!search) return deals.slice(0, 50);
    const term = search.toLowerCase();
    return deals.filter(d =>
      d.deal_id.toLowerCase().includes(term) ||
      d.customer_name.toLowerCase().includes(term)
    ).slice(0, 50);
  }, [deals, search]);

  const selectedDeal = deals.find(d => d.deal_id === value);

  const displayValue = selectedDeal
    ? `${selectedDeal.deal_id} - ${selectedDeal.customer_name}`
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between font-normal h-10',
            !value && 'text-muted-foreground'
          )}
        >
          <span className="truncate">{displayValue}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="start">
        <div className="flex items-center border-b px-3 py-2">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder="Search by ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 p-0 h-8 focus-visible:ring-0 shadow-none"
          />
        </div>
        <div className="max-h-[250px] overflow-y-auto p-1">
          <button
            type="button"
            className="w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-accent cursor-pointer text-muted-foreground"
            onClick={() => { onChange(''); setOpen(false); setSearch(''); }}
          >
            No deal
          </button>
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Loading deals...</span>
            </div>
          ) : filteredDeals.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No deals found
            </div>
          ) : (
            filteredDeals.map((deal) => (
              <button
                key={deal.deal_id}
                type="button"
                className={cn(
                  'w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-accent cursor-pointer',
                  value === deal.deal_id && 'bg-accent'
                )}
                onClick={() => { onChange(deal.deal_id); setOpen(false); setSearch(''); }}
              >
                <span className="font-mono text-xs text-muted-foreground mr-2">{deal.deal_id}</span>
                <span className="capitalize">{deal.customer_name.toLowerCase()}</span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
