import { useEffect, useState, useCallback, useRef } from "react";
import { fetchBanks } from "../lib/getbanks";

/* convert backend response into UI friendly structure */
const normalizeBanks = (response) => {
  const list = Array.isArray(response)
    ? response
    : response?.data || [];

  return list
    .map((b) => ({
      name: b.name || b.bankName || "Unknown Bank",
      code: String(b.code || b.bankCode || ""),
    }))
    .filter((b) => b.code)
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    ); // alphabetical A → Z
};

export const useBanks = () => {
  const mountedRef = useRef(true);
  const fetchedRef = useRef(false);

  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBanks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchBanks();
      const normalized = normalizeBanks(response);

      if (mountedRef.current) setBanks(normalized);
    } catch (err) {
      if (mountedRef.current)
        setError(err?.message || "Failed to load banks");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    if (!fetchedRef.current) {
      fetchedRef.current = true;
      loadBanks();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [loadBanks]);

  return { banks, loading, error, refetch: loadBanks };
};