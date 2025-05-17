// src/components/Loader.tsx
"use client";

export default function Loader() {
  return (
    <div className="flex justify-center items-center p-4">
      <div
        className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"
        aria-label="Loading"
        role="status"
      />
    </div>
  );
}
