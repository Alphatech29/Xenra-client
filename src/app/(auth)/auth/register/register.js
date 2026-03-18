"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import FormInput from "../../../../components/ui/formInput";
import { useRegister } from "../../../../hooks/useAuth";
import useToast from "../../../../hooks/useToast";

/* Password strength checker */
function getPasswordStrength(password) {
  let score = 0;

  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { label: "Weak", color: "bg-red-500", width: "33%" };
  if (score === 3 || score === 4)
    return { label: "Medium", color: "bg-yellow-500", width: "66%" };

  return { label: "Strong", color: "bg-green-500", width: "100%" };
}

export default function RegisterPage() {
  const { register, loading, error, success, message } = useRegister();
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const successRef = useRef(false);

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    referral: "",
  });

  const [localErrors, setLocalErrors] = useState({});

  const passwordStrength = getPasswordStrength(form.password);

  /* Capture referral from URL or localStorage */
  useEffect(() => {
    const refFromUrl =
      searchParams.get("ref") ||
      searchParams.get("referral") ||
      searchParams.get("invite");

    if (refFromUrl) {
      setForm((prev) => ({
        ...prev,
        referral: refFromUrl,
      }));

      localStorage.setItem("referral_code", refFromUrl);
    } else {
      const storedRef = localStorage.getItem("referral_code");

      if (storedRef) {
        setForm((prev) => ({
          ...prev,
          referral: storedRef,
        }));
      }
    }
  }, [searchParams]);

  /* Handle input change */
  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "referral") {
      localStorage.setItem("referral_code", value);
    }

    setLocalErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    successRef.current = false;

    const errors = {};

    if (!form.fullname.trim())
      errors.fullname = "Full name is required";

    if (!form.email.trim())
      errors.email = "Email is required";

    if (!/\S+@\S+\.\S+/.test(form.email))
      errors.email = "Enter a valid email";

    if (!form.phone.trim())
      errors.phone = "Phone number is required";

    if (!form.password.trim())
      errors.password = "Password is required";

    if (form.password.length < 6)
      errors.password = "Password must be at least 6 characters";

    if (Object.keys(errors).length) {
      setLocalErrors(errors);
      return;
    }

    await register({
      fullname: form.fullname.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
      referral_code: form.referral || null,
    });
  };

  /* SUCCESS HANDLER */
  useEffect(() => {
    if (!success || successRef.current) return;

    successRef.current = true;

    const registeredEmail = form.email;
    const registeredPassword = form.password;

    toast.success(message || "Account created successfully");

    const verifyPayload = {
      email: registeredEmail,
      password: registeredPassword,
    };

    sessionStorage.setItem("verifyData", JSON.stringify(verifyPayload));

    setForm({
      fullname: "",
      email: "",
      phone: "",
      password: "",
      referral: "",
    });

    setLocalErrors({});

    router.push(`/auth/verify?email=${registeredEmail}`);
  }, [success, message, router]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#041031] px-4 text-white">

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
      >

        {/* Header */}
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

        {error && (
          <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400 border border-red-500/20 text-center">
            {error}
          </p>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">

            {/* FULL NAME */}
            <div>
              <FormInput
                label="Full Name"
                name="fullname"
                placeholder="Enter your full name"
                value={form.fullname}
                onChange={handleChange}
              />
              {localErrors.fullname && (
                <p className="mt-1 text-xs text-red-400">
                  {localErrors.fullname}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <FormInput
                label="Email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={handleChange}
              />
              {localErrors.email && (
                <p className="mt-1 text-xs text-red-400">
                  {localErrors.email}
                </p>
              )}
            </div>

            {/* PHONE */}
            <div>
              <FormInput
                label="Phone Number"
                type="phone"
                name="phone"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
              />
              {localErrors.phone && (
                <p className="mt-1 text-xs text-red-400">
                  {localErrors.phone}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <FormInput
                label="Password"
                name="password"
                placeholder="••••••••"
                showToggle
                value={form.password}
                onChange={handleChange}
              />

              {form.password && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Password strength</span>
                    <span
                      className={`font-semibold ${
                        passwordStrength.label === "Weak"
                          ? "text-red-400"
                          : passwordStrength.label === "Medium"
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>

                  <div className="h-1 w-full bg-white/10 rounded overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color}`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                </div>
              )}

              {localErrors.password && (
                <p className="mt-1 text-xs text-red-400">
                  {localErrors.password}
                </p>
              )}
            </div>

            {/* REFERRAL */}
            <div className="sm:col-span-2">
              <FormInput
                label="Referral Code (Optional)"
                name="referral"
                placeholder="Enter referral code"
                value={form.referral}
                onChange={handleChange}
              />
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