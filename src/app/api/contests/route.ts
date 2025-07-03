import { fetchContestsFromSheet } from '@/lib/googleSheet';

export async function GET() {
  try {
    // Timeout: 10s
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const data = await fetchContestsFromSheet(controller.signal);
    clearTimeout(timeout);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    let message = 'Something went wrong';
    if (err && typeof err === 'object' && 'name' in err && (err as { name?: string }).name === 'AbortError') {
      message = 'Request timed out';
    } else if (err instanceof Error) {
      message = err.message;
    }
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}