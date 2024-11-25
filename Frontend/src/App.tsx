import React, { useState, useEffect } from "react";
import "./index.css";

const App: React.FC = () => {
  const [baseCurrency, setBaseCurrency] = useState<string>("USD");
  const [amount, setAmount] = useState<string>("");
  const [searchCurrency, setSearchCurrency] = useState<string>(""); 
  const [conversionResult, setConversionResult] = useState<number | null>(null);
  const [currencies, setCurrencies] = useState<{
    [key: string]: { name: string; code: string };
  }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredCurrencies, setFilteredCurrencies] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [conversionHistory, setConversionHistory] = useState<any[]>([]); 

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const API_KEY = "4E0VK7BnkdeUuh1vegAt808v2IUjzUR6lxcvBMT2";
        const API_URL = `https://api.freecurrencyapi.com/v1/currencies?apikey=${API_KEY}`;
        const response = await fetch(API_URL);
        const data = await response.json();

        if (response.ok) {
          setCurrencies(data.data); 
        } else {
          setError("Failed to fetch currencies.");
        }
      } catch (err) {
        setError("Something went wrong while fetching currencies.");
      }
    };

    fetchCurrencies();
  }, []);

  const convertCurrency = async () => {
    if (!amount || !searchCurrency) {
      setError("Please fill out all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_KEY = "4E0VK7BnkdeUuh1vegAt808v2IUjzUR6lxcvBMT2"; 
      const API_URL = `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}&base_currency=${baseCurrency}&currencies=${searchCurrency}`;

      const response = await fetch(API_URL);
      const data = await response.json();

      if (response.ok) {
        const rate = data.data[searchCurrency];
        if (rate) {
          const conversion = parseFloat(amount) * rate;
          setConversionResult(conversion);

          const newConversion = {
            baseCurrency,
            targetCurrency: searchCurrency,
            baseAmount: parseFloat(amount),
            convertedAmount: conversion,
            conversionDate: new Date().toLocaleString(),
          };

          await saveConversionToDatabase(newConversion);
        } else {
          setError("Currency not found in the response.");
        }
      } else {
        setError(data.message || "Failed to fetch conversion rate.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveConversionToDatabase = async (conversionData: {
    baseCurrency: string;
    targetCurrency: string;
    baseAmount: number;
    convertedAmount: number;
  }) => {
    try {
      const response = await fetch("https://smart-currency-converter-production.up.railway.app/api/saveConvert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(conversionData),
      });

      const result = await response.json();
      console.log(result);
      if (response.ok) {
        console.log("Conversion saved:", result);
      } else {
        console.error("Failed to save conversion:", result);
      }
    } catch (error) {
      console.error("Error saving conversion to database:", error);
    }
  };

  // get All Currency Conversion
  useEffect(() => {
    const fetchConversion = async () => {
      try {
        const response = await fetch("https://smart-currency-converter-production.up.railway.app//api/getConvert");
        const data = await response.json();
        console.log(data, "getConvert");
        setConversionHistory(data);
      } catch (error) {
        console.error("Error fetching conversion data:", error);
      }
    };

    fetchConversion();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    convertCurrency();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchCurrency(searchTerm);
    setShowDropdown(true);

    setFilteredCurrencies(
      Object.keys(currencies).filter((currencyCode) =>
        currencies[currencyCode]?.name.toLowerCase().includes(searchTerm)
      )
    );
  };

  const selectCurrency = (currencyCode: string) => {
    setSearchCurrency(currencyCode); 
    setShowDropdown(false); 
  };

  const getFlagUrl = (currencyCode: string) => {
    return `https://flagcdn.com/w320/${currencyCode
      .slice(0, 2)
      .toLowerCase()}.png`;
  };

  return (
    <div className="bg-custom-gradient h-screen flex items-start justify-between p-10">
      <div className="w-full flex items-center justify-center h-full">
        <p className="text-white text-9xl mb-8 text-left">
          How much are <br />
          <span className="font-bold">
            {amount || 0} {baseCurrency}
          </span>{" "}
          in
        </p>
      </div>

      <div className="absolute rounded-lg bottom-10 left-10 bg-gray-100">
        <p className="px-4 py-2 text-xl">
          <span className="text-black">Smart </span>
          <span>Currency</span> <br />
          <span className="text-red-600">Converter</span>
        </p>
      </div>

      <div className="w-full max-w-lg h-full shadow-lg rounded-lg overflow-hidden bg-white p-8 flex flex-col">
      {error && (
          <div className="bg-red-500 text-white p-4 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Base Currency
            </label>
            <select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.keys(currencies).map((currencyCode) => (
                <option key={currencyCode} value={currencyCode}>
                  {currencyCode} - {currencies[currencyCode]?.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <span className="absolute px-2 py-2 left-0 top-6 transform rounded-lg text-lg bg-gray-600 text-gray-100">
              $
            </span>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-2">
              Target Currency
            </label>
            <input
              type="text"
              value={searchCurrency}
              onChange={handleSearchChange}
              placeholder="Search for a currency"
              className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {showDropdown && filteredCurrencies.length > 0 && (
              <ul className="mt-2 absolute w-full bg-white shadow-lg rounded-lg max-h-60 overflow-y-auto z-10">
                {filteredCurrencies.map((currencyCode) => (
                  <li
                    key={currencyCode}
                    onClick={() => selectCurrency(currencyCode)}
                    className="px-4 py-2 flex items-center cursor-pointer hover:bg-gray-200"
                  >
                    <img
                      src={getFlagUrl(currencyCode)}
                      alt={`${currencyCode} flag`}
                      className="w-6 h-4 mr-3"
                    />
                    <span className="text-black">{currencies[currencyCode]?.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Convert"}
            </button>
          </div>
        </form>

        <div className="mt-8">
          {conversionResult !== null && (
            <p className="text-xl text-center text-gray-700">
              <span className="font-bold">{amount}</span> {baseCurrency} =
              <span className="font-bold text-green-600">
                {" "}
                {conversionResult.toFixed(2)} {searchCurrency}
              </span>
            </p>
          )}

          <div className="mt-6">
            <h2 className="text-xl font-semibold">Conversion History</h2>
            <ul className="space-y-4 mt-4">
              {conversionHistory.map((conversion, index) => (
                <li key={index} className="flex justify-between text-sm text-gray-700">
                  <span>
                    {conversion.baseAmount} {conversion.baseCurrency} ={" "}
                    {conversion.convertedAmount.toFixed(2)} {conversion.targetCurrency}
                  </span>
                  <span className="text-xs text-gray-500">{conversion.timestamp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
