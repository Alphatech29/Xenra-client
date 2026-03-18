"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FormInput from "../../../../components/ui/formInput";
import { useLogin } from "../../../../hooks/useAuth";
import useToast from "../../../../hooks/useToast";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();

  const { login, loading } = useLogin();

  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [localErrors, setLocalErrors] = useState({});

  const isLoading = loading || submitting;

  /* ---------------- LOAD REMEMBERED DATA ---------------- */

  useEffect(() => {
    const saved = localStorage.getItem("rememberMe");

    if (saved) {
      try {
        const data = JSON.parse(saved);

        setForm({
          email: data.email || "",
          password: data.password || "",
          remember: true,
        });
      } catch (err) {
        console.error("Invalid stored data");
        localStorage.removeItem("rememberMe");
      }
    }
  }, []);

  /* ---------------- VALIDATION ---------------- */

  const validateForm = () => {
    const errors = {};

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errors.email = "Enter a valid email address";
    }

    if (!form.password) {
      errors.password = "Password is required";
    }

    return errors;
  };

  /* ---------------- CHANGE ---------------- */

  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setLocalErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    const errors = validateForm();
    setLocalErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      setSubmitting(true);

      const result = await login({
        email: form.email.trim(),
        password: form.password,
        remember: form.remember,
      });

      if (result?.success) {
        toast.success(result.message || "Login successful");

        // 🔥 SAVE REMEMBER ME DATA
        if (form.remember) {
          localStorage.setItem(
            "rememberMe",
            JSON.stringify({
              email: form.email,
              password: form.password,
            })
          );
        } else {
          localStorage.removeItem("rememberMe");
        }

        router.replace("/dashboard");
      } else {
        toast.error(result?.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#041031] px-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
      >
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-400 to-indigo-600 text-xl font-bold text-black shadow-lg">
            X
          </div>

          <h1 className="text-2xl font-semibold tracking-wide">
            Welcome back
          </h1>

          <p className="mt-1 text-sm text-white/60">
            Sign in to continue to your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <FormInput
              label="Email Address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

            {localErrors.email && (
              <p className="mt-1 text-xs text-red-400">
                {localErrors.email}
              </p>
            )}
          </div>

          <div>
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
              <p className="mt-1 text-xs text-red-400">
                {localErrors.password}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) =>
                  handleChange("remember", e.target.checked)
                }
                className="h-4 w-4 accent-cyan-500"
              />
              <span className="text-white/70">Remember me</span>
            </label>

            <Link
              href="/auth/forgot-password"
              className="text-cyan-400 hover:text-cyan-300"
            >
              Forgot password?
            </Link>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileTap={{ scale: 0.97 }}
            className={`w-full rounded-xl py-3 font-semibold transition flex items-center justify-center gap-2 ${
              isLoading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-linear-to-r from-cyan-500 to-indigo-600"
            }`}
          >
            {isLoading && (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}

            {isLoading ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-white/60">
          Don’t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-cyan-400 hover:text-cyan-300"
          >
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}