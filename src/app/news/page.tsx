import CryptoNews from "@/components/CryptoNews";
import Footer from "@/components/Footer";
import { NavBar } from "@/components/navbar";
import { TrendingUp } from "lucide-react";

export default function NewsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <NavBar wishlistCount={0} />

      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="flex items-center justify-center gap-3 text-4xl md:text-5xl font-extrabold text-blue-600 dark:text-blue-300 mb-4 select-none drop-shadow-lg animate-fadein">
            <TrendingUp className="w-8 h-8 text-green-500 animate-bounce" />
            Crypto News
            <TrendingUp className="w-8 h-8 text-green-500 animate-bounce" />
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 font-medium mb-4 animate-fadein">
            Stay updated with the latest happenings in the crypto world.
          </p>
          <div className="mx-auto w-24 h-1 rounded bg-gradient-to-r from-blue-400 via-green-400 to-yellow-400 mb-8" />
        </div>

        <section className="bg-white/90 dark:bg-gray-800/80 rounded-xl shadow-xl p-6 md:p-10 max-w-4xl mx-auto animate-fadein">
          <CryptoNews />
        </section>
      </main>

      <Footer />
    </div>
  );
}
