"use client";
import { useEffect, useState } from "react";
import { fetchCryptoNews } from "@/lib/api";
import { Newspaper, Clock, Loader2, RefreshCw } from "lucide-react";
import Image from "next/image";

type NewsItem = {
  id: string | number;
  url: string;
  title: string;
  imageurl?: string;
  published_on: number; // Unix timestamp in seconds
};

export default function CryptoNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCryptoNews();
      setNews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network request failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  if (loading && news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4 min-h-[200px] bg-white dark:bg-gray-900 rounded-lg shadow-md">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 dark:text-blue-400" />
        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
          Loading crypto news...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-6 min-h-[200px] bg-red-50 dark:bg-red-900 rounded-lg shadow-md">
        <div className="text-red-600 dark:text-red-400 text-center max-w-md">
          <Newspaper className="w-12 h-12 mx-auto mb-3" />
          <p className="text-lg font-semibold">Couldn't load news feed</p>
          <p className="text-sm mt-2 text-red-500 dark:text-red-300">
            {error.toLowerCase().includes("timeout")
              ? "The request took too long"
              : "Please check your internet connection"}
          </p>
        </div>
        <button
          onClick={loadNews}
          className="inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-700 transition-colors"
          aria-label="Retry loading news"
        >
          <RefreshCw className="w-5 h-5" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
          <Newspaper className="w-6 h-6" />
          <h3 className="text-2xl font-semibold tracking-wide select-none">
            Latest Crypto News
          </h3>
        </div>
        <button
          onClick={loadNews}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          disabled={loading}
          aria-label="Refresh news"
          title="Refresh news"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </header>

      {news.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-shadow p-5 transform hover:scale-105"
              aria-label={`Read full article: ${item.title}`}
            >
              <div className="flex items-start gap-4">
                {item.imageurl ? (
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-inner">
                    <Image
                      src={item.imageurl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 flex-shrink-0 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Newspaper className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
                <div className="flex flex-col flex-grow">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-3 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>
                  <div className="mt-auto flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <time
                      dateTime={new Date(
                        item.published_on * 1000
                      ).toISOString()}
                    >
                      {new Date(item.published_on * 1000).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </time>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="text-center py-16 text-gray-500 dark:text-gray-400 font-medium select-none">
          No news articles found
        </p>
      )}
    </section>
  );
}
