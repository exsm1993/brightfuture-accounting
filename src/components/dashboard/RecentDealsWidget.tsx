import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDeals } from '@/hooks/useDeals';
import { formatCurrency, formatDate, installers } from '@/data/mockData';
import { Skeleton } from '@/components/ui/skeleton';
import { Database } from 'lucide-react';

export const RecentDealsWidget = () => {
  const { data, isLoading } = useDeals({ limit: 5 });
  const recentDeals = data?.deals ?? [];

  const resolveInstallerName = (installerId: string | null) => {
    if (!installerId) return '—';
    const local = installers.find(i => i.id === installerId);
    if (local) return local.installer_name;
    return installerId;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            Recent Deals
            <Database className="h-3 w-3 text-muted-foreground" />
          </CardTitle>
          <a href="/deals" className="text-sm font-medium text-primary hover:underline">
            View all
          </a>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-3">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentDeals.map((deal) => (
              <a
                key={deal.deal_id}
                href={`/deals/${deal.deal_id}`}
                className="flex items-center justify-between px-6 py-3 hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{deal.customer_name}</p>
                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                      {deal.status || '—'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{deal.deal_id}</span>
                    <span>•</span>
                    <span>{deal.business_line}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {deal.deal_amount > 0 ? formatCurrency(deal.deal_amount) : '—'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {deal.date_created ? formatDate(deal.date_created) : '—'}
                  </p>
                </div>
              </a>
            ))}
            {recentDeals.length === 0 && (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                No deals available
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
