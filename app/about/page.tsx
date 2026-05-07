import "./about.css";

export default function AboutPage() {
  return (
    <div className="about-page">
      <header className="page-header">
        <h1>About 2D Barcode Insights</h1>
      </header>

      <div className="about-content">
        <section className="about-section">
          <h2>The Sunrise 2027 Transition</h2>
          <p>
            The retail industry is undergoing a massive transformation. By 2027, the traditional linear barcodes (UPC/EAN) that have beeped at checkout counters for decades will be replaced by 2D barcodes capable of storing vast amounts of data, powered by the GS1 Digital Link standard.
          </p>
          <p>
            For small and medium-sized enterprises (SMEs) in New Zealand and Australia, this transition presents both a challenge and an incredible opportunity.
          </p>
        </section>

        <section className="about-section highlight-box">
          <h2>Our Mission</h2>
          <p>
            <strong>2D Barcode Insights</strong> is an AI-automated industry newsroom designed specifically for retail and food & beverage business owners. We cut through the technical jargon to bring you the most relevant, actionable news about the Sunrise 2027 transition.
          </p>
          <p>
            Our intelligent agent scours the web daily, curating and summarizing the most important updates so you can understand exactly what this means for your packaging, your supply chain, and your customers.
          </p>
        </section>

        <section className="about-section">
          <h2>Powered by IBN Link</h2>
          <p>
            This resource is brought to you by the team behind <strong>IBN Link</strong>, a comprehensive platform that makes it easy for businesses to create, manage, and track 2D barcodes for their products.
          </p>
          <p>
            We believe that future-proofing your business shouldn't require an engineering degree. While we keep you informed here, our tools at IBN Link handle the technical heavy lifting of generating compliant GS1 Digital Links.
          </p>
          
          <div className="cta-wrapper">
            <a href="https://ibn.link" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-large">
              Manage My 2D Codes at IBN Link
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
