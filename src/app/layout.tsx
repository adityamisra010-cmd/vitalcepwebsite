import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../styles/index.css';

export const metadata: Metadata = {
  title: 'Agency OS',
  description: 'Internal operating system for agency creative operations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
