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

// register the required components
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

  // 1) group counts by year (or "Khác")
  const { labels, values } = useMemo(() => {
    const cnt: Record<string, number> = {};
    data.forEach(r => {
      const d = new Date((r['Thời gian'] || '').trim());
      const year = isNaN(d.getTime()) ? 'Khác' : String(d.getFullYear());
      cnt[year] = (cnt[year] || 0) + 1;
    });
    const years = Object.keys(cnt)
      .filter(y => y !== 'Khác')
      .sort((a, b) => Number(a) - Number(b));
    if (cnt['Khác']) years.push('Khác');
    return { labels: years, values: years.map(y => cnt[y]) };
  }, [data]);

  // 2) apply a nice gradient fill under the line
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

  // 3) configure options (no explicit border-hiding)
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
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200,200,200,0.1)',
          // we simply leave the default border here
        },
        ticks: {
          stepSize: 1,
          color: '#555',
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
