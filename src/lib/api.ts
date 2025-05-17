// src/lib/api.ts

export async function fetchCryptoList() {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
  );
  if (!res.ok) throw new Error("Failed to fetch crypto list");
  return res.json();
}

export async function fetchCryptoDetails(id: string) {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
  );
  if (!res.ok) throw new Error("Failed to fetch crypto details");
  return res.json();
}

export async function fetchMarketChart(id: string, days: number = 30) {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
  );
  if (!res.ok) throw new Error("Failed to fetch market chart");
  return res.json();
}

export async function fetchTrendingCoins() {
  const res = await fetch("https://api.coingecko.com/api/v3/search/trending");
  if (!res.ok) throw new Error("Failed to fetch trending coins");
  const data = await res.json();
  return data.coins.map((entry: any) => entry.item);
}
// src/lib/api.ts
export async function fetchCryptoNews(): Promise<any[]> {
  try {
    const res = await fetch(
      "https://min-api.cryptocompare.com/data/v2/news/?lang=EN"
    );
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    // CryptoCompare news are in data.Data
    return data.Data || [];
  } catch (error) {
    console.error("Failed to fetch news:", error);
    throw new Error(
      "Unable to load news at this time. Please try again later."
    );
  }
}
