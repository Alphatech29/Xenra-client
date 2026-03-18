"use client";

import { useState } from "react";
import { FaCheckCircle, FaUsers } from "react-icons/fa";
import { Loader, HandCoins, Wallet, ArrowUpRight, Share2, MessageSquare, Copy, ChevronLeft } from "lucide-react";
import { useUser } from "../../../../hooks/useUser";
import { useWebSettings } from "../../../../hooks/useWebSettings";
import { useUserReferrals } from "../../../../hooks/useUserReferrals";
import { useWallet } from "../../../../hooks/useWallet";

export default function Reward() {
  const { wallet } = useWallet();
  const { user } = useUser();
  const { settings } = useWebSettings();
  const { referrals, total, paidCount, pendingCount, totalEarned, referralBalance } =
    useUserReferrals();

  const referralCode = user?.referral_code || "NULL";
  const referralLink = `${settings?.site_url}/auth/register?ref=${referralCode}`;

  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const copyCode = async () => {
    if (!referralCode) return;
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareLink = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Invite & Earn",
          text: "Join me and earn ₦3,000 when you sign up!",
          url: referralLink,
        });
      } else {
        await navigator.clipboard.writeText(referralLink);
        alert("Link copied! You can now share it.");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const shareSMS = () => {
    const message = `Join me and earn ₦3,000! Sign up using my link: ${referralLink}`;
    window.location.href = `sms:?body=${encodeURIComponent(message)}`;
  };

  const stats = [
    {
      label: "Invited",
      value: total,
      icon: <FaUsers size={15} className="text-primary-600" />,
      bg: "bg-primary-50",
    },
    {
      label: "Completed",
      value: paidCount,
      icon: <FaCheckCircle size={15} className="text-emerald-500" />,
      bg: "bg-emerald-50",
    },
    {
      label: "Pending",
      value: pendingCount,
      icon: <Loader size={15} className="text-amber-500" />,
      bg: "bg-amber-50",
    },
    {
      label: "Paid Out",
      value: `₦${totalEarned.toLocaleString()}`,
      icon: <HandCoins size={15} className="text-violet-500" />,
      bg: "bg-violet-50",
    },
  ];

  /* ------------------ MONEY FORMAT ------------------ */
const formatMoney = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(Number(amount || 0));
};

  return (
    <div className="min-h-screen pb-28 bg-[#F4F5F7] font-sans">

      {/* ── Top Nav ── */}
      <div className="bg-primary-1200 px-5 pt-5 pb-0 flex items-center gap-3">
        <button className="bg-white/15 backdrop-blur rounded-xl w-9 h-9 flex items-center justify-center active:scale-95 transition">
          <ChevronLeft size={20} stroke="white" strokeWidth={2.5} />
        </button>
        <span className="text-white font-bold text-lg tracking-tight">Invite & Earn</span>
      </div>

      {/* ── Hero ── */}
      <div className="bg-primary-1200 px-5 pt-6 pb-10 relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute -top-14 -right-14 w-52 h-52 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-4">
          {/* headline */}
          <div>
            <span className="inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 text-white text-[11px] font-bold tracking-widest mb-3">
              🎁 REFER & EARN
            </span>
            <h1 className="text-white text-2xl font-extrabold leading-tight">
              Earn <span className="text-primary-400">₦3,000</span> for every<br />
              friend you invite!
            </h1>
            <p className="text-white/60 text-sm mt-1">Your friend earns ₦3,000 too. Win-win!</p>
          </div>

          {/* Referral Code card */}
          <div className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-white/50 text-[11px] font-semibold uppercase tracking-wider mb-1">
                Your Referral Code
              </p>
              <p className="text-white text-xl font-black tracking-[0.2em]">
                {referralCode}
              </p>
            </div>
            <button
              onClick={copyCode}
              className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl transition active:scale-95 ${
                copied
                  ? "bg-emerald-400 text-white"
                  : "bg-white text-primary-700 hover:bg-primary-100"
              }`}
            >
              <Copy size={12} />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto flex flex-col gap-4 mt-5 px-4">

        {/* ── Referral Balance Card ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Wallet size={17} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider leading-none mb-0.5">
                  Referral Balance
                </p>
                <p className="text-[19px] font-black text-gray-900 leading-none">
                  {formatMoney(wallet?.referral_balance)}
                </p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 bg-primary-900 hover:bg-primary-400 text-white text-xs font-bold px-4 py-2 rounded-xl transition active:scale-95">
              Claim
              <ArrowUpRight size={13} />
            </button>
          </div>

          {/* mini stats row */}
          <div className="grid grid-cols-4 divide-x divide-gray-100">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center py-3.5 gap-1">
                <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}>
                  {s.icon}
                </div>
                <p className="text-sm font-extrabold text-gray-900 leading-none">{s.value}</p>
                <p className="text-[10px] text-gray-400 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Share Invite Link ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-gray-800 mb-3">Share Invite Link</p>

          <div className="flex gap-2 mb-4">
            <input
              value={referralLink}
              readOnly
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-[11px] text-gray-500 outline-none truncate"
            />
            <button
              onClick={copyLink}
              className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border transition active:scale-95 ${
                copiedLink
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                  : "bg-primary-50 border-primary-100 text-primary-600 hover:bg-primary-100"
              }`}
            >
              <Copy size={12} />
              {copiedLink ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={shareLink}
              className="flex-1 bg-primary-900 hover:bg-primary-1000 text-white text-sm font-bold py-2 rounded-2xl flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Share2 size={14} />
              Share Link
            </button>
            <button
              onClick={shareSMS}
              className="flex-1 border-2 border-primary-500 text-primary-500 text-sm font-bold py-2 rounded-2xl hover:bg-primary-50 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <MessageSquare size={14} />
              Via SMS
            </button>
          </div>
        </div>

        {/* ── Recent Activity ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-gray-800">Recent Activity</p>
            <span className="text-[11px] text-primary-500 font-semibold">See all</span>
          </div>

          {referrals.length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-2">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                <FaUsers size={20} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400 font-medium">No referrals yet</p>
              <p className="text-xs text-gray-300 text-center">Share your code to start earning</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {referrals.map((ref, idx) => {
                const initials = ref.full_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase();

                const isPaid = ref.reward_status === "paid";
                const status = isPaid ? "Completed" : "Pending";

                return (
                  <div
                    key={ref.id}
                    className={`flex items-center gap-3 py-3 ${
                      idx < referrals.length - 1 ? "border-b border-gray-100" : ""
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-black shrink-0">
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{ref.full_name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isPaid
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-amber-100 text-amber-600"
                          }`}
                        >
                          {status}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {formatDate(ref.created_at)}
                        </span>
                      </div>
                    </div>

                    <p className={`text-sm font-extrabold shrink-0 ${isPaid ? "text-emerald-500" : "text-gray-400"}`}>
                      ₦{Number(ref.reward_amount).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}