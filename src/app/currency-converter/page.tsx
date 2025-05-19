"use client";

import CurrencyConverter from "@/components/CurrencyConverter";
import Footer from "@/components/Footer";
import { NavBar } from "@/components/navbar";
import { useWishlist } from "@/context/WishlistContext";

export default function CurrencyConverterPage() {
  const cryptoPrice = 50000;
  const cryptoName = "BTC";
  const { wishlist } = useWishlist();

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavBar wishlistCount={wishlist.length} />
        <main className="container mx-auto py-8">
          <CurrencyConverter
            cryptoPrice={cryptoPrice}
            cryptoName={cryptoName}
          />
        </main>
      </div>
      <Footer />
    </>
  );
}
