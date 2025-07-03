'use client';
import { useState, useMemo } from 'react';
import type { Contest } from '@/lib/types';

interface Props { data: Contest[] }
const PAGE_SIZE = 3;

export default function ContestsTable({ data }: Props) {
  const [page, setPage] = useState(1);
  const totalPage = Math.ceil(data.length / PAGE_SIZE);

  const pagedData = useMemo(
    () => data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [data, page]
  );

  if (page > totalPage && totalPage > 0) setPage(totalPage);

  // Màu nền từng dòng (theo index)
  const rowColors = [
    'table-row-blue',
    'table-row-purple',
    'table-row-cyan',
    'table-row-gray'
  ];

  // Badge trạng thái
function renderStatus(status: string) {
  const s = (status || '').toLowerCase();
  if (s.includes('đã khen thưởng')) return <span className="badge badge-modern bg-success">Đã khen thưởng</span>;
  if (s.includes('đang phê duyệt') || s.includes('đang xét')) {
    return (
      <span
        className="badge badge-modern"
        style={{
          background: 'linear-gradient(90deg, #facc15 0%, #fbbf24 100%)',
          color: '#fff'
        }}
      >
        Đang xét
      </span>
    );
  }
  if (s.includes('chưa khen thưởng')) return <span className="badge badge-modern bg-danger">Chưa khen thưởng</span>;
  return <span className="badge badge-modern bg-secondary">{status || 'Không rõ'}</span>;
}

  return (
    <div className="modern-table-outer">
      <div className="modern-table-header px-4 pt-4 pb-2">
        <h4 className="fw-bold mb-1" style={{ color: '#2563eb', letterSpacing: 1 }}>Quản lí dự án NCKH</h4>
        <div className="text-secondary" style={{ fontSize: 15 }}>
          Danh sách các đề tài, thành viên, chủ nhiệm và trạng thái khen thưởng.
        </div>
      </div>
      <div className="table-responsive">
        <table className="table modern-table align-middle mb-0">
          <thead>
            <tr>
              <th className="rounded-start">STT</th>
              <th>Tên đề tài</th>
              <th>Thành viên</th>
              <th>Chủ nhiệm</th>
              <th>Thời gian</th>
              <th>Giải thưởng</th>
              <th>Đạt giải</th>
              <th>Trạng thái</th>
              <th className="rounded-end">Minh chứng</th>
            </tr>
          </thead>
          <tbody>
            {pagedData.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-4">Không có dữ liệu.</td>
              </tr>
            )}
            {pagedData.map((r, i) => (
              <tr key={i} className={rowColors[i % rowColors.length]}>
                <td className="fw-bold text-primary">{r.STT || ''}</td>
                <td style={{ maxWidth: 180 }}>{r['Tên đề tài'] || ''}</td>
                <td style={{ maxWidth: 300 }}>{r['Thành viên'] || ''}</td>
                <td>{r['Chủ nhiệm'] || ''}</td>
                <td>{r['Thời gian'] || ''}</td>
                <td style={{ maxWidth: 140 }}>{r['Giải thưởng tham gia'] || ''}</td>
                <td>{r['Đạt giải'] || ''}</td>
                <td>{renderStatus(r['Xét khen thưởng'])}</td>
                <td>{r['Minh chứng'] || ''}</td>
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
            <li className={`page-item${page === 1 ? " disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(1)}>&laquo;</button>
            </li>
            {/* Lùi 1 trang */}
            <li className={`page-item${page === 1 ? " disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(page - 1)}>&lsaquo;</button>
            </li>
            {/* Số trang động, tối đa 7 */}
            {(() => {
              const maxPage = 7;
              let start = Math.max(1, page - Math.floor(maxPage / 2));
              let end = start + maxPage - 1;
              if (end > totalPage) {
                end = totalPage;
                start = Math.max(1, end - maxPage + 1);
              }
              const pages = [];
              for (let i = start; i <= end; i++) {
                pages.push(
                  <li key={i} className={`page-item${page === i ? " active" : ""}`}>
                    <button className="page-link" onClick={() => setPage(i)}>{i}</button>
                  </li>
                );
              }
              return pages;
            })()}
            {/* Tiến 1 trang */}
            <li className={`page-item${page === totalPage ? " disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(page + 1)}>&rsaquo;</button>
            </li>
            {/* Về cuối */}
            <li className={`page-item${page === totalPage ? " disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(totalPage)}>&raquo;</button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}