"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FormInput from "../../../../components/ui/formInput";
import useToast from "../../../../hooks/useToast";

export default function ForgotPasswordPage() {
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!email.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email address";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const err = validate();
    if (err) return setError(err);

    setError("");
    setLoading(true);

    try {
      // TODO: replace with real API call
      await new Promise((res) => setTimeout(res, 1200));

      setSent(true);
      toast.success("Password reset link sent to your email");
    } catch (e) {
      setError("Unable to send reset link. Try again.");
    } finally {
      setLoading(false);
    }
  };

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
            🔒
          </div>
          <h1 className="text-2xl font-semibold tracking-wide">Forgot password</h1>
          <p className="mt-1 text-sm text-white/60 text-center">
            Enter your email and we’ll send you a reset link
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-5">
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-4 text-sm text-green-400">
              A password reset link has been sent to <span className="font-semibold">{email}</span>
            </div>

            <Link
              href="/auth/login"
              className="inline-block text-cyan-400 hover:text-cyan-300 text-sm"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400 text-center">
                {error}
              </div>
            )}

            <FormInput
              label="Email Address"
              type="email"
              name="email"
              value={email}
              onChange={(name, value) => setEmail(value)}
              placeholder="you@example.com"
            />

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
              {loading ? "Sending link..." : "Send reset link"}
            </motion.button>

            <p className="text-center text-sm text-white/60">
              Remember your password? {" "}
              <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
}
