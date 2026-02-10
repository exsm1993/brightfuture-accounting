import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DbPerson {
  id: string;
  name: string;
  role: string;
  active: boolean;
  pay_frequency: string;
  receives_commission: boolean;
  receives_bonus: boolean;
  receives_salary: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type PersonInsert = Omit<DbPerson, 'id' | 'created_at' | 'updated_at'>;

export function usePeople() {
  return useQuery<DbPerson[]>({
    queryKey: ['people'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('people')
        .select('*')
        .order('name');
      if (error) throw error;
      return (data ?? []) as unknown as DbPerson[];
    },
  });
}

export function useActivePeople() {
  return useQuery<DbPerson[]>({
    queryKey: ['people', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('people')
        .select('*')
        .eq('active', true)
        .order('name');
      if (error) throw error;
      return (data ?? []) as unknown as DbPerson[];
    },
  });
}

export function useCreatePerson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (person: PersonInsert) => {
      const { data, error } = await supabase
        .from('people')
        .insert(person as any)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as DbPerson;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
    },
  });
}

export function useUpdatePerson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DbPerson> & { id: string }) => {
      const { data, error } = await supabase
        .from('people')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as DbPerson;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
    },
  });
}
