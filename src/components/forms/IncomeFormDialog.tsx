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
 import { businessLines, accounts, deals } from '@/data/mockData';
 import { Plus } from 'lucide-react';
 import { toast } from 'sonner';
 
 const incomeFormSchema = z.object({
   date: z.string().min(1, 'Date is required'),
   amount: z.string().min(1, 'Amount is required').refine(
     (val) => !isNaN(Number(val)) && Number(val) > 0,
     'Amount must be a positive number'
   ),
   source: z.string().min(1, 'Source is required').max(100, 'Source must be less than 100 characters'),
   business_line_id: z.string().min(1, 'Business line is required'),
   account_id: z.string().min(1, 'Account is required'),
   deal_id: z.string().optional(),
   status: z.string().min(1, 'Status is required'),
 });
 
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
       source: '',
       business_line_id: '',
       account_id: '',
       deal_id: '',
       status: 'Completed',
     },
   });
 
   const onSubmit = (data: IncomeFormValues) => {
     // In a real app, this would save to the database
     console.log('Income data:', {
       ...data,
       amount: Number(data.amount),
       deal_id: data.deal_id || undefined,
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
               name="source"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Source</FormLabel>
                   <FormControl>
                     <Input placeholder="e.g., Installer Payment, Referral Bonus" {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
 
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
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                     <FormControl>
                       <SelectTrigger>
                         <SelectValue placeholder="Select deal (optional)" />
                       </SelectTrigger>
                     </FormControl>
                     <SelectContent>
                       <SelectItem value="">No deal</SelectItem>
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