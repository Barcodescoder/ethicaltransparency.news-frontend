import Image from "next/image";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <div style={{ marginBottom: '1rem' }}>
              <Image 
                src="/logo.png" 
                alt="Ethical Transparency Alliance" 
                width={250} 
                height={40} 
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p>Empowering consumers to demand change.</p>
          </div>
          <div className="footer-regional">
            <h4>The Ethical Transparency Alliance</h4>
            <p>Advocating for a dedicated gs1:ethics link type.</p>
            <div className="regional-links">
              <a href="https://ethicaltransparency.org/about/" target="_blank" rel="noopener noreferrer">
                About the Alliance
              </a>
              <a href="https://ethicaltransparency.org/" target="_blank" rel="noopener noreferrer">
                Join the Mission
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Ethical Transparency Alliance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
