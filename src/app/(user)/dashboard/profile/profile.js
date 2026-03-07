"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Bell,
  Eye,
  LifeBuoy,
  Mail,
  Smartphone,
  KeyRound,
  LogOut,
} from "lucide-react";
import { useLogout } from "../../../../hooks/useAuth";
import { useRouter } from "next/navigation";
import ProfileDetails from "../_components/profileDetails";
import { useUser } from "../../../../hooks/useUser";

export default function FintechProfile() {
  const router = useRouter();
  const { logout, loading } = useLogout();
  const { user: userData } = useUser();

  const handleLogout = async () => {
    const res = await logout();

    if (res?.success !== false) {
      router.push("/auth/login");
      router.refresh();
    }
  };

  /* ---------------- Avatar Logic ---------------- */

  const getInitials = (name = "") => {
    if (!name) return "?";

    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase();

    return ((parts[0][0] || "") + (parts[1][0] || "")).toUpperCase();
  };

  const avatar = userData?.avatar || "";
  const hasAvatar =
    avatar &&
    typeof avatar === "string" &&
    (avatar.startsWith("http") || avatar.startsWith("/"));

  /* ---------------- User Object ---------------- */

  const user = {
    id: "PSQ-88472921",
    username: userData?.username || "",
    name: userData?.full_name || "",
    avatar: hasAvatar ? avatar : "",
    initials: !hasAvatar ? getInitials(userData?.full_name || "") : "",
    email: userData?.email || "",
    phone: userData?.phone_number || "",
    country: userData?.country || "Not set",
    is_email_verified: userData?.is_email_verified === 1 ? "Verified" : "Not Verified",
  };

  /* ---------------- UI Components ---------------- */

  const Card = ({ children, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="backdrop-blur-xl bg-white/5 rounded-3xl p-5 border border-primary-300/10 space-y-4"
    >
      {children}
    </motion.div>
  );

  const ActionRow = ({ icon: Icon, title, action, onClick }) => (
    <div className="flex items-center justify-between bg-white/5 hover:bg-white/10 transition rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-primary-400" />
        <span>{title}</span>
      </div>
      <button
        onClick={onClick}
        className="text-sm text-yellow-500 hover:text-primary-300 font-medium"
      >
        {action}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen pb-32 bg-linear-to-b from-primary-1200 via-primary-950 to-primary-1200 text-silver-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* PROFILE */}
        <ProfileDetails user={user} />

        {/* SECURITY */}
        <Card delay={0.05}>
          <h2 className="text-xl font-semibold">Security</h2>
          <div className="space-y-4">
            <ActionRow
              icon={Lock}
              title="Transaction PIN"
              action="Change"
              onClick={() => router.push("/dashboard/transactionPin")}
            />
            <ActionRow
              icon={KeyRound}
              title="Change Password"
              action="Update"
            />
            <ActionRow
              icon={Smartphone}
              title="2-Factor Authentication"
              action="Enable"
            />
            <ActionRow
              icon={Eye}
              title="Privacy Settings"
              action="Configure"
            />
          </div>
        </Card>

        {/* PREFERENCES */}
        <Card delay={0.1}>
          <h2 className="text-xl font-semibold">Preferences</h2>
          <ActionRow
            icon={Bell}
            title="Notifications"
            action="Manage"
          />
        </Card>

        {/* HELP */}
        <Card delay={0.15}>
          <h2 className="text-xl font-semibold">Help & Support</h2>
          <div className="space-y-4">
            <ActionRow
              icon={LifeBuoy}
              title="Help Center"
              action="Open"
            />
            <ActionRow
              icon={Mail}
              title="Contact Support"
              action="Send Message"
            />
          </div>
        </Card>

        {/* LOGOUT */}
        <div className="flex justify-center items-center">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center justify-center gap-2 font-semibold text-red-400 hover:text-red-300 transition"
          >
            <LogOut size={18} />
            {loading ? "Logging out..." : "Log Out"}
          </motion.button>
        </div>

      </div>
    </div>
  );
}