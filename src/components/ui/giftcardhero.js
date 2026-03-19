"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Gift, ArrowRight, ShieldCheck,
  Zap, Star, TrendingUp, ArrowUpRight,
} from "lucide-react";

const BRAND_CARDS = [
  {
    brand: "Amazon",  abbr: "AMZ", amount: "$100", rate: "₦95,000",
    color: "#f59e0b", shadow: "rgba(245,158,11,0.22)",
    pos: { top: "8%",  left: "5%"  }, angle: -6, delay: 0.15,
  },
  {
    brand: "iTunes",  abbr: "iTN", amount: "$50",  rate: "₦46,500",
    color: "#818cf8", shadow: "rgba(129,140,248,0.22)",
    pos: { top: "5%",  right: "8%" }, angle: 5,  delay: 0.25,
  },
  {
    brand: "Steam",   abbr: "STM", amount: "$25",  rate: "₦23,750",
    color: "#22d3ee", shadow: "rgba(34,211,238,0.22)",
    pos: { bottom: "18%", left: "2%"  }, angle: -4, delay: 0.35,
  },
  {
    brand: "Netflix", abbr: "NFX", amount: "$15",  rate: "₦13,800",
    color: "#f87171", shadow: "rgba(248,113,113,0.22)",
    pos: { bottom: "20%", right: "4%" }, angle: 7,  delay: 0.45,
  },
  {
    brand: "Google",  abbr: "GP",  amount: "$200", rate: "₦184,000",
    color: "#34d399", shadow: "rgba(52,211,153,0.22)",
    pos: { top: "42%", right: "1%" }, angle: -3, delay: 0.55,
  },
];

const TICKER = [
  "Amazon $100 → ₦95,000 ↑",    "iTunes $50 → ₦46,500 ↑",
  "Steam $25 → ₦23,750 ↑",      "Netflix $15 → ₦13,800 ↑",
  "Google Play $200 → ₦184,000 ↑", "Xbox $50 → ₦46,000 ↑",
  "eBay $100 → ₦90,000 ↑",      "Walmart $25 → ₦23,500 ↑",
  "Spotify $30 → ₦27,600 ↑",    "Nike $100 → ₦93,000 ↑",
];

const TRUST = [
  { icon: ShieldCheck, label: "Instant verification",  cx: "text-cyan-400"   },
  { icon: Zap,         label: "Payout in ~30 seconds", cx: "text-indigo-400" },
  { icon: Star,        label: "Best rates guaranteed", cx: "text-purple-400" },
  { icon: TrendingUp,  label: "200+ card brands",      cx: "text-emerald-400"},
];

const STATS = [
  { val: "200+",   label: "Card Brands",    cx: "text-indigo-400", glow: "rgba(129,140,248,0.15)" },
  { val: "₦4.8B+", label: "Total Paid Out", cx: "text-cyan-400",   glow: "rgba(34,211,238,0.15)"  },
  { val: "~30s",   label: "Avg. Payout",   cx: "text-purple-400", glow: "rgba(168,85,247,0.15)"  },
  { val: "95%",    label: "Rate Score",     cx: "text-emerald-400",glow: "rgba(52,211,153,0.15)"  },
];

function BrandCard({ card, floatClass }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.65, rotate: card.angle }}
      animate={{ opacity: 1, scale: 1,    rotate: card.angle }}
      transition={{ delay: card.delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute ${floatClass}`}
      style={{ ...card.pos }}
    >
      <div
        className="w-32 sm:w-37 rounded-2xl overflow-hidden border border-white/12"
        style={{
          background: `linear-gradient(145deg, ${card.color}1a, rgba(0,8,40,.96))`,
          boxShadow: `0 16px 48px rgba(0,0,0,.6), 0 0 28px ${card.shadow}`,
        }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-3.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10"
              style={{ background: `${card.color}22` }}
            >
              <span className="gc-mono text-[9px] font-bold" style={{ color: card.color }}>{card.abbr}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="gc-mono text-[8px] text-white/25 tracking-[.08em]">GIFT</span>
            </div>
          </div>
          <p className="gc-syne text-[13px] font-bold text-white leading-none mb-0.5">{card.brand}</p>
          <p className="gc-mono text-[10px] text-white/38">{card.amount}</p>

          <div className="mt-3 pt-3 border-t border-white/[.07]">
            <div className="flex items-center justify-between">
              <p className="gc-syne text-xs font-extrabold" style={{ color: card.color }}>{card.rate}</p>
              <div className="flex items-center gap-0.5">
                <span className="text-[8px] text-emerald-400">✓</span>
                <span className="gc-mono text-[8px] text-emerald-400/70">Best</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${card.color}88, transparent)` }}/>
      </div>
    </motion.div>
  );
}

export default function GiftCardHero() {
  const [count, setCount]     = useState(0);
  const [txCount, setTxCount] = useState(1_284_531);
  const intervalRef           = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setCount(c => (c < 95 ? c + 1 : c)), 16);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTxCount(c => c + Math.floor(Math.random() * 3 + 1));
    }, 1800);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        .gc        { font-family:'DM Sans',sans-serif; }
        .gc-syne   { font-family:'Syne',sans-serif; }
        .gc-mono   { font-family:'Space Mono',monospace; }
      `}</style>

      <section className="gc relative overflow-hidden bg-[#000c42] text-white/70">

        <div className="pointer-events-none absolute inset-0 -z-10">
          <svg width="100%" height="100%" className="absolute inset-0 opacity-[.05]">
            <defs>
              <pattern id="gcHex" width="56" height="48.5" patternUnits="userSpaceOnUse">
                <polygon points="28,2 52,14 52,38 28,50 4,38 4,14"
                  fill="none" stroke="#818cf8" strokeWidth=".55"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gcHex)"/>
          </svg>

          <div className="gc-noise absolute inset-0 opacity-[.35]"/>

          <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-250 h-175 rounded-full bg-[radial-gradient(ellipse,rgba(129,140,248,0.11)_0%,transparent_65%)]"/>
          <div className="absolute -bottom-40 -left-28 w-162.5 h-137.5 rounded-full bg-[radial-gradient(ellipse,rgba(34,211,238,0.07)_0%,transparent_70%)]"/>
          <div className="absolute -bottom-40 -right-28 w-137.5 h-112.5 rounded-full bg-[radial-gradient(ellipse,rgba(168,85,247,0.07)_0%,transparent_70%)]"/>

          <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(0,0,0,0.045)_3px,rgba(0,0,0,0.045)_4px)]"/>

          <div className="gc-scan absolute left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,rgba(129,140,248,0.18),transparent)]"/>
        </div>

        <div className="relative z-10 overflow-hidden border-b border-indigo-400/12 bg-[#000820]/85 py-1.5">
          <div className="flex gc-ticker w-max">
            {[...TICKER, ...TICKER].map((item, i) => (
              <span
                key={i}
                className="gc-mono inline-flex items-center gap-2 whitespace-nowrap border-r border-indigo-400/10 px-6 text-[11px]"
              >
                <span className="inline-block h-1 w-1 rounded-full bg-emerald-400 opacity-70"/>
                <span className="text-emerald-400/75">{item}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-22 lg:pt-28 pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">

              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-indigo-400/22 bg-indigo-400/6 px-4 py-1.5"
              >
                <Gift size={13} className="text-indigo-400 shrink-0"/>
                <span className="gc-mono text-[11px] tracking-widest text-white/45 uppercase">Gift Card Exchange</span>
                <span className="h-3 w-px bg-white/12"/>
                <span className="gc-blink inline-block h-1.25 w-1.25 rounded-full bg-indigo-400"/>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }}
                className="gc-syne gc-headline font-extrabold leading-[1.01] tracking-[-0.038em] mb-6"
                style={{ fontSize: "clamp(42px,7vw,82px)" }}
              >
                <span className="gc-glitch block text-white" data-text="Trade Gift">Trade Gift</span>
                <span className="block" style={{ color: "rgba(255,255,255,.65)", fontWeight: 700 }}>Cards for</span>
                <span className="gc-shimmer-text block italic">Instant Cash.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .17 }}
                className="text-base sm:text-[17px] leading-[1.78] text-white/42 max-w-115 mb-8"
              >
                Sell or buy Amazon, iTunes, Steam, Google Play and 200+ gift card brands at the best rates in Nigeria.
                Verified in seconds, paid instantly — zero hidden fees.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25 }}
                className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-10"
              >
                <button className="gc-cta group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 px-7 py-3.5 text-[14px] font-semibold text-white shadow-[0_4px_28px_rgba(129,140,248,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(129,140,248,0.6)] active:scale-[.98] w-full sm:w-auto">
                  <span className="gc-sweep pointer-events-none absolute inset-0 bg-white/22"/>
                  <span className="relative z-10 flex items-center gap-2">
                    Sell Gift Card
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5"/>
                  </span>
                </button>

                <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/11 bg-white/4 px-7 py-3.5 text-[14px] font-medium text-white/55 hover:bg-white/8 hover:border-white/18 hover:text-white transition-all duration-200 active:scale-[.98] w-full sm:w-auto">
                  <Gift size={14}/>
                  Buy Gift Card
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .34 }}
                className="w-full max-w-100 lg:max-w-none mb-8"
              >
                <div
                  className="rounded-2xl border border-indigo-400/18 px-5 py-4"
                  style={{ background: "rgba(0,8,40,.75)", backdropFilter: "blur(20px)" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={12} className="text-indigo-400"/>
                      <span className="gc-mono text-[10px] text-white/30 tracking-widest uppercase">Amazon $100 Payout Rate</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="gc-syne text-xl font-extrabold text-indigo-400 leading-none">{count}</span>
                      <span className="gc-mono text-sm text-indigo-400/70">%</span>
                    </div>
                  </div>
                  <div className="relative h-2 rounded-full bg-white/6 overflow-hidden">
                    <div
                      className="gc-bar absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: `${count}%`,
                        background: "linear-gradient(90deg,#818cf8,#a855f7)",
                        boxShadow: "0 0 12px rgba(129,140,248,.6)",
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2.5">
                    <span className="gc-mono text-[10px] text-white/20">1 USD = ₦950</span>
                    <span className="gc-mono text-[10px] text-emerald-400">Best rate in market ✓</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .42 }}
                className="grid grid-cols-2 gap-x-6 gap-y-2.5 w-full max-w-100 sm:max-w-none"
              >
                {TRUST.map(({ icon: Icon, label, cx }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon size={13} className={`${cx} shrink-0`}/>
                    <span className="text-xs text-white/38">{label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .1, duration: .7 }}
              className="gc-vis relative flex items-center justify-center"
              style={{ minHeight: "480px" }}
            >

              {BRAND_CARDS.map((card, i) => (
                <BrandCard
                  key={card.brand}
                  card={card}
                  floatClass={`gc-f${i}`}
                />
              ))}

              <div className="relative z-20">
                <motion.div
                  initial={{ opacity: 0, scale: .8, y: 20 }}
                  animate={{ opacity: 1, scale: 1,  y: 0  }}
                  transition={{ delay: .2, duration: .7, ease: [0.22, 1, 0.36, 1] }}
                >

                  <div
                    className="absolute -inset-6 rounded-[40px] pointer-events-none"
                    style={{ background: "radial-gradient(ellipse,rgba(129,140,248,0.12) 0%,transparent 70%)" }}
                  />

                  <div
                    className="relative rounded-3xl border border-white/10 p-7 overflow-hidden"
                    style={{
                      width: "220px",
                      background: "linear-gradient(150deg,rgba(129,140,248,0.14) 0%,rgba(0,8,40,.97) 100%)",
                      boxShadow: "0 40px 100px rgba(0,0,0,.75), 0 0 0 1px rgba(129,140,248,.1), inset 0 1px 0 rgba(255,255,255,.07)",
                    }}
                  >

                    <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(0,0,0,0.03)_3px,rgba(0,0,0,0.03)_4px)] rounded-3xl"/>

                    <div className="relative mb-5" style={{ borderRadius: "15px", width: "fit-content" }}>
                      <div className="gc-ring" style={{ borderRadius: "15px" }}/>
                      <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-[15px] bg-linear-to-br from-indigo-400 to-purple-600 shadow-[0_4px_16px_rgba(129,140,248,0.4)]">
                        <Gift size={20} className="text-white"/>
                      </div>
                    </div>

                    <p className="gc-mono text-[10px] text-white/28 tracking-[.12em] uppercase mb-1.5">Total Paid Out</p>
                    <p className="gc-syne text-[28px] font-extrabold text-indigo-400 leading-none mb-1" style={{ textShadow: "0 0 32px rgba(129,140,248,.4)" }}>
                      ₦4.8B+
                    </p>
                    <p className="gc-mono text-[10px] text-white/24 mb-5">to 500K+ traders</p>

                    <div className="rounded-xl border border-white/[.07] bg-white/3 px-3.5 py-3 mb-4">
                      <p className="gc-mono text-[9px] text-white/25 tracking-widest uppercase mb-1">Live Transactions</p>
                      <p className="gc-syne text-base font-extrabold text-white">
                        {txCount.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="gc-blink inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"/>
                      <span className="gc-mono text-[9px] text-emerald-400 tracking-widest">SYSTEM LIVE</span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-indigo-400/60 to-transparent"/>
                  </div>
                </motion.div>
              </div>

              <div
                className="pointer-events-none absolute rounded-full border border-dashed border-white/5"
                style={{ width: "380px", height: "380px", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
              />
              <div
                className="pointer-events-none absolute rounded-full border border-dashed border-white/3"
                style={{ width: "520px", height: "520px", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
              />
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .55, duration: .6 }}
            className="rounded-t-2xl border-x border-t border-white/6 overflow-hidden"
            style={{ background: "rgba(0,6,32,.88)", backdropFilter: "blur(24px)" }}
          >
            <div className="h-px bg-linear-to-r from-transparent via-indigo-400/50 to-transparent"/>

            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-white/5">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .6 + i * .07 }}
                  className="gc-stat relative flex flex-col items-center py-7 sm:py-8 px-4 gap-1.5"
                  style={{ "--sl": s.glow }}
                >
                  {/* Glow dot */}
                  <div className="absolute top-4 right-4">
                    <ArrowUpRight size={11} className={`${s.cx} opacity-30`}/>
                  </div>

                  <span className={`gc-syne text-2xl sm:text-[30px] font-extrabold ${s.cx} leading-none`}>
                    {s.val}
                  </span>
                  <span className="gc-mono text-[10px] text-white/28 tracking-widest uppercase">
                    {s.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
