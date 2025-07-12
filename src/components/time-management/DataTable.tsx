// src/components/time-management/DataTable.tsx
'use client'

import { useState, useMemo } from 'react'
import type { TimeManagement } from '@/lib/types'

interface Props {
  items: TimeManagement[]
}

const PAGE_SIZE = 3
const ROW_COLORS = [
  'table-row-blue',
  'table-row-purple',
  'table-row-cyan',
  'table-row-gray',
]

export default function DataTable({ items }: Props) {
  const [page, setPage] = useState(1)
  const totalPage = Math.ceil(items.length / PAGE_SIZE)

  // cắt dữ liệu theo trang
  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return items.slice(start, start + PAGE_SIZE)
  }, [items, page])

  // nếu page vượt quá, reset về cuối
  if (page > totalPage && totalPage > 0) setPage(totalPage)

  return (
    <div className="modern-table-outer">
      <div className="modern-table-header px-4 pt-4 pb-2">
        <h4 className="fw-bold mb-1" style={{ color: '#2563eb', letterSpacing: 1 }}>
          Thông tin chi tiết
        </h4>
        <div className="text-secondary" style={{ fontSize: 15 }}>
          Danh sách các cuộc thi, thời gian, thông tin nộp bài và link.
        </div>
      </div>

      <div className="table-responsive">
        <table className="table modern-table align-middle mb-0">
          <thead>
            <tr>
              <th className="rounded-start">STT</th>
              <th>Tên cuộc thi</th>
              <th>Giảng viên</th>
              <th>Thành viên</th>
              <th>Thời gian bắt đầu</th>
              <th>Hạn cuối nộp bài</th>
              <th>Thông tin nộp bài</th>
              <th className="rounded-end">Link cuộc thi</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  Không có dữ liệu.
                </td>
              </tr>
            )}

            {paged.map((r, i) => (
              <tr key={i} className={ROW_COLORS[i % ROW_COLORS.length]}>
                <td className="fw-bold text-primary">{r.STT}</td>
                <td style={{ maxWidth: 200 }}>{r['Tên cuộc thi']}</td>
                <td>{r['Giảng Viên']}</td>
                <td style={{ whiteSpace: 'pre-wrap', maxWidth: 200 }}>
                  {r['Thành viên']}
                </td>
                <td>{r['Thời gian bắt đầu']}</td>
                <td>{r['Hạn cuối nộp bài']}</td>
                <td style={{ maxWidth: 200 }}>{r['Thông tin nộp bài']}</td>
                <td>
                  {r['Link cuộc thi'] ? (
                    <a
                      href={r['Link cuộc thi']}
                      target="_blank"
                      rel="noreferrer"
                      className="fw-semibold link-primary"
                    >
                      Xem
                    </a>
                  ) : (
                    '–'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPage > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center mb-0 flex-wrap">
            {/* Về đầu */}
            <li className={`page-item${page === 1 ? ' disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(1)}>
                &laquo;
              </button>
            </li>
            {/* Lùi 1 */}
            <li className={`page-item${page === 1 ? ' disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                &lsaquo;
              </button>
            </li>
            {/* Số trang */}
            {(() => {
              const maxShow = 7
              let start = Math.max(1, page - Math.floor(maxShow / 2))
              let end = start + maxShow - 1
              if (end > totalPage) {
                end = totalPage
                start = Math.max(1, end - maxShow + 1)
              }
              const pages = []
              for (let p = start; p <= end; p++) {
                pages.push(
                  <li
                    key={p}
                    className={`page-item${p === page ? ' active' : ''}`}
                  >
                    <button className="page-link" onClick={() => setPage(p)}>
                      {p}
                    </button>
                  </li>
                )
              }
              return pages
            })()}
            {/* Tiến 1 */}
            <li className={`page-item${page === totalPage ? ' disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
              >
                &rsaquo;
              </button>
            </li>
            {/* Về cuối */}
            <li className={`page-item${page === totalPage ? ' disabled' : ''}`}>
              <button className="page-link" onClick={() => setPage(totalPage)}>
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  )
}
