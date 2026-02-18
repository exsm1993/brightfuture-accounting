import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ExpenseRecord {
  id: string;
  date: string;
  amount: number;
  business_line_id: string;
  category: string;
  incentive_type_id?: string | null;
  call_center_id?: string | null;
  person_id?: string | null;
  deal_id?: string | null;
  account_id: string;
  recurring: boolean;
  status: string;
  payout_id?: string | null;
  allocation_source?: string | null;
  allocation_solar_percentage?: number | null;
  allocation_home_improvement_percentage?: number | null;
  allocation_timestamp?: string | null;
  original_total_amount?: number | null;
  shared_group_id?: string | null;
  auto_generated_from_shared_cost: boolean;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export type ExpenseInsert = Omit<ExpenseRecord, 'id' | 'created_at' | 'updated_at'>;
export type ExpenseUpdate = Partial<ExpenseInsert>;

export const useExpenses = () => {
  return useQuery({
    queryKey: ['expense_transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expense_transactions' as any)
        .select('*')
        .order('date', { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as ExpenseRecord[];
    },
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (expense: ExpenseInsert) => {
      const { data, error } = await supabase
        .from('expense_transactions' as any)
        .insert(expense as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense_transactions'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to save expense: ${error.message}`);
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ExpenseUpdate }) => {
      const { data, error } = await supabase
        .from('expense_transactions' as any)
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense_transactions'] });
      toast.success('Expense updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update expense: ${error.message}`);
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('expense_transactions' as any)
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense_transactions'] });
      toast.success('Expense deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete expense: ${error.message}`);
    },
  });
};
