"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HiGiftTop, HiMiniShoppingBag } from "react-icons/hi2";
import { RiSimCardFill, RiBtcFill } from "react-icons/ri";
import BalanceCard from "./_components/balanceCard";
import TransactionsCard from "./_components/transactionsCard";
import { useTransactionHistory } from "../../../hooks/useTransactionHistory";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const section = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function DashboardPage() {
  const { transactions = [] } = useTransactionHistory();

   const formattedTransactions = transactions
    .slice(0, 6)
    .map((tx) => ({
      id: tx?.id,
      name: (tx?.service_type?.toLowerCase() || tx?.description?.toLowerCase()) ?? "transaction",
      date: tx?.created_at
        ? new Date(tx.created_at).toLocaleString("en-NG", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "",
      amount: Number(tx?.total ?? tx?.amount ?? 0),
      type: tx?.status_type === "credit" ? "credit" : "debit",
      status: tx?.status ?? "pending",
    }));

  return (
    <main className="min-h-screen pb-32 bg-linear-to-b from-primary-1200 via-primary-950 to-primary-1200 text-silver-100">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* HEADER */}
        <motion.div variants={section} className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back 👋</h1>
          <p className="text-sm text-silver-300">Manage your wallet and transactions</p>
        </motion.div>

        {/* WALLET CARD */}
        <motion.div variants={section}>
          <BalanceCard />
        </motion.div>

        {/* QUICK SERVICES */}
        <motion.div variants={section} className="grid grid-cols-4 gap-3 text-center">
          <Link href="/dashboard/airtime" className="flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-2xl bg-white/5 border border-white/10 text-[12px] hover:bg-white/10">
            <RiSimCardFill size={22} />
            <span>Airtime</span>
          </Link>

          <Link href="/dashboard/data-purchase" className="flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-2xl bg-white/5 border border-white/10 text-[12px] hover:bg-white/10">
            <RiSimCardFill size={22} />
            <span>Data</span>
          </Link>

          <Link href="/buy-giftcard" className="flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-2xl bg-white/5 border border-white/10 text-[12px] hover:bg-white/10">
            <HiMiniShoppingBag size={22} />
            <span>Giftcard</span>
          </Link>

          <Link href="#" className="flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-2xl bg-white/5 border border-white/10 text-[12px] hover:bg-white/10">
            <RiBtcFill size={22} />
            <span>Crypto</span>
          </Link>
        </motion.div>

        {/* FEATURES */}
        <motion.div variants={section} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/dashboard/sell-giftcard" className="group relative overflow-hidden rounded-2xl p-5 bg-white/5 text-primary-50 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="absolute -right-10 -top-10 w-28 h-28 bg-white/10 rounded-full group-hover:scale-125 transition-all duration-500" />
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">Sell Gift Cards</h2>
                <p className="text-xs opacity-80">Trade your gift cards at best rates.</p>
              </div>
              <div className="bg-white/10 p-2 rounded-xl">
                <HiGiftTop size={26} />
              </div>
            </div>
          </Link>

          <Link href="/dashboard/buy-giftcard" className="group relative overflow-hidden rounded-2xl p-5 bg-white/5 text-primary-50 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="absolute -right-10 -top-10 w-28 h-28 bg-white/10 rounded-full group-hover:scale-125 transition-all duration-500" />
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">Buy Gift Cards</h2>
                <p className="text-xs opacity-80">Purchase gift cards securely & instantly.</p>
              </div>
              <div className="bg-white/10 p-2 rounded-xl">
                <HiMiniShoppingBag size={26} />
              </div>
            </div>
          </Link>
        </motion.div>

        {/* TRANSACTIONS */}
        <motion.div variants={section}>
          <TransactionsCard
            title="Recent Transactions"
            transactions={formattedTransactions}
          />
        </motion.div>

      </motion.div>
    </main>
  );
}
