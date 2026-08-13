import { Metadata } from "next";
import Link from "next/link";
import "./about.css";

export const runtime = 'edge';

export const metadata: Metadata = {
  title: "About Ethical Transparency News | Ethical Transparency Alliance",
  description: "Learn about Ethical Transparency News, an AI-automated newsroom bridging conscious consumers and verified supply chain transparency data.",
  alternates: {
    canonical: "https://ethicaltransparency.news/about",
  },
  openGraph: {
    title: "About Ethical Transparency News",
    description: "Bridging the gap between conscious consumers and trusted supply chain transparency data.",
    url: "https://ethicaltransparency.news/about",
    siteName: "Ethical Transparency News",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <header className="page-header">
        <h1>About Ethical Transparency News</h1>
        <p className="main-subtitle" style={{ color: "var(--text-light)", opacity: 0.9 }}>
          Bridging conscious consumers and verified supply chain data in the era of retail transparency.
        </p>
      </header>

      <div className="about-content">
        <section className="about-section">
          <h2>The Sunrise 2027 Transition</h2>
          <p>
            The global retail industry is undergoing a massive transformation. By 2027, traditional linear barcodes (UPC/EAN) are being upgraded to 2D barcodes (such as QR codes powered by the GS1 Digital Link standard).
          </p>
          <p>
            This shift enables products to carry rich, machine-readable data right on their packaging — opening up direct communication channels between brands, retailers, and conscious consumers.
          </p>
        </section>

        <section className="about-section highlight-box">
          <h2>Our Mission</h2>
          <p>
            <strong>Ethical Transparency News</strong> is an automated, AI-driven newsroom created for ethical brands, supply chain professionals, and conscious consumers. We monitor the web 24/7 to deliver real-time news and analysis across four core pillars:
          </p>
          <ul style={{ paddingLeft: "1.25rem", margin: "1rem 0", lineHeight: "1.7" }}>
            <li><strong>Supply Chain Transparency:</strong> Verified sourcing, traceability systems, and digital product passports.</li>
            <li><strong>Modern Slavery Prevention:</strong> Due diligence legislation, anti-forced-labor regulations, and labor rights reporting.</li>
            <li><strong>GS1 2D Barcodes:</strong> Sunrise 2027 implementation, GS1 Digital Link standards, and barcode technology updates.</li>
            <li><strong>Fair Trade & Wages:</strong> Living wage initiatives, fair trade certifications, and fair value distribution.</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>The Ethical Transparency Alliance</h2>
          <p>
            This newsroom is published in support of the <strong>Ethical Transparency Alliance (ETA)</strong>. We advocate for standardizing machine-readable ethical data — including the proposed <code>gs1:ethics</code> GS1 Digital Link standard — so consumers can make instant, informed choices at the point of purchase.
          </p>
          <p>
            Learn more about our standardisation efforts on our <Link href="/gs1-ethics" style={{ color: "var(--primary-color)", fontWeight: "bold" }}>GS1 Ethics Standard Page</Link> or join the alliance directly.
          </p>
          
          <div className="cta-wrapper" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
            <a href="https://ethicaltransparency.org/" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-large">
              Join the Alliance at EthicalTransparency.org →
            </a>
            <a href="https://ibn.link" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-large">
              Manage 2D Barcodes at IBN Link
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
