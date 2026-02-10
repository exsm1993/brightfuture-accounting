import { useQuery } from '@tanstack/react-query';
import type { FetchDealsResponse } from '@/types/mysqlDeal';

interface DealFilters {
  search?: string;
  installer_id?: string;
  outcome?: string;
  state_id?: string;
  campaign?: string;
  source?: string;
  date_from?: string;
  date_to?: string;
  date_field?: string;
  deal_id?: string;
  limit?: number;
  offset?: number;
}

async function fetchDeals(filters: DealFilters): Promise<FetchDealsResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== 'all') {
      params.set(key, String(value));
    }
  });

  const projectUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const response = await fetch(
    `${projectUrl}/functions/v1/fetch-deals?${params.toString()}`,
    {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to fetch deals');
  }

  return response.json();
}

export function useDeals(filters: DealFilters = {}) {
  return useQuery({
    queryKey: ['deals', filters],
    queryFn: () => fetchDeals(filters),
    staleTime: 30_000,
  });
}

export function useDealDetail(dealId: string | undefined) {
  return useQuery({
    queryKey: ['deal', dealId],
    queryFn: () => fetchDeals({ deal_id: dealId, limit: 1 }),
    enabled: !!dealId,
    select: (data) => data.deals[0] ?? null,
  });
}
