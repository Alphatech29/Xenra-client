"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FormInput from "../../../../components/ui/formInput";
import { useLogin } from "../../../../hooks/useAuth";
import useToast from "../../../../hooks/useToast";

export default function LoginPage() {
  const toast = useToast();
  const { login, loading, error, success, message } = useLogin();
  const firedRef = useRef(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [localErrors, setLocalErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  /* ---------------- VALIDATION ---------------- */

  const validateForm = () => {
    const errors = {};

    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      errors.email = "Enter a valid email address";

    if (!form.password) errors.password = "Password is required";

    return errors;
  };

  /* ---------------- CHANGE ---------------- */

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    setLocalErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError(null);
    firedRef.current = false;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const errors = validateForm();
    setLocalErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setServerError(null);
    firedRef.current = false;

    await login({
      email: form.email.trim(),
      password: form.password,
      remember: form.remember,
    });
  };

  /* ---------------- SERVER FEEDBACK ---------------- */

  useEffect(() => {
    if (loading) return;
    if (firedRef.current) return;

    if (error) {
      firedRef.current = true;
      setServerError(error);
      return;
    }

    if (success) {
      firedRef.current = true;
      toast.success(message || "Login successful");
    }
  }, [loading, success, error, message, toast]);

  /* ---------------- UI ---------------- */

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#041031] px-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
      >
        {/* HEADER */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-secondary-400 to-primary-600 text-xl font-bold text-black shadow-lg shadow-primary-600/40">
            X
          </div>
          <h1 className="text-2xl font-semibold tracking-wide">Welcome back</h1>
          <p className="mt-1 text-sm text-white/60">
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {serverError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400 text-center">
              {serverError}
            </div>
          )}

          {/* EMAIL */}
          <FormInput
            label="Email Address"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {localErrors.email && (
            <p className="mt-1 px-1 text-xs text-red-400">{localErrors.email}</p>
          )}

          {/* PASSWORD */}
          <FormInput
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            showToggle
          />
          {localErrors.password && (
            <p className="mt-1 px-1 text-xs text-red-400">{localErrors.password}</p>
          )}

          {/* REMEMBER + FORGOT */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) => handleChange("remember", e.target.checked)}
                className="h-4 w-4 rounded border-white/30 bg-transparent accent-cyan-500"
              />
              <span className="text-white/70">Remember me</span>
            </label>

            <Link
              href="/auth/forgot-password"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* BUTTON */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className={`w-full rounded-xl py-3 font-semibold shadow-lg transition
              ${
                loading
                  ? "bg-secondary-600 cursor-not-allowed"
                  : "bg-linear-to-r from-cyan-500 to-indigo-600 hover:shadow-indigo-500/50"
              }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

        {/* REGISTER */}
        <p className="mt-8 text-center text-sm text-white/60">
          Don’t have an account?{" "}
          <Link href="/auth/register" className="text-cyan-400 hover:text-cyan-300">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}