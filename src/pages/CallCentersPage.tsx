import { useState } from 'react';
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
import { Search, Phone, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { CallCenterFormDialog } from '@/components/forms/CallCenterFormDialog';
import { CallCenter, useCallCenters, useDeleteCallCenter } from '@/hooks/useCallCenters';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const CallCentersPage = () => {
  const { data: callCenters = [], isLoading } = useCallCenters();
  const deleteMutation = useDeleteCallCenter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCC, setSelectedCC] = useState<CallCenter | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ccToDelete, setCcToDelete] = useState<CallCenter | null>(null);

  const filtered = callCenters.filter(cc => {
    const matchesSearch = cc.call_center_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && cc.active) ||
      (statusFilter === 'inactive' && !cc.active);
    return matchesSearch && matchesStatus;
  });

  const handleDeleteConfirm = async () => {
    if (ccToDelete) {
      try {
        await deleteMutation.mutateAsync(ccToDelete.id);
        toast.success(`"${ccToDelete.call_center_name}" deleted`);
      } catch {
        toast.error('Failed to delete');
      }
      setCcToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <AppLayout title="Call Centers" subtitle="Manage call center records for expense tracking" actions={<CallCenterFormDialog />}>
      <CallCenterFormDialog
        callCenter={selectedCC}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={() => setSelectedCC(undefined)}
        trigger={<span className="hidden" />}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Call Center</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{ccToDelete?.call_center_name}"? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-4 animate-fade-in">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{callCenters.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-success">{callCenters.filter(c => c.active).length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Inactive</p>
            <p className="text-2xl font-bold text-muted-foreground">{callCenters.filter(c => !c.active).length}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search call centers..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="py-12 text-center text-muted-foreground">Loading...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="py-12 text-center">
                  <Phone className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No call centers found</p>
                </TableCell></TableRow>
              ) : filtered.map(cc => (
                <TableRow key={cc.id} className="data-table-row">
                  <TableCell className="font-medium">{cc.call_center_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      cc.type === 'Internal' ? 'border-primary/30 text-primary' : 'border-muted-foreground/30 text-muted-foreground'
                    )}>{cc.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={cc.active ? 'default' : 'secondary'} className={cn(
                      cc.active ? 'bg-success/10 text-success hover:bg-success/20' : 'bg-muted text-muted-foreground'
                    )}>{cc.active ? 'Active' : 'Inactive'}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedCC(cc); setEditDialogOpen(true); }}>
                          <Pencil className="mr-2 h-4 w-4" />Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setCcToDelete(cc); setDeleteDialogOpen(true); }} className="text-destructive focus:text-destructive">
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

export default CallCentersPage;
