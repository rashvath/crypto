// components/TrendingCoins.tsx
"use client";
import { useEffect, useState } from "react";
import { fetchTrendingCoins } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { Flame, ArrowUpRight, TrendingUp, Loader2 } from "lucide-react";

interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  small: string;
  large: string;
  price_btc: number;
  score: number;
}

export default function TrendingCoins() {
  const [trending, setTrending] = useState<TrendingCoin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTrendingCoins();
        setTrending(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch trending coins"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 gap-5 min-h-[220px]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 dark:text-indigo-400" />
        <p className="text-white dark:text-gray-300 text-lg font-medium select-none">
          Loading trending coins...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-6 min-h-[220px] bg-red-50 dark:bg-red-900 rounded-lg shadow-md">
        <p className="text-red-600 dark:text-red-400 text-center font-semibold text-lg select-none">
          {error}
        </p>
        <button
          onClick={() => {
            setLoading(true);
            setError(null);
            fetchTrendingCoins()
              .then(setTrending)
              .catch((err) => setError(err.message))
              .finally(() => setLoading(false));
          }}
          className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-400 dark:focus:ring-indigo-600 transition-colors font-semibold select-none"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-3">
        <Flame className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        <h3 className="font-extrabold text-xl md:text-2xl bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent select-none tracking-wide">
          Trending Coins (24h)
        </h3>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trending.map((coin, idx) => (
          <Link
            key={coin.id}
            href={`/currency/${coin.id}`}
            className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-400 dark:focus-visible:ring-indigo-600"
            prefetch={false}
            style={{
              animation: `fadeInUp 0.6s ease forwards`,
              animationDelay: `${idx * 0.1}s`,
              opacity: 0,
            }}
          >
            <div className="flex items-center justify-between p-5 cursor-pointer select-none">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 shrink-0">
                  <Image
                    src={coin.small}
                    alt={`${coin.name} logo`}
                    fill
                    className="rounded-full object-contain"
                    sizes="48px"
                    priority={idx < 3}
                  />
                </div>
                <div className="overflow-hidden min-w-0">
                  <p className="font-bold text-gray-900 dark:text-gray-100 truncate">
                    {coin.name}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                    <span className="uppercase tracking-wide">
                      {coin.symbol}
                    </span>
                    {coin.market_cap_rank && (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>#{coin.market_cap_rank}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors shrink-0" />
            </div>
          </Link>
        ))}
      </div>

      {/* Add fadeInUp keyframes animation style */}
      <style>
        {`
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(15px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}
