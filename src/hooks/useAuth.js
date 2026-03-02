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

  const safeSetState = (fn) => {
    if (mountedRef.current) fn();
  };

  const login = async (payload) => {
    if (!API_URL) {
      safeSetState(() => setError("Server configuration error"));
      return null;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);
    setUser(null);

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

      /* -------- LOG RESPONSE META -------- */
      const headers = {};
      res.headers.forEach((v, k) => (headers[k] = v));

      /* -------- RAW BODY -------- */
      const raw = await res.text();

      /* -------- PARSED BODY -------- */
      let result = {};
      try {
        result = raw ? JSON.parse(raw) : {};
      } catch (e) {
      }

      if (!res.ok) {
        const backendMsg =
          result?.error ||
          result?.message ||
          result?.detail ||
          result?.msg ||
          "Login failed";
        throw new Error(backendMsg);
      }

      /* ---------- SUCCESS ---------- */

      const successMsg = result?.message || "Login successful";

      safeSetState(() => {
        setSuccess(true);
        setMessage(successMsg);
        setUser(result?.user || null);
      });

      setTimeout(() => {
        window.location.reload();
      }, 150);

      return { success: true, user: result?.user || null };

    } catch (err) {

      let msg = "Network error. Try again.";
      if (err.name === "AbortError") msg = "Request cancelled.";
      else if (typeof err.message === "string") msg = err.message;

      safeSetState(() => setError(msg));
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

      // 👇 safely parse JSON
      let result = null;
      const text = await res.text();

      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        setError(result?.message || result?.error || `Request failed (${res.status})`);
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
      console.error("Register error:", err);
      setError(err.message || "Network error. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, success, error, message, data };
}