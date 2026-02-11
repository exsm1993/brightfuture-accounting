import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Search, Wrench, MoreHorizontal, Pencil, Trash2, BarChart3 } from 'lucide-react';
import { ToolSubscriptionFormDialog } from '@/components/forms/ToolSubscriptionFormDialog';
import {
  ToolSubscription, useToolsSubscriptions, useDeleteToolSubscription,
} from '@/hooks/useToolsSubscriptions';
import { BusinessLineBadge } from '@/components/ui/BusinessLineBadge';
import { formatCurrency, formatDate } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ToolsSubscriptionsPage = () => {
  const navigate = useNavigate();
  const { data: subs = [], isLoading } = useToolsSubscriptions();
  const deleteMutation = useDeleteToolSubscription();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<ToolSubscription | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subToDelete, setSubToDelete] = useState<ToolSubscription | null>(null);

  const filtered = subs.filter(s => {
    const matchesSearch = s.tool_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.vendor_name ?? '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const activeSubs = subs.filter(s => s.status === 'Active');
  const monthlyTotal = activeSubs.reduce((sum, s) => {
    if (s.billing_frequency === 'Monthly') return sum + s.billing_amount;
    if (s.billing_frequency === 'Annual') return sum + s.billing_amount / 12;
    return sum;
  }, 0);

  const handleDeleteConfirm = async () => {
    if (subToDelete) {
      try {
        await deleteMutation.mutateAsync(subToDelete.id);
        toast.success(`"${subToDelete.tool_name}" deleted`);
      } catch {
        toast.error('Failed to delete');
      }
      setSubToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const uniqueCategories = [...new Set(subs.map(s => s.category))];

  return (
    <AppLayout title="Tools & Subscriptions" subtitle="Manage software and tool subscriptions" actions={<div className="flex gap-2"><Button variant="outline" onClick={() => navigate('/tools/dashboard')}><BarChart3 className="mr-2 h-4 w-4" />Dashboard</Button><ToolSubscriptionFormDialog /></div>}>
      <ToolSubscriptionFormDialog
        subscription={selectedSub}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={() => setSelectedSub(undefined)}
        trigger={<span className="hidden" />}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{subToDelete?.tool_name}"? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-4 animate-fade-in">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Active Subscriptions</p>
            <p className="text-2xl font-bold">{activeSubs.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Monthly Recurring</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(monthlyTotal)}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Annual Projected</p>
            <p className="text-2xl font-bold">{formatCurrency(monthlyTotal * 12)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search tools..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Tool</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Business Line</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={8} className="py-12 text-center text-muted-foreground">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="py-12 text-center">
                  <Wrench className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No subscriptions found</p>
                </TableCell></TableRow>
              ) : filtered.map(sub => (
                <TableRow key={sub.id} className="data-table-row">
                  <TableCell>
                    <div>
                      <p className="font-medium">{sub.tool_name}</p>
                      {sub.vendor_name && <p className="text-xs text-muted-foreground">{sub.vendor_name}</p>}
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{sub.category}</Badge></TableCell>
                  <TableCell>{sub.billing_frequency}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(sub.billing_amount)}</TableCell>
                  <TableCell><BusinessLineBadge businessLine={sub.business_line_allocation} /></TableCell>
                  <TableCell>{sub.next_billing_date ? formatDate(sub.next_billing_date) : '—'}</TableCell>
                  <TableCell>
                    <Badge variant={sub.status === 'Active' ? 'default' : 'secondary'} className={cn(
                      sub.status === 'Active' ? 'bg-success/10 text-success hover:bg-success/20' : 'bg-muted text-muted-foreground'
                    )}>{sub.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedSub(sub); setEditDialogOpen(true); }}>
                          <Pencil className="mr-2 h-4 w-4" />Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSubToDelete(sub); setDeleteDialogOpen(true); }} className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
};

export default ToolsSubscriptionsPage;
