// import type { Contest } from '@/lib/types';

// export async function fetchContestsFromSheet(signal?: AbortSignal): Promise<Contest[]> {
//   const res = await fetch(process.env.SHEET_WEBAPP_URL!, { signal });
//   if (!res.ok) {
//     throw new Error(`Sheet API error: ${res.status}`);
//   }
//   const json = await res.json();
//   if (!Array.isArray(json)) {
//     throw new Error('Expected array from sheet, got ' + typeof json);
//   }
//   return json as Contest[];
// }

import type { Contest } from '@/lib/types';

export async function fetchContestsFromSheet(signal?: AbortSignal): Promise<Contest[]> {
  const url = process.env.SHEET_WEBAPP_URL;
  if (!url) {
    throw new Error('SHEET_WEBAPP_URL environment variable is not set');
  }
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Sheet API error: ${res.status}`);
  }
  const json = await res.json();
  if (!Array.isArray(json)) {
    throw new Error('Expected array from sheet, got ' + typeof json);
  }
  return json as Contest[];
}