import { fetchContestsFromSheet } from '@/lib/googleSheet';

export async function GET() {
  try {
    const data = await fetchContestsFromSheet();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    let message = 'Something went wrong';
    if (err instanceof Error) message = err.message;
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
