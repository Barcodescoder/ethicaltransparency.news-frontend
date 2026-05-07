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
  region: string;
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
    title: `${article.headline} | 2D Barcode Insights`,
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
      <Link href="/" style={{ color: '#0066cc', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
        &larr; Back to Newsroom
      </Link>
      
      <article className="news-card" style={{ marginTop: '1rem', padding: '2rem' }}>
        <div className="card-meta" style={{ marginBottom: '1rem' }}>
          <span className="region-tag">{article.region}</span>
          <time>{new Date(article.published_at).toLocaleDateString()}</time>
        </div>
        
        <h1 className="headline" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>
          {article.headline}
        </h1>
        
        <div className="article-body" style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem', whiteSpace: 'pre-wrap' }}>
          {article.article_body}
        </div>
        
        <div className="why-matters" style={{ backgroundColor: '#f0f7ff', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1.2rem', color: '#004488' }}>
            Why this matters for your business:
          </strong>
          <p style={{ margin: 0 }}>{article.why_it_matters}</p>
        </div>
        
        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '2rem 0' }} />
        
        <div className="article-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>Read the original coverage:</p>
            <a href={article.source_url} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', wordBreak: 'break-all' }}>
              {article.source_url}
            </a>
          </div>
          
          <a href="https://ibn.link" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', whiteSpace: 'nowrap' }}>
            Future-proof with ibn.link
          </a>
        </div>
      </article>
    </div>
  );
}
