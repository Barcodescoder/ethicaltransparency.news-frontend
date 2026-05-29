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

  // Fetch the submission
  const submission = await db.prepare(
    `SELECT * FROM submissions WHERE id = ? AND status = 'pending'`
  ).bind(id).first<{
    id: string; ai_headline: string; ai_slug: string; ai_summary: string;
    ai_article_body: string; ai_why_it_matters: string; ai_theme: string;
    source_url: string | null; company_name: string;
  }>();

  if (!submission) {
    return NextResponse.json({ error: 'Submission not found or already processed' }, { status: 404 });
  }

  if (!submission.ai_headline || !submission.ai_slug) {
    return NextResponse.json({ error: 'This submission has not been AI-processed yet. Run /process-submissions first.' }, { status: 400 });
  }

  const articleId = crypto.randomUUID();
  const now = new Date().toISOString();
  const theme = submission.ai_theme || 'Supply Chain Transparency';
  const tags = JSON.stringify(['news', 'submitted', theme]);
  const sourceUrl = submission.source_url || `https://ethicaltransparency.news/submit`;

  // Ensure slug is unique by appending a short suffix if needed
  const existingSlug = await db.prepare(
    "SELECT 1 FROM articles WHERE slug = ?"
  ).bind(submission.ai_slug).first();

  const slug = existingSlug
    ? `${submission.ai_slug}-${articleId.slice(0, 6)}`
    : submission.ai_slug;

  await db.prepare(
    `INSERT INTO articles (id, slug, headline, summary, article_body, why_it_matters, source_url, published_at, tags, theme)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    articleId,
    slug,
    submission.ai_headline,
    submission.ai_summary,
    submission.ai_article_body,
    submission.ai_why_it_matters,
    sourceUrl,
    now,
    tags,
    theme
  ).run();

  await db.prepare(
    `UPDATE submissions SET status = 'approved', published_article_id = ? WHERE id = ?`
  ).bind(articleId, id).run();

  return NextResponse.json({ success: true, article_id: articleId });
}
