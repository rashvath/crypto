"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";

interface CurrencyConverterProps {
  cryptoPrice: number; // Price of 1 crypto unit in USD
  cryptoName: string; // Crypto symbol (e.g., "BTC")
}

export default function CurrencyConverter({
  cryptoPrice,
  cryptoName,
}: CurrencyConverterProps) {
  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("INR");
  const [exchangeRate, setExchangeRate] = useState<number>(79.33);
  const [convertedAmount, setConvertedAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>([]);
  const [precision, setPrecision] = useState<number>(6);

  const amountInputRef = useRef<HTMLInputElement>(null);

  // Fetch available currencies dynamically
  useEffect(() => {
    fetch(`https://api.exchangerate-api.com/v4/latest/USD`)
      .then((res) => res.json())
      .then((data) => {
        const currencies = Object.keys(data.rates);
        // Always include cryptoName manually in case it's not listed
        if (!currencies.includes(cryptoName)) {
          currencies.push(cryptoName);
        }
        setAvailableCurrencies(currencies.sort());
      })
      .catch(() => {
        // fallback static list
        setAvailableCurrencies([
          "USD",
          "INR",
          "EUR",
          "GBP",
          "JPY",
          "AUD",
          cryptoName,
        ]);
      });
  }, [cryptoName]);

  // Fetch exchange rate whenever fromCurrency or toCurrency changes
  useEffect(() => {
    if (fromCurrency === toCurrency) {
      setExchangeRate(1);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);

    fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
      .then((res) => res.json())
      .then((data) => {
        const rate = data.rates[toCurrency];
        if (rate) {
          setExchangeRate(rate);
        } else {
          setExchangeRate(79.33); // fallback
          setError(
            `Exchange rate not found for ${fromCurrency} → ${toCurrency}`
          );
        }
      })
      .catch((err) => {
        console.error("Error fetching rates:", err);
        setError("Failed to fetch exchange rates.");
        // Fallback
        if (fromCurrency === "USD" && toCurrency === "INR")
          setExchangeRate(79.33);
        else setExchangeRate(1);
      })
      .finally(() => setLoading(false));
  }, [fromCurrency, toCurrency]);

  // Calculate converted amount
  useEffect(() => {
    const value = parseFloat(amount);
    if (isNaN(value) || value < 0) {
      setConvertedAmount("");
      return;
    }

    let result = 0;

    if (fromCurrency === toCurrency) {
      result = value;
    } else if (fromCurrency === cryptoName && toCurrency === "USD") {
      result = value * cryptoPrice;
    } else if (fromCurrency === cryptoName && toCurrency === "INR") {
      result = value * cryptoPrice * exchangeRate;
    } else if (fromCurrency === "USD" && toCurrency === cryptoName) {
      result = value / cryptoPrice;
    } else if (fromCurrency === "INR" && toCurrency === cryptoName) {
      result = value / (exchangeRate * cryptoPrice);
    } else if (fromCurrency === "USD" && toCurrency === "INR") {
      result = value * exchangeRate;
    } else if (fromCurrency === "INR" && toCurrency === "USD") {
      result = value / exchangeRate;
    } else {
      // fallback
      result = value * exchangeRate;
    }

    setConvertedAmount(result.toFixed(precision));
  }, [
    amount,
    exchangeRate,
    fromCurrency,
    toCurrency,
    cryptoPrice,
    cryptoName,
    precision,
  ]);

  // Swap currencies function
  const swapCurrencies = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }, [fromCurrency, toCurrency]);

  // Clear input amount
  const clearAmount = () => setAmount("");

  // Reset all inputs to default
  const resetAll = () => {
    setAmount("1");
    setFromCurrency("USD");
    setToCurrency("INR");
    setPrecision(6);
    setError(null);
  };

  // Copy converted amount to clipboard
  const copyToClipboard = () => {
    if (convertedAmount) {
      navigator.clipboard.writeText(convertedAmount);
      alert("Copied converted amount to clipboard!");
    }
  };

  // Auto-focus input on mount
  useEffect(() => {
    amountInputRef.current?.focus();
  }, []);

  // Keyboard support for swapping on Enter key press when input is focused
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Enter" &&
        document.activeElement === amountInputRef.current
      ) {
        swapCurrencies();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [swapCurrencies]);

  const isAmountValid = !isNaN(parseFloat(amount)) && parseFloat(amount) >= 0;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700">
        Currency Converter
      </h2>

      <div className="mb-4">
        <label className="block text-indigo-600 mb-2 font-medium">
          Enter Amount
        </label>
        <div className="flex items-center">
          <input
            ref={amountInputRef}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 text-gray-900
              ${!isAmountValid ? "border-red-500" : "border-indigo-300"}
            `}
            placeholder="0.00"
            min="0"
            inputMode="decimal"
            pattern="[0-9]*"
          />
          <button
            type="button"
            onClick={clearAmount}
            className="ml-2 text-indigo-600 hover:underline font-semibold"
            title="Clear input"
          >
            Clear
          </button>
        </div>
        {!isAmountValid && (
          <p className="text-red-500 text-sm mt-1">
            Please enter a valid positive number
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-indigo-600 mb-2 font-medium">From</label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full p-3 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 text-gray-900"
          >
            {availableCurrencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-indigo-600 mb-2 font-medium">To</label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full p-3 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 text-gray-900"
          >
            {availableCurrencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-indigo-600 mb-2 font-medium">
          Precision (decimal places)
        </label>
        <select
          value={precision}
          onChange={(e) => setPrecision(Number(e.target.value))}
          className="w-full p-3 border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
        >
          {[2, 4, 6, 8].map((p) => (
            <option key={p} value={p}>
              {p} decimals
            </option>
          ))}
        </select>
      </div>

      <div className="p-4 bg-indigo-50 rounded-md mb-6">
        {loading ? (
          <p className="text-center text-indigo-700 font-semibold flex justify-center items-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-indigo-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            Loading exchange rate...
          </p>
        ) : (
          <p className="text-center text-indigo-700 font-semibold">
            1 {fromCurrency.toUpperCase()} = {exchangeRate.toFixed(6)}{" "}
            {toCurrency.toUpperCase()}
          </p>
        )}
        {error && (
          <p className="text-red-600 text-center mt-2 font-medium">{error}</p>
        )}
      </div>

      <div className="p-4 bg-indigo-100 rounded-md mb-6 flex items-center justify-between">
        <p className="text-indigo-900 font-semibold">
          {amount || "0"} {fromCurrency.toUpperCase()} ={" "}
          {convertedAmount || "0"} {toCurrency.toUpperCase()}
        </p>
        <button
          type="button"
          onClick={copyToClipboard}
          className="text-indigo-600 hover:underline font-semibold"
          title="Copy converted amount"
        >
          Copy
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={swapCurrencies}
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          Swap Currencies
        </button>

        <button
          onClick={resetAll}
          className="w-full py-3 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition"
        >
          Reset All
        </button>
      </div>
    </div>
  );
}
