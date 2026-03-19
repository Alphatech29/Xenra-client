"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FormInput from "../../../../components/ui/formInput";
import { useLogin } from "../../../../hooks/useAuth";
import useToast from "../../../../hooks/useToast";
import {
  ShieldCheck, Zap, Globe, Gift, Coins,
  Eye, EyeOff, ArrowRight, Lock, Mail,
  Smartphone, CreditCard, CheckCircle2,
} from "lucide-react";

const FEATURES = [
  { icon: Coins,       label: "Crypto Exchange",   desc: "Swap at live market rates",   color: "text-cyan-400"   },
  { icon: Gift,        label: "Gift Card Trading",  desc: "Best payout in Nigeria",      color: "text-indigo-400" },
  { icon: Smartphone,  label: "Airtime & Bills",    desc: "All networks, instant",        color: "text-purple-400" },
  { icon: CreditCard,  label: "Virtual Card",       desc: "Spend globally, instantly",   color: "text-emerald-400"},
];

const STATS = [
  { val: "500K+", label: "Users",    cx: "text-cyan-400"   },
  { val: "₦18B+", label: "Volume",   cx: "text-indigo-400" },
  { val: "99.98%",label: "Uptime",   cx: "text-purple-400" },
];


function Spinner() {
  return (
    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"/>
  );
}

function HoloLogo({ size = "lg" }) {
  const dim = size === "lg" ? "h-14 w-14 rounded-[18px]" : "h-10 w-10 rounded-[14px]";
  return (
    <div className="relative shrink-0" style={{ width: size === "lg" ? 56 : 40, height: size === "lg" ? 56 : 40 }}>
      <motion.div
        className="absolute -inset-0.5 rounded-[20px] pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        style={{
          background: "conic-gradient(from 0deg, transparent 20%, rgba(34,211,238,.75) 38%, rgba(129,140,248,.6) 54%, rgba(168,85,247,.55) 68%, transparent 80%)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: 2,
          borderRadius: size === "lg" ? 20 : 16,
        }}
      />
      <div className={`relative z-10 flex ${dim} items-center justify-center bg-linear-to-br from-cyan-400 to-indigo-600 shadow-[0_0_24px_rgba(99,102,241,0.5)]`}
        style={{ fontFamily: "Syne, sans-serif", fontWeight: 800 }}>
        <span className="text-white text-lg font-black">X</span>
      </div>
    </div>
  );
}

function XCheckbox({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
      <div
        onClick={() => onChange(!checked)}
        className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
          checked
            ? "border-cyan-400/60 bg-cyan-400/15"
            : "border-white/15 bg-white/3 group-hover:border-white/25"
        }`}
      >
        <AnimatePresence>
          {checked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: .15 }}
            >
              <CheckCircle2 size={13} className="text-cyan-400"/>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="text-sm text-white/55 group-hover:text-white/75 transition-colors">{label}</span>
    </label>
  );
}

export default function LoginPage() {
  const router   = useRouter();
  const toast    = useToast();
  const { login, loading } = useLogin();

  const [submitting, setSubmitting] = useState(false);
  const [showPass,   setShowPass]   = useState(false);
  const [focused,    setFocused]    = useState(null);

  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [localErrors, setLocalErrors] = useState({});

  const isLoading = loading || submitting;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("rememberMe");
      if (saved) {
        const data = JSON.parse(saved);
        setForm({ email: data.email || "", password: data.password || "", remember: true });
      }
    } catch {
      localStorage.removeItem("rememberMe");
    }
  }, []);


  const validateForm = () => {
    const errors = {};
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Enter a valid email address";
    if (!form.password) errors.password = "Password is required";
    return errors;
  };


  const handleChange = (name, value) => {
    setForm(p => ({ ...p, [name]: value }));
    setLocalErrors(p => ({ ...p, [name]: "" }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const errors = validateForm();
    setLocalErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setSubmitting(true);
      const result = await login({ email: form.email.trim(), password: form.password, remember: form.remember });

      if (result?.success) {
        toast.success(result.message || "Login successful");
        if (form.remember) {
          localStorage.setItem("rememberMe", JSON.stringify({ email: form.email, password: form.password }));
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#000c42] flex">

      <div className="pointer-events-none absolute inset-0 -z-10">
        <svg width="100%" height="100%" className="absolute inset-0 opacity-[.045]">
          <defs>
            <pattern id="lhex" width="56" height="48.5" patternUnits="userSpaceOnUse">
              <polygon points="28,2 52,14 52,38 28,50 4,38 4,14" fill="none" stroke="#818cf8" strokeWidth=".5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lhex)"/>
        </svg>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-225 h-175 rounded-full bg-[radial-gradient(ellipse,rgba(129,140,248,0.12)_0%,transparent_65%)]"/>
        <div className="absolute -bottom-32 -left-24 w-150 h-125 rounded-full bg-[radial-gradient(ellipse,rgba(34,211,238,0.07)_0%,transparent_70%)]"/>
        <div className="absolute -bottom-32 -right-24 w-125 h-112.5 rounded-full bg-[radial-gradient(ellipse,rgba(168,85,247,0.07)_0%,transparent_70%)]"/>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(0,0,0,0.04)_3px,rgba(0,0,0,0.04)_4px)]"/>
      </div>

      <div className="hidden lg:flex lg:w-[48%] xl:w-[52%] flex-col justify-between p-12 xl:p-16 border-r border-white/6">
        <div className="flex items-center gap-3.5">
          <HoloLogo size="lg"/>
          <div>
            <span className="block text-xl font-black text-white tracking-tight" style={{ fontFamily:"Syne,sans-serif" }}>
              Xenra
            </span>
            <span className="block text-[11px] text-white/35 tracking-widest" style={{ fontFamily:"Space Mono,monospace" }}>
              FINANCIAL PLATFORM
            </span>
          </div>
        </div>

        <div className="my-auto">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/22 bg-indigo-400/6 px-4 py-1.5">
            <span className="inline-block h-1.25 w-1.25 rounded-full bg-indigo-400 animate-pulse"/>
            <span className="text-[11px] tracking-widest text-white/40" style={{ fontFamily:"Space Mono,monospace" }}>
              SECURE · FAST · TRUSTED
            </span>
          </div>

          <h1 className="text-[clamp(36px,3.8vw,56px)] font-black leading-[1.04] tracking-[-0.035em] text-white mb-4"
            style={{ fontFamily:"Syne,sans-serif" }}>
            One platform
            <br/>
            <span className="bg-linear-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent bg-size-[200%_auto] animate-[shimmer_4s_linear_infinite]">
              for everything.
            </span>
          </h1>

          <p className="text-base text-white/40 leading-relaxed max-w-sm mb-10">
            Trade gift cards, swap crypto, pay bills, buy airtime, and spend globally with your Xenra virtual card.
          </p>

          <div className="space-y-4 mb-12">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: [0.22,1,0.36,1] }}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/8 bg-white/4">
                    <Icon size={17} className={f.color}/>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/82">{f.label}</p>
                    <p className="text-xs text-white/35">{f.desc}</p>
                  </div>
                  <CheckCircle2 size={14} className="text-white/18 ml-auto shrink-0"/>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="rounded-2xl border border-white/[.07] bg-white/3 px-4 py-3.5 text-center"
              >
                <p className={`text-xl font-black leading-none mb-1 ${s.cx}`} style={{ fontFamily:"Syne,sans-serif" }}>{s.val}</p>
                <p className="text-[10px] text-white/28 tracking-widest uppercase" style={{ fontFamily:"Space Mono,monospace" }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          {["CBN Licensed","ISO 27001","PCI DSS"].map(b => (
            <div key={b} className="flex items-center gap-1.5">
              <ShieldCheck size={11} className="text-cyan-400"/>
              <span className="text-[10px] text-white/28 tracking-[.05em]" style={{ fontFamily:"Space Mono,monospace" }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0,  scale: 1    }}
          transition={{ duration: 0.55, ease: [0.22,1,0.36,1] }}
          className="w-full max-w-105"
        >
          <div className="relative rounded-3xl border border-white/9 bg-white/4 backdrop-blur-2xl shadow-[0_32px_100px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.07)] overflow-hidden">

            <div className="h-px bg-linear-to-r from-transparent via-cyan-400/55 to-transparent"/>

            {[["top-3","left-3"],["top-3","right-3"],["bottom-3","left-3"],["bottom-3","right-3"]].map(([v,h]) => (
              <div key={v+h} className="absolute w-3.5 h-3.5 pointer-events-none"
                style={{
                  [v.split("-")[0]]: "12px",
                  [h.split("-")[0]]: "12px",
                  borderTop:    v.startsWith("top")    ? "1px solid rgba(129,140,248,.35)" : "none",
                  borderBottom: v.startsWith("bottom") ? "1px solid rgba(129,140,248,.35)" : "none",
                  borderLeft:   h.startsWith("left")   ? "1px solid rgba(129,140,248,.35)" : "none",
                  borderRight:  h.startsWith("right")  ? "1px solid rgba(129,140,248,.35)" : "none",
                }}
              />
            ))}

            <div className="px-8 pt-9 pb-8">

              <div className="lg:hidden flex justify-center mb-7">
                <HoloLogo size="lg"/>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-black text-white tracking-[-0.02em] mb-1.5" style={{ fontFamily:"Syne,sans-serif" }}>
                  Welcome back
                </h2>
                <p className="text-sm text-white/42 leading-relaxed">
                  Sign in to your Xenra account to continue
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-white/55 tracking-[.06em] uppercase"
                    style={{ fontFamily:"Space Mono,monospace" }}>
                    Email Address
                  </label>
                  <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                    localErrors.email
                      ? "border-red-400/50 bg-red-400/5"
                      : focused === "email"
                        ? "border-cyan-400/45 bg-cyan-400/4 shadow-[0_0_0_3px_rgba(34,211,238,0.07)]"
                        : "border-white/9 bg-white/3 hover:border-white/15"
                  }`}>
                    <Mail size={15} className={`absolute left-4 shrink-0 transition-colors ${
                      focused === "email" ? "text-cyan-400" : "text-white/25"
                    }`}/>
                    <input
                      type="email"
                      value={form.email}
                      placeholder="you@example.com"
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      onChange={e => handleChange("email", e.target.value)}
                      className="w-full bg-transparent pl-10 pr-4 py-3.5 text-sm text-white placeholder:text-white/25 outline-none"
                    />
                  </div>
                  <AnimatePresence>
                    {localErrors.email && (
                      <motion.p initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                        className="text-[11px] text-red-400 flex items-center gap-1.5 pl-1">
                        <span className="inline-block h-1 w-1 rounded-full bg-red-400"/>
                        {localErrors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-white/55 tracking-[.06em] uppercase"
                    style={{ fontFamily:"Space Mono,monospace" }}>
                    Password
                  </label>
                  <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                    localErrors.password
                      ? "border-red-400/50 bg-red-400/5"
                      : focused === "password"
                        ? "border-cyan-400/45 bg-cyan-400/4 shadow-[0_0_0_3px_rgba(34,211,238,0.07)]"
                        : "border-white/9 bg-white/3 hover:border-white/15"
                  }`}>
                    <Lock size={15} className={`absolute left-4 shrink-0 transition-colors ${
                      focused === "password" ? "text-cyan-400" : "text-white/25"
                    }`}/>
                    <input
                      type={showPass ? "text" : "password"}
                      value={form.password}
                      placeholder="••••••••••"
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused(null)}
                      onChange={e => handleChange("password", e.target.value)}
                      className="w-full bg-transparent pl-10 pr-12 py-3.5 text-sm text-white placeholder:text-white/25 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(p => !p)}
                      className="absolute right-4 text-white/28 hover:text-white/65 transition-colors"
                    >
                      {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                    </button>
                  </div>
                  <AnimatePresence>
                    {localErrors.password && (
                      <motion.p initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                        className="text-[11px] text-red-400 flex items-center gap-1.5 pl-1">
                        <span className="inline-block h-1 w-1 rounded-full bg-red-400"/>
                        {localErrors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-between">
                  <XCheckbox
                    checked={form.remember}
                    onChange={v => handleChange("remember", v)}
                    label="Remember me"
                  />
                  <Link href="/auth/forgot-password"
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                    Forgot password?
                  </Link>
                </div>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileTap={{ scale: isLoading ? 1 : 0.97 }}
                  className={`relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2.5 ${
                    isLoading
                      ? "bg-white/8 cursor-not-allowed text-white/40"
                      : "bg-linear-to-r from-cyan-500 to-indigo-600 shadow-[0_4px_24px_rgba(99,102,241,0.4)] hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(99,102,241,0.55)]"
                  }`}
                >

                  {!isLoading && (
                    <div className="pointer-events-none absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-500 skew-x-[-18deg] bg-white/15"/>
                  )}

                  {isLoading ? (
                    <>
                      <Spinner/>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={15}/>
                    </>
                  )}
                </motion.button>


                <div className="relative flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/6"/>
                  <span className="text-xs text-white/22 shrink-0" style={{ fontFamily:"Space Mono,monospace" }}>OR</span>
                  <div className="flex-1 h-px bg-white/6"/>
                </div>

                <button type="button"
                  className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/9 bg-white/3 py-3.5 text-sm font-medium text-white/55 hover:bg-white/[.07] hover:border-white/16 hover:text-white/80 transition-all duration-200">
                  <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </form>

              <p className="mt-7 text-center text-sm text-white/38">
                Don't have an account?{" "}
                <Link href="/auth/register"
                  className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                  Create one free
                </Link>
              </p>
            </div>
            <div className="h-px bg-linear-to-r from-transparent via-indigo-400/38 to-transparent"/>
          </div>
          <div className="mt-5 flex items-center justify-center gap-4 flex-wrap">
            {[
              { icon: ShieldCheck, label: "Secure login",    cx: "text-cyan-400"   },
              { icon: Lock,        label: "256-bit SSL",     cx: "text-indigo-400" },
              { icon: Globe,       label: "CAC Approval",   cx: "text-purple-400" },
            ].map(({ icon: Icon, label, cx }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon size={12} className={cx}/>
                <span className="text-[11px] text-white/25 tracking-[.04em]"
                  style={{ fontFamily:"Space Mono,monospace" }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}