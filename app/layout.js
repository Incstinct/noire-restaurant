import { EB_Garamond } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-garamond",
});

export const metadata = {
  title: "Noire — Fine Dining",
  description: "An intimate fine dining experience in the heart of the city.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${garamond.variable} font-[family-name:var(--font-garamond)] antialiased bg-[#0d1117]`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}