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
 import { Textarea } from '@/components/ui/textarea';
 import { Button } from '@/components/ui/button';
 import { Switch } from '@/components/ui/switch';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import { Plus } from 'lucide-react';
 import { toast } from 'sonner';
 
 const installerFormSchema = z.object({
   installer_name: z.string()
     .min(1, 'Installer name is required')
     .max(100, 'Name must be less than 100 characters')
     .trim(),
   business_line: z.enum(['Solar', 'Home Improvement', 'Both'], {
     required_error: 'Business line is required',
   }),
   contact_email: z.string()
     .min(1, 'Email is required')
     .email('Invalid email address'),
   installer_phone: z.string()
     .min(1, 'Phone is required')
     .max(20, 'Phone must be less than 20 characters'),
   active: z.boolean(),
   notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
 });
 
 type InstallerFormValues = z.infer<typeof installerFormSchema>;
 
 interface InstallerFormDialogProps {
   trigger?: React.ReactNode;
 }
 
 export const InstallerFormDialog = ({ trigger }: InstallerFormDialogProps) => {
   const [open, setOpen] = useState(false);
 
   const form = useForm<InstallerFormValues>({
     resolver: zodResolver(installerFormSchema),
     defaultValues: {
       installer_name: '',
       business_line: undefined,
       contact_email: '',
       installer_phone: '',
       active: true,
       notes: '',
     },
   });
 
   const onSubmit = (data: InstallerFormValues) => {
     const newInstaller = {
       id: `inst-${Date.now()}`,
       ...data,
       notes: data.notes || undefined,
     };
     console.log('New installer:', newInstaller);
     toast.success(`Installer "${data.installer_name}" created successfully`);
     form.reset();
     setOpen(false);
   };
 
   return (
     <Dialog open={open} onOpenChange={setOpen}>
       <DialogTrigger asChild>
         {trigger || (
           <Button>
             <Plus className="mr-2 h-4 w-4" />
             Add Installer
           </Button>
         )}
       </DialogTrigger>
       <DialogContent className="sm:max-w-[500px]">
         <DialogHeader>
           <DialogTitle>Add Installer</DialogTitle>
           <DialogDescription>
             Add a new installer to the system. Installers can be linked to deals and income.
           </DialogDescription>
         </DialogHeader>
         <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
               control={form.control}
               name="installer_name"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Installer Name</FormLabel>
                   <FormControl>
                     <Input placeholder="e.g., SunPower Pro" {...field} />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
 
             <FormField
               control={form.control}
               name="business_line"
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
                       <SelectItem value="Solar">Solar</SelectItem>
                       <SelectItem value="Home Improvement">Home Improvement</SelectItem>
                       <SelectItem value="Both">Both</SelectItem>
                     </SelectContent>
                   </Select>
                   <FormMessage />
                 </FormItem>
               )}
             />
 
             <div className="grid grid-cols-2 gap-4">
               <FormField
                 control={form.control}
                 name="contact_email"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Contact Email</FormLabel>
                     <FormControl>
                       <Input type="email" placeholder="contact@example.com" {...field} />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
               <FormField
                 control={form.control}
                 name="installer_phone"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Phone</FormLabel>
                     <FormControl>
                       <Input placeholder="555-0100" {...field} />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
             </div>
 
             <FormField
               control={form.control}
               name="notes"
               render={({ field }) => (
                 <FormItem>
                   <FormLabel>Notes (Optional)</FormLabel>
                   <FormControl>
                     <Textarea 
                       placeholder="Any additional notes about this installer..."
                       className="resize-none"
                       {...field}
                     />
                   </FormControl>
                   <FormMessage />
                 </FormItem>
               )}
             />
 
             <FormField
               control={form.control}
               name="active"
               render={({ field }) => (
                 <FormItem className="flex items-center justify-between rounded-lg border p-3">
                   <div className="space-y-0.5">
                     <FormLabel>Active Status</FormLabel>
                     <p className="text-sm text-muted-foreground">
                       Inactive installers won't appear in deal/income forms
                     </p>
                   </div>
                   <FormControl>
                     <Switch
                       checked={field.value}
                       onCheckedChange={field.onChange}
                     />
                   </FormControl>
                 </FormItem>
               )}
             />
 
             <div className="flex justify-end gap-3 pt-4">
               <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                 Cancel
               </Button>
               <Button type="submit">Add Installer</Button>
             </div>
           </form>
         </Form>
       </DialogContent>
     </Dialog>
   );
 };