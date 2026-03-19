"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaHome, FaWallet, FaTrophy, FaUser, FaPlus } from "react-icons/fa";
import {
  MdPhoneAndroid,
  MdWifi,
  MdElectricBolt,
  MdTv,
  MdWater,
  MdSchool,
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const menus = [
  { name: "Home", icon: FaHome, href: "/dashboard" },
  { name: "Wallet", icon: FaWallet, href: "/dashboard/wallet" },
  { name: "", icon: FaPlus, center: true },
  { name: "Rewards", icon: FaTrophy, href: "/dashboard/reward" },
  { name: "Profile", icon: FaUser, href: "/dashboard/profile" },
];

const quickActions = [
  {
    label: "Airtime",
    icon: MdPhoneAndroid,
    href: "/dashboard/airtime",
    color: "from-blue-500 to-blue-600",
  },
  {
    label: "Data",
    icon: MdWifi,
    href: "/dashboard/data-purchase",
    color: "from-violet-500 to-violet-600",
  },
  {
    label: "Electricity",
    icon: MdElectricBolt,
    href: "/dashboard/electricity",
    color: "from-yellow-400 to-yellow-500",
    textDark: true,
  },
  {
    label: "Cable TV",
    icon: MdTv,
    href: "/dashboard/cable-tv",
    color: "from-rose-500 to-rose-600",
  },
  {
    label: "Water",
    icon: MdWater,
    href: "/dashboard/water",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    label: "Education",
    icon: MdSchool,
    href: "/dashboard/education",
    color: "from-emerald-500 to-emerald-600",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.055, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 280, damping: 22 },
  },
};

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [openModal]);

  const isActive = (href) => {
    if (!href) return false;
    const pathParts = pathname.split("/");
    const hrefParts = href.split("/");
    if (hrefParts.length === 2) return pathname === href;
    return pathParts[2] === hrefParts[2];
  };

  const navigate = (href) => {
    if (!href || pathname === href) return;
    router.push(href);
  };

  const handleAction = (href) => {
    setOpenModal(false);
    setTimeout(() => router.push(href), 180);
  };

  return (
    <>
      <div className="fixed bottom-3 left-0 right-0 z-40 flex justify-center px-4">
        <footer className="relative w-full max-w-md backdrop-blur-2xl bg-primary-1100/60 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.35)] rounded-3xl px-2 py-2 flex items-center justify-between">
          {menus.map((menu) => {
            const Icon = menu.icon;
            const active = isActive(menu.href);

            if (menu.center) {
              return (
                <button
                  key="center"
                  onClick={() => setOpenModal((prev) => !prev)}
                  aria-label="Quick actions"
                  className="relative -mt-10"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.88 }}
                    className="relative h-16 w-16 rounded-full bg-linear-to-tr from-primary-900 to-primary-700 shadow-[0_8px_28px_rgba(0,0,0,0.4)] flex items-center justify-center border-4 border-primary-1100 overflow-hidden"
                  >
                    <motion.span
                      className="absolute inset-0 rounded-full bg-white/15"
                      animate={{ scale: [1, 1.9], opacity: [0.5, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                    <motion.div
                      animate={openModal ? { rotate: 45 } : { rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 18,
                      }}
                    >
                      <Icon className="text-white text-2xl relative z-10" />
                    </motion.div>
                  </motion.div>
                </button>
              );
            }

            return (
              <button
                key={menu.href}
                onClick={() => navigate(menu.href)}
                className="relative flex flex-col items-center justify-center w-full py-2 group"
              >
                <AnimatePresence>
                  {active && (
                    <motion.span
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-2xl bg-linear-to-b from-primary-900/30 to-primary-900/5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </AnimatePresence>

                <motion.div
                  whileTap={{ scale: 0.82 }}
                  className={`relative transition-all duration-300 ${
                    active ? "-translate-y-1" : ""
                  }`}
                >
                  <Icon
                    className={`text-xl transition-colors duration-200 ${
                      active
                        ? "text-primary-400"
                        : "text-secondary-300 group-hover:text-secondary-200"
                    }`}
                  />
                </motion.div>

                <span
                  className={`relative text-[11px] mt-1 transition-all duration-200 ${
                    active
                      ? "text-primary-400 font-semibold"
                      : "text-secondary-400 group-hover:text-secondary-300"
                  }`}
                >
                  {menu.name}
                </span>
              </button>
            );
          })}
        </footer>
      </div>

      <AnimatePresence>
        {openModal && (
          <motion.div
            className="fixed inset-0 z-20 flex items-end justify-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute inset-0 bg-primary-1000/25"
              onClick={() => setOpenModal(false)}
            />

            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md mb-24 mx-4 rounded-3xl bg-linear-to-br from-primary-1000 to-primary-950"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary-500/60 to-transparent" />

              <motion.div
                className="absolute -bottom-2.75 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{
                  delay: 0.18,
                  type: "spring",
                  stiffness: 240,
                  damping: 20,
                }}
                style={{ transformOrigin: "top center" }}
              >
                <div className="relative w-0 h-0 border-l-12 border-r-12 border-t-12 border-l-transparent border-r-transparent border-t-white/10">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-40 border-r-10 border-t-20 border-l-transparent border-r-transparent border-t-primary-950" />
                </div>
              </motion.div>

              <div className="px-5 pt-5 pb-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-slate-500 font-medium mb-0.5">
                      Quick Access
                    </p>
                    <h2 className="text-[14px] font-semibold text-white">
                      What would you like to do?
                    </h2>
                  </div>
                </div>

                <div className="h-px bg-white/5 mb-5" />

                <motion.div
                  className="grid grid-cols-3 gap-3"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <motion.button
                        key={action.label}
                        variants={itemVariants}
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAction(action.href)}
                        className="flex flex-col items-center gap-2.5 "
                      >
                        <div
                          className={`w-11 h-11 rounded-full bg-linear-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
                        >
                          <Icon
                            className={`text-xl ${
                              action.textDark ? "text-gray-900" : "text-white"
                            }`}
                          />
                        </div>

                        <span className="text-[12px] text-slate-300 font-medium group-hover:text-white transition-colors">
                          {action.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </motion.div>

                <p className="text-center text-[11px] text-silver-400 mt-5">
                  Tap any service to get started instantly
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
