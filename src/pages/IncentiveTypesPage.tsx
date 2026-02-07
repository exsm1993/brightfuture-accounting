import { useState } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { incentiveTypes, expenseTransactions } from '@/data/mockData';
import { Search, Tags, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { IncentiveTypeFormDialog } from '@/components/forms/IncentiveTypeFormDialog';
import { cn } from '@/lib/utils';
import { IncentiveType } from '@/types/finance';
import { toast } from 'sonner';

const IncentiveTypesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedIncentiveType, setSelectedIncentiveType] = useState<IncentiveType | undefined>(undefined);

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [incentiveTypeToDelete, setIncentiveTypeToDelete] = useState<IncentiveType | null>(null);

  const filteredIncentiveTypes = incentiveTypes.filter(type => {
    const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && type.active) ||
      (statusFilter === 'inactive' && !type.active);

    return matchesSearch && matchesStatus;
  });

  // Count expenses per incentive type
  const getExpenseCount = (typeId: string) => {
    return expenseTransactions.filter(e => e.incentive_type_id === typeId).length;
  };

  const handleEdit = (type: IncentiveType) => {
    setSelectedIncentiveType(type);
    setEditDialogOpen(true);
  };

  const handleEditSave = (updatedType: IncentiveType) => {
    // In a real app, this would update the database
    console.log('Updated incentive type:', updatedType);
    setSelectedIncentiveType(undefined);
  };

  const handleDeleteClick = (type: IncentiveType) => {
    setIncentiveTypeToDelete(type);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (incentiveTypeToDelete) {
      // In a real app, this would delete from the database
      console.log('Deleting incentive type:', incentiveTypeToDelete.id);
      toast.success(`Incentive type "${incentiveTypeToDelete.name}" deleted successfully`);
      setIncentiveTypeToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <AppLayout
      title="Incentive Types"
      subtitle="Manage incentive type options for expense categorization"
      actions={<IncentiveTypeFormDialog />}
    >
      {/* Edit Dialog */}
      <IncentiveTypeFormDialog
        incentiveType={selectedIncentiveType}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleEditSave}
        trigger={<span className="hidden" />}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Incentive Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{incentiveTypeToDelete?.name}"?
              This action cannot be undone. Existing expense records using this type will show "—" for incentive type.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-4 animate-fade-in">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Types</p>
            <p className="text-2xl font-bold">{incentiveTypes.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-success">{incentiveTypes.filter(t => t.active).length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Inactive</p>
            <p className="text-2xl font-bold text-muted-foreground">{incentiveTypes.filter(t => !t.active).length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search incentive types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Expenses Count</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncentiveTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-12 text-center">
                    <Tags className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No incentive types found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredIncentiveTypes.map((type) => (
                  <TableRow key={type.id} className="data-table-row">
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {getExpenseCount(type.id)} expenses
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={type.active ? 'default' : 'secondary'}
                        className={cn(
                          type.active
                            ? 'bg-success/10 text-success hover:bg-success/20'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {type.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(type)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(type)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

export default IncentiveTypesPage;
