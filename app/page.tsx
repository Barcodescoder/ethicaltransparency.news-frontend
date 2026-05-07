import { getRequestContext } from "@cloudflare/next-on-pages";
import Link from "next/link";
import "./news.css";

export const runtime = 'edge';

type Article = {
  id: string;
  headline: string;
  summary: string;
  why_it_matters: string;
  source_url: string;
  published_at: string;
  tags: string;
  region: string;
};

export default async function NewsPage({
  searchParams
}: {
  searchParams: { region?: string }
}) {
  const filterRegion = searchParams.region || "All";
  
  let articles: Article[] = [];
  
  try {
    const db = process.env.DB as unknown as D1Database;
    if (!db) {
        // Fallback for dev mode without wrangler if needed, or proper context access
        const ctx = getRequestContext();
        if (ctx?.env?.DB) {
           const query = filterRegion === "All" 
             ? "SELECT * FROM articles ORDER BY published_at DESC LIMIT 50"
             : "SELECT * FROM articles WHERE region = ? ORDER BY published_at DESC LIMIT 50";
             
           const stmt = filterRegion === "All" 
             ? ctx.env.DB.prepare(query)
             : ctx.env.DB.prepare(query).bind(filterRegion);
             
           const { results } = await stmt.all<Article>();
           articles = results || [];
        }
    }
  } catch (e) {
    console.error("Database error:", e);
  }

  return (
    <div className="news-page">
      <header className="page-header">
        <h1>Industry Newsroom</h1>
        <p>The latest updates on 2D barcodes, GS1 Digital Link, and Sunrise 2027.</p>
      </header>

      <div className="filter-bar">
        <span>Filter by region: </span>
        <div className="filter-links">
          <Link href="/" className={filterRegion === "All" ? "active" : ""}>All</Link>
          <Link href="/?region=NZ" className={filterRegion === "NZ" ? "active" : ""}>New Zealand</Link>
          <Link href="/?region=AU" className={filterRegion === "AU" ? "active" : ""}>Australia</Link>
          <Link href="/?region=Global" className={filterRegion === "Global" ? "active" : ""}>Global</Link>
        </div>
      </div>

      <div className="articles-list">
        {articles.length === 0 ? (
          <div className="empty-state">
            <p>No news articles found for this region right now. Check back soon!</p>
          </div>
        ) : (
          articles.map((article) => (
            <article key={article.id} className="news-card">
              <div className="card-meta">
                <span className="region-tag">{article.region}</span>
                <time>{new Date(article.published_at).toLocaleDateString()}</time>
              </div>
              <h2 className="headline">
                <a href={article.source_url} target="_blank" rel="noopener noreferrer">{article.headline}</a>
              </h2>
              <p className="summary">{article.summary}</p>
              
              <div className="why-matters">
                <strong>Why this matters for your business:</strong>
                <p>{article.why_it_matters}</p>
              </div>
              
              <div className="card-cta">
                <p>Ready to transition?</p>
                <a href="https://ibn.link" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Future-proof your products now at ibn.link
                </a>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
