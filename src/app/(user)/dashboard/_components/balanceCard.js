"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { FiSend } from "react-icons/fi";
import { Eye, EyeOff } from "lucide-react";

export default function BalanceCard() {
  const [hidden, setHidden] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState(20000);

  // runs AFTER hydration (safe)
  useEffect(() => {
    const saved = localStorage.getItem("hideBalance") === "true";
    setHidden(saved);

    // read wallet balance only on client
    const val = typeof window !== "undefined" ? window.__walletBalance ?? 20000 : 20000;
    setBalance(val);

    setMounted(true);
  }, []);

  function toggleBalance() {
    const next = !hidden;
    setHidden(next);
    localStorage.setItem("hideBalance", String(next));
  }

  return (
    <div className="relative rounded-3xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden">

      <p className="text-xs tracking-wider text-silver-400 uppercase">
        Available Balance
      </p>

      <div className="flex items-center gap-3 mt-2">
        <span className="text-lg font-semibold">₦</span>

        {/* identical SSR + first client render */}
        <span className="text-3xl font-extrabold tracking-tight">
          {!mounted || hidden ? "****" : balance.toLocaleString()}
        </span>

        <button
          onClick={toggleBalance}
          className="ml-2 text-silver-300 hover:text-white transition"
        >
          {!mounted || hidden ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div className="flex gap-4 mt-5">
        <Link href="/dashboard/addfund" className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary-1100 py-2 text-sm font-medium">
          <FaPlus /> Add Funds
        </Link>

        <Link href="/dashboard/sendfund" className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary-1100 py-2 text-sm font-medium">
          <FiSend /> Send Funds
        </Link>
      </div>

    </div>
  );
}