"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, ArrowRight, ChevronUp, ChevronDown, Search, RefreshCw } from "lucide-react";

const RATES_TABLE = [
  { brand:"Amazon",      abbr:"AMZ", color:"#f59e0b", cat:"Shopping",      r25:940, r50:945, r100:950, r200:952, r500:955, trend:"up",   change:"+0.8%" },
  { brand:"iTunes",      abbr:"iTN", color:"#818cf8", cat:"Entertainment", r25:920, r50:925, r100:930, r200:932, r500:935, trend:"up",   change:"+0.5%" },
  { brand:"Steam",       abbr:"STM", color:"#22d3ee", cat:"Gaming",        r25:935, r50:938, r100:940, r200:942, r500:945, trend:"down", change:"-0.2%" },
  { brand:"Google Play", abbr:"GP",  color:"#34d399", cat:"App Store",     r25:910, r50:915, r100:920, r200:922, r500:925, trend:"up",   change:"+0.3%" },
  { brand:"Netflix",     abbr:"NFX", color:"#f87171", cat:"Streaming",     r25:905, r50:908, r100:910, r200:912, r500:915, trend:"down", change:"-0.4%" },
  { brand:"Xbox",        abbr:"XBX", color:"#34d399", cat:"Gaming",        r25:930, r50:935, r100:945, r200:947, r500:950, trend:"up",   change:"+1.1%" },
  { brand:"eBay",        abbr:"EBY", color:"#f59e0b", cat:"Shopping",      r25:895, r50:898, r100:900, r200:902, r500:905, trend:"flat", change:"0.0%"  },
  { brand:"Walmart",     abbr:"WMT", color:"#22d3ee", cat:"Shopping",      r25:930, r50:933, r100:935, r200:937, r500:940, trend:"up",   change:"+0.6%" },
  { brand:"Spotify",     abbr:"SPT", color:"#22d3ee", cat:"Music",         r25:918, r50:920, r100:923, r200:925, r500:928, trend:"up",   change:"+0.2%" },
  { brand:"Nike",        abbr:"NKE", color:"#818cf8", cat:"Fashion",       r25:925, r50:928, r100:930, r200:932, r500:935, trend:"down", change:"-0.1%" },
  { brand:"Sephora",     abbr:"SPH", color:"#f87171", cat:"Beauty",        r25:920, r50:923, r100:925, r200:927, r500:930, trend:"up",   change:"+0.4%" },
  { brand:"Razer Gold",  abbr:"RZR", color:"#34d399", cat:"Gaming",        r25:928, r50:932, r100:938, r200:940, r500:943, trend:"up",   change:"+0.9%" },
];

const COLS = ["Brand","$25","$50","$100","$200","$500","24h Change","Action"];

export default function GiftCardRates() {
  const [search,  setSearch]  = useState("");
  const [sortAmt, setSortAmt] = useState("r100");
  const [sortDir, setSortDir] = useState("desc");

  const handleSort = (key) => {
    if (sortAmt === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortAmt(key); setSortDir("desc"); }
  };

  const filtered = RATES_TABLE
    .filter(r => r.brand.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => sortDir === "desc" ? b[sortAmt] - a[sortAmt] : a[sortAmt] - b[sortAmt]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        .gr        { font-family:'DM Sans',sans-serif; }
        .gr-syne   { font-family:'Syne',sans-serif; }
        .gr-mono   { font-family:'Space Mono',monospace; }

        @keyframes gr-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes gr-pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.15;transform:scale(.55)} }
        @keyframes gr-scan    { 0%{top:-2px} 100%{top:110%} }
        @keyframes gr-sweep   { from{transform:translateX(-110%) skewX(-18deg)} to{transform:translateX(110%) skewX(-18deg)} }
        @keyframes gr-spin    { to{transform:rotate(360deg)} }

        .gr-shimmer {
          background:linear-gradient(90deg,#22d3ee 0%,#e0e7ff 28%,#818cf8 52%,#a855f7 78%,#22d3ee 100%);
          background-size:250% auto;
          -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;
          animation:gr-shimmer 5s linear infinite;
        }
        .gr-blink   { animation:gr-pulse 1.4s ease-in-out infinite; }
        .gr-scan    { animation:gr-scan 9s ease-in-out infinite; }
        .gr-spin    { animation:gr-spin 2s linear infinite; }
        .gr-cta:hover .gr-sweep { animation:gr-sweep .55s ease-out forwards; }
        .gr-row     { transition:background .15s; }
        .gr-row:hover { background:rgba(255,255,255,.03) !important; }
        .gr-input   { background:transparent; outline:none; width:100%; color:white; }
        .gr-input::placeholder { color:rgba(255,255,255,.25); }
        .gr-th      { transition:color .15s; cursor:pointer; user-select:none; }
        .gr-th:hover { color:rgba(255,255,255,.8) !important; }
      `}</style>

      <section className="gr relative overflow-hidden bg-[#000820] text-white/70">

        {/* Background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <svg width="100%" height="100%" className="absolute inset-0 opacity-[.04]">
            <defs>
              <pattern id="grhex" width="56" height="48.5" patternUnits="userSpaceOnUse">
                <polygon points="28,2 52,14 52,38 28,50 4,38 4,14" fill="none" stroke="#22d3ee" strokeWidth=".5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grhex)"/>
          </svg>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-100 bg-[radial-gradient(ellipse,rgba(34,211,238,0.06)_0%,transparent_70%)]"/>
          <div className="absolute bottom-0 right-0 w-150 h-100 bg-[radial-gradient(ellipse,rgba(129,140,248,0.05)_0%,transparent_70%)]"/>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(0,0,0,0.04)_3px,rgba(0,0,0,0.04)_4px)]"/>
          <div className="gr-scan absolute left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.1),transparent)]"/>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">

          <div className="text-center mb-14">
            <motion.div initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5">
              <TrendingUp size={11} className="text-cyan-400"/>
              <span className="gr-mono text-[11px] tracking-widest text-white/40 uppercase">Live Rate Board</span>
            </motion.div>
            <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:.1 }}
              className="gr-syne text-[clamp(28px,4.5vw,52px)] font-extrabold leading-tight tracking-[-0.03em] text-white mb-4">
              Today's gift card rates,<br/><span className="gr-shimmer">live and updated.</span>
            </motion.h2>
            <motion.p initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:.2 }}
              className="mx-auto max-w-lg text-base text-white/38 leading-relaxed">
              All rates are updated in real time. Figures shown are NGN payout per 1 USD of card value.
            </motion.p>
          </div>

          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="rounded-2xl border border-white/[.07] overflow-hidden"
            style={{ background:"rgba(0,6,32,.9)", backdropFilter:"blur(20px)" }}>

            <div className="h-px bg-linear-to-r from-transparent via-cyan-400/45 to-transparent"/>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="gr-blink inline-block h-1.25 w-1.25 rounded-full bg-emerald-400"/>
                  <span className="gr-mono text-[10px] text-white/28 tracking-widest uppercase">Live Rates</span>
                </div>
                <span className="gr-mono text-[10px] text-white/18">·</span>
                <span className="gr-mono text-[10px] text-white/28">Updated 2s ago</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/3 px-3 py-2 flex-1 sm:w-52 sm:flex-none">
                  <Search size={13} className="text-white/28 shrink-0"/>
                  <input className="gr-input text-sm text-white text-[13px]" placeholder="Search brand..."
                    value={search} onChange={e => setSearch(e.target.value)}/>
                </div>
                <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[.07] bg-white/3 hover:bg-white/[.07] transition-colors">
                  <RefreshCw size={13} className="text-white/35"/>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-170">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="gr-mono text-[10px] text-white/28 tracking-widest uppercase text-left px-5 py-3.5 font-normal">Brand</th>
                    {["r25","r50","r100","r200","r500"].map((key, i) => (
                      <th key={key} className="gr-th gr-mono text-[10px] text-white/28 tracking-widest uppercase text-right px-4 py-3.5 font-normal"
                        onClick={() => handleSort(key)}>
                        <span className="flex items-center justify-end gap-1">
                          ${[25,50,100,200,500][i]}
                          {sortAmt === key
                            ? sortDir === "desc" ? <ChevronDown size={10} className="text-cyan-400"/> : <ChevronUp size={10} className="text-cyan-400"/>
                            : <ChevronDown size={10} className="text-white/15"/>}
                        </span>
                      </th>
                    ))}
                    <th className="gr-mono text-[10px] text-white/28 tracking-widest uppercase text-right px-4 py-3.5 font-normal">24h</th>
                    <th className="px-5 py-3.5"/>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.map((row, i) => (
                      <motion.tr key={row.brand} layout
                        initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        transition={{ delay: i * 0.03 }}
                        className="gr-row border-b border-white/4 last:border-none">

                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[.07]"
                              style={{ background:`${row.color}18` }}>
                              <span className="gr-mono text-[9px] font-bold" style={{ color:row.color }}>{row.abbr}</span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white/85">{row.brand}</p>
                              <p className="gr-mono text-[10px] text-white/25">{row.cat}</p>
                            </div>
                          </div>
                        </td>

                        {/* Rate cells */}
                        {["r25","r50","r100","r200","r500"].map((key) => (
                          <td key={key} className={`gr-mono text-sm text-right px-4 py-3.5 ${sortAmt===key?"text-cyan-400 font-bold":"text-white/55"}`}>
                            {row[key]}
                          </td>
                        ))}

                        <td className="text-right px-4 py-3.5">
                          <span className={`gr-mono text-[11px] px-2 py-0.5 rounded-lg ${
                            row.trend==="up"   ? "bg-emerald-400/10 text-emerald-400" :
                            row.trend==="down" ? "bg-red-400/10 text-red-400"         :
                                                 "bg-white/5 text-white/30"
                          }`}>
                            {row.change}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          <button className="gr-cta group relative overflow-hidden inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-indigo-500 to-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow-[0_2px_12px_rgba(129,140,248,0.25)] transition-all duration-200 hover:-translate-y-px">
                            <span className="gr-sweep pointer-events-none absolute inset-0 bg-white/20"/>
                            <span className="relative z-10 flex items-center gap-1">Sell <ArrowRight size={11}/></span>
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-sm text-white/25">No results for "{search}"</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
              <span className="gr-mono text-[10px] text-white/20 tracking-[.06em]">
                {filtered.length} of {RATES_TABLE.length} brands shown · NGN per 1 USD
              </span>
              <span className="gr-mono text-[10px] text-white/18">Rates refresh every 60s</span>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-indigo-400/28 to-transparent"/>
          </motion.div>

          <p className="gr-mono text-center text-[10px] text-white/18 tracking-[.06em] mt-5">
            Rates shown are indicative. Final rate confirmed at time of trade. All rates in NGN per $1 USD of card face value.
          </p>
        </div>
      </section>
    </>
  );
}
