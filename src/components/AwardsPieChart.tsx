// 'use client';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// import type { Contest } from '@/lib/types';

// ChartJS.register(ArcElement, Tooltip, Legend);

// interface Props {
//   data: Contest[];
//   small?: boolean;
// }

// export default function AwardsPieChart({ data, small }: Props) {
//   // Đếm số lượng theo trạng thái khen thưởng
//   const counts = data.reduce<Record<string, number>>((acc, r) => {
//     const key = r['Xét khen thưởng'] || 'Không rõ';
//     acc[key] = (acc[key] || 0) + 1;
//     return acc;
//   }, {});

//   const labels = Object.keys(counts);
//   const values = labels.map(l => counts[l]);

//   // Map trạng thái sang màu (gradient cho "Đang xét"/"Đang phê duyệt")
//   const colorMap: Record<string, string> = {
//     'Đã khen thưởng': '#198754',
//     'Đang phê duyệt': 'gradient-yellow',
//     'Đang xét': 'gradient-yellow',
//     'Chưa khen thưởng': '#dc3545',
//     'Không rõ': '#6c757d'
//   };

//   // Hàm xử lý gradient cho Pie chart (Chart.js không hỗ trợ trực tiếp chuỗi gradient, cần tạo canvas gradient)
//   function getColor(label: string, ctx: CanvasRenderingContext2D) {
//     if (label === 'Đang phê duyệt' || label === 'Đang xét') {
//       const gradient = ctx.createLinearGradient(0, 0, 120, 0);
//       gradient.addColorStop(0, '#facc15');
//       gradient.addColorStop(1, '#fbbf24');
//       return gradient;
//     }
//     return colorMap[label] || '#6c757d';
//   }

//   // Responsive height
//   const chartHeight = small
//     ? (typeof window !== 'undefined' && window.innerWidth < 576 ? 180 : 220)
//     : (typeof window !== 'undefined' && window.innerWidth < 576 ? 240 : 400);

//   return (
//     <div className="card h-100 shadow-sm border-0">
//       <div className="card-header fw-bold bg-white border-0" style={{ fontSize: 18 }}>
//         Thống kê khen thưởng
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
//           maxWidth: small ? 220 : 320,
//           margin: '0 auto'
//         }}>
//           <Pie
//             data={{
//               labels,
//               datasets: [{
//                 data: values,
//                 backgroundColor: (context: any) => {
//                   const label = labels[context.dataIndex];
//                   const ctx = context.chart.ctx;
//                   return getColor(label, ctx);
//                 }
//               }]
//             }}
//             options={{
//               plugins: { legend: { display: false } },
//               maintainAspectRatio: false,
//               responsive: true
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
//           {labels.map((label, idx) => (
//             <span key={label} className="d-flex align-items-center mb-1">
//               <span
//                 className="badge me-1"
//                 style={{
//                   background: (label === 'Đang phê duyệt' || label === 'Đang xét')
//                     ? 'linear-gradient(90deg, #facc15 0%, #fbbf24 100%)'
//                     : colorMap[label] || '#6c757d',
//                   width: 14,
//                   height: 14,
//                   display: "inline-block",
//                   borderRadius: 3,
//                   marginRight: 6
//                 }}
//               >
//                 &nbsp;
//               </span>
//               <span style={{ whiteSpace: 'nowrap' }}>{label} <b>{values[idx]}</b></span>
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ScriptableContext } from 'chart.js';
import type { Contest } from '@/lib/types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  data: Contest[];
  small?: boolean;
}

export default function AwardsPieChart({ data, small }: Props) {
  // Đếm số lượng theo trạng thái khen thưởng
  const counts = data.reduce<Record<string, number>>((acc, r) => {
    const key = r['Xét khen thưởng'] || 'Không rõ';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(counts);
  const values = labels.map(l => counts[l]);

  // Map trạng thái sang màu (gradient cho "Đang xét"/"Đang phê duyệt")
  const colorMap: Record<string, string> = {
    'Đã khen thưởng': '#198754',
    'Đang phê duyệt': 'gradient-yellow',
    'Đang xét': 'gradient-yellow',
    'Chưa khen thưởng': '#dc3545',
    'Không rõ': '#6c757d'
  };

  // Hàm xử lý gradient cho Pie chart (Chart.js không hỗ trợ trực tiếp chuỗi gradient, cần tạo canvas gradient)
  function getColor(label: string, ctx: CanvasRenderingContext2D) {
    if (label === 'Đang phê duyệt' || label === 'Đang xét') {
      const gradient = ctx.createLinearGradient(0, 0, 120, 0);
      gradient.addColorStop(0, '#facc15');
      gradient.addColorStop(1, '#fbbf24');
      return gradient;
    }
    return colorMap[label] || '#6c757d';
  }

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
                backgroundColor: (context: ScriptableContext<'pie' | 'doughnut'>) => {
                  const label = labels[context.dataIndex];
                  const ctx = context.chart.ctx;
                  return getColor(label, ctx);
                }
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
                  background: (label === 'Đang phê duyệt' || label === 'Đang xét')
                    ? 'linear-gradient(90deg, #facc15 0%, #fbbf24 100%)'
                    : colorMap[label] || '#6c757d',
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