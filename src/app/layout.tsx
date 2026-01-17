import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'CertiFire',
  description: 'Generate Certificates with Ease',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script&family=Great+Vibes&family=Merriweather&family=Montserrat&family=Oswald&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Playfair+Display&family=Roboto&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
