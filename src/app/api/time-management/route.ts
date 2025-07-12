import { NextResponse } from 'next/server'
import { fetchTimeManagement } from '@/lib/googleSheet'

const TIMEOUT_MS = 10_000

export async function GET() {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const timeManagement = await fetchTimeManagement(controller.signal)
    clearTimeout(timer)
    return NextResponse.json(timeManagement)
  } catch (err: unknown) {
    clearTimeout(timer)
    const message =
      err instanceof Error && err.name === 'AbortError'
        ? 'Yêu cầu vượt quá 10 giây.'
        : err instanceof Error
        ? err.message
        : 'Không thể lấy dữ liệu.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}