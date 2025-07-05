'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { Publication } from '@/lib/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface Props {
  data: Publication[];
}

export default function PublicationTimelineChart({ data }: Props) {
  const chartRef = useRef<ChartJS<'line'>>(null);

  // 1) Gom nhóm số lượng bài báo theo năm, hỗ trợ ISO, dd/mm/yyyy, "Tháng X/YYYY",...
  const { labels, values } = useMemo(() => {
    const cnt: Record<string, number> = {};

    data.forEach((r) => {
      const raw = (r['Thời gian'] || '').trim();
      let year: string | null = null;

      // ISO yyyy-mm-dd
      if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
        const d = new Date(raw);
        if (!isNaN(d.getTime())) year = String(d.getFullYear());
      }
      // dd/mm/yyyy
      else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(raw)) {
        const parts = raw.split('/');
        year = parts[2];
      }
      if (!year) {
        const m = raw.match(/(\d{4})/);
        if (m) year = m[1];
      }
      if (!year) {
        const d2 = new Date(raw);
        if (!isNaN(d2.getTime())) year = String(d2.getFullYear());
      }

      const key = year ?? 'Khác';
      cnt[key] = (cnt[key] || 0) + 1;
    });

    const yrs = Object.keys(cnt)
      .filter((y) => y !== 'Khác')
      .sort((a, b) => Number(a) - Number(b));
    if (cnt['Khác']) yrs.push('Khác');

    return {
      labels: yrs,
      values: yrs.map((y) => cnt[y]),
    };
  }, [data]);

  // 2) Vẽ gradient dưới đường line
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const ctx = chart.ctx;
    const grad = ctx.createLinearGradient(0, 0, 0, 300);
    grad.addColorStop(0, 'rgba(13,110,253,0.4)');
    grad.addColorStop(1, 'rgba(13,110,253,0.05)');
    chart.data.datasets[0].backgroundColor = grad;
    chart.update();
  }, [labels, values]);

  // 3) Cấu hình biểu đồ
  const options: ChartOptions<'line'> = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#333',
        padding: 8,
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#555', maxRotation: 0, autoSkip: true },
        title: {
          display: true,
          text: 'Năm',
          color: '#333',
          font: { size: 14, weight: 500 },
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(200,200,200,0.1)' },
        ticks: { stepSize: 1, color: '#555' },
        title: {
          display: true,
          text: 'Số bài báo',
          color: '#333',
          font: { size: 14, weight: 500 },
        },
      },
    },
  };

  return (
    <div className="card shadow-sm mb-4 rounded-3 border-0">
      <div className="card-header bg-white border-bottom-0 fs-5 fw-semibold">
        Bài báo theo thời gian
      </div>
      <div className="card-body p-0" style={{ height: 300 }}>
        <Line
          ref={chartRef}
          data={{
            labels,
            datasets: [
              {
                label: 'Số bài báo',
                data: values,
                borderColor: '#0d6efd',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#0d6efd',
                pointHoverRadius: 6,
              },
            ],
          }}
          options={options}
        />
      </div>
    </div>
  );
}
