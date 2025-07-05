'use client'

import React, { useMemo, useRef, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
  type ChartOptions
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Line } from 'react-chartjs-2'
import type { Transfer } from '@/lib/types'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
  ChartDataLabels
)

interface Props { data: Transfer[] }

export default function TransferTimelineChart({ data }: Props) {
  const chartRef = useRef<ChartJS<'line'>>(null)

  // 1) Tìm key ngày
  const dateKey = useMemo<keyof Transfer>(() => {
    const keys = Object.keys(data[0] || {}) as (keyof Transfer)[]
    return keys.find(k => k.includes('Ngày') && k.includes('PO')) ?? 'Ngày hợp đồng/PO'
  }, [data])

  // 2) Tính labels & values
  const { labels, values } = useMemo(() => {
    const cnt: Record<string, number> = {}
    data.forEach(r => {
      const raw = String(r[dateKey] ?? '').trim()
      let year: string | null = null

      // ISO
      if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
        const d = new Date(raw)
        if (!isNaN(d.getTime())) year = `${d.getFullYear()}`
      }
      // dd/mm/yyyy
      if (!year && raw.includes('/')) {
        const parts = raw.split('/')
        if (parts[2]?.length === 4) year = parts[2]
      }
      // fallback
      if (!year) {
        const d2 = new Date(raw)
        if (!isNaN(d2.getTime())) year = `${d2.getFullYear()}`
      }

      const key = year || 'Khác'
      cnt[key] = (cnt[key] || 0) + 1
    })

    const yrs = Object.keys(cnt)
      .filter(y => y !== 'Khác')
      .sort((a, b) => +a - +b)
    if (cnt['Khác']) yrs.push('Khác')

    return { labels: yrs, values: yrs.map(y => cnt[y]) }
  }, [data, dateKey])

  // 3) Gradient fill
  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return
    const ctx = chart.ctx
    const grad = ctx.createLinearGradient(0, 0, 0, 200)
    grad.addColorStop(0, 'rgba(51,138,255,0.4)')
    grad.addColorStop(1, 'rgba(51,138,255,0.05)')
    chart.data.datasets[0].backgroundColor = grad
    chart.update()
  }, [labels, values])

  // 4) Options với datalabels hiển thị trên từng điểm
  const options: ChartOptions<'line'> = useMemo(() => ({
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
      title: { display: false },
      datalabels: {
        display: true,
        color: '#338aff',
        font: { size: 12, weight: 'bold' },
        anchor: 'end',
        align: 'top',
        formatter: (value: number) => `${value}`
      }
    },
    scales: {
      x: {
        grid: { display: false },
        title: { display: true, text: 'Năm', color: '#333' },
        ticks: { color: '#555' }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(200,200,200,0.1)' },
        title: { display: true, text: 'Số hợp đồng', color: '#333' },
        ticks: { stepSize: 1, color: '#555' }
      }
    }
  }), [])

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header">Số hợp đồng theo năm</div>
      <div className="card-body px-3 py-2" style={{ height: 350 }}>
        <Line
          ref={chartRef}
          data={{
            labels,
            datasets: [{
              label: 'Số hợp đồng',
              data: values,
              borderColor: '#338aff',
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#fff',
              pointBorderColor: '#338aff',
              pointRadius: 4,
              pointHoverRadius: 6
            }]
          }}
          options={options}
        />
        {/* Custom Legend */}
        <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
          <span
            style={{
              display: 'inline-block',
              width: 12,
              height: 2,
              backgroundColor: '#338aff'
            }}
          />
          <small className="text-secondary">Số hợp đồng ký theo năm</small>
        </div>
      </div>
    </div>
  )
}
