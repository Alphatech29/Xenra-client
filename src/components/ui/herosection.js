"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Globe, Gift, Coins, Sparkles } from "lucide-react";

const tabs = [
  { id: "payments", label: "Global Payments", icon: Globe },
  { id: "giftcards", label: "Gift Cards", icon: Gift },
  { id: "crypto", label: "Crypto Exchange", icon: Coins },
];

export default function XenraHero() {
  const [active, setActive] = useState("payments");

  return (
    <section className="relative overflow-hidden bg-[#000c42] text-silver-50">
      {/* animated gradient mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 -top-62.5 h-175 w-175 -translate-x-1/2 rounded-full bg-primary-600/20 blur-[160px]" />
        <div className="absolute -bottom-50 -right-37.5 h-150 w-150 rounded-full bg-cyan-500/20 blur-[160px]" />
        <div className="absolute -bottom-62.5 -left-37.5 h-125 w-125 rounded-full bg-purple-500/20 blur-[160px]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 py-20 sm:py-28 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* LEFT */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs sm:text-sm backdrop-blur"
          >
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            Trusted digital finance infrastructure
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
          >
            Borderless Payments
            <span className="block bg-linear-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Built For The Internet Economy
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-xl text-base text-white/70 sm:text-lg lg:mx-0"
          >
            Xenra enables seamless global value exchange — send money internationally, trade gift cards instantly and swap crypto assets securely in one powerful platform.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
          >
            <button className="group w-full sm:w-auto rounded-xl bg-linear-to-r from-cyan-500 to-indigo-600 px-7 py-3 font-semibold shadow-xl shadow-indigo-600/30 transition hover:scale-[1.03]">
              Start Using Xenra
              <ArrowRight className="ml-2 inline h-4 w-4 transition group-hover:translate-x-1" />
            </button>

            <button className="w-full sm:w-auto rounded-xl border border-white/15 bg-white/5 px-7 py-3 font-semibold backdrop-blur transition hover:bg-white/10">
              Explore Features
            </button>
          </motion.div>

          {/* stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 grid grid-cols-3 gap-6 text-center lg:text-left"
          >
            <div>
              <p className="text-2xl font-bold text-cyan-400">150+</p>
              <p className="text-xs text-white/60">Countries Supported</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-400">Instant</p>
              <p className="text-xs text-white/60">Settlements</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-400">24/7</p>
              <p className="text-xs text-white/60">Secure Trading</p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT PANEL */}
        <div className="mt-16 lg:mt-0">
          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl sm:p-7">
            <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const activeTab = active === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActive(tab.id)}
                    className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm transition ${
                      activeTab
                        ? "bg-linear-to-r from-cyan-500 to-indigo-600 text-white"
                        : "bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <motion.div
              key={active}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl border border-white/10 bg-[#0b111f] p-6 sm:p-8"
            >
              {active === "payments" && (
                <div className="space-y-3">
                  <p className="text-sm text-white/60">International Transfer</p>
                  <h3 className="text-2xl font-semibold">USD → NGN</h3>
                  <p className="text-3xl font-bold text-cyan-400">$1,250.00</p>
                  <p className="text-white/60">≈ ₦1,985,000</p>
                </div>
              )}

              {active === "giftcards" && (
                <div className="space-y-3">
                  <p className="text-sm text-white/60">Gift Card Trade</p>
                  <h3 className="text-2xl font-semibold">Amazon $100</h3>
                  <p className="text-3xl font-bold text-indigo-400">₦95,000</p>
                  <p className="text-white/60">Instant payout</p>
                </div>
              )}

              {active === "crypto" && (
                <div className="space-y-3">
                  <p className="text-sm text-white/60">Crypto Swap</p>
                  <h3 className="text-2xl font-semibold">BTC → USDT</h3>
                  <p className="text-3xl font-bold text-emerald-400">0.035 BTC</p>
                  <p className="text-white/60">Live market rate</p>
                </div>
              )}
            </motion.div>

            {/* floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-4 -right-4 hidden rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs backdrop-blur sm:flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-cyan-400" />
              Bank‑grade security
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}