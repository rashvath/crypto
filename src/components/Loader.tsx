"use client";

import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center p-6 gap-3">
      {/* Spinner icon */}
      <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />

      {/* Animated bouncing dots */}
      <div className="flex space-x-1">
        <span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></span>
      </div>

      {/* Optional text */}
      <span className="text-sm text-gray-600 dark:text-gray-300">
        Loading...
      </span>
    </div>
  );
}
