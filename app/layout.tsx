import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HN Recommender",
  description: "Personalized Hacker News recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-orange-600">
              HN Recommender
            </h1>
            <div className="text-sm text-gray-500">
              Personalized Hacker News Feed
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
