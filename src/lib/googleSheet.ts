
// import type { Project, Publication } from '@/lib/types'

// const BASE_URL = process.env.SHEET_WEBAPP_URL
// if (!BASE_URL) {
//   throw new Error('Thiếu SHEET_WEBAPP_URL trong .env.local')
// }
// async function fetchSheet<T>(
//   sheetName: string,
//   signal?: AbortSignal
// ): Promise<T[]> {
//   const url = `${BASE_URL}?sheet=${encodeURIComponent(sheetName)}`
//   const res = await fetch(url, { signal })

//   if (!res.ok) {
//     throw new Error(`Lỗi Sheet API (status ${res.status})`)
//   }

//   const payload = await res.json()
//   const arr = (payload[sheetName] ?? payload[Object.keys(payload)[0]]) as unknown

//   if (!Array.isArray(arr)) {
//     throw new Error(
//       `Định dạng payload không đúng, sheet "${sheetName}" trả về: ${typeof arr}`
//     )
//   }

//   return arr as T[]
// }
// /**
//  * Lấy dữ liệu cho trang “Dự án” (sheet “DỰ ÁN GV”)
//  */
// export function fetchProjects(signal?: AbortSignal): Promise<Project[]> {
//   return fetchSheet<Project>('DỰ ÁN GV', signal)
// }

// /**
//  * Lấy dữ liệu cho trang “Tin tức” (sheet “Bài báo Khoa học”)
//  */
// export function fetchPublications(
//   signal?: AbortSignal
// ): Promise<Publication[]> {
//   return fetchSheet<Publication>('Bài báo Khoa học', signal)
// }
import type { SheetPayload, Project, Publication } from './types';

const BASE = process.env.SHEET_WEBAPP_URL!;
if (!BASE) throw new Error('Thiếu SHEET_WEBAPP_URL');

async function fetchSheet<T>(sheetName: string, signal?: AbortSignal): Promise<T[]> {
  const url = `${BASE}?sheet=${encodeURIComponent(sheetName)}`;
  const res = await fetch(url, { signal });
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
