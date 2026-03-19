"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift, ArrowRight, CheckCircle2, ChevronDown,
  ShieldCheck, Zap, Clock, Star,
} from "lucide-react";

/* ─── Data ──────────────────────────────────────────────────────────── */
const BRANDS = [
  { name: "Amazon",      abbr: "AMZ", color: "#f59e0b", category: "Shopping",      rates: { 25: 940, 50: 945, 100: 950, 200: 952, 500: 955 } },
  { name: "iTunes",      abbr: "iTN", color: "#818cf8", category: "Entertainment", rates: { 25: 920, 50: 925, 100: 930, 200: 932, 500: 935 } },
  { name: "Steam",       abbr: "STM", color: "#22d3ee", category: "Gaming",        rates: { 25: 935, 50: 938, 100: 940, 200: 942, 500: 945 } },
  { name: "Google Play", abbr: "GP",  color: "#34d399", category: "App Store",     rates: { 25: 910, 50: 915, 100: 920, 200: 922, 500: 925 } },
  { name: "Netflix",     abbr: "NFX", color: "#f87171", category: "Streaming",     rates: { 25: 905, 50: 908, 100: 910, 200: 912, 500: 915 } },
  { name: "Xbox",        abbr: "XBX", color: "#34d399", category: "Gaming",        rates: { 25: 930, 50: 935, 100: 945, 200: 947, 500: 950 } },
  { name: "eBay",        abbr: "EBY", color: "#f59e0b", category: "Shopping",      rates: { 25: 895, 50: 898, 100: 900, 200: 902, 500: 905 } },
  { name: "Walmart",     abbr: "WMT", color: "#22d3ee", category: "Shopping",      rates: { 25: 930, 50: 933, 100: 935, 200: 937, 500: 940 } },
  { name: "Sephora",     abbr: "SPH", color: "#f87171", category: "Beauty",        rates: { 25: 920, 50: 923, 100: 925, 200: 927, 500: 930 } },
  { name: "Nike",        abbr: "NKE", color: "#818cf8", category: "Fashion",       rates: { 25: 925, 50: 928, 100: 930, 200: 932, 500: 935 } },
  { name: "Spotify",     abbr: "SPT", color: "#34d399", category: "Music",         rates: { 25: 918, 50: 920, 100: 923, 200: 925, 500: 928 } },
  { name: "Razer Gold",  abbr: "RZR", color: "#22d3ee", category: "Gaming",        rates: { 25: 928, 50: 932, 100: 938, 200: 940, 500: 943 } },
];

const AMOUNTS = [25, 50, 100, 200, 500];
const CATEGORIES = ["All", "Shopping", "Gaming", "Entertainment", "Streaming", "App Store", "Fashion", "Beauty", "Music"];

const HOW_STEPS = [
  { n: "01", label: "Pick your brand",     desc: "Choose from 200+ supported card brands."     },
  { n: "02", label: "Enter card details",  desc: "Input the card value and upload the card code." },
  { n: "03", label: "Auto-verification",   desc: "Our system verifies the card in seconds."     },
  { n: "04", label: "Receive payment",     desc: "Cash hits your Xenra wallet instantly."       },
];

/* ─── Component ─────────────────────────────────────────────────────── */
export default function SellGiftCard() {
  const [brand,    setBrand]    = useState(BRANDS[0]);
  const [amount,   setAmount]   = useState(100);
  const [category, setCategory] = useState("All");
  const [step,     setStep]     = useState(1); // 1 = select, 2 = confirm

  const rate    = brand.rates[amount];
  const payout  = (amount * rate).toLocaleString();
  const pct     = Math.round((rate / 1000) * 100);

  const filtered = category === "All" ? BRANDS : BRANDS.filter(b => b.category === category);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        .sgc        { font-family:'DM Sans',sans-serif; }
        .sgc-syne   { font-family:'Syne',sans-serif; }
        .sgc-mono   { font-family:'Space Mono',monospace; }

        @keyframes sgc-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes sgc-pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.15;transform:scale(.55)} }
        @keyframes sgc-scan    { 0%{top:-2px} 100%{top:110%} }
        @keyframes sgc-sweep   { from{transform:translateX(-110%) skewX(-18deg)} to{transform:translateX(110%) skewX(-18deg)} }

        .sgc-shimmer {
          background:linear-gradient(90deg,#22d3ee 0%,#e0e7ff 28%,#818cf8 52%,#a855f7 78%,#22d3ee 100%);
          background-size:250% auto;
          -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;
          animation:sgc-shimmer 5s linear infinite;
        }
        .sgc-blink   { animation:sgc-pulse 1.4s ease-in-out infinite; }
        .sgc-scan    { animation:sgc-scan 9s ease-in-out infinite; }
        .sgc-cta:hover .sgc-sweep { animation:sgc-sweep .55s ease-out forwards; }
        .sgc-brand   { transition:all .18s ease; }
        .sgc-brand:hover { transform:translateY(-2px); }
        .sgc-amount  { transition:all .15s ease; }
      `}</style>

      <section className="sgc relative overflow-hidden bg-[#000820] text-white/70">

        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <svg width="100%" height="100%" className="absolute inset-0 opacity-[.04]">
            <defs>
              <pattern id="sgchex" width="56" height="48.5" patternUnits="userSpaceOnUse">
                <polygon points="28,2 52,14 52,38 28,50 4,38 4,14" fill="none" stroke="#818cf8" strokeWidth=".5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sgchex)"/>
          </svg>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-125 bg-[radial-gradient(ellipse,rgba(129,140,248,0.08)_0%,transparent_70%)]"/>
          <div className="absolute bottom-0 left-0 w-125 h-100 bg-[radial-gradient(ellipse,rgba(168,85,247,0.06)_0%,transparent_70%)]"/>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(0,0,0,0.04)_3px,rgba(0,0,0,0.04)_4px)]"/>
          <div className="sgc-scan absolute left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,rgba(129,140,248,0.12),transparent)]"/>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">

          {/* Header */}
          <div className="text-center mb-14">
            <motion.div initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/6 px-4 py-1.5">
              <Gift size={11} className="text-indigo-400"/>
              <span className="sgc-mono text-[11px] tracking-widest text-white/40 uppercase">Sell Gift Cards</span>
            </motion.div>
            <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:.1 }}
              className="sgc-syne text-[clamp(28px,4.5vw,52px)] font-extrabold leading-tight tracking-[-0.03em] text-white mb-4">
              Turn gift cards<br/><span className="sgc-shimmer">into instant cash.</span>
            </motion.h2>
            <motion.p initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:.2 }}
              className="mx-auto max-w-lg text-base sm:text-lg text-white/38 leading-relaxed">
              Select your brand, enter the card value, get the best rate — cash in your wallet in under 30 seconds.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            <div className="lg:col-span-3 space-y-5">
              <motion.div initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                className="rounded-2xl border border-white/[.07] bg-[#000c42]/80 backdrop-blur-xl p-5">
                <p className="sgc-mono text-[10px] text-white/28 tracking-widest uppercase mb-3">Filter by Category</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                        category === cat
                          ? "bg-indigo-500 text-white border border-indigo-400/50"
                          : "border border-white/[.07] bg-white/3 text-white/38 hover:border-indigo-400/30 hover:text-white/65"
                      }`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </motion.div>
              <motion.div initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:.1 }}
                className="rounded-2xl border border-white/[.07] bg-[#000c42]/80 backdrop-blur-xl p-5">
                <p className="sgc-mono text-[10px] text-white/28 tracking-widest uppercase mb-4">Select Card Brand</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((b) => {
                      const active = brand.name === b.name;
                      return (
                        <motion.button key={b.name} layout
                          initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:.9 }}
                          transition={{ duration:.18 }}
                          onClick={() => setBrand(b)}
                          className={`sgc-brand flex flex-col items-center gap-2 rounded-xl p-3 border ${
                            active
                              ? "border-indigo-400/40 bg-indigo-400/10"
                              : "border-white/6 bg-white/2 hover:border-white/12"
                          }`}>
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8"
                            style={{ background: `${b.color}20` }}>
                            <span className="sgc-mono text-[10px] font-bold" style={{ color: b.color }}>{b.abbr}</span>
                          </div>
                          <span className="text-[10px] text-white/55 leading-tight text-center">{b.name}</span>
                          {active && (
                            <div className="w-3 h-0.5 rounded-full bg-indigo-400"/>
                          )}
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:.15 }}
                className="rounded-2xl border border-white/[.07] bg-[#000c42]/80 backdrop-blur-xl p-5">
                <p className="sgc-mono text-[10px] text-white/28 tracking-widest uppercase mb-4">Card Value (USD)</p>
                <div className="grid grid-cols-5 gap-2">
                  {AMOUNTS.map(a => (
                    <button key={a} onClick={() => setAmount(a)}
                      className={`sgc-amount rounded-xl py-3 text-sm font-semibold transition-all duration-150 ${
                        amount === a
                          ? "bg-indigo-500 border border-indigo-400/50 text-white shadow-[0_4px_16px_rgba(129,140,248,0.3)]"
                          : "border border-white/[.07] bg-white/3 text-white/45 hover:border-indigo-400/30 hover:text-white/75"
                      }`}>
                      ${a}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* How it works mini */}
              <motion.div initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:.2 }}
                className="rounded-2xl border border-white/[.07] bg-[#000c42]/80 backdrop-blur-xl p-5">
                <p className="sgc-mono text-[10px] text-white/28 tracking-widest uppercase mb-4">How It Works</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {HOW_STEPS.map((s, i) => (
                    <div key={s.n} className="flex flex-col gap-2">
                      <span className="sgc-syne text-2xl font-extrabold text-indigo-400/30 leading-none">{s.n}</span>
                      <span className="text-xs font-semibold text-white/65">{s.label}</span>
                      <span className="text-[11px] text-white/30 leading-relaxed">{s.desc}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity:0, x:24 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                className="sticky top-24 rounded-2xl border border-indigo-400/18 overflow-hidden"
                style={{ background:"rgba(0,6,32,.92)", backdropFilter:"blur(24px)" }}>
                <div className="h-px bg-linear-to-r from-transparent via-indigo-400/55 to-transparent"/>

                <div className="p-6">
                  <AnimatePresence mode="wait">
                    <motion.div key={brand.name} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:.2 }}>

                      <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8"
                          style={{ background:`${brand.color}22` }}>
                          <span className="sgc-mono text-sm font-bold" style={{ color:brand.color }}>{brand.abbr}</span>
                        </div>
                        <div>
                          <p className="sgc-syne text-lg font-extrabold text-white">{brand.name}</p>
                          <span className="sgc-mono text-[10px] px-2 py-0.5 rounded-md" style={{ background:`${brand.color}18`, color:brand.color }}>
                            {brand.category}
                          </span>
                        </div>
                      </div>

                      {/* Rate display */}
                      <div className="rounded-xl border border-indigo-400/16 bg-black/35 px-5 py-5 mb-5">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="sgc-mono text-[10px] text-white/28 tracking-[.08em] uppercase mb-1.5">You trade</p>
                            <p className="sgc-syne text-3xl font-extrabold text-white leading-none">${amount} <span className="text-white/35 text-lg">{brand.name}</span></p>
                          </div>
                          <div className="text-right">
                            <p className="sgc-mono text-[10px] text-white/28 tracking-[.08em] uppercase mb-1.5">You receive</p>
                            <p className="sgc-syne text-3xl font-extrabold text-indigo-400 leading-none">₦{payout}</p>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="sgc-mono text-[10px] text-white/25">Payout rate</span>
                            <span className="sgc-mono text-[10px] text-indigo-400">{pct}% of face value</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/6 overflow-hidden">
                            <motion.div
                              key={pct}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration:.5, ease:"easeOut" }}
                              className="h-full rounded-full bg-linear-to-r from-indigo-500 to-purple-500"
                            />
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                          <span className="sgc-mono text-[10px] text-white/22">1 USD = ₦{rate}</span>
                          <span className="sgc-mono text-[10px] text-emerald-400">Best rate ✓</span>
                        </div>
                      </div>

                      {/* Perks */}
                      <div className="space-y-2.5 mb-6">
                        {[
                          { icon:Zap,          label:"Verification in ~15 seconds" },
                          { icon:ShieldCheck,  label:"100% secure transaction"     },
                          { icon:Clock,        label:"Payout in under 30 seconds"  },
                          { icon:Star,         label:"Best rate in Nigeria"        },
                        ].map(({ icon:Icon, label }) => (
                          <div key={label} className="flex items-center gap-2.5">
                            <Icon size={13} className="text-indigo-400 shrink-0"/>
                            <span className="text-xs text-white/45">{label}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <button className="sgc-cta group relative w-full overflow-hidden rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 py-4 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(129,140,248,0.32)] transition-all duration-200 hover:-translate-y-px">
                    <span className="sgc-sweep pointer-events-none absolute inset-0 bg-white/20"/>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Sell {brand.name} ${amount} Card <ArrowRight size={14}/>
                    </span>
                  </button>

                  <p className="sgc-mono text-center text-[9px] text-white/20 tracking-[.06em] mt-3">
                    NO FEES · INSTANT PAYOUT · FULLY SECURE
                  </p>
                </div>

                <div className="h-px bg-linear-to-r from-transparent via-indigo-400/22 to-transparent"/>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
