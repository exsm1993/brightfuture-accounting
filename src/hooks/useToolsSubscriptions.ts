import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ToolSubscription {
  id: string;
  tool_name: string;
  vendor_name: string | null;
  category: string;
  status: string;
  billing_frequency: string;
  billing_amount: number;
  next_billing_date: string | null;
  business_line_allocation: string;
  solar_percentage: number;
  home_improvement_percentage: number;
  call_center_id: string | null;
  used_by: string | null;
  payment_account_id: string | null;
  auto_generate_expense: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type ToolSubscriptionInsert = Omit<ToolSubscription, 'id' | 'created_at' | 'updated_at'>;

export const useToolsSubscriptions = () => {
  return useQuery({
    queryKey: ['tools_subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tools_subscriptions' as any)
        .select('*')
        .order('tool_name');
      if (error) throw error;
      return (data as any[]) as ToolSubscription[];
    },
  });
};

export const useCreateToolSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sub: ToolSubscriptionInsert) => {
      const { data, error } = await supabase
        .from('tools_subscriptions' as any)
        .insert(sub as any)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as ToolSubscription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools_subscriptions'] });
    },
  });
};

export const useUpdateToolSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ToolSubscription> & { id: string }) => {
      const { data, error } = await supabase
        .from('tools_subscriptions' as any)
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as ToolSubscription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools_subscriptions'] });
    },
  });
};

export const useDeleteToolSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tools_subscriptions' as any)
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools_subscriptions'] });
    },
  });
};
