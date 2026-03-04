"use client";

import Image from "next/image";
import Link from "next/link";
import { FaBell } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-primary-1200">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-primary-900 to-primary-700 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">X</span>
          </div>

          <div className="leading-tight">
            <h1 className="text-lg font-semibold text-silver-100 tracking-wide">Xenra</h1>
            <p className="text-[10px] text-secondary-400">Smart payments</p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            initial={false}
            whileTap={{ scale: 0.9 }}
            aria-label="Open notifications"
            className="relative h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-silver-50 hover:bg-white/10 transition"
          >
            <FaBell className="text-[18px]" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(255,0,0,0.7)]" />
          </motion.button>

          <MotionLink
            href="/dashboard/profile"
            whileTap={{ scale: 0.92 }}
            className="relative block"
          >
            <Image
              src="/images/avatar.jpg"
              alt="User profile"
              width={36}
              height={36}
              sizes="36px"
              className="rounded-full ring-2 ring-primary-900/60 object-cover"
            />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-primary-1100" />
          </MotionLink>
        </div>

      </div>
    </header>
  );
}