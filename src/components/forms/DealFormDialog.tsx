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
 import { businessLines } from '@/data/mockData';
 import { Plus } from 'lucide-react';
 import { toast } from 'sonner';
 
 const dealFormSchema = z.object({
   customer_name: z.string()
     .min(1, 'Customer name is required')
     .max(100, 'Customer name must be less than 100 characters')
     .trim(),
   deal_amount: z.string()
     .min(1, 'Deal amount is required')
     .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Amount must be a positive number'),
   installer: z.string()
     .min(1, 'Installer is required')
     .max(100, 'Installer name must be less than 100 characters')
     .trim(),
   business_line_id: z.string().min(1, 'Business line is required'),
   system_or_type_of_work: z.string()
     .min(1, 'Type of work is required')
     .max(200, 'Type of work must be less than 200 characters')
     .trim(),
   source_system: z.string().min(1, 'Source system is required'),
   status: z.string().min(1, 'Status is required'),
 });
 
 type DealFormValues = z.infer<typeof dealFormSchema>;
 
 interface DealFormDialogProps {
   trigger?: React.ReactNode;
 }
 
 export const DealFormDialog = ({ trigger }: DealFormDialogProps) => {
   const [open, setOpen] = useState(false);
 
   const form = useForm<DealFormValues>({
     resolver: zodResolver(dealFormSchema),
     defaultValues: {
       customer_name: '',
       deal_amount: '',
       installer: '',
       business_line_id: '',
       system_or_type_of_work: '',
       source_system: 'Manual',
       status: 'Signed',
     },
   });
 
   const generateDealId = () => {
     const year = new Date().getFullYear();
     const random = Math.floor(Math.random() * 900) + 100;
     return `D-${year}-${random}`;
   };
 
   const onSubmit = (data: DealFormValues) => {
     const newDeal = {
       deal_id: generateDealId(),
       date_created: new Date().toISOString().split('T')[0],
       customer_name: data.customer_name,
       deal_amount: Number(data.deal_amount),
       installer: data.installer,
       business_line_id: data.business_line_id,
       system_or_type_of_work: data.system_or_type_of_work,
       source_system: data.source_system,
       status: data.status,
     };
     // In a real app, this would save to the database
     console.log('New deal:', newDeal);
     toast.success(`Deal ${newDeal.deal_id} created successfully`);
     form.reset();
     setOpen(false);
   };
 
   return (
     <Dialog open={open} onOpenChange={setOpen}>
       <DialogTrigger asChild>
         {trigger || (
           <Button>
             <Plus className="mr-2 h-4 w-4" />
             New Deal
           </Button>
         )}
       </DialogTrigger>
       <DialogContent className="sm:max-w-[550px]">
         <DialogHeader>
           <DialogTitle>Create New Deal</DialogTitle>
           <DialogDescription>
             Add a new deal to the system. A unique Deal ID will be generated automatically.
           </DialogDescription>
         </DialogHeader>
         <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
               control={form.control}
               name="customer_name"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Customer Name</FormLabel>
                   <FormControl>
                     <Input placeholder="e.g., John & Jane Smith" {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
 
             <div className="grid grid-cols-2 gap-4">
               <FormField
                 control={form.control}
                 name="deal_amount"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Deal Amount ($)</FormLabel>
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
             </div>
 
             <FormField
               control={form.control}
               name="installer"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Installer</FormLabel>
                   <FormControl>
                     <Input placeholder="e.g., SunPower Pro, Premium Renovations" {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
 
             <FormField
               control={form.control}
               name="system_or_type_of_work"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>System / Type of Work</FormLabel>
                   <FormControl>
                     <Input placeholder="e.g., 12kW Solar System, Kitchen Remodel" {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
 
             <div className="grid grid-cols-2 gap-4">
               <FormField
                 control={form.control}
                 name="source_system"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Source System</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder="Select source" />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         <SelectItem value="Manual">Manual</SelectItem>
                         <SelectItem value="Initiate365">Initiate365</SelectItem>
                         <SelectItem value="Flowspot">Flowspot</SelectItem>
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
                         <SelectItem value="Signed">Signed</SelectItem>
                         <SelectItem value="In Progress">In Progress</SelectItem>
                         <SelectItem value="Completed">Completed</SelectItem>
                         <SelectItem value="Cancelled">Cancelled</SelectItem>
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
               <Button type="submit">Create Deal</Button>
             </div>
           </form>
         </Form>
       </DialogContent>
     </Dialog>
   );
 };