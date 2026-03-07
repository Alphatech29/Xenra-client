import { useEffect, useState } from "react";
import { getUserDedicatedAccount } from "../lib/wallet";

export const useDedicatedAccount = () => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);

  const fetchDedicatedAccount = async () => {
    try {
      setError(null);

      const data = await getUserDedicatedAccount();
      setAccount(data || null);

    } catch (err) {
      setError(err?.message || "Failed to load dedicated account");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadAccount = async () => {
      try {
        setError(null);
        const data = await getUserDedicatedAccount();

        if (isMounted) {
          setAccount(data || null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to load dedicated account");
        }
      }
    };

    loadAccount();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    account,
    error,
    refetch: fetchDedicatedAccount,
  };
};