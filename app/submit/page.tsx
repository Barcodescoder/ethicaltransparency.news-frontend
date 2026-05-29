'use client';

import { useState, useRef, useCallback } from 'react';
import './submit.css';

const TURNSTILE_SITE_KEY = '0x4AAAAAADYLJPbjCjF7prNH';

declare global {
  interface Window {
    turnstile?: {
      render(container: string | HTMLElement, options: Record<string, unknown>): string;
      reset(widgetId: string): void;
    };
  }
}

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    submitter_name: '',
    submitter_email: '',
    company_name: '',
    headline: '',
    story: '',
    source_url: '',
    _honey: '',
  });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  const initTurnstile = useCallback(() => {
    if (!turnstileRef.current) return;
    if (window.turnstile) {
      const id = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => setTurnstileToken(token),
        'expired-callback': () => setTurnstileToken(null),
        'error-callback': () => setTurnstileToken(null),
        theme: 'light',
      });
      setTurnstileWidgetId(id);
    }
  }, []);

  const loadTurnstileScript = useCallback(() => {
    if (scriptLoaded.current) {
      initTurnstile();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.onload = () => {
      scriptLoaded.current = true;
      // Small delay for Turnstile to initialise
      setTimeout(initTurnstile, 100);
    };
    document.head.appendChild(script);
  }, [initTurnstile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const wordCount = formData.story.trim() ? formData.story.trim().split(/\s+/).length : 0;
  const headlineLen = formData.headline.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!turnstileToken) {
      setResult({ success: false, message: 'Please complete the CAPTCHA verification.' });
      return;
    }

    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, turnstile_token: turnstileToken }),
      });

      const data = await res.json() as { success?: boolean; error?: string };

      if (data.success) {
        setResult({
          success: true,
          message: "Thank you — your submission has been received! Our editorial AI will review it, and if it meets our standards it will be considered for publication. We'll be in touch if we need more information.",
        });
        setFormData({ submitter_name: '', submitter_email: '', company_name: '', headline: '', story: '', source_url: '', _honey: '' });
        setTurnstileToken(null);
        if (turnstileWidgetId && window.turnstile) {
          window.turnstile.reset(turnstileWidgetId);
        }
      } else {
        setResult({ success: false, message: data.error || 'Something went wrong. Please try again.' });
        if (turnstileWidgetId && window.turnstile) {
          window.turnstile.reset(turnstileWidgetId);
        }
        setTurnstileToken(null);
      }
    } catch {
      setResult({ success: false, message: 'A network error occurred. Please check your connection and try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="submit-page">
      <header className="submit-header">
        <div className="submit-badge">📬 Company Submissions</div>
        <h1>Share Your Ethical Transparency Story</h1>
        <p>
          Is your company making meaningful progress on supply chain transparency, ethical sourcing, or the adoption of GS1 2D barcodes? We want to hear about it. Relevant stories may be published at no charge as editorial news on Ethical Transparency News.
        </p>
      </header>

      <div className="guidelines-box">
        <h3>What we publish</h3>
        <ul>
          <li>Concrete steps your company has taken toward supply chain transparency</li>
          <li>Adoption of GS1 Digital Link or 2D barcode standards for ethical data</li>
          <li>Initiatives to address modern slavery, fair wages, or ethical sourcing</li>
          <li>Partnerships, certifications, or audits related to ethical supply chains</li>
          <li>Data and evidence — not marketing fluff or vague CSR commitments</li>
        </ul>
      </div>

      {result && (
        <div className={`alert ${result.success ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '2rem' }}>
          {result.message}
        </div>
      )}

      {!result?.success && (
        <form className="submit-form" onSubmit={handleSubmit} noValidate>
          {/* Honeypot — hidden from real users */}
          <input
            type="text"
            name="_honey"
            value={formData._honey}
            onChange={handleChange}
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="submitter_name">Your Name <span className="required-star">*</span></label>
              <input
                id="submitter_name"
                name="submitter_name"
                type="text"
                value={formData.submitter_name}
                onChange={handleChange}
                placeholder="Jane Smith"
                required
                autoComplete="name"
              />
            </div>
            <div className="form-field">
              <label htmlFor="submitter_email">Email Address <span className="required-star">*</span></label>
              <input
                id="submitter_email"
                name="submitter_email"
                type="email"
                value={formData.submitter_email}
                onChange={handleChange}
                placeholder="jane@yourcompany.com"
                required
                autoComplete="email"
              />
              <span className="hint">Stored privately — not published.</span>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="company_name">Company / Organisation <span className="required-star">*</span></label>
            <input
              id="company_name"
              name="company_name"
              type="text"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Acme Supply Co."
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="headline">Story Headline <span className="required-star">*</span></label>
            <input
              id="headline"
              name="headline"
              type="text"
              value={formData.headline}
              onChange={handleChange}
              placeholder="e.g. Acme Supply Co. adopts GS1 Digital Link to publish full supplier audit data"
              maxLength={120}
              required
            />
            <span className={`char-count ${headlineLen > 100 ? 'warn' : ''}`}>{headlineLen}/120</span>
          </div>

          <div className="form-field">
            <label htmlFor="story">Tell Us Your Story <span className="required-star">*</span></label>
            <textarea
              id="story"
              name="story"
              value={formData.story}
              onChange={handleChange}
              placeholder="Describe the initiative, what you've achieved, the data behind it, and why it matters for supply chain transparency. Include specific facts and figures where possible."
              required
            />
            <span className={`char-count ${wordCount < 50 && formData.story.length > 0 ? 'warn' : ''}`}>
              {wordCount} words {wordCount < 50 && formData.story.length > 0 ? '(minimum 50)' : ''}
            </span>
          </div>

          <div className="form-field">
            <label htmlFor="source_url">Link to Announcement <span style={{ fontWeight: 400, color: 'var(--border-color)' }}>(optional)</span></label>
            <input
              id="source_url"
              name="source_url"
              type="url"
              value={formData.source_url}
              onChange={handleChange}
              placeholder="https://yourcompany.com/press-release"
            />
            <span className="hint">A press release, blog post, report, or other reference.</span>
          </div>

          <div className="turnstile-wrapper">
            <label>Verification <span className="required-star">*</span></label>
            <div
              ref={turnstileRef}
              id="turnstile-container"
              onClick={loadTurnstileScript}
              onFocus={loadTurnstileScript}
              style={{
                minHeight: '65px',
                display: 'flex',
                alignItems: 'center',
                cursor: !turnstileToken ? 'pointer' : 'default',
                background: '#fff',
                border: '1.5px solid var(--bg-secondary)',
                borderRadius: '8px',
                padding: !turnstileToken ? '0' : '0',
                transition: 'border-color 0.2s',
              }}
            >
              {!scriptLoaded.current && (
                <span style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--border-color)' }}>
                  Click here to verify you&apos;re human →
                </span>
              )}
            </div>
          </div>

          <div className="form-submit-area">
            <button
              type="submit"
              className="submit-btn"
              disabled={submitting || !turnstileToken}
            >
              {submitting ? 'Submitting…' : 'Submit for Review'}
            </button>
            <p className="form-note">
              Submissions are reviewed by our editorial AI and then by our team.
              Free consideration — no paid placement.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
