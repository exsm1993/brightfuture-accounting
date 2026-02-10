import { useQuery } from '@tanstack/react-query';

export interface MysqlInstaller {
  installer_id: string;
  installer_name: string;
  contact_email: string;
  installer_phone: string;
  active: boolean;
  default_redline: number;
}

interface FetchInstallersResponse {
  installers: MysqlInstaller[];
}

async function fetchInstallers(): Promise<FetchInstallersResponse> {
  const projectUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const response = await fetch(
    `${projectUrl}/functions/v1/fetch-installers`,
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
    throw new Error(err.error || 'Failed to fetch installers');
  }

  return response.json();
}

export function useInstallers() {
  return useQuery({
    queryKey: ['installers'],
    queryFn: fetchInstallers,
    staleTime: 5 * 60 * 1000, // 5 minutes - installer data rarely changes
  });
}

/** Utility: build a map of installer_id -> name for quick lookups */
export function useInstallerMap() {
  const { data, ...rest } = useInstallers();
  const map = new Map<string, string>();
  data?.installers.forEach(i => map.set(i.installer_id, i.installer_name));
  return { map, ...rest };
}
