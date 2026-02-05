import { useState, useEffect } from 'react';
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
import { Installer } from '@/types/finance';
 
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
  installer?: Installer;
  onSave?: (installer: Installer) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
 }
 
export const InstallerFormDialog = ({ 
  trigger, 
  installer, 
  onSave,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: InstallerFormDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const isEditMode = !!installer;
 
   const form = useForm<InstallerFormValues>({
     resolver: zodResolver(installerFormSchema),
     defaultValues: {
      installer_name: installer?.installer_name || '',
      business_line: installer?.business_line,
      contact_email: installer?.contact_email || '',
      installer_phone: installer?.installer_phone || '',
      active: installer?.active ?? true,
      notes: installer?.notes || '',
     },
   });
 
  // Reset form when installer changes
  useEffect(() => {
    if (installer) {
      form.reset({
        installer_name: installer.installer_name,
        business_line: installer.business_line,
        contact_email: installer.contact_email,
        installer_phone: installer.installer_phone,
        active: installer.active,
        notes: installer.notes || '',
      });
    } else {
      form.reset({
        installer_name: '',
        business_line: undefined,
        contact_email: '',
        installer_phone: '',
        active: true,
        notes: '',
      });
    }
  }, [installer, form]);

   const onSubmit = (data: InstallerFormValues) => {
    const savedInstaller = {
      id: installer?.id || `inst-${Date.now()}`,
      installer_name: data.installer_name,
      business_line: data.business_line,
      contact_email: data.contact_email,
      installer_phone: data.installer_phone,
      active: data.active,
      notes: data.notes || undefined,
    } as Installer;
    
    if (onSave) {
      onSave(savedInstaller);
    } else {
      console.log(isEditMode ? 'Updated installer:' : 'New installer:', savedInstaller);
    }
    
    toast.success(`Installer "${data.installer_name}" ${isEditMode ? 'updated' : 'created'} successfully`);
    if (!isControlled) {
      form.reset();
    }
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
          <DialogTitle>{isEditMode ? 'Edit Installer' : 'Add Installer'}</DialogTitle>
           <DialogDescription>
            {isEditMode 
              ? 'Update installer details. Changes will be reflected across all linked deals and income.'
              : 'Add a new installer to the system. Installers can be linked to deals and income.'}
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
              <Button type="submit">{isEditMode ? 'Save Changes' : 'Add Installer'}</Button>
             </div>
           </form>
         </Form>
       </DialogContent>
     </Dialog>
   );
 };