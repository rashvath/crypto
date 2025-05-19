// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-6 mt-16">
      <div className="container mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} Crypto Tracker — Built with 💛 using
        Next.js & Tailwind CSS.
      </div>
    </footer>
  );
}
