"use client";

import { motion } from "framer-motion";
import {
  UserCheck, Wallet, ArrowLeftRight, Banknote,
  Zap, ArrowRight, ChevronRight,
} from "lucide-react";

const STEPS = [
  {
    n: "01",
    icon: UserCheck,
    title: "Create Account",
    desc: "Sign up in 60 seconds. Verify your identity with BVN or NIN and you're ready to go — no queues, no paperwork.",
    cx: "text-cyan-400",
    border: "border-cyan-400/22",
    bg: "bg-cyan-400/[.07]",
    iconBg: "bg-cyan-400/[.12]",
    color: "#22d3ee",
  },
  {
    n: "02",
    icon: Wallet,
    title: "Fund Your Wallet",
    desc: "Top up via bank transfer, debit card, or crypto. Funds reflect instantly. Hold NGN and USD side by side.",
    cx: "text-indigo-400",
    border: "border-indigo-400/22",
    bg: "bg-indigo-400/[.07]",
    iconBg: "bg-indigo-400/[.12]",
    color: "#818cf8",
  },
  {
    n: "03",
    icon: ArrowLeftRight,
    title: "Trade & Transact",
    desc: "Sell gift cards, swap crypto, pay electricity, cable TV, buy airtime and data — everything in one app.",
    cx: "text-purple-400",
    border: "border-purple-400/22",
    bg: "bg-purple-400/[.07]",
    iconBg: "bg-purple-400/[.12]",
    color: "#a855f7",
  },
  {
    n: "04",
    icon: Banknote,
    title: "Withdraw Instantly",
    desc: "Cash out to any Nigerian bank account in under 2 seconds. No waiting, no hidden fees, no limits on payouts.",
    cx: "text-emerald-400",
    border: "border-emerald-400/22",
    bg: "bg-emerald-400/[.07]",
    iconBg: "bg-emerald-400/[.12]",
    color: "#34d399",
  },
];

const STATS = [
  { val: "₦18B+",  label: "Total Volume Processed", cx: "text-cyan-400"   },
  { val: "500K+",  label: "Active Users",            cx: "text-indigo-400" },
  { val: "99.98%", label: "Platform Uptime",         cx: "text-purple-400" },
  { val: "<2s",    label: "Avg. Settlement Time",    cx: "text-emerald-400"},
];

export default function HowItWorks() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400&family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        .hw        { font-family:'DM Sans',sans-serif; }
        .hw-syne   { font-family:'Syne',sans-serif; }
        .hw-mono   { font-family:'Space Mono',monospace; }

        @keyframes hw-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes hw-pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.15;transform:scale(.55)} }
        @keyframes hw-scan    { 0%{top:-2px} 100%{top:110%} }
        @keyframes hw-sweep   { from{transform:translateX(-110%) skewX(-18deg)} to{transform:translateX(110%) skewX(-18deg)} }
        @keyframes hw-pop     { 0%{transform:scale(.9);opacity:0} 100%{transform:scale(1);opacity:1} }

        .hw-shimmer {
          background:linear-gradient(90deg,#22d3ee 0%,#e0e7ff 28%,#818cf8 52%,#a855f7 78%,#22d3ee 100%);
          background-size:250% auto;
          -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;
          animation:hw-shimmer 5s linear infinite;
        }
        .hw-blink  { animation:hw-pulse 1.4s ease-in-out infinite; }
        .hw-scan   { animation:hw-scan 9s ease-in-out infinite; }
        .hw-cta:hover .hw-sweep { animation:hw-sweep .55s ease-out forwards; }
        .hw-step   { transition:transform .22s ease,box-shadow .22s ease; }
        .hw-step:hover { transform:translateY(-4px); }
      `}</style>

      <section className="hw relative overflow-hidden bg-[#000c42] text-white/70">

        <div className="pointer-events-none absolute inset-0 -z-10">
          <svg width="100%" height="100%" className="absolute inset-0 opacity-[.04]">
            <defs>
              <pattern id="hwhex" width="56" height="48.5" patternUnits="userSpaceOnUse">
                <polygon points="28,2 52,14 52,38 28,50 4,38 4,14" fill="none" stroke="#22d3ee" strokeWidth=".5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hwhex)"/>
          </svg>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-100 bg-[radial-gradient(ellipse,rgba(34,211,238,0.06)_0%,transparent_70%)]"/>
          <div className="absolute bottom-0 right-0 w-150 h-100 bg-[radial-gradient(ellipse,rgba(168,85,247,0.06)_0%,transparent_70%)]"/>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(0,0,0,0.04)_3px,rgba(0,0,0,0.04)_4px)]"/>
          <div className="hw-scan absolute left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.1),transparent)]"/>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center mb-16 lg:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-1.5"
            >
              <Zap size={11} className="text-emerald-400"/>
              <span className="hw-mono text-[11px] tracking-widest text-white/40 uppercase">Get Started in Minutes</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .1 }}
              className="hw-syne text-[clamp(30px,4.8vw,54px)] font-extrabold leading-tight tracking-[-0.03em] text-white mb-4"
            >
              Up and running
              <br /><span className="hw-shimmer">in four simple steps.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .2 }}
              className="mx-auto max-w-xl text-base sm:text-lg text-white/38 leading-relaxed"
            >
              No experience needed. Xenra is designed to be simple for everyone — from first-time users to power traders.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`hw-step relative rounded-2xl border ${s.border} ${s.bg} p-6 overflow-hidden`}
                >
                  <span
                    className="hw-syne absolute -top-3 -right-1 text-[80px] font-extrabold leading-none select-none pointer-events-none"
                    style={{ color: `${s.color}08` }}
                  >
                    {s.n}
                  </span>
                  <div
                    className={`relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border ${s.border} ${s.iconBg}`}
                  >
                    <Icon size={22} style={{ color: s.color }}/>
                  </div>

                  <div className="relative z-10 mb-3">
                    <span
                      className="hw-mono text-[10px] px-2 py-0.5 rounded-md tracking-[.08em]"
                      style={{ background: `${s.color}18`, color: s.color }}
                    >
                      Step {s.n}
                    </span>
                  </div>

                  <h3 className="hw-syne relative z-10 text-lg font-bold text-white mb-2 tracking-[-0.01em]">
                    {s.title}
                  </h3>
                  <p className="relative z-10 text-sm text-white/40 leading-relaxed">{s.desc}</p>

                  {i < 3 && (
                    <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#000c42]">
                      <ChevronRight size={12} className="text-white/30"/>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .35 }}
            className="flex justify-center mb-20 lg:mb-28"
          >
            <button className="hw-cta group relative overflow-hidden inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-cyan-500 to-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-[0_4px_28px_rgba(99,102,241,0.38)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_36px_rgba(99,102,241,0.55)]">
              <span className="hw-sweep pointer-events-none absolute inset-0 bg-white/20"/>
              <span className="relative z-10 flex items-center gap-2">
                Create Free Account <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5"/>
              </span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl border border-white/[.07] overflow-hidden"
            style={{ background: "rgba(0,6,32,.85)", backdropFilter: "blur(20px)" }}
          >
            <div className="h-px bg-linear-to-r from-transparent via-cyan-400/45 to-transparent"/>

            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/6">
              {STATS.map((st, i) => (
                <motion.div
                  key={st.label}
                  initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .08 }}
                  className="flex flex-col items-center justify-center py-8 sm:py-10 px-4 gap-2"
                >
                  <span className={`hw-syne text-3xl sm:text-4xl font-extrabold ${st.cx} leading-none`}>
                    {st.val}
                  </span>
                  <span className="hw-mono text-[10px] text-white/28 tracking-widest uppercase text-center">
                    {st.label}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-indigo-400/30 to-transparent"/>
          </motion.div>
        </div>
      </section>
    </>
  );
}
