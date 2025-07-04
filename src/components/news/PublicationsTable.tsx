'use client';

import React, { useState, useMemo } from 'react';
import type { Publication } from '@/lib/types';

interface Props { data: Publication[] }
const PAGE_SIZE = 4;

export default function PublicationsTable({ data }: Props) {
  const [page, setPage] = useState(1);
  const totalPage = Math.ceil(data.length / PAGE_SIZE);

  const paged = useMemo(
    () => data.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE),
    [data, page]
  );

  function renderStatus(status?: string) {
    const s = (status || '').toLowerCase();
    if (s.includes('đã đăng') || s.includes('đã khen thưởng')) {
      return (
        <span
          className="badge badge-modern"
          style={{
            background: 'linear-gradient(90deg, #4ade80 0%, #22d3ee 100%)',
            color: '#fff'
          }}
        >
          {status}
        </span>
      );
    }
    if (s.includes('đang xét') || s.includes('đang phê duyệt')) {
      return (
        <span
          className="badge badge-modern"
          style={{
            background: 'linear-gradient(90deg, #facc15 0%, #fbbf24 100%)',
            color: '#fff'
          }}
        >
          {status}
        </span>
      );
    }
    if (s.includes('chưa đăng') || s.includes('chưa khen thưởng')) {
      return (
        <span
          className="badge badge-modern"
          style={{
            background: 'linear-gradient(90deg, #f87171 0%, #f43f5e 100%)',
            color: '#fff'
          }}
        >
          {status}
        </span>
      );
    }
    return (
      <span className="badge badge-modern bg-secondary" style={{ color: '#222' }}>
        {status || 'Không rõ'}
      </span>
    );
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header rounded-top bg-primary bg-opacity-10 text-primary border-0 px-4 py-3">
        <h5 className="mb-0">Chi tiết bài báo</h5>
      </div>

      <div className="table-responsive">
        <table className="table mb-0 align-middle">
          <thead>
            <tr className="bg-primary bg-opacity-10">
              {[
                'STT','Tên bài báo','Thành viên','Tác giả 1',
                'Thời gian','Nơi đăng','Mã số ISSN','Quốc gia',
                'Trạng thái','Minh chứng'
              ].map(h => (
                <th key={h} className="text-primary">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((r, i) => (
              <tr key={i}>
                <td>{r.STT}</td>
                <td style={{width:'350px'}}>{r['Tên bài báo']}</td>
                <td style={{ whiteSpace:'pre-line', width:'200px' }}>{r['Thành viên']}</td>
                <td style={{width:'200px'}}>{r['Tác giả 1']}</td>
                <td>{r['Thời gian']}</td>
                <td>{r['Nơi đăng']}</td>
                <td>{r['Mã số ISSN']}</td>
                <td>{r['Quốc gia']}</td>
                <td>{renderStatus(r['Trạng thái'])}</td>
                <td>
                  {r['Minh chứng'] && (
                    <a
                      href={r['Minh chứng']}
                      target="_blank"
                      rel="noreferrer"
                      className="link-primary fw-semibold"
                    >
                      Link
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPage > 1 && (
        <nav className="my-3">
          <ul className="pagination justify-content-center mb-0">
            <li className={`page-item${page===1?' disabled':''}`}>
              <button
                className="page-link bg-primary bg-opacity-10 text-primary border-0"
                onClick={()=>setPage(p=>Math.max(1,p-1))}
              >&laquo;</button>
            </li>
            {Array.from({ length: totalPage }).map((_, idx) => (
              <li key={idx} className={`page-item${page===idx+1?' active':''}`}>
                <button
                  className={`page-link ${page===idx+1 ? 'bg-primary text-white' : 'bg-primary bg-opacity-10 text-primary'} border-0`}
                  onClick={()=>setPage(idx+1)}
                >
                  {idx+1}
                </button>
              </li>
            ))}
            <li className={`page-item${page===totalPage?' disabled':''}`}>
              <button
                className="page-link bg-primary bg-opacity-10 text-primary border-0"
                onClick={()=>setPage(p=>Math.min(totalPage,p+1))}
              >&raquo;</button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
