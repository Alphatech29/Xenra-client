"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRegister } from "../../../../hooks/useAuth";
import useToast from "../../../../hooks/useToast";
import {
  User, Mail, Phone, Lock, Eye, EyeOff,
  ArrowRight, Gift, CheckCircle2, ShieldCheck,
  Zap, Globe, Users, Tag, AlertCircle,
  Coins, Smartphone, CreditCard, Star,
} from "lucide-react";

function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8)          score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[a-z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 2) return { label: "Weak",   pct: 33,  cx: "text-red-400",    bar: "bg-red-500"    };
  if (score <= 4) return { label: "Medium", pct: 66,  cx: "text-amber-400",  bar: "bg-amber-400"  };
  return            { label: "Strong", pct: 100, cx: "text-emerald-400", bar: "bg-emerald-400" };
}

function HoloLogo({ size = "md" }) {
  const dim    = size === "lg" ? 56 : 44;
  const rx     = size === "lg" ? 18 : 14;
  const textSz = size === "lg" ? "text-xl" : "text-base";
  return (
    <div className="relative shrink-0" style={{ width: dim, height: dim }}>
      <motion.div
        className="absolute pointer-events-none"
        style={{
          inset: -2, borderRadius: rx + 2,
          background: "conic-gradient(from 0deg,transparent 20%,rgba(34,211,238,.75) 38%,rgba(129,140,248,.6) 54%,rgba(168,85,247,.55) 68%,transparent 80%)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor", maskComposite: "exclude", padding: 2,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
      <div
        className={`relative z-10 flex items-center justify-center bg-linear-to-br from-cyan-400 to-indigo-600 shadow-[0_0_24px_rgba(99,102,241,0.5)] ${textSz} font-black text-white`}
        style={{ width: dim, height: dim, borderRadius: rx, fontFamily: "Syne,sans-serif" }}
      >
        X
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, type = "text", name, value, placeholder, onChange, onFocus, onBlur, focused, error, suffix }) {
  const isFocused = focused === name;
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-semibold tracking-[.07em] text-white/50 uppercase"
        style={{ fontFamily: "Space Mono,monospace" }}>
        {label}
      </label>
      <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
        error
          ? "border-red-400/50 bg-red-400/5 shadow-[0_0_0_3px_rgba(248,113,113,0.07)]"
          : isFocused
            ? "border-cyan-400/45 bg-cyan-400/4 shadow-[0_0_0_3px_rgba(34,211,238,0.07)]"
            : "border-white/9 bg-white/3 hover:border-white/16"
      }`}>
        <Icon size={14} className={`absolute left-3.5 shrink-0 transition-colors ${
          error ? "text-red-400" : isFocused ? "text-cyan-400" : "text-white/25"
        }`}/>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onFocus={() => onFocus(name)}
          onBlur={() => onBlur(null)}
          onChange={e => onChange(name, e.target.value)}
          className="w-full bg-transparent pl-9 pr-4 py-3 text-sm text-white placeholder:text-white/22 outline-none"
        />
        {suffix}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 pl-0.5 text-[11px] text-red-400">
            <AlertCircle size={11} className="shrink-0"/>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function StepDot({ done, active, n }) {
  return (
    <div className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold transition-all duration-300 ${
      done   ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-400" :
      active ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-400"         :
               "border-white/10 bg-white/3 text-white/22"
    }`} style={{ fontFamily: "Space Mono,monospace" }}>
      {done ? <CheckCircle2 size={12}/> : n}
    </div>
  );
}

const PERKS = [
  { icon: Coins,      label: "Crypto Exchange",  desc: "Live rates, instant NGN payout",     color: "text-cyan-400"   },
  { icon: Gift,       label: "Gift Card Trading", desc: "200+ brands, best rates in Nigeria", color: "text-indigo-400" },
  { icon: Smartphone, label: "Airtime & Bills",   desc: "All networks, instant processing",   color: "text-purple-400" },
  { icon: CreditCard, label: "Virtual Card",      desc: "Spend globally with Mastercard",     color: "text-emerald-400"},
];

const SOCIAL_PROOF = [
  { val: "500K+", label: "Users",   cx: "text-cyan-400"   },
  { val: "₦18B+", label: "Volume",  cx: "text-indigo-400" },
  { val: "Free",  label: "To join", cx: "text-purple-400" },
];

const STEPS = ["Personal info", "Security", "Done"];

export default function RegisterPage() {
  const { register, loading, error: apiError, success, message } = useRegister();
  const toast        = useToast();
  const router       = useRouter();
  const searchParams = useSearchParams();
  const successRef   = useRef(false);

  const [showPass,  setShowPass]  = useState(false);
  const [focused,   setFocused]   = useState(null);
  const [step,      setStep]      = useState(0);

  const [form, setForm] = useState({
    fullname: "", email: "", phone: "", password: "", referral: "",
  });
  const [localErrors, setLocalErrors] = useState({});

  const strength = getStrength(form.password);

  useEffect(() => {
    const ref = searchParams.get("ref") || searchParams.get("referral") || searchParams.get("invite");
    if (ref) {
      setForm(p => ({ ...p, referral: ref }));
      localStorage.setItem("referral_code", ref);
    } else {
      const stored = localStorage.getItem("referral_code");
      if (stored) setForm(p => ({ ...p, referral: stored }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!success || successRef.current) return;
    successRef.current = true;
    toast.success(message || "Account created successfully!");
    sessionStorage.setItem("verifyData", JSON.stringify({ email: form.email, password: form.password }));
    setForm({ fullname: "", email: "", phone: "", password: "", referral: "" });
    setLocalErrors({});
  setTimeout(() => {
    router.push(`/auth/verify?email=${email}`);
  }, 3000);
  }, [success, message, router]);

  const handleChange = (name, value) => {
    setForm(p => ({ ...p, [name]: value }));
    if (name === "referral") localStorage.setItem("referral_code", value);
    setLocalErrors(p => ({ ...p, [name]: "" }));
  };

  const validateStep1 = () => {
    const errors = {};
    if (!form.fullname.trim()) errors.fullname = "Full name is required";
    if (!form.email.trim())    errors.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Enter a valid email";
    if (!form.phone.trim())    errors.phone    = "Phone number is required";
    return errors;
  };

  const validateStep2 = () => {
    const errors = {};
    if (!form.password)               errors.password = "Password is required";
    if (form.password.length < 6)     errors.password = "Must be at least 6 characters";
    return errors;
  };


  const handleNext = () => {
    const errors = validateStep1();
    setLocalErrors(errors);
    if (!Object.keys(errors).length) setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    successRef.current = false;
    const errors = validateStep2();
    setLocalErrors(errors);
    if (Object.keys(errors).length) return;
    await register({
      fullname: form.fullname.trim(),
      email:    form.email.trim(),
      phone:    form.phone.trim(),
      password: form.password,
      referral_code: form.referral || null,
    });
  };

  const step1Done = !!(form.fullname && form.email && form.phone);
  const currentStep = step === 0 ? 0 : 1;

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-[#000c42]">

      <div className="pointer-events-none absolute inset-0 -z-10">
        <svg width="100%" height="100%" className="absolute inset-0 opacity-[.045]">
          <defs>
            <pattern id="rghex" width="56" height="48.5" patternUnits="userSpaceOnUse">
              <polygon points="28,2 52,14 52,38 28,50 4,38 4,14" fill="none" stroke="#818cf8" strokeWidth=".5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#rghex)"/>
        </svg>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-225 h-175 rounded-full bg-[radial-gradient(ellipse,rgba(129,140,248,0.12)_0%,transparent_65%)]"/>
        <div className="absolute -bottom-32 -left-24 w-150 h-125 rounded-full bg-[radial-gradient(ellipse,rgba(34,211,238,0.07)_0%,transparent_70%)]"/>
        <div className="absolute -bottom-32 -right-24 w-125 h-112.5 rounded-full bg-[radial-gradient(ellipse,rgba(168,85,247,0.07)_0%,transparent_70%)]"/>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(0,0,0,0.04)_3px,rgba(0,0,0,0.04)_4px)]"/>
      </div>

      <div className="hidden lg:flex lg:w-[46%] xl:w-[50%] flex-col justify-between p-12 xl:p-16 border-r border-white/6 text-white/70">


        <div className="flex items-center gap-3.5">
          <HoloLogo size="lg"/>
          <div>
            <span className="block text-xl font-black text-white tracking-tight" style={{ fontFamily: "Syne,sans-serif" }}>Xenra</span>
            <span className="block text-[10px] text-white/30 tracking-[.12em]" style={{ fontFamily: "Space Mono,monospace" }}>FINANCIAL PLATFORM</span>
          </div>
        </div>

        <div className="my-auto">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/22 bg-indigo-400/6 px-4 py-1.5">
            <span className="inline-block h-1.25 w-1.25 rounded-full bg-indigo-400 animate-pulse"/>
            <span className="text-[11px] tracking-widest text-white/40" style={{ fontFamily: "Space Mono,monospace" }}>FREE · INSTANT · SECURE</span>
          </div>

          <h2 className="text-[clamp(32px,3.4vw,52px)] font-black leading-[1.04] tracking-[-0.035em] text-white mb-4"
            style={{ fontFamily: "Syne,sans-serif" }}>
            Join 500,000+<br/>
            <span className="bg-linear-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              smart Nigerians.
            </span>
          </h2>

          <p className="text-[15px] text-white/40 leading-relaxed max-w-sm mb-10">
            Get instant access to crypto trading, gift card exchange, bill payments, airtime, wallet, and a virtual Mastercard — all free.
          </p>

          {/* Perk list */}
          <div className="space-y-4 mb-12">
            {PERKS.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div key={p.label} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1, ease: [0.22,1,0.36,1] }}
                  className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/[.07] bg-white/4">
                    <Icon size={17} className={p.color}/>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/85">{p.label}</p>
                    <p className="text-xs text-white/32">{p.desc}</p>
                  </div>
                  <CheckCircle2 size={13} className="text-white/15 ml-auto shrink-0"/>
                </motion.div>
              );
            })}
          </div>


          <div className="grid grid-cols-3 gap-3">
            {SOCIAL_PROOF.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 + i * 0.07 }}
                className="rounded-2xl border border-white/[.07] bg-white/3 px-3 py-3.5 text-center">
                <p className={`text-xl font-black leading-none mb-1 ${s.cx}`} style={{ fontFamily: "Syne,sans-serif" }}>{s.val}</p>
                <p className="text-[10px] text-white/28 tracking-widest uppercase" style={{ fontFamily: "Space Mono,monospace" }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>


        <div className="flex flex-wrap items-center gap-5">
          {["CBN Licensed", "ISO 27001", "PCI DSS"].map(b => (
            <div key={b} className="flex items-center gap-1.5">
              <ShieldCheck size={11} className="text-cyan-400"/>
              <span className="text-[10px] text-white/28 tracking-[.05em]" style={{ fontFamily: "Space Mono,monospace" }}>{b}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22,1,0.36,1] }}
          className="w-full max-w-115"
        >

          <div className="relative rounded-3xl border border-white/9 bg-white/4 backdrop-blur-2xl shadow-[0_32px_100px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.07)] overflow-hidden">

            <div className="h-px bg-linear-to-r from-transparent via-indigo-400/55 to-transparent"/>

            {[["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h]) => (
              <div key={v+h} className="absolute w-3.5 h-3.5 pointer-events-none"
                style={{
                  [v]: "12px", [h]: "12px",
                  borderTop:    v==="top"    ? "1px solid rgba(129,140,248,.35)" : "none",
                  borderBottom: v==="bottom" ? "1px solid rgba(129,140,248,.35)" : "none",
                  borderLeft:   h==="left"   ? "1px solid rgba(129,140,248,.35)" : "none",
                  borderRight:  h==="right"  ? "1px solid rgba(129,140,248,.35)" : "none",
                }}
              />
            ))}

            <div className="px-7 pt-8 pb-7">

              <div className="lg:hidden flex justify-center mb-6">
                <HoloLogo size="lg"/>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-black text-white tracking-[-0.02em] mb-1" style={{ fontFamily: "Syne,sans-serif" }}>
                  Create your account
                </h2>
                <p className="text-sm text-white/40">Start trading in under 60 seconds — free forever.</p>
              </div>

              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-7">
                {STEPS.map((label, i) => (
                  <div key={label} className="flex items-center gap-2">
                    <StepDot n={i + 1} active={currentStep === i} done={step > i || (step === 1 && i === 0)}/>
                    <span className={`text-xs transition-colors ${
                      currentStep === i ? "text-white/75 font-medium" : step > i ? "text-emerald-400/60" : "text-white/22"
                    }`} style={{ fontFamily: "Space Mono,monospace" }}>
                      {label}
                    </span>
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-px mx-1 transition-all duration-500 ${step > i ? "bg-emerald-400/35" : "bg-white/[.07]"}`}
                        style={{ width: "20px" }}/>
                    )}
                  </div>
                ))}
              </div>

              {/* API error banner */}
              <AnimatePresence>
                {apiError && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="mb-5 overflow-hidden">
                    <div className="flex items-start gap-2.5 rounded-xl border border-red-400/22 bg-red-400/8 px-4 py-3">
                      <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5"/>
                      <p className="text-sm text-red-400">{apiError}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── STEP 1: Personal Info ── */}
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div key="step1"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: .25 }}
                    className="space-y-4"
                  >
                    {/* Full name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Full Name" icon={User} name="fullname" value={form.fullname}
                        placeholder="John Doe" onChange={handleChange}
                        onFocus={setFocused} onBlur={setFocused} focused={focused} error={localErrors.fullname}/>

                      <Field label="Email" icon={Mail} type="email" name="email" value={form.email}
                        placeholder="you@example.com" onChange={handleChange}
                        onFocus={setFocused} onBlur={setFocused} focused={focused} error={localErrors.email}/>
                    </div>

                    {/* Phone */}
                    <Field label="Phone Number" icon={Phone} name="phone" value={form.phone}
                      placeholder="080XXXXXXXX" onChange={handleChange}
                      onFocus={setFocused} onBlur={setFocused} focused={focused} error={localErrors.phone}/>

                    {/* Referral */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold tracking-[.07em] text-white/50 uppercase flex items-center gap-2"
                        style={{ fontFamily: "Space Mono,monospace" }}>
                        Referral Code
                        <span className="rounded-md bg-white/6 px-1.5 py-0.5 text-[9px] text-white/28 normal-case tracking-normal" style={{ fontFamily: "DM Sans,sans-serif" }}>
                          optional
                        </span>
                      </label>
                      <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                        focused === "referral"
                          ? "border-cyan-400/45 bg-cyan-400/4 shadow-[0_0_0_3px_rgba(34,211,238,0.07)]"
                          : "border-white/9 bg-white/3 hover:border-white/16"
                      }`}>
                        <Tag size={14} className={`absolute left-3.5 shrink-0 transition-colors ${focused === "referral" ? "text-cyan-400" : "text-white/25"}`}/>
                        <input type="text" value={form.referral} placeholder="Enter referral code"
                          onFocus={() => setFocused("referral")} onBlur={() => setFocused(null)}
                          onChange={e => handleChange("referral", e.target.value)}
                          className="w-full bg-transparent pl-9 pr-4 py-3 text-sm text-white placeholder:text-white/22 outline-none"/>
                        {form.referral && (
                          <div className="absolute right-3.5 flex items-center gap-1 rounded-md bg-emerald-400/12 border border-emerald-400/22 px-2 py-0.5">
                            <CheckCircle2 size={10} className="text-emerald-400"/>
                            <span className="text-[9px] text-emerald-400" style={{ fontFamily: "Space Mono,monospace" }}>APPLIED</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Next */}
                    <button type="button" onClick={handleNext}
                      className="group relative w-full overflow-hidden rounded-xl bg-linear-to-r from-cyan-500 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(99,102,241,0.4)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(99,102,241,0.55)] active:scale-[.98] font-[inherit]">
                      <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-[-18deg] bg-white/15"/>
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Continue <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5"/>
                      </span>
                    </button>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div key="step2"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: .25 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 rounded-xl border border-white/[.07] bg-white/3 px-4 py-3">
                      <CheckCircle2 size={15} className="text-emerald-400 shrink-0"/>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white/80 truncate">{form.fullname}</p>
                        <p className="text-xs text-white/35 truncate">{form.email} · {form.phone}</p>
                      </div>
                      <button type="button" onClick={() => setStep(0)}
                        className="ml-auto text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors shrink-0 font-[inherit]">
                        Edit
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-semibold tracking-[.07em] text-white/50 uppercase"
                        style={{ fontFamily: "Space Mono,monospace" }}>Password</label>
                      <div className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                        localErrors.password
                          ? "border-red-400/50 bg-red-400/5"
                          : focused === "password"
                            ? "border-cyan-400/45 bg-cyan-400/4 shadow-[0_0_0_3px_rgba(34,211,238,0.07)]"
                            : "border-white/9 bg-white/3 hover:border-white/16"
                      }`}>
                        <Lock size={14} className={`absolute left-3.5 shrink-0 transition-colors ${
                          localErrors.password ? "text-red-400" : focused === "password" ? "text-cyan-400" : "text-white/25"
                        }`}/>
                        <input type={showPass ? "text" : "password"} value={form.password}
                          placeholder="Create a strong password"
                          onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
                          onChange={e => handleChange("password", e.target.value)}
                          className="w-full bg-transparent pl-9 pr-12 py-3 text-sm text-white placeholder:text-white/22 outline-none"/>
                        <button type="button" onClick={() => setShowPass(p => !p)}
                          className="absolute right-3.5 text-white/28 hover:text-white/65 transition-colors">
                          {showPass ? <EyeOff size={14}/> : <Eye size={14}/>}
                        </button>
                      </div>

                      <AnimatePresence>
                        {form.password && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] text-white/30" style={{ fontFamily: "Space Mono,monospace" }}>Strength</span>
                              <span className={`text-[11px] font-bold ${strength.cx}`} style={{ fontFamily: "Space Mono,monospace" }}>{strength.label}</span>
                            </div>
                            <div className="flex gap-1">
                              {[33, 66, 100].map(thresh => (
                                <div key={thresh} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                  strength.pct >= thresh ? strength.bar : "bg-white/8"
                                }`}/>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {localErrors.password && (
                          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="flex items-center gap-1.5 pl-0.5 text-[11px] text-red-400">
                            <AlertCircle size={11} className="shrink-0"/>
                            {localErrors.password}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Password rules */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      {[
                        { rule: /^.{8,}$/,          label: "8+ characters"     },
                        { rule: /[A-Z]/,             label: "Uppercase letter"  },
                        { rule: /[0-9]/,             label: "One number"        },
                        { rule: /[^A-Za-z0-9]/,      label: "Special character" },
                      ].map(({ rule, label }) => {
                        const pass = rule.test(form.password);
                        return (
                          <div key={label} className="flex items-center gap-1.5">
                            <div className={`h-1.5 w-1.5 rounded-full shrink-0 transition-colors ${pass ? "bg-emerald-400" : "bg-white/15"}`}/>
                            <span className={`text-[11px] transition-colors ${pass ? "text-emerald-400/80" : "text-white/28"}`}>
                              {label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Terms notice */}
                    <p className="text-[11px] text-white/28 leading-relaxed">
                      By creating an account you agree to Xenra's{" "}
                      <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 transition-colors">Terms of Service</Link>
                      {" "}and{" "}
                      <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 transition-colors">Privacy Policy</Link>.
                    </p>

                    {/* Submit */}
                    <form onSubmit={handleSubmit}>
                      <motion.button type="submit" disabled={loading} whileTap={{ scale: loading ? 1 : 0.97 }}
                        className={`group relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2.5 font-[inherit] ${
                          loading
                            ? "bg-white/8 cursor-not-allowed text-white/40"
                            : "bg-linear-to-r from-indigo-500 to-purple-600 shadow-[0_4px_24px_rgba(129,140,248,0.4)] hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(129,140,248,0.55)]"
                        }`}>
                        {!loading && <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-[-18deg] bg-white/15"/>}
                        {loading
                          ? <><div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"/> Creating account...</>
                          : <><Star size={14}/> Create Free Account</>
                        }
                      </motion.button>
                    </form>

                    <button type="button" onClick={() => setStep(0)}
                      className="w-full text-sm text-white/30 hover:text-white/55 transition-colors font-[inherit]">
                      ← Back to personal info
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="mt-6 text-center text-sm text-white/35">
                Already have an account?{" "}
                <Link href="/auth/login" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-purple-400/35 to-transparent"/>
          </div>

          <div className="mt-5 flex items-center justify-center gap-5 flex-wrap">
            {[
              { icon: ShieldCheck, label: "Secure signup",   cx: "text-cyan-400"   },
              { icon: Zap,         label: "Instant access",  cx: "text-indigo-400" },
              { icon: Globe,       label: "CAC Approval",    cx: "text-purple-400" },
              { icon: Users,       label: "500K+ members",   cx: "text-emerald-400"},
            ].map(({ icon: Icon, label, cx }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon size={11} className={cx}/>
                <span className="text-[10px] text-white/22 tracking-[.04em]" style={{ fontFamily: "Space Mono,monospace" }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}