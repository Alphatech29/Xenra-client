"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransactionPin } from "../../../../hooks/useTransactionPin";
import AlertModal from "../../dashboard/_components/alertModal";

export default function TransactionPin({ mode = "create" }) {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    pin,
    error,
    inputRef,
    handleChange,
    handleSubmit,
    getTitle,
  } = useTransactionPin(mode);

  const submitPin = async () => {
    if (loading) return;

    setLoading(true);

    const result = await handleSubmit();

    setLoading(false);

    if (result === "success") {
      setShowSuccess(true);
    }
  };

  return (
    <div className="min-h-screen pb-32 flex flex-col text-white px-4 py-6">

      {/* FULL SCREEN LOADER */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full"
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
        >
          <ArrowLeft size={18} />
        </button>

        <h2 className="text-lg font-semibold">Transaction PIN</h2>
      </div>

      {/* Center Content */}
      <div className="flex mt-28 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8"
        >

          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary-400/10 flex items-center justify-center">
              <Lock className="text-primary-400" size={28} />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 text-center py-2 text-sm text-red-400 border border-red-500/20">
              {error}
            </p>
          )}

          {/* Title */}
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">{getTitle()}</h3>

            <p className="text-sm text-silver-400">
              Secure your transactions with your 4-digit PIN
            </p>
          </div>

          {/* Hidden Input */}
          <input
            ref={inputRef}
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={handleChange}
            className="absolute opacity-0"
          />

          {/* PIN Dots */}
          <div
            onClick={() => inputRef.current?.focus()}
            className="flex justify-center gap-5 cursor-text"
          >
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: pin.length > i ? 1.15 : 1,
                }}
                className={`w-6 h-6 rounded-full border-2 transition ${
                  pin.length > i
                    ? "bg-primary-400 border-primary-400"
                    : "border-white/30"
                }`}
              />
            ))}
          </div>

          {/* Button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={submitPin}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary-500 hover:bg-primary-600 transition font-semibold disabled:opacity-50"
          >
            {loading ? "Processing..." : "Continue"}
          </motion.button>

        </motion.div>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <AlertModal
          type="success"
          title="PIN Created Successfully"
          message="Your transaction PIN has been set. You can now make secure transfers."
          onClose={() => {
            setShowSuccess(false);
          }}
        />
      )}

    </div>
  );
}