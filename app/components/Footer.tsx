import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>2D Barcode Insights</h3>
            <p>Your AI-powered newsroom for the GS1 Sunrise 2027 transition.</p>
          </div>
          <div className="footer-regional">
            <h4>Regional Resources</h4>
            <p>Need base GTINs or EANs for your products?</p>
            <div className="regional-links">
              <a href="https://barcodes.co.nz" target="_blank" rel="noopener noreferrer">
                🇳🇿 New Zealand (barcodes.co.nz)
              </a>
              <a href="https://barcodesaustralia.com" target="_blank" rel="noopener noreferrer">
                🇦🇺 Australia (barcodesaustralia.com)
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} 2D Barcode Insights. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
