"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import BottomSheet from "../_components/vtuModal";

/* ---------------- NETWORKS ---------------- */

const NETWORKS = [
  { id: "mtn", name: "MTN", accent: "from-yellow-400 to-yellow-500", text: "text-black", logo: "/images/mtn.png" },
  { id: "airtel", name: "Airtel", accent: "from-red-500 to-red-600", text: "text-white", logo: "/images/airtel.png" },
  { id: "glo", name: "Glo", accent: "from-green-500 to-green-700", text: "text-white", logo: "/images/glo.png" },
  { id: "t2mobile", name: "T2mobile", accent: "from-orange-500 to-orange-700", text: "text-white", logo: "/images/t2.png" },
];

/* ---------------- DATA PLANS ---------------- */

const DATA_PLANS = {
  mtn: [
    { id: "mtn_500_1gb", name: "1GB", validity: "1 Day", price: 500 },
    { id: "mtn_1200_2gb", name: "2GB", validity: "7 Days", price: 1200 },
    { id: "mtn_2500_5gb", name: "5GB", validity: "30 Days", price: 2500 },
    { id: "mtn_5000_10gb", name: "10GB", validity: "30 Days", price: 5000 },
  ],
  airtel: [
    { id: "airtel_500_1gb", name: "1GB", validity: "1 Day", price: 500 },
    { id: "airtel_1500_3gb", name: "3GB", validity: "7 Days", price: 1500 },
    { id: "airtel_3000_6gb", name: "6GB", validity: "30 Days", price: 3000 },
  ],
  glo: [
    { id: "glo_1000_2gb", name: "2GB", validity: "2 Days", price: 1000 },
    { id: "glo_2500_7gb", name: "7GB", validity: "7 Days", price: 2500 },
  ],
  t2mobile: [
    { id: "t2_1000_2gb", name: "2GB", validity: "3 Days", price: 1000 },
    { id: "t2_3000_7gb", name: "7GB", validity: "7 Days", price: 3000 },
  ],
};

/* ---------------- HELPERS ---------------- */

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  });

/* ========================================================= */

export default function DataPurchaseForm() {
  const router = useRouter();

  /* ---------- SAFE DEFAULTS (NO useEffect NEEDED) ---------- */

  const defaultNetwork = "mtn";

  const [network, setNetwork] = useState(defaultNetwork);
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState(DATA_PLANS[defaultNetwork][0]);
  const [showSummary, setShowSummary] = useState(false);

  const selectedNetwork = NETWORKS.find((n) => n.id === network);
  const plans = DATA_PLANS[network] ?? [];

  const total = useMemo(() => plan?.price || 0, [plan]);

  const validPhone = /^0\d{10}$/.test(phone);
  const formValid = network && validPhone && plan;

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formValid) return;
    setShowSummary(true);
  };

  const handlePayment = () => {
    if (!selectedNetwork || !plan) return;

    const ref = "TXN" + Date.now().toString().slice(-8);

    router.push(
      `/dashboard/data-purchase/success?network=${encodeURIComponent(selectedNetwork.name)}&phone=${phone}&plan=${plan.name}&amount=${total}&ref=${ref}`
    );
  };

  /* ========================================================= */

  return (
    <div className="min-h-screen text-white p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-1">Buy Mobile Data</h1>
      <p className="text-slate-400 text-sm mb-6">Choose network and bundle</p>

      {/* NETWORK SELECT */}
      <div className="flex gap-2 mb-6 bg-white/5 rounded-lg p-3">
        {NETWORKS.map((net) => (
          <button
            key={net.id}
            type="button"
            onClick={() => {
              setNetwork(net.id);
              const nextPlans = DATA_PLANS[net.id] || [];
              setPlan(nextPlans.length ? nextPlans[0] : null);
            }}
            className={`flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-all duration-200
              ${
                network === net.id
                  ? `bg-linear-to-br ${net.accent} ${net.text} scale-[1.03] shadow-lg`
                  : "bg-white/10 text-slate-300"
              }`}
          >
            {net.name}
          </button>
        ))}
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white/5 border border-slate-800 rounded-3xl p-5 space-y-5">

        {/* PHONE */}
        <div className="space-y-2">
          <label className="text-sm text-slate-400">Phone Number</label>
          <div className="flex items-center bg-white/10 gap-3 rounded-xl px-4 py-3">
            {selectedNetwork ? (
              <img src={selectedNetwork.logo} alt={selectedNetwork.name} className="w-5 h-5 rounded-full object-contain" />
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

        {/* PLANS */}
        <div className="space-y-2">
          <label className="text-sm text-slate-400">Data Plan</label>

          <div className="grid grid-cols-3 gap-3">
            {plans.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlan(p)}
                className={`p-4 rounded-xl transition border
                ${
                  plan?.id === p.id
                    ? "border-primary-400 bg-primary-500/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-slate-400">{p.validity}</p>
                <p className="text-emerald-400 font-semibold mt-1 text-sm">
                  {formatCurrency(p.price)}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={!formValid}
          className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition ${
            formValid ? "bg-primary-500" : "bg-secondary-700 cursor-not-allowed"
          }`}
        >
          Continue <ArrowRight size={18} />
        </button>
      </form>

      {/* CONFIRM MODAL */}
      <BottomSheet open={showSummary} onClose={() => setShowSummary(false)} title="Confirm Data Purchase">
        <Row label="Network" value={selectedNetwork?.name} />
        <Row label="Phone" value={phone} />
        <Row label="Plan" value={`${plan?.name} (${plan?.validity})`} />

        <div className="border-t border-slate-800 pt-3 flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span className="text-emerald-400">{formatCurrency(total)}</span>
        </div>

        <button onClick={handlePayment} className="w-full mt-3 py-3 rounded-xl bg-primary-500 font-semibold">
          Pay
        </button>
      </BottomSheet>
    </div>
  );
}

/* ---------------- ROW ---------------- */

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium">{value || "-"}</span>
    </div>
  );
}