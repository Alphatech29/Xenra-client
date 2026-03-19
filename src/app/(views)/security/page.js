"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck, Lock, Zap, Eye,
  CheckCircle2, ArrowRight, ChevronRight, Globe,
} from "lucide-react";

const SECURITY_FEATURES = [
  {
    icon: ShieldCheck,
    title: "AES-256 Encryption",
    desc: "Every request is encrypted end-to-end with AES-256 and TLS 1.3. Your data is never stored in plain text.",
    cx: "text-cyan-400", border: "border-cyan-400/20", bg: "bg-cyan-400/[.07]",
  },
  {
    icon: Lock,
    title: "Two-Factor Authentication",
    desc: "Protect your account with biometric, TOTP app, or SMS 2FA. Always enforced on withdrawals.",
    cx: "text-indigo-400", border: "border-indigo-400/20", bg: "bg-indigo-400/[.07]",
  },
  {
    icon: ShieldCheck,
    title: "CBN Licensed & Regulated",
    desc: "Fully licensed by the Central Bank of Nigeria. Compliant with AML, KYC, and NDIC deposit protection.",
    cx: "text-purple-400", border: "border-purple-400/20", bg: "bg-purple-400/[.07]",
  },
  {
    icon: Zap,
    title: "AI Fraud Detection",
    desc: "Real-time machine learning flags suspicious transactions before they affect your balance — 24/7.",
    cx: "text-emerald-400", border: "border-emerald-400/20", bg: "bg-emerald-400/[.07]",
  },
];

const BADGES = [
  { label: "CBN Licensed"   },
  { label: "ISO 27001"      },
  { label: "PCI DSS"        },
  { label: "SOC 2 Type II"  },
  { label: "NDIC Insured"   },
];

const COMPLIANCE_POINTS = [
  "Zero unauthorized transaction guarantee",
  "Instant card freeze & account lock",
  "NDIC-insured wallet balances",
  "Biometric login support",
  "Dedicated 24/7 fraud response team",
  "Regular third-party security audits",
];

export default function TrustSecurity() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400&family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        .ts        { font-family:'DM Sans',sans-serif; }
        .ts-syne   { font-family:'Syne',sans-serif; }
        .ts-mono   { font-family:'Space Mono',monospace; }

        @keyframes ts-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes ts-pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.15;transform:scale(.55)} }
        @keyframes ts-scan    { 0%{top:-2px} 100%{top:110%} }
        @keyframes ts-sweep   { from{transform:translateX(-110%) skewX(-18deg)} to{transform:translateX(110%) skewX(-18deg)} }
        @keyframes ts-shield  { 0%,100%{transform:scale(1);opacity:.08} 50%{transform:scale(1.06);opacity:.13} }

        .ts-shimmer {
          background:linear-gradient(90deg,#22d3ee 0%,#e0e7ff 28%,#818cf8 52%,#a855f7 78%,#22d3ee 100%);
          background-size:250% auto;
          -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;
          animation:ts-shimmer 5s linear infinite;
        }
        .ts-blink  { animation:ts-pulse 1.4s ease-in-out infinite; }
        .ts-scan   { animation:ts-scan 9s ease-in-out infinite; }
        .ts-cta:hover .ts-sweep { animation:ts-sweep .55s ease-out forwards; }
        .ts-shield-bg { animation:ts-shield 5s ease-in-out infinite; }
        .ts-card   { transition:transform .2s ease,border-color .2s ease; }
        .ts-card:hover { transform:translateY(-3px); }
      `}</style>

      <section className="ts relative overflow-hidden bg-[#000820] text-white/70">

        <div className="pointer-events-none absolute inset-0 -z-10">
          <svg width="100%" height="100%" className="absolute inset-0 opacity-[.04]">
            <defs>
              <pattern id="tshex" width="56" height="48.5" patternUnits="userSpaceOnUse">
                <polygon points="28,2 52,14 52,38 28,50 4,38 4,14" fill="none" stroke="#22d3ee" strokeWidth=".5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tshex)"/>
          </svg>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-125 bg-[radial-gradient(ellipse,rgba(34,211,238,0.06)_0%,transparent_70%)]"/>
          <div className="absolute bottom-0 right-0 w-150 h-100 bg-[radial-gradient(ellipse,rgba(129,140,248,0.06)_0%,transparent_70%)]"/>
          <div className="absolute bottom-0 left-0 w-100 h-75 bg-[radial-gradient(ellipse,rgba(168,85,247,0.05)_0%,transparent_70%)]"/>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(0,0,0,0.04)_3px,rgba(0,0,0,0.04)_4px)]"/>
          <div className="ts-scan absolute left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.1),transparent)]"/>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start mb-20 lg:mb-28">
            <motion.div
              initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="mb-12 lg:mb-0"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5">
                <Lock size={11} className="text-cyan-400"/>
                <span className="ts-mono text-[11px] tracking-widest text-white/40 uppercase">Security & Trust</span>
              </div>

              <h2 className="ts-syne text-[clamp(28px,4vw,48px)] font-extrabold leading-tight tracking-[-0.03em] text-white mb-5">
                Built on trust.
                <br /><span className="ts-shimmer">Secured by design.</span>
              </h2>

              <p className="text-base text-white/38 leading-relaxed mb-8 max-w-md">
                Every transaction on Xenra is protected by multiple layers of enterprise-grade security. We are licensed, regularly audited, and exceed every industry standard.
              </p>

              <div className="flex flex-wrap gap-2.5 mb-8">
                {BADGES.map((b) => (
                  <div key={b.label} className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/3 px-3.5 py-2">
                    <ShieldCheck size={11} className="text-cyan-400"/>
                    <span className="ts-mono text-[10px] text-white/45 tracking-[.05em]">{b.label}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {COMPLIANCE_POINTS.map((p) => (
                  <div key={p} className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5"/>
                    <span className="text-sm text-white/48">{p}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SECURITY_FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .09 }}
                    className={`ts-card rounded-2xl border ${f.border} ${f.bg} p-5`}
                  >
                    <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border ${f.border}`}
                      style={{ background: `${f.bg.replace("[.07]","[.12]")}` }}>
                      <Icon size={20} className={f.cx}/>
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-2">{f.title}</h4>
                    <p className="text-xs text-white/38 leading-relaxed">{f.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-3xl border border-white/[.07] overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-cyan-500/8 via-indigo-600/10 to-purple-600/8"/>
            <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(0,0,0,0.04)_3px,rgba(0,0,0,0.04)_4px)]"/>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <ShieldCheck
                size={320}
                className="ts-shield-bg text-cyan-400"
              />
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-cyan-400/50 to-transparent"/>

            <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-14 sm:py-20 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/3 px-4 py-1.5">
                <span className="ts-blink inline-block h-1.25 w-1.25 rounded-full bg-cyan-400"/>
                <span className="ts-mono text-[10px] tracking-widest text-white/32 uppercase">Ready to join 500,000+ users?</span>
              </div>

              <h3 className="ts-syne text-[clamp(26px,4.5vw,52px)] font-extrabold text-white leading-tight tracking-[-0.03em] max-w-2xl">
                Start transacting
                <br /><span className="ts-shimmer">across the globe today.</span>
              </h3>

              <p className="text-base text-white/38 max-w-md leading-relaxed">
                Free to sign up. No credit card required. Everything you need to send, receive, trade, and spend money globally.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm sm:max-w-none sm:w-auto">
                <button className="ts-cta group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-500 to-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-[0_4px_28px_rgba(99,102,241,0.42)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_36px_rgba(99,102,241,0.58)] w-full sm:w-auto">
                  <span className="ts-sweep pointer-events-none absolute inset-0 bg-white/20"/>
                  <span className="relative z-10 flex items-center gap-2">
                    Create Free Account
                    <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5"/>
                  </span>
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/4 px-7 py-4 text-sm font-medium text-white/55 hover:bg-white/8 hover:text-white transition-all duration-200 w-full sm:w-auto">
                  See How It Works <ChevronRight size={15}/>
                </button>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap items-center justify-center gap-5 pt-1">
                {[
                  { icon: ShieldCheck, label: "Bank-grade security",  cx: "text-cyan-400"   },
                  { icon: Zap,         label: "Instant settlement",   cx: "text-indigo-400" },
                  { icon: Globe,       label: "150+ countries",       cx: "text-purple-400" },
                ].map(({ icon: Icon, label, cx }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon size={12} className={cx}/>
                    <span className="ts-mono text-[10px] text-white/25 tracking-[.05em]">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-indigo-400/40 to-transparent"/>
            <div className="h-px mt-px bg-linear-to-r from-transparent via-purple-400/22 to-transparent"/>
          </motion.div>
        </div>
      </section>
    </>
  );
}
