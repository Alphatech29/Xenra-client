"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function ProfileDetails({ user }) {
  const hasAvatar =
    user.avatar &&
    typeof user.avatar === "string" &&
    (user.avatar.startsWith("http") || user.avatar.startsWith("/"));

  const getInitials = (name = "") => {
    if (!name) return "?";

    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase();

    return ((parts[0][0] || "") + (parts[1][0] || "")).toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/5 rounded-3xl p-5 border border-primary-300/10 space-y-4"
    >
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <ShieldCheck size={20} /> Profile Details
      </h2>

      <div className="flex items-center gap-5">
        {hasAvatar ? (
          <img
            src={user.avatar}
            alt="avatar"
            className="w-20 h-20 rounded-full border-2 border-primary-500 object-cover shadow-lg"
          />
        ) : (
          <div className="w-20 h-20 rounded-full border-2 border-primary-300/10 bg-primary-700/15 flex items-center justify-center text-2xl font-bold shadow-lg">
            {getInitials(user.name)}
          </div>
        )}

        <div>
          <div className="text-lg font-semibold">{user.name}</div>
          <div className="text-silver-500">@{user.username}</div>

          <div className="text-green-400 text-sm flex items-center gap-1 mt-1">
            <ShieldCheck size={14} /> {user.kyc}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {[
          ["User ID", user.id],
          ["Email Address", user.email],
          ["Phone Number", user.phone],
          ["Country", user.country],
        ].map(([label, value], i) => (
          <div key={i}>
            <div className="text-sm text-silver-400">{label}</div>
            <div className="font-medium tracking-wide">{value}</div>
          </div>
        ))}

        <div className="flex justify-center items-center mt-4 border-t border-primary-300/40 pt-4">
          <button className="text-sm text-yellow-500 hover:text-primary-300 font-medium">
            Edit Profile
          </button>
        </div>
      </div>
    </motion.div>
  );
}