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
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { IncentiveType } from '@/types/finance';
import { RequiredMark } from '@/components/ui/required-label';

const incentiveTypeFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  active: z.boolean(),
});

type IncentiveTypeFormValues = z.infer<typeof incentiveTypeFormSchema>;

interface IncentiveTypeFormDialogProps {
  incentiveType?: IncentiveType;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (incentiveType: IncentiveType) => void;
  trigger?: React.ReactNode;
}

export const IncentiveTypeFormDialog = ({
  incentiveType,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onSave,
  trigger,
}: IncentiveTypeFormDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalOpen;

  const isEditing = !!incentiveType;

  const form = useForm<IncentiveTypeFormValues>({
    resolver: zodResolver(incentiveTypeFormSchema),
    defaultValues: {
      name: '',
      active: true,
    },
  });

  useEffect(() => {
    if (incentiveType) {
      form.reset({
        name: incentiveType.name,
        active: incentiveType.active,
      });
    } else {
      form.reset({
        name: '',
        active: true,
      });
    }
  }, [incentiveType, form]);

  const onSubmit = (data: IncentiveTypeFormValues) => {
    const savedIncentiveType: IncentiveType = {
      id: incentiveType?.id || `it-${Date.now()}`,
      name: data.name,
      active: data.active,
    };

    if (onSave) {
      onSave(savedIncentiveType);
    }

    toast.success(
      isEditing
        ? `Incentive type "${data.name}" updated successfully`
        : `Incentive type "${data.name}" added successfully`
    );
    form.reset();
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger !== undefined ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Incentive Type
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Incentive Type' : 'Add Incentive Type'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the incentive type details.'
              : 'Create a new incentive type for expense categorization.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name<RequiredMark /></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Commission - Sale" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Inactive types won't appear in expense forms
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
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange?.(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Save Changes' : 'Add Incentive Type'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
