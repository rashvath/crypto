import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { WishlistProvider } from "@/context/WishlistContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crypto Tracker",
  description: "Track live cryptocurrency prices and market data",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <WishlistProvider>
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
              {children}
            </main>
          </WishlistProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
