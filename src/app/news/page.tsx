import CryptoNews from "@/components/CryptoNews";
import { TrendingUp } from "lucide-react";

export default function NewsPage() {
  return (
    <div>
      <h1 className="flex items-center justify-center gap-3 text-4xl font-extrabold text-blue-600 mb-8 select-none drop-shadow-lg">
        <TrendingUp className="w-8 h-8 text-green-500 animate-bounce" />
        Crypto News
        <TrendingUp className="w-8 h-8 text-green-500 animate-bounce" />
      </h1>
      <CryptoNews />
    </div>
  );
}
