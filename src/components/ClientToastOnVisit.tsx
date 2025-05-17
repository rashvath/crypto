"use client";

import { useEffect, useRef } from "react";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

export default function ClientToastOnVisit() {
  const { isSignedIn, isLoaded } = useAuth();
  const hasShown = useRef(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn && !hasShown.current) {
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white text-gray-900 rounded-xl shadow-xl border border-gray-200 p-5 md:p-6 transition-all duration-300 relative`}
          >
            {/* Close button */}
            <button
              onClick={() => toast.dismiss(t.id)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-semibold"
              aria-label="Close"
              type="button"
            >
              ×
            </button>

            {/* Message */}
            <div className="mb-4 text-base md:text-lg font-semibold text-center">
              🔐 Sign in to add your favorite coins to the wishlist!
            </div>

            {/* Sign In Button */}
            <div className="flex justify-center">
              <SignInButton>
                <button
                  className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-md transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  aria-label="Sign In"
                  type="button"
                >
                  Sign In
                </button>
              </SignInButton>
            </div>
          </div>
        ),
        { duration: 6000 }
      );
      hasShown.current = true;
    }
  }, [isLoaded, isSignedIn]);

  return null;
}
