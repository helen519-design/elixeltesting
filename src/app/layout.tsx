import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WPA Claim Flow',
  description: 'Health claim prototype',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">
        {children}
        <div id="root-portal" />
      </body>
    </html>
  );
}