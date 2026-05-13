import type { Metadata } from "next";
import { Average, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const average = Average({ weight: "400", subsets: ["latin"], variable: '--font-average' });
const dmSans = DM_Sans({ subsets: ["latin"], variable: '--font-dm-sans' });

export const metadata: Metadata = {
  title: "Ethical Transparency News | Supply Chain Integrity",
  description: "An automated newsroom dedicated to the mission of the Ethical Transparency Alliance, ensuring ethics becomes an embedded expectation in the new era of retail transparency.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${average.variable} ${dmSans.variable}`}>
      <body className={dmSans.className}>
        <div className="app-container">
          <Header />
          <main className="main-content">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
