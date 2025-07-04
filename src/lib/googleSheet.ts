import type { SheetPayload, Project, Publication } from './types';

const BASE = process.env.SHEET_WEBAPP_URL!;
if (!BASE) throw new Error('Thiếu SHEET_WEBAPP_URL');

async function fetchSheet<T>(sheetName: string, signal?: AbortSignal): Promise<T[]> {
  const url = `${BASE}?sheet=${encodeURIComponent(sheetName)}`;
  const res = await fetch(url, { signal, cache: 'no-store' });
  if (!res.ok) throw new Error(`Lỗi Sheet API: ${res.status}`);
  const json = await res.json();
  const arr = Object.values(json)[0];
  if (!Array.isArray(arr)) throw new Error('Sheet payload sai định dạng');
  return arr as T[];
}

export function fetchProjects(signal?: AbortSignal) {
  return fetchSheet<Project>('DỰ ÁN GV', signal);
}

export function fetchPublications(signal?: AbortSignal) {
  return fetchSheet<Publication>('Bài báo Khoa học', signal);
}

export async function fetchAll(signal?: AbortSignal): Promise<SheetPayload> {
  const res = await fetch(BASE, { signal });
  if (!res.ok) throw new Error(`Sheet API error ${res.status}`);
  return res.json();
}
