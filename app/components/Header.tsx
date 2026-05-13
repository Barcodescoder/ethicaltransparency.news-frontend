import Link from "next/link";
import "./Header.css";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-container">
        <Link href="/" className="logo">
          <span className="logo-icon">⚖️</span> Ethical Transparency News
        </Link>
        <nav className="main-nav">
          <Link href="/">News</Link>
          <a href="https://ethicaltransparency.org/about/" target="_blank" rel="noopener noreferrer">About ETA</a>
          <a href="https://ethicaltransparency.org/" target="_blank" rel="noopener noreferrer" className="cta-button">
            Join the Alliance
          </a>
        </nav>
      </div>
    </header>
  );
}
