"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import FormInput from "../../../../components/ui/formInput";
import { useRegister } from "../../../../hooks/useAuth";
import useToast from "../../../../hooks/useToast";

export default function RegisterPage() {
  const { register, loading, error, success, message } = useRegister();
  const toast = useToast();

  const successRef = useRef(false);

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
  });

  const [localErrors, setLocalErrors] = useState({});

  // capture input values
  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    // clear field error when user types
    setLocalErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    successRef.current = false;

    const errors = {};
    if (!form.fullname.trim()) errors.fullname = "Full name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    if (!form.phone.trim()) errors.phone = "Phone number is required";
    if (!form.password.trim()) errors.password = "Password is required";

    if (Object.keys(errors).length) {
      setLocalErrors(errors);
      return;
    }

    await register({
      fullname: form.fullname,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });
  };

  // SUCCESS HANDLER (runs once)
  useEffect(() => {
    if (!success || successRef.current) return;

    successRef.current = true;

    toast.success(message || "Account created successfully");

    // reset form
    setForm({
      fullname: "",
      email: "",
      phone: "",
      password: "",
    });

    // clear validation errors
    setLocalErrors({});
  }, [success, message, toast]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#041031] px-4 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full bg-primary-500/20 blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-105 w-105 rounded-full bg-secondary-500/20 blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
      >
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-secondary-400 to-primary-600 text-xl font-bold text-black shadow-lg shadow-primary-600/40">
            X
          </div>
          <h1 className="text-2xl font-semibold tracking-wide">
            Create account
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Join us and start your journey today
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            {/* API error only */}
            {error && (
              <p className="rounded-lg bg-red-500/10 px-3 text-center py-2 text-sm text-red-400 border border-red-500/20">
                {error}
              </p>
            )}

            <div>
              <FormInput
                label="Full Name"
                name="fullname"
                placeholder="Xenra User"
                value={form.fullname}
                onChange={handleChange}
              />
              {localErrors.fullname && (
                <p className="mt-1 px-1 text-xs text-red-400">
                  {localErrors.fullname}
                </p>
              )}
            </div>

            <div>
              <FormInput
              label="Email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
            {localErrors.email && (
                <p className="mt-1 px-1 text-xs text-red-400">
                  {localErrors.email}
                </p>
              )}
            </div>

            <div>
              <FormInput
              label="Phone Number"
              type="phone"
              name="phone"
              placeholder="Enter phone number"
              value={form.phone?.replace(/^\+\d{1,4}/, "")}
              onChange={handleChange}
            />
            {localErrors.phone && (
                <p className="mt-1 px-1 text-xs text-red-400">
                  {localErrors.phone}
                </p>
              )}
            </div>

          <div>
              <FormInput
                label="Password"
                name="password"
                placeholder="••••••••"
                showToggle
                value={form.password}
                onChange={handleChange}
              />
              {localErrors.password && (
                <p className="mt-1 px-1 text-xs text-red-400">
                  {localErrors.password}
                </p>
              )}
          </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="mt-2 w-full rounded-xl bg-linear-to-r from-cyan-500 to-indigo-600 py-3 font-semibold shadow-lg shadow-indigo-600/30 transition hover:shadow-indigo-500/50 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-cyan-400 hover:text-cyan-300"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
