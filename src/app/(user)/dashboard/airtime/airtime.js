"use client";

import { useMemo, useState, useEffect } from "react";
import { ArrowRight, Smartphone } from "lucide-react";
import BottomSheet from "../_components/vtuModal";
import { usePurchaseAirtime } from "../../../../hooks/usePurchaseAirtime";
import AlertModal from "../_components/alertModal";

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
    id: "t2mobile",
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

/* ---------------- Skeleton Component ---------------- */
function Skeleton({ className }) {
  return (
    <div className={`animate-pulse bg-white/10 rounded-md ${className}`} />
  );
}

export default function AirtimePurchaseForm() {
  const { buyAirtime, error, loading, detectNetworkFromPhone } =
    usePurchaseAirtime();

  const [network, setNetwork] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reference, setReference] = useState("");

  const [pageLoading, setPageLoading] = useState(true);

  const [alert, setAlert] = useState({
    open: false,
    type: "error",
    title: "",
    message: "",
  });

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

  /* ---------------- Page Loading Effect ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (error) {
      setAlert({
        open: true,
        type: "error",
        title: "Sorry",
        message: error,
      });
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formValid) {
      setAlert({
        open: true,
        type: "warning",
        title: "Invalid Input",
        message: "Please enter a valid phone number and amount.",
      });
      return;
    }

    setShowSummary(true);
  };

  const handlePayment = async () => {
    if (!selectedNetwork) return;

    try {
      const data = await buyAirtime({
        number: phone,
        amount: numericAmount,
        serviceId: selectedNetwork.id,
      });

      setReference(data?.reference || "");
      setSuccess(true);
    } catch (err) {
      setAlert({
        open: true,
        type: "error",
        title: "Transaction Failed",
        message:
          err?.message ||
          "Something went wrong while processing your airtime purchase.",
      });
      setShowSummary(false);
    }
  };

  const handleDone = () => {
    setShowSummary(false);
    setSuccess(false);
    setReference("");
    setPhone("");
    setAmount("");
    setNetwork("");
  };

  /* ---------------- Skeleton UI ---------------- */
  if (pageLoading) {
    return (
      <div className="min-h-screen text-white p-3 max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-60" />

        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-20 rounded-md" />
          ))}
        </div>

        <div className="bg-white/5 border border-slate-800 rounded-3xl p-7 space-y-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-full rounded-xl" />

          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-full rounded-xl" />

          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>

          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  /* ---------------- Main UI ---------------- */
  return (
    <div className="min-h-screen text-white p-3 max-w-3xl mx-auto">
      <h1 className="text-base font-bold">Airtime Recharge</h1>

      <p className="text-slate-400 text-sm mb-6">
        Fast, secure and delivered immediately
      </p>

      {/* NETWORKS */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white/5 rounded-lg p-3">
        {NETWORKS.map((net) => (
          <button
            key={net.id}
            type="button"
            onClick={() => setNetwork(net.id)}
            className={`flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition
            ${
              network === net.id
                ? `bg-linear-to-br ${net.accent} ${net.text} scale-[1.03]`
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
                className="w-5 h-5"
              />
            ) : (
              <Smartphone size={18} className="text-slate-400" />
            )}

            <input
              type="tel"
              value={phone}
              maxLength={11}
              placeholder="08012345678"
              className="bg-transparent outline-none w-full"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setPhone(value);

                if (value.length >= 4) {
                  const detected = detectNetworkFromPhone(value);
                  if (detected) setNetwork(detected);
                }
              }}
            />
          </div>
        </div>

        {/* AMOUNT */}
        <div className="space-y-2">
          <label className="text-sm text-slate-400">Amount</label>

          <input
            type="text"
            inputMode="numeric"
            value={amount}
            placeholder="₦50 - ₦500,000"
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
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
          className={`w-full py-2 rounded-xl flex items-center justify-center gap-2 font-semibold
          ${
            formValid ? "bg-primary-500" : "bg-secondary-700 cursor-not-allowed"
          }`}
        >
          Continue <ArrowRight size={18} />
        </button>
      </form>

      {/* CONFIRMATION MODAL */}
      <BottomSheet
        open={showSummary}
        onClose={() => !loading && !success && setShowSummary(false)}
        title={loading ? "Processing Payment" : success ? "Payment Successful" : "Confirm Purchase"}
      >
        {loading ? (
          <div className="flex flex-col items-center py-10 gap-3">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-400">Processing payment...</p>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl"></div>
              <div className="relative w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-white mb-1">
              Payment Successful
            </h2>

            <p className="text-sm text-slate-400 max-w-xs">
              Your airtime has been recharged successfully.
            </p>

            <div className="mt-4 text-2xl font-bold text-emerald-400">
              {formatCurrency(total)}
            </div>

            <div className="w-full mt-6 bg-white/5 border border-slate-800 rounded-2xl p-4 space-y-2 text-sm">
              <Row label="Network" value={selectedNetwork?.name} />
              <Row label="Phone" value={phone} />
              <Row label="Airtime" value={formatCurrency(numericAmount)} />
              <Row label="Discount" value={`- ${formatCurrency(discount)}`} />
              {reference && <Row label="Reference" value={reference} />}
            </div>

            <button
              onClick={handleDone}
              className="w-full mt-6 py-3 rounded-xl bg-primary-500 font-semibold hover:bg-primary-600 transition"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <Row label="Network" value={selectedNetwork?.name} />
            <Row label="Phone" value={phone} />
            <Row label="Airtime" value={formatCurrency(numericAmount)} />
            <Row label="Discount" value={`- ${formatCurrency(discount)}`} />

            <div className="border-t border-slate-800 pt-3 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-emerald-400">
                {formatCurrency(total)}
              </span>
            </div>

            <button
              onClick={handlePayment}
              className="w-full mt-3 py-3 rounded-xl bg-primary-500 font-semibold"
            >
              Pay
            </button>
          </>
        )}
      </BottomSheet>

      {/* ALERT MODAL */}
      {alert.open && (
        <AlertModal
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() =>
            setAlert((prev) => ({
              ...prev,
              open: false,
            }))
          }
        />
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm items-center">
      <span className="text-slate-400">{label}</span>
      <div className="font-medium">{value || "-"}</div>
    </div>
  );
}