// 'use client'

// import React, { useState, useMemo } from 'react'
// import type { Transfer } from '@/lib/types'

// interface Props { data: Transfer[] }
// const PAGE_SIZE = 5

// export default function TransfersTable({ data }: Props) {
//   const [page, setPage] = useState(1)
//   const totalPage = Math.ceil(data.length / PAGE_SIZE)

//   // chia trang
//   const paged = useMemo(() => {
//     const start = (page - 1) * PAGE_SIZE
//     return data.slice(start, start + PAGE_SIZE)
//   }, [data, page])

//   if (page > totalPage && totalPage > 0) setPage(totalPage)

//   const rowColors = ['table-row-blue','table-row-purple','table-row-cyan','table-row-gray']
//   const pctKey = '% kinh phí đã trích về trường xuất hoá đơn VAT'

//   return (
//     <div className="modern-table-outer">
//       <div className="modern-table-header px-4 pt-4 pb-2">
//         <h4 className="fw-bold mb-1" style={{ color: '#2563eb', letterSpacing: 1 }}>
//           Quản lý Chuyển giao Công nghệ
//         </h4>
//         <div className="text-secondary" style={{ fontSize: 15 }}>
//           Danh sách hợp đồng, giá trị và minh chứng.
//         </div>
//       </div>

//       <div className="table-responsive">
//         <table className="table modern-table align-middle mb-0">
//           <thead>
//             <tr>
//               {[
//                 'TT',
//                 'Tên đơn vị nhận chuyển giao',
//                 'Số hợp đồng/ PO',
//                 'Ngày hợp đồng/PO',
//                 'Nội dung Hợp đồng/PO',
//                 'Giá trị trước thuế',
//                 pctKey,
//                 'Số tiền đề nghị khen thưởng',
//                 'Minh chứng'
//               ].map(h => (
//                 <th key={h} className="text-nowrap">{h}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {paged.length === 0
//               ? <tr>
//                   <td colSpan={9} className="text-center py-4">Không có dữ liệu.</td>
//                 </tr>
//               : paged.map((r, i) => (
//                   <tr key={i} className={rowColors[i % rowColors.length]}>
//                     <td className="fw-bold text-primary">{r.TT}</td>
//                     <td style={{ maxWidth:200 }} className="text-truncate">
//                       {r['Tên đơn vị nhận chuyển giao']}
//                     </td>
//                     <td>{r['Số hợp đồng/ PO']}</td>
//                     <td>{r['Ngày hợp đồng/PO']}</td>
//                     <td style={{ maxWidth:300 }} className="text-truncate">
//                       {r['Nội dung Hợp đồng/PO']}
//                     </td>
//                     <td>{r['Giá trị hợp đồng trước thuế (đồng)']}</td>
//                     <td>{r[pctKey]}</td>
//                     <td>{r['Số tiền đề nghị khen thưởng']}</td>
//                     <td>
//                       {r['Minh chứng']
//                         ? (
//                           <a
//                             href={r['Minh chứng']}
//                             target="_blank"
//                             rel="noreferrer"
//                             className="link-primary fw-semibold"
//                           >
//                             Link
//                           </a>
//                         )
//                         : (
//                           <span className="text-muted">—</span>
//                         )
//                       }
//                     </td>
//                   </tr>
//                 ))
//             }
//           </tbody>
//         </table>
//       </div>

//       {totalPage > 1 && (
//         <nav className="mt-3">
//           <ul className="pagination justify-content-center mb-0 flex-wrap">
//             <li className={`page-item${page===1?' disabled':''}`}>
//               <button className="page-link" onClick={()=>setPage(1)}>&laquo;</button>
//             </li>
//             <li className={`page-item${page===1?' disabled':''}`}>
//               <button className="page-link" onClick={()=>setPage(p=>p-1)}>&lsaquo;</button>
//             </li>
//             {Array.from({ length: totalPage }, (_, idx) => (
//               <li key={idx+1} className={`page-item${page===idx+1?' active':''}`}>
//                 <button className="page-link" onClick={()=>setPage(idx+1)}>
//                   {idx+1}
//                 </button>
//               </li>
//             ))}
//             <li className={`page-item${page===totalPage?' disabled':''}`}>
//               <button className="page-link" onClick={()=>setPage(p=>p+1)}>&rsaquo;</button>
//             </li>
//             <li className={`page-item${page===totalPage?' disabled':''}`}>
//               <button className="page-link" onClick={()=>setPage(totalPage)}>&raquo;</button>
//             </li>
//           </ul>
//         </nav>
//       )}
//     </div>
//   )
// }

'use client'

import React, { useState, useMemo } from 'react'
import type { Transfer } from '@/lib/types'

interface Props { data: Transfer[] }
const PAGE_SIZE = 5

export default function TransfersTable({ data }: Props) {
  const [page, setPage] = useState(1)
  const totalPage = Math.ceil(data.length / PAGE_SIZE)

  // Dùng đúng key theo interface Transfer
  const pctKey = '% kinh phí đã trích về trường xuất hoá đơn VAT'

  // Phân trang
  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return data.slice(start, start + PAGE_SIZE)
  }, [data, page])

  // Nếu page vượt, reset lại
  if (page > totalPage && totalPage > 0) setPage(totalPage)

  const rowColors = ['table-row-blue', 'table-row-purple', 'table-row-cyan', 'table-row-gray']

  return (
    <div className="modern-table-outer">
      <div className="modern-table-header px-4 pt-4 pb-2">
        <h4 className="fw-bold mb-1" style={{ color: '#2563eb', letterSpacing: 1 }}>
          Quản lý Chuyển giao Công nghệ
        </h4>
        <div className="text-secondary" style={{ fontSize: 15 }}>
          Danh sách hợp đồng, giá trị và minh chứng.
        </div>
      </div>

      <div className="table-responsive">
        <table className="table modern-table align-middle mb-0">
          <thead>
            <tr>
              {[
                'TT',
                'Tên đơn vị nhận chuyển giao',
                'Số hợp đồng/ PO',
                'Ngày hợp đồng/PO',
                'Nội dung Hợp đồng/ PO',
                'Giá trị trước thuế',
                pctKey,
                'Số tiền đề nghị khen thưởng',
                'Minh chứng'
              ].map(h => (
                <th key={h} className="text-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0
              ? <tr>
                  <td colSpan={9} className="text-center py-4">Không có dữ liệu.</td>
                </tr>
              : paged.map((r, i) => (
                  <tr key={i} className={rowColors[i % rowColors.length]}>
                    <td className="fw-bold text-primary">{r.TT}</td>
                    <td style={{ maxWidth: 200 }} className="text-truncate">
                      {r['Tên đơn vị nhận chuyển giao']}
                    </td>
                    <td>{r['Số hợp đồng/ PO']}</td>
                    <td>{r['Ngày hợp đồng/PO']}</td>
                    <td style={{ maxWidth: 300 }} className="text-truncate">
                      {r['Nội dung Hợp đồng/PO']}
                    </td>
                    <td>{r['Giá trị hợp đồng trước thuế (đồng)']}</td>
                    <td>{r[pctKey]}</td>
                    <td>{r['Số tiền đề nghị khen thưởng']}</td>
                    <td>
                      {r['Minh chứng']
                        ? (
                          <a
                            href={r['Minh chứng']}
                            target="_blank"
                            rel="noreferrer"
                            className="link-primary fw-semibold"
                          >
                            Link
                          </a>
                        )
                        : <span className="text-secondary">—</span>
                      }
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {totalPage > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center mb-0 flex-wrap">
            <li className={`page-item${page === 1 ? ' disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(1)}>&laquo;</button>
            </li>
            <li className={`page-item${page === 1 ? ' disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(p => p - 1)}>&lsaquo;</button>
            </li>
            {Array.from({ length: totalPage }, (_, idx) => (
              <li key={idx + 1} className={`page-item${page === idx + 1 ? ' active' : ''}`}>
                <button className="page-link" onClick={() => setPage(idx + 1)}>
                  {idx + 1}
                </button>
              </li>
            ))}
            <li className={`page-item${page === totalPage ? ' disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(p => p + 1)}>&rsaquo;</button>
            </li>
            <li className={`page-item${page === totalPage ? ' disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(totalPage)}>&raquo;</button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  )
}
