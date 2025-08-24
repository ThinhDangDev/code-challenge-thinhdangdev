import { useState, useEffect } from "react";
import axios from "axios";
import type { Token } from "@/types/token";

const PRICES_API_URL = "https://interview.switcheo.com/prices.json";

export const useTokenPrices = () => {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get<Token[]>(PRICES_API_URL);
        const priceMap: Record<string, number> = {};

        response.data.forEach((token) => {
          if (
            !priceMap[token.currency.toLowerCase()] ||
            priceMap[token.currency.toLowerCase()] < token.price
          ) {
            priceMap[token.currency.toLowerCase()] = token.price;
          }
        });

        setPrices(priceMap);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch token prices");
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  return { prices, loading, error };
};
