"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { FiSend } from "react-icons/fi";
import { Eye, EyeOff } from "lucide-react";
import { useWallet } from "../../../../hooks/useWallet";

export default function BalanceCard() {
  const { wallet, loading } = useWallet(); // 👈 add loading in your hook

  const [hidden, setHidden] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("hideBalance") === "true";
    setHidden(saved);
    setMounted(true);
  }, []);

  function toggleBalance() {
    const next = !hidden;
    setHidden(next);
    localStorage.setItem("hideBalance", String(next));
  }

  const balance = Number(wallet?.available_balance || 0).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="relative rounded-3xl p-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden">

      {/* Title Skeleton */}
      {loading ? (
        <div className="h-3 w-32 bg-white/10 animate-pulse rounded"></div>
      ) : (
        <p className="text-xs tracking-wider text-silver-400 uppercase">
          Available Balance
        </p>
      )}

      {/* Balance Section */}
      <div className="flex items-center gap-3 mt-2">

        {loading ? (
          <>
            <div className="h-6 w-6 bg-white/10 animate-pulse rounded"></div>
            <div className="h-8 w-32 bg-white/10 animate-pulse rounded"></div>
          </>
        ) : (
          <>
            <span className="text-lg font-semibold">₦</span>

            <span className="text-[24px] font-extrabold tracking-tight">
              {!mounted || hidden ? "****" : balance}
            </span>

            <button
              onClick={toggleBalance}
              className="ml-2 text-silver-300 hover:text-white transition"
            >
              {!mounted || hidden ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </>
        )}

      </div>

      {/* Buttons Skeleton */}
      <div className="flex gap-4 mt-5">
        {loading ? (
          <>
            <div className="flex-1 h-10 bg-white/10 animate-pulse rounded-xl"></div>
            <div className="flex-1 h-10 bg-white/10 animate-pulse rounded-xl"></div>
          </>
        ) : (
          <>
            <Link
              href="/dashboard/addfund"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary-1100 py-2 text-sm font-medium"
            >
              <FaPlus /> Add Funds
            </Link>

            <Link
              href="/dashboard/sendfund"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary-1100 py-2 text-sm font-medium"
            >
              <FiSend /> Send Funds
            </Link>
          </>
        )}
      </div>

    </div>
  );
}