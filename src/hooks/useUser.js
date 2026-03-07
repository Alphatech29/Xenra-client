"use client";

import { useState, useEffect, useCallback } from "react";
import { getUser } from "../lib/getUser";

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getUser();
      setUser(data);
    } catch (err) {
      setError(err.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refetchUser: fetchUser,
  };
};