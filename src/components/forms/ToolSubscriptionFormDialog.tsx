import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { RequiredMark } from '@/components/ui/required-label';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { accounts } from '@/data/mockData';
import { useActiveCallCenters } from '@/hooks/useCallCenters';
import { useActivePeople } from '@/hooks/usePeople';
import {
  ToolSubscription, useCreateToolSubscription, useUpdateToolSubscription,
} from '@/hooks/useToolsSubscriptions';
import { useState } from 'react';

const categories = [
  'Communication', 'AI & Automation', 'Hosting & Domain',
  'Support & Services', 'Editing & Content', 'Training & Education',
  'Payments & Finance', 'Other',
];

const schema = z.object({
  tool_name: z.string().min(1, 'Tool name is required'),
  vendor_name: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  status: z.string().min(1),
  billing_frequency: z.string().min(1),
  billing_amount: z.coerce.number().min(0),
  next_billing_date: z.string().optional(),
  business_line_allocation: z.string().min(1),
  solar_percentage: z.coerce.number().min(0).max(100).optional(),
  home_improvement_percentage: z.coerce.number().min(0).max(100).optional(),
  call_center_id: z.string().optional(),
  used_by: z.string().optional(),
  payment_account_id: z.string().optional(),
  auto_generate_expense: z.boolean(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  subscription?: ToolSubscription;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: () => void;
  trigger?: React.ReactNode;
}

export const ToolSubscriptionFormDialog = ({
  subscription, open: controlledOpen, onOpenChange, onSave, trigger,
}: Props) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const isEdit = !!subscription;

  const { data: callCenters = [] } = useActiveCallCenters();
  const { data: people = [] } = useActivePeople();
  const createMutation = useCreateToolSubscription();
  const updateMutation = useUpdateToolSubscription();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      tool_name: '',
      vendor_name: '',
      category: 'Other',
      status: 'Active',
      billing_frequency: 'Monthly',
      billing_amount: 0,
      next_billing_date: '',
      business_line_allocation: 'Solar',
      solar_percentage: 100,
      home_improvement_percentage: 0,
      call_center_id: '',
      used_by: '',
      payment_account_id: '',
      auto_generate_expense: false,
      notes: '',
    },
  });

  const watchBL = form.watch('business_line_allocation');

  useEffect(() => {
    if (subscription && open) {
      form.reset({
        tool_name: subscription.tool_name,
        vendor_name: subscription.vendor_name ?? '',
        category: subscription.category,
        status: subscription.status,
        billing_frequency: subscription.billing_frequency,
        billing_amount: subscription.billing_amount,
        next_billing_date: subscription.next_billing_date ?? '',
        business_line_allocation: subscription.business_line_allocation,
        solar_percentage: subscription.solar_percentage,
        home_improvement_percentage: subscription.home_improvement_percentage,
        call_center_id: subscription.call_center_id ?? '',
        used_by: subscription.used_by ?? '',
        payment_account_id: subscription.payment_account_id ?? '',
        auto_generate_expense: subscription.auto_generate_expense,
        notes: subscription.notes ?? '',
      });
    } else if (!subscription && open) {
      form.reset();
    }
  }, [subscription, open, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        tool_name: values.tool_name,
        vendor_name: values.vendor_name || null,
        category: values.category,
        status: values.status,
        billing_frequency: values.billing_frequency,
        billing_amount: values.billing_amount,
        next_billing_date: values.next_billing_date || null,
        business_line_allocation: values.business_line_allocation,
        solar_percentage: values.solar_percentage ?? 100,
        home_improvement_percentage: values.home_improvement_percentage ?? 0,
        call_center_id: values.call_center_id || null,
        used_by: values.used_by || null,
        payment_account_id: values.payment_account_id || null,
        auto_generate_expense: values.auto_generate_expense,
        notes: values.notes || null,
      };

      if (isEdit && subscription) {
        await updateMutation.mutateAsync({ id: subscription.id, ...payload });
        toast.success('Subscription updated');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Subscription created');
      }
      setOpen(false);
      onSave?.();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button><Plus className="mr-2 h-4 w-4" />Add Subscription</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit' : 'Add'} Subscription</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update subscription details' : 'Register a new software/tool subscription'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="tool_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tool Name<RequiredMark /></FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="vendor_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Category<RequiredMark /></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Canceled">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField control={form.control} name="billing_frequency" render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Annual">Annual</SelectItem>
                      <SelectItem value="One-time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="billing_amount" render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="next_billing_date" render={({ field }) => (
                <FormItem>
                  <FormLabel>Next Billing</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="business_line_allocation" render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Line</FormLabel>
                  <Select onValueChange={(v) => { field.onChange(v); if (v !== 'Both') { form.setValue('solar_percentage', v === 'Solar' ? 100 : 0); form.setValue('home_improvement_percentage', v === 'Home Improvement' ? 100 : 0); } else { form.setValue('solar_percentage', 50); form.setValue('home_improvement_percentage', 50); } }} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Solar">Solar</SelectItem>
                      <SelectItem value="Home Improvement">Home Improvement</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              {watchBL === 'Both' && (
                <div className="flex gap-2 items-end">
                  <FormField control={form.control} name="solar_percentage" render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Solar %</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="home_improvement_percentage" render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>HI %</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                  )} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="call_center_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>Call Center</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="None" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {callCenters.map(cc => <SelectItem key={cc.id} value={cc.id}>{cc.call_center_name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="used_by" render={({ field }) => (
                <FormItem>
                  <FormLabel>Used By</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Not assigned" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="">Not assigned</SelectItem>
                      {people.map(p => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="payment_account_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Account</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {accounts.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="auto_generate_expense" render={({ field }) => (
                <FormItem className="flex items-center gap-3 pt-6">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="!mt-0">Auto-generate expense</FormLabel>
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="notes" render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl><Textarea {...field} rows={2} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {isEdit ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
