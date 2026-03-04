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

export default function FintechProfile() {
  const router = useRouter();
  const { logout, loading } = useLogout();

  const handleLogout = async () => {
    const res = await logout();

    if (res?.success !== false) {
      router.push("/auth/login");
      router.refresh();
    }
  };

  const user = {
    id: "PSQ-88472921",
    username: "gabriel_dev",
    name: "Gabriel Itodo",
    avatar: "",
    email: "gabriel@example.com",
    phone: "+234 812 345 6789",
    country: "Nigeria",
    bank: "Paysparq Bank",
    kyc: "Verified",
    accountNumber: "3029 8847 2291",
    tier: "Premium",
  };

  /* ---------------- Avatar Logic ---------------- */

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
      <button  onClick={onClick} className="text-sm text-yellow-500 hover:text-primary-300 font-medium">
        {action}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen pb-32 bg-linear-to-b from-primary-1200 via-primary-950 to-primary-1200 text-silver-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* PROFILE */}
        <ProfileDetails user={user}/>

        {/* SECURITY */}
        <Card delay={0.05}>
          <h2 className="text-xl font-semibold">Security</h2>
          <div className="space-y-4">
            <ActionRow icon={Lock} title="Transaction PIN" action="Change"   onClick={() => router.push("/dashboard/transactionPin")}/>
            <ActionRow icon={KeyRound} title="Change Password" action="Update" />
            <ActionRow icon={Smartphone} title="2-Factor Authentication" action="Enable" />
            <ActionRow icon={Eye} title="Privacy Settings" action="Configure" />
          </div>
        </Card>

        {/* PREFERENCES */}
        <Card delay={0.1}>
          <h2 className="text-xl font-semibold">Preferences</h2>
          <ActionRow icon={Bell} title="Notifications" action="Manage" />
        </Card>

        {/* HELP */}
        <Card delay={0.15}>
          <h2 className="text-xl font-semibold">Help & Support</h2>
          <div className="space-y-4">
            <ActionRow icon={LifeBuoy} title="Help Center" action="Open" />
            <ActionRow icon={Mail} title="Contact Support" action="Send Message" />
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