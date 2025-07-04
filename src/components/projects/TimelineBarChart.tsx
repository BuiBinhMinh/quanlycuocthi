'use client';
import type { Project } from '@/lib/types';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props { data: Project[]; small?: boolean }

function getYearOrMonth(time: string) {
  // Ưu tiên lấy năm, nếu có dạng MM/YYYY thì lấy luôn, nếu chỉ có năm thì lấy năm
  if (!time) return 'Khác';
  const match = time.match(/(\d{4})/g);
  if (match) return match[match.length - 1];
  return time;
}

export default function TimelineBarChart({ data, small }: Props) {
  // Group theo năm (hoặc tháng/năm nếu bạn muốn)
  const counts = data.reduce<Record<string, number>>((acc, r) => {
    const key = getYearOrMonth(r['Thời gian']);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Sắp xếp theo năm tăng dần
  const labels = Object.keys(counts).sort((a, b) => a.localeCompare(b));
  const values = labels.map(l => counts[l]);

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-header fw-bold bg-white border-0" style={{ fontSize: 18 }}>
        Thống kê số lượng đề tài theo năm
      </div>
      <div className="card-body" style={{ height: small ? 220 : 400, minHeight: small ? 180 : 350 }}>
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: 'Số lượng đề tài',
                data: values,
                backgroundColor: (ctx) => {
                  const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, small ? 220 : 400);
                  gradient.addColorStop(0, '#4f8cff');
                  gradient.addColorStop(1, '#a6e1fa');
                  return gradient;
                },
                borderRadius: 12,
                barPercentage: 0.7,
                categoryPercentage: 0.7,
                borderSkipped: false,
                hoverBackgroundColor: '#2563eb',
                borderWidth: 0,
              }
            ]
          }}
          options={{
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#fff',
                titleColor: '#222',
                bodyColor: '#222',
                borderColor: '#eee',
                borderWidth: 1,
              }
            },
            maintainAspectRatio: false,
            responsive: true,
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: '#222', font: { size: small ? 13 : 16 } }
              },
              y: {
                beginAtZero: true,
                grid: { color: '#f0f0f0' },
                ticks: { color: '#222', font: { size: small ? 13 : 16 }, stepSize: 1 }
              }
            }
          }}
        />
      </div>
    </div>
  );
}