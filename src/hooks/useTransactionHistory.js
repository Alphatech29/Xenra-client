import { useEffect, useState, useCallback } from "react";
import { getTransactionHistory } from "../lib/history";

export const useTransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    setError(null);

    try {
      const data = await getTransactionHistory();
      setTransactions(data || []);
    } catch (err) {
      setError(err.message || "Failed to load transaction history");
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    transactions,
    error,
    refetch: fetchHistory
  };
};