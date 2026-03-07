"use client";

import { useEffect, useState, useCallback } from "react";
import { getUserWallet } from "../lib/wallet";

export const useWallet = () => {
  const [wallet, setWallet] = useState(null);

  const fetchWallet = useCallback(async () => {
    try {
      const data = await getUserWallet();

      setWallet(data);
    } catch (err) {
      console.error("Wallet error:", err);
    }
  }, []);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  return { wallet, refetch: fetchWallet };
};