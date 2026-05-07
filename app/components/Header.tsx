import Link from "next/link";
import "./Header.css";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <Link href="/" className="logo">
          <span className="logo-icon">❖</span> 2D Barcode Insights
        </Link>
        <nav className="main-nav">
          <Link href="/">News</Link>
          <Link href="/glossary">Glossary</Link>
          <Link href="/about">About</Link>
          <a href="https://ibn.link" target="_blank" rel="noopener noreferrer" className="cta-button">
            Manage My 2D Codes
          </a>
        </nav>
      </div>
    </header>
  );
}
