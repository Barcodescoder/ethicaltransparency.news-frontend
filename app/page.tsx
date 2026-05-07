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
    let db = process.env.DB as unknown as D1Database;
    if (!db) {
        const ctx = getRequestContext();
        db = ctx?.env?.DB as D1Database;
    }

    if (db) {
       const query = filterRegion === "All" 
         ? "SELECT * FROM articles ORDER BY published_at DESC LIMIT 50"
         : "SELECT * FROM articles WHERE region = ? ORDER BY published_at DESC LIMIT 50";
         
       const stmt = filterRegion === "All" 
         ? db.prepare(query)
         : db.prepare(query).bind(filterRegion);
         
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
        <h1>Industry Newsroom</h1>
        <p>The latest updates on 2D barcodes, GS1 Digital Link, and Sunrise 2027.</p>
      </header>

      <div className="filter-bar">
        <span>Filter by region: </span>
        <div className="filter-links">
          <Link href="/" className={filterRegion === "All" ? "active" : ""}>All</Link>
          <Link href="/?region=NZ" className={filterRegion === "NZ" ? "active" : ""}>New Zealand</Link>
          <Link href="/?region=AU" className={filterRegion === "AU" ? "active" : ""}>Australia</Link>
          <Link href="/?region=UK" className={filterRegion === "UK" ? "active" : ""}>UK</Link>
          <Link href="/?region=EU" className={filterRegion === "EU" ? "active" : ""}>Europe</Link>
          <Link href="/?region=USA" className={filterRegion === "USA" ? "active" : ""}>USA</Link>
          <Link href="/?region=Canada" className={filterRegion === "Canada" ? "active" : ""}>Canada</Link>
          <Link href="/?region=Asia" className={filterRegion === "Asia" ? "active" : ""}>Asia</Link>
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
                <Link href={`/news/${article.slug}`}>{article.headline}</Link>
              </h2>
              <p className="summary">{article.summary}</p>
              
              <div className="why-matters">
                <strong>Why this matters for your business:</strong>
                <p>{article.why_it_matters}</p>
              </div>
              
              <div className="card-cta" style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
                <Link href={`/news/${article.slug}`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', textDecoration: 'underline' }}>
                  Read full article
                </Link>
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
