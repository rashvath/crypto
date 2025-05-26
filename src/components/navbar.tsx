"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Heart, Bitcoin } from "lucide-react";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";

// Nav link definition for DRY rendering
const navLinks = [
  { href: "/news", label: "News" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/currency-converter", label: "Currency Converter" },
];

export function NavBar({ wishlistCount }: { wishlistCount: number }) {
  const { isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [pulse, setPulse] = useState(false);

  // Pulse animation when wishlistCount increases
  useEffect(() => {
    if (wishlistCount > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 500);
      return () => clearTimeout(timer);
    }
  }, [wishlistCount]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <nav className="sticky top-0 z-30 border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 shadow-sm backdrop-blur-md transition-all">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between relative">
        <div className="flex items-center gap-4">
          {/* Logo & Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-gray-900 dark:text-white hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
            aria-label="Home"
          >
            <Bitcoin className="w-6 h-6 text-yellow-400" />
            <span>Crypto Tracker</span>
          </Link>
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 ml-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-1 py-1 text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors
                  ${
                    pathname === link.href
                      ? "font-bold text-yellow-600 dark:text-yellow-400 underline underline-offset-4"
                      : ""
                  }`}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
                {/* Wishlist badge */}
                {link.href === "/wishlist" && wishlistCount > 0 && (
                  <span
                    className={`absolute -top-2 -right-4 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg transition-all
                    ${pulse ? "animate-pulse" : ""}`}
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Wishlist Icon (mobile only) */}
          <Link
            href="/wishlist"
            className="md:hidden relative focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
            aria-label="View Wishlist"
          >
            <Heart
              className={`w-6 h-6 ${
                wishlistCount > 0
                  ? "text-red-500"
                  : "text-gray-700 dark:text-gray-300"
              } transition-colors`}
              fill={wishlistCount > 0 ? "currentColor" : "none"}
            />
            {wishlistCount > 0 && (
              <span
                className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg transition-all
                ${pulse ? "animate-pulse" : ""}`}
              >
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
                className="px-4 py-2 bg-yellow-500 text-white text-sm font-semibold rounded-md shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              >
                Sign In
              </Link>
            )}
          </div>
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded transition"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>
      {/* Animated Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out bg-white dark:bg-gray-900 border-t dark:border-gray-700 shadow-lg
          ${isOpen ? "max-h-64 py-4 px-4" : "max-h-0 py-0 px-4"}
        `}
        aria-hidden={!isOpen}
      >
        <div className="space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-2 py-2 rounded text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors
                ${
                  pathname === link.href
                    ? "font-bold text-yellow-600 dark:text-yellow-400 underline underline-offset-4"
                    : ""
                }`}
              aria-current={pathname === link.href ? "page" : undefined}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
              {link.href === "/wishlist" && wishlistCount > 0 && (
                <span
                  className={`ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 inline-flex items-center justify-center shadow-lg transition-all
                  ${pulse ? "animate-pulse" : ""}`}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>
          ))}
          {!isSignedIn && (
            <Link
              href="/sign-in"
              className="inline-block px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
          )}
          {isSignedIn && (
            <div className="py-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
