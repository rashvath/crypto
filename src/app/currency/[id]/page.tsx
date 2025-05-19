"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { fetchCryptoDetails, fetchMarketChart } from "../../../lib/api";
import Chart from "../../../components/Chart";
import "../../globals.css";
import CurrencyConverter from "@/components/CurrencyConverter";
import { NavBar } from "@/components/navbar"; // <-- Import NavBar

export default function CurrencyDetailPage() {
  const params = useParams();
  const idParam = params?.id;

  const id =
    typeof idParam === "string"
      ? idParam
      : Array.isArray(idParam)
      ? idParam[0]
      : null;

  const [details, setDetails] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        if (typeof id !== "string") {
          throw new Error("Invalid ID type");
        }
        const [detailData, chart] = await Promise.all([
          fetchCryptoDetails(id),
          fetchMarketChart(id, 30),
        ]);
        setDetails(detailData);

        const labels = chart.prices.map((p: any[]) =>
          new Date(p[0]).toLocaleDateString()
        );
        const prices = chart.prices.map((p: any[]) => p[1]);

        setChartData({
          labels,
          datasets: [
            {
              label: "Price in USD",
              data: prices,
              fill: true,
              borderColor: "#2563eb", // Darker blue
              backgroundColor: "rgba(37, 99, 235, 0.15)", // Subtle background
              tension: 0.4,
            },
          ],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (!id) {
    return <div className="p-4 text-red-600">Invalid currency ID</div>;
  }

  if (loading || !details || !chartData) {
    return (
      <>
        <NavBar wishlistCount={0} />{" "}
        {/* Show NavBar with zero wishlist count while loading */}
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
          <p className="text-gray-600 text-lg font-medium">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar wishlistCount={0} />{" "}
      {/* Update wishlistCount as needed if you have context */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Side - Currency Details */}
          <div className="w-full md:w-1/3 bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-col items-center">
              {details.image?.large && (
                <img
                  src={details.image.large}
                  alt={details.name}
                  width={120}
                  height={120}
                  className="rounded-full mb-4"
                  onError={(e) => {
                    e.currentTarget.src = "/crypto-placeholder.png";
                  }}
                />
              )}
              <h1 className="text-3xl font-bold mb-2 text-gray-900 text-center">
                {details.name}
              </h1>
              <p className="text-gray-700 text-lg mb-6 uppercase tracking-wide">
                {details.symbol}
              </p>

              <div className="w-full space-y-4">
                <DetailItem
                  label="Current Price"
                  value={`$${details.market_data.current_price.usd.toLocaleString()}`}
                />
                <DetailItem
                  label="24h Change"
                  value={`${details.market_data.price_change_percentage_24h.toFixed(
                    2
                  )}%`}
                  color={
                    details.market_data.price_change_percentage_24h >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                />
                <DetailItem
                  label="Market Cap"
                  value={`$${details.market_data.market_cap.usd.toLocaleString()}`}
                />
                <DetailItem
                  label="24h Trading Volume"
                  value={`$${details.market_data.total_volume.usd.toLocaleString()}`}
                />
                <DetailItem
                  label="All-Time High"
                  value={`$${details.market_data.ath.usd.toLocaleString()}`}
                />
                <DetailItem
                  label="Circulating Supply"
                  value={`${details.market_data.circulating_supply.toLocaleString()} ${details.symbol.toUpperCase()}`}
                />
              </div>
            </div>
          </div>

          {/* Right Side - Chart */}
          <div className="w-full md:w-2/3 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl text-gray-800 font-semibold mb-4">
              Price Chart (Last 30 Days)
            </h2>
            <div className="h-96">
              <Chart data={chartData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Reusable DetailItem Component
function DetailItem({
  label,
  value,
  color = "text-gray-900",
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex justify-between text-gray-800">
      <span className="text-gray-600">{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}
