"use client";
import { useState, useEffect, useRef } from "react";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);

  const abortRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const safeSetState = (cb) => {
    if (mountedRef.current) cb();
  };

  const login = async (payload) => {
    if (!API_URL) {
      safeSetState(() => {
        setError("Backend API URL not configured");
      });
      return null;
    }

    safeSetState(() => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setMessage(null);
      setUser(null);
    });

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const result = await res.json();

      // 🚨 Handle HTTP-level failure
      if (!res.ok) {
        safeSetState(() => {
          setError(
            result?.error?.detail ||
              result?.message ||
              "Login failed"
          );
          setSuccess(false);
        });
        return result;
      }

      // Strictly rely on backend success flag
      if (!result.success) {
        safeSetState(() => {
          setError(
            result?.error?.detail ||
              result?.message ||
              "Login failed"
          );
          setSuccess(false);
        });
        return result;
      }

      // Extract user from new structure
      const backendUser = result?.data?.user || null;

      const normalizedUser = backendUser
        ? {
            ...backendUser,
            is_email_verified: Boolean(
              backendUser.is_email_verified
            ),
          }
        : null;

      safeSetState(() => {
        setSuccess(true);
        setMessage(result.message || "Login successful");
        setUser(normalizedUser);
      });

      return result;

    } catch (err) {
      if (err.name !== "AbortError") {
        safeSetState(() => {
          setError(err.message || "Network error");
          setSuccess(false);
        });
      }
      return null;
    } finally {
      safeSetState(() => setLoading(false));
    }
  };

  return { login, loading, success, error, message, user };
}


export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState(null);
  const [data, setData] = useState(null);

  const register = async (payload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);
    setData(null);

    if (!API_URL) {
      setError("Backend URL not configured");
      setLoading(false);
      return null;
    }

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/create-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      });

      let result = null;
      const text = await res.text();

      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        setError(
          result?.message || result?.error || `Request failed (${res.status})`
        );
        return null;
      }

      if (result?.success === false) {
        setError(result?.message || result?.error || "Registration failed");
        return null;
      }

      setSuccess(true);
      setMessage(result?.message || "Registration successful");
      setData(result?.data || null);

      return result;
    } catch (err) {
      setError(err.message || "Network error. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, success, error, message, data };
}


export function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState(null);

  const abortRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const safeSetState = (cb) => {
    if (mountedRef.current) cb();
  };

  const logout = async () => {
    if (!API_URL) {
      safeSetState(() => setError("Backend API URL not configured"));
      return null;
    }

    safeSetState(() => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setMessage(null);
    });

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      const result = await res.json();

      if (!res.ok || result?.success === false) {
        safeSetState(() => {
          setError(result?.message || "Logout failed");
        });
        return result;
      }

      // clear client storage
      sessionStorage.clear();
      localStorage.clear();

      safeSetState(() => {
        setSuccess(true);
        setMessage(result?.message || "Logged out successfully");
      });

      return result;

    } catch (err) {
      if (err.name !== "AbortError") {
        safeSetState(() => {
          setError(err.message || "Network error");
        });
      }
      return null;
    } finally {
      safeSetState(() => setLoading(false));
    }
  };

  return { logout, loading, success, error, message };
}