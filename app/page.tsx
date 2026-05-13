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
      <header className="page-header" style={{textAlign: "center", padding: "3rem 1rem", backgroundColor: "#0f172a", color: "white", borderRadius: "8px", marginBottom: "2rem"}}>
        <h1 style={{fontSize: "2.5rem", marginBottom: "1rem"}}>Ethical Transparency News</h1>
        <p style={{fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto", opacity: 0.9}}>Bridging the gap between conscious consumers and the trusted supply chain information they need.</p>
      </header>

      <div className="filter-bar">
        <span style={{fontWeight: "bold", marginRight: "1rem"}}>Filter by Theme: </span>
        <div className="filter-links" style={{display: "flex", gap: "1rem", flexWrap: "wrap", margin: "1rem 0"}}>
          <Link href="/" className={filterTheme === "All" ? "active" : ""} style={{padding: "0.5rem 1rem", backgroundColor: filterTheme === "All" ? "#3b82f6" : "#f1f5f9", color: filterTheme === "All" ? "white" : "#333", borderRadius: "20px", textDecoration: "none"}}>All</Link>
          <Link href="/?theme=Supply Chain Transparency" className={filterTheme === "Supply Chain Transparency" ? "active" : ""} style={{padding: "0.5rem 1rem", backgroundColor: filterTheme === "Supply Chain Transparency" ? "#3b82f6" : "#f1f5f9", color: filterTheme === "Supply Chain Transparency" ? "white" : "#333", borderRadius: "20px", textDecoration: "none"}}>Supply Chain Transparency</Link>
          <Link href="/?theme=Modern Slavery" className={filterTheme === "Modern Slavery" ? "active" : ""} style={{padding: "0.5rem 1rem", backgroundColor: filterTheme === "Modern Slavery" ? "#3b82f6" : "#f1f5f9", color: filterTheme === "Modern Slavery" ? "white" : "#333", borderRadius: "20px", textDecoration: "none"}}>Modern Slavery</Link>
          <Link href="/?theme=GS1 2D Barcodes" className={filterTheme === "GS1 2D Barcodes" ? "active" : ""} style={{padding: "0.5rem 1rem", backgroundColor: filterTheme === "GS1 2D Barcodes" ? "#3b82f6" : "#f1f5f9", color: filterTheme === "GS1 2D Barcodes" ? "white" : "#333", borderRadius: "20px", textDecoration: "none"}}>GS1 2D Barcodes</Link>
          <Link href="/?theme=Fair Trade & Wages" className={filterTheme === "Fair Trade & Wages" ? "active" : ""} style={{padding: "0.5rem 1rem", backgroundColor: filterTheme === "Fair Trade & Wages" ? "#3b82f6" : "#f1f5f9", color: filterTheme === "Fair Trade & Wages" ? "white" : "#333", borderRadius: "20px", textDecoration: "none"}}>Fair Trade & Wages</Link>
        </div>
      </div>

      <div className="articles-list" style={{display: "flex", flexDirection: "column", gap: "2rem"}}>
        {articles.length === 0 ? (
          <div className="empty-state" style={{padding: "3rem", textAlign: "center", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px dashed #cbd5e1"}}>
            <p>No news articles found for this theme right now. The Ethical Transparency Agent is searching the web!</p>
          </div>
        ) : (
          articles.map((article) => (
            <article key={article.id} className="news-card" style={{padding: "2rem", backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"}}>
              <div className="card-meta" style={{display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "0.9rem", color: "#64748b"}}>
                <span className="theme-tag" style={{fontWeight: "bold", color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.05em"}}>{article.theme}</span>
                <time>{new Date(article.published_at).toLocaleDateString()}</time>
              </div>
              <h2 className="headline" style={{fontSize: "1.75rem", marginBottom: "1rem", color: "#0f172a", lineHeight: 1.3}}>
                <Link href={`/news/${article.slug}`} style={{textDecoration: "none", color: "inherit"}}>{article.headline}</Link>
              </h2>
              <p className="summary" style={{fontSize: "1.1rem", color: "#475569", marginBottom: "1.5rem", lineHeight: 1.6}}>{article.summary}</p>
              
              <div className="why-matters" style={{padding: "1.5rem", backgroundColor: "#f0fdfa", borderLeft: "4px solid #0d9488", borderRadius: "0 8px 8px 0", marginBottom: "1.5rem"}}>
                <strong style={{display: "block", marginBottom: "0.5rem", color: "#0f766e"}}>Why this matters for the Ethical Transparency Alliance:</strong>
                <p style={{color: "#0f172a", lineHeight: 1.5}}>{article.why_it_matters}</p>
              </div>
              
              <div className="card-cta" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Link href={`/news/${article.slug}`} className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', backgroundColor: "#f1f5f9", color: "#334155", borderRadius: "6px", textDecoration: 'none', fontWeight: 500 }}>
                  Read full analysis
                </Link>
                <a href="https://ethicaltransparency.org/" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', backgroundColor: "#0f172a", color: "white", borderRadius: "6px", textDecoration: 'none', fontWeight: 500 }}>
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
