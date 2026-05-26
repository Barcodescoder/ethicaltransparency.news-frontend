import { MetadataRoute } from 'next';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';
export const revalidate = 3600; // Revalidate every hour

const BASE_URL = 'https://ethicaltransparency.news';

type Article = {
  slug: string;
  published_at: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let articles: Article[] = [];

  try {
    let db = process.env.DB as unknown as D1Database;
    if (!db) {
      const ctx = getRequestContext();
      db = ctx?.env?.DB as D1Database;
    }

    if (db) {
      const { results } = await db.prepare(
        "SELECT slug, published_at FROM articles ORDER BY published_at DESC"
      ).all<Article>();
      articles = results || [];
    }
  } catch (e) {
    console.error("Sitemap database error:", e);
  }

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/glossary`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  const dynamicPages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/news/${article.slug}`,
    lastModified: new Date(article.published_at),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticPages, ...dynamicPages];
}
