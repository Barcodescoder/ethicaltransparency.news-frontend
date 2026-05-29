export const runtime = 'edge';

import { getRequestContext } from '@cloudflare/next-on-pages';
import { NextResponse } from 'next/server';

function checkAuth(request: Request, adminSecret: string): boolean {
  const authHeader = request.headers.get('X-Admin-Secret');
  return authHeader === adminSecret;
}

export async function GET(request: Request) {
  let db: D1Database;
  let env: CloudflareEnv;

  try {
    const ctx = getRequestContext();
    env = ctx.env;
    db = env.DB;
  } catch {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  if (!checkAuth(request, env.ADMIN_SECRET)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { results } = await db.prepare(
    `SELECT id, submitter_name, submitter_email, company_name, headline, story, source_url,
            submitted_at, status, ai_score, ai_reasoning, ai_theme,
            ai_headline, ai_summary, ai_article_body, ai_why_it_matters
     FROM submissions
     ORDER BY submitted_at DESC
     LIMIT 100`
  ).all();

  return NextResponse.json({ submissions: results || [] });
}
