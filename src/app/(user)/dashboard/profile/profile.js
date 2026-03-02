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

export default function FintechProfile() {
  const user = {
    id: "PSQ-88472921",
    username: "gabriel_dev",
    name: "Gabriel Itodo",
    email: "gabriel@example.com",
    phone: "+234 812 345 6789",
    country: "Nigeria",
    bank: "Paysparq Bank",
    kyc: "Verified",
    accountNumber: "3029 8847 2291",
    tier: "Premium",
    avatar: "https://i.pravatar.cc/150?img=12",
  };

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

  const ActionRow = ({ icon: Icon, title, action }) => (
    <div className="flex items-center justify-between bg-white/5 hover:bg-white/10 transition rounded-2xl p-4">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-primary-400" />
        <span>{title}</span>
      </div>
      <button className="text-sm text-yellow-500 hover:text-primary-300 font-medium">
        {action}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen pb-32 bg-linear-to-b from-primary-1200 via-primary-950 to-primary-1200 text-silver-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* PROFILE */}
        <Card>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShieldCheck size={20} /> Profile Details
          </h2>

          <div className="flex items-center gap-5">
            <img
              src={user.avatar}
              alt="avatar"
              className="w-20 h-20 rounded-full border-2 border-primary-500 object-cover shadow-lg"
            />

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
            <div className=" flex justify-center items-center mt-4 border-t border-primary-300/40 pt-4">
              <button className="text-sm text-yellow-500 hover:text-primary-300 font-medium">
                Edit Profile
              </button>
            </div>
          </div>
        </Card>

        {/* SECURITY */}
        <Card delay={0.05}>
          <h2 className="text-xl font-semibold">Security</h2>

          <div className="space-y-4">
            <ActionRow icon={Lock} title="Transaction PIN" action="Change" />
            <ActionRow icon={KeyRound} title="Change Password" action="Update" />
            <ActionRow icon={Smartphone} title="2‑Factor Authentication" action="Enable" />
            <ActionRow icon={Eye} title="Privacy Settings" action="Configure" />
          </div>
        </Card>

        {/* NOTIFICATIONS */}
        <Card delay={0.1}>
          <h2 className="text-xl font-semibold">Preferences</h2>
          <ActionRow icon={Bell} title="Notifications" action="Manage" />
        </Card>

        {/* HELP & SUPPORT */}
        <Card delay={0.15}>
          <h2 className="text-xl font-semibold">Help & Support</h2>

          <div className="space-y-4">
            <ActionRow icon={LifeBuoy} title="Help Center" action="Open" />
            <ActionRow icon={Mail} title="Contact Support" action="Send Message" />
          </div>
        </Card>

       <div className="flex justify-center items-center">
         {/* LOGOUT */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          className=" flex items-center justify-center gap-2 font-semibold "
        >
          <LogOut size={18} /> Log Out
        </motion.button>
       </div>

      </div>
    </div>
  );
}
