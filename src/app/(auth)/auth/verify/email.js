"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  useVerifyOtp,
  useOtpExpireTime,
  useResendOtp,
} from "../../../../hooks/useVerifyOtp";
import { useLogin } from "../../../../hooks/useAuth";
import useToast from "../../../../hooks/useToast";
import {
  ShieldCheck, Mail, RefreshCw,
  Clock, CheckCircle2, AlertCircle,
  Lock, Globe, Zap,
} from "lucide-react";


const API_URL     = process.env.NEXT_PUBLIC_BACKEND_API_URL;
if (!API_URL) throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not defined");
const STORAGE_KEY = "otp_expiry_time";
const OTP_LENGTH  = 6;

const fmt = (n) => `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`;

function maskEmail(e) {
  const [u, d] = e.split("@");
  if (!u || !d) return e;
  return `${u.slice(0, 2)}${"•".repeat(Math.max(u.length - 2, 3))}@${d}`;
}

function HoloLogo() {
  return (
    <div className="relative" style={{ width: 52, height: 52 }}>
      <motion.div
        className="absolute pointer-events-none"
        style={{
          inset: -2, borderRadius: 18,
          background: "conic-gradient(from 0deg,transparent 20%,rgba(34,211,238,.75) 38%,rgba(129,140,248,.6) 54%,rgba(168,85,247,.55) 68%,transparent 80%)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor", maskComposite: "exclude", padding: 2,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
      <div
        className="relative z-10 w-full h-full flex items-center justify-center rounded-2xl bg-linear-to-br from-cyan-400 to-indigo-600 shadow-[0_0_24px_rgba(99,102,241,0.5)] text-white text-lg font-black"
        style={{ fontFamily: "Syne, sans-serif" }}
      >
        X
      </div>
    </div>
  );
}

function CountdownRing({ seconds, total = 300 }) {
  const r    = 30;
  const circ = 2 * Math.PI * r;
  const pct  = total > 0 ? seconds / total : 0;
  const dash = circ * (1 - pct);
  const color = pct > 0.5 ? "#22d3ee" : pct > 0.2 ? "#f59e0b" : "#f87171";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative flex items-center justify-center">
        <svg width="72" height="72" className="-rotate-90">
          <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3.5"/>
          <circle
            cx="36" cy="36" r={r}
            fill="none"
            stroke={color}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dash}
            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s ease" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          {seconds > 0 ? (
            <span
              className="text-[13px] font-black text-white leading-none"
              style={{ fontFamily: "Space Mono, monospace" }}
            >
              {fmt(seconds)}
            </span>
          ) : (
            <Clock size={14} className="text-white/30" />
          )}
        </div>
      </div>
      <span
        className="text-[10px] text-white/28 tracking-[.08em] uppercase"
        style={{ fontFamily: "Space Mono, monospace" }}
      >
        {seconds > 0 ? "remaining" : "expired"}
      </span>
    </div>
  );
}

function OtpBox({ value, index, disabled, onChange, onKeyDown, onPaste, inputRef, state }) {
  const filled = value !== "";
  const base   = "h-12 w-10 sm:h-14 sm:w-12 rounded-xl border text-center text-xl font-black text-white outline-none transition-all duration-200 disabled:opacity-35 disabled:cursor-not-allowed";

  const border =
    state === "error"   ? "border-red-400/65   bg-red-400/[.07]     shadow-[0_0_0_3px_rgba(248,113,113,0.09)]" :
    state === "success" ? "border-emerald-400/65 bg-emerald-400/[.07] shadow-[0_0_0_3px_rgba(52,211,153,0.09)]"  :
    filled              ? "border-indigo-400/55 bg-indigo-400/[.06]  shadow-[0_0_0_3px_rgba(129,140,248,0.08)]"  :
                          "border-white/[.1]   bg-white/[.03]       hover:border-white/[.22]";

  return (
    <motion.div
      key={index}
      className="relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <input
        ref={inputRef}
        value={value}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        disabled={disabled}
        onChange={e => onChange(index, e.target.value)}
        onKeyDown={e => onKeyDown(e, index)}
        onPaste={onPaste}
        maxLength={1}
        className={`${base} ${border}`}
        style={{ fontFamily: "Syne, sans-serif" }}
      />

      <AnimatePresence>
        {filled && state !== "error" && (
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }}
            className={`absolute -bottom-0.75 left-1/2 -translate-x-1/2 h-0.5 w-7 rounded-full origin-center ${
              state === "success" ? "bg-emerald-400" : "bg-indigo-400"
            }`}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StatusBanner({ type, message }) {
  const map = {
    error:   { bg: "bg-red-400/[.08]    border-red-400/22",    icon: AlertCircle,  cx: "text-red-400",    text: "text-red-400"    },
    success: { bg: "bg-emerald-400/[.08] border-emerald-400/22",icon: CheckCircle2, cx: "text-emerald-400",text: "text-emerald-400" },
    warning: { bg: "bg-amber-400/[.07]  border-amber-400/22",  icon: Clock,        cx: "text-amber-400",  text: "text-amber-400"  },
  };
  const s   = map[type];
  const Icon = s.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start gap-2.5 rounded-2xl border px-4 py-3 ${s.bg}`}
    >
      <Icon size={14} className={`${s.cx} shrink-0 mt-0.5`} />
      <p className={`text-sm leading-snug ${s.text}`}>{message}</p>
    </motion.div>
  );
}

export default function VerifyPage() {
  const toast        = useToast();
  const router       = useRouter();
  const searchParams = useSearchParams();
  const email        = useMemo(() => searchParams?.get("email") || "", [searchParams]);

  const { verify, loading, error }         = useVerifyOtp();
  const { fetchExpireTime }                 = useOtpExpireTime();
  const { resend, loading: resendLoading }  = useResendOtp();
  const { login }                           = useLogin();

  const timerRef    = useRef(null);
  const verifyingRef= useRef(false);
  const inputRefs   = useRef([]);

  const [code,      setCode]     = useState(Array(OTP_LENGTH).fill(""));
  const [seconds,   setSeconds]  = useState(0);
  const [totalSecs, setTotalSecs]= useState(300);
  const [otpState,  setOtpState] = useState("idle");

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const runTimer = useCallback((expiry) => {
    clearTimer();
    timerRef.current = setInterval(() => {
      const rem = Math.max(0, Math.floor((expiry - Date.now()) / 1000));
      setSeconds(rem);
      if (rem <= 0) { clearTimer(); localStorage.removeItem(STORAGE_KEY); }
    }, 1000);
  }, [clearTimer]);

  useEffect(() => {
    if (!email) return;
    (async () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const exp = parseInt(stored, 10);
        const rem = Math.floor((exp - Date.now()) / 1000);
        if (rem > 0) { setSeconds(rem); runTimer(exp); return; }
        localStorage.removeItem(STORAGE_KEY);
      }
      try {
        const res = await fetchExpireTime(email);
        if (res?.expiresAt) {
          const t = Math.max(Math.floor((res.expiresAt - Date.now()) / 1000), 300);
          setTotalSecs(t);
          localStorage.setItem(STORAGE_KEY, res.expiresAt.toString());
          runTimer(res.expiresAt);
        }
      } catch {}
    })();
    const t = setTimeout(() => inputRefs.current[0]?.focus(), 150);
    return () => { clearTimer(); clearTimeout(t); };
  }, [email, fetchExpireTime, runTimer, clearTimer]);

  const backendLogout = async () => {
    try {
      await fetch(`${API_URL}/api/v1/auth/logout`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
    } catch {} finally {
      sessionStorage.clear(); localStorage.removeItem(STORAGE_KEY);
    }
  };

  const safeRedirect = (path) => {
    try { router.push(path); router.refresh(); setTimeout(() => { if (window.location.pathname !== path) window.location.href = path; }, 300); }
    catch { window.location.href = path; }
  };

  const handlePostVerification = async () => {
    try {
      clearTimer(); localStorage.removeItem(STORAGE_KEY);
      toast.success("Verification successful!");
      const raw = sessionStorage.getItem("verifyData");
      if (!raw) { await backendLogout(); safeRedirect("/auth/login"); return; }
      let parsed;
      try { parsed = JSON.parse(raw); } catch { await backendLogout(); safeRedirect("/auth/login"); return; }
      if (!parsed?.email || !parsed?.password) { await backendLogout(); safeRedirect("/auth/login"); return; }
      try { await login({ email: parsed.email, password: parsed.password }); } catch { await backendLogout(); safeRedirect("/auth/login"); return; }
      sessionStorage.removeItem("verifyData");
      safeRedirect("/dashboard");
    } catch { await backendLogout(); safeRedirect("/auth/login"); }
  };

  const triggerVerify = useCallback(async (otp) => {
    if (otp.length !== OTP_LENGTH || seconds <= 0 || verifyingRef.current) return;
    verifyingRef.current = true;
    try {
      const res = await verify(email, otp);
      if (res?.success) { setOtpState("success"); setTimeout(handlePostVerification, 700); }
      else setOtpState("error");
    } finally { verifyingRef.current = false; }
  }, [email, seconds, verify]);

  const handleResend = async () => {
    if (!email) return;
    try {
      await resend(email);
      toast.success("New code sent to your email");
      setCode(Array(OTP_LENGTH).fill("")); setOtpState("idle");
      inputRefs.current[0]?.focus();
      const res = await fetchExpireTime(email);
      if (res?.expiresAt) { localStorage.setItem(STORAGE_KEY, res.expiresAt.toString()); runTimer(res.expiresAt); }
    } catch { toast.error("Failed to resend code"); }
  };

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    setOtpState("idle");
    const updated = [...code]; updated[i] = val.slice(-1); setCode(updated);
    if (val && i < OTP_LENGTH - 1) inputRefs.current[i + 1]?.focus();
    const joined = updated.join("");
    if (joined.length === OTP_LENGTH) triggerVerify(joined);
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      setOtpState("idle"); inputRefs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
    const updated = Array(OTP_LENGTH).fill("");
    pasted.forEach((d, i) => { updated[i] = d; });
    setCode(updated); setOtpState("idle");
    if (pasted.length === OTP_LENGTH) triggerVerify(updated.join(""));
  };

  useEffect(() => {
    if (!error) return;
    toast.error(error); setOtpState("error");
    setCode(Array(OTP_LENGTH).fill("")); inputRefs.current[0]?.focus();
  }, [error]);

  const expired = seconds === 0;
  const filled  = code.filter(Boolean).length;

  if (!email) return null;

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-[#000c42] text-white">


      <div className="pointer-events-none absolute inset-0 -z-10">
        <svg width="100%" height="100%" className="absolute inset-0 opacity-[.045]">
          <defs>
            <pattern id="vhex" width="56" height="48.5" patternUnits="userSpaceOnUse">
              <polygon points="28,2 52,14 52,38 28,50 4,38 4,14" fill="none" stroke="#22d3ee" strokeWidth=".5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#vhex)"/>
        </svg>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-225 h-175 rounded-full bg-[radial-gradient(ellipse,rgba(34,211,238,0.10)_0%,transparent_65%)]"/>
        <div className="absolute -bottom-32 -left-24  w-150 h-125 rounded-full bg-[radial-gradient(ellipse,rgba(129,140,248,0.07)_0%,transparent_70%)]"/>
        <div className="absolute -bottom-32 -right-24 w-125 h-112.5 rounded-full bg-[radial-gradient(ellipse,rgba(168,85,247,0.07)_0%,transparent_70%)]"/>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(0,0,0,0.04)_3px,rgba(0,0,0,0.04)_4px)]"/>
      </div>

      <div className="hidden lg:flex lg:w-[44%] xl:w-[46%] shrink-0 flex-col justify-between p-12 xl:p-16 border-r border-white/6">

        <Link href="/" className="flex items-center gap-3 w-fit">
          <HoloLogo/>
          <div>
            <span className="block text-xl font-black text-white tracking-tight" style={{ fontFamily:"Syne,sans-serif" }}>Xenra</span>
            <span className="block text-[10px] text-white/30 tracking-[.12em] uppercase" style={{ fontFamily:"Space Mono,monospace" }}>Financial Platform</span>
          </div>
        </Link>

        <div>
          <div className="flex justify-start mb-10">
            <div className="relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
              <div className="absolute inset-0 rounded-full bg-cyan-400/10 animate-ping" style={{ animationDuration:"3s", animationTimingFunction:"ease-out" }}/>
              <div className="absolute -inset-3 rounded-full bg-cyan-400/5"/>
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/22 bg-linear-to-br from-cyan-400/15 to-indigo-600/12 shadow-[0_0_40px_rgba(34,211,238,0.15)]">
                <ShieldCheck size={38} className="text-cyan-400"/>
              </div>
            </div>
          </div>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/22 bg-cyan-400/6 px-4 py-1.5">
            <span className="h-1.25 w-1.25 rounded-full bg-cyan-400 animate-pulse inline-block"/>
            <span className="text-[11px] tracking-widest text-white/40 uppercase" style={{ fontFamily:"Space Mono,monospace" }}>
              Secure · Encrypted
            </span>
          </div>

          <h2
            className="text-[clamp(28px,3vw,46px)] font-black leading-[1.05] tracking-[-0.03em] text-white mb-4"
            style={{ fontFamily:"Syne,sans-serif" }}
          >
            We protect<br/>
            <span className="bg-linear-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              your account.
            </span>
          </h2>

          <p className="text-[15px] leading-relaxed text-white/40 max-w-sm mb-10">
            Your one-time passcode confirms it's really you. Each code is unique, expires in minutes, and can only be used once.
          </p>

          <div className="space-y-4">
            {[
              { label: "One-time use only",      cx: "text-cyan-400"    },
              { label: "Expires automatically",   cx: "text-indigo-400"  },
              { label: "Encrypted in transit",    cx: "text-purple-400"  },
              { label: "Brute-force protected",   cx: "text-emerald-400" },
            ].map(({ label, cx }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/4">
                  <CheckCircle2 size={13} className={cx}/>
                </div>
                <span className="text-sm text-white/50">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom compliance */}
        <div className="flex flex-wrap items-center gap-5">
          {["256-bit SSL", "CBN Licensed", "ISO 27001"].map(b => (
            <div key={b} className="flex items-center gap-1.5">
              <ShieldCheck size={11} className="text-cyan-400"/>
              <span className="text-[10px] text-white/28 tracking-[.05em]" style={{ fontFamily:"Space Mono,monospace" }}>{b}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 min-w-0 items-center justify-center px-4 py-10 sm:py-16 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
          className="w-full max-w-100"
        >
          <div className="relative rounded-3xl border border-white/9 bg-white/4 backdrop-blur-2xl overflow-hidden shadow-[0_28px_90px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.07)]">

            <div className="h-px bg-linear-to-r from-transparent via-cyan-400/55 to-transparent"/>

            {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h]) => (
              <div key={v+h} className="absolute w-3.5 h-3.5 pointer-events-none"
                style={{
                  [v]: "12px", [h]: "12px",
                  borderTop:    v==="top"    ? "1px solid rgba(34,211,238,.28)" : "none",
                  borderBottom: v==="bottom" ? "1px solid rgba(34,211,238,.28)" : "none",
                  borderLeft:   h==="left"   ? "1px solid rgba(34,211,238,.28)" : "none",
                  borderRight:  h==="right"  ? "1px solid rgba(34,211,238,.28)" : "none",
                }}
              />
            ))}

            <div className="px-6 sm:px-8 py-8">

              <div className="lg:hidden flex justify-center mb-7">
                <HoloLogo/>
              </div>

              <div className="flex flex-col items-center text-center mb-7">

                <div className="relative mb-5 flex items-center justify-center" style={{ width: 64, height: 64 }}>
                  <div className="absolute inset-0 rounded-2xl bg-cyan-400/10 animate-ping" style={{ animationDuration:"2.8s" }}/>
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/25 bg-linear-to-br from-cyan-400/15 to-indigo-500/15 shadow-[0_0_28px_rgba(34,211,238,0.15)]">
                    <Lock size={24} className="text-cyan-400"/>
                  </div>
                </div>

                <h2
                  className="text-2xl font-black text-white tracking-[-0.02em] mb-2"
                  style={{ fontFamily:"Syne,sans-serif" }}
                >
                  Verify your identity
                </h2>

                <p className="text-[13px] text-white/40 leading-relaxed mb-3 max-w-65">
                  Enter the 6-digit code sent to
                </p>

                <div className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/4 px-3.5 py-2">
                  <Mail size={13} className="text-indigo-400 shrink-0"/>
                  <span className="text-[13px] text-white/65" style={{ fontFamily:"Space Mono,monospace" }}>
                    {maskEmail(email)}
                  </span>
                </div>
              </div>
              <div className="flex justify-center mb-5">
                <CountdownRing seconds={seconds} total={totalSecs}/>
              </div>

              <div className="flex justify-center gap-2 sm:gap-2.5 mb-4">
                {code.map((digit, i) => (
                  <OtpBox
                    key={i}
                    value={digit}
                    index={i}
                    disabled={expired || loading || otpState === "success"}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    inputRef={el => (inputRefs.current[i] = el)}
                    state={otpState}
                  />
                ))}
              </div>

              {/* ── Progress dots ── */}
              <div className="flex justify-center items-center gap-1.5 mb-6">
                {Array(OTP_LENGTH).fill(null).map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-1.5 rounded-full"
                    animate={{
                      width: i < filled ? "18px" : "6px",
                      background:
                        otpState === "success" ? "#34d399" :
                        otpState === "error"   ? "#f87171" :
                        i < filled             ? "#818cf8" :
                                                 "rgba(255,255,255,0.12)",
                    }}
                    transition={{ duration: .22 }}
                  />
                ))}
              </div>

              {/* ── Status banners ── */}
              <div className="mb-4 space-y-3">
                <AnimatePresence mode="wait">
                  {otpState === "error" && (
                    <StatusBanner key="err" type="error" message="Invalid code — please check and try again."/>
                  )}
                  {otpState === "success" && (
                    <StatusBanner key="ok" type="success" message="Code verified! Signing you in now…"/>
                  )}
                  {expired && otpState === "idle" && (
                    <StatusBanner key="exp" type="warning" message="Your code has expired. Request a new one."/>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {(loading || otpState === "success") && (
                    <motion.div
                      initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center justify-center gap-2.5 rounded-2xl border border-white/[.07] bg-white/3 py-3">
                        <div className="h-4 w-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin shrink-0"/>
                        <span className="text-sm text-white/42" style={{ fontFamily:"Space Mono,monospace" }}>
                          {otpState === "success" ? "Signing you in…" : "Verifying code…"}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-3">
                {expired ? (
                  <motion.button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    whileTap={{ scale: resendLoading ? 1 : 0.97 }}
                    className={`group relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 font-[inherit] ${
                      resendLoading
                        ? "bg-white/8 cursor-not-allowed text-white/40"
                        : "bg-linear-to-r from-cyan-500 to-indigo-600 shadow-[0_4px_24px_rgba(99,102,241,0.38)] hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(99,102,241,0.55)]"
                    }`}
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-[-18deg] bg-white/15"/>
                    <span className="relative z-10 flex items-center gap-2">
                      {resendLoading
                        ? <><div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"/> Sending…</>
                        : <><RefreshCw size={14}/> Send New Code</>
                      }
                    </span>
                  </motion.button>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="text-white/30">Didn't receive it?</span>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendLoading || seconds > 240}
                      className="font-semibold text-cyan-400 hover:text-cyan-300 disabled:text-white/20 disabled:cursor-not-allowed transition-colors font-[inherit]"
                    >
                      {resendLoading ? "Sending…" : "Resend code"}
                    </button>
                  </div>
                )}

                {/* Change email */}
                <div className="flex justify-center">
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center gap-1.5 text-[12px] text-white/25 hover:text-white/50 transition-colors"
                  >
                    <Mail size={11}/>
                    Use a different email
                  </Link>
                </div>
              </div>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-indigo-400/35 to-transparent"/>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {[
              { icon: ShieldCheck, label: "Encrypted code",    cx: "text-cyan-400"    },
              { icon: Zap,         label: "Expires in 5 min",  cx: "text-indigo-400"  },
              { icon: Globe,       label: "CBN Licensed",      cx: "text-purple-400"  },
            ].map(({ icon: Icon, label, cx }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon size={11} className={cx}/>
                <span className="text-[10px] text-white/22 tracking-[.04em]" style={{ fontFamily:"Space Mono,monospace" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}