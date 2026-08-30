import "./globals.css";

export const metadata = {
  title: "Jigyasafabrics.in | Sanganeri Hand-Block Apparel & Fabrics",
  description: "Authentic Jaipur Sanganeri Block Printed Clothes & Running Fabrics for B2B Wholesale & B2C Retail.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <body className="min-h-screen flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}