"use client";

import { useState } from "react";
import { FaCheckCircle, FaUsers  } from "react-icons/fa";
import { Loader, HandCoins  } from "lucide-react";


export default function Reward() {
  const referralCode = "ALPHA-X7K92";
  const referralLink = `https://yourapp.com/signup?ref=${referralCode}`;

  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const referrals = [
    { name: "John Doe", initials: "JD", status: "Completed", reward: "₦2,500", date: "Mar 10" },
    { name: "Sarah Smith", initials: "SS", status: "Pending", reward: "₦0", date: "Mar 9" },
    { name: "Michael Brown", initials: "MB", status: "Completed", reward: "₦2,500", date: "Mar 7" },
    { name: "Daniel Lee", initials: "DL", status: "Completed", reward: "₦2,500", date: "Mar 5" },
  ];

  const steps = [
    { num: "1", label: "Share your code", desc: "Send your unique referral code to friends" },
    { num: "2", label: "Friend signs up", desc: "They register and complete verification" },
    { num: "3", label: "Both earn rewards", desc: "You and your friend receive cash rewards" },
  ];

  const stats = [
    { label: "Invited", value: "12", icon: <FaUsers   className="text-secondary-700" />},
    { label: "Completed", value: "8", icon: <FaCheckCircle   className="text-green-500" /> },
    { label: "Pending", value: "4", icon: <Loader   className="text-yellow-600" /> },
    { label: "Earned", value: "₦17.5k", icon: <HandCoins   className="text-green-500" />},
  ];

  const copyCode = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-silver-200 font-sans">
      
      {/* Top Nav */}
      <div className="bg-primary-1200 px-5 py-4 flex items-center gap-3">
        <button className="bg-white/20 rounded-xl w-9 h-9 flex items-center justify-center">
          <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <span className="text-white font-bold text-lg">Invite & Earn</span>
      </div>

      <div className="max-w-md mx-auto flex flex-col gap-4 pb-10">

        {/* Hero Banner */}
        <div className="bg-primary-1200 rounded-b-3xl px-6 pt-7 pb-8 relative overflow-hidden">

          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white opacity-5" />
          <div className="absolute -bottom-16 left-6 w-56 h-56 rounded-full bg-white opacity-5" />

          <div className="relative z-10">

            <div className="inline-flex items-center bg-white/20 rounded-lg px-3 py-1 mb-3">
              <span className="text-white text-xs font-bold tracking-widest">
                🎁 REFER & EARN
              </span>
            </div>

            <h1 className="text-white text-xl font-extrabold leading-snug mb-1">
              Earn <span className="text-primary-600">₦3,000</span> for every
              <br />friend you invite!
            </h1>

            <p className="text-primary-100 text-sm mb-6 opacity-80">
              Your friend gets ₦3,000 too. Win-win!
            </p>

            {/* Code Box */}
            <div className="border border-dashed border-white/50 bg-white/10 rounded-2xl px-5 py-4 flex items-center justify-between backdrop-blur-sm">
              <div>
                <p className="text-white/60 text-xs mb-1">Your Referral Code</p>
                <p className="text-white text-xl font-extrabold tracking-widest">
                  {referralCode}
                </p>
              </div>

              <button
                onClick={copyCode}
                className="bg-white text-primary-500 text-xs font-bold px-4 py-2 rounded-xl hover:bg-primary-200 transition active:scale-95"
              >
                {copied ? "✓ Copied!" : "Copy Code"}
              </button>
            </div>

          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 px-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-3 flex flex-col items-center shadow-sm"
            >
              <span className="text-lg mb-1">{s.icon}</span>
              <p className="text-sm font-extrabold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Invite Link */}
        <div className="bg-white mx-4 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-silver-900 mb-3">Share Invite Link</p>

          <div className="flex gap-2 mb-4">
            <input
              value={referralLink}
              readOnly
              className="flex-1 bg-silver-100 border border-silver-200 rounded-xl px-3 py-3 text-xs text-silver-500 outline-none truncate"
            />

            <button
              onClick={copyLink}
              className={`text-primary-600 text-xs font-bold px-4 py-2 rounded-xl border transition active:scale-95 ${
                copiedLink
                  ? "bg-primary-100 border-primary-200"
                  : "bg-primary-50 border-primary-100 hover:bg-primary-100"
              }`}
            >
              {copiedLink ? "✓ Copied" : "Copy"}
            </button>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 bg-primary-900 hover:bg-primary-1000 text-white text-sm font-bold py-2 rounded-2xl flex items-center justify-center gap-2 transition active:scale-95">
              Share Link
            </button>

            <button className="flex-1 bg-white border-2 border-primary-500 text-primary-500 text-sm font-bold py-2 rounded-2xl hover:bg-primary-50 transition active:scale-95">
              Via SMS
            </button>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white mx-4 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-silver-800 mb-4">How it works</p>

          <div className="flex flex-col gap-4">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center font-extrabold text-sm">
                  {s.num}
                </div>

                <div>
                  <p className="text-sm font-bold text-silver-800">{s.label}</p>
                  <p className="text-xs text-silver-600 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="bg-white mx-4 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-bold text-silver-800">Recent Activity</p>
            <span className="text-xs text-primary-500 font-semibold cursor-pointer">
              See all
            </span>
          </div>

          {referrals.map((ref, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 py-3 ${
                i < referrals.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 text-xs font-bold">
                {ref.initials}
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{ref.name}</p>

                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      ref.status === "Completed"
                        ? "bg-green-200 text-green-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {ref.status}
                  </span>

                  <span className="text-xs text-primary-500">{ref.date}</span>
                </div>
              </div>

              <p
                className={`text-sm font-extrabold ${
                  ref.status === "Completed" ? "text-green-400" : "text-slate-500"
                }`}
              >
                {ref.reward}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 px-8">
          By participating, you agree to our{" "}
          <span className="text-blue-500 font-semibold cursor-pointer">
            Referral Terms & Conditions
          </span>.
        </p>

      </div>
    </div>
  );
}