import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WhatsApp Mass Messenger',
  description: 'Upload contacts, compose personalized messages, and launch WhatsApp outreach campaigns instantly.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-50">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
