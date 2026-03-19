"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Coins, Gift, Star, Smartphone, Bolt, CreditCard,
  CheckCircle2, ArrowRight,
} from "lucide-react";

const SERVICES = [
  {
    id: "crypto",
    icon: Coins,
    label: "Crypto Exchange",
    desc: "Buy, sell & swap 50+ cryptocurrencies. Convert crypto to naira at live market rates — instantly, no delays.",
    color: "#22d3ee",
    borderCx: "border-cyan-400/20",
    bgCx: "bg-cyan-400/[.07]",
    iconBorder: "border-cyan-400/25",
    badgeCx: "bg-cyan-400/10 border border-cyan-400/25 text-cyan-400",
    glowColor: "rgba(34,211,238,0.1)",
    ctaFrom: "from-cyan-500",
    ctaTo: "to-indigo-600",
    ctaShadow: "shadow-cyan-500/25",
    perks: ["Live order book", "Best exchange rates", "Instant NGN payout"],
    stat: "$2.4B+ traded",
  },
  {
    id: "sell-gc",
    icon: Gift,
    label: "Sell Gift Cards",
    desc: "Turn unused gift cards into instant cash. Best payout rates for Amazon, iTunes, Steam, Google Play & 200+ brands.",
    color: "#818cf8",
    borderCx: "border-indigo-400/20",
    bgCx: "bg-indigo-400/[.07]",
    iconBorder: "border-indigo-400/25",
    badgeCx: "bg-indigo-400/10 border border-indigo-400/25 text-indigo-400",
    glowColor: "rgba(129,140,248,0.1)",
    ctaFrom: "from-indigo-500",
    ctaTo: "to-purple-600",
    ctaShadow: "shadow-indigo-500/25",
    perks: ["200+ card brands", "Auto-verification", "Payout in ~30s"],
    stat: "₦4.8B+ paid out",
  },
  {
    id: "buy-gc",
    icon: Star,
    label: "Buy Gift Cards",
    desc: "Purchase gift cards for yourself or as a gift — delivered instantly to your inbox at competitive prices.",
    color: "#f59e0b",
    borderCx: "border-amber-400/20",
    bgCx: "bg-amber-400/[.07]",
    iconBorder: "border-amber-400/25",
    badgeCx: "bg-amber-400/10 border border-amber-400/25 text-amber-400",
    glowColor: "rgba(245,158,11,0.1)",
    ctaFrom: "from-amber-500",
    ctaTo: "to-orange-600",
    ctaShadow: "shadow-amber-500/25",
    perks: ["Instant delivery", "200+ brands", "Discounted prices"],
    stat: "500K+ sold",
  },
  {
    id: "airtime",
    icon: Smartphone,
    label: "Airtime & Data",
    desc: "Top up airtime and buy data bundles for MTN, Airtel, Glo and 9Mobile in seconds — any time, any amount.",
    color: "#34d399",
    borderCx: "border-emerald-400/20",
    bgCx: "bg-emerald-400/[.07]",
    iconBorder: "border-emerald-400/25",
    badgeCx: "bg-emerald-400/10 border border-emerald-400/25 text-emerald-400",
    glowColor: "rgba(52,211,153,0.1)",
    ctaFrom: "from-emerald-500",
    ctaTo: "to-cyan-600",
    ctaShadow: "shadow-emerald-500/25",
    perks: ["All networks", "Data bundles", "Instant top-up"],
    stat: "2M+ recharges",
  },
  {
    id: "bills",
    icon: Bolt,
    label: "Bill Payments",
    desc: "Pay electricity, TV subscriptions, water bills, internet and more — all from one dashboard, any time of day.",
    color: "#a855f7",
    borderCx: "border-purple-400/20",
    bgCx: "bg-purple-400/[.07]",
    iconBorder: "border-purple-400/25",
    badgeCx: "bg-purple-400/10 border border-purple-400/25 text-purple-400",
    glowColor: "rgba(168,85,247,0.1)",
    ctaFrom: "from-purple-500",
    ctaTo: "to-indigo-600",
    ctaShadow: "shadow-purple-500/25",
    perks: ["DSTV, GOtv, Startimes", "PHCN electricity", "Water & internet"],
    stat: "1M+ bills paid",
  },
  {
    id: "virtual-card",
    icon: CreditCard,
    label: "Virtual Card",
    desc: "Get a Xenra virtual Mastercard instantly. Use it for online shopping, subscriptions, and international payments.",
    color: "#f87171",
    borderCx: "border-red-400/20",
    bgCx: "bg-red-400/[.07]",
    iconBorder: "border-red-400/25",
    badgeCx: "bg-red-400/10 border border-red-400/25 text-red-400",
    glowColor: "rgba(248,113,113,0.1)",
    ctaFrom: "from-red-500",
    ctaTo: "to-rose-600",
    ctaShadow: "shadow-red-500/25",
    perks: ["Works everywhere online", "Instant issuance", "USD & NGN support"],
    stat: "Instant issuance",
  },
];

export default function ServicesGrid() {
  const [hovered, setHovered] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400&family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        .sg          { font-family: 'DM Sans', sans-serif; }
        .sg-syne     { font-family: 'Syne', sans-serif; }
        .sg-mono     { font-family: 'Space Mono', monospace; }

        @keyframes sg-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes sg-pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.15;transform:scale(.55)} }
        @keyframes sg-scan    { 0%{top:-2px} 100%{top:110%} }
        @keyframes sg-sweep   { from{transform:translateX(-110%) skewX(-18deg)} to{transform:translateX(110%) skewX(-18deg)} }

        .sg-shimmer-text {
          background: linear-gradient(90deg,#22d3ee 0%,#e0e7ff 28%,#818cf8 52%,#a855f7 78%,#22d3ee 100%);
          background-size: 250% auto;
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
          animation: sg-shimmer 5s linear infinite;
        }
        .sg-blink  { animation: sg-pulse 1.4s ease-in-out infinite; }
        .sg-scan   { animation: sg-scan 9s ease-in-out infinite; }
        .sg-card   { transition: transform .22s ease, box-shadow .22s ease; }
        .sg-card:hover { transform: translateY(-4px); }
        .sg-cta:hover .sg-sweep { animation: sg-sweep .55s ease-out forwards; }
      `}</style>

      <section className="sg relative overflow-hidden bg-[#000c42] text-white/70">

        <div className="pointer-events-none absolute inset-0 -z-10">
          <svg width="100%" height="100%" className="absolute inset-0 opacity-[.04]">
            <defs>
              <pattern id="sghex" width="56" height="48.5" patternUnits="userSpaceOnUse">
                <polygon points="28,2 52,14 52,38 28,50 4,38 4,14" fill="none" stroke="#22d3ee" strokeWidth=".5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sghex)"/>
          </svg>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-125 bg-[radial-gradient(ellipse,rgba(129,140,248,0.08)_0%,transparent_70%)]"/>
          <div className="absolute bottom-0 left-0 w-125 h-100 bg-[radial-gradient(ellipse,rgba(34,211,238,0.05)_0%,transparent_70%)]"/>
          <div className="absolute bottom-0 right-0 w-125 h-100 bg-[radial-gradient(ellipse,rgba(168,85,247,0.05)_0%,transparent_70%)]"/>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(0,0,0,0.04)_3px,rgba(0,0,0,0.04)_4px)]"/>
          <div className="sg-scan absolute left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.12),transparent)]"/>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">

          <div className="text-center mb-16 lg:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/5 px-4 py-1.5"
            >
              <span className="sg-blink inline-block h-1.25 w-1.25 rounded-full bg-indigo-400"/>
              <span className="sg-mono text-[11px] tracking-widest text-white/40 uppercase">One Platform, Everything</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: .1 }}
              className="sg-syne text-[clamp(32px,5vw,58px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-white mb-5"
            >
              Six ways to move money,
              <br />
              <span className="sg-shimmer-text">all in one app.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: .2 }}
              className="mx-auto max-w-xl text-base sm:text-lg text-white/38 leading-relaxed"
            >
              Trade gift cards for instant cash, swap crypto at live rates, pay every bill,
              fund airtime — and carry it all in your Xenra wallet with a virtual Mastercard.
            </motion.p>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              const on   = hovered === svc.id;

              return (
                <motion.div
                  key={svc.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  onMouseEnter={() => setHovered(svc.id)}
                  onMouseLeave={() => setHovered(null)}
                  className={`sg-card relative rounded-2xl border ${svc.borderCx} p-6 overflow-hidden cursor-default`}
                  style={{
                    background: on
                      ? `linear-gradient(145deg, ${svc.glowColor.replace("0.1","0.12")}, rgba(0,8,40,.92))`
                      : "rgba(0,8,40,.7)",
                    boxShadow: on ? `0 8px 48px ${svc.glowColor}, inset 0 1px 0 rgba(255,255,255,.04)` : "inset 0 1px 0 rgba(255,255,255,.03)",
                  }}
                >
                  {on && (
                    <div
                      className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full"
                      style={{ background: `radial-gradient(circle, ${svc.color}20, transparent 70%)` }}
                    />
                  )}

                  <div className="flex items-start justify-between mb-5">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${svc.iconBorder}`}
                      style={{ background: `${svc.color}14` }}
                    >
                      <Icon size={20} style={{ color: svc.color }}/>
                    </div>
                    <span className={`sg-mono text-[10px] px-2.5 py-1 rounded-lg border ${svc.badgeCx}`}>
                      {svc.stat}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="sg-syne text-[18px] font-bold text-white tracking-[-0.01em] mb-2">
                    {svc.label}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed mb-5">{svc.desc}</p>

                  <ul className="space-y-2 mb-6">
                    {svc.perks.map((p) => (
                      <li key={p} className="flex items-center gap-2">
                        <CheckCircle2 size={13} style={{ color: svc.color }} className="shrink-0"/>
                        <span className="text-xs text-white/45">{p}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`sg-cta group relative w-full overflow-hidden rounded-xl bg-linear-to-r ${svc.ctaFrom} ${svc.ctaTo} py-3 text-sm font-semibold text-white shadow-lg ${svc.ctaShadow} transition-all duration-200 hover:-translate-y-px`}
                  >
                    <span className="sg-sweep pointer-events-none absolute inset-0 bg-white/20"/>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Get Started <ArrowRight size={14}/>
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
