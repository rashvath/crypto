"use client";

import { useAuth, SignInButton } from "@clerk/nextjs";
import { useWishlist } from "@/context/WishlistContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { NavBar } from "@/components/navbar";
import Footer from "@/components/Footer";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
}

export default function WishlistPage() {
  const { isSignedIn } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist(); // Added toggleWishlist
  const [coins, setCoins] = useState<Coin[]>([]);

  useEffect(() => {
    if (!isSignedIn || wishlist.length === 0) {
      setCoins([]);
      return;
    }

    const fetchWishlistData = async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${wishlist.join(
          ","
        )}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
      );
      const data = await response.json();
      setCoins(data);
    };

    fetchWishlistData();
  }, [wishlist, isSignedIn]);

  return (
    <>
      <NavBar wishlistCount={wishlist.length} />

      {!isSignedIn ? (
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-6">
            You must be signed in to view your wishlist.
          </p>
          <SignInButton mode="modal">
            <button className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow hover:bg-yellow-600 transition duration-300">
              Sign In
            </button>
          </SignInButton>
        </div>
      ) : (
        <>
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

            {coins.length === 0 ? (
              <p className="text-gray-500">No coins in your wishlist yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {coins.map((coin) => (
                  <div
                    key={coin.id}
                    className="border rounded-xl p-4 hover:shadow-2xl transition-shadow duration-300 bg-white hover:bg-gray-50 flex items-center justify-between"
                  >
                    <Link
                      href={`/currency/${coin.id}`}
                      className="flex items-center gap-4 flex-grow"
                    >
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-12 h-12 rounded-full border border-gray-200"
                      />
                      <div>
                        <h2 className="font-semibold text-lg">{coin.name}</h2>
                        <p className="text-sm text-gray-500 uppercase">
                          {coin.symbol}
                        </p>
                        <p className="text-green-600 font-medium text-lg">
                          ${coin.current_price.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                    <button
                      onClick={() => toggleWishlist(coin.id)}
                      className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                      aria-label={`Remove ${coin.name} from wishlist`}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Footer />
        </>
      )}
    </>
  );
}
