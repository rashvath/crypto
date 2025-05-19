"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Heart } from "lucide-react";

export function NavBar({ wishlistCount }: { wishlistCount: number }) {
  const { isSignedIn } = useUser();

  return (
    <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-bold text-gray-900 dark:text-white hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors transform hover:scale-105"
          >
            Crypto Tracker
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/news"
              className="text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors transform hover:scale-105"
            >
              News
            </Link>
            <Link
              href="/wishlist"
              className="text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors transform hover:scale-105"
            >
              Wishlist
            </Link>
            {/* Currency Converter link styled like other nav links */}
            <Link
              href="/currency-converter"
              className="text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors transform hover:scale-105"
            >
              Currency Converter
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/wishlist"
            className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors transform hover:scale-110 md:hidden"
          >
            <span className="relative">
              <Heart
                className="w-5 h-5 transition-transform duration-300"
                fill={wishlistCount > 0 ? "currentColor" : "none"}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                  {wishlistCount}
                </span>
              )}
            </span>
          </Link>

          <div className="text-gray-700 dark:text-gray-300">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <Link
                href="/sign-in"
                className="
                  inline-block
                  px-4 py-2
                  bg-yellow-500
                  text-white
                  text-sm font-semibold
                  rounded-md
                  shadow-md
                  hover:bg-yellow-600
                  focus:outline-none
                  focus:ring-2 focus:ring-yellow-400
                  transition
                  duration-300
                  select-none
                  transform hover:scale-105
                "
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
