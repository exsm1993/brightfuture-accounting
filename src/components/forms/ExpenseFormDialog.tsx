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
 import { Switch } from '@/components/ui/switch';
 import { businessLines, accounts, people, deals } from '@/data/mockData';
 import { Plus } from 'lucide-react';
 import { toast } from 'sonner';
 
 const expenseCategories = [
   'Commissions',
   'Marketing',
   'Office Rent',
   'Software',
   'Utilities',
   'Travel',
   'Equipment',
   'Payroll',
   'Insurance',
   'Other',
 ];
 
 const expenseFormSchema = z.object({
   date: z.string().min(1, 'Date is required'),
   amount: z.string().min(1, 'Amount is required').refine(
     (val) => !isNaN(Number(val)) && Number(val) > 0,
     'Amount must be a positive number'
   ),
   category: z.string().min(1, 'Category is required'),
   business_line_id: z.string().min(1, 'Business line is required'),
   account_id: z.string().min(1, 'Account is required'),
   person_id: z.string().optional(),
   deal_id: z.string().optional(),
   recurring: z.boolean(),
   status: z.string().min(1, 'Status is required'),
 });
 
 type ExpenseFormValues = z.infer<typeof expenseFormSchema>;
 
 interface ExpenseFormDialogProps {
   trigger?: React.ReactNode;
 }
 
 export const ExpenseFormDialog = ({ trigger }: ExpenseFormDialogProps) => {
   const [open, setOpen] = useState(false);
 
   const form = useForm<ExpenseFormValues>({
     resolver: zodResolver(expenseFormSchema),
     defaultValues: {
       date: new Date().toISOString().split('T')[0],
       amount: '',
       category: '',
       business_line_id: '',
       account_id: '',
       person_id: '',
       deal_id: '',
       recurring: false,
       status: 'Completed',
     },
   });
 
   const onSubmit = (data: ExpenseFormValues) => {
     // In a real app, this would save to the database
     console.log('Expense data:', {
       ...data,
       amount: Number(data.amount),
       person_id: data.person_id || undefined,
       deal_id: data.deal_id || undefined,
     });
     toast.success('Expense recorded successfully');
     form.reset();
     setOpen(false);
   };
 
   return (
     <Dialog open={open} onOpenChange={setOpen}>
       <DialogTrigger asChild>
         {trigger || (
           <Button>
             <Plus className="mr-2 h-4 w-4" />
             Record Expense
           </Button>
         )}
       </DialogTrigger>
       <DialogContent className="sm:max-w-[500px]">
         <DialogHeader>
           <DialogTitle>Record Expense</DialogTitle>
           <DialogDescription>
             Add a new expense transaction to the system.
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
               name="category"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Category</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                     <FormControl>
                       <SelectTrigger>
                         <SelectValue placeholder="Select category" />
                       </SelectTrigger>
                     </FormControl>
                     <SelectContent>
                       {expenseCategories.map((cat) => (
                         <SelectItem key={cat} value={cat}>
                           {cat}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
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
               name="person_id"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Person (Optional)</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value === "none" ? "" : value)} defaultValue={field.value || "none"}>
                     <FormControl>
                       <SelectTrigger>
                         <SelectValue placeholder="Select person (optional)" />
                       </SelectTrigger>
                     </FormControl>
                     <SelectContent>
                      <SelectItem value="none">No person</SelectItem>
                       {people.filter(p => p.active).map((person) => (
                         <SelectItem key={person.id} value={person.id}>
                           {person.name} ({person.role})
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
 
             <div className="grid grid-cols-2 gap-4">
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
               <FormField
                 control={form.control}
                 name="recurring"
                 render={({ field }) => (
                   <FormItem className="flex flex-col justify-end">
                     <FormLabel>Recurring Expense</FormLabel>
                     <div className="flex items-center gap-2 h-10">
                       <FormControl>
                         <Switch
                           checked={field.value}
                           onCheckedChange={field.onChange}
                         />
                       </FormControl>
                       <span className="text-sm text-muted-foreground">
                         {field.value ? 'Yes' : 'No'}
                       </span>
                     </div>
                     <FormMessage />
                   </FormItem>
                 )}
               />
             </div>
 
             <div className="flex justify-end gap-3 pt-4">
               <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                 Cancel
               </Button>
               <Button type="submit">Save Expense</Button>
             </div>
           </form>
         </Form>
       </DialogContent>
     </Dialog>
   );
 };