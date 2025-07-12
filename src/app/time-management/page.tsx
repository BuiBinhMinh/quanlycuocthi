'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

import SummaryCards      from '@/components/time-management/SummaryCards'
import TimelineBootstrap from '@/components/time-management/TimelineBootstrap'
import DataTable         from '@/components/time-management/DataTable'
import type { TimeManagement } from '@/lib/types'

export default function TimeManagementPage() {
  const [items, setItems]     = useState<TimeManagement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/time-management')
      .then(res => {
        if (!res.ok) throw new Error(`Server error ${res.status}`)
        return res.json()
      })
      .then((data: TimeManagement[]) => setItems(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-5">Đang tải dữ liệu…</div>
  if (error)   return <div className="alert alert-danger my-5">{error}</div>

  return (
    <main className="container-fluid p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Quản lý thời gian cuộc thi</h2>
        <div className="d-flex align-items-center">
          <span className="me-2 text-secondary">Khoa CNTT</span>
          <Image
            src="https://scontent.fsgn15-1.fna.fbcdn.net/v/t39.30808-6/480960624_675682554814151_8091216706953034584_n.jpg"
            alt="Avatar Khoa CNTT"
            width={40}
            height={40}
            className="rounded-circle"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      </div>

      {/* Stats Cards */}
      <SummaryCards items={items} />

      {/* Timeline in a card */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card chart-card shadow-lg border-0 p-3">
            <TimelineBootstrap items={items} />
          </div>
        </div>
      </div>

      {/* Detail Table */}
      <div className="card mb-4">
        <div className="card-header bg-white border-bottom">
          <strong>Thông tin chi tiết cuộc thi</strong>
        </div>
        <div className="card-body p-0">
          <DataTable items={items} />
        </div>
      </div>
    </main>
  )
}
