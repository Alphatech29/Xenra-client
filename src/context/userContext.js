"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {getUser} from "../hooks/userModule";

const UserContext = createContext(null);

export function UserProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(!initialUser);

  // auto restore session on refresh
  useEffect(() => {
    if (user !== null) return;

    const loadUser = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data?.user || null);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/me", {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      setUser(data?.user || null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        refreshUser,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be inside UserProvider");
  return ctx;
}