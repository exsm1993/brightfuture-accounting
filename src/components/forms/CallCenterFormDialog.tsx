import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { CallCenter, useCreateCallCenter, useUpdateCallCenter } from '@/hooks/useCallCenters';
import { RequiredMark } from '@/components/ui/required-label';

const formSchema = z.object({
  call_center_name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  active: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface CallCenterFormDialogProps {
  callCenter?: CallCenter;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (cc: CallCenter) => void;
  trigger?: React.ReactNode;
}

export const CallCenterFormDialog = ({ callCenter, open: controlledOpen, onOpenChange, onSave, trigger }: CallCenterFormDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isEditing = !!callCenter;
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const createMutation = useCreateCallCenter();
  const updateMutation = useUpdateCallCenter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      call_center_name: '',
      type: 'External',
      active: true,
    },
  });

  useEffect(() => {
    if (callCenter && open) {
      form.reset({
        call_center_name: callCenter.call_center_name,
        type: callCenter.type,
        active: callCenter.active,
      });
    } else if (!callCenter && open) {
      form.reset({ call_center_name: '', type: 'External', active: true });
    }
  }, [callCenter, open, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      const payload = { call_center_name: data.call_center_name, type: data.type as 'Internal' | 'External', active: data.active };
      if (isEditing && callCenter) {
        const updated = await updateMutation.mutateAsync({ id: callCenter.id, ...payload });
        onSave?.(updated);
        toast.success('Call center updated');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Call center created');
      }
      form.reset();
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save call center');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button><Plus className="mr-2 h-4 w-4" />Add Call Center</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Call Center' : 'Add Call Center'}</DialogTitle>
          <DialogDescription>{isEditing ? 'Update call center details.' : 'Add a new call center to the system.'}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="call_center_name" render={({ field }) => (
              <FormItem>
                <FormLabel>Name<RequiredMark /></FormLabel>
                <FormControl><Input placeholder="Call center name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="type" render={({ field }) => (
              <FormItem>
                <FormLabel>Type<RequiredMark /></FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="Internal">Internal</SelectItem>
                    <SelectItem value="External">External</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="active" render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <FormLabel>Active</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )} />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {isEditing ? 'Update' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
