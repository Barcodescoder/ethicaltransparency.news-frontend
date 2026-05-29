'use client';

import { useState, useEffect, useCallback } from 'react';
import './admin.css';

type Submission = {
  id: string;
  submitter_name: string;
  submitter_email: string;
  company_name: string;
  headline: string;
  story: string;
  source_url: string | null;
  submitted_at: string;
  status: 'pending' | 'approved' | 'rejected';
  ai_score: number | null;
  ai_reasoning: string | null;
  ai_theme: string | null;
  ai_headline: string | null;
  ai_summary: string | null;
  ai_article_body: string | null;
  ai_why_it_matters: string | null;
};

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <div className="score-badge unprocessed">AI<br />pending</div>;
  const cls = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
  return <div className={`score-badge ${cls}`}>{score}</div>;
}

function SubmissionCard({
  sub,
  secret,
  onUpdate,
}: {
  sub: Submission;
  secret: string;
  onUpdate: (id: string, newStatus: 'approved' | 'rejected') => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'submission' | 'ai'>('submission');
  const [actionResult, setActionResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const callAction = async (action: 'publish' | 'reject') => {
    setLoading(true);
    setActionResult(null);
    try {
      const res = await fetch(`/api/admin/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Secret': secret },
        body: JSON.stringify({ id: sub.id }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (data.success) {
        setActionResult({ type: 'success', message: action === 'publish' ? '✓ Published!' : '✓ Rejected' });
        onUpdate(sub.id, action === 'publish' ? 'approved' : 'rejected');
      } else {
        setActionResult({ type: 'error', message: data.error || 'Action failed.' });
      }
    } catch {
      setActionResult({ type: 'error', message: 'Network error.' });
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = sub.ai_score !== null
    ? sub.ai_score >= 70 ? '#166534' : sub.ai_score >= 40 ? '#713f12' : '#991b1b'
    : '#717568';

  return (
    <div className={`submission-card status-${sub.status}`}>
      <div className="submission-summary" onClick={() => setExpanded(e => !e)}>
        <ScoreBadge score={sub.ai_score} />
        <div className="submission-meta">
          <h3>{sub.headline}</h3>
          <div className="meta-row">
            <span>{sub.company_name}</span>
            <span>{sub.submitter_name} &lt;{sub.submitter_email}&gt;</span>
            <span>{new Date(sub.submitted_at).toLocaleDateString('en-NZ')}</span>
            {sub.ai_theme && <span>🏷 {sub.ai_theme}</span>}
          </div>
        </div>
        <div className="submission-actions">
          <span className={`status-chip ${sub.status}`}>{sub.status}</span>
          <span className="expand-icon">{expanded ? '▲ collapse' : '▼ expand'}</span>
        </div>
      </div>

      {expanded && (
        <div className="submission-detail">
          <div className="detail-tabs">
            <button
              className={`detail-tab ${activeTab === 'submission' ? 'active' : ''}`}
              onClick={() => setActiveTab('submission')}
            >
              📥 Submission
            </button>
            <button
              className={`detail-tab ${activeTab === 'ai' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai')}
            >
              🤖 AI Draft {sub.ai_score !== null ? `(score: ${sub.ai_score})` : '(not processed)'}
            </button>
          </div>

          {activeTab === 'submission' && (
            <div>
              <div className="detail-grid">
                <div className="detail-section">
                  <h4>Submitter</h4>
                  <p>{sub.submitter_name} — {sub.submitter_email}</p>
                </div>
                <div className="detail-section">
                  <h4>Company</h4>
                  <p>{sub.company_name}</p>
                </div>
              </div>
              {sub.source_url && (
                <div className="detail-section" style={{ marginBottom: '1rem' }}>
                  <h4>Source URL</h4>
                  <p><a href={sub.source_url} target="_blank" rel="noopener noreferrer">{sub.source_url}</a></p>
                </div>
              )}
              <div className="detail-section">
                <h4>Story</h4>
                <p className="body-text">{sub.story}</p>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div>
              {sub.ai_score === null ? (
                <p style={{ color: 'var(--border-color)', fontStyle: 'italic' }}>
                  This submission hasn&apos;t been processed by AI yet. Trigger POST /process-submissions on the news agent Worker to analyse it.
                </p>
              ) : (
                <>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--border-color)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Relevance Score</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 700, color: scoreColor }}>{sub.ai_score}/100</span>
                    </div>
                    <div className="ai-score-bar">
                      <div className="ai-score-fill" style={{ width: `${sub.ai_score}%`, background: scoreColor }} />
                    </div>
                    {sub.ai_reasoning && (
                      <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--border-color)', fontStyle: 'italic' }}>{sub.ai_reasoning}</p>
                    )}
                  </div>

                  {sub.ai_headline && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="detail-section">
                        <h4>AI Headline</h4>
                        <p style={{ fontWeight: 600 }}>{sub.ai_headline}</p>
                      </div>
                      <div className="detail-section">
                        <h4>Theme</h4>
                        <p>{sub.ai_theme}</p>
                      </div>
                      <div className="detail-section">
                        <h4>Summary</h4>
                        <p>{sub.ai_summary}</p>
                      </div>
                      <div className="detail-section">
                        <h4>Article Body</h4>
                        <p className="body-text">{sub.ai_article_body}</p>
                      </div>
                      <div className="detail-section">
                        <h4>Why It Matters</h4>
                        <p className="body-text">{sub.ai_why_it_matters}</p>
                      </div>
                    </div>
                  )}
                  {!sub.ai_headline && sub.ai_score < 50 && (
                    <p style={{ color: '#991b1b', marginTop: '0.5rem' }}>AI scored this below 50 — no article was drafted. You can still reject it or process manually.</p>
                  )}
                </>
              )}
            </div>
          )}

          {sub.status === 'pending' && (
            <div className="detail-actions">
              <button
                className="admin-btn admin-btn-success"
                onClick={() => callAction('publish')}
                disabled={loading || !sub.ai_headline}
                title={!sub.ai_headline ? 'Process with AI first to generate a draft article' : 'Publish this article to the site'}
              >
                ✅ Publish Article
              </button>
              <button
                className="admin-btn admin-btn-danger"
                onClick={() => callAction('reject')}
                disabled={loading}
              >
                ❌ Reject
              </button>
              {actionResult && (
                <span className={`action-result ${actionResult.type}`}>{actionResult.message}</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [secretInput, setSecretInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [fetchError, setFetchError] = useState('');

  const fetchSubmissions = useCallback(async (s: string) => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await fetch('/api/admin/submissions', {
        headers: { 'X-Admin-Secret': s },
      });
      if (res.status === 401) {
        setSecret('');
        setLoginError('Incorrect password.');
        setLoading(false);
        return;
      }
      const data = await res.json() as { submissions: Submission[] };
      setSubmissions(data.submissions || []);
    } catch {
      setFetchError('Failed to load submissions. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setSecret(secretInput);
    await fetchSubmissions(secretInput);
  };

  const handleUpdate = (id: string, newStatus: 'approved' | 'rejected') => {
    setSubmissions(prev =>
      prev.map(s => s.id === id ? { ...s, status: newStatus } : s)
    );
  };

  const filtered = filter === 'all' ? submissions : submissions.filter(s => s.status === filter);
  const counts = {
    all: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  if (!secret) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔒</div>
          <h1>Admin Panel</h1>
          <p>Ethical Transparency News — editorial review</p>
          <form className="admin-login-form" onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={secretInput}
              onChange={e => setSecretInput(e.target.value)}
              autoFocus
              required
            />
            {loginError && <div className="login-error">{loginError}</div>}
            <button type="submit">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>📋 Submission Review</h1>
        <div className="admin-header-actions">
          <button
            className="admin-btn admin-btn-secondary"
            onClick={() => fetchSubmissions(secret)}
            disabled={loading}
          >
            {loading ? 'Loading…' : '↻ Refresh'}
          </button>
          <button
            className="admin-btn admin-btn-secondary"
            onClick={() => { setSecret(''); setSecretInput(''); setSubmissions([]); }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="admin-stats">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(k => (
          <div key={k} className="stat-card">
            <div className="stat-number">{counts[k]}</div>
            <div className="stat-label">{k}</div>
          </div>
        ))}
      </div>

      <div className="admin-filters">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(k => (
          <button
            key={k}
            className={`filter-chip ${filter === k ? 'active' : ''}`}
            onClick={() => setFilter(k)}
          >
            {k.charAt(0).toUpperCase() + k.slice(1)} ({counts[k]})
          </button>
        ))}
      </div>

      {fetchError && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          {fetchError}
        </div>
      )}

      {loading ? (
        <div className="admin-empty">Loading submissions…</div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
          <p>No {filter !== 'all' ? filter : ''} submissions yet.</p>
        </div>
      ) : (
        <div className="submission-list">
          {filtered.map(sub => (
            <SubmissionCard key={sub.id} sub={sub} secret={secret} onUpdate={handleUpdate} />
          ))}
        </div>
      )}

      <div style={{ marginTop: '3rem', padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--border-color)' }}>
        <strong>To process unanalysed submissions with AI:</strong> trigger <code>POST /process-submissions</code> on the <code>ethicaltransparency-news-agent</code> Cloudflare Worker. You can do this from the Cloudflare Dashboard → Workers → Quick Edit, or via <code>curl -X POST https://ethicaltransparency-news-agent.&lt;your-subdomain&gt;.workers.dev/process-submissions</code>
      </div>
    </div>
  );
}
