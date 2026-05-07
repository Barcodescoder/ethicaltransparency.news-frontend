import "./glossary.css";

const GLOSSARY_TERMS = [
  { term: "What is a 2D Barcode?", definition: "A two-dimensional barcode, like a QR code or Data Matrix, that can hold significantly more data than traditional linear barcodes, including a URL that connects the product to the internet." },
  { term: "What is Sunrise 2027?", definition: "An industry-wide initiative led by GS1 to transition from traditional 1D barcodes (UPC/EAN) to 2D barcodes at the point-of-sale retail register by the year 2027." },
  { term: "What is GS1 Digital Link?", definition: "A standard that web-enables barcodes, allowing a single 2D barcode to be scanned at the checkout register and scanned by consumers on their smartphones to access web content." },
  { term: "What is a GTIN?", definition: "Global Trade Item Number. The unique identification number that GS1 assigns to your product. It's the number underneath a traditional 1D barcode." },
  { term: "What is a Resolver?", definition: "A web server that takes a GS1 Digital Link URL and redirects the user (or scanner) to the appropriate destination based on who is scanning it (e.g., consumer vs. retail register)." },
  { term: "What are Linktypes?", definition: "Standardized categories in the GS1 system that tell the resolver what kind of information is being requested, such as 'Recipe Info', 'Traceability', or 'Product Recall Status'." },
  { term: "What is a Data Matrix?", definition: "A type of 2D barcode often used in healthcare and fresh foods. It looks like a square of black and white pixels." },
  { term: "What is a QR Code?", definition: "Quick Response code. The most widely recognized 2D barcode format, easily scannable by all modern smartphone cameras." },
  { term: "What is a Point of Sale (POS)?", definition: "The place where retail transactions occur, usually the checkout register." },
  { term: "What is dynamic routing?", definition: "The ability of a GS1 Resolver to change where a barcode points without having to reprint the physical barcode on the packaging." },
  { term: "What is product traceability?", definition: "The ability to track a product's journey from raw materials to the consumer, often facilitated by 2D barcodes carrying batch and serial numbers." },
  { term: "What is a Serial Number?", definition: "A unique identifier assigned to an individual instance of a product, added alongside the GTIN in a 2D barcode for precise tracking." },
  { term: "What is a Batch/Lot Number?", definition: "An identification number assigned to a specific production run of a product, crucial for managing targeted product recalls." },
  { term: "What is a UPC?", definition: "Universal Product Code. The standard 1D barcode format used primarily in North America." },
  { term: "What is an EAN?", definition: "European Article Number. The standard 1D barcode format used globally outside of North America." },
  { term: "What is consumer engagement?", definition: "Interactions between a brand and a customer. 2D barcodes boost this by linking physical products to digital experiences." },
  { term: "What is an Application Identifier (AI)?", definition: "A 2-to-4 digit prefix in a GS1 barcode that defines the meaning and format of the data that follows it (e.g., (01) for GTIN)." },
  { term: "What is 'web-enabled' packaging?", definition: "Packaging that includes a GS1 Digital Link 2D barcode, turning the physical product into a gateway to online information." },
  { term: "What is a URL?", definition: "Uniform Resource Locator. A standard web address. GS1 Digital Links are essentially specialized URLs." },
  { term: "What is the GS1 Global Office?", definition: "The central coordinating body for GS1, the not-for-profit organization that develops and maintains global standards for business communication." }
];

export default function GlossaryPage() {
  return (
    <div className="glossary-page">
      <header className="page-header">
        <h1>2D Barcode Glossary</h1>
        <p>Your plain-language guide to the terminology of the Sunrise 2027 transition.</p>
      </header>

      <div className="glossary-grid">
        {GLOSSARY_TERMS.map((item, i) => (
          <div key={i} className="glossary-card">
            <h2>{item.term}</h2>
            <p>{item.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
