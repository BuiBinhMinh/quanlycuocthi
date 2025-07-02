'use client';
import { Contest } from '@/lib/googleSheet';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props { data: Contest[], small?: boolean }

export default function AwardsPieChart({ data, small }: Props) {
  const counts = data.reduce<Record<string, number>>((acc, r) => {
    const key = r['Xét khen thưởng'];
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(counts);
  const values = labels.map(l => counts[l]);

  // Map trạng thái sang màu
  const colorMap: Record<string, string> = {
    'Đã khen thưởng': '#198754',    // xanh lá cây
    'Đang phê duyệt': '#ffc107',    // vàng
    'Chưa khen thưởng': '#dc3545'   // đỏ
  };
  const colors = labels.map(label => colorMap[label] || '#6c757d');

  // Responsive height
  const chartHeight = small
    ? (typeof window !== 'undefined' && window.innerWidth < 576 ? 180 : 220)
    : (typeof window !== 'undefined' && window.innerWidth < 576 ? 240 : 400);

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-header fw-bold bg-white border-0" style={{ fontSize: 18 }}>
        Thống kê khen thưởng
      </div>
      <div
        className="card-body d-flex flex-column align-items-center justify-content-center p-2 p-sm-3"
        style={{
          height: chartHeight,
          minHeight: small ? 140 : 200,
          width: '100%',
        }}
      >
        <div style={{
          width: '100%',
          maxWidth: small ? 220 : 320,
          margin: '0 auto'
        }}>
          <Pie
            data={{
              labels,
              datasets: [{
                data: values,
                backgroundColor: colors
              }]
            }}
            options={{
              plugins: { legend: { display: false } },
              maintainAspectRatio: false,
              responsive: true
            }}
            height={chartHeight - 40}
          />
        </div>
        <div
          className="d-flex justify-content-center align-items-center gap-2 mt-2 mb-0 small flex-wrap w-100"
          style={{
            rowGap: 6,
            columnGap: 16,
            fontSize: 13,
            flexWrap: 'wrap'
          }}
        >
          {labels.map((label, idx) => (
            <span key={label} className="d-flex align-items-center mb-1">
              <span
                className="badge me-1"
                style={{
                  backgroundColor: colors[idx],
                  width: 14,
                  height: 14,
                  display: "inline-block",
                  borderRadius: 3,
                  marginRight: 6
                }}
              >
                &nbsp;
              </span>
              <span style={{ whiteSpace: 'nowrap' }}>{label} <b>{values[idx]}</b></span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}