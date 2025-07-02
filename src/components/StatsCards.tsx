import React from 'react';

interface Props {
  data: Contest[];
}

const CARD_COLORS = [
  'linear-gradient(135deg, #a18fff 0%, #6f7cff 100%)',
  'linear-gradient(135deg, #5fd0ff 0%, #338aff 100%)',
  'linear-gradient(135deg, #ffb199 0%, #ff6f61 100%)',
  'linear-gradient(135deg, #7cfcb4 0%, #3edfa0 100%)'
];

const ICONS = [
  'bi-archive', // Tổng đề tài
  'bi-person-badge', // Số chủ nhiệm
  'bi-people', // Tổng thành viên
  'bi-award' // Đã khen thưởng
];

const LABELS = [
  'TỔNG ĐỀ TÀI',
  'SỐ CHỦ NHIỆM',
  'TỔNG THÀNH VIÊN',
  'ĐÃ KHEN THƯỞNG'
];

export default function StatsCards({ data }: Props) {
  // 1) Tính Tổng đề tài
  const totalContests = data.length;

  // 2) Tính Số chủ nhiệm duy nhất
  const uniqueLeaders = new Set(
    data.map((r) => r['Chủ nhiệm'].trim())
  ).size;

  // 3) Tính Tổng thành viên (mỗi dòng xuống, split bởi '\n')
  const totalMembers = data.reduce((sum, r) => {
    return (
      sum +
      r['Thành viên']
        .split('\n')
        .map((t) => t.trim())
        .filter((t) => t).length
    );
  }, 0);

  // 4) Tính Số đề tài đã khen thưởng
  const awardedCount = data.filter((r) =>
    /đã khen thưởng/i.test(r['Xét khen thưởng'])
  ).length;

  const values = [
    totalContests,
    uniqueLeaders,
    totalMembers,
    awardedCount
  ];

  return (
    <div className="row g-4 mb-4">
      {values.map((value, idx) => (
        <div key={LABELS[idx]} className="col-12 col-sm-6 col-lg-3">
          <div
            className="d-flex align-items-center px-4 py-3"
            style={{
              background: '#fff',
              borderRadius: 18,
              boxShadow: '0 4px 24px 0 rgba(51,138,255,0.10)',
              minHeight: 90
            }}
          >
            <div
              className="d-flex align-items-center justify-content-center me-3"
              style={{
                width: 54,
                height: 54,
                borderRadius: 14,
                background: CARD_COLORS[idx],
                boxShadow: '0 2px 8px 0 rgba(51,138,255,0.10)'
              }}
            >
              <i className={`bi ${ICONS[idx]}`} style={{ color: '#fff', fontSize: 28 }}></i>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 22, color: '#222', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 14, color: '#338aff', fontWeight: 500, letterSpacing: 0.5 }}>{LABELS[idx]}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}