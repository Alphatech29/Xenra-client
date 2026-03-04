"use client";
import React from "react";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const statusMeta = {
  completed: {
    label: "Completed",
    cls: "text-emerald-500",
    glow: "shadow-emerald-500/20",
    icon: CheckCircle2,
  },
  pending: {
    label: "Processing",
    cls: "text-amber-400",
    glow: "shadow-amber-400/30",
    pulse: true,
    icon: Clock3,
  },
  failed: {
    label: "Failed",
    cls: "text-red-500",
    glow: "shadow-red-500/30",
    icon: XCircle,
  },
};

const currency = (value, currencyCode = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currencyCode,
  }).format(value);

const initials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

export default function TransactionsCard({
  title = "Recent Activity",
  transactions = [],
  currencyCode = "NGN",
}) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-primary-500/10 bg-primary-600/5">

      {/* Glass highlight */}
      <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

      {/* HEADER */}
      <div className="sticky top-0 z-10  bg-white/5 border-b border-white/10">
        <div className="p-3 flex justify-between items-start">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="p-4 overflow-y-auto relative">
        {/* scroll fade */}
        <div />

        <div className="space-y-3">
          {transactions.map((tx, index) => {
            const meta =
              statusMeta[tx.status] || statusMeta.completed;
            const StatusIcon = meta.icon;

            return (
              <motion.div
                key={tx.id || index}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.035, type: "spring", stiffness: 120 }}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex justify-between items-center py-2 border-b border-primary-400/15 hover:bg-primary-400/5 transition-all duration-300 cursor-pointer"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4 min-w-0">
                  <motion.div
                    whileHover={{ rotate: 8 }}
                    className={`relative rounded-2xl p-3 ${
                      tx.type === "credit"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {tx.type === "credit" ? (
                      <ArrowDownLeft className="size-5" />
                    ) : (
                      <ArrowUpRight className="size-5" />
                    )}

                    {/* avatar badge */}
                    <span className="absolute -bottom-1 -right-1 size-5 rounded-full bg-background border border-white/20 grid place-items-center text-[10px] font-semibold">
                      {initials(tx.name)}
                    </span>
                  </motion.div>

                  <div className="flex flex-col min-w-0">
                    <span className="font-medium truncate text-sm">
                      {tx.name}
                    </span>
                    <span className="text-[11px] text-silver-500 text-muted-foreground truncate">
                      {tx.date}
                    </span>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-end gap-1">
                  <motion.span
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className={`font-semibold text-sm ${
                      tx.type === "credit"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {tx.type === "credit" ? "+" : "-"}
                    {currency(tx.amount)}
                  </motion.span>

                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium ${meta.cls}`}
                  >
                    <StatusIcon
                      className={`size-3 ${
                        meta.pulse ? "animate-pulse" : ""
                      }`}
                    />
                    {meta.label}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {transactions.length === 0 && (
            <div className="py-16 text-center text-muted-foreground">
              <div className="mx-auto mb-4 size-14 rounded-2xl bg-white/5 grid place-items-center">
                <ArrowLeftRight className="opacity-40" />
              </div>
              <p className="text-sm">No activity yet</p>
              <p className="text-xs opacity-60">
                Transactions will appear here automatically
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}