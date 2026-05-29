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

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const {
    submitter_name,
    submitter_email,
    company_name,
    headline,
    story,
    source_url,
    turnstile_token,
    _honey,
  } = body;

  // Honeypot check — bots fill this field, humans don't
  if (_honey) {
    return NextResponse.json({ success: true }); // Silently drop
  }

  // Basic field validation
  if (!submitter_name?.trim() || !submitter_email?.trim() || !company_name?.trim() ||
      !headline?.trim() || !story?.trim()) {
    return NextResponse.json({ error: 'All required fields must be filled in.' }, { status: 400 });
  }

  const wordCount = story.trim().split(/\s+/).length;
  if (wordCount < 50) {
    return NextResponse.json({ error: 'Your story must be at least 50 words.' }, { status: 400 });
  }

  if (headline.trim().length > 120) {
    return NextResponse.json({ error: 'Headline must be 120 characters or fewer.' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(submitter_email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  // Turnstile verification
  if (!turnstile_token) {
    return NextResponse.json({ error: 'CAPTCHA verification required.' }, { status: 400 });
  }

  const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: env.TURNSTILE_SECRET_KEY,
      response: turnstile_token,
    }),
  });
  const turnstileData = await turnstileRes.json() as { success: boolean };
  if (!turnstileData.success) {
    return NextResponse.json({ error: 'CAPTCHA verification failed. Please try again.' }, { status: 400 });
  }

  // Rate limiting — max 3 submissions per IP in 24 hours
  const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const recentCount = await db.prepare(
    "SELECT COUNT(*) as count FROM submissions WHERE ip_address = ? AND submitted_at > ?"
  ).bind(ip, oneDayAgo).first<{ count: number }>();

  if (recentCount && recentCount.count >= 3) {
    return NextResponse.json({ error: 'You have reached the submission limit (3 per day). Please try again tomorrow.' }, { status: 429 });
  }

  // Insert submission
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.prepare(
    `INSERT INTO submissions (id, submitter_name, submitter_email, company_name, headline, story, source_url, ip_address, submitted_at, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`
  ).bind(
    id,
    submitter_name.trim(),
    submitter_email.trim().toLowerCase(),
    company_name.trim(),
    headline.trim(),
    story.trim(),
    source_url?.trim() || null,
    ip,
    now
  ).run();

  return NextResponse.json({ success: true });
}
