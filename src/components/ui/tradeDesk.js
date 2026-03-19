"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Gift, ArrowRight, ArrowLeftRight, ChevronRight } from "lucide-react";


const CRYPTO_RATES = [
  { coin: "BTC",  name: "Bitcoin",  price: "$67,240", ngn: "₦107.8M", change: "+1.43%", up: true,  color: "#f59e0b" },
  { coin: "ETH",  name: "Ethereum", price: "$3,521",  ngn: "₦5.67M",  change: "-0.87%", up: false, color: "#818cf8" },
  { coin: "USDT", name: "Tether",   price: "₦1,610",  ngn: "₦1,610",  change: "+0.05%", up: true,  color: "#34d399" },
  { coin: "BNB",  name: "BNB",      price: "$580",    ngn: "₦933K",   change: "+2.10%", up: true,  color: "#f59e0b" },
  { coin: "SOL",  name: "Solana",   price: "$178",    ngn: "₦286K",   change: "+3.21%", up: true,  color: "#a855f7" },
];

const BRANDS = ["Amazon", "iTunes", "Steam", "Google Play", "Netflix", "Xbox", "eBay"];

const SELL_RATES = {
  Amazon: { rate: 950, pct: "95%" },
  iTunes: { rate: 930, pct: "93%" },
  Steam:  { rate: 940, pct: "94%" },
  "Google Play": { rate: 920, pct: "92%" },
  Netflix:{ rate: 910, pct: "91%" },
  Xbox:   { rate: 945, pct: "94.5%" },
  eBay:   { rate: 900, pct: "90%" },
};

const BUY_RATES = {
  Amazon: 980, iTunes: 960, Steam: 955,
  "Google Play": 945, Netflix: 935, Xbox: 970, eBay: 920,
};

const AMOUNTS = ["$25","$50","$100","$200","$500"];

export default function TradeDesk() {
  const [gcTab,    setGcTab]    = useState("sell");
  const [brand,    setBrand]    = useState("Amazon");
  const [amount,   setAmount]   = useState("$100");
  const [cryptoSel,setCryptoSel]= useState(null);

  const amtNum  = parseInt(amount.replace("$",""));
  const sellOut = (amtNum * SELL_RATES[brand].rate).toLocaleString();
  const buyOut  = (amtNum * BUY_RATES[brand]).toLocaleString();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400&family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        .td       { font-family:'DM Sans',sans-serif; }
        .td-syne  { font-family:'Syne',sans-serif; }
        .td-mono  { font-family:'Space Mono',monospace; }

        @keyframes td-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes td-pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.15;transform:scale(.55)} }
        @keyframes td-scan    { 0%{top:-2px} 100%{top:110%} }
        @keyframes td-sweep   { from{transform:translateX(-110%) skewX(-18deg)} to{transform:translateX(110%) skewX(-18deg)} }

        .td-shimmer {
          background:linear-gradient(90deg,#22d3ee 0%,#e0e7ff 28%,#818cf8 52%,#a855f7 78%,#22d3ee 100%);
          background-size:250% auto;
          -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;
          animation:td-shimmer 5s linear infinite;
        }
        .td-blink  { animation:td-pulse 1.4s ease-in-out infinite; }
        .td-scan   { animation:td-scan 9s ease-in-out infinite; }
        .td-cta:hover .td-sweep { animation:td-sweep .55s ease-out forwards; }
        .td-row    { transition:background .15s,border-color .15s; }
        .td-row:hover { background:rgba(255,255,255,.04)!important; border-color:rgba(255,255,255,.14)!important; }
      `}</style>

      <section className="td relative overflow-hidden bg-[#000820] text-white/70">

        <div className="pointer-events-none absolute inset-0 -z-10">
          <svg width="100%" height="100%" className="absolute inset-0 opacity-[.04]">
            <defs>
              <pattern id="tdhex" width="56" height="48.5" patternUnits="userSpaceOnUse">
                <polygon points="28,2 52,14 52,38 28,50 4,38 4,14" fill="none" stroke="#22d3ee" strokeWidth=".5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tdhex)"/>
          </svg>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-100 bg-[radial-gradient(ellipse,rgba(34,211,238,0.06)_0%,transparent_70%)]"/>
          <div className="absolute bottom-0 right-0 w-150 h-100 bg-[radial-gradient(ellipse,rgba(129,140,248,0.06)_0%,transparent_70%)]"/>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(0,0,0,0.04)_3px,rgba(0,0,0,0.04)_4px)]"/>
          <div className="td-scan absolute left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.1),transparent)]"/>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">

          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5"
            >
              <ArrowLeftRight size={11} className="text-cyan-400"/>
              <span className="td-mono text-[11px] tracking-widest text-white/40 uppercase">Live Trade Desk</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .1 }}
              className="td-syne text-[clamp(30px,4.8vw,54px)] font-extrabold leading-tight tracking-[-0.03em] text-white mb-4"
            >
              Best rates.
              <br /><span className="td-shimmer">Instant payouts.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .2 }}
              className="mx-auto max-w-lg text-base sm:text-lg text-white/38 leading-relaxed"
            >
              Real-time crypto exchange and the best gift card rates in Nigeria — no middlemen, no surprises.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <motion.div
              initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-2xl border border-cyan-400/15 overflow-hidden"
              style={{ background: "rgba(0,12,42,.88)", backdropFilter: "blur(20px)" }}
            >
              <div className="h-px bg-linear-to-r from-transparent via-cyan-400/55 to-transparent"/>

              <div className="p-6 sm:p-8">
                {/* Panel header */}
                <div className="flex items-start justify-between mb-7">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Coins size={16} className="text-cyan-400"/>
                      <span className="td-mono text-[11px] text-white/32 tracking-[.12em] uppercase">Crypto → Cash</span>
                    </div>
                    <h3 className="td-syne text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Crypto Exchange</h3>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl border border-cyan-400/22 bg-cyan-400/8 px-3 py-1.5 shrink-0">
                    <span className="td-blink inline-block h-1.25 w-1.25 rounded-full bg-cyan-400"/>
                    <span className="td-mono text-[9px] text-cyan-400 tracking-widest">LIVE RATES</span>
                  </div>
                </div>

                <div className="space-y-2 mb-7">
                  {CRYPTO_RATES.map((c, i) => (
                    <motion.button
                      key={c.coin}
                      initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * .07 }}
                      onClick={() => setCryptoSel(cryptoSel === c.coin ? null : c.coin)}
                      className={`td-row w-full flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all ${
                        cryptoSel === c.coin
                          ? "border-cyan-400/30 bg-cyan-400/8"
                          : "border-white/6 bg-white/2"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 shrink-0"
                          style={{ background: `${c.color}20` }}
                        >
                          <span className="td-mono text-[11px] font-bold" style={{ color: c.color }}>{c.coin[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white/88">{c.coin}</p>
                          <p className="td-mono text-[10px] text-white/28">{c.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-white/85">{c.price}</p>
                          <p className="td-mono text-[10px] text-white/30">{c.ngn}</p>
                        </div>
                        <span className={`td-mono text-[10px] px-2 py-0.5 rounded-lg min-w-14.5 text-center ${
                          c.up ? "bg-emerald-400/10 text-emerald-400" : "bg-red-400/10 text-red-400"
                        }`}>
                          {c.change}
                        </span>
                        <ChevronRight size={14} className={`transition-transform ${cryptoSel === c.coin ? "rotate-90 text-cyan-400" : "text-white/18"}`}/>
                      </div>
                    </motion.button>
                  ))}
                </div>


                <AnimatePresence>
                  {cryptoSel && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: .22 }}
                      className="overflow-hidden mb-7"
                    >
                      <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-5 py-4">
                        <p className="td-mono text-[10px] text-white/30 tracking-widest uppercase mb-3">Sell {cryptoSel} → NGN</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="td-mono text-[10px] text-white/28 mb-1">You send</p>
                            <p className="td-syne text-xl font-extrabold text-white">0.035 {cryptoSel}</p>
                          </div>
                          <ArrowRight size={16} className="text-cyan-400"/>
                          <div className="text-right">
                            <p className="td-mono text-[10px] text-white/28 mb-1">You receive</p>
                            <p className="td-syne text-xl font-extrabold text-cyan-400">
                              {cryptoSel === "BTC" ? "₦235,400" : cryptoSel === "ETH" ? "₦5,670" : "₦1,610"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button className="td-cta group relative w-full overflow-hidden rounded-xl bg-linear-to-r from-cyan-500 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(34,211,238,0.22)] transition-all duration-200 hover:-translate-y-px">
                  <span className="td-sweep pointer-events-none absolute inset-0 bg-white/20"/>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Trading <ArrowRight size={14}/>
                  </span>
                </button>
              </div>

              <div className="h-px bg-linear-to-r from-transparent via-cyan-400/22 to-transparent"/>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-2xl border border-indigo-400/15 overflow-hidden"
              style={{ background: "rgba(0,12,42,.88)", backdropFilter: "blur(20px)" }}
            >
              <div className="h-px bg-linear-to-r from-transparent via-indigo-400/55 to-transparent"/>

              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between mb-7">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <Gift size={16} className="text-indigo-400"/>
                      <span className="td-mono text-[11px] text-white/32 tracking-[.12em] uppercase">Gift Cards</span>
                    </div>
                    <h3 className="td-syne text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {gcTab === "sell" ? "Sell Gift Cards" : "Buy Gift Cards"}
                    </h3>
                  </div>

                  <div className="flex rounded-xl border border-white/8 bg-white/4 p-1 shrink-0">
                    {["sell", "buy"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setGcTab(t)}
                        className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                          gcTab === t
                            ? "bg-indigo-500 text-white shadow-sm"
                            : "text-white/35 hover:text-white/65"
                        }`}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <p className="td-mono text-[10px] text-white/28 tracking-widest uppercase mb-3">Select Brand</p>
                  <div className="flex flex-wrap gap-2">
                    {BRANDS.map((b) => (
                      <button
                        key={b}
                        onClick={() => setBrand(b)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                          brand === b
                            ? "bg-indigo-500 border border-indigo-400/50 text-white"
                            : "border border-white/[.07] bg-white/3 text-white/40 hover:border-indigo-400/30 hover:text-white/70"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <p className="td-mono text-[10px] text-white/28 tracking-widest uppercase mb-3">Card Value</p>
                  <div className="flex flex-wrap gap-2">
                    {AMOUNTS.map((a) => (
                      <button
                        key={a}
                        onClick={() => setAmount(a)}
                        className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-all duration-150 ${
                          amount === a
                            ? "bg-indigo-500 border border-indigo-400/50 text-white"
                            : "border border-white/[.07] bg-white/3 text-white/40 hover:border-indigo-400/30 hover:text-white/70"
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={brand + gcTab + amount}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: .18 }}
                    className="rounded-xl border border-indigo-400/18 mb-6 overflow-hidden"
                    style={{ background: "rgba(0,0,0,.35)" }}
                  >
                    <div className="px-5 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="td-mono text-[10px] text-white/28 tracking-[.08em] uppercase mb-1.5">
                            {gcTab === "sell" ? "You trade" : "You pay"}
                          </p>
                          <p className="td-syne text-2xl font-extrabold text-white leading-none">{amount} {brand}</p>
                        </div>
                        <div className="h-8 w-px bg-white/[.07] shrink-0"/>
                        <div className="text-right">
                          <p className="td-mono text-[10px] text-white/28 tracking-[.08em] uppercase mb-1.5">
                            {gcTab === "sell" ? "You receive" : "You get"}
                          </p>
                          <p className="td-syne text-2xl font-extrabold text-indigo-400 leading-none">
                            ₦{gcTab === "sell" ? sellOut : buyOut}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/5 px-5 py-3 flex items-center justify-between">
                      <span className="td-mono text-[10px] text-white/22">
                        Rate: 1 USD = ₦{gcTab === "sell" ? SELL_RATES[brand].rate : BUY_RATES[brand]}
                      </span>
                      {gcTab === "sell" && (
                        <span className="td-mono text-[10px] text-emerald-400">
                          {SELL_RATES[brand].pct} payout ✓
                        </span>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <button className={`td-cta group relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(129,140,248,0.22)] transition-all duration-200 hover:-translate-y-px bg-linear-to-r ${
                  gcTab === "sell" ? "from-indigo-500 to-purple-600" : "from-purple-500 to-indigo-600"
                }`}>
                  <span className="td-sweep pointer-events-none absolute inset-0 bg-white/20"/>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {gcTab === "sell" ? "Sell Gift Card" : "Buy Gift Card"} <ArrowRight size={14}/>
                  </span>
                </button>
              </div>

              <div className="h-px bg-linear-to-r from-transparent via-indigo-400/22 to-transparent"/>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
