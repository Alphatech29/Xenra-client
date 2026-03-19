"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coins, Gift, Star, Smartphone, Bolt, CreditCard,
  CheckCircle2, ArrowRight, ShieldCheck, Users, Zap,
  Lock, TrendingUp, Globe, ArrowUpRight, ChevronRight,
  Wallet, RefreshCw, Sparkles,
} from "lucide-react";

const SERVICES = [
  {
    id: "crypto",
    icon: Coins,
    label: "Crypto Exchange",
    desc: "Buy, sell & swap 50+ cryptocurrencies. Convert crypto to naira at live market rates — instantly, no delays.",
    color: "#22d3ee",
    colorClass: "text-cyan-400",
    borderCx: "border-cyan-400/20",
    bgCx: "bg-cyan-400/[.07]",
    glowColor: "rgba(34,211,238,0.12)",
    badgeCx: "bg-cyan-400/10 border-cyan-400/25 text-cyan-400",
    ctaColor: "from-cyan-500 to-indigo-600",
    ctaShadow: "rgba(34,211,238,0.3)",
    perks: ["Live order book", "Best exchange rates", "Instant NGN payout"],
    stat: "$2.4B+ traded",
    trend: "+1.43%",
  },
  {
    id: "sell-gc",
    icon: Gift,
    label: "Sell Gift Cards",
    desc: "Turn unused gift cards into instant cash. Best payout rates for Amazon, iTunes, Steam, Google Play & 200+ brands.",
    color: "#818cf8",
    colorClass: "text-indigo-400",
    borderCx: "border-indigo-400/20",
    bgCx: "bg-indigo-400/[.07]",
    glowColor: "rgba(129,140,248,0.12)",
    badgeCx: "bg-indigo-400/10 border-indigo-400/25 text-indigo-400",
    ctaColor: "from-indigo-500 to-purple-600",
    ctaShadow: "rgba(129,140,248,0.3)",
    perks: ["200+ card brands", "Auto-verification", "Payout in ~30s"],
    stat: "₦4.8B+ paid out",
    trend: "95% rate",
  },
  {
    id: "buy-gc",
    icon: Star,
    label: "Buy Gift Cards",
    desc: "Purchase gift cards for yourself or loved ones at competitive prices, delivered instantly to your inbox.",
    color: "#f59e0b",
    colorClass: "text-amber-400",
    borderCx: "border-amber-400/20",
    bgCx: "bg-amber-400/[.07]",
    glowColor: "rgba(245,158,11,0.12)",
    badgeCx: "bg-amber-400/10 border-amber-400/25 text-amber-400",
    ctaColor: "from-amber-500 to-orange-500",
    ctaShadow: "rgba(245,158,11,0.3)",
    perks: ["Instant delivery", "200+ brands", "Discounted prices"],
    stat: "500K+ sold",
    trend: "Instant",
  },
  {
    id: "airtime",
    icon: Smartphone,
    label: "Airtime & Data",
    desc: "Top up airtime and buy data bundles for MTN, Airtel, Glo and 9Mobile in seconds — any time, any amount.",
    color: "#34d399",
    colorClass: "text-emerald-400",
    borderCx: "border-emerald-400/20",
    bgCx: "bg-emerald-400/[.07]",
    glowColor: "rgba(52,211,153,0.12)",
    badgeCx: "bg-emerald-400/10 border-emerald-400/25 text-emerald-400",
    ctaColor: "from-emerald-500 to-cyan-600",
    ctaShadow: "rgba(52,211,153,0.3)",
    perks: ["All networks", "Data bundles", "Instant top-up"],
    stat: "2M+ recharges",
    trend: "<2s",
  },
  {
    id: "bills",
    icon: Bolt,
    label: "Bill Payments",
    desc: "Pay electricity, TV subscriptions, water bills, internet and more — all from one dashboard, any time.",
    color: "#a855f7",
    colorClass: "text-purple-400",
    borderCx: "border-purple-400/20",
    bgCx: "bg-purple-400/[.07]",
    glowColor: "rgba(168,85,247,0.12)",
    badgeCx: "bg-purple-400/10 border-purple-400/25 text-purple-400",
    ctaColor: "from-purple-500 to-indigo-600",
    ctaShadow: "rgba(168,85,247,0.3)",
    perks: ["DSTV, GOtv, Startimes", "PHCN electricity", "Water & internet"],
    stat: "1M+ bills paid",
    trend: "24/7",
  },
  {
    id: "virtual-card",
    icon: CreditCard,
    label: "Virtual Card",
    desc: "Get a Xenra virtual Mastercard instantly. Use it for online shopping, subscriptions, and international payments.",
    color: "#f87171",
    colorClass: "text-red-400",
    borderCx: "border-red-400/20",
    bgCx: "bg-red-400/[.07]",
    glowColor: "rgba(248,113,113,0.12)",
    badgeCx: "bg-red-400/10 border-red-400/25 text-red-400",
    ctaColor: "from-red-500 to-rose-600",
    ctaShadow: "rgba(248,113,113,0.3)",
    perks: ["Works everywhere online", "Instant issuance", "USD & NGN support"],
    stat: "Instant issuance",
    trend: "Global",
  },
];

const HERO_STATS = [
  { val: "500K+", label: "Active Users",     cx: "text-cyan-400",   glow: "rgba(34,211,238,.14)"  },
  { val: "₦18B+", label: "Volume Processed", cx: "text-indigo-400", glow: "rgba(129,140,248,.14)" },
  { val: "99.98%",label: "Platform Uptime",  cx: "text-purple-400", glow: "rgba(168,85,247,.14)"  },
  { val: "<2s",   label: "Avg. Settlement",  cx: "text-emerald-400",glow: "rgba(52,211,153,.14)"  },
];

const TRUST_CARDS = [
  {
    icon: ShieldCheck,
    title: "Bank-grade Encryption",
    desc: "AES-256 encryption and TLS 1.3 on every request. Your data and funds are always fully protected.",
    cx: "text-cyan-400", border: "border-cyan-400/20", bg: "bg-cyan-400/[.07]",
  },
  {
    icon: Zap,
    title: "Sub-second Processing",
    desc: "Our infrastructure processes transactions in under 2 seconds — no waiting, no downtime, ever.",
    cx: "text-indigo-400", border: "border-indigo-400/20", bg: "bg-indigo-400/[.07]",
  },
  {
    icon: Lock,
    title: "CBN Licensed & Regulated",
    desc: "Fully compliant with Central Bank of Nigeria regulations, AML policies, and NDIC deposit protection.",
    cx: "text-purple-400", border: "border-purple-400/20", bg: "bg-purple-400/[.07]",
  },
  {
    icon: Users,
    title: "Trusted by 500K+ Users",
    desc: "Half a million Nigerians trust Xenra for their daily financial transactions. Join the community.",
    cx: "text-emerald-400", border: "border-emerald-400/20", bg: "bg-emerald-400/[.07]",
  },
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  .sp          { font-family:'DM Sans',sans-serif; }
  .sp-syne     { font-family:'Syne',sans-serif; }
  .sp-mono     { font-family:'Space Mono',monospace; }

  @property --ra { syntax:'<angle>'; initial-value:0deg; inherits:false; }
  @keyframes sp-spin    { to{--ra:360deg;} }
  @keyframes sp-glow    { 0%,100%{opacity:.38} 50%{opacity:.95} }
  @keyframes sp-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes sp-pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.15;transform:scale(.55)} }
  @keyframes sp-scan    { 0%{top:-2px} 100%{top:110%} }
  @keyframes sp-sweep   { from{transform:translateX(-120%) skewX(-20deg)} to{transform:translateX(120%) skewX(-20deg)} }
  @keyframes sp-ticker  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes sp-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

  @keyframes sp-glitch {
    0%,80%,100%{clip-path:none;transform:skew(0);filter:none}
    81%{clip-path:polygon(0 12%,100% 12%,100% 30%,0 30%);transform:skewX(-5deg) translateX(-6px);filter:hue-rotate(130deg)}
    83%{clip-path:polygon(0 58%,100% 58%,100% 76%,0 76%);transform:skewX(4deg) translateX(6px)}
    85%{clip-path:none;transform:skew(0);filter:none}
  }

  .sp-shimmer-text {
    background:linear-gradient(90deg,#22d3ee 0%,#e0e7ff 26%,#818cf8 50%,#a855f7 76%,#22d3ee 100%);
    background-size:260% auto;
    -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;
    animation:sp-shimmer 5s linear infinite;
  }
  .sp-glitch { position:relative; }
  .sp-glitch::after {
    content:attr(data-text); position:absolute; inset:0;
    pointer-events:none; animation:sp-glitch 9s ease-in-out infinite;
  }
  .sp-ring {
    position:absolute; inset:-2px; border-radius:inherit; pointer-events:none;
    background:conic-gradient(from var(--ra,0deg),
      transparent 22%,rgba(34,211,238,.72) 38%,
      rgba(129,140,248,.58) 54%,rgba(168,85,247,.52) 68%,transparent 80%);
    -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
    -webkit-mask-composite:xor; mask-composite:exclude; padding:2px;
    animation:sp-spin 5s linear infinite,sp-glow 3s ease-in-out infinite;
  }
  .sp-blink  { animation:sp-pulse 1.4s ease-in-out infinite; }
  .sp-scan   { animation:sp-scan 10s ease-in-out infinite; }
  .sp-ticker { animation:sp-ticker 30s linear infinite; }
  .sp-float  { animation:sp-float 7s ease-in-out infinite; }
  .sp-cta:hover .sp-sweep { animation:sp-sweep .6s ease-out forwards; }

  /* Service card hover lift */
  .sp-card {
    transition:transform .22s cubic-bezier(0.22,1,0.36,1),
               box-shadow .22s ease,
               border-color .22s ease;
  }
  .sp-card:hover { transform:translateY(-5px); }

  /* Noise texture */
  .sp-noise {
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    background-repeat:repeat; background-size:200px 200px;
  }

  /* Stat top line */
  .sp-stat-line::before {
    content:''; position:absolute; top:0; left:12px; right:12px; height:1px;
    background:linear-gradient(90deg,transparent,var(--sc),transparent);
  }

  /* Trust card hover */
  .sp-trust { transition:transform .2s ease,border-color .2s ease; }
  .sp-trust:hover { transform:translateY(-3px); }
`;

function SpBg({ patternId = "sphex", patternColor = "#22d3ee", orbs = [] }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <svg width="100%" height="100%" className="absolute inset-0 opacity-[.045]">
        <defs>
          <pattern id={patternId} width="56" height="48.5" patternUnits="userSpaceOnUse">
            <polygon points="28,2 52,14 52,38 28,50 4,38 4,14"
              fill="none" stroke={patternColor} strokeWidth=".55"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`}/>
      </svg>
      <div className="sp-noise absolute inset-0 opacity-[.3]"/>
      {orbs.map((o, i) => (
        <div key={i} className={`absolute rounded-full ${o.pos}`}
          style={{ width: o.w, height: o.h, background: `radial-gradient(ellipse,${o.color} 0%,transparent 70%)` }}/>
      ))}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(0,0,0,0.045)_3px,rgba(0,0,0,0.045)_4px)]"/>
      <div className="sp-scan absolute left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,rgba(129,140,248,0.15),transparent)]"/>
    </div>
  );
}

const HERO_TICKER = [
  { label: "Crypto Exchange",  value: "BTC ₦107.8M",    color: "#22d3ee", up: true  },
  { label: "Gift Cards",       value: "Amazon 95% rate", color: "#818cf8", up: true  },
  { label: "Airtime & Data",   value: "2M+ recharges",   color: "#34d399", up: true  },
  { label: "Bill Payments",    value: "1M+ bills paid",  color: "#a855f7", up: true  },
  { label: "Virtual Card",     value: "Global · Instant",color: "#f87171", up: true  },
  { label: "Smart Wallet",     value: "NGN & USD",       color: "#f59e0b", up: true  },
];

const PREVIEW_SERVICES = [
  {
    icon: Coins,      label: "Crypto Exchange", value: "$67,240",   sub: "BTC live rate",     color: "#22d3ee", action: "Swap now",   stat: "+1.43%",   statUp: true  },
  {
    icon: Gift,       label: "Sell Gift Cards", value: "₦95,000",   sub: "Amazon $100",       color: "#818cf8", action: "Sell card",  stat: "95% rate", statUp: true  },
  {
    icon: Star,       label: "Buy Gift Cards",  value: "$50",       sub: "iTunes · Instant",  color: "#f59e0b", action: "Buy now",    stat: "−3% off",  statUp: true  },
  {
    icon: Smartphone, label: "Airtime & Data",  value: "₦1,000",    sub: "MTN · All networks",color: "#34d399", action: "Top up",     stat: "<2s",      statUp: true  },
  {
    icon: Bolt,       label: "Bill Payments",   value: "₦24,500",   sub: "DSTV GOtv Max",     color: "#a855f7", action: "Pay bill",   stat: "24/7",     statUp: true  },
  {
    icon: CreditCard, label: "Virtual Card",    value: "$842.50",   sub: "USD balance",       color: "#f87171", action: "Get card",   stat: "Global",   statUp: true  },
];

function HeroSection() {
  const [activeService, setActiveService] = useState(0);

  return (
    <section className="sp relative overflow-hidden bg-[#000c42] text-white/70">
      <SpBg
        patternId="sphex0"
        patternColor="#818cf8"
        orbs={[
          { pos: "-top-48 left-1/2 -translate-x-1/2", w:"1000px", h:"700px", color:"rgba(129,140,248,0.10)" },
          { pos: "-bottom-40 -left-28",                w:"650px",  h:"550px", color:"rgba(34,211,238,0.07)"  },
          { pos: "-bottom-40 -right-28",               w:"550px",  h:"450px", color:"rgba(168,85,247,0.07)"  },
        ]}
      />

      <div className="relative z-10 overflow-hidden border-b border-white/6 bg-[#000820]/85 py-1.75">
        <div className="sp-ticker flex w-max">
          {[...HERO_TICKER, ...HERO_TICKER].map((item, i) => (
            <span key={i} className="sp-mono inline-flex items-center gap-2.5 whitespace-nowrap border-r border-white/6 px-6 text-[11px]">
              <span className="inline-block h-1 w-1 rounded-full" style={{ background: item.color, opacity: .7 }}/>
              <span className="text-white/35">{item.label}</span>
              <span className="h-3 w-px bg-white/8"/>
              <span style={{ color: item.color }}>{item.value}</span>
              <span className="text-emerald-400/60">↑</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-indigo-400/22 bg-indigo-400/6 px-4 py-1.5">
              <span className="sp-blink inline-block h-1.25 w-1.25 rounded-full bg-indigo-400"/>
              <span className="sp-mono text-[11px] tracking-widest text-white/42 uppercase">6 Services · One Platform</span>
            </motion.div>
            <motion.h1 initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:.08 }}
              className="sp-syne text-[clamp(38px,6vw,76px)] font-extrabold leading-[1.01] tracking-[-0.038em] mb-5">
              <span className="sp-glitch block text-white" data-text="Crypto. Gift Cards.">Crypto. Gift Cards.</span>
              <span className="block" style={{ color:"rgba(255,255,255,.62)", fontWeight:700 }}>Bills. Airtime. Wallet.</span>
              <span className="sp-shimmer-text block italic">All in one app.</span>
            </motion.h1>

            <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:.17 }}
              className="text-base sm:text-[17px] leading-[1.8] text-white/40 max-w-120 mb-8">
              Trade gift cards for instant naira, swap crypto at live rates, pay DSTV and PHCN, recharge any network, get a virtual Mastercard — everything from a single, beautiful app.
            </motion.p>

            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.24 }}
              className="flex flex-wrap gap-2 mb-9 justify-center lg:justify-start">
              {SERVICES.map(svc => {
                const Icon = svc.icon;
                return (
                  <div key={svc.id}
                    className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium"
                    style={{ borderColor:`${svc.color}30`, background:`${svc.color}0d`, color:`${svc.color}` }}>
                    <Icon size={12}/>
                    {svc.label}
                  </div>
                );
              })}
            </motion.div>

            <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:.32 }}
              className="flex flex-col sm:flex-row gap-3 mb-12 w-full sm:w-auto">
              <button className="sp-cta group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-500 to-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_4px_28px_rgba(99,102,241,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(99,102,241,0.6)] active:scale-[.98] w-full sm:w-auto">
                <span className="sp-sweep pointer-events-none absolute inset-0 bg-white/22"/>
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5"/>
                </span>
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/4 px-8 py-3.5 text-sm font-medium text-white/55 hover:bg-white/8 hover:border-white/20 hover:text-white transition-all duration-200 active:scale-[.98] w-full sm:w-auto">
                Explore Services <ChevronRight size={14}/>
              </button>
            </motion.div>

            <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl lg:max-w-none">
              {HERO_STATS.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:.44 + i*.06 }}
                  className="sp-stat-line relative rounded-2xl border border-white/[.07] bg-white/3 px-3 py-4 text-center"
                  style={{ "--sc": s.glow }}>
                  <p className={`sp-syne text-xl sm:text-2xl font-extrabold ${s.cx} leading-none mb-1`}>{s.val}</p>
                  <p className="sp-mono text-[9px] text-white/28 tracking-widest uppercase">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity:0, x:32 }} animate={{ opacity:1, x:0 }}
            transition={{ delay:.2, duration:.65, ease:[0.22,1,0.36,1] }}
            className="hidden lg:block"
          >
            <div className="relative rounded-2xl border border-white/8 overflow-hidden"
              style={{ background:"rgba(0,6,32,.9)", backdropFilter:"blur(24px)" }}>
              <div className="h-px bg-linear-to-r from-transparent via-indigo-400/55 to-transparent"/>

              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="sp-blink inline-block h-1.25 w-1.25 rounded-full bg-cyan-400"/>
                  <span className="sp-mono text-[10px] text-white/28 tracking-[.12em]">XENRA PLATFORM · LIVE</span>
                </div>
                <div className="flex gap-1.25">
                  {["#FF5F57","#FEBC2E","#28C840"].map((c,i) => (
                    <div key={i} className="h-2 w-2 rounded-full opacity-70" style={{ background:c }}/>
                  ))}
                </div>
              </div>

              <div className="p-4 space-y-2">
                {PREVIEW_SERVICES.map((svc, i) => {
                  const Icon  = svc.icon;
                  const isAct = activeService === i;
                  return (
                    <motion.button
                      key={svc.label}
                      initial={{ opacity:0, x:16 }}
                      animate={{ opacity:1, x:0 }}
                      transition={{ delay:.3 + i*.07 }}
                      onClick={() => setActiveService(i)}
                      className="w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200"
                      style={{
                        borderColor: isAct ? `${svc.color}40` : "rgba(255,255,255,.06)",
                        background:  isAct ? `${svc.color}0e` : "rgba(255,255,255,.02)",
                      }}
                    >

                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/8"
                          style={{ background:`${svc.color}18` }}>
                          <Icon size={16} style={{ color:svc.color }}/>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white/85">{svc.label}</p>
                          <p className="sp-mono text-[10px] text-white/30 mt-0.5">{svc.sub}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className="sp-syne text-base font-extrabold leading-none" style={{ color:svc.color }}>{svc.value}</p>
                          <p className={`sp-mono text-[10px] mt-0.5 ${svc.statUp ? "text-emerald-400" : "text-red-400"}`}>{svc.stat}</p>
                        </div>
                        <div
                          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold shrink-0 transition-all duration-200"
                          style={{
                            background: isAct ? `${svc.color}22` : "rgba(255,255,255,.04)",
                            color:      isAct ? svc.color         : "rgba(255,255,255,.35)",
                            border:     `1px solid ${isAct ? svc.color+"38" : "rgba(255,255,255,.06)"}`,
                          }}
                        >
                          {svc.action}
                          <ArrowUpRight size={11}/>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService}
                  initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
                  transition={{ duration:.22 }}
                  className="overflow-hidden"
                >
                  {(() => {
                    const svc = PREVIEW_SERVICES[activeService];
                    const Icon = svc.icon;
                    return (
                      <div className="mx-4 mb-4 rounded-xl border px-5 py-4"
                        style={{ borderColor:`${svc.color}25`, background:`${svc.color}08` }}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Icon size={14} style={{ color:svc.color }}/>
                            <span className="sp-mono text-[10px] text-white/35 tracking-[.08em] uppercase">{svc.label} · Live Preview</span>
                          </div>
                          <span className="sp-mono text-[10px] text-emerald-400">✓ Available now</span>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="sp-syne text-3xl font-extrabold leading-none" style={{ color:svc.color, textShadow:`0 0 30px ${svc.color}40` }}>
                              {svc.value}
                            </p>
                            <p className="sp-mono text-[11px] text-white/30 mt-1">{svc.sub}</p>
                          </div>
                          <button className="sp-cta group relative overflow-hidden rounded-xl py-2.5 px-5 text-xs font-semibold text-white transition-all duration-200 hover:-translate-y-px"
                            style={{ background:`linear-gradient(135deg,${svc.color}ee,${svc.color}99)`, boxShadow:`0 4px 16px ${svc.color}30` }}>
                            <span className="sp-sweep pointer-events-none absolute inset-0 bg-white/20"/>
                            <span className="relative z-10 flex items-center gap-1.5">{svc.action} <ArrowRight size={12}/></span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>

              <div className="h-px bg-linear-to-r from-transparent via-white/6 to-transparent"/>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-3">
                <span className="sp-mono text-[9px] text-white/22 tracking-[.08em]">XENRA · 6 ACTIVE SERVICES</span>
                <div className="flex gap-1.5">
                  {PREVIEW_SERVICES.map((s, i) => (
                    <button key={i} onClick={() => setActiveService(i)}
                      className="h-1.25 rounded-full transition-all duration-200"
                      style={{ width: activeService === i ? "16px" : "5px", background: activeService === i ? s.color : "rgba(255,255,255,.15)" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function ServicesGrid() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="sp relative overflow-hidden bg-[#000820] text-white/70">
      <SpBg
        patternId="sphex1"
        orbs={[
          { pos: "top-0 left-1/2 -translate-x-1/2", w:"900px", h:"500px", color:"rgba(129,140,248,0.07)" },
          { pos: "bottom-0 left-0",                  w:"500px", h:"400px", color:"rgba(34,211,238,0.05)"  },
          { pos: "bottom-0 right-0",                 w:"500px", h:"400px", color:"rgba(168,85,247,0.05)"  },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">

        {/* Section label */}
        <div className="text-center mb-14">
          <motion.div initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5">
            <Wallet size={11} className="text-cyan-400"/>
            <span className="sp-mono text-[11px] tracking-widest text-white/40 uppercase">Platform Services</span>
          </motion.div>
          <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:.1 }}
            className="sp-syne text-[clamp(28px,4.5vw,52px)] font-extrabold leading-tight tracking-[-0.03em] text-white mb-4">
            Six ways to move money,
            <br/><span className="sp-shimmer-text">all in one app.</span>
          </motion.h2>
          <motion.p initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:.2 }}
            className="mx-auto max-w-xl text-base sm:text-lg text-white/38 leading-relaxed">
            Trade gift cards for instant cash, swap crypto at live rates, pay every bill, fund airtime — and carry it all in your Xenra wallet.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((svc, i) => {
            const Icon = svc.icon;
            const on   = hovered === svc.id;
            return (
              <motion.div
                key={svc.id}
                initial={{ opacity:0, y:28 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }}
                transition={{ delay: i * 0.08, duration:.5, ease:[0.22,1,0.36,1] }}
                onMouseEnter={() => setHovered(svc.id)}
                onMouseLeave={() => setHovered(null)}
                className={`sp-card relative rounded-2xl border ${svc.borderCx} overflow-hidden cursor-default`}
                style={{
                  background: on
                    ? `linear-gradient(150deg,${svc.glowColor.replace("0.12","0.15")},rgba(0,8,40,.94))`
                    : "rgba(0,8,40,.78)",
                  boxShadow: on
                    ? `0 10px 52px ${svc.glowColor}, inset 0 1px 0 rgba(255,255,255,.05)`
                    : "inset 0 1px 0 rgba(255,255,255,.03)",
                }}
              >

                <AnimatePresence>
                  {on && (
                    <motion.div
                      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                      className="pointer-events-none absolute -top-20 -right-20 w-48 h-48 rounded-full"
                      style={{ background:`radial-gradient(circle,${svc.color}18,transparent 70%)` }}
                    />
                  )}
                </AnimatePresence>


                <div className="h-0.5" style={{ background:`linear-gradient(90deg,transparent,${svc.color}55,transparent)` }}/>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border"
                      style={{ background:`${svc.color}18`, borderColor:`${svc.color}35` }}
                    >
                      <Icon size={22} style={{ color: svc.color }}/>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`sp-mono text-[10px] px-2.5 py-1 rounded-lg border ${svc.badgeCx}`}>
                        {svc.stat}
                      </span>
                      <span className="sp-mono text-[9px] px-2 py-0.5 rounded-md bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                        {svc.trend}
                      </span>
                    </div>
                  </div>
                  <h3 className="sp-syne text-[19px] font-bold text-white tracking-[-0.01em] mb-2.5">
                    {svc.label}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed mb-5">{svc.desc}</p>
                  <ul className="space-y-2 mb-6">
                    {svc.perks.map(p => (
                      <li key={p} className="flex items-center gap-2.5">
                        <CheckCircle2 size={13} style={{ color:svc.color }} className="shrink-0"/>
                        <span className="text-xs text-white/45">{p}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`sp-cta group relative w-full overflow-hidden rounded-xl bg-linear-to-r ${svc.ctaColor} py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px active:scale-[.98]`}
                    style={{ boxShadow:`0 4px 18px ${svc.ctaShadow}` }}
                  >
                    <span className="sp-sweep pointer-events-none absolute inset-0 bg-white/20"/>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Get Started
                      <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5"/>
                    </span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const COMPLIANCE = ["CBN Licensed", "ISO 27001", "PCI DSS", "SOC 2 Type II", "NDIC Insured"];

function TrustSection() {
  return (
    <section className="sp relative overflow-hidden bg-[#000c42] text-white/70">
      <SpBg
        patternId="sphex2"
        patternColor="#34d399"
        orbs={[
          { pos: "top-0 left-1/2 -translate-x-1/2", w:"900px", h:"500px", color:"rgba(34,211,238,0.06)"  },
          { pos: "bottom-0 right-0",                 w:"600px", h:"400px", color:"rgba(129,140,248,0.06)" },
          { pos: "bottom-0 left-0",                  w:"400px", h:"300px", color:"rgba(168,85,247,0.05)"  },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="lg:grid lg:grid-cols-2 lg:gap-20 lg:items-center">

          {/* Left: copy */}
          <motion.div initial={{ opacity:0, x:-24 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
            className="mb-14 lg:mb-0">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5">
              <Lock size={11} className="text-cyan-400"/>
              <span className="sp-mono text-[11px] tracking-widest text-white/40 uppercase">Security & Trust</span>
            </div>

            <h2 className="sp-syne text-[clamp(26px,4vw,48px)] font-extrabold leading-tight tracking-[-0.03em] text-white mb-5">
              Built on trust.
              <br/><span className="sp-shimmer-text">Secured by design.</span>
            </h2>

            <p className="text-base text-white/38 leading-relaxed mb-8 max-w-md">
              Every transaction on Xenra is protected by multiple layers of enterprise-grade security. Licensed, audited, and built to exceed every industry standard.
            </p>
            <div className="flex flex-wrap gap-2.5 mb-8">
              {COMPLIANCE.map(b => (
                <div key={b} className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/3 px-3.5 py-2">
                  <ShieldCheck size={11} className="text-cyan-400"/>
                  <span className="sp-mono text-[10px] text-white/45 tracking-[.05em]">{b}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                "Zero unauthorized transaction guarantee",
                "Instant card freeze & account lock",
                "NDIC-insured wallet balances",
                "Biometric login support",
                "24/7 fraud response team",
                "Regular third-party security audits",
              ].map(p => (
                <div key={p} className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5"/>
                  <span className="text-sm text-white/48">{p}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TRUST_CARDS.map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div key={t.title}
                  initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*.09 }}
                  className={`sp-trust rounded-2xl border ${t.border} ${t.bg} p-5`}>
                  <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border ${t.border}`}>
                    <Icon size={20} className={t.cx}/>
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-2">{t.title}</h4>
                  <p className="text-xs text-white/38 leading-relaxed">{t.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="sp relative overflow-hidden bg-[#000820] text-white/70">
      <SpBg
        patternId="sphex3"
        orbs={[
          { pos: "top-0 left-1/2 -translate-x-1/2", w:"900px", h:"600px", color:"rgba(129,140,248,0.08)" },
          { pos: "bottom-0 left-0",                  w:"500px", h:"400px", color:"rgba(34,211,238,0.06)"  },
          { pos: "bottom-0 right-0",                 w:"500px", h:"400px", color:"rgba(168,85,247,0.06)"  },
        ]}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="relative rounded-3xl border border-white/[.07] overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-cyan-500/8 via-indigo-600/10 to-purple-600/8"/>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(0,0,0,0.04)_3px,rgba(0,0,0,0.04)_4px)]"/>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[.03]">
            <Wallet size={340} className="text-indigo-400"/>
          </div>
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 rounded-full border border-dashed border-white/4"/>

          <div className="h-px bg-linear-to-r from-transparent via-cyan-400/50 to-transparent"/>

          <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-14 sm:py-20 text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/3 px-4 py-1.5">
              <span className="sp-blink inline-block h-1.25 w-1.25 rounded-full bg-cyan-400"/>
              <span className="sp-mono text-[10px] tracking-widest text-white/32 uppercase">Join 500,000+ users</span>
            </div>

            <h2 className="sp-syne text-[clamp(28px,5vw,58px)] font-extrabold text-white leading-tight tracking-[-0.035em] max-w-2xl">
              Start transacting
              <br/><span className="sp-shimmer-text">across the globe today.</span>
            </h2>

            <p className="text-base text-white/38 max-w-md leading-relaxed">
              Free to sign up — no credit card required. Everything you need to send, receive, trade, and spend money globally.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:w-auto">
              <button className="sp-cta group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-500 to-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-[0_4px_28px_rgba(99,102,241,0.42)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_40px_rgba(99,102,241,0.6)] active:scale-[.98] w-full sm:w-auto">
                <span className="sp-sweep pointer-events-none absolute inset-0 bg-white/22"/>
                <span className="relative z-10 flex items-center gap-2">
                  Create Free Account
                  <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5"/>
                </span>
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/4 px-7 py-4 text-sm font-medium text-white/55 hover:bg-white/8 hover:text-white transition-all duration-200 w-full sm:w-auto">
                Explore Services <ChevronRight size={14}/>
              </button>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-1">
              {[
                { icon:ShieldCheck, label:"Bank-grade security",  cx:"text-cyan-400"   },
                { icon:Zap,         label:"Instant settlement",   cx:"text-indigo-400" },
                { icon:Globe,       label:"150+ countries",       cx:"text-purple-400" },
                { icon:RefreshCw,   label:"0% hidden fees",       cx:"text-emerald-400"},
              ].map(({ icon:Icon, label, cx }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <Icon size={12} className={cx}/>
                  <span className="sp-mono text-[10px] text-white/25 tracking-[.05em]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-linear-to-r from-transparent via-indigo-400/40 to-transparent"/>
          <div className="h-px mt-px bg-linear-to-r from-transparent via-purple-400/22 to-transparent"/>
        </motion.div>
      </div>
    </section>
  );
}


export default function ServicesPage() {
  return (
    <>
      <style>{STYLES}</style>
      <main>
        <HeroSection/>
        <ServicesGrid/>
        <TrustSection/>
        <CTASection/>
      </main>
    </>
  );
}