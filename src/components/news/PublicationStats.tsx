'use client'

import React, { useMemo } from 'react'
import type { Publication } from '@/lib/types'

const CARD_COLORS = [
  'linear-gradient(135deg, #a18fff 0%, #6f7cff 100%)',
  'linear-gradient(135deg, #5fd0ff 0%, #338aff 100%)',
  'linear-gradient(135deg, #ffb199 0%, #ff6f61 100%)',
]

const ICONS = ['bi-journal-text', 'bi-people', 'bi-journal-check']
const LABELS = ['TỔNG BÀI BÁO', 'TỔNG TÁC GIẢ', 'TỔNG BÀI VIẾT ĐÃ ĐĂNG']

interface Props { data: Publication[] }

export default function PublicationStats({ data }: Props) {
  // 1) Tổng bài báo
  const totalPubs = data.length

  // 2) Tổng tác giả (từ "Tác giả 1")
  const totalAuthors = useMemo(() => {
    const s = new Set<string>()
    data.forEach(r => {
      (r['Tác giả 1'] || '')
        .split('\n')
        .map(t => t.trim())
        .filter(Boolean)
        .forEach(n => s.add(n))
    })
    return s.size
  }, [data])

  // 3) Tổng bài đã đăng (filter Trạng thái chứa "đã đăng")
  const totalPublished = useMemo(() => {
    return data.filter(r => {
      const st = (r['Trạng thái'] || '').toLowerCase()
      return st.includes('đã đăng')
    }).length
  }, [data])

  const values = [totalPubs, totalAuthors, totalPublished]

  return (
    <div className="row g-4 mb-4">
      {values.map((v, i) => (
        <div key={i} className="col-12 col-sm-6 col-lg-4">
          <div
            className="d-flex align-items-center px-4 py-3"
            style={{
              background: '#fff',
              borderRadius: 18,
              boxShadow: '0 4px 24px rgba(51,138,255,0.10)',
              minHeight: 90
            }}
          >
            <div
              className="d-flex align-items-center justify-content-center me-3"
              style={{
                width: 54,
                height: 54,
                borderRadius: 14,
                background: CARD_COLORS[i],
                boxShadow: '0 2px 8px rgba(51,138,255,0.10)'
              }}
            >
              <i className={`bi ${ICONS[i]}`} style={{ color: '#fff', fontSize: 28 }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 22, color: '#222', lineHeight: 1 }}>
                {v}
              </div>
              <div style={{ fontSize: 14, color: '#338aff', fontWeight: 500, letterSpacing: 0.5 }}>
                {LABELS[i]}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
