"use client";

import { useState, useRef, useEffect } from "react";
import useToast from "./useToast";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export default function useForgotPassword() {
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const abortRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCooldown = () => {
    setCooldown(60);

    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const validate = () => {
    if (!email.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email address";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || cooldown > 0) return;

    const err = validate();

    if (err) {
      setError(err);
      return;
    }

    setError("");
    setLoading(true);

    if (!API_URL) {
      setError("Backend API URL not configured");
      setLoading(false);
      return;
    }

    if (abortRef.current) abortRef.current.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok || result?.success === false) {
        const message = result?.message || "Unable to send reset link";
        setError(message);
        toast.error(message);
        return;
      }

      setSent(true);
      startCooldown();

      toast.success(
        result?.message || "Password reset link sent to your email"
      );
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Network error");
        toast.error("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  return {
    email,
    setEmail,
    loading,
    sent,
    error,
    cooldown,
    handleSubmit,
  };
}