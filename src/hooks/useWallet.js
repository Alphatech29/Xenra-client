"use client";

import { useEffect, useState, useCallback } from "react";
import { getUserWallet } from "../lib/wallet";

export const useWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWallet = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUserWallet();
      setWallet(data || null);
    } catch (err) {
      console.error("Wallet error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadWallet = async () => {
      setLoading(true);
      try {
        const data = await getUserWallet();

        if (isMounted) {
          setWallet(data || null);
        }
      } catch (err) {
        console.error("Wallet error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadWallet();

    return () => {
      isMounted = false;
    };
  }, []);

  return { wallet, loading, refetch: fetchWallet };
};