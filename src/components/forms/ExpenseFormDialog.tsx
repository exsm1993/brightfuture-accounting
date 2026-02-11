import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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
import { businessLines, accounts, incentiveTypes } from '@/data/mockData';
import { useActivePeople } from '@/hooks/usePeople';
import { RequiredMark } from '@/components/ui/required-label';
import { Plus, Info } from 'lucide-react';
import { DealSearchSelect } from '@/components/forms/DealSearchSelect';
import { toast } from 'sonner';

const expenseCategories = [
  'Commissions',
  'Bonus',
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

const incentiveCategories = ['Commissions', 'Bonus'];

const expenseFormSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  amount: z.string().min(1, 'Amount is required').refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    'Amount must be a positive number'
  ),
  category: z.string().min(1, 'Category is required'),
  incentive_type_id: z.string().optional(),
  business_line_id: z.string().optional(),
  account_id: z.string().min(1, 'Account is required'),
  person_id: z.string().min(1, 'Person is required'),
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
  const { data: people = [] } = useActivePeople();

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      amount: '',
      category: '',
      incentive_type_id: '',
      business_line_id: '',
      account_id: '',
      person_id: '',
      deal_id: '',
      recurring: false,
      status: 'Completed',
    },
  });

  const selectedCategory = useWatch({ control: form.control, name: 'category' });
  const selectedPersonId = useWatch({ control: form.control, name: 'person_id' });
  const showIncentiveType = incentiveCategories.includes(selectedCategory);

  const selectedPerson = people.find(p => p.id === selectedPersonId);
  const personBL = selectedPerson?.business_line_assignment;
  const isAutoBusinessLine = personBL === 'Solar' || personBL === 'Home Improvement';
  const isSplitExpense = personBL === 'Both';

  // Auto-fill business line when person changes
  const handlePersonChange = (personId: string) => {
    form.setValue('person_id', personId);
    const person = people.find(p => p.id === personId);
    if (person) {
      if (person.business_line_assignment === 'Solar') {
        form.setValue('business_line_id', businessLines.find(bl => bl.name === 'Solar')?.id || '');
      } else if (person.business_line_assignment === 'Home Improvement') {
        form.setValue('business_line_id', businessLines.find(bl => bl.name === 'Home Improvement')?.id || '');
      } else {
        form.setValue('business_line_id', '');
      }
    }
  };

  const onSubmit = (data: ExpenseFormValues) => {
    const person = people.find(p => p.id === data.person_id);
    const resolvedCallCenterId = person?.call_center_id || undefined;

    if (person?.business_line_assignment === 'Both') {
      const amount = Number(data.amount);
      const solarPct = person.solar_percentage;
      const solarPart = Math.round(amount * solarPct) / 100;
      const hiPart = amount - solarPart;
      const sharedGroupId = `grp-${Date.now()}`;
      const solarBLId = businessLines.find(bl => bl.name === 'Solar')?.id || '';
      const hiBLId = businessLines.find(bl => bl.name === 'Home Improvement')?.id || '';

      console.log('Split expense - Solar:', {
        ...data,
        amount: solarPart,
        business_line_id: solarBLId,
        call_center_id: resolvedCallCenterId,
        shared_group_id: sharedGroupId,
        auto_generated_from_shared_cost: true,
      });
      console.log('Split expense - Home Improvement:', {
        ...data,
        amount: hiPart,
        business_line_id: hiBLId,
        call_center_id: resolvedCallCenterId,
        shared_group_id: sharedGroupId,
        auto_generated_from_shared_cost: true,
      });
      toast.success(`Expense split: $${solarPart.toFixed(2)} Solar / $${hiPart.toFixed(2)} Home Improvement`);
    } else {
      console.log('Expense data:', {
        ...data,
        amount: Number(data.amount),
        incentive_type_id: data.incentive_type_id || undefined,
        call_center_id: resolvedCallCenterId,
        deal_id: data.deal_id || undefined,
      });
      toast.success('Expense recorded successfully');
    }
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
                    <FormLabel>Date<RequiredMark /></FormLabel>
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
                    <FormLabel>Amount ($)<RequiredMark /></FormLabel>
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
              name="person_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Person<RequiredMark /></FormLabel>
                  <Select onValueChange={handlePersonChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select person" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {people.map((person) => (
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

            {selectedPerson && (
              <div className="flex items-start gap-2 rounded-md bg-muted p-3 text-sm text-muted-foreground">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                {isAutoBusinessLine && (
                  <span>Business line auto-derived from person settings: <strong>{personBL}</strong></span>
                )}
                {isSplitExpense && (
                  <span>
                    This expense will be split <strong>{selectedPerson.solar_percentage}% Solar</strong> / <strong>{selectedPerson.home_improvement_percentage}% Home Improvement</strong>
                  </span>
                )}
              </div>
            )}

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category<RequiredMark /></FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    if (!incentiveCategories.includes(value)) {
                      form.setValue('incentive_type_id', '');
                    }
                  }} defaultValue={field.value}>
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

            {showIncentiveType && (
              <FormField
                control={form.control}
                name="incentive_type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Incentive Type</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value === "none" ? "" : value)} defaultValue={field.value || "none"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select incentive type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No incentive type</SelectItem>
                        {incentiveTypes.filter(it => it.active).map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              {!isSplitExpense && (
                <FormField
                  control={form.control}
                  name="business_line_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Line<RequiredMark /></FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isAutoBusinessLine}
                      >
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
              )}
              <FormField
                control={form.control}
                name="account_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account<RequiredMark /></FormLabel>
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
                  <FormControl>
                    <DealSearchSelect
                      value={field.value || ''}
                      onChange={field.onChange}
                    />
                  </FormControl>
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
                    <FormLabel>Status<RequiredMark /></FormLabel>
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
