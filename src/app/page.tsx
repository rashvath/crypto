"use client";

import { fetchCryptoList } from "@/lib/api";
import { useEffect, useState, useRef, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";
import {
  Heart,
  Loader2,
  Search,
  X,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { NavBar } from "@/components/navbar";
import toast, { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
// import a simple sparkline chart component if you have one (optional)
// import Sparkline from '@/components/Sparkline';

interface CryptoCoin {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  current_price: number;
  price_change_percentage_24h: number;
  // price_history?: number[]; // If you support sparklines
}

function ClientToastOnVisit() {
  const { isSignedIn, isLoaded } = useAuth();
  const hasShown = useRef(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn && !hasShown.current) {
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white text-gray-900 rounded-xl shadow-xl border border-gray-200 p-5 md:p-6 transition-all duration-300 relative`}
          >
            <button
              onClick={() => toast.dismiss(t.id)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-semibold"
              aria-label="Close"
              type="button"
            >
              ×
            </button>
            <div className="mb-4 text-base md:text-lg font-semibold text-center">
              🔐 Sign in to add your favorite coins to the wishlist!
            </div>
            <div className="flex justify-center">
              <SignInButton>
                <button
                  className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-md transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  aria-label="Sign In"
                  type="button"
                >
                  Sign In
                </button>
              </SignInButton>
            </div>
          </div>
        ),
        { duration: 6000 }
      );
      hasShown.current = true;
    }
  }, [isLoaded, isSignedIn]);

  return null;
}

// CoinCard: memoized for performance, animate on mount/hover
const CoinCard = memo(function CoinCard({
  coin,
  isWishlisted,
  toggleWishlist,
}: {
  coin: CryptoCoin;
  isWishlisted: boolean;
  toggleWishlist: (id: string) => void;
}) {
  return (
    <div
      key={coin.id}
      tabIndex={0}
      className="relative bg-white/70 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg p-6 group transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl focus-within:ring-2 focus-within:ring-yellow-400"
    >
      <div className="flex items-center gap-5">
        {coin.image && (
          <Image
            src={coin.image}
            alt={coin.name}
            width={52}
            height={52}
            className="rounded-full border border-yellow-200 shadow"
            loading="lazy"
          />
        )}
        <div>
          <Link
            href={`/currency/${coin.id}`}
            className="hover:underline"
            tabIndex={-1}
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-yellow-500 transition-colors">
              {coin.name}
            </h2>
          </Link>
          <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
            {coin.symbol}
          </p>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2">
        <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 select-all">
          ${coin.current_price.toLocaleString()}
        </p>
        {coin.price_change_percentage_24h >= 0 ? (
          <TrendingUp className="w-5 h-5 text-green-500" />
        ) : (
          <TrendingDown className="w-5 h-5 text-red-500" />
        )}
        <p
          className={`text-lg font-semibold ${
            coin.price_change_percentage_24h >= 0
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {coin.price_change_percentage_24h >= 0 ? "+" : ""}
          {coin.price_change_percentage_24h.toFixed(2)}%
        </p>
      </div>
      {/* Optionally add a sparkline chart below */}
      {/* coin.price_history && <Sparkline data={coin.price_history} /> */}
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(coin.id);
        }}
        className={`absolute top-5 right-5 p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 group-heart
          ${
            isWishlisted
              ? "text-red-500 scale-110"
              : "text-gray-400 dark:text-gray-500"
          }
        `}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={isWishlisted}
      >
        <Heart
          className="w-6 h-6"
          fill={isWishlisted ? "currentColor" : "none"}
        />
        {isWishlisted && (
          <span className="absolute -top-2 -right-2 bg-yellow-400 text-white text-xs rounded-full px-2 py-0.5 shadow">
            Wishlisted
          </span>
        )}
      </button>
    </div>
  );
});

export default function Home() {
  const [cryptos, setCryptos] = useState<CryptoCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Fetch crypto data
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchCryptoList();
        setCryptos(data);
        setError(null);
      } catch (error) {
        setError("Failed to load cryptocurrency data. Please try again later.");
        console.error("Failed to fetch crypto data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredCryptos = cryptos.filter(
    (coin) =>
      coin.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-yellow-50 via-white to-yellow-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Toast container */}
      <Toaster position="top-right" />
      <ClientToastOnVisit />
      <NavBar wishlistCount={wishlist.length} />

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 select-none text-gray-900 dark:text-gray-100">
          <span className="relative inline-block">
            Discover the
            <span className="relative z-10 px-2 -skew-x-12 bg-yellow-300 dark:bg-yellow-500 text-gray-900 dark:text-gray-900 ml-2">
              Top 200 Cryptos
            </span>
          </span>
          <br />
          <span className="block mt-2 text-lg font-semibold text-gray-600 dark:text-gray-300">
            — Your gateway to the crypto market —
          </span>
        </h1>

        <div className="relative w-full md:w-1/2 mx-auto mb-8">
          <Search className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Type a coin to start your crypto adventure"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 transition duration-300 ease-in-out text-gray-900 dark:text-white dark:bg-gray-800"
            aria-label="Search for cryptocurrencies"
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex justify-between mb-6 items-center">
          <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">
            Showing <strong>{filteredCryptos.length}</strong> of{" "}
            {cryptos.length} coins
          </span>
          {/* You could add a sort/filter dropdown here */}
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Loading cryptocurrency data...
            </p>
          </div>
        ) : error ? (
          <div className="container mx-auto px-4 py-10 text-center">
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-lg p-6 max-w-2xl mx-auto">
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200">
                Error Loading Data
              </h2>
              <p className="mt-2 text-red-600 dark:text-red-300">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : filteredCryptos.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-24 h-24 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              No cryptocurrencies found
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Try adjusting your search to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 animate-fadein">
            {filteredCryptos.map((coin) => (
              <CoinCard
                key={coin.id}
                coin={coin}
                isWishlisted={isInWishlist(coin.id)}
                toggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
