// src/components/time-management/SummaryCards.tsx
'use client'

import React from 'react'
import type { TimeManagement } from '@/lib/types'

interface Props {
  items: TimeManagement[]
}

const CARD_COLORS = [
  'linear-gradient(135deg, #a18fff 0%, #6f7cff 100%)',
  'linear-gradient(135deg, #5fd0ff 0%, #338aff 100%)',
  'linear-gradient(135deg, #ffb199 0%, #ff6f61 100%)'
]

const ICONS = [
  'bi-list-check',     // Tổng cuộc thi
  'bi-person-badge',   // Tổng giảng viên
  'bi-people-fill'     // Tổng thành viên
]

const LABELS = [
  'TỔNG CUỘC THI',
  'TỔNG GIẢNG VIÊN',
  'TỔNG THÀNH VIÊN'
]

export default function SummaryCards({ items }: Props) {
  // 1) Tổng cuộc thi
  const totalContests = items.length

  // 2) Tổng giảng viên (unique)
  const lecturerSet = new Set<string>()
  items.forEach(it => {
    const name = it['Giảng Viên']?.trim()  // đảm bảo key đúng
    if (name) lecturerSet.add(name)
  })
  const totalLecturers = lecturerSet.size

  // 3) Tổng thành viên (unique across all items)
  const memberSet = new Set<string>()
  items.forEach(it => {
    (it['Thành viên'] || '')
      .split(/\r?\n/)
      .map(n => n.trim())
      .filter(Boolean)
      .forEach(n => memberSet.add(n))
  })
  const totalMembers = memberSet.size

  const values = [totalContests, totalLecturers, totalMembers]

  return (
    <div className="row g-4 mb-4">
      {values.map((value, idx) => (
        <div key={idx} className="col-12 col-sm-6 col-lg-4">
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
                background: CARD_COLORS[idx],
                boxShadow: '0 2px 8px rgba(51,138,255,0.10)'
              }}
            >
              <i
                className={`bi ${ICONS[idx]}`}
                style={{ color: '#fff', fontSize: 28 }}
              />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 22, color: '#222', lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ fontSize: 14, color: '#338aff', fontWeight: 500, letterSpacing: 0.5 }}>
                {LABELS[idx]}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
