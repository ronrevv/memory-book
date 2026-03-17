import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MemoryBook — Turn Your Photos Into Beautiful Scrapbooks",
  description: "Transform your digital photos into stunning physical scrapbooks. AI-powered layouts, premium printing, and doorstep delivery. Preserve your memories beautifully.",
  keywords: "scrapbook, photo book, memories, print photos, photo album, AI scrapbook",
  openGraph: {
    title: "MemoryBook — Turn Your Photos Into Beautiful Scrapbooks",
    description: "Transform your digital photos into stunning physical scrapbooks with AI-powered design.",
    type: "website",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "MemoryBook",
    description: "Turn your photos into beautiful physical scrapbooks",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
