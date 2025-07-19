'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Pie, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  type ChartOptions,
  type ChartData
} from 'chart.js'

// Extend dayjs parsing
dayjs.extend(customParseFormat)
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, ChartTooltip, Legend)

interface TimeManagement {
  'Tên cuộc thi'?: string
  'Giảng Viên'?: string
  'Thời gian bắt đầu'?: string
  'Hạn cuối nộp bài'?: string
}

interface Props {
  items: TimeManagement[]
}

export default function TimelineBootstrap({ items }: Props) {
  const today = dayjs()
  const todayStr = today.format('DD/MM/YYYY')
  const weekday  = today.format('dddd')

  // helper parse: định dạng nằm trong callback, không cần deps
  const parseDate = useCallback((str?: string) =>
    dayjs(str || '', ['D/M/YYYY','DD/MM/YYYY','YYYY-MM-DD','YYYY/MM/DD'], true)
  , [])

  // enrich items
  const enriched = useMemo(() => items.map(it => {
    const start = parseDate(it['Thời gian bắt đầu'])
    const end   = parseDate(it['Hạn cuối nộp bài'])
    const valid = start.isValid() && end.isValid()
    const isCompleted = valid && end.isBefore(today,'day')
    const isOngoing   = valid && !isCompleted
      && (today.isSame(start,'day')||today.isAfter(start,'day'))
      && (today.isSame(end,'day')  ||today.isBefore(end,'day'))
    const isUpcoming = valid && today.isBefore(start,'day')
    const daysToEnd  = valid ? Math.max(end.diff(today,'day'),0) : NaN
    const expiringSoon = isOngoing && daysToEnd <= 7

    return {
      ...it,
      startStr: start.format('DD/MM/YYYY'),
      endStr:   end.format('DD/MM/YYYY'),
      isCompleted, isOngoing, isUpcoming, daysToEnd, expiringSoon
    }
  }), [items, today, parseDate])

  // counts
  const totalCompleted = enriched.filter(i=>i.isCompleted).length
  const totalOngoing   = enriched.filter(i=>i.isOngoing).length
  const totalUpcoming  = enriched.filter(i=>i.isUpcoming).length
  const expiringSoon   = enriched.filter(i=>i.expiringSoon).length

  // lecturer counts
  const lecturerCounts = useMemo(() => {
    return enriched.reduce<Record<string,number>>((acc,i)=>{
      const l = i['Giảng Viên']||'—'
      acc[l] = (acc[l]||0)+1
      return acc
    }, {})
  }, [enriched])
  const sortedLecturers = Object.entries(lecturerCounts).sort(([,a],[,b])=>b-a)

  // selected panel + pagination
  const [selected,setSelected] = useState<string|'EXPIRING'|null>(null)
  const [page,setPage] = useState(1)
  const pageSize = 4
  useEffect(()=>{ setPage(1) },[selected])

  // --- Pie ---
  const pieData = useMemo<ChartData<'pie'>>(() => ({
    labels:['Hoàn thành','Đang diễn ra','Sắp diễn ra'],
    datasets:[{
      data:[totalCompleted,totalOngoing,totalUpcoming],
      backgroundColor:['#00AA47','#17A2B8','#FFC107'],
      hoverOffset:6
    }]
  }),[totalCompleted,totalOngoing,totalUpcoming])

  const pieOpts: ChartOptions<'pie'> = {
    responsive:true, maintainAspectRatio:false,
    plugins:{
      legend:{ position:'bottom' },
      title:{ display:true, text:'Tình trạng cuộc thi', font:{ size:16, weight:600 } }
    }
  }

  // --- Bar: Khởi động 2025 ---
  const monthCounts = useMemo(()=> {
    const acc:Record<string,number> = {}
    enriched.forEach(i=>{
      const key = parseDate(i['Thời gian bắt đầu']).format('YYYY-MM')
      if (key.startsWith('2025')) acc[key] = (acc[key]||0)+1
    })
    return acc
  },[enriched, parseDate])
  const monthLabels = useMemo(() => Object.keys(monthCounts).sort(), [monthCounts])

  const barMonthData = useMemo<ChartData<'bar'>>(() => ({
    labels:monthLabels,
    datasets:[{
      label:'Số cuộc thi',
      data:monthLabels.map(m=>monthCounts[m]),
      backgroundColor:'#1a73e8',
      borderRadius:4,
      maxBarThickness:36
    }]
  }),[monthCounts, monthLabels])

  const barMonthOpts: ChartOptions<'bar'> = {
    responsive:true, maintainAspectRatio:false,
    plugins:{
      legend:{ display:false },
      title:{ display:true, text:'Khởi động 2025', font:{ size:16, weight:600 } }
    },
    scales:{ y:{ beginAtZero:true, ticks:{ stepSize:1 } } }
  }

  return (
    <div className="w-100 p-4 bg-white rounded">

      {/* Header */}
      <div className="text-center mb-4">
        <h4 className="text-primary mb-1">Hôm nay: {todayStr}</h4>
        <small className="text-muted">{weekday}</small>
      </div>

      {/* Stat Cards */}
      <div className="row g-4 mb-4">
        <StatCard icon="people-fill" label="Tổng diễn ra" value={totalOngoing}
          onClick={()=>setSelected(null)} />
        <StatCard icon="exclamation-circle-fill" color="danger"
          label="Sắp hết hạn" sub="trong 7 ngày" value={expiringSoon}
          onClick={()=>setSelected(selected==='EXPIRING'?null:'EXPIRING')} />
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-3">
              <h6 className="text-uppercase text-muted mb-2">Giảng viên & số cuộc thi</h6>
              <ul className="list-unstyled mb-0">
                {sortedLecturers.map(([l,c])=>(
                  <li key={l}
                      className="d-flex justify-content-between align-items-center py-1"
                      style={{cursor:'pointer'}}
                      onClick={()=>setSelected(selected===l?null:l)}>
                    <span>{l}</span>
                    <span className="badge bg-secondary rounded-pill">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Panels */}
      {selected==='EXPIRING' && (
        <DetailPanel title="Cuộc thi sắp hết hạn">
          {enriched.filter(i=>i.expiringSoon).map((i,idx)=>(
            <PanelRow key={idx}
              title={i['Tên cuộc thi']!}
              subtitle={`Hạn: ${i.endStr}`}
              badge={{text:`Còn ${i.daysToEnd} ngày`, color:'warning'}} />
          ))}
        </DetailPanel>
      )}

      {selected && selected!=='EXPIRING' && (
        <DetailPanel title={`Cuộc thi của ${selected}`}>
          {enriched.filter(i=>i['Giảng Viên']===selected)
            .slice((page-1)*pageSize, page*pageSize)
            .map((i,idx)=>(
              <PanelRow key={idx}
                title={i['Tên cuộc thi']!}
                subtitle={`${i.startStr} – ${i.endStr}`}
                badge={i.isCompleted
                  ? {text:'Hoàn thành', color:'success'}
                  : {text:`Còn ${i.daysToEnd} ngày`, color:'warning'}}/>
            ))
          }
          <div className="d-flex justify-content-center align-items-center mt-3">
            <button className="btn btn-outline-primary btn-sm me-2"
              disabled={page===1} onClick={()=>setPage(p=>p-1)}>←</button>
            <span>Trang {page} / {Math.ceil(enriched.filter(i=>i['Giảng Viên']===selected).length/pageSize)}</span>
            <button className="btn btn-outline-primary btn-sm ms-2"
              disabled={page >= Math.ceil(enriched.filter(i=>i['Giảng Viên']===selected).length/pageSize)}
              onClick={()=>setPage(p=>p+1)}>→</button>
          </div>
        </DetailPanel>
      )}

      {/* Charts */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-2" style={{ height: 300 }}>
              <Pie data={pieData} options={pieOpts} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-2" style={{ height: 300 }}>
              <Bar data={barMonthData} options={barMonthOpts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Sub‑components ---

function StatCard({ icon, color='primary', label, value, sub, onClick }:
  { icon:string, color?:string, label:string, value:number, sub?:string, onClick?:()=>void }) {
  return (
    <div className="col-md-4">
      <div className="card shadow-sm border-0 h-100" onClick={onClick}
           style={{cursor:onClick?'pointer':'default'}}>
        <div className="card-body d-flex align-items-center p-3">
          <i className={`bi bi-${icon} text-${color} fs-3 me-3`} />
          <div>
            <small className="text-uppercase text-muted">{label}</small>
            <div className="h5 mb-0">{value}</div>
            {sub && <small className="text-muted d-block">{sub}</small>}
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailPanel({ title, children }: { title:string, children:React.ReactNode }) {
  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card shadow-sm border-0">
          <div className="card-body p-3">
            <h6 className="text-uppercase text-muted mb-3">{title}</h6>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function PanelRow({ title, subtitle, badge }:
  { title:string, subtitle:string, badge:{ text:string, color:'success'|'warning' } }) {
  return (
    <div className="mb-2 p-2 border rounded">
      <div className="fw-semibold">{title}</div>
      <small className="text-muted d-block">{subtitle}</small>
      <span className={`badge bg-${badge.color} mt-1`}>{badge.text}</span>
    </div>
  )
}
