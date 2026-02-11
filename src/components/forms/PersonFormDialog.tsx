import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useActiveCallCenters } from '@/hooks/useCallCenters';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useCreatePerson, useUpdatePerson, DbPerson } from '@/hooks/usePeople';
import { RequiredMark } from '@/components/ui/required-label';

const personFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  business_line_assignment: z.enum(['Solar', 'Home Improvement', 'Both'], { required_error: 'Business line is required' }),
  solar_percentage: z.number().min(0).max(100),
  home_improvement_percentage: z.number().min(0).max(100),
  pay_frequency: z.string().min(1, 'Pay frequency is required'),
  receives_commission: z.boolean(),
  receives_bonus: z.boolean(),
  receives_salary: z.boolean(),
  active: z.boolean(),
  notes: z.string().optional(),
  call_center_id: z.string().optional(),
}).refine((data) => {
  if (data.business_line_assignment === 'Both') {
    return data.solar_percentage + data.home_improvement_percentage === 100;
  }
  return true;
}, {
  message: 'Percentages must sum to 100',
  path: ['solar_percentage'],
});

type PersonFormValues = z.infer<typeof personFormSchema>;

interface PersonFormDialogProps {
  trigger?: React.ReactNode;
  person?: DbPerson;
}

export const PersonFormDialog = ({ trigger, person }: PersonFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const createPerson = useCreatePerson();
  const updatePerson = useUpdatePerson();
  const { data: callCenters = [] } = useActiveCallCenters();
  const isEdit = !!person;

  const form = useForm<PersonFormValues>({
    resolver: zodResolver(personFormSchema),
    defaultValues: {
      name: person?.name ?? '',
      role: person?.role ?? '',
      business_line_assignment: person?.business_line_assignment ?? 'Solar',
      solar_percentage: person?.solar_percentage ?? 100,
      home_improvement_percentage: person?.home_improvement_percentage ?? 0,
      pay_frequency: person?.pay_frequency ?? 'weekly',
      receives_commission: person?.receives_commission ?? false,
      receives_bonus: person?.receives_bonus ?? false,
      receives_salary: person?.receives_salary ?? false,
      active: person?.active ?? true,
      notes: person?.notes ?? '',
      call_center_id: person?.call_center_id ?? '',
    },
  });

  const selectedRole = useWatch({ control: form.control, name: 'role' });
  const selectedBL = useWatch({ control: form.control, name: 'business_line_assignment' });

  useEffect(() => {
    if (selectedBL === 'Solar') {
      form.setValue('solar_percentage', 100);
      form.setValue('home_improvement_percentage', 0);
    } else if (selectedBL === 'Home Improvement') {
      form.setValue('solar_percentage', 0);
      form.setValue('home_improvement_percentage', 100);
    } else if (selectedBL === 'Both') {
      const solar = form.getValues('solar_percentage');
      const hi = form.getValues('home_improvement_percentage');
      if (solar + hi !== 100) {
        form.setValue('solar_percentage', 50);
        form.setValue('home_improvement_percentage', 50);
      }
    }
  }, [selectedBL]);

  useEffect(() => {
    if (person && open) {
      form.reset({
        name: person.name,
        role: person.role,
        business_line_assignment: person.business_line_assignment ?? 'Solar',
        solar_percentage: person.solar_percentage ?? 100,
        home_improvement_percentage: person.home_improvement_percentage ?? 0,
        pay_frequency: person.pay_frequency,
        receives_commission: person.receives_commission,
        receives_bonus: person.receives_bonus,
        receives_salary: person.receives_salary,
        active: person.active,
        notes: person.notes ?? '',
        call_center_id: person.call_center_id ?? '',
      });
    }
  }, [person, open]);

  const onSubmit = async (data: PersonFormValues) => {
    const callCenterId = data.role === 'call_center' && data.call_center_id ? data.call_center_id : null;
    const payload = {
      name: data.name,
      role: data.role,
      business_line_assignment: data.business_line_assignment,
      solar_percentage: data.solar_percentage,
      home_improvement_percentage: data.home_improvement_percentage,
      pay_frequency: data.pay_frequency,
      receives_commission: data.receives_commission,
      receives_bonus: data.receives_bonus,
      receives_salary: data.receives_salary,
      active: data.active,
      notes: data.notes || null,
      call_center_id: callCenterId,
    };
    try {
      if (isEdit) {
        await updatePerson.mutateAsync({ id: person.id, ...payload });
        toast.success('User updated successfully');
      } else {
        await createPerson.mutateAsync(payload);
        toast.success('User added successfully');
      }
      form.reset();
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update user details and payment configuration.' : 'Add a new team member who receives payments.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name<RequiredMark /></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. John Smith" {...field} />
                  </FormControl>
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
                    <FormLabel>Role<RequiredMark /></FormLabel>
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
                        <SelectItem value="administrative_team">Administrative Team</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="business_line_assignment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Line<RequiredMark /></FormLabel>
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
            </div>

            {selectedBL === 'Both' && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="solar_percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Solar %<RequiredMark /></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          step={1}
                          value={field.value}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            field.onChange(val);
                            form.setValue('home_improvement_percentage', 100 - val);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="home_improvement_percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Improvement %<RequiredMark /></FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          step={1}
                          value={field.value}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            field.onChange(val);
                            form.setValue('solar_percentage', 100 - val);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pay_frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pay Frequency<RequiredMark /></FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {selectedRole === 'call_center' && (
                <FormField
                  control={form.control}
                  name="call_center_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Call Center<RequiredMark /></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select call center" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {callCenters.map((cc) => (
                            <SelectItem key={cc.id} value={cc.id}>
                              {cc.call_center_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Payment Types</p>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="receives_commission"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center gap-1 rounded-lg border border-border p-3">
                      <FormLabel className="text-xs">Commission</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="receives_bonus"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center gap-1 rounded-lg border border-border p-3">
                      <FormLabel className="text-xs">Bonus</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="receives_salary"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center gap-1 rounded-lg border border-border p-3">
                      <FormLabel className="text-xs">Salary</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-border p-3">
                  <FormLabel>Active</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any additional notes..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createPerson.isPending || updatePerson.isPending}>
                {isEdit ? 'Save Changes' : 'Add User'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
