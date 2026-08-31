import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'Jigyasa Fabrics | Flipkart Store',
  description: 'Fabric Store',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}