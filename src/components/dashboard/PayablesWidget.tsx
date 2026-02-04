import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  payables, 
  people, 
  deals, 
  getBusinessLineName, 
  formatCurrency,
  formatDate 
} from '@/data/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BusinessLineBadge } from '@/components/ui/BusinessLineBadge';

export const PayablesWidget = () => {
  const outstandingPayables = payables
    .filter(p => p.status === 'Ready' || p.status === 'Pending')
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Outstanding Payables</CardTitle>
          <a href="/payables" className="text-sm font-medium text-primary hover:underline">
            View all
          </a>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {outstandingPayables.map((payable) => {
            const person = people.find(p => p.id === payable.person_id);
            const deal = payable.deal_id ? deals.find(d => d.deal_id === payable.deal_id) : null;
            const businessLine = deal ? getBusinessLineName(deal.business_line_id) : null;

            return (
              <div key={payable.id} className="flex items-center justify-between px-6 py-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{person?.name}</p>
                    <StatusBadge status={payable.status} size="sm" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="capitalize">{payable.role.replace('_', ' ')}</span>
                    <span>•</span>
                    <span>{payable.event_type.replace('_', ' ')}</span>
                    {businessLine && (
                      <>
                        <span>•</span>
                        <BusinessLineBadge businessLine={businessLine} />
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(payable.total_amount)}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(payable.earned_date)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
