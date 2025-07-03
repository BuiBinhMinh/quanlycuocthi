import type { Contest } from '@/lib/types';

export async function fetchContestsFromSheet(signal?: AbortSignal): Promise<Contest[]> {
  const res = await fetch(process.env.SHEET_WEBAPP_URL!, { signal });
  if (!res.ok) {
    throw new Error(`Sheet API error: ${res.status}`);
  }
  const json = await res.json();
  if (!Array.isArray(json)) {
    throw new Error('Expected array from sheet, got ' + typeof json);
  }
  return json as Contest[];
}