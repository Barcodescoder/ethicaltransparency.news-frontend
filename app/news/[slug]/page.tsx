import { getRequestContext } from "@cloudflare/next-on-pages";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const runtime = 'edge';

type Article = {
  id: string;
  slug: string;
  headline: string;
  summary: string;
  article_body: string;
  why_it_matters: string;
  source_url: string;
  published_at: string;
  tags: string;
  theme: string;
};

async function getArticle(slug: string): Promise<Article | null> {
  try {
    let db = process.env.DB as unknown as D1Database;
    if (!db) {
        const ctx = getRequestContext();
        db = ctx?.env?.DB as D1Database;
    }

    if (db) {
       const stmt = db.prepare("SELECT * FROM articles WHERE slug = ?").bind(slug);
       const article = await stmt.first<Article>();
       return article;
    }
  } catch (e) {
    console.error("Database error:", e);
  }
  return null;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return { title: 'Not Found' };
  
  return {
    title: `${article.headline} | Ethical Transparency News`,
    description: article.summary,
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  
  if (!article) {
    notFound();
  }

  return (
    <div className="news-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <Link href="/" style={{ color: '#0f766e', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block', fontWeight: 500 }}>
        &larr; Back to Newsroom
      </Link>
      
      <article className="news-card" style={{ marginTop: '1rem', padding: '2.5rem', backgroundColor: "white", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}>
        <div className="card-meta" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
          <span className="theme-tag" style={{fontWeight: "bold", color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.05em"}}>{article.theme}</span>
          <time>{new Date(article.published_at).toLocaleDateString()}</time>
        </div>
        
        <h1 className="headline" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: '1.3', color: '#0f172a' }}>
          {article.headline}
        </h1>
        
        <div className="article-body" style={{ fontSize: '1.15rem', lineHeight: '1.7', marginBottom: '2.5rem', whiteSpace: 'pre-wrap', color: '#334155' }}>
          {article.article_body}
        </div>
        
        <div className="why-matters" style={{ backgroundColor: '#f0fdfa', padding: '1.5rem', borderLeft: "4px solid #0d9488", borderRadius: "0 8px 8px 0", marginBottom: '2.5rem' }}>
          <strong style={{ display: 'block', marginBottom: '0.75rem', fontSize: '1.25rem', color: '#0f766e' }}>
            Why this matters for the Ethical Transparency Alliance:
          </strong>
          <p style={{ margin: 0, lineHeight: 1.6, color: '#0f172a' }}>{article.why_it_matters}</p>
        </div>
        
        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '2rem 0' }} />
        
        <div className="article-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.9rem' }}>Read the original coverage:</p>
            <a href={article.source_url} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', wordBreak: 'break-all', fontWeight: 500 }}>
              {new URL(article.source_url).hostname} &rarr;
            </a>
          </div>
          
          <a href="https://ethicaltransparency.org/" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', backgroundColor: "#0f172a", color: "white", borderRadius: "6px", textDecoration: 'none', fontWeight: 500, whiteSpace: 'nowrap' }}>
            Join the Alliance
          </a>
        </div>
      </article>
    </div>
  );
}
