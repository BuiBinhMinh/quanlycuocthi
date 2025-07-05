export const dynamic = 'force-dynamic';

import React from 'react'
import TransferTimelineChart from '@/components/transfers/TransferTimelineChart'
import TransferValueBarChart from '@/components/transfers/ContractRewardGauge'
import TransfersTable from '@/components/transfers/TransfersTable'
import { fetchTransfers } from '@/lib/googleSheet'

export default async function TransfersPage() {
  // Lấy dữ liệu ngay trên server
  const transfers = await fetchTransfers()

  return (
    <main className="container-fluid py-4">
      <h2 className="mb-4">Quản lý Chuyển giao Công nghệ</h2>

      {/* Hai biểu đồ */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <TransferTimelineChart data={transfers} />
        </div>
        <div className="col-md-6">
          <TransferValueBarChart data={transfers} />
        </div>
      </div>

      {/* Bảng chi tiết */}
      <div className="card shadow-sm">
        <div className="card-body">
          <TransfersTable data={transfers} />
        </div>
      </div>
    </main>
  )
}