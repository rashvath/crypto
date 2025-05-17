// src/app/trending/page.tsx

import TrendingCoins from "@/components/TrendingCoins";

export default function TrendingPage() {
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">
        🔥 Trending Cryptocurrencies
      </h1>
      <TrendingCoins />
    </div>
  );
}
