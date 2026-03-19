"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Star, ShoppingCart, ArrowRight,
  Gift, Check, ChevronRight, Sparkles, Tag,
} from "lucide-react";

const CARDS = [
  { name:"Amazon",      abbr:"AMZ", color:"#f59e0b", cat:"Shopping",      price:100, discount:2,  desc:"Shop millions of items",          badge:"Top Seller",  hot:true  },
  { name:"iTunes",      abbr:"iTN", color:"#818cf8", cat:"Entertainment", price:50,  discount:3,  desc:"Apple Music, apps & more",        badge:"Popular",     hot:false },
  { name:"Steam",       abbr:"STM", color:"#22d3ee", cat:"Gaming",        price:25,  discount:0,  desc:"PC gaming platform",              badge:"",            hot:true  },
  { name:"Google Play", abbr:"GP",  color:"#34d399", cat:"App Store",     price:50,  discount:2,  desc:"Android apps & subscriptions",    badge:"",            hot:false },
  { name:"Netflix",     abbr:"NFX", color:"#f87171", cat:"Streaming",     price:25,  discount:4,  desc:"Stream TV shows & movies",        badge:"Sale",        hot:false },
  { name:"Xbox",        abbr:"XBX", color:"#34d399", cat:"Gaming",        price:50,  discount:0,  desc:"Xbox games & Game Pass",          badge:"",            hot:true  },
  { name:"Spotify",     abbr:"SPT", color:"#22d3ee", cat:"Music",         price:30,  discount:5,  desc:"Music streaming worldwide",       badge:"Sale",        hot:false },
  { name:"Nike",        abbr:"NKE", color:"#818cf8", cat:"Fashion",       price:100, discount:0,  desc:"Sport & lifestyle gear",          badge:"",            hot:false },
  { name:"Sephora",     abbr:"SPH", color:"#f87171", cat:"Beauty",        price:50,  discount:3,  desc:"Beauty & skincare essentials",    badge:"Popular",     hot:false },
  { name:"Walmart",     abbr:"WMT", color:"#22d3ee", cat:"Shopping",      price:100, discount:0,  desc:"Everyday items & groceries",      badge:"",            hot:false },
  { name:"Razer Gold",  abbr:"RZR", color:"#34d399", cat:"Gaming",        price:50,  discount:2,  desc:"Gaming credits & rewards",        badge:"",            hot:true  },
  { name:"eBay",        abbr:"EBY", color:"#f59e0b", cat:"Shopping",      price:100, discount:0,  desc:"Buy & sell marketplace",          badge:"",            hot:false },
];

const CATEGORIES = ["All","Shopping","Gaming","Entertainment","Streaming","App Store","Fashion","Beauty","Music"];

const AMOUNTS_MAP = {
  25:  25,
  50:  50,
  100: 100,
  200: 200,
  500: 500,
};

/* ─── Card Component ────────────────────────────────────────────────── */
function BuyCardItem({ card, onSelect, selected }) {
  const discounted = card.discount > 0;
  const ngn = (card.price * 980).toLocaleString();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      transition={{ duration: .2 }}
      onClick={() => onSelect(card)}
      className={`relative rounded-2xl border cursor-pointer overflow-hidden transition-all duration-200 hover:-translate-y-1 ${
        selected?.name === card.name
          ? "border-amber-400/40 shadow-[0_0_32px_rgba(245,158,11,0.14)]"
          : "border-white/[.07] hover:border-white/[.14]"
      }`}
      style={{ background: selected?.name === card.name
        ? `linear-gradient(145deg,${card.color}12,rgba(0,8,40,.95))`
        : "rgba(0,8,40,.75)" }}
    >
      {/* Badges */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
        {card.hot && (
          <span className="flex items-center gap-1 rounded-md bg-orange-500/20 border border-orange-400/30 px-2 py-0.5 text-[9px] font-semibold text-orange-400" style={{ fontFamily:"Space Mono,monospace" }}>
            🔥 HOT
          </span>
        )}
        {discounted && (
          <span className="flex items-center gap-1 rounded-md bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 text-[9px] font-semibold text-emerald-400" style={{ fontFamily:"Space Mono,monospace" }}>
            -{card.discount}%
          </span>
        )}
        {card.badge && !discounted && !card.hot && (
          <span className="rounded-md bg-indigo-500/20 border border-indigo-400/30 px-2 py-0.5 text-[9px] font-semibold text-indigo-400" style={{ fontFamily:"Space Mono,monospace" }}>
            {card.badge}
          </span>
        )}
      </div>

      <div className="p-4 pt-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 mb-3"
          style={{ background:`${card.color}20` }}>
          <span className="text-[11px] font-bold" style={{ color:card.color, fontFamily:"Space Mono,monospace" }}>{card.abbr}</span>
        </div>

        <h4 className="text-sm font-bold text-white mb-0.5" style={{ fontFamily:"Syne,sans-serif" }}>{card.name}</h4>
        <p className="text-[11px] text-white/35 mb-3 leading-snug">{card.desc}</p>

        <div className="flex items-center justify-between">
          <div>
            {discounted ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-white/28 line-through" style={{ fontFamily:"Space Mono,monospace" }}>${card.price}</span>
                <span className="text-sm font-extrabold text-white" style={{ fontFamily:"Syne,sans-serif" }}>
                  ${Math.round(card.price * (1 - card.discount/100))}
                </span>
              </div>
            ) : (
              <span className="text-sm font-extrabold text-white" style={{ fontFamily:"Syne,sans-serif" }}>${card.price}</span>
            )}
            <p className="text-[10px] text-white/28 mt-0.5" style={{ fontFamily:"Space Mono,monospace" }}>≈ ₦{ngn}</p>
          </div>
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-200 ${
              selected?.name === card.name
                ? "bg-amber-400 border-amber-400"
                : "border-white/10 bg-white/3"
            }`}
          >
            {selected?.name === card.name
              ? <Check size={13} className="text-black font-bold"/>
              : <ChevronRight size={12} className="text-white/25"/>
            }
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function BuyGiftCard() {
  const [category, setCategory]   = useState("All");
  const [search,   setSearch]     = useState("");
  const [selected, setSelected]   = useState(null);
  const [amount,   setAmount]     = useState(100);
  const [added,    setAdded]      = useState(false);

  const filtered = CARDS.filter(c => {
    const matchCat = category === "All" || c.cat === category;
    const matchSrc = c.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSrc;
  });

  const handleAdd = () => {
    if (!selected) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        .bgc        { font-family:'DM Sans',sans-serif; }
        .bgc-syne   { font-family:'Syne',sans-serif; }
        .bgc-mono   { font-family:'Space Mono',monospace; }

        @keyframes bgc-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes bgc-pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.15;transform:scale(.55)} }
        @keyframes bgc-scan    { 0%{top:-2px} 100%{top:110%} }
        @keyframes bgc-sweep   { from{transform:translateX(-110%) skewX(-18deg)} to{transform:translateX(110%) skewX(-18deg)} }
        @keyframes bgc-pop     { 0%{transform:scale(.92);opacity:0} 60%{transform:scale(1.04)} 100%{transform:scale(1);opacity:1} }

        .bgc-shimmer {
          background:linear-gradient(90deg,#f59e0b 0%,#fde68a 30%,#f59e0b 55%,#fbbf24 80%,#f59e0b 100%);
          background-size:250% auto;
          -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;
          animation:bgc-shimmer 4s linear infinite;
        }
        .bgc-blink   { animation:bgc-pulse 1.4s ease-in-out infinite; }
        .bgc-scan    { animation:bgc-scan 9s ease-in-out infinite; }
        .bgc-cta:hover .bgc-sweep { animation:bgc-sweep .55s ease-out forwards; }
        .bgc-pop     { animation:bgc-pop .35s cubic-bezier(0.22,1,0.36,1) forwards; }
        .bgc-input   { background:transparent; outline:none; width:100%; }
        .bgc-input::placeholder { color:rgba(255,255,255,.25); }
      `}</style>

      <section className="bgc relative overflow-hidden bg-[#000c42] text-white/70">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <svg width="100%" height="100%" className="absolute inset-0 opacity-[.04]">
            <defs>
              <pattern id="bgchex" width="56" height="48.5" patternUnits="userSpaceOnUse">
                <polygon points="28,2 52,14 52,38 28,50 4,38 4,14" fill="none" stroke="#f59e0b" strokeWidth=".5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bgchex)"/>
          </svg>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-125 bg-[radial-gradient(ellipse,rgba(245,158,11,0.07)_0%,transparent_70%)]"/>
          <div className="absolute bottom-0 right-0 w-150 h-100 bg-[radial-gradient(ellipse,rgba(129,140,248,0.06)_0%,transparent_70%)]"/>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(0,0,0,0.04)_3px,rgba(0,0,0,0.04)_4px)]"/>
          <div className="bgc-scan absolute left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,rgba(245,158,11,0.1),transparent)]"/>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">

          <div className="text-center mb-14">
            <motion.div initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/22 bg-amber-400/6 px-4 py-1.5">
              <Tag size={11} className="text-amber-400"/>
              <span className="bgc-mono text-[11px] tracking-widest text-white/40 uppercase">Buy Gift Cards</span>
            </motion.div>
            <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:.1 }}
              className="bgc-syne text-[clamp(28px,4.5vw,52px)] font-extrabold leading-tight tracking-[-0.03em] text-white mb-4">
              Shop smarter.<br/><span className="bgc-shimmer">Gift with purpose.</span>
            </motion.h2>
            <motion.p initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:.2 }}
              className="mx-auto max-w-lg text-base sm:text-lg text-white/38 leading-relaxed">
              Browse 200+ gift card brands at competitive prices. Delivered instantly to your inbox — perfect for gifts or personal use.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            <div className="lg:col-span-3 space-y-5">

              <motion.div initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                className="rounded-2xl border border-white/[.07] bg-[#000820]/80 backdrop-blur-xl p-5 space-y-4">

                <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/3 px-4 py-3">
                  <Search size={15} className="text-white/28 shrink-0"/>
                  <input
                    className="bgc-input text-sm text-white"
                    placeholder="Search brand (e.g. Amazon, Steam...)"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                        category === cat
                          ? "bg-amber-500 text-black border border-amber-400/50 font-semibold"
                          : "border border-white/[.07] bg-white/3 text-white/38 hover:border-amber-400/30 hover:text-white/65"
                      }`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </motion.div>

              <div className="flex items-center justify-between px-1">
                <p className="bgc-mono text-[10px] text-white/28 tracking-[.08em] uppercase">
                  {filtered.length} card{filtered.length !== 1 ? "s" : ""} available
                </p>
                <div className="flex items-center gap-1.5">
                  <Sparkles size={11} className="text-amber-400"/>
                  <span className="bgc-mono text-[10px] text-amber-400/70">Instant delivery</span>
                </div>
              </div>

              {/* Grid */}
              <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <AnimatePresence mode="popLayout">
                  {filtered.map(card => (
                    <BuyCardItem key={card.name} card={card} onSelect={setSelected} selected={selected}/>
                  ))}
                </AnimatePresence>
                {filtered.length === 0 && (
                  <div className="col-span-3 flex flex-col items-center justify-center py-16 text-center">
                    <Gift size={32} className="text-white/15 mb-3"/>
                    <p className="text-sm text-white/28">No cards found for "{search}"</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right: Order panel (2 cols) */}
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity:0, x:24 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                className="sticky top-24 rounded-2xl border border-amber-400/16 overflow-hidden"
                style={{ background:"rgba(0,6,32,.92)", backdropFilter:"blur(24px)" }}>
                <div className="h-px bg-linear-to-r from-transparent via-amber-400/45 to-transparent"/>

                <div className="p-6">
                  <p className="bgc-mono text-[10px] text-white/28 tracking-widest uppercase mb-5">Order Summary</p>

                  <AnimatePresence mode="wait">
                    {selected ? (
                      <motion.div key={selected.name}
                        initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:.2 }}>

                        <div className="rounded-xl border border-white/[.07] bg-black/30 p-4 mb-5">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/8"
                              style={{ background:`${selected.color}20` }}>
                              <span className="text-[10px] font-bold" style={{ color:selected.color, fontFamily:"Space Mono,monospace" }}>{selected.abbr}</span>
                            </div>
                            <div>
                              <p className="bgc-syne text-base font-extrabold text-white">{selected.name}</p>
                              <p className="bgc-mono text-[10px] text-white/30">{selected.cat}</p>
                            </div>
                          </div>
                          <p className="bgc-mono text-[10px] text-white/28 tracking-[.08em] uppercase mb-2.5">Select Amount</p>
                          <div className="grid grid-cols-5 gap-1.5 mb-3">
                            {[25,50,100,200,500].map(a => (
                              <button key={a} onClick={() => setAmount(a)}
                                className={`rounded-lg py-2 text-xs font-semibold transition-all duration-150 ${
                                  amount === a
                                    ? "bg-amber-500 text-black"
                                    : "border border-white/[.07] bg-white/2 text-white/40 hover:border-amber-400/30"
                                }`}>
                                ${a}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2.5 mb-5 px-1">
                          {[
                            { label:"Card value",   val:`$${amount}` },
                            { label:"Platform fee", val:"$0.00"      },
                            { label:"Delivery",     val:"Instant"    },
                          ].map(row => (
                            <div key={row.label} className="flex items-center justify-between">
                              <span className="text-sm text-white/38">{row.label}</span>
                              <span className="bgc-mono text-sm text-white/65">{row.val}</span>
                            </div>
                          ))}
                          <div className="h-px bg-white/6"/>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-white">Total (NGN)</span>
                            <span className="bgc-syne text-lg font-extrabold text-amber-400">₦{(amount * 980).toLocaleString()}</span>
                          </div>
                        </div>

                        <button onClick={handleAdd}
                          className={`bgc-cta group relative w-full overflow-hidden rounded-xl py-4 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px ${
                            added
                              ? "bg-emerald-500 shadow-[0_4px_24px_rgba(52,211,153,0.3)]"
                              : "bg-linear-to-r from-amber-500 to-orange-500 shadow-[0_4px_24px_rgba(245,158,11,0.3)] hover:shadow-[0_8px_32px_rgba(245,158,11,0.45)]"
                          }`}>
                          {!added && <span className="bgc-sweep pointer-events-none absolute inset-0 bg-white/20"/>}
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {added
                              ? <><Check size={16}/> Added to Cart!</>
                              : <><ShoppingCart size={14}/> Buy {selected.name} ${amount}</>
                            }
                          </span>
                        </button>

                        <p className="bgc-mono text-center text-[9px] text-white/20 tracking-[.06em] mt-3">
                          DELIVERED TO YOUR EMAIL INSTANTLY
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                        className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/8 bg-white/3 mb-4">
                          <Gift size={22} className="text-white/20"/>
                        </div>
                        <p className="text-sm text-white/30 mb-1">No card selected</p>
                        <p className="text-xs text-white/20">Click a card on the left to begin</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="h-px bg-linear-to-r from-transparent via-amber-400/20 to-transparent"/>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
