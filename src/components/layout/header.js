"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  Globe,
  Gift,
  Coins,
  ArrowRight,
  Zap,
  Shield,
  Clock,
} from "lucide-react";


const NAV = [
  { href: "/", label: "Home" },
  {
    label: "Products",
    children: [
      {
        href: "/payments",
        label: "Global Payments",
        icon: Globe,
        desc: "Send money to 150+ countries",
      },
      {
        href: "/giftcards",
        label: "Gift Cards",
        icon: Gift,
        desc: "Trade cards at best rates",
      },
      {
        href: "/crypto",
        label: "Crypto Exchange",
        icon: Coins,
        desc: "Swap assets at live market rate",
      },
    ],
  },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const PRODUCT_HIGHLIGHTS = [
  { icon: Zap, label: "Instant Settlements", cx: "text-cyan-400" },
  { icon: Shield, label: "Bank-grade Security", cx: "text-indigo-400" },
  { icon: Clock, label: "24/7 Support", cx: "text-purple-400" },
];

export default function Header() {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const fn = () => setScrolled(window.scrollY > 12);
    fn();
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, [mounted]);


  useEffect(() => {
    const handleClickOutside = (e) => {
      const isInside = Object.values(dropdownRefs.current).some(
        (ref) => ref && ref.contains(e.target),
      );

      if (!isInside) {
        setDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  const isActive = (href) =>
    href
      ? pathname === href || (href !== "/" && pathname.startsWith(href + "/"))
      : false;

  const isGroupActive = (item) => item.children?.some((c) => isActive(c.href));

  return (
    <>
      <header
        className={`xh fixed top-0 left-0 right-0 z-50 transition-all duration-300  ${
          scrolled
            ? "border-b border-white/[.07] bg-[#000c42]/50 backdrop-blur-2xl shadow-[0_4px_32px_rgba(0,0,0,0.55)]"
            : "bg-[#000c42]/90  "
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-17 items-center justify-between gap-6">
            <Link href="/" className="flex shrink-0 items-center gap-3 group">
              <div className="relative">
                <div className="xh-ring" />
                <div className="relative z-10 flex h-9.5 w-9.5 items-center justify-center rounded-[14px] bg-linear-to-br from-cyan-400 to-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.45)]">
                  <span className="xh-syne text-sm font-black text-white">
                    X
                  </span>
                </div>
              </div>
              <span className="xh-syne xh-wordmark text-xl font-extrabold tracking-tight">
                Xenra
              </span>
            </Link>


            <nav className="hidden lg:flex items-center">
              <div className="flex items-center gap-0.5 rounded-2xl border border-white/[.07] bg-white/3 px-1.5 py-1.25 backdrop-blur-xl">
                {NAV.map((item) => {
                  const active = item.href
                    ? isActive(item.href)
                    : isGroupActive(item);
                  const isOpen = dropdown === item.label;

                  /* Dropdown item */
                  if (item.children) {
                    return (
                      <div key={item.label} className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdown(isOpen ? null : item.label);
                          }}
                          className={`flex items-center gap-1 rounded-xl px-3.5 py-1.75 text-sm font-medium transition-all duration-150 ${
                            active || isOpen
                              ? "text-white"
                              : "text-white/50 hover:text-white/85"
                          } ${isOpen ? "bg-white/6" : "hover:bg-white/5"}`}
                        >
                          {item.label}
                          <ChevronDown
                            size={13}
                            className={`transition-transform duration-200 ${isOpen ? "rotate-180 text-cyan-400" : "text-white/35"}`}
                          />
                        </button>

                        {active && !isOpen && (
                          <motion.span
                            layoutId="active-pill"
                            className="xh-active-glow absolute left-3 right-3 -bottom-1.25 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500"
                          />
                        )}

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.97 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              onClick={(e) => e.stopPropagation()}
                              className="xh-dropdown absolute top-[calc(100%+14px)] left-1/2 -translate-x-1/2 w-105 rounded-2xl border border-white/8 shadow-[0_24px_60px_rgba(0,0,0,0.7)] overflow-hidden"
                            >

                              <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

                              <div className="p-4">
                                <p className="xh-mono mb-3 px-1 text-[10px] tracking-[.12em] text-white/25 uppercase">
                                  Our Products
                                </p>

                                <div className="space-y-1">
                                  {item.children.map((child) => {
                                    const Icon = child.icon;
                                    const childActive = isActive(child.href);
                                    return (
                                      <Link
                                        key={child.href}
                                        href={child.href}
                                        onClick={() => setDropdown(null)}
                                        className={`group/item flex items-center gap-3.5 rounded-xl p-3 transition-all duration-150 ${
                                          childActive
                                            ? "bg-gradient-to-r from-cyan-400/10 to-indigo-400/10 border border-cyan-400/20"
                                            : "hover:bg-white/5 border border-transparent"
                                        }`}
                                      >

                                        <div
                                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-150 ${
                                            childActive
                                              ? "bg-cyan-400/15 border-cyan-400/30"
                                              : "bg-white/4 border-white/[.07] group-hover/item:bg-white/8"
                                          }`}
                                        >
                                          <Icon
                                            size={16}
                                            className={
                                              childActive
                                                ? "text-cyan-400"
                                                : "text-white/45 group-hover/item:text-white/80"
                                            }
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p
                                            className={`text-sm font-semibold ${childActive ? "text-white" : "text-white/80 group-hover/item:text-white"}`}
                                          >
                                            {child.label}
                                          </p>
                                          <p className="text-xs text-white/35 mt-0.5">
                                            {child.desc}
                                          </p>
                                        </div>
                                        <ArrowRight
                                          size={14}
                                          className="shrink-0 text-white/20 -translate-x-1 opacity-0 transition-all duration-150 group-hover/item:opacity-100 group-hover/item:translate-x-0"
                                        />
                                      </Link>
                                    );
                                  })}
                                </div>


                                <div className="mt-4 pt-4 border-t border-white/6 flex items-center gap-4">
                                  {PRODUCT_HIGHLIGHTS.map((h) => {
                                    const Icon = h.icon;
                                    return (
                                      <div
                                        key={h.label}
                                        className="flex items-center gap-1.5"
                                      >
                                        <Icon size={11} className={h.cx} />
                                        <span className="xh-mono text-[9px] text-white/30 tracking-[.06em]">
                                          {h.label}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }


                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative rounded-xl px-3.5 py-1.75 text-sm font-medium transition-all duration-150 hover:bg-white/5 ${
                        active
                          ? "text-white"
                          : "text-white/50 hover:text-white/85"
                      }`}
                    >
                      {item.label}
                      {active && (
                        <motion.span
                          layoutId="active-pill"
                          className="xh-active-glow absolute left-3 right-3 -bottom-1.25 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>


            <div className="hidden lg:flex items-center gap-2.5 shrink-0">
              <div className="flex items-center gap-1.5 rounded-lg border border-white/6 bg-white/2 px-2.5 py-1.5">
                <span className="xh-blink inline-block h-1.25 w-1.25 rounded-full bg-cyan-400" />
                <span className="xh-mono text-[9px] tracking-widest text-white/28">
                  LIVE
                </span>
              </div>

              <Link
                href="/auth/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-white/50 transition-colors duration-150 hover:text-white hover:bg-white/4"
              >
                Sign in
              </Link>

              <Link
                href="/auth/register"
                className="xh-cta group relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(99,102,241,0.4)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_28px_rgba(99,102,241,0.55)]"
              >
                <span className="xh-sweep pointer-events-none absolute inset-0 bg-white/20" />
                <span className="relative z-10 flex items-center gap-1.5">
                  Get Started
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </div>

            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation"
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/4 text-white/70 transition-colors hover:bg-white/8 hover:text-white"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={open ? "x" : "m"}
                  initial={{ opacity: 0, rotate: open ? -80 : 80 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {open ? <X size={18} /> : <Menu size={18} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="lg:hidden px-3 pb-3"
            >
              <div className="relative rounded-2xl border border-white/8 bg-[#000c42]/97 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.75)] overflow-hidden">
                {/* Top cyan accent */}
                <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

                <div className="p-4 space-y-1">
                  {NAV.map((item, i) => {
                    if (item.children) {
                      return (
                        <div key={item.label}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDropdown(
                                dropdown === item.label ? null : item.label,
                              );
                            }}
                            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-white/55 hover:bg-white/5 hover:text-white transition-all"
                          >
                            {item.label}
                            <ChevronDown
                              size={14}
                              className={`transition-transform duration-200 text-white/30 ${dropdown === item.label ? "rotate-180 text-cyan-400/70" : ""}`}
                            />
                          </button>

                          <AnimatePresence>
                            {dropdown === item.label && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="ml-3 mt-1 space-y-0.5 border-l border-white/[.07] pl-3 pb-2">
                                  {item.children.map((child) => {
                                    const Icon = child.icon;
                                    return (
                                      <Link
                                        key={child.href}
                                        href={child.href}
                                        onClick={() => {
                                          setOpen(false);
                                          setDropdown(null);
                                        }}
                                        className="group/c flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all hover:bg-white/5"
                                      >
                                        <Icon
                                          size={14}
                                          className="shrink-0 text-white/30 group-hover/c:text-cyan-400 transition-colors"
                                        />
                                        <div>
                                          <p className="font-medium text-white/65 group-hover/c:text-white transition-colors">
                                            {child.label}
                                          </p>
                                          <p className="text-[11px] text-white/30">
                                            {child.desc}
                                          </p>
                                        </div>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }

                    const active = isActive(item.href);
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 ${
                            active
                              ? "bg-gradient-to-r from-cyan-400/10 to-indigo-400/10 border border-cyan-400/20 text-white"
                              : "text-white/50 hover:bg-white/5 hover:text-white/85"
                          }`}
                        >
                          {item.label}
                          {active && (
                            <span className="xh-mono flex items-center gap-1 text-[9px] text-cyan-400 tracking-[.08em]">
                              <span className="xh-blink inline-block h-1 w-1 rounded-full bg-cyan-400" />
                              ACTIVE
                            </span>
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mx-4 h-px bg-white/6" />


                <div className="p-4 space-y-2.5">
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="block w-full rounded-xl border border-white/9 bg-white/3 px-4 py-3 text-center text-sm font-medium text-white/60 transition-all hover:bg-white/[.07] hover:text-white"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setOpen(false)}
                    className="xh-cta group relative block w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_4px_20px_rgba(99,102,241,0.4)]"
                  >
                    <span className="xh-sweep pointer-events-none absolute inset-0 bg-white/20" />
                    <span className="relative z-10">Get Started →</span>
                  </Link>

                  <p className="xh-mono text-center text-[9px] tracking-[.08em] text-white/20 pt-0.5">
                    BANK-GRADE SECURITY · 150+ COUNTRIES
                  </p>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="h-17" />
    </>
  );
}

