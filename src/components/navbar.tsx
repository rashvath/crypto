"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Heart } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

export function NavBar({ wishlistCount }: { wishlistCount: number }) {
  const { isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-bold text-gray-900 dark:text-white hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors transform hover:scale-105"
          >
            Crypto Tracker
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/news"
              className="text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
            >
              News
            </Link>
            <Link
              href="/wishlist"
              className="text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
            >
              Wishlist
            </Link>
            <Link
              href="/currency-converter"
              className="text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
            >
              Currency Converter
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Wishlist Icon (mobile only) */}
          <Link href="/wishlist" className="md:hidden relative">
            <Heart
              className="w-5 h-5 text-gray-700 dark:text-gray-300"
              fill={wishlistCount > 0 ? "currentColor" : "none"}
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          <div className="text-gray-700 dark:text-gray-300 hidden md:block">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <Link
                href="/sign-in"
                className="px-4 py-2 bg-yellow-500 text-white text-sm font-semibold rounded-md shadow-md hover:bg-yellow-600 transition duration-300"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-4 pb-4 space-y-2 border-t dark:border-gray-700">
          <Link
            href="/news"
            className="block text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400"
          >
            News
          </Link>
          <Link
            href="/wishlist"
            className="block text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400"
          >
            Wishlist
          </Link>
          <Link
            href="/currency-converter"
            className="block text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400"
          >
            Currency Converter
          </Link>
          {!isSignedIn && (
            <Link
              href="/sign-in"
              className="inline-block px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
            >
              Sign In
            </Link>
          )}
          {isSignedIn && <UserButton afterSignOutUrl="/" />}
        </div>
      )}
    </nav>
  );
}
