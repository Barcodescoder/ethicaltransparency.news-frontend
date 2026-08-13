import { Metadata } from "next";
import Link from "next/link";
import "../about/about.css";

export const runtime = 'edge';

export const metadata: Metadata = {
  title: "The Case for 'gs1:ethics': Standardising Ethical Transparency in 2D Barcodes | ETA",
  description: "Learn how the Ethical Transparency Alliance is advocating for a dedicated 'gs1:ethics' GS1 Digital Link link type standard as part of the retail industry Sunrise 2027 transition.",
  alternates: {
    canonical: "https://ethicaltransparency.news/gs1-ethics",
  },
  openGraph: {
    title: "Standardising Ethical Transparency in 2D Barcodes (gs1:ethics)",
    description: "Empowering conscious consumers with machine-readable, verified supply chain ethics data embedded directly in GS1 2D barcodes.",
    url: "https://ethicaltransparency.news/gs1-ethics",
    siteName: "Ethical Transparency News",
    type: "article",
  },
};

export default function Gs1EthicsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "The Case for 'gs1:ethics': Standardising Ethical Transparency in 2D Barcodes",
    "description": "Advocating for a dedicated GS1 Digital Link standard to connect consumers directly with verified supply chain ethics data.",
    "author": {
      "@type": "Organization",
      "name": "Ethical Transparency Alliance",
      "url": "https://ethicaltransparency.org"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ethical Transparency News",
      "url": "https://ethicaltransparency.news"
    },
    "mainEntityOfPage": "https://ethicaltransparency.news/gs1-ethics"
  };

  return (
    <div className="about-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="page-header">
        <div style={{ marginBottom: "0.75rem", fontSize: "0.9rem", color: "var(--border-color)" }}>
          <Link href="/" style={{ color: "var(--primary-color)", textDecoration: "none" }}>Home</Link>
          {" › "}
          <span>GS1 Ethics Standard</span>
        </div>
        <h1>The Case for <code>gs1:ethics</code></h1>
        <p className="main-subtitle" style={{ color: "var(--text-light)", opacity: 0.9 }}>
          Transforming retail 2D barcodes into machine-readable portals for verified ethical transparency.
        </p>
      </header>

      <div className="about-content">
        <section className="about-section">
          <h2>The Sunrise 2027 Opportunity</h2>
          <p>
            By 2027, global retail is transitioning from traditional 1D barcodes to 2D barcodes (such as QR codes powered by the <strong>GS1 Digital Link</strong> standard). This shift will replace simple 12- or 13-digit product numbers with intelligent web URIs capable of directing consumers, regulators, and point-of-sale systems to specific product data.
          </p>
          <p>
            While standard link types currently exist for user manuals (<code>gs1:pip</code>), promotional content (<code>gs1:promo</code>), and recipe information (<code>gs1:recipe</code>), there is no standardized link type for <strong>verified ethical supply chain data</strong>.
          </p>
        </section>

        <section className="about-section highlight-box">
          <h2>Why We Need <code>gs1:ethics</code></h2>
          <p>
            The <strong>Ethical Transparency Alliance (ETA)</strong> is leading the international initiative to recognize <code>gs1:ethics</code> as an official GS1 link type. Standardizing this data link type accomplishes three major goals:
          </p>
          <ul style={{ paddingLeft: "1.25rem", margin: "1rem 0", lineHeight: "1.7" }}>
            <li><strong>Eliminating Greenwashing:</strong> Replaces unverified marketing slogans with structured, auditable data records regarding living wages, modern slavery due diligence, and carbon footprint metrics.</li>
            <li><strong>Machine-Readable Verification:</strong> Allows third-party ethics scanners, browser extensions, and retail AI assistants to instantly parse product claims.</li>
            <li><strong>Empowering Ethical Brands:</strong> Leveling the playing field so SMEs committed to authentic fair trade receive immediate consumer visibility at point of purchase.</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>How <code>gs1:ethics</code> Works</h2>
          <p>
            Under the GS1 Digital Link standard, a product GTIN barcode resolves dynamically based on context. When a smartphone camera or specialized application requests an ethics lookup, the resolver returns the dedicated <code>gs1:ethics</code> payload:
          </p>
          <pre style={{ backgroundColor: "#1e1e1e", color: "#d4d4d4", padding: "1.25rem", borderRadius: "8px", overflowX: "auto", fontSize: "0.9rem", lineHeight: "1.5" }}>
{`// Example GS1 Digital Link URI
https://id.brand.com/01/09412345678902?linkType=gs1:ethics

// Verified Ethics Data Response
{
  "certifications": ["Fairtrade International", "B Corp Certified"],
  "livingWageVerified": true,
  "modernSlaveryAuditDate": "2026-04-15",
  "tier1SupplierTransparency": "100%",
  "traceabilityUrl": "https://traceability.brand.com/batch/88412"
}`}
          </pre>
        </section>

        <section className="about-section">
          <h2>Join the Movement</h2>
          <p>
            The Ethical Transparency Alliance brings together brand owners, supply chain technology providers, and conscious consumers to establish open standards for ethical data.
          </p>
          <div className="cta-wrapper" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
            <a href="https://ethicaltransparency.org/" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-large">
              Join the Alliance →
            </a>
            <Link href="/" className="btn btn-secondary btn-large">
              Explore News & Updates
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
