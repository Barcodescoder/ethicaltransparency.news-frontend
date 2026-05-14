import { getRequestContext } from "@cloudflare/next-on-pages";
import Link from "next/link";
import "./news.css";

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

export default async function NewsPage({
  searchParams
}: {
  searchParams: { theme?: string }
}) {
  const filterTheme = searchParams.theme || "All";
  
  let articles: Article[] = [];
  
  try {
    let db = process.env.DB as unknown as D1Database;
    if (!db) {
        const ctx = getRequestContext();
        db = ctx?.env?.DB as D1Database;
    }

    if (db) {
       const query = filterTheme === "All" 
         ? "SELECT * FROM articles ORDER BY published_at DESC LIMIT 50"
         : "SELECT * FROM articles WHERE theme = ? ORDER BY published_at DESC LIMIT 50";
         
       const stmt = filterTheme === "All" 
         ? db.prepare(query)
         : db.prepare(query).bind(filterTheme);
         
       const { results } = await stmt.all<Article>();
       articles = results || [];
    } else {
       console.error("D1 Database binding 'DB' is undefined. Please check Cloudflare Pages settings.");
    }
  } catch (e) {
    console.error("Database error:", e);
  }

  return (
    <div className="news-page">
      <header className="page-header">
        <h1 className="main-title">Ethical Transparency News</h1>
        <p className="main-subtitle">Bridging the gap between conscious consumers and the trusted supply chain information they need.</p>
      </header>

      <div className="filter-bar">
        <span style={{fontWeight: "bold", marginRight: "1rem"}}>Filter by Theme: </span>
        <div className="filter-links" style={{display: "flex", gap: "1rem", flexWrap: "wrap", margin: "1rem 0"}}>
          <Link href="/" className={filterTheme === "All" ? "active" : ""}>All</Link>
          <Link href="/?theme=Supply Chain Transparency" className={filterTheme === "Supply Chain Transparency" ? "active" : ""}>Supply Chain Transparency</Link>
          <Link href="/?theme=Modern Slavery" className={filterTheme === "Modern Slavery" ? "active" : ""}>Modern Slavery</Link>
          <Link href="/?theme=GS1 2D Barcodes" className={filterTheme === "GS1 2D Barcodes" ? "active" : ""}>GS1 2D Barcodes</Link>
          <Link href="/?theme=Fair Trade & Wages" className={filterTheme === "Fair Trade & Wages" ? "active" : ""}>Fair Trade & Wages</Link>
        </div>
      </div>

      <div className="articles-list" style={{display: "flex", flexDirection: "column", gap: "2rem"}}>
        {articles.length === 0 ? (
          <div className="empty-state" style={{padding: "3rem", textAlign: "center", backgroundColor: "var(--bg-secondary)", borderRadius: "8px", border: "1px dashed var(--border-color)"}}>
            <p>No news articles found for this theme right now. The Ethical Transparency Agent is searching the web!</p>
          </div>
        ) : (
          articles.map((article) => (
            <article key={article.id} className="news-card" style={{padding: "2rem", backgroundColor: "var(--text-light)", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"}}>
              <div className="card-meta" style={{display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "0.9rem", color: "var(--border-color)"}}>
                <span className="theme-tag" style={{fontWeight: "bold", color: "var(--primary-color)", textTransform: "uppercase", letterSpacing: "0.05em"}}>{article.theme}</span>
                <time style={{color: "var(--border-color)"}}>{new Date(article.published_at).toLocaleDateString()}</time>
              </div>
              <h2 className="headline" style={{fontSize: "1.75rem", marginBottom: "1rem", color: "var(--text-dark)", lineHeight: 1.3}}>
                <Link href={`/news/${article.slug}`} style={{textDecoration: "none", color: "inherit"}}>{article.headline}</Link>
              </h2>
              <p className="summary" style={{fontSize: "1.1rem", color: "var(--text-dark)", marginBottom: "1.5rem", lineHeight: 1.6}}>{article.summary}</p>
              
              <div className="why-matters" style={{padding: "1.5rem", backgroundColor: "var(--bg-secondary)", borderLeft: "4px solid var(--border-color)", borderRadius: "0 8px 8px 0", marginBottom: "1.5rem"}}>
                <strong style={{display: "block", marginBottom: "0.5rem", color: "var(--primary-color)"}}>Why this matters for the Ethical Transparency Alliance:</strong>
                <p style={{color: "var(--text-dark)", lineHeight: 1.5}}>{article.why_it_matters}</p>
              </div>
              
              <div className="card-cta" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Link href={`/news/${article.slug}`} className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', backgroundColor: "var(--bg-secondary)", color: "var(--text-dark)", borderRadius: "6px", textDecoration: 'none', fontWeight: 500 }}>
                  Read full analysis
                </Link>
                <a href="https://ethicaltransparency.org/" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', backgroundColor: "var(--text-dark)", color: "var(--text-light)", borderRadius: "6px", textDecoration: 'none', fontWeight: 500 }}>
                  Join the Alliance
                </a>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
