export const runtime = 'edge';

import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let db: D1Database;
  let env: CloudflareEnv;

  try {
    const ctx = getRequestContext();
    env = ctx.env;
    db = env.DB;
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  const authHeader = request.headers.get('X-Admin-Secret');
  if (authHeader !== env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await request.json() as { id: string };
  if (!id) return NextResponse.json({ error: 'Missing submission id' }, { status: 400 });

  const result = await db.prepare(
    `UPDATE submissions SET status = 'rejected' WHERE id = ? AND status = 'pending'`
  ).bind(id).run();

  if (!result.meta.changes) {
    return NextResponse.json({ error: 'Submission not found or already processed' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
