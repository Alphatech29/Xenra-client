"use client";

import { useEffect, useState, useCallback } from "react";
import { getUserWallet } from "../lib/wallet";

export const useWallet = () => {
  const [wallet, setWallet] = useState(null);

  const fetchWallet = useCallback(async () => {
    try {
      const data = await getUserWallet();
      setWallet(data || null);
    } catch (err) {
      console.error("Wallet error:", err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadWallet = async () => {
      try {
        const data = await getUserWallet();

        if (isMounted) {
          setWallet(data || null);
        }
      } catch (err) {
        console.error("Wallet error:", err);
      }
    };

    loadWallet();

    return () => {
      isMounted = false;
    };
  }, []);

  return { wallet, refetch: fetchWallet };
};