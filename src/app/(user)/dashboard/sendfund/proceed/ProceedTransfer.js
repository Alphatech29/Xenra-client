
"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ShieldCheck, Landmark } from "lucide-react";
import { useRouter } from "next/navigation";

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

  const [beneficiary, setBeneficiary] = useState(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  /* -------- Load -------- */
  useEffect(() => {
    const saved = sessionStorage.getItem("transfer_recipient");
    if (!saved) return;

    try {
      setBeneficiary(JSON.parse(saved));
    } catch {
      sessionStorage.removeItem("transfer_recipient");
    }
  }, []);

  /* -------- Amount Handling -------- */
  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/,/g, "").replace(/\D/g, "");
    if (raw.length > 9) return;
    setAmount(raw);
  };

  const numericAmount = Number(amount || 0);

  const format = (val) =>
    new Intl.NumberFormat("en-NG").format(val || 0);

  /* -------- Charges -------- */
  const fee = useMemo(() => {
    if (!numericAmount) return 0;
    if (numericAmount < 5000) return 10;
    if (numericAmount < 50000) return 25;
    return 50;
  }, [numericAmount]);

  const vat = Math.round(fee * 0.075);
  const total = numericAmount + fee + vat;
  const canContinue = numericAmount > 0;

  if (!beneficiary) return null;

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
            pattern="[0-9]*"
            autoComplete="off"
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
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:border-primary-400/40 focus:ring-2 focus:ring-primary-400/10 outline-none transition"
        />
      </div>

      {/* TRANSACTION SUMMARY */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-4 backdrop-blur-xl">
        <h3 className="text-sm font-semibold text-white tracking-wide">
          Transaction Summary
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Amount</span>
            <span className="text-white font-medium">₦{format(numericAmount)}</span>
          </div>

          <div className="flex justify-between text-gray-400">
            <span>Transfer fee</span>
            <span>₦{format(fee)}</span>
          </div>

          <div className="flex justify-between text-gray-400">
            <span>VAT (7.5%)</span>
            <span>₦{format(vat)}</span>
          </div>

          {note && (
            <div className="flex justify-between text-gray-400">
              <span>Narration</span>
              <span className="text-white max-w-[60%] truncate text-right">
                {note}
              </span>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-between text-lg font-semibold text-white">
          <span>Total Debit</span>
          <span>₦{format(total)}</span>
        </div>
      </div>

      {/* CONTINUE BUTTON */}
      <div className="p-3">
        <button
          disabled={!canContinue}
          onClick={() => {
            sessionStorage.setItem(
              "transfer_payment",
              JSON.stringify({
                ...beneficiary,
                amount: numericAmount,
                fee,
                vat,
                total,
                narration: note,
              })
            );

            router.push("/dashboard/sendfund/confirm");
          }}
          className={`w-full py-3 rounded-2xl font-semibold text-lg transition-all duration-200 ${
            canContinue
              ? "bg-primary-500 hover:bg-primary-600 active:scale-[0.98] text-white shadow-lg shadow-primary-600/30"
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
    </div>
  );
}

