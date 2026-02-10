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
  import { deals } from '@/data/mockData';
  import { useActivePeople } from '@/hooks/usePeople';
 import { Plus } from 'lucide-react';
 import { toast } from 'sonner';
 
 const payableFormSchema = z.object({
   person_id: z.string().min(1, 'Person is required'),
   role: z.string().min(1, 'Role is required'),
   event_type: z.string().min(1, 'Event type is required'),
   total_amount: z.string()
     .min(1, 'Amount is required')
     .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Amount must be a positive number'),
   earned_date: z.string().min(1, 'Earned date is required'),
   pay_schedule: z.string().min(1, 'Pay schedule is required'),
   status: z.string().min(1, 'Status is required'),
   deal_id: z.string().optional(),
 });
 
 type PayableFormValues = z.infer<typeof payableFormSchema>;
 
 interface PayableFormDialogProps {
   trigger?: React.ReactNode;
 }
 
  export const PayableFormDialog = ({ trigger }: PayableFormDialogProps) => {
    const [open, setOpen] = useState(false);
    const { data: activePeopleData = [] } = useActivePeople();
 
   const form = useForm<PayableFormValues>({
     resolver: zodResolver(payableFormSchema),
     defaultValues: {
       person_id: '',
       role: '',
       event_type: 'SIGNED',
       total_amount: '',
       earned_date: new Date().toISOString().split('T')[0],
       pay_schedule: 'FRIDAY',
       status: 'Pending',
       deal_id: '',
     },
   });
 
   // Auto-fill role when person is selected
    const handlePersonChange = (personId: string) => {
      const person = activePeopleData.find(p => p.id === personId);
     if (person) {
       form.setValue('role', person.role);
       // Set pay schedule based on role
       if (person.role === 'call_center') {
         form.setValue('pay_schedule', 'BIWEEKLY');
       } else {
         form.setValue('pay_schedule', 'FRIDAY');
       }
     }
     form.setValue('person_id', personId);
   };
 
   const onSubmit = (data: PayableFormValues) => {
     const newPayable = {
       id: `pay-${Date.now()}`,
       person_id: data.person_id,
       role: data.role,
       event_type: data.event_type,
       total_amount: Number(data.total_amount),
       earned_date: data.earned_date,
       pay_schedule: data.pay_schedule,
       status: data.status,
       deal_id: data.deal_id || undefined,
     };
     // In a real app, this would save to the database
     console.log('New payable:', newPayable);
     toast.success('Commission entry created successfully');
     form.reset();
     setOpen(false);
   };
 
   const activePeople = activePeopleData;
 
   return (
     <Dialog open={open} onOpenChange={setOpen}>
       <DialogTrigger asChild>
         {trigger || (
           <Button variant="outline">
             <Plus className="mr-2 h-4 w-4" />
             Add Payable
           </Button>
         )}
       </DialogTrigger>
       <DialogContent className="sm:max-w-[550px]">
         <DialogHeader>
           <DialogTitle>Add Commission / Bonus</DialogTitle>
           <DialogDescription>
             Create a new payable entry for commissions or bonuses. The pay schedule will be set based on the person's role.
           </DialogDescription>
         </DialogHeader>
         <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
               control={form.control}
               name="person_id"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Person</FormLabel>
                   <Select onValueChange={handlePersonChange} defaultValue={field.value}>
                     <FormControl>
                       <SelectTrigger>
                         <SelectValue placeholder="Select person" />
                       </SelectTrigger>
                     </FormControl>
                     <SelectContent>
                       {activePeople.map((person) => (
                         <SelectItem key={person.id} value={person.id}>
                           {person.name} ({person.role.replace('_', ' ')})
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
                 name="role"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Role</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value}>
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder="Select role" />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         <SelectItem value="closer">Closer</SelectItem>
                         <SelectItem value="setter">Setter</SelectItem>
                         <SelectItem value="team_leader">Team Leader</SelectItem>
                         <SelectItem value="call_center">Call Center</SelectItem>
                       </SelectContent>
                     </Select>
                     <FormMessage />
                   </FormItem>
                 )}
               />
               <FormField
                 control={form.control}
                 name="event_type"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Event Type</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder="Select event" />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         <SelectItem value="SIGNED">Signed</SelectItem>
                         <SelectItem value="INSTALLER_PAYMENT">Installer Payment</SelectItem>
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
 
             <div className="grid grid-cols-2 gap-4">
               <FormField
                 control={form.control}
                 name="total_amount"
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
               <FormField
                 control={form.control}
                 name="earned_date"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Earned Date</FormLabel>
                     <FormControl>
                       <Input type="date" {...field} />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
             </div>
 
             <div className="grid grid-cols-2 gap-4">
               <FormField
                 control={form.control}
                 name="pay_schedule"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Pay Schedule</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value}>
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder="Select schedule" />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         <SelectItem value="FRIDAY">Friday</SelectItem>
                         <SelectItem value="BIWEEKLY">Bi-Weekly</SelectItem>
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
                         <SelectItem value="Pending">Pending</SelectItem>
                         <SelectItem value="Ready">Ready</SelectItem>
                         <SelectItem value="Hold">Hold</SelectItem>
                       </SelectContent>
                     </Select>
                     <FormMessage />
                   </FormItem>
                 )}
               />
             </div>
 
             <div className="flex justify-end gap-3 pt-4">
               <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                 Cancel
               </Button>
               <Button type="submit">Create Payable</Button>
             </div>
           </form>
         </Form>
       </DialogContent>
     </Dialog>
   );
 };