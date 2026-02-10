import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useDealDetail } from '@/hooks/useDeals';
import {
  incomeTransactions,
  payables,
  payouts,
  expenseTransactions,
  getPersonName,
  getAccountName,
  formatCurrency,
  formatDate,
} from '@/data/mockData';
import { useInstallerMap } from '@/hooks/useInstallers';
import { ArrowLeft, Database, User, MapPin, DollarSign, Calendar, Phone, Mail } from 'lucide-react';

const DealDetailPage = () => {
  const { dealId } = useParams<{ dealId: string }>();
  const navigate = useNavigate();
  const { data: deal, isLoading, error } = useDealDetail(dealId);
  const { map: installerMap } = useInstallerMap();

  const resolveInstallerName = (installerId: string | null) => {
    if (!installerId) return '—';
    return installerMap.get(installerId) || installerId;
  };

  // Internal records linked by deal_id
  const linkedIncome = incomeTransactions.filter(t => t.deal_id === dealId);
  const linkedPayables = payables.filter(p => p.deal_id === dealId);
  const linkedPayouts = payouts.filter(p => {
    const payable = linkedPayables.find(pa => pa.id === p.payable_id);
    return !!payable;
  });
  const linkedExpenses = expenseTransactions.filter(e => e.deal_id === dealId);

  if (isLoading) {
    return (
      <AppLayout title="Deal Detail" subtitle="Loading...">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </AppLayout>
    );
  }

  if (error || !deal) {
    return (
      <AppLayout title="Deal Not Found" subtitle="">
        <div className="flex flex-col items-center py-12 text-center">
          <p className="text-muted-foreground mb-4">
            {error ? `Error: ${error.message}` : 'Deal not found'}
          </p>
          <Button variant="outline" onClick={() => navigate('/deals')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Deals
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={`Deal #${deal.deal_id}`}
      subtitle={deal.customer_name}
      actions={
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Database className="h-4 w-4" />
            Read-only
          </div>
          <Button variant="outline" onClick={() => navigate('/deals')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
      }
    >
      <div className="space-y-6 animate-fade-in">
        {/* Deal Info Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Customer Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" /> Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Name" value={deal.customer_name} />
              <InfoRow label="Email" value={deal.customer_email} icon={<Mail className="h-3 w-3" />} />
              <InfoRow label="Phone" value={deal.customer_phone} icon={<Phone className="h-3 w-3" />} />
              <InfoRow label="State" value={deal.state_id} icon={<MapPin className="h-3 w-3" />} />
              <InfoRow label="Lead ID" value={deal.lead_id} />
              <InfoRow label="External Project ID" value={deal.external_project_id} />
            </CardContent>
          </Card>

          {/* Deal Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4" /> Deal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Business Line" value={deal.business_line} />
              <InfoRow label="Installer" value={resolveInstallerName(deal.installer_id)} />
              <InfoRow label="Deal Amount" value={deal.deal_amount > 0 ? formatCurrency(deal.deal_amount) : '—'} />
              <InfoRow label="Outcome" value={deal.status} />
              <InfoRow label="Appointment Status" value={deal.appointment_status} />
              <InfoRow label="Source" value={deal.source_system} />
              <InfoRow label="Campaign" value={deal.campaign_name} />
              <InfoRow label="Financier" value={deal.financier} />
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Created" value={deal.date_created ? formatDate(deal.date_created) : null} />
              <InfoRow label="Signed (CRC)" value={deal.date_signed ? formatDate(deal.date_signed) : null} />
              <InfoRow label="Appointment" value={deal.appointment_date ? formatDate(deal.appointment_date) : null} />
              <InfoRow label="Appointment Time" value={deal.appointment_time} />
            </CardContent>
          </Card>

          {/* Team & Property */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Team & Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Setter" value={deal.setter_id} />
              <InfoRow label="Secondary Setter" value={deal.secondary_setter_id} />
              <InfoRow label="Manager" value={deal.manager_id} />
              <InfoRow label="Created By" value={deal.created_by} />
              <InfoRow label="Credit Score" value={deal.credit_score != null ? String(deal.credit_score) : null} />
              <InfoRow label="Bill Amount" value={deal.bill_amount != null ? formatCurrency(deal.bill_amount) : null} />
              <InfoRow label="Roof Age" value={deal.roof_age != null ? String(deal.roof_age) : null} />
              <InfoRow label="Replace Roof" value={deal.replace_roof} />
            </CardContent>
          </Card>
        </div>

        {/* Internal Linked Records */}
        <h2 className="text-lg font-semibold pt-2">Linked Internal Records</h2>

        {/* Income */}
        {linkedIncome.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Income Transactions ({linkedIncome.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {linkedIncome.map(t => (
                    <TableRow key={t.id}>
                      <TableCell>{formatDate(t.date)}</TableCell>
                      <TableCell>{t.income_type}</TableCell>
                      <TableCell>{getAccountName(t.account_id)}</TableCell>
                      <TableCell className="font-semibold text-success">+{formatCurrency(t.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Payables */}
        {linkedPayables.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Payables ({linkedPayables.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Person</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {linkedPayables.map(p => (
                    <TableRow key={p.id}>
                      <TableCell>{getPersonName(p.person_id)}</TableCell>
                      <TableCell className="capitalize">{p.role.replace('_', ' ')}</TableCell>
                      <TableCell>{p.event_type}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(p.total_amount)}</TableCell>
                      <TableCell>{p.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Payouts */}
        {linkedPayouts.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Payouts ({linkedPayouts.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Rail</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {linkedPayouts.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-sm">{p.reference}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(p.amount_paid)}</TableCell>
                      <TableCell>{p.payment_rail}</TableCell>
                      <TableCell>{formatDate(p.paid_date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Expenses */}
        {linkedExpenses.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Expenses ({linkedExpenses.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Person</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {linkedExpenses.map(e => (
                    <TableRow key={e.id}>
                      <TableCell>{formatDate(e.date)}</TableCell>
                      <TableCell>{e.category}</TableCell>
                      <TableCell>{e.person_id ? getPersonName(e.person_id) : '—'}</TableCell>
                      <TableCell className="font-semibold text-destructive">-{formatCurrency(e.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {linkedIncome.length === 0 && linkedPayables.length === 0 && linkedExpenses.length === 0 && (
          <p className="text-sm text-muted-foreground py-4">No internal records linked to this deal yet.</p>
        )}
      </div>
    </AppLayout>
  );
};

const InfoRow = ({ label, value, icon }: { label: string; value: string | null | undefined; icon?: React.ReactNode }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-muted-foreground flex items-center gap-1.5">{icon}{label}</span>
    <span className="font-medium text-right max-w-[60%] truncate">{value || '—'}</span>
  </div>
);

export default DealDetailPage;
