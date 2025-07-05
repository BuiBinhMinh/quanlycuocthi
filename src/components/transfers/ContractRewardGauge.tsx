'use client'
import React, { useMemo } from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  type ChartData,
  type ChartOptions,
  type Chart
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import type { Transfer } from '@/lib/types'

// Đăng ký các plugin cần thiết (KHÔNG register ChartDataLabels)
ChartJS.register(ArcElement, Tooltip, Legend, Title)

// custom plugin chỉ vẽ % ở giữa
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw(chart: Chart<'doughnut'>) {
    const { ctx, width, height, data } = chart
    const [reward, rest] = data.datasets[0].data as number[]
    const pct = Math.round((reward / (reward + rest)) * 100) || 0
    const txt = `${pct}%`

    ctx.save()
    ctx.font = 'bold 36px Arial'
    ctx.fillStyle = '#0d6efd'
    ctx.textBaseline = 'middle'
    const textX = (width - ctx.measureText(txt).width) / 2
    const textY = height / 2
    ctx.fillText(txt, textX, textY)
    ctx.restore()
  }
}

interface Props { data: Transfer[] }

export default function ContractRewardGauge({ data }: Props) {
  // Tính tổng hợp đồng và khen thưởng
  const { totalContract, totalReward } = useMemo(() => {
    const sums = data.reduce(
      (acc, r) => {
        acc.contract += Number(r['Tổng giá trị hợp đồng trước thuế'].replace(/\./g, '')) || 0
        acc.reward   += Number(r['Tổng Số tiền khen thưởng'].replace(/\./g, '')) || 0
        return acc
      },
      { contract: 0, reward: 0 }
    )
    return { totalContract: sums.contract, totalReward: sums.reward }
  }, [data])

  // Chuẩn bị data cho Doughnut
  const chartData: ChartData<'doughnut'> = {
    labels: ['Khen thưởng', 'Còn lại'],
    datasets: [
      {
        data: [totalReward, totalContract - totalReward],
        backgroundColor: ['#0d6efd', '#e9ecef'],
        borderWidth: 0,
        hoverOffset: 6
      }
    ]
  }

  // Cấu hình options
  const options: ChartOptions<'doughnut'> = {
    cutout: '70%',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Tỷ lệ khen thưởng trên hợp đồng',
        font: { size: 18, weight: 500 },
        padding: { bottom: 12 }
      },
      // Tắt hoàn toàn data labels
      datalabels: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: '#fff',
        titleColor: '#212529',
        bodyColor: '#495057',
        borderColor: 'rgba(13,110,253,0.3)',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          label: ctx => {
            const val = ctx.parsed as number
            return `${ctx.label}: ${val.toLocaleString('vi-VN')} ₫`
          }
        }
      },
      legend: { display: false }
    }
  }

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-white">
        <h5 className="mb-0">Tổng hợp hợp đồng &amp; khen thưởng</h5>
      </div>
      <div
        className="card-body d-flex flex-column align-items-center"
        style={{ height: 340 }}
      >
        <div style={{ width: 240, height: 240 }}>
          <Doughnut
            data={chartData}
            options={options}
            plugins={[centerTextPlugin]}
          />
        </div>

        <div className="d-flex justify-content-center gap-5 mt-4 w-100">
          <div className="text-center">
            <small className="text-muted d-block">
              Tổng giá trị hợp đồng trước thuế
            </small>
            <div className="h5 fw-bold text-dark">
              {totalContract.toLocaleString('vi-VN')} ₫
            </div>
          </div>
          <div className="text-center">
            <small className="text-muted d-block">
              Tổng số tiền khen thưởng
            </small>
            <div className="h5 fw-bold text-primary">
              {totalReward.toLocaleString('vi-VN')} ₫
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
