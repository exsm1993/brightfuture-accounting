import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { deals, getBusinessLineName, formatCurrency, formatDate } from '@/data/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BusinessLineBadge } from '@/components/ui/BusinessLineBadge';

export const RecentDealsWidget = () => {
  const recentDeals = [...deals]
    .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Recent Deals</CardTitle>
          <a href="/deals" className="text-sm font-medium text-primary hover:underline">
            View all
          </a>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {recentDeals.map((deal) => (
            <div key={deal.deal_id} className="flex items-center justify-between px-6 py-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{deal.customer_name}</p>
                  <StatusBadge status={deal.status} size="sm" />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono">{deal.deal_id}</span>
                  <span>•</span>
                  <BusinessLineBadge businessLine={getBusinessLineName(deal.business_line_id)} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{formatCurrency(deal.deal_amount)}</p>
                <p className="text-xs text-muted-foreground">{formatDate(deal.date_created)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
