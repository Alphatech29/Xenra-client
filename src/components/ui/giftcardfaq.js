"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, ArrowRight, ShieldCheck,
  Zap, Globe, Gift, MessageCircle,
} from "lucide-react";

const FAQS = [
  {
    q: "How long does it take to receive payment after selling a gift card?",
    a: "Payments are processed instantly. Once your card is verified — which takes roughly 15–30 seconds — the equivalent naira value is credited to your Xenra wallet immediately. You can then withdraw to any Nigerian bank account in under 2 seconds.",
  },
  {
    q: "What gift card brands are accepted?",
    a: "We accept 200+ brands including Amazon, iTunes, Google Play, Steam, Xbox, Netflix, Spotify, Nike, Sephora, Walmart, eBay, Razer Gold, and many more. If you have a brand not listed, contact our support team.",
  },
  {
    q: "How are the payout rates determined?",
    a: "Our rates are updated in real time based on market demand and exchange rate fluctuations. We use an algorithmic pricing engine that guarantees you receive the best available rate at the time of your trade.",
  },
  {
    q: "Are there any fees for selling gift cards?",
    a: "Absolutely none. Xenra charges zero platform fees on gift card trades. The rate you see is the exact rate you get — no hidden deductions, no service charges.",
  },
  {
    q: "What happens if my card is rejected during verification?",
    a: "If a card fails verification, you are notified immediately with the reason. Common causes include used cards, incorrect codes, or regional restrictions. Your wallet balance is never debited for failed trades.",
  },
  {
    q: "Can I buy gift cards on Xenra and use them internationally?",
    a: "Yes. Gift cards purchased on Xenra are genuine, fully functional cards that work globally wherever the brand is accepted. Digital codes are delivered to your email within seconds of purchase.",
  },
  {
    q: "Is there a minimum or maximum trade amount?",
    a: "The minimum sell amount is $10 and the maximum per single transaction is $5,000. For higher volumes, contact our enterprise team for OTC rates.",
  },
  {
    q: "How do I know Xenra is safe and trustworthy?",
    a: "Xenra is CBN licensed, ISO 27001 certified, and PCI DSS compliant. All transactions are encrypted end-to-end and protected by real-time fraud monitoring. We have processed over ₦4.8B in gift card payouts to 500K+ happy users.",
  },
];

const SUPPORT = [
  { icon: MessageCircle, label: "Live Chat",     desc: "Average response: 2 min",  cx: "text-cyan-400",   border:"border-cyan-400/20",   bg:"bg-cyan-400/[.07]" },
  { icon: Globe,          label: "Help Center",  desc: "Browse 200+ articles",     cx: "text-indigo-400", border:"border-indigo-400/20", bg:"bg-indigo-400/[.07]" },
  { icon: Gift,           label: "Telegram",     desc: "@XenraSupport",            cx: "text-purple-400", border:"border-purple-400/20", bg:"bg-purple-400/[.07]" },
];

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        open ? "border-indigo-400/25 bg-indigo-400/5" : "border-white/[.07] bg-white/2 hover:border-white/12"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-white/80 leading-snug">{item.q}</span>
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 ${
          open ? "border-indigo-400/35 bg-indigo-400/15 text-indigo-400" : "border-white/8 bg-white/3 text-white/30"
        }`}>
          <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}/>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: .22 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-white/5 pt-4">
              <p className="text-sm text-white/45 leading-relaxed">{item.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function GiftCardFAQ() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400&family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        .gf        { font-family:'DM Sans',sans-serif; }
        .gf-syne   { font-family:'Syne',sans-serif; }
        .gf-mono   { font-family:'Space Mono',monospace; }

        @keyframes gf-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes gf-pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.15;transform:scale(.55)} }
        @keyframes gf-scan    { 0%{top:-2px} 100%{top:110%} }
        @keyframes gf-sweep   { from{transform:translateX(-110%) skewX(-18deg)} to{transform:translateX(110%) skewX(-18deg)} }

        .gf-shimmer {
          background:linear-gradient(90deg,#22d3ee 0%,#e0e7ff 28%,#818cf8 52%,#a855f7 78%,#22d3ee 100%);
          background-size:250% auto;
          -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent;
          animation:gf-shimmer 5s linear infinite;
        }
        .gf-blink  { animation:gf-pulse 1.4s ease-in-out infinite; }
        .gf-scan   { animation:gf-scan 9s ease-in-out infinite; }
        .gf-cta:hover .gf-sweep { animation:gf-sweep .55s ease-out forwards; }
      `}</style>

      <section className="gf relative overflow-hidden bg-[#000c42] text-white/70">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <svg width="100%" height="100%" className="absolute inset-0 opacity-[.04]">
            <defs>
              <pattern id="gfhex" width="56" height="48.5" patternUnits="userSpaceOnUse">
                <polygon points="28,2 52,14 52,38 28,50 4,38 4,14" fill="none" stroke="#818cf8" strokeWidth=".5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gfhex)"/>
          </svg>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-225 h-125 bg-[radial-gradient(ellipse,rgba(129,140,248,0.07)_0%,transparent_70%)]"/>
          <div className="absolute bottom-0 left-0 w-150 h-100 bg-[radial-gradient(ellipse,rgba(34,211,238,0.05)_0%,transparent_70%)]"/>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(0,0,0,0.04)_3px,rgba(0,0,0,0.04)_4px)]"/>
          <div className="gf-scan absolute left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,rgba(129,140,248,0.1),transparent)]"/>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="lg:grid lg:grid-cols-5 lg:gap-16 mb-20 lg:mb-28">
            <div className="lg:col-span-2 mb-10 lg:mb-0">
              <motion.div initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/5 px-4 py-1.5">
                <span className="gf-mono text-[11px] tracking-widest text-white/40 uppercase">FAQ</span>
              </motion.div>
              <motion.h2 initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:.1 }}
                className="gf-syne text-[clamp(26px,3.5vw,44px)] font-extrabold leading-tight tracking-[-0.03em] text-white mb-5">
                Got questions?<br/><span className="gf-shimmer">We've got answers.</span>
              </motion.h2>
              <motion.p initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:.2 }}
                className="text-base text-white/38 leading-relaxed mb-8">
                Everything you need to know about buying and selling gift cards on Xenra.
              </motion.p>

              {/* Support links */}
              <div className="space-y-3">
                {SUPPORT.map(({ icon: Icon, label, desc, cx, border, bg }) => (
                  <button key={label}
                    className={`w-full flex items-center gap-3 rounded-xl border ${border} ${bg} px-4 py-3.5 text-left hover:brightness-110 transition-all duration-150`}>
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${border}`}
                      style={{ background: bg.replace("[.07]","[.12]") }}>
                      <Icon size={16} className={cx}/>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white/80">{label}</p>
                      <p className="text-xs text-white/35">{desc}</p>
                    </div>
                    <ChevronDown size={14} className="text-white/20 -rotate-90 ml-auto shrink-0"/>
                  </button>
                ))}
              </div>
            </div>
            <div className="lg:col-span-3 space-y-3">
              {FAQS.map((item, i) => (
                <FAQItem key={item.q} item={item} index={i}/>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="relative rounded-3xl border border-white/[.07] overflow-hidden">

            <div className="absolute inset-0 bg-linear-to-br from-indigo-500/8 via-purple-600/10 to-cyan-500/6"/>
            <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_3px,rgba(0,0,0,0.04)_3px,rgba(0,0,0,0.04)_4px)]"/>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <Gift size={280} className="text-indigo-400 opacity-[.04]"/>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-indigo-400/50 to-transparent"/>

            <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-14 sm:py-20 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/3 px-4 py-1.5">
                <span className="gf-blink inline-block h-1.25 w-1.25 rounded-full bg-indigo-400"/>
                <span className="gf-mono text-[10px] tracking-widest text-white/32 uppercase">Ready to trade?</span>
              </div>

              <h3 className="gf-syne text-[clamp(26px,4.5vw,52px)] font-extrabold text-white leading-tight tracking-[-0.03em] max-w-xl">
                Trade your first gift card
                <br/><span className="gf-shimmer">in under 60 seconds.</span>
              </h3>

              <p className="text-base text-white/38 max-w-md leading-relaxed">
                Join 500,000+ Nigerians already trading on Xenra. Free to sign up — start with any amount.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:w-auto">
                <button className="gf-cta group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 px-8 py-4 text-sm font-semibold text-white shadow-[0_4px_28px_rgba(129,140,248,0.42)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_36px_rgba(129,140,248,0.58)] w-full sm:w-auto">
                  <span className="gf-sweep pointer-events-none absolute inset-0 bg-white/20"/>
                  <span className="relative z-10 flex items-center gap-2">Sell Gift Card Now <ArrowRight size={15}/></span>
                </button>
                <button className="gf-cta group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 px-8 py-4 text-sm font-semibold text-white shadow-[0_4px_28px_rgba(245,158,11,0.3)] transition-all duration-200 hover:-translate-y-px w-full sm:w-auto">
                  <span className="gf-sweep pointer-events-none absolute inset-0 bg-white/20"/>
                  <span className="relative z-10 flex items-center gap-2">Buy Gift Cards <Gift size={14}/></span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-5 pt-1">
                {[
                  { icon: ShieldCheck, label: "Zero platform fees",   cx: "text-cyan-400"   },
                  { icon: Zap,         label: "Instant verification", cx: "text-indigo-400" },
                  { icon: Globe,       label: "200+ card brands",     cx: "text-purple-400" },
                ].map(({ icon: Icon, label, cx }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon size={12} className={cx}/>
                    <span className="gf-mono text-[10px] text-white/25 tracking-[.05em]">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-cyan-400/35 to-transparent"/>
            <div className="h-px mt-px bg-linear-to-r from-transparent via-purple-400/20 to-transparent"/>
          </motion.div>
        </div>
      </section>
    </>
  );
}
