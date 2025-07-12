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

export type Transfer = {
  TT: string
  'Tên đơn vị nhận chuyển giao': string
  'Số hợp đồng/ PO': string
  'Ngày hợp đồng/PO': string
  'Nội dung Hợp đồng/PO': string
  'Giá trị hợp đồng trước thuế (đồng)': string
  '% kinh phí đã trích về trường xuất hoá đơn VAT': string
  'Số tiền đề nghị khen thưởng': string
  'Minh chứng': string
  'Tổng giá trị hợp đồng trước thuế': string
  'Tổng Số tiền khen thưởng': string
}

export type TimeManagement = {
  STT: string;
  'Tên cuộc thi': string;
  'Giảng Viên': string;
  'Thành viên': string;
  'Thời gian bắt đầu': string;
  'Hạn cuối nộp bài': string;
  'Thông tin nộp bài': string;
  'Link cuộc thi': string;
};

export interface SheetPayload {
  projects:      Project[];
  publications:  Publication[];
  transfers:     Transfer[];
  timemanagement: TimeManagement[];
}