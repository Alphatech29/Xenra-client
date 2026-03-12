"use client";

import { usePathname, useRouter } from "next/navigation";
import { FaHome, FaWallet, FaTrophy , FaUser, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";

/* moved outside to avoid re-creation every render */
const menus = [
  { name: "Home", icon: FaHome, href: "/dashboard" },
  { name: "Wallet", icon: FaWallet, href: "/dashboard/wallet" },
  { name: "", icon: FaPlus, action: () => console.log("open modal"), center: true },
  { name: "Rewards", icon: FaTrophy , href: "/dashboard/reward"},
  { name: "Profile", icon: FaUser, href: "/dashboard/profile" },
];

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  /* robust active matcher */
  const isActive = (href) => {
    if (!href) return false;

    const pathParts = pathname.split("/");
    const hrefParts = href.split("/");

    // Home (/dashboard only)
    if (hrefParts.length === 2) {
      return pathname === href;
    }

    // Compare dashboard section
    return pathParts[2] === hrefParts[2];
  };

  const navigate = (href) => {
    if (!href || pathname === href) return;
    router.push(href);
  };

  return (
    <div className="fixed bottom-3 left-0 right-0 z-50 flex justify-center px-4">
      <footer className="relative w-full max-w-md backdrop-blur-2xl bg-primary-1100/60 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.35)] rounded-3xl px-2 py-2 flex items-center justify-between">

        {menus.map((menu) => {
          const Icon = menu.icon;
          const active = isActive(menu.href);

          /* CENTER BUTTON */
          if (menu.center) {
            return (
              <button key="center" onClick={menu.action} className="relative -mt-10">
                <motion.div
                  initial={false}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.85, rotate: 90 }}
                  className="relative h-16 w-16 rounded-full bg-linear-to-tr from-primary-900 to-primary-700 shadow-xl flex items-center justify-center border-4 border-primary-1100 overflow-hidden"
                >
                  <motion.span
                    className="absolute inset-0 rounded-full bg-white/20"
                    animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                  />

                  <motion.div whileHover={{ rotate: 180 }}>
                    <Icon className="text-white text-2xl relative z-10" />
                  </motion.div>
                </motion.div>
              </button>
            );
          }

          /* NORMAL MENU */
          return (
            <button
              key={menu.href}
              onClick={() => navigate(menu.href)}
              className="relative flex flex-col items-center justify-center w-full py-2"
            >
              {/* active background */}
              <motion.span
                layoutId="active-pill"
                initial={false}
                animate={{ opacity: active ? 1 : 0 }}
                className="absolute inset-0 rounded-2xl bg-linear-to-b from-primary-900/30 to-primary-900/5"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />

              <motion.div
                initial={false}
                whileTap={{ scale: 0.85 }}
                className={`relative transition-all duration-300 ${
                  active ? "-translate-y-1" : ""
                }`}
              >
                <Icon
                  className={`text-xl ${
                    active ? "text-primary-400" : "text-secondary-300"
                  }`}
                />

                {menu.badge && (
                  <span className="absolute -top-1 -right-2 text-[10px] px-1.5 py-0.5 rounded-full bg-red-500 text-white">
                    {menu.badge}
                  </span>
                )}
              </motion.div>

              <span
                className={`relative text-[11px] mt-1 transition-all duration-300 ${
                  active
                    ? "text-primary-400 font-semibold"
                    : "text-secondary-400"
                }`}
              >
                {menu.name}
              </span>
            </button>
          );
        })}

      </footer>
    </div>
  );
}