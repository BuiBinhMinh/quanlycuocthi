export type Project = {
  STT: string;
  'Tên đề tài': string;
  'Thành viên': string;
  'Chủ nhiệm': string;
  'Thời gian': string;
  'Giải thưởng tham gia': string;
  'Đạt giải': string;
  'Xét khen thưởng': string;
  'Minh chứng': string;
};

export type Publication = {
  STT: string;
  'Tên bài báo': string;
  'Thành viên': string;
  'Tác giả 1'?: string;
  'Thời gian'?: string;
  'Nơi đăng'?: string;
  'Mã số ISSN'?: string;
  'Trạng thái'?: string;  
  'Quốc gia'?: string;
  'Minh chứng'?: string;
};

export interface SheetPayload {
  projects:    Project[];
  publications: Publication[];
}