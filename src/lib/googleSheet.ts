export interface Contest {
  STT: string;
  'Tên đề tài': string;
  'Thành viên': string;
  'Chủ nhiệm': string;
  'Thời gian': string;
  'Giải thưởng tham gia': string;
  'Đạt giải': string;
  'Xét khen thưởng': string;
  'Minh chứng': string;
}

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