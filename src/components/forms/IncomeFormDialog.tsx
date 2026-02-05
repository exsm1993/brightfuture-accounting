 import { useState } from 'react';
 import { useForm } from 'react-hook-form';
 import { zodResolver } from '@hookform/resolvers/zod';
 import { z } from 'zod';
 import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
 } from '@/components/ui/dialog';
 import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
 } from '@/components/ui/form';
 import { Input } from '@/components/ui/input';
 import { Button } from '@/components/ui/button';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
import { businessLines, accounts, deals, installers } from '@/data/mockData';
 import { Plus } from 'lucide-react';
 import { toast } from 'sonner';
 
 const incomeFormSchema = z.object({
   date: z.string().min(1, 'Date is required'),
   amount: z.string().min(1, 'Amount is required').refine(
     (val) => !isNaN(Number(val)) && Number(val) > 0,
     'Amount must be a positive number'
   ),
  income_type: z.enum(['Installer Payment', 'Other Income'], {
    required_error: 'Income type is required',
  }),
  installer_id: z.string().optional(),
  source_description: z.string().max(200, 'Description must be less than 200 characters').optional(),
   business_line_id: z.string().min(1, 'Business line is required'),
   account_id: z.string().min(1, 'Account is required'),
   deal_id: z.string().optional(),
   status: z.string().min(1, 'Status is required'),
}).refine(
  (data) => {
    if (data.income_type === 'Installer Payment' && !data.installer_id) {
      return false;
    }
    return true;
  },
  {
    message: 'Installer is required for Installer Payment',
    path: ['installer_id'],
  }
);
 
 type IncomeFormValues = z.infer<typeof incomeFormSchema>;
 
 interface IncomeFormDialogProps {
   trigger?: React.ReactNode;
 }
 
 export const IncomeFormDialog = ({ trigger }: IncomeFormDialogProps) => {
   const [open, setOpen] = useState(false);
 
   const form = useForm<IncomeFormValues>({
     resolver: zodResolver(incomeFormSchema),
     defaultValues: {
       date: new Date().toISOString().split('T')[0],
       amount: '',
      income_type: 'Installer Payment',
      installer_id: '',
      source_description: '',
       business_line_id: '',
       account_id: '',
       deal_id: '',
       status: 'Completed',
     },
   });
 
  const incomeType = form.watch('income_type');
  const selectedBusinessLine = form.watch('business_line_id');

  // Filter installers based on selected business line
  const filteredInstallers = installers.filter(inst => {
    if (!inst.active) return false;
    if (!selectedBusinessLine) return true;
    const blName = businessLines.find(bl => bl.id === selectedBusinessLine)?.name;
    return inst.business_line === 'Both' || inst.business_line === blName;
  });

   const onSubmit = (data: IncomeFormValues) => {
     // In a real app, this would save to the database
     console.log('Income data:', {
       ...data,
       amount: Number(data.amount),
       deal_id: data.deal_id || undefined,
      installer_id: data.income_type === 'Installer Payment' ? data.installer_id : undefined,
      source_description: data.income_type === 'Other Income' ? data.source_description : undefined,
     });
     toast.success('Income recorded successfully');
     form.reset();
     setOpen(false);
   };
 
   return (
     <Dialog open={open} onOpenChange={setOpen}>
       <DialogTrigger asChild>
         {trigger || (
           <Button>
             <Plus className="mr-2 h-4 w-4" />
             Record Income
           </Button>
         )}
       </DialogTrigger>
       <DialogContent className="sm:max-w-[500px]">
         <DialogHeader>
           <DialogTitle>Record Income</DialogTitle>
           <DialogDescription>
             Add a new income transaction to the system.
           </DialogDescription>
         </DialogHeader>
         <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
               <FormField
                 control={form.control}
                 name="date"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Date</FormLabel>
                     <FormControl>
                       <Input type="date" {...field} />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
               <FormField
                 control={form.control}
                 name="amount"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Amount ($)</FormLabel>
                     <FormControl>
                       <Input
                         type="number"
                         step="0.01"
                         min="0"
                         placeholder="0.00"
                         {...field}
                       />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
             </div>
 
             <FormField
               control={form.control}
              name="income_type"
               render={({ field }) => (
                 <FormItem>
                  <FormLabel>Income Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select income type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Installer Payment">Installer Payment</SelectItem>
                      <SelectItem value="Other Income">Other Income</SelectItem>
                    </SelectContent>
                  </Select>
                   <FormMessage />
                 </FormItem>
               )}
             />
 
            {incomeType === 'Installer Payment' && (
              <FormField
                control={form.control}
                name="installer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Installer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select installer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredInstallers.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No installers available
                          </SelectItem>
                        ) : (
                          filteredInstallers.map((inst) => (
                            <SelectItem key={inst.id} value={inst.id}>
                              {inst.installer_name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {incomeType === 'Other Income' && (
              <FormField
                control={form.control}
                name="source_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Description</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Referral Bonus, Investment Return" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

             <div className="grid grid-cols-2 gap-4">
               <FormField
                 control={form.control}
                 name="business_line_id"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Business Line</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder="Select business line" />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         {businessLines.map((bl) => (
                           <SelectItem key={bl.id} value={bl.id}>
                             {bl.name}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     <FormMessage />
                   </FormItem>
                 )}
               />
               <FormField
                 control={form.control}
                 name="account_id"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Account</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder="Select account" />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         {accounts.map((acc) => (
                           <SelectItem key={acc.id} value={acc.id}>
                             {acc.name}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     <FormMessage />
                   </FormItem>
                 )}
               />
             </div>
 
             <FormField
               control={form.control}
               name="deal_id"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Associated Deal (Optional)</FormLabel>
                   <Select onValueChange={(value) => field.onChange(value === "none" ? "" : value)} defaultValue={field.value || "none"}>
                     <FormControl>
                       <SelectTrigger>
                         <SelectValue placeholder="Select deal (optional)" />
                       </SelectTrigger>
                     </FormControl>
                     <SelectContent>
                       <SelectItem value="none">No deal</SelectItem>
                       {deals.map((deal) => (
                         <SelectItem key={deal.deal_id} value={deal.deal_id}>
                           {deal.deal_id} - {deal.customer_name}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                   <FormMessage />
                 </FormItem>
               )}
             />
 
             <FormField
               control={form.control}
               name="status"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Status</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                     <FormControl>
                       <SelectTrigger>
                         <SelectValue placeholder="Select status" />
                       </SelectTrigger>
                     </FormControl>
                     <SelectContent>
                       <SelectItem value="Completed">Completed</SelectItem>
                       <SelectItem value="Pending">Pending</SelectItem>
                       <SelectItem value="Failed">Failed</SelectItem>
                     </SelectContent>
                   </Select>
                   <FormMessage />
                 </FormItem>
               )}
             />
 
             <div className="flex justify-end gap-3 pt-4">
               <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                 Cancel
               </Button>
               <Button type="submit">Save Income</Button>
             </div>
           </form>
         </Form>
       </DialogContent>
     </Dialog>
   );
 };