import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CallCenter {
  id: string;
  call_center_name: string;
  type: 'Internal' | 'External';
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const useCallCenters = () => {
  return useQuery({
    queryKey: ['call_centers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('call_centers' as any)
        .select('*')
        .order('call_center_name');
      if (error) throw error;
      return (data as any[]) as CallCenter[];
    },
  });
};

export const useActiveCallCenters = () => {
  return useQuery({
    queryKey: ['call_centers', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('call_centers' as any)
        .select('*')
        .eq('active', true)
        .order('call_center_name');
      if (error) throw error;
      return (data as any[]) as CallCenter[];
    },
  });
};

export const useCreateCallCenter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (callCenter: { call_center_name: string; type: string; active: boolean }) => {
      const { data, error } = await supabase
        .from('call_centers' as any)
        .insert(callCenter as any)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as CallCenter;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['call_centers'] });
    },
  });
};

export const useUpdateCallCenter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CallCenter> & { id: string }) => {
      const { data, error } = await supabase
        .from('call_centers' as any)
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as CallCenter;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['call_centers'] });
    },
  });
};

export const useDeleteCallCenter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('call_centers' as any)
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['call_centers'] });
    },
  });
};
