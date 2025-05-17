// src/app/currency-converter/page.tsx
import CurrencyConverter from "@/components/CurrencyConverter";

export default function CurrencyConverterPage() {
  // These values should come from your crypto data
  const cryptoPrice = 50000; // Example: Price of 1 BTC in USD
  const cryptoName = "BTC"; // Crypto symbol

  return (
    <div className="container mx-auto py-8">
      <CurrencyConverter cryptoPrice={cryptoPrice} cryptoName={cryptoName} />
    </div>
  );
}
