'use client'

import React, { useMemo, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface TimeManagement {
  'Thời gian bắt đầu'?: string
}

interface Props {
  items: TimeManagement[]
}

export default function MonthlyStartLineChart({ items }: Props) {
  const chartRef = useRef<ChartJS<'line'>>(null)

  // Chỉ đếm những cuộc thi khởi động trong năm 2025
  const { labels, data } = useMemo(() => {
    const counts: Record<string, number> = {}
    const formats = ['D/M/YYYY','DD/MM/YYYY','YYYY-MM-DD','YYYY/MM/DD']
    items.forEach(it => {
      const raw = it['Thời gian bắt đầu'] || ''
      const d = dayjs(raw, formats, true)
      if (d.isValid() && d.year() === 2025) {
        const key = d.format('YYYY-MM')
        counts[key] = (counts[key] || 0) + 1
      }
    })
    const months = Object.keys(counts).sort()
    return {
      labels: months,
      data: months.map(m => counts[m])
    }
  }, [items])

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Cuộc thi khởi động theo tháng (2025)' }
    },
    scales: {
      x: {
        title: { display: true, text: 'Tháng (YYYY-MM)' }
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Số cuộc thi' },
        ticks: { stepSize: 1 }
      }
    }
  }

  const chartData: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: 'Số cuộc thi',
        data,
        borderColor: '#338aff',
        backgroundColor: 'rgba(51,138,255,0.2)',
        tension: 0.3
      }
    ]
  }

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body p-0" style={{ height: '300px' }}>
        <Line
          ref={chartRef}
          data={chartData}
          options={options}
        />
      </div>
    </div>
  )
}
