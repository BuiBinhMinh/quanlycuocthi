import { NextResponse } from 'next/server'
import { fetchProjects } from '@/lib/googleSheet'

const SHEET_TIMEOUT = 10_000

export async function GET() {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), SHEET_TIMEOUT)

  try {
    const projects = await fetchProjects(controller.signal)
    clearTimeout(timer)
    return NextResponse.json(projects, { status: 200 })
  } catch (err) {
    clearTimeout(timer)
    const msg = err instanceof Error
      ? err.name === 'AbortError'
        ? 'Yêu cầu vượt quá 10s, đã huỷ.'
        : err.message
      : 'Không thể lấy dữ liệu.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
