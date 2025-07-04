import { NextResponse } from 'next/server'
import { fetchPublications } from '@/lib/googleSheet'

const TIMEOUT_MS = 10_000

export async function GET() {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const publications = await fetchPublications(controller.signal)
    clearTimeout(timer)
    return NextResponse.json(publications, { status: 200 })
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
