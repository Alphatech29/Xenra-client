"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Home, Info, AlertTriangle } from "lucide-react"


export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary-1200 text-white px-6">
      {/* background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.25),transparent_45%)]" />

      {/* floating blur shapes */}
      <div className="absolute -top-40 -left-40 w-125 h-125 bg-blue-500/20 blur-[140px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-125 h-125 bg-purple-500/20 blur-[140px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-10 max-w-lg text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
            <AlertTriangle className="w-10 h-10 text-blue-400" />
          </div>
        </div>

        <p className="text-xs uppercase tracking-[0.4em] text-gray-400">404 Error</p>

        <h1 className="mt-4 text-5xl font-extrabold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Page not found
        </h1>

        <p className="mt-5 text-gray-400 leading-relaxed">
          The page you’re trying to access doesn’t exist anymore or may have been moved to another location.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black px-6 py-3 text-sm font-semibold hover:scale-105 active:scale-95 transition-all"
          >
            <Home className="w-4 h-4" />
            Back Home
          </Link>

          <Link
            href="/contact-us"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold hover:bg-white/10 hover:scale-105 active:scale-95 transition-all"
          >
            <Info className="w-4 h-4" />
            Contact Support
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

