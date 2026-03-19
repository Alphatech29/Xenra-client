"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Gift, Coins, ShieldCheck, Zap, Clock, ArrowRight,
  TrendingUp, Lock, RefreshCw, CheckCircle2, ChevronRight,
} from "lucide-react";

const FEATURES = [
  {
    id: "payments",
    tag: "Global Remittance",
    headline: "Send Money Anywhere, Instantly",
    body: "Transfer funds to 150+ countries with real-time exchange rates and zero hidden fees. Our intelligent routing engine picks the fastest path for every transaction.",
    icon: Globe,
    color: "#22d3ee",
    colorClass: "text-cyan-400",
    borderClass: "border-cyan-400/20",
    bgClass: "bg-cyan-400/8",
    glowClass: "shadow-[0_0_60px_rgba(34,211,238,0.12)]",
    badgeClass: "bg-cyan-400/10 border-cyan-400/25 text-cyan-400",
    stats: [
      { value: "150+", label: "Countries" },
      { value: "<2s",  label: "Settlement" },
      { value: "0%",   label: "Hidden Fees" },
    ],
    perks: ["Live FX rates", "Bank & mobile money", "Bulk payouts API"],
    visual: {
      type: "transfer",
      from: "USD", to: "NGN",
      amount: "$1,250", converted: "₦1,985,000",
      rate: "1 USD = ₦1,588",
      bars: [42, 55, 48, 68, 60, 74, 58, 80, 65, 88, 72, 92, 78, 95, 100],
    },
  },
  {
    id: "giftcards",
    tag: "Gift Card Exchange",
    headline: "Trade Gift Cards at Best Rates",
    body: "Buy, sell, and redeem gift cards from 200+ global brands in seconds. Our automated verification engine ensures you always get the best payout, fast.",
    icon: Gift,
    color: "#818cf8",
    colorClass: "text-indigo-400",
    borderClass: "border-indigo-400/20",
    bgClass: "bg-indigo-400/8",
    glowClass: "shadow-[0_0_60px_rgba(129,140,248,0.12)]",
    badgeClass: "bg-indigo-400/10 border-indigo-400/25 text-indigo-400",
    stats: [
      { value: "200+", label: "Brands"      },
      { value: "95%",  label: "Payout Rate" },
      { value: "~30s", label: "Avg. Time"   },
    ],
    perks: ["Instant verification", "200+ card brands", "Best-rate guarantee"],
    visual: {
      type: "cards",
      cards: [
        { brand: "Amazon",  amount: "$100", rate: "₦95,000",  color: "#f59e0b" },
        { brand: "iTunes",  amount: "$50",  rate: "₦46,500",  color: "#818cf8" },
        { brand: "Steam",   amount: "$25",  rate: "₦23,750",  color: "#22d3ee" },
        { brand: "Netflix", amount: "$15",  rate: "₦14,100",  color: "#f87171" },
      ],
    },
  },
  {
    id: "crypto",
    tag: "Crypto Exchange",
    headline: "Swap Crypto at Live Market Rates",
    body: "Trade Bitcoin, Ethereum, USDT and more with deep liquidity and institutional-grade security. Real-time price feeds, non-custodial options, and 24/7 trading.",
    icon: Coins,
    color: "#34d399",
    colorClass: "text-emerald-400",
    borderClass: "border-emerald-400/20",
    bgClass: "bg-emerald-400/8",
    glowClass: "shadow-[0_0_60px_rgba(52,211,153,0.12)]",
    badgeClass: "bg-emerald-400/10 border-emerald-400/25 text-emerald-400",
    stats: [
      { value: "50+",  label: "Tokens"      },
      { value: "Live", label: "Price Feeds" },
      { value: "24/7", label: "Trading"     },
    ],
    perks: ["Deep order book", "Non-custodial swap", "Real-time charts"],
    visual: {
      type: "crypto",
      pairs: [
        { from: "BTC",  to: "USDT", price: "$67,240", change: "+1.43%", up: true  },
        { from: "ETH",  to: "USDT", price: "$3,521",  change: "-0.87%", up: false },
        { from: "BNB",  to: "USDT", price: "$580",    change: "+2.10%", up: true  },
        { from: "USDT", to: "NGN",  price: "₦1,610",  change: "+0.22%", up: true  },
      ],
    },
  },
];

const WHY = [
  { icon: ShieldCheck, label: "Bank-grade SSL & 2FA",  cx: "text-cyan-400",   bg: "bg-cyan-400/8   border-cyan-400/15"   },
  { icon: Zap,         label: "Sub-second processing", cx: "text-indigo-400", bg: "bg-indigo-400/8 border-indigo-400/15" },
  { icon: Lock,        label: "Funds always insured",  cx: "text-purple-400", bg: "bg-purple-400/8 border-purple-400/15" },
  { icon: RefreshCw,   label: "24/7 support & uptime", cx: "text-emerald-400",bg: "bg-emerald-400/8 border-emerald-400/15"},
  { icon: TrendingUp,  label: "Live rates, no markup",  cx: "text-cyan-400",   bg: "bg-cyan-400/8   border-cyan-400/15"   },
  { icon: Clock,       label: "Instant settlements",   cx: "text-indigo-400", bg: "bg-indigo-400/8 border-indigo-400/15" },
];


function TransferVisual({ visual, color, colorClass }) {
  return (
    <div className="relative rounded-2xl border border-white/[.07] bg-black/40 p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        {[visual.from, visual.to].map((cur, i) => (
          <div key={cur} className="flex-1 rounded-xl border border-white/[.07] bg-white/3 px-4 py-3 text-center">
            <p className="font-mono-sp text-[10px] text-white/30 tracking-widest uppercase mb-1">{i === 0 ? "From" : "To"}</p>
            <p className="xf-syne text-lg font-black text-white">{cur}</p>
          </div>
        ))}
        <div className="flex flex-col items-center gap-1">
          <ArrowRight size={16} style={{ color }} />
          <span className="font-mono-sp text-[9px] text-white/25">LIVE</span>
        </div>
      </div>
      {/* Amount display */}
      <div className="rounded-xl border bg-black/30 px-4 py-4" style={{ borderColor: `${color}20` }}>
        <p className="font-mono-sp text-[10px] text-white/28 mb-1 tracking-[.08em] uppercase">Amount</p>
        <p className="xf-syne text-3xl font-black" style={{ color }}>{visual.amount}</p>
        <p className="text-sm text-white/40 mt-1">{visual.converted}</p>
        <p className="font-mono-sp text-[10px] text-white/25 mt-2">{visual.rate}</p>
      </div>
      <div className="flex items-end gap-0.75 h-8">
        {visual.bars.map((h, i) => (
          <div key={i} className="flex-1 rounded-t-xs" style={{ height: `${h}%`, background: color, opacity: i === 14 ? 1 : 0.1 + (i / 14) * 0.5 }}/>
        ))}
      </div>
    </div>
  );
}

function CardsVisual({ visual, color, colorClass }) {
  return (
    <div className="space-y-2">
      {visual.cards.map((c, i) => (
        <motion.div
          key={c.brand}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="flex items-center justify-between rounded-xl border border-white/[.07] bg-black/40 px-4 py-3 hover:border-white/12 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[.07]" style={{ background: `${c.color}18` }}>
              <Gift size={14} style={{ color: c.color }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white/85">{c.brand}</p>
              <p className="font-mono-sp text-[10px] text-white/30">{c.amount}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold" style={{ color }}>{c.rate}</p>
            <p className="font-mono-sp text-[9px] text-white/25 mt-0.5">Instant payout</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function CryptoVisual({ visual, color }) {
  return (
    <div className="space-y-2">
      {visual.pairs.map((p, i) => (
        <motion.div
          key={p.from + p.to}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07 }}
          className="flex items-center justify-between rounded-xl border border-white/[.07] bg-black/40 px-4 py-3 hover:border-white/12 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[.07] bg-white/3">
              <Coins size={14} style={{ color }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white/85">{p.from} <span className="text-white/30">→</span> {p.to}</p>
              <p className="font-mono-sp text-[10px] text-white/30">{p.price}</p>
            </div>
          </div>
          <span className={`font-mono-sp text-[11px] px-2 py-0.5 rounded-lg ${p.up ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"}`}>
            {p.change}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

export default function FeaturesSection() {
  const [active, setActive] = useState("payments");
  const feat = FEATURES.find((f) => f.id === active);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400&family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        .xfeat        { font-family: 'DM Sans', sans-serif; }
        .xfeat-syne   { font-family: 'Syne', sans-serif; }
        .font-mono-sp { font-family: 'Space Mono', monospace; }

        @keyframes xfeat-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes xfeat-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes xfeat-pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.2;transform:scale(.6)} }
        @keyframes xfeat-scan    { 0%{top:-2px} 100%{top:110%} }

        .xs-shimmer {
          background: linear-gradient(90deg,#22d3ee 0%,#e0e7ff 28%,#818cf8 52%,#a855f7 78%,#22d3ee 100%);
          background-size:250% auto;
          -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;
          animation: xfeat-shimmer 5s linear infinite;
        }
        .xs-float  { animation: xfeat-float 6s ease-in-out infinite; }
        .xs-blink  { animation: xfeat-pulse 1.4s ease-in-out infinite; }
        .xs-scan   { animation: xfeat-scan  8s ease-in-out infinite; }

        .xs-card-hover { transition: transform .2s ease, box-shadow .2s ease; }
        .xs-card-hover:hover { transform: translateY(-2px); }

        .xfeat-syne { font-family: 'Syne', sans-serif; }

        @media (max-width: 639px) {
          .xs-headline { font-size: clamp(28px, 9vw, 44px) !important; }
          .xs-feat-headline { font-size: clamp(22px, 7vw, 32px) !important; }
        }
      `}</style>

      <section className="xfeat relative overflow-hidden bg-[#000c42] text-white/70">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <svg width="100%" height="100%" className="absolute inset-0 opacity-[.04]">
            <defs>
              <pattern id="xfhex2" width="56" height="48.5" patternUnits="userSpaceOnUse">
                <polygon points="28,2 52,14 52,38 28,50 4,38 4,14" fill="none" stroke="#22d3ee" strokeWidth=".5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#xfhex2)"/>
          </svg>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-100 bg-[radial-gradient(ellipse,rgba(129,140,248,0.07)_0%,transparent_70%)]"/>
          <div className="absolute bottom-0 left-0 w-125 h-75 bg-[radial-gradient(ellipse,rgba(34,211,238,0.06)_0%,transparent_70%)]"/>
          <div className="absolute bottom-0 right-0 w-100 h-75 bg-[radial-gradient(ellipse,rgba(168,85,247,0.06)_0%,transparent_70%)]"/>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(0,0,0,0.04)_3px,rgba(0,0,0,0.04)_4px)]"/>
          <div className="xs-scan absolute left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.12),transparent)]"/>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">

          <div className="text-center mb-16 lg:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/18 bg-cyan-400/5 px-4 py-1.5"
            >
              <span className="xs-blink inline-block h-1.25 w-1.25 rounded-full bg-cyan-400"/>
              <span className="font-mono-sp text-[11px] tracking-widest text-white/40 uppercase">Platform Features</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .1 }}
              className="xfeat-syne xs-headline font-extrabold leading-tight tracking-[-0.03em] text-[clamp(32px,5vw,58px)] mb-4"
            >
              <span className="text-white">Everything you need</span>
              <br/>
              <span className="xs-shimmer">in one platform.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .2 }}
              className="mx-auto max-w-xl text-base sm:text-lg text-white/40 leading-relaxed"
            >
              Payments, gift cards, and crypto — all unified under one roof with best-in-class rates, instant processing, and enterprise-grade security.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .25 }}
            className="flex justify-center mb-12"
          >
            <div className="flex gap-1.5 rounded-2xl border border-white/[.07] bg-white/3 p-1.5 backdrop-blur-xl">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                const on = active === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setActive(f.id)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                      on
                        ? `border ${f.borderClass} ${f.bgClass} ${f.colorClass}`
                        : "text-white/40 hover:text-white/65 hover:bg-white/4 border border-transparent"
                    }`}
                  >
                    <Icon size={15}/>
                    <span className="hidden sm:block">{f.tag}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.div
              key={feat.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: .28 }}
              className={`rounded-3xl border ${feat.borderClass} bg-[#000820]/80 backdrop-blur-xl overflow-hidden ${feat.glowClass}`}
            >
              <div className="h-px" style={{ background: `linear-gradient(90deg,transparent,${feat.color}60,transparent)` }}/>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

                <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-between gap-8">
                  <div>
                    <div className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium font-mono-sp tracking-[.08em] uppercase ${feat.badgeClass}`}>
                      <feat.icon size={11}/>
                      {feat.tag}
                    </div>

                    <h3 className="xfeat-syne xs-feat-headline font-extrabold text-white leading-tight tracking-[-0.025em] text-[clamp(22px,3.5vw,38px)] mb-4">
                      {feat.headline}
                    </h3>

                    <p className="text-base text-white/45 leading-relaxed max-w-md">
                      {feat.body}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {feat.stats.map((s) => (
                      <div key={s.label} className="rounded-2xl border border-white/6 bg-white/2 px-3 py-4 text-center">
                        <p className={`xfeat-syne text-2xl font-extrabold leading-none mb-1 ${feat.colorClass}`}>{s.value}</p>
                        <p className="font-mono-sp text-[9px] text-white/28 tracking-[.08em] uppercase">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2.5">
                    {feat.perks.map((p) => (
                      <div key={p} className="flex items-center gap-3">
                        <CheckCircle2 size={15} style={{ color: feat.color }} className="shrink-0"/>
                        <span className="text-sm text-white/55">{p}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <button
                      className="group inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px"
                      style={{ background: `linear-gradient(135deg, ${feat.color}ee, #818cf8)`, boxShadow: `0 4px 20px ${feat.color}35` }}
                    >
                      Get Started
                      <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5"/>
                    </button>
                  </div>
                </div>

                <div className="relative flex items-center p-8 sm:p-10 lg:p-12 border-t border-white/5 lg:border-t-0 lg:border-l lg:border-white/5">
                  <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 30% 30%, ${feat.color}06, transparent 60%)` }}/>

                  <div className="relative z-10 w-full">
                    {feat.visual.type === "transfer" && <TransferVisual visual={feat.visual} color={feat.color} colorClass={feat.colorClass}/>}
                    {feat.visual.type === "cards"    && <CardsVisual    visual={feat.visual} color={feat.color} colorClass={feat.colorClass}/>}
                    {feat.visual.type === "crypto"   && <CryptoVisual   visual={feat.visual} color={feat.color}/>}
                  </div>
                </div>
              </div>

              <div className="h-px" style={{ background: `linear-gradient(90deg,transparent,${feat.color}30,transparent)` }}/>
            </motion.div>
          </AnimatePresence>

          <div className="mt-20 lg:mt-28">
            <motion.div
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mb-10"
            >
              <p className="font-mono-sp text-[10px] tracking-[.15em] text-white/28 uppercase mb-3">Why Xenra</p>
              <h3 className="xfeat-syne text-2xl sm:text-3xl font-extrabold text-white tracking-[-0.02em]">
                Built for trust. Designed for speed.
              </h3>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {WHY.map((w, i) => {
                const Icon = w.icon;
                return (
                  <motion.div
                    key={w.label}
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className={`xs-card-hover flex flex-col items-center gap-3 rounded-2xl border ${w.bg} px-4 py-5 text-center`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${w.bg}`}>
                      <Icon size={18} className={w.cx}/>
                    </div>
                    <p className="text-xs font-medium text-white/55 leading-snug">{w.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .1 }}
            className="mt-20 lg:mt-28 relative rounded-3xl border border-white/[.07] overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-br from-cyan-500/8 via-indigo-600/10 to-purple-600/8"/>
            <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(0,0,0,0.04)_3px,rgba(0,0,0,0.04)_4px)]"/>
            <div className="h-px bg-linear-to-r from-transparent via-cyan-400/50 to-transparent"/>

            <div className="relative flex flex-col items-center gap-6 px-6 py-12 sm:py-16 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/3 px-4 py-1.5">
                <span className="xs-blink inline-block h-1.25 w-1.25 rounded-full bg-cyan-400"/>
                <span className="font-mono-sp text-[10px] tracking-widest text-white/35 uppercase">Ready to get started?</span>
              </div>

              <h3 className="xfeat-syne text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-[-0.03em] max-w-2xl">
                Start transacting<br/>
                <span className="xs-shimmer">across the globe today.</span>
              </h3>

              <p className="text-base text-white/40 max-w-md leading-relaxed">
                Join 500,000+ users already using Xenra. Free to sign up — no credit card required.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm sm:max-w-none sm:w-auto">
                <button className="group inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-500 to-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(99,102,241,0.45)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(99,102,241,0.6)] w-full sm:w-auto">
                  Create Free Account
                  <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5"/>
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/4 px-7 py-3.5 text-sm font-medium text-white/60 transition-all duration-200 hover:bg-white/8 hover:text-white w-full sm:w-auto">
                  See how it works
                  <ChevronRight size={15}/>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-5 mt-2">
                {[
                  { icon: ShieldCheck, label: "Bank-grade security",  cx: "text-cyan-400"   },
                  { icon: Zap,         label: "Instant settlement",   cx: "text-indigo-400" },
                  { icon: Globe,       label: "150+ countries",       cx: "text-purple-400" },
                ].map(({ icon: Icon, label, cx }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon size={12} className={cx}/>
                    <span className="font-mono-sp text-[10px] text-white/25 tracking-[.06em]">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-indigo-400/40 to-transparent"/>
          </motion.div>
        </div>
      </section>
    </>
  );
}
