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
 import { BusinessLineBadge } from '@/components/ui/BusinessLineBadge';
import { formatCurrency, incomeTransactions } from '@/data/mockData';
import { useInstallers } from '@/hooks/useInstallers';
import { Loader2 } from 'lucide-react';
import { Search, Building2, Phone, Mail, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
 import { InstallerFormDialog } from '@/components/forms/InstallerFormDialog';
 import { cn } from '@/lib/utils';
import { Installer } from '@/types/finance';
import { toast } from 'sonner';
 
 const InstallersPage = () => {
   const [searchTerm, setSearchTerm] = useState('');
   const [businessLineFilter, setBusinessLineFilter] = useState<string>('all');
   const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedInstaller, setSelectedInstaller] = useState<Installer | undefined>(undefined);
  
  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [installerToDelete, setInstallerToDelete] = useState<Installer | null>(null);

  const { data: installersData, isLoading: installersLoading } = useInstallers();
  const installers = (installersData?.installers ?? []).map(i => ({
    id: i.installer_id,
    installer_name: i.installer_name,
    business_line: 'Solar' as string,
    contact_email: i.contact_email,
    installer_phone: i.installer_phone,
    active: i.active,
    notes: undefined as string | undefined,
  }));
 
   const filteredInstallers = installers.filter(installer => {
     const matchesSearch = 
       installer.installer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       installer.contact_email.toLowerCase().includes(searchTerm.toLowerCase());
     
     const matchesBusinessLine = businessLineFilter === 'all' || 
       installer.business_line === businessLineFilter ||
       installer.business_line === 'Both';
     
     const matchesStatus = statusFilter === 'all' || 
       (statusFilter === 'active' && installer.active) ||
       (statusFilter === 'inactive' && !installer.active);
 
     return matchesSearch && matchesBusinessLine && matchesStatus;
   });
 
   // Calculate income per installer
   const getInstallerIncome = (installerId: string) => {
     return incomeTransactions
       .filter(t => t.installer_id === installerId && t.status === 'Completed')
       .reduce((sum, t) => sum + t.amount, 0);
   };
 
  const handleEdit = (installer: Installer) => {
    setSelectedInstaller(installer);
    setEditDialogOpen(true);
  };

  const handleEditSave = (updatedInstaller: Installer) => {
    // In a real app, this would update the database
    console.log('Updated installer:', updatedInstaller);
    setSelectedInstaller(undefined);
  };

  const handleDeleteClick = (installer: Installer) => {
    setInstallerToDelete(installer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (installerToDelete) {
      // In a real app, this would delete from the database
      console.log('Deleting installer:', installerToDelete.id);
      toast.success(`Installer "${installerToDelete.installer_name}" deleted successfully`);
      setInstallerToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

   return (
     <AppLayout 
       title="Installers" 
       subtitle="Manage installer relationships and track payments"
       actions={<InstallerFormDialog />}
     >
      {/* Edit Dialog */}
      <InstallerFormDialog
        installer={selectedInstaller}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleEditSave}
        trigger={<span className="hidden" />}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Installer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{installerToDelete?.installer_name}"? 
              This action cannot be undone. Existing deals and income records linked to this installer will remain but show "Unknown" as the installer name.
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
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
           <div className="rounded-lg border border-border bg-card p-4">
             <p className="text-sm text-muted-foreground">Total Installers</p>
             <p className="text-2xl font-bold">{installers.length}</p>
           </div>
           <div className="rounded-lg border border-border bg-card p-4">
             <p className="text-sm text-muted-foreground">Active</p>
             <p className="text-2xl font-bold text-success">{installers.filter(i => i.active).length}</p>
           </div>
           <div className="rounded-lg border border-border bg-card p-4">
             <p className="text-sm text-muted-foreground">Solar Installers</p>
             <p className="text-2xl font-bold">{installers.filter(i => i.business_line === 'Solar' || i.business_line === 'Both').length}</p>
           </div>
           <div className="rounded-lg border border-border bg-card p-4">
             <p className="text-sm text-muted-foreground">Home Improvement</p>
             <p className="text-2xl font-bold">{installers.filter(i => i.business_line === 'Home Improvement' || i.business_line === 'Both').length}</p>
           </div>
         </div>
 
         {/* Filters */}
         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
           <div className="relative flex-1 max-w-md">
             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
             <Input
               placeholder="Search installers..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-9"
             />
           </div>
           <div className="flex gap-2">
             <Select value={businessLineFilter} onValueChange={setBusinessLineFilter}>
               <SelectTrigger className="w-[180px]">
                 <SelectValue placeholder="Business Line" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Business Lines</SelectItem>
                 <SelectItem value="Solar">Solar</SelectItem>
                 <SelectItem value="Home Improvement">Home Improvement</SelectItem>
                 <SelectItem value="Both">Both</SelectItem>
               </SelectContent>
             </Select>
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
                 <TableHead>Installer</TableHead>
                 <TableHead>Business Line</TableHead>
                 <TableHead>Contact</TableHead>
                 <TableHead>Total Received</TableHead>
                 <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {filteredInstallers.length === 0 ? (
                 <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center">
                     <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                     <p className="text-muted-foreground">No installers found</p>
                   </TableCell>
                 </TableRow>
               ) : (
                 filteredInstallers.map((installer) => (
                   <TableRow key={installer.id} className="data-table-row">
                     <TableCell>
                       <div>
                         <p className="font-medium">{installer.installer_name}</p>
                         {installer.notes && (
                           <p className="text-xs text-muted-foreground">{installer.notes}</p>
                         )}
                       </div>
                     </TableCell>
                     <TableCell>
                       <BusinessLineBadge businessLine={installer.business_line} />
                     </TableCell>
                     <TableCell>
                       <div className="space-y-1">
                         <div className="flex items-center gap-1 text-sm">
                           <Mail className="h-3 w-3 text-muted-foreground" />
                           <span>{installer.contact_email}</span>
                         </div>
                         <div className="flex items-center gap-1 text-sm text-muted-foreground">
                           <Phone className="h-3 w-3" />
                           <span>{installer.installer_phone}</span>
                         </div>
                       </div>
                     </TableCell>
                     <TableCell className="font-semibold text-success">
                       {formatCurrency(getInstallerIncome(installer.id))}
                     </TableCell>
                     <TableCell>
                       <Badge 
                         variant={installer.active ? 'default' : 'secondary'}
                         className={cn(
                           installer.active 
                             ? 'bg-success/10 text-success hover:bg-success/20' 
                             : 'bg-muted text-muted-foreground'
                         )}
                       >
                         {installer.active ? 'Active' : 'Inactive'}
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
                        <DropdownMenuItem onClick={() => handleEdit(installer as unknown as Installer)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(installer as unknown as Installer)}
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
 
 export default InstallersPage;