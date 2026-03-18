"use client";

import { useState, useRef, useEffect } from "react";
import useToast from "./useToast";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export default function useResetPassword() {
  const toast = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const abortRef = useRef(null);

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const validate = () => {
    if (!token) return "Invalid or missing reset token";

    if (!password.trim()) return "Password is required";

    if (password.length < 6)
      return "Password must be at least 6 characters";

    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;

    if (!strongPassword.test(password)) {
      return "Password must contain uppercase, lowercase, number and special character";
    }

    if (!confirmPassword.trim())
      return "Confirm password is required";

    if (password !== confirmPassword)
      return "Passwords do not match";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const err = validate();

    if (err) {
      setError(err);
      toast.error(err);
      return;
    }

    setError("");
    setLoading(true);

    if (!API_URL) {
      const msg = "Backend API URL not configured";
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }

    if (abortRef.current) abortRef.current.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          token,
          password: password.trim(),
        }),
        signal: controller.signal,
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok || result?.success === false) {
        const message = result?.message || "Password reset failed";
        setError(message);
        toast.error(message);
        return;
      }

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");

      toast.success(result?.message || "Password reset successfully");

    } catch (err) {
      if (err.name !== "AbortError") {
        const msg = err.message || "Network error";
        setError(msg);
        toast.error("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  return {
    token,
    setToken,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    success,
    error,
    handleSubmit,
  };
}