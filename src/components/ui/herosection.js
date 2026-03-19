"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Globe, Gift, Coins } from "lucide-react";

const TABS = [
  {
    id: "payments",
    label: "Remittance",
    icon: Globe,
    accent: "cyan",
    color: "#22d3ee",
    border: "border-cyan-400/30",
    activeBg: "bg-cyan-400/10",
    iconActive: "text-cyan-400",
    iconIdle: "text-white/25",
    labelActive: "text-cyan-400",
    labelIdle: "text-white/25",
    bar: "bg-cyan-400",
    badge: "bg-cyan-400/10 border border-cyan-400/25 text-cyan-400",
    glow: "rgba(34,211,238,0.12)",
    shadow: "0 0 40px rgba(34,211,238,0.2)",
    panelBorder: "border-cyan-400/[.12]",
    trendBg: "bg-cyan-400/10 border border-cyan-400/25 text-cyan-400",
    valueCx: "text-cyan-400",
  },
  {
    id: "giftcards",
    label: "Gift Cards",
    icon: Gift,
    accent: "indigo",
    color: "#818cf8",
    border: "border-indigo-400/30",
    activeBg: "bg-indigo-400/10",
    iconActive: "text-indigo-400",
    iconIdle: "text-white/25",
    labelActive: "text-indigo-400",
    labelIdle: "text-white/25",
    bar: "bg-indigo-400",
    badge: "bg-indigo-400/10 border border-indigo-400/25 text-indigo-400",
    glow: "rgba(129,140,248,0.12)",
    shadow: "0 0 40px rgba(129,140,248,0.2)",
    panelBorder: "border-indigo-400/[.12]",
    trendBg: "bg-indigo-400/10 border border-indigo-400/25 text-indigo-400",
    valueCx: "text-indigo-400",
  },
  {
    id: "crypto",
    label: "Crypto",
    icon: Coins,
    accent: "emerald",
    color: "#34d399",
    border: "border-emerald-400/30",
    activeBg: "bg-emerald-400/10",
    iconActive: "text-emerald-400",
    iconIdle: "text-white/25",
    labelActive: "text-emerald-400",
    labelIdle: "text-white/25",
    bar: "bg-emerald-400",
    badge: "bg-emerald-400/10 border border-emerald-400/25 text-emerald-400",
    glow: "rgba(52,211,153,0.12)",
    shadow: "0 0 40px rgba(52,211,153,0.2)",
    panelBorder: "border-emerald-400/[.12]",
    trendBg: "bg-emerald-400/10 border border-emerald-400/25 text-emerald-400",
    valueCx: "text-emerald-400",
  },
];

const PANEL_DATA = {
  payments: {
    label: "International Transfer",
    pair: "USD → NGN",
    display: "₦1,985,000",
    base: "$1,250.00",
    sub: "1 USD = ₦1,588.00",
    trend: "+0.32%",
    bars: [48, 55, 62, 45, 70, 58, 75, 65, 80, 68, 85, 72, 78, 90, 95],
  },
  giftcards: {
    label: "Gift Card Trade",
    pair: "Amazon $100",
    display: "₦95,000",
    base: "Face value $100",
    sub: "95% payout rate",
    trend: "Instant",
    bars: [60, 72, 55, 80, 68, 90, 74, 82, 65, 88, 70, 94, 78, 85, 98],
  },
  crypto: {
    label: "Crypto Swap",
    pair: "BTC → USDT",
    display: "$2,413.44",
    base: "0.035 BTC",
    sub: "Live market rate",
    trend: "↑$68,955",
    bars: [52, 48, 65, 42, 70, 55, 80, 62, 74, 85, 68, 90, 72, 95, 88],
  },
};

const TICKER_ITEMS = [
  "USD/NGN ₦1,585.00 ↑0.12%", "BTC/USDT $67,240 ↑1.43%", "ETH/USDT $3,521 ↓0.87%",
  "Amazon $100 → ₦95,000", "iTunes $50 → ₦46,500", "Steam $25 → ₦23,750",
  "BNB/USDT $580 ↑2.1%", "GBP/NGN ₦2,009 ↑0.32%",
];

const STATS = [
  { value: "150+",    sub: "Countries",  cx: "text-cyan-400"   },
  { value: "Instant", sub: "Settlement", cx: "text-indigo-400" },
  { value: "24/7",    sub: "Always On",  cx: "text-purple-500" },
];

export default function XenraHero() {
  const [active, setActive]       = useState("payments");
  const [tilt, setTilt]           = useState({ x: 0, y: 0 });
  const [isTilting, setIsTilting] = useState(false);
  const cardRef = useRef(null);

  const tab  = TABS.find((t) => t.id === active);
  const data = PANEL_DATA[active];

  const onMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    setTilt({ x: y * 12, y: x * -12 });
  }, []);

  const onMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsTilting(false);
  }, []);

  return (
    <>
      <section className="font-dm bg-[#000c42] text-white/90 min-h-screen relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0">
          <svg width="100%" height="100%" className="absolute inset-0 xn-hex-bg">
            <defs>
              <pattern id="xhex" width="56" height="48.5" patternUnits="userSpaceOnUse">
                <polygon points="28,2 52,14 52,38 28,50 4,38 4,14" fill="none" stroke="#22d3ee" strokeWidth=".5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#xhex)"/>
          </svg>
          <div className="absolute rounded-full -top-[18%] left-[38%] w-175 h-175 bg-[radial-gradient(circle,rgba(34,211,238,0.09)_0%,transparent_70%)]"/>
          <div className="absolute rounded-full -bottom-[22%] -right-[6%] w-137.5 h-137.5 bg-[radial-gradient(circle,rgba(168,85,247,0.07)_0%,transparent_70%)]"/>
          <div className="absolute rounded-full -bottom-[18%] -left-[8%] w-125 h-125 bg-[radial-gradient(circle,rgba(129,140,248,0.06)_0%,transparent_70%)]"/>
          {/* Scanlines */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(0,0,0,0.05)_3px,rgba(0,0,0,0.05)_4px)]"/>
          {/* Scan beam */}
          <div className="anim-scan absolute left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.15),transparent)]"/>
        </div>

        {/* ── Ticker ───────────────────────────────────────────────── */}
        <div className="relative z-10 border-b border-cyan-400/10 bg-[#000834]/85 py-1.75 overflow-hidden">
          <div className="flex anim-ticker w-max">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span
                key={i}
                className={`font-mono-sp text-[11px] px-6 border-r border-cyan-400/10 whitespace-nowrap ${
                  item.includes("↑") ? "text-cyan-400" :
                  item.includes("↓") ? "text-red-400"  :
                  "text-white/38"
                }`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mb-7 inline-flex items-center gap-2 border border-cyan-400/18 bg-cyan-400/5 rounded-full px-4 py-1.75"
              >
                <ShieldCheck size={13} className="text-cyan-400 shrink-0"/>
                <span className="font-mono-sp text-[10px] sm:text-[11px] text-white/50 tracking-[.07em]">
                  TRUSTED DIGITAL FINANCE INFRASTRUCTURE
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}
                className="font-syne font-extrabold leading-[1.02] tracking-[-0.03em] mb-5 text-[clamp(38px,8vw,80px)]"
              >
                <span className="xn-glitch block text-white" data-text=" All-In-One"> All-In-One</span>
                <span className="block text-white/70 font-bold">Payment & Trading Hub</span>
                <span className="xn-shimmer block italic">Built For The&nbsp;Net.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}
                className="text-[15px] sm:text-[17px] leading-[1.75] text-white/48 max-w-115 mb-9"
              >
                A unified financial experience buy and sell gift cards, swap crypto assets securely, pay bills, and spend globally with virtual cards, all in one sleek platform.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }}
                className="flex flex-col sm:flex-row gap-3 mb-12 w-full sm:w-auto"
              >
                <button className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[15px] tracking-[-0.01em] bg-linear-to-r from-cyan-400 to-indigo-400 text-white border-0 cursor-pointer shadow-[0_6px_28px_rgba(99,102,241,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(99,102,241,0.5)] w-full sm:w-auto">
                  Start Using Xenra <ArrowRight size={15}/>
                </button>
                <button className="inline-flex items-center justify-center gap-2 px-7 py-3.25 rounded-xl font-medium text-[15px] bg-white/4 text-white/65 border border-white/12 cursor-pointer transition-all duration-200 hover:bg-white/8 hover:border-cyan-400/30 hover:text-cyan-400 w-full sm:w-auto">
                  Explore Features
                </button>
              </motion.div>


              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4 }}
                className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full max-w-105 lg:max-w-none"
              >
                {STATS.map((s) => (
                  <div
                    key={s.sub}
                    className="xn-stat-line relative bg-white/3 border border-white/[.07] rounded-2xl px-3 sm:px-4 pt-5 pb-4"
                    style={{ "--sc": s.cx.includes("cyan") ? "#22d3ee" : s.cx.includes("indigo") ? "#818cf8" : "#a855f7" }}
                  >
                    <div className={`font-syne font-extrabold text-xl sm:text-2xl leading-none mb-1 ${s.cx}`}>{s.value}</div>
                    <div className="font-mono-sp text-[9px] sm:text-[10px] text-white/30 tracking-[.08em] uppercase">{s.sub}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── RIGHT ────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .18, duration: .5 }}
              className="w-full mt-4 lg:mt-0"
            >
              <div
                ref={cardRef}
                className={`relative rounded-3xl border border-cyan-400/8 ${isTilting ? "anim-no" : "anim-float"}`}
                onMouseMove={(e) => { setIsTilting(true); onMouseMove(e); }}
                onMouseLeave={onMouseLeave}
              >
                {/* Holographic spinning border */}
                <div className="xn-holo rounded-3xl"/>

                {/* Card body */}
                <div
                  className="relative rounded-3xl bg-[#00061f]/90 backdrop-blur-xl p-5 sm:p-7 shadow-[0_28px_80px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.05)]"
                  style={{
                    transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transition: isTilting ? "transform .12s ease-out" : "transform .5s ease-out",
                  }}
                >
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center gap-2">
                      <span className="anim-pulse inline-block w-1.5 h-1.5 rounded-full bg-cyan-400"/>
                      <span className="font-mono-sp text-[10px] text-white/28 tracking-[.12em]">XENRA · LIVE TERMINAL</span>
                    </div>
                    <div className="flex gap-1.25">
                      {["#FF5F57","#FEBC2E","#28C840"].map((c, i) => (
                        <div key={i} className="w-2 h-2 rounded-full opacity-70" style={{ background: c }}/>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-1.5 sm:gap-2 mb-4">
                    {TABS.map((t) => {
                      const Icon = t.icon;
                      const on = active === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setActive(t.id)}
                          className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-1.5 rounded-xl border transition-all duration-200 cursor-pointer bg-transparent ${
                            on ? `${t.border} ${t.activeBg}` : "border-white/5 hover:bg-white/4"
                          }`}
                        >
                          <Icon size={14} className={on ? t.iconActive : t.iconIdle}/>
                          <span className={`font-mono-sp text-[9px] tracking-[.06em] uppercase ${on ? t.labelActive : t.labelIdle}`}>
                            {t.label}
                          </span>
                          {on && <div className={`w-3.5 h-0.5 rounded-sm ${t.bar}`}/>}
                        </button>
                      );
                    })}
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: .22 }}
                      className={`bg-black/40 border ${tab.panelBorder} rounded-2xl p-4 sm:p-5 mb-3.5`}
                    >
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <div>
                          <div className="font-mono-sp text-[10px] text-white/30 tracking-widest uppercase mb-1">{data.label}</div>
                          <div className="text-base sm:text-lg font-semibold text-white/88 tracking-[-0.01em]">{data.pair}</div>
                        </div>
                        <span className={`font-mono-sp text-[11px] px-2.5 py-1 rounded-lg shrink-0 ${tab.trendBg}`}>
                          {data.trend}
                        </span>
                      </div>

                      <div
                        className={`font-syne font-extrabold text-[32px] sm:text-[40px] leading-none mb-2 tracking-[-0.025em] ${tab.valueCx}`}
                        style={{ textShadow: `0 0 40px ${tab.color}35` }}
                      >
                        {data.display}
                      </div>

                      <div className="flex justify-between flex-wrap gap-1 mb-4">
                        <span className="font-mono-sp text-[11px] text-white/34">{data.base}</span>
                        <span className="font-mono-sp text-[11px] text-white/24">{data.sub}</span>
                      </div>

                      <div className="flex items-end gap-0.75 h-8 sm:h-9">
                        {data.bars.map((h, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-t-xs transition-opacity duration-300 ${tab.bar}`}
                            style={{ height: `${h}%`, opacity: i === 14 ? 1 : 0.12 + (i / 14) * 0.48 }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div className="flex gap-3 flex-wrap">
                      {["0% Fee", "Insured", "Instant"].map((t) => (
                        <span key={t} className="font-mono-sp text-[10px] text-white/26 tracking-[.03em]">✓ {t}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="anim-pulse inline-block w-1.25 h-1.25 rounded-full bg-cyan-400"/>
                      <span className="font-mono-sp text-[10px] text-cyan-400 tracking-widest">LIVE</span>
                    </div>
                  </div>

                  {/* Corner bracket accents */}
                  {[["top-3","left-3"],["top-3","right-3"],["bottom-3","left-3"],["bottom-3","right-3"]].map(([v, h], i) => (
                    <div
                      key={i}
                      className="absolute w-3.5 h-3.5 pointer-events-none transition-[border-color] duration-300"
                      style={{
                        [v.split("-")[0]]: "12px",
                        [h.split("-")[0]]: "12px",
                        borderTop:    v.startsWith("top")    ? `1px solid ${tab.color}55` : "none",
                        borderBottom: v.startsWith("bottom") ? `1px solid ${tab.color}55` : "none",
                        borderLeft:   h.startsWith("left")   ? `1px solid ${tab.color}55` : "none",
                        borderRight:  h.startsWith("right")  ? `1px solid ${tab.color}55` : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        <div className="relative z-10 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.55),rgba(129,140,248,0.4),rgba(168,85,247,0.3),transparent)]"/>
      </section>
    </>
  );
}
