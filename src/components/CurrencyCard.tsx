// src/components/CurrencyCard.tsx
"use client";
import Link from "next/link";
import "./globals.css";
interface Props {
  coin: any;
  currencyType: "USD" | "INR";
  inWishlist: boolean;
  onToggleWishlist: () => void;
}

export default function CurrencyCard({
  coin,
  currencyType,
  inWishlist,
  onToggleWishlist,
}: Props) {
  return (
    <div className="border rounded p-4 shadow hover:scale-105 transition-transform cursor-pointer bg-white">
      <h2 className="font-bold text-xl mb-2">{coin.name}</h2>
      <p className="mb-1">Symbol: {coin.symbol.toUpperCase()}</p>
      <p className="mb-2 font-semibold text-lg">
        Price: {coin.current_price} {currencyType}
      </p>
      <div className="flex justify-between items-center mt-2">
        <Link href={`/currency/${coin.id}`} className="text-blue-500 underline">
          Details
        </Link>
        <button
          className={`px-3 py-1 rounded ${
            inWishlist ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
          onClick={onToggleWishlist}
        >
          {inWishlist ? "Remove" : "Add"}
        </button>
      </div>
    </div>
  );
}
