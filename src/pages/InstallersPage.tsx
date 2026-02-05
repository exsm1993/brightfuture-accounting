 import { useState } from 'react';
 import { AppLayout } from '@/components/layout/AppLayout';
 import { Input } from '@/components/ui/input';
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
 import { Badge } from '@/components/ui/badge';
 import { BusinessLineBadge } from '@/components/ui/BusinessLineBadge';
 import { installers, formatCurrency, incomeTransactions, getInstallerName } from '@/data/mockData';
 import { Search, Building2, Phone, Mail } from 'lucide-react';
 import { InstallerFormDialog } from '@/components/forms/InstallerFormDialog';
 import { cn } from '@/lib/utils';
 
 const InstallersPage = () => {
   const [searchTerm, setSearchTerm] = useState('');
   const [businessLineFilter, setBusinessLineFilter] = useState<string>('all');
   const [statusFilter, setStatusFilter] = useState<string>('all');
 
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
 
   return (
     <AppLayout 
       title="Installers" 
       subtitle="Manage installer relationships and track payments"
       actions={<InstallerFormDialog />}
     >
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
               </TableRow>
             </TableHeader>
             <TableBody>
               {filteredInstallers.length === 0 ? (
                 <TableRow>
                   <TableCell colSpan={5} className="py-12 text-center">
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