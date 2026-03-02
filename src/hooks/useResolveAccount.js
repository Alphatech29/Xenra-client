import { useState, useCallback, useRef, useEffect } from "react";
import { resolveAccount } from "../lib/verifyAccount";

export const useResolveAccount = () => {
  const mountedRef = useRef(true);
  const requestIdRef = useRef(0);
  const retryTimeoutRef = useRef(null);

  const [accountName, setAccountName] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const resolve = useCallback(async (account_number, bank_code) => {
    if (!account_number || !bank_code) return;

    const currentRequest = ++requestIdRef.current;

    try {
      setLoading(true);
      setError(null);

      const response = await resolveAccount(account_number, bank_code);

      if (!mountedRef.current || currentRequest !== requestIdRef.current) return;

      setAccountName(response.account_name || null);
      setAccountData(response || null);
      setError(null);

    } catch (err) {
      if (!mountedRef.current || currentRequest !== requestIdRef.current) return;

      setAccountName(null);
      setAccountData(null);

      /* smarter error handling */
      if (err?.status === 400 || err?.status === 404) {
        setError("Account number does not match selected bank");
      }

      else if (err?.status === 401) {
        setError("Verification service unavailable");
      }

      else if (err?.status === 503) {
        setError("Bank network slow, retrying...");

        // auto retry once after delay
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current) resolve(account_number, bank_code);
        }, 1500);
      }

      else {
        setError("Unable to verify account. Please try again");
      }

    } finally {
      if (mountedRef.current && currentRequest === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const reset = useCallback(() => {
    clearTimeout(retryTimeoutRef.current);
    setAccountName(null);
    setAccountData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimeout(retryTimeoutRef.current);
    };
  }, []);

  return {
    accountName,
    accountData,
    loading,
    error,
    resolve,
    reset,
  };
};