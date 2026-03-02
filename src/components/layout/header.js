"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Wait until browser mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe scroll listener (runs only in browser)
  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => setScrolled(window.scrollY > 10);

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  // Prevent hydration mismatch
  if (!mounted) return null;

  const NavItem = ({ href, label }) => {
    const isActive =
      pathname === href || pathname.startsWith(href + "/");

    return (
      <Link
        href={href}
        onClick={() => setOpen(false)}
        className="relative group px-3 py-2 text-sm font-medium text-white/70 transition"
      >
        <span className="relative z-10 transition group-hover:text-white">
          {label}
        </span>

        <span className="absolute inset-0 z-0 rounded-xl opacity-0 backdrop-blur-xl transition group-hover:opacity-100 bg-white/5" />

        {isActive && (
          <motion.span
            layoutId="active-pill"
            className="absolute left-2 right-2 -bottom-1 h-0.5 rounded-full bg-linear-to-r from-secondary-400 via-secondary-500 to-primary-500 shadow-[0_0_12px_rgba(56,189,248,0.6)]"
          />
        )}
      </Link>
    );
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-[#050816]/80 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-400 to-indigo-600 text-black font-bold shadow-lg shadow-indigo-600/40">
              X
              <span className="absolute inset-0 rounded-2xl bg-white/20 blur-md opacity-40" />
            </div>
            <span className="text-lg font-semibold tracking-wide text-white">
              Xenra
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-2 md:flex">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-2 py-1 backdrop-blur-xl">
              {NAV_LINKS.map((link) => (
                <NavItem key={link.href} {...link} />
              ))}
            </div>
          </nav>

          {/* CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-white/70 transition hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="rounded-xl bg-linear-to-r from-cyan-500 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:scale-[1.05] hover:shadow-indigo-500/50"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white backdrop-blur-xl md:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden"
          >
            <div className="mx-4 mt-3 rounded-3xl border border-white/10 bg-[#050816]/95 p-6 backdrop-blur-2xl shadow-2xl">
              <div className="flex flex-col items-center gap-3">
                {NAV_LINKS.map((link) => (
                  <NavItem key={link.href} {...link} />
                ))}

                <div className="mt-4 w-full space-y-3">
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-white/80 backdrop-blur-xl"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setOpen(false)}
                    className="block w-full rounded-xl bg-linear-to-r from-cyan-500 to-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-600/30"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}