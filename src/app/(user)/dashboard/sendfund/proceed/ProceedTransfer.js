"use client";
import { ArrowLeft, ShieldCheck, Landmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ModalBottomSheet from "../../_components/modal";
import { useTransfer } from "../../../../../hooks/useTransfer";

/* ---------------- Avatar ---------------- */
const BankAvatar = ({ name }) => {
  if (!name) return null;

  const words = name.split(" ");
  const initials = `${words[0]?.[0] || ""}${words[1]?.[0] || ""}`.toUpperCase();

  return (
    <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary-500/30 to-primary-600/10 text-primary-300 flex items-center justify-center font-bold tracking-widest text-sm shadow-inner border border-primary-400/20">
      {initials}
    </div>
  );
};

export default function ProceedTransfer() {
  const router = useRouter();

  const {
    beneficiary,
    note,
    setNote,
    pin,
    inputs,

    openPreview,
    askPin,
    processing,
    success,
    error,

    setAskPin,
    setOpenPreview,

    numericAmount,
    fee,
    total,
    canContinue,

    handleAmountChange,
    handlePinChange,
    handleKeyDown,
    format,

    initiateTransfer,
  } = useTransfer();

  if (!beneficiary) return null;

  const handleAuthorize = async () => {
    await initiateTransfer();
  };

  return (
    <div className="max-w-md mx-auto pb-32 px-4 py-6 space-y-4">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition"
        >
          <ArrowLeft className="text-white" size={18} />
        </button>

        <h1 className="text-lg font-semibold text-white tracking-wide">
          Send Money
        </h1>
      </div>

      {/* BENEFICIARY */}
      <div className="rounded-2xl bg-linear-to-br from-white/10 to-white/5 border border-white/10 p-4 flex items-center gap-4 backdrop-blur-xl shadow-lg">
        <BankAvatar name={beneficiary.bank_name} />

        <div className="flex-1">
          <p className="text-white font-semibold line-clamp-2 uppercase">
            {beneficiary.account_name}
          </p>

          <p className="text-xs text-gray-400">
            {beneficiary.bank_name} • {beneficiary.account_number}
          </p>
        </div>

        <Landmark className="text-primary-400/70" size={18} />
      </div>

      {/* AMOUNT */}
      <div className="text-center space-y-3">
        <p className="text-gray-400 text-sm">Enter amount</p>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl text-gray-400">
            ₦
          </span>

          <input
            type="tel"
            inputMode="numeric"
            value={format(numericAmount)}
            onChange={handleAmountChange}
            placeholder="0"
            className="w-full text-center bg-transparent border-none outline-none text-white text-4xl font-bold tracking-tight py-3 caret-orange-400"
          />
        </div>

        <div className="text-xs text-gray-500">Instant transfer</div>
      </div>

      {/* NOTE */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase tracking-wider">
          Narration
        </label>

        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional)"
          className="w-full bg-white/5 border focus:outline-0 border-primary-400/30 rounded-xl px-4 py-3 text-white"
        />
      </div>

      {/* SUMMARY */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-4 backdrop-blur-xl">
        <h3 className="text-sm font-semibold text-white tracking-wide">
          Transaction Summary
        </h3>

        <div className="flex justify-between text-gray-400">
          <span>Amount</span>
          <span className="text-white font-medium">
            ₦{format(numericAmount)}
          </span>
        </div>

        <div className="flex justify-between text-gray-400">
          <span>Transfer fee</span>
          <span>₦{format(fee)}</span>
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-between text-lg font-semibold text-white">
          <span>Total Debit</span>
          <span>₦{format(total)}</span>
        </div>
      </div>

      {/* CONTINUE */}
      <div className="p-3">
        <button
          disabled={!canContinue}
          onClick={() => {
            setAskPin(false);
            setOpenPreview(true);
          }}
          className={`w-full py-3 rounded-2xl font-semibold text-lg ${
            canContinue
              ? "bg-primary-500 text-white"
              : "bg-secondary-800 text-silver-500"
          }`}
        >
          Continue
        </button>

        <div className="flex items-center justify-center gap-2 text-[11px] text-silver-500 mt-3">
          <ShieldCheck size={13} />
          Bank-grade encrypted payment
        </div>
      </div>

      {/* MODAL */}
      <ModalBottomSheet
        open={openPreview}
        onClose={() => {
          if (processing || success) return;
          setOpenPreview(false);
        }}
      >

        {/* ERROR */}
        {error && !processing && !success && (
          <div className="mx-5 mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <ShieldCheck className="text-primary-400" size={36} />
            </motion.div>

            <div>
              <p className="text-white text-lg font-semibold">
                Transfer Successful
              </p>

              <p className="text-silver-400 text-sm">
                ₦{format(numericAmount)} sent to
              </p>

              <p className="text-white font-semibold">
                {beneficiary.account_name}
              </p>
            </div>

            <button
              onClick={() => {
                setOpenPreview(false);
                router.push("/dashboard/sendfund");
              }}
              className="w-full py-3 rounded-xl bg-primary-500 text-white"
            >
              Done
            </button>

          </div>
        )}

        {/* PROCESSING */}
        {processing && !success && (
          <div className="flex flex-col items-center gap-6 py-16">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>

            <p className="text-white font-semibold">
              Processing Transfer...
            </p>
          </div>
        )}

        {/* CONFIRM */}
        {!processing && !askPin && !success && (
          <div className="p-5 space-y-4">

            <h3 className="text-white text-lg font-semibold text-center">
              Confirm Transfer
            </h3>

            <div className="flex justify-between text-gray-400">
              <span>Recipient</span>
              <span className="text-white">{beneficiary.account_name}</span>
            </div>

            <div className="flex justify-between text-gray-400">
              <span>Bank</span>
              <span className="text-white">{beneficiary.bank_name}</span>
            </div>

            <div className="flex justify-between text-gray-400">
              <span>Amount</span>
              <span className="text-white">₦{format(numericAmount)}</span>
            </div>

            <div className="flex justify-between text-gray-400">
              <span>Total Debit</span>
              <span className="text-white">₦{format(total)}</span>
            </div>

            <button
              onClick={() => setAskPin(true)}
              className="w-full py-3 rounded-xl bg-primary-500 text-white"
            >
              Confirm Transfer
            </button>

          </div>
        )}

        {/* PIN */}
        {!processing && askPin && !success && (
          <div className="p-6 space-y-6 text-center">

            <h3 className="text-white text-lg font-semibold">
              Enter Transaction PIN
            </h3>

            <div className="flex justify-center gap-3">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputs.current[index] = el)}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center rounded-xl bg-white/5 border border-white/10 text-white"
                />
              ))}
            </div>

            <button
              disabled={pin.join("").length < 4 || processing}
              onClick={handleAuthorize}
              className="w-full py-3 rounded-xl bg-primary-500 text-white disabled:opacity-40"
            >
              Authorize Transfer
            </button>

          </div>
        )}

      </ModalBottomSheet>

    </div>
  );
}