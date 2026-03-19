"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

import FormInput from "../../../../components/ui/formInput";
import useResetPassword from "../../../../hooks/useResetPassword";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get("token");

  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    setToken,
    loading,
    success,
    error,
    handleSubmit,
  } = useResetPassword();

  useEffect(() => {
    if (token) {
      setToken(token);
    }
  }, [token, setToken]);

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
            🔑
          </div>

          <h1 className="text-2xl font-semibold tracking-wide">
            Reset Password
          </h1>

          <p className="mt-1 text-sm text-white/60 text-center">
            Enter your new password below
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-5">
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-4 text-sm text-green-400">
              Your password has been reset successfully
            </div>

            <Link
              href="/auth/login"
              className="inline-block text-cyan-400 hover:text-cyan-300 text-sm"
            >
              Continue to login
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
              label="New Password"
              type="password"
              name="password"
              value={password}
              onChange={(name, value) => setPassword(value)}
              placeholder="Enter new password"
            />

            <FormInput
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(name, value) => setConfirmPassword(value)}
              placeholder="Confirm new password"
            />

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className={`w-full rounded-xl py-3 font-semibold shadow-lg transition
                ${
                  loading
                    ? "bg-secondary-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500 to-indigo-600 hover:shadow-indigo-500/50"
                }`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </motion.button>

            <p className="text-center text-sm text-white/60">
              Back to{" "}
              <Link
                href="/auth/login"
                className="text-cyan-400 hover:text-cyan-300"
              >
                Sign in
              </Link>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
}
