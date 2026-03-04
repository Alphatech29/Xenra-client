"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  useVerifyOtp,
  useOtpExpireTime,
  useResendOtp,
} from "../../../../hooks/useVerifyOtp";
import { useLogin } from "../../../../hooks/useAuth";
import useToast from "../../../../hooks/useToast";

/* ---------------- ENV CONFIG ---------------- */

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not defined");
}

const STORAGE_KEY = "otp_expiry_time";
const OTP_LENGTH = 6;

export default function VerifyPage() {
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = useMemo(() => {
    return searchParams?.get("email") || "";
  }, [searchParams]);

  const { verify, loading, error } = useVerifyOtp();
  const { fetchExpireTime } = useOtpExpireTime();
  const { resend, loading: resendLoading } = useResendOtp();
  const { login } = useLogin();

  const timerRef = useRef(null);
  const verifyingRef = useRef(false);
  const inputRefs = useRef([]);

  const [code, setCode] = useState(Array(OTP_LENGTH).fill(""));
  const [seconds, setSeconds] = useState(0);

  /* ---------------- BACKEND LOGOUT ---------------- */

  const backendLogout = async () => {
    try {
      await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      sessionStorage.clear();
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  /* ---------------- SAFE REDIRECT ---------------- */

  const safeRedirect = (path) => {
    try {
      router.push(path);
      router.refresh();

      setTimeout(() => {
        if (window.location.pathname !== path) {
          window.location.href = path;
        }
      }, 300);
    } catch {
      window.location.href = path;
    }
  };

  /* ---------------- FORMAT TIME ---------------- */

  const formatTime = (total) => {
    const minutes = Math.floor(total / 60);
    const secs = total % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  /* ---------------- TIMER ---------------- */

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const runTimer = useCallback((expiryTime) => {
    clearTimer();

    timerRef.current = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((expiryTime - Date.now()) / 1000)
      );

      setSeconds(remaining);

      if (remaining <= 0) {
        clearTimer();
        localStorage.removeItem(STORAGE_KEY);
      }
    }, 1000);
  }, []);

  /* ---------------- INITIAL LOAD ---------------- */

  useEffect(() => {
    if (!email) return;

    const init = async () => {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const expiry = parseInt(stored, 10);
        const remaining = Math.floor((expiry - Date.now()) / 1000);

        if (remaining > 0) {
          setSeconds(remaining);
          runTimer(expiry);
          return;
        }

        localStorage.removeItem(STORAGE_KEY);
      }

      try {
        const res = await fetchExpireTime(email);
        if (res?.expiresAt) {
          localStorage.setItem(STORAGE_KEY, res.expiresAt.toString());
          runTimer(res.expiresAt);
        }
      } catch {}
    };

    init();

    const focusTimer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);

    return () => {
      clearTimer();
      clearTimeout(focusTimer);
    };
  }, [email, fetchExpireTime, runTimer]);

  /* ---------------- POST VERIFICATION ---------------- */

  const handlePostVerification = async () => {
    try {
      clearTimer();
      localStorage.removeItem(STORAGE_KEY);
      setCode(Array(OTP_LENGTH).fill(""));
      setSeconds(0);

      toast.success("Verification successful");

      const storedData = sessionStorage.getItem("verifyData");

      if (!storedData) {
        await backendLogout();
        safeRedirect("/auth/login");
        return;
      }

      let parsed;

      try {
        parsed = JSON.parse(storedData);
      } catch {
        await backendLogout();
        safeRedirect("/auth/login");
        return;
      }

      if (!parsed?.email || !parsed?.password) {
        await backendLogout();
        safeRedirect("/auth/login");
        return;
      }

      try {
        await login({
          email: parsed.email,
          password: parsed.password,
        });
      } catch {
        await backendLogout();
        safeRedirect("/auth/login");
        return;
      }

      sessionStorage.removeItem("verifyData");
      safeRedirect("/dashboard");
    } catch {
      await backendLogout();
      safeRedirect("/auth/login");
    }
  };

  /* ---------------- VERIFY TRIGGER ---------------- */

  const triggerVerify = async (fullOtp) => {
    if (
      fullOtp.length !== OTP_LENGTH ||
      seconds <= 0 ||
      verifyingRef.current
    )
      return;

    verifyingRef.current = true;

    try {
      const res = await verify(email, fullOtp);
      if (res?.success) {
        await handlePostVerification();
      }
    } finally {
      verifyingRef.current = false;
    }
  };

  /* ---------------- RESEND ---------------- */

  const handleResend = async () => {
    if (!email) return;

    try {
      await resend(email);
      toast.success("New code sent");

      setCode(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();

      const res = await fetchExpireTime(email);
      if (res?.expiresAt) {
        localStorage.setItem(STORAGE_KEY, res.expiresAt.toString());
        runTimer(res.expiresAt);
      }
    } catch {
      toast.error("Failed to resend code");
    }
  };

  /* ---------------- INPUT HANDLING ---------------- */

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const updated = [...code];
    updated[index] = value.slice(-1);
    setCode(updated);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    triggerVerify(updated.join(""));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH)
      .split("");

    const updated = Array(OTP_LENGTH).fill("");
    pasted.forEach((digit, i) => {
      updated[i] = digit;
    });

    setCode(updated);
    triggerVerify(updated.join(""));
  };

  useEffect(() => {
    if (!error) return;

    toast.error(error);
    setCode(Array(OTP_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
  }, [error, toast]);

  if (!email) return null;


  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#041031] px-4 text-white">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl"
      >
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary-400 to-primary-600 text-xl font-bold text-black">
            🔐
          </div>
          <h1 className="text-2xl font-semibold tracking-wide">
            Verification Code
          </h1>
          <p className="mt-1 text-sm text-white/60 text-center">
            Enter the code sent to {email}
          </p>
        </div>

        <div className="flex justify-center gap-2">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              value={digit}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              disabled={seconds === 0 || loading}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              maxLength={1}
              className="w-12 h-12 text-center text-lg rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-cyan-400"
            />
          ))}
        </div>

        <div className="text-center text-xs text-white/60 mt-4">
          {seconds > 0 ? (
            `Code expires in ${formatTime(seconds)}`
          ) : (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              {resendLoading ? "Sending..." : "Resend Code"}
            </button>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-white/60">
          <Link
            href="/auth/register"
            className="block text-xs text-white/50 hover:text-white/80"
          >
            Change email address
          </Link>
        </p>
      </motion.div>
    </div>
  );
}