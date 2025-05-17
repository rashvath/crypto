// src/app/profile/page.tsx
"use client";
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import { useWishlist } from "../../context/WishlistContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchCryptoDetails } from "@/lib/api";
import "../globals.css";
import Link from "next/link";

interface CoinData {
  id: string;
  name: string;
  image: string;
  symbol: string;
}

export default function ProfilePage() {
  const { wishlist, toggleWishlist } = useWishlist();

  const [coinsData, setCoinsData] = useState<Record<string, CoinData>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const data: Record<string, CoinData> = {};
        for (const coinId of wishlist) {
          const coin = await fetchCryptoDetails(coinId);
          data[coinId] = {
            id: coin.id,
            name: coin.name,
            image: coin.image.large || coin.image.small || coin.image.thumb,
            symbol: coin.symbol,
          };
        }
        setCoinsData(data);
      } catch (error) {
        console.error("Failed to fetch coin data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (wishlist.length > 0) {
      fetchCoinData();
    } else {
      setLoading(false);
    }
  }, [wishlist]);

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-64 animate-fade-in">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-white">
          Loading Wish List, please wait...
        </p>
      </div>
    );

  return (
    // <div className="flex items-center justify-center min-h-screen bg-slate-700 dark:bg-gray-900 p-6">
    <div className="p-10 w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
      <SignedIn>
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Crypto Live Tracker
          </h1>
          <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
            Your Wishlist
          </h2>
        </div>

        {wishlist.length === 0 ? (
          <p className="text-xl text-gray-600 dark:text-gray-300 py-10">
            No items in wishlist. Add some coins to track them!
          </p>
        ) : (
          <div className="space-y-8">
            {wishlist.map((coinId) => {
              const coin = coinsData[coinId];

              // function toggleItem(coinId: string): void {
              //   throw new Error("Function not implemented.");
              // }

              return (
                <div
                  key={coinId}
                  className="flex items-center justify-between p-8 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300"
                >
                  <div className="flex items-center space-x-8">
                    {coin?.image ? (
                      <div className="flex-shrink-0 relative w-16 h-16">
                        <Image
                          src={coin.image}
                          alt={coin.name}
                          width={64}
                          height={64}
                          className="rounded-full object-cover"
                          unoptimized={true}
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-200">
                          {coinId.toUpperCase().slice(0, 3)}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-2xl font-medium text-gray-800 dark:text-gray-200">
                        {coin?.name || coinId.toUpperCase()}
                      </span>
                      <Link
                        href={`/currency/${coin?.id || coinId}`}
                        className="text-blue-600 dark:text-blue-400 underline text-sm mt-1 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                  <button
                    className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors text-xl font-medium"
                    onClick={() => toggleWishlist(coinId)}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </SignedIn>
      <SignedOut>
        <div className="text-center py-12">
          <h2 className="mb-8 text-3xl font-semibold text-gray-800 dark:text-white">
            Please sign in to view your wishlist
          </h2>
          <div className="flex justify-center">
            <SignIn routing="hash" />
          </div>
        </div>
      </SignedOut>

      <div className="mt-12 text-right text-gray-500 dark:text-gray-400">
        <div className="text-xl">
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        <div className="text-lg">{new Date().toLocaleDateString()}</div>
      </div>
    </div>
    // </div>
  );
}
