// 'use client';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
// import type { Project } from '@/lib/types';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// interface Props {
//   data: Project[];
//   small?: boolean;
// }

// const AWARD_LABELS = [
//   'Giải Nhất',
//   'Giải Nhì',
//   'Giải Ba',
//   'Giải Khuyến khích'
// ];

// const AWARD_COLORS = [
//   '#FFD700',
//   '#C0C0C0',
//   '#CD7F32',
//   '#4CAF50'
// ];

// export default function AwardsTypePieChart({ data, small }: Props) {
//   const counts = [0, 0, 0, 0];
//   data.forEach(r => {
//     const awards = (r['Đạt giải'] || '')
//       .split(/\n|,|;/)
//       .map(t => t.trim().toLowerCase());
//     awards.forEach(a => {
//       if (a.includes('nhất')) counts[0]++;
//       else if (a.includes('nhì')) counts[1]++;
//       else if (a.includes('ba')) counts[2]++;
//       else if (a.includes('khuyến khích')) counts[3]++;
//     });
//   });

//   const chartHeight = small
//     ? (typeof window !== 'undefined' && window.innerWidth < 576 ? 180 : 220)
//     : (typeof window !== 'undefined' && window.innerWidth < 576 ? 240 : 400);

//   return (
//     <div className="card h-100 shadow-sm border-0">
//       <div className="card-header fw-bold bg-white border-0" style={{ fontSize: 18 }}>
//         Thống kê loại giải thưởng
//       </div>
//       <div
//         className="card-body d-flex flex-column align-items-center justify-content-center p-2 p-sm-3"
//         style={{
//           height: chartHeight,
//           minHeight: small ? 140 : 200,
//           width: '100%',
//         }}
//       >
//         <div style={{
//           width: '100%',
//           maxWidth: small ? 320 : 420,
//           margin: '0 auto'
//         }}>
//           <Bar
//             data={{
//               labels: AWARD_LABELS,
//               datasets: [{
//                 data: counts,
//                 backgroundColor: AWARD_COLORS,
//                 borderRadius: 8,
//                 barThickness: 28
//               }]
//             }}
//             options={{
//               indexAxis: 'y',
//               plugins: { legend: { display: false } },
//               maintainAspectRatio: false,
//               responsive: true,
//               scales: {
//                 x: {
//                   beginAtZero: true,
//                   ticks: { precision: 0, color: '#222', font: { size: 13 } },
//                   grid: { color: '#eee' }
//                 },
//                 y: {
//                   ticks: { color: '#222', font: { size: 14 } },
//                   grid: { display: false }
//                 }
//               }
//             }}
//             height={chartHeight - 40}
//           />
//         </div>
//         <div
//           className="d-flex justify-content-center align-items-center gap-2 mt-2 mb-0 small flex-wrap w-100"
//           style={{
//             rowGap: 6,
//             columnGap: 16,
//             fontSize: 13,
//             flexWrap: 'wrap'
//           }}
//         >
//           {AWARD_LABELS.map((label, idx) => (
//             <span key={label} className="d-flex align-items-center mb-1">
//               <span
//                 className="badge me-1"
//                 style={{
//                   background: AWARD_COLORS[idx],
//                   width: 14,
//                   height: 14,
//                   display: "inline-block",
//                   borderRadius: 3,
//                   marginRight: 6
//                 }}
//               >
//                 &nbsp;
//               </span>
//               <span style={{ whiteSpace: 'nowrap' }}>{label} <b>{counts[idx]}</b></span>
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';
import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions
} from 'chart.js';
import type { Project } from '@/lib/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  data: Project[];
  small?: boolean;
}

const AWARD_LABELS = [
  'Giải Nhất',
  'Giải Nhì',
  'Giải Ba',
  'Giải Khuyến khích'
];

const AWARD_COLORS = [
  '#FFD700',
  '#C0C0C0',
  '#CD7F32',
  '#4CAF50'
];

export default function AwardsTypePieChart({ data, small }: Props) {
  // 1) Tính counts khi 'data' thay đổi
  const counts = useMemo(() => {
    const cnt = [0, 0, 0, 0];
    data.forEach(r => {
      const awards = (r['Đạt giải'] || '')
        .split(/\n|,|;/)
        .map(t => t.trim().toLowerCase());
      awards.forEach(a => {
        if (a.includes('nhất')) cnt[0]++;
        else if (a.includes('nhì')) cnt[1]++;
        else if (a.includes('ba')) cnt[2]++;
        else if (a.includes('khuyến khích')) cnt[3]++;
      });
    });
    return cnt;
  }, [data]);

  // 2) Xây dựng chartData
  const chartData = useMemo<ChartData<'bar'>>(() => ({
    labels: AWARD_LABELS,
    datasets: [{
      data: counts,
      backgroundColor: AWARD_COLORS,
      borderRadius: 8,
      barThickness: 28
    }]
  }), [counts]);

  // 3) Xây dựng options
  const chartOptions = useMemo<ChartOptions<'bar'>>(() => ({
    indexAxis: 'y',
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
        ticks: { precision: 0, color: '#222', font: { size: 13 } },
        grid: { color: '#eee' }
      },
      y: {
        ticks: { color: '#222', font: { size: 14 } },
        grid: { display: false }
      }
    }
  }), []);

  // 4) Tính chiều cao chart
  const chartHeight = useMemo(() => {
    if (small) {
      return typeof window !== 'undefined' && window.innerWidth < 576 ? 180 : 220;
    }
    return typeof window !== 'undefined' && window.innerWidth < 576 ? 240 : 400;
  }, [small]);

  return (
    <div className="card h-100 shadow-sm border-0">
      <div className="card-header fw-bold bg-white border-0" style={{ fontSize: 18 }}>
        Thống kê loại giải thưởng
      </div>
      <div
        className="card-body d-flex flex-column align-items-center justify-content-center p-2 p-sm-3"
        style={{
          height: chartHeight,
          minHeight: small ? 140 : 200,
          width: '100%',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: small ? 320 : 420,
            margin: '0 auto'
          }}
        >
          <Bar
            data={chartData}
            options={chartOptions}
            height={chartHeight - 40}
            redraw={true}  // ép vẽ lại khi data thay đổi
          />
        </div>
        <div
          className="d-flex justify-content-center align-items-center gap-2 mt-2 mb-0 small flex-wrap w-100"
          style={{
            rowGap: 6,
            columnGap: 16,
            fontSize: 13
          }}
        >
          {AWARD_LABELS.map((label, idx) => (
            <span key={label} className="d-flex align-items-center mb-1">
              <span
                className="badge me-1"
                style={{
                  background: AWARD_COLORS[idx],
                  width: 14,
                  height: 14,
                  display: 'inline-block',
                  borderRadius: 3,
                  marginRight: 6
                }}
              />
              <span style={{ whiteSpace: 'nowrap' }}>
                {label} <b>{counts[idx]}</b>
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
