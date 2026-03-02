"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import BottomSheet from "../_components/vtuModal";

const NETWORKS = [
  {
    id: "mtn",
    name: "MTN",
    accent: "from-yellow-400 to-yellow-500",
    text: "text-black",
    logo: "/images/mtn.png",
  },
  {
    id: "airtel",
    name: "Airtel",
    accent: "from-red-500 to-red-600",
    text: "text-white",
    logo: "/images/airtel.png",
  },
  {
    id: "glo",
    name: "Glo",
    accent: "from-green-500 to-green-700",
    text: "text-white",
    logo: "/images/glo.png",
  },
  {
    id: "9mobile",
    name: "T2Mobile",
    accent: "from-orange-500 to-orange-700",
    text: "text-white",
    logo: "/images/t2.png",
  },
];

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  });

export default function AirtimePurchaseForm() {
  const router = useRouter();

  const [network, setNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  const selectedNetwork = NETWORKS.find((n) => n.id === network);
  const numericAmount = Number(amount);

  const discount = useMemo(
    () => (numericAmount ? Math.round(numericAmount * 0.02) : 0),
    [numericAmount]
  );

  const total = useMemo(
    () => Math.max(numericAmount - discount, 0),
    [numericAmount, discount]
  );

  const validPhone = /^0\d{10}$/.test(phone);
  const validAmount = numericAmount >= 50;
  const formValid = network && validPhone && validAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formValid) return;
    setShowSummary(true);
  };

  const handlePayment = () => {
    if (!selectedNetwork) return;

    const ref = "TXN" + Date.now().toString().slice(-8);

    router.push(`/dashboard/airtime/success?network=${encodeURIComponent(
  selectedNetwork.name
)}&phone=${phone}&amount=${numericAmount}&paid=${total}&ref=${ref}`);
  };

  return (
    <div className="min-h-screen text-white p-3 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-1">Instant Airtime Recharge</h1>
      <p className="text-slate-400 text-sm mb-6">
        Fast, secure and delivered immediately
      </p>

      {/* NETWORK SELECT */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white/5 rounded-lg p-3">
        {NETWORKS.map((net) => (
          <button
            key={net.id}
            type="button"
            onClick={() => setNetwork(net.id)}
            className={`flex items-center gap-2 rounded-md px-5 py-3 transition-all duration-200 text-sm font-semibold
            ${
              network === net.id
                ? `bg-linear-to-br ${net.accent} ${net.text} scale-[1.03] border-transparent shadow-lg`
                : "bg-white/10 text-slate-300"
            }`}
          >
            {net.name}
          </button>
        ))}
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/5 border border-slate-800 rounded-3xl p-7 space-y-6"
      >
        {/* PHONE */}
        <div className="space-y-2">
          <label className="text-sm text-slate-400">Phone Number</label>
          <div className="flex items-center bg-white/10 gap-3 rounded-xl px-4 py-3">
            {selectedNetwork ? (
              <img
                src={selectedNetwork.logo}
                alt={selectedNetwork.name}
                className="w-5 h-5 rounded-full object-contain"
              />
            ) : (
              <Smartphone size={18} className="text-slate-400" />
            )}

            <input
              type="tel"
              value={phone}
              maxLength={11}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="08012345678"
              className="bg-transparent outline-none w-full"
            />
          </div>
        </div>

        {/* AMOUNT */}
        <div className="space-y-2">
          <label className="text-sm text-silver-400">Amount</label>
          <input
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
            placeholder="₦50 - ₦500,000"
            className="w-full bg-white/10 rounded-xl px-4 py-3 text-sm outline-none"
          />
        </div>

        {/* QUICK AMOUNTS */}
        <div className="grid grid-cols-3 gap-3">
          {QUICK_AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAmount(String(a))}
              className="bg-white/10 rounded-xl py-2"
            >
              ₦{a}
            </button>
          ))}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={!formValid}
          className={`w-full py-2 rounded-xl flex items-center justify-center gap-2 font-semibold transition ${
            formValid ? "bg-primary-500" : "bg-secondary-700 cursor-not-allowed"
          }`}
        >
          Continue <ArrowRight size={18} />
        </button>
      </form>

      {/* CONFIRM MODAL */}
      <BottomSheet
        open={showSummary}
        onClose={() => setShowSummary(false)}
        title="Confirm Purchase"
      >
        <Row label="Network" value={selectedNetwork?.name} />
        <Row label="Phone" value={phone} />
        <Row label="Airtime" value={formatCurrency(numericAmount)} />
        <Row label="Discount" value={`- ${formatCurrency(discount)}`} />

        <div className="border-t border-slate-800 pt-3 flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span className="text-emerald-400">{formatCurrency(total)}</span>
        </div>

        <button
          onClick={handlePayment}
          className="w-full mt-3 py-2 rounded-xl bg-primary-500 font-semibold"
        >
          Pay
        </button>
      </BottomSheet>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium">{value || "-"}</span>
    </div>
  );
}