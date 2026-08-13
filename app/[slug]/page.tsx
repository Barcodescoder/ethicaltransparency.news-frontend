import { getRequestContext } from "@cloudflare/next-on-pages";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../news.css";

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

export const THEME_SLUGS: Record<string, { name: string; title: string; description: string }> = {
  "supply-chain-transparency": {
    name: "Supply Chain Transparency",
    title: "Supply Chain Transparency News & Analysis | Ethical Transparency News",
    description: "Read the latest news, analysis, and data-driven insights on supply chain transparency, ethical sourcing, and verified product data.",
  },
  "modern-slavery": {
    name: "Modern Slavery",
    title: "Modern Slavery & Human Rights Sourcing News | Ethical Transparency News",
    description: "Stay informed on modern slavery legislation, forced labor prevention, and ethical labor standards in global supply chains.",
  },
  "gs1-2d-barcodes": {
    name: "GS1 2D Barcodes",
    title: "GS1 2D Barcodes & Digital Link News | Ethical Transparency News",
    description: "Discover news on GS1 2D Barcodes, Digital Link standards, Sunrise 2027, and machine-readable ethical product packaging.",
  },
  "fair-trade-wages": {
    name: "Fair Trade & Wages",
    title: "Fair Trade & Living Wages News | Ethical Transparency News",
    description: "Updates and editorial reports on fair trade certification, living wages, and fair value distribution across global production chains.",
  },
};

export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const themeInfo = THEME_SLUGS[params.slug];
  if (!themeInfo) return {};

  const url = `https://ethicaltransparency.news/${params.slug}`;

  return {
    title: themeInfo.title,
    description: themeInfo.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: themeInfo.title,
      description: themeInfo.description,
      url: url,
      siteName: "Ethical Transparency News",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: themeInfo.title,
      description: themeInfo.description,
    },
  };
}

export default async function ThemePage({
  params
}: {
  params: { slug: string }
}) {
  const themeInfo = THEME_SLUGS[params.slug];

  if (!themeInfo) {
    notFound();
  }

  let articles: Article[] = [];

  try {
    let db = process.env.DB as unknown as D1Database;
    if (!db) {
      const ctx = getRequestContext();
      db = ctx?.env?.DB as D1Database;
    }

    if (db) {
      const stmt = db.prepare("SELECT * FROM articles WHERE theme = ? ORDER BY published_at DESC LIMIT 50")
        .bind(themeInfo.name);
      const { results } = await stmt.all<Article>();
      articles = results || [];
    }
  } catch (e) {
    console.error("Database error fetching theme articles:", e);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": themeInfo.title,
    "description": themeInfo.description,
    "url": `https://ethicaltransparency.news/${params.slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": articles.map((article, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `https://ethicaltransparency.news/news/${article.slug}`,
        "name": article.headline,
      })),
    },
  };

  return (
    <div className="news-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="page-header">
        <div style={{ marginBottom: "0.75rem", fontSize: "0.9rem", color: "var(--border-color)" }}>
          <Link href="/" style={{ color: "var(--primary-color)", textDecoration: "none" }}>Home</Link>
          {" › "}
          <span>{themeInfo.name}</span>
        </div>
        <h1 className="main-title">{themeInfo.name}</h1>
        <p className="main-subtitle">{themeInfo.description}</p>
      </header>

      <div className="filter-bar">
        <span style={{ fontWeight: "bold", marginRight: "1rem" }}>Explore Themes: </span>
        <div className="filter-links" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", margin: "1rem 0" }}>
          <Link href="/">All</Link>
          <Link href="/supply-chain-transparency" className={params.slug === "supply-chain-transparency" ? "active" : ""}>Supply Chain Transparency</Link>
          <Link href="/modern-slavery" className={params.slug === "modern-slavery" ? "active" : ""}>Modern Slavery</Link>
          <Link href="/gs1-2d-barcodes" className={params.slug === "gs1-2d-barcodes" ? "active" : ""}>GS1 2D Barcodes</Link>
          <Link href="/fair-trade-wages" className={params.slug === "fair-trade-wages" ? "active" : ""}>Fair Trade & Wages</Link>
        </div>
      </div>

      <div className="articles-list" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {articles.length === 0 ? (
          <div className="empty-state" style={{ padding: "3rem", textAlign: "center", backgroundColor: "var(--bg-secondary)", borderRadius: "8px", border: "1px dashed var(--border-color)" }}>
            <p>No news articles found for <strong>{themeInfo.name}</strong> right now. The Ethical Transparency Agent is searching the web daily!</p>
          </div>
        ) : (
          articles.map((article) => (
            <article key={article.id} className="news-card" style={{ padding: "2rem", backgroundColor: "var(--text-light)", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}>
              <div className="card-meta" style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "0.9rem", color: "var(--border-color)" }}>
                <span className="theme-tag" style={{ fontWeight: "bold", color: "var(--primary-color)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{article.theme}</span>
                <time style={{ color: "var(--border-color)" }}>{new Date(article.published_at).toLocaleDateString()}</time>
              </div>
              <h2 className="headline" style={{ fontSize: "1.75rem", marginBottom: "1rem", color: "var(--text-dark)", lineHeight: 1.3 }}>
                <Link href={`/news/${article.slug}`} style={{ textDecoration: "none", color: "inherit" }}>{article.headline}</Link>
              </h2>
              <p className="summary" style={{ fontSize: "1.1rem", color: "var(--text-dark)", marginBottom: "1.5rem", lineHeight: 1.6 }}>{article.summary}</p>
              
              <div className="why-matters" style={{ padding: "1.5rem", backgroundColor: "var(--bg-secondary)", borderLeft: "4px solid var(--border-color)", borderRadius: "0 8px 8px 0", marginBottom: "1.5rem" }}>
                <strong style={{ display: "block", marginBottom: "0.5rem", color: "var(--primary-color)" }}>Why this matters for the Ethical Transparency Alliance:</strong>
                <p style={{ color: "var(--text-dark)", lineHeight: 1.5 }}>{article.why_it_matters}</p>
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
