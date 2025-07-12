/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/time-management/TimelineBootstrap.tsx
'use client'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  TooltipItem,
} from 'chart.js'

dayjs.extend(customParseFormat)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend)

interface TimeManagement {
  'Tên cuộc thi'?: string
  'Thời gian bắt đầu'?: string
  'Hạn cuối nộp bài'?: string
}

interface Props {
  items: TimeManagement[]
}

export default function TimelineBootstrap({ items }: Props) {
  const today    = dayjs()
  const todayStr = today.format('DD/MM/YYYY')
  const weekday  = today.format('dddd')

  // Khai báo mutable array để tránh lỗi readonly
  const DATE_FORMATS: string[] = ['D/M/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'YYYY/MM/DD']

  const [upcomingPage,   setUpcomingPage]   = useState(1)
  const [ongoingPage,    setOngoingPage]    = useState(1)
  const [completedPage,  setCompletedPage]  = useState(1)
  const itemsPerPage = 3

  // Chuẩn hóa & tính toán
  const data = items.map(it => {
    const parse = (s: string) => dayjs(s, DATE_FORMATS, true)
    const start = parse(it['Thời gian bắt đầu'] || '')
    const end   = parse(it['Hạn cuối nộp bài']   || '')
    const ok    = start.isValid() && end.isValid()

    let status: 'upcoming'|'ongoing'|'completed'|'invalid' = 'invalid'
    let daysUntilStart = NaN
    let daysLeft       = NaN
    let daysSinceEnd   = NaN
    let pct            = 0

    if (ok) {
      if (today.isBefore(start)) {
        status = 'upcoming'
        daysUntilStart = start.diff(today,'day')
      } else if (today.isAfter(end)) {
        status = 'completed'
        daysSinceEnd = today.diff(end,'day')
        pct = 100
      } else {
        status = 'ongoing'
        const total   = Math.max(end.diff(start,'day'),1)
        const elapsed = today.diff(start,'day')
        pct       = Math.round((elapsed/total)*100)
        daysLeft  = end.diff(today,'day')
      }
    }

    return {
      title: it['Tên cuộc thi'] || '—',
      start: ok ? start.format('DD/MM/YYYY') : '—',
      end:   ok ? end  .format('DD/MM/YYYY') : '—',
      status,
      daysUntilStart,
      daysLeft,
      daysSinceEnd,
      pct
    }
  })

  const upcoming  = data.filter(x => x.status === 'upcoming')
  const ongoing   = data.filter(x => x.status === 'ongoing')
  const completed = data.filter(x => x.status === 'completed')

  // Cấu hình biểu đồ
  const chartData = {
    labels: ['Sắp diễn ra','Đang diễn ra','Đã hoàn thành'],
    datasets: [{
      label: 'Số lượng cuộc thi',
      data: [upcoming.length, ongoing.length, completed.length],
      backgroundColor: ['#ffc107','#17a2b8','#28a745'],
      borderColor:     ['#e0a800','#138496','#218838'],
      borderWidth: 1
    }]
  }
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title:  { display: true, text: 'Tổng quan', font: { size: 16 } },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<'bar'>) =>
            `${ctx.dataset.label}: ${ctx.parsed.y}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks:        { stepSize: 1, font: { size: 14 } },
        title:        { display: true, text: 'Số cuộc thi', font: { size: 14 } }
      },
      x: {
        ticks: { font: { size: 14 } }
      }
    }
  }

  // Phân trang
  const paginate = (arr: typeof data, page: number) =>
    arr.slice((page - 1) * itemsPerPage, page * itemsPerPage)
  const totalPages = (arr: any[]) => Math.ceil(arr.length / itemsPerPage)

  return (
    <div className="container my-4">
      {/* Header Hôm nay */}
      <div className="text-center mb-4">
        <h2 className="fs-4 fw-bold text-primary">Hôm nay: {todayStr}</h2>
        <p className="text-muted small">{weekday}</p>
      </div>

      <div className="row g-4">
        {/* Chart cột trái */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body p-3 d-flex flex-column">
              <div className="flex-grow-1" style={{ height: '300px' }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách sự kiện cột phải */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body p-3 d-flex flex-column">
              {/* Upcoming */}
              {upcoming.length > 0 && (
                <section className="mb-4 flex-grow-1">
                  <h3 className="h5 mb-2 text-warning">
                    Sắp diễn ra ({upcoming.length})
                  </h3>
                  <div className="row g-2">
                    {paginate(upcoming, upcomingPage).map((it, idx) => (
                      <div key={idx} className="col-12">
                        <div className="card shadow-sm border-warning">
                          <div className="card-body p-2">
                            <h5 className="fs-6 mb-1">{it.title}</h5>
                            <p className="small mb-1">
                              <i className="bi bi-calendar-event me-1" />
                              {it.start} - {it.end}
                            </p>
                            <p className="text-warning small mb-0">
                              <i className="bi bi-hourglass-split me-1" />
                              Bắt đầu sau {it.daysUntilStart} ngày
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {totalPages(upcoming) > 1 && (
                    <nav className="mt-2">
                      <ul className="pagination pagination-sm justify-content-center">
                        {Array.from({ length: totalPages(upcoming) }, (_, i) => i + 1).map(p => (
                          <li key={p} className={`page-item${upcomingPage === p ? ' active' : ''}`}>
                            <button className="page-link" onClick={() => setUpcomingPage(p)}>
                              {p}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  )}
                </section>
              )}

              {/* Ongoing */}
              {ongoing.length > 0 && (
                <section className="mb-4 flex-grow-1">
                  <h3 className="h5 mb-2 text-info">
                    Đang diễn ra ({ongoing.length})
                  </h3>
                  <div className="row g-2">
                    {paginate(ongoing, ongoingPage).map((it, idx) => (
                      <div key={idx} className="col-12">
                        <div className="card shadow-sm border-info">
                          <div className="card-body p-2">
                            <h5 className="fs-6 mb-1">{it.title}</h5>
                            <p className="small mb-1">
                              <i className="bi bi-calendar-event me-1" />
                              {it.start} - {it.end}
                            </p>
                            <div className="progress mb-1" style={{ height: '12px' }}>
                              <div
                                className="progress-bar bg-info"
                                role="progressbar"
                                style={{ width: `${it.pct}%` }}
                                aria-valuenow={it.pct}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              >
                                <span className="small">{it.pct}%</span>
                              </div>
                            </div>
                            <p className="text-info small mb-0">
                              <i className="bi bi-clock me-1" />
                              Còn {it.daysLeft} ngày
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {totalPages(ongoing) > 1 && (
                    <nav className="mt-2">
                      <ul className="pagination pagination-sm justify-content-center">
                        {Array.from({ length: totalPages(ongoing) }, (_, i) => i + 1).map(p => (
                          <li key={p} className={`page-item${ongoingPage === p ? ' active' : ''}`}>
                            <button className="page-link" onClick={() => setOngoingPage(p)}>
                              {p}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  )}
                </section>
              )}

              {/* Completed */}
              {completed.length > 0 && (
                <section className="flex-grow-1">
                  <h3 className="h5 mb-2 text-success">
                    Đã hoàn thành ({completed.length})
                  </h3>
                  <div className="row g-2">
                    {paginate(completed, completedPage).map((it, idx) => (
                      <div key={idx} className="col-12">
                        <div className="card shadow-sm border-success">
                          <div className="card-body p-2">
                            <h5 className="fs-6 mb-1">{it.title}</h5>
                            <p className="small mb-1">
                              <i className="bi bi-calendar-event me-1" />
                              {it.start} - {it.end}
                            </p>
                            <p className="text-success small mb-0">
                              <i className="bi bi-check-circle me-1" />
                              Hoàn thành {it.daysSinceEnd} ngày trước
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {totalPages(completed) > 1 && (
                    <nav className="mt-2">
                      <ul className="pagination pagination-sm justify-content-center">
                        {Array.from({ length: totalPages(completed) }, (_, i) => i + 1).map(p => (
                          <li key={p} className={`page-item${completedPage === p ? ' active' : ''}`}>
                            <button className="page-link" onClick={() => setCompletedPage(p)}>
                              {p}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  )}
                </section>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
