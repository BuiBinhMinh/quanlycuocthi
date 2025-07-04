'use client';

import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  LegendItem
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import type { Publication } from '@/lib/types';

// Đăng ký các thành phần
ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  data: Publication[];
}

export default function PublicationStatusPie({ data }: Props) {
  // 1) Đếm số bài theo trạng thái
  const { labels, values } = useMemo(() => {
    const cnt: Record<string, number> = {
      'Đã đăng': 0,
      'Đang xét': 0,
      'Chưa đăng': 0
    };
    data.forEach(r => {
      const st = (r['Trạng thái'] || '').toLowerCase();
      if (st.includes('đã đăng') || st.includes('đã khen thưởng')) {
        cnt['Đã đăng']++;
      } else if (st.includes('đang xét') || st.includes('đang phê duyệt')) {
        cnt['Đang xét']++;
      } else {
        cnt['Chưa đăng']++;
      }
    });
    const lbls = Object.keys(cnt);
    return { labels: lbls, values: lbls.map(l => cnt[l]) };
  }, [data]);

  // 2) Màu tương ứng với từng trạng thái
  const COLORS = ['#198754', '#fbbf24', '#f43f5e'];

  // 3) Tùy chỉnh legend để hiện luôn số lượng
  const options: ChartOptions<'pie'> = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          generateLabels: chart => {
            const dataset = chart.data.datasets[0];
            return chart.data.labels!.map((label, i) => {
              const bg = Array.isArray(dataset.backgroundColor)
                ? dataset.backgroundColor[i]
                : (dataset.backgroundColor as string);
              return {
                text: `${label} (${dataset.data[i]})`,
                fillStyle: bg,
                hidden: false,
                index: i
              } as LegendItem;
            });
          }
        }
      },
      tooltip: {
        callbacks: {
          label: ctx => {
            const v = ctx.parsed;
            const pct = data.length
              ? ((v * 100) / data.length).toFixed(1) + '%'
              : '0%';
            return `${ctx.label}: ${v} (${pct})`;
          }
        }
      }
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-white">Trạng thái bài đăng</div>
      <div
        className="card-body d-flex justify-content-center align-items-center"
        style={{ height: 300 }}
      >
        <Pie
          data={{
            labels,
            datasets: [
              {
                data: values,
                backgroundColor: COLORS,
                borderWidth: 1
              }
            ]
          }}
          options={options}
        />
      </div>
    </div>
  );
}
