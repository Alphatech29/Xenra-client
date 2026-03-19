"use client";

import { useMemo, useState, useEffect } from "react";
import { ArrowRight, Smartphone, WifiOff } from "lucide-react";
import { useRouter } from "next/navigation";
import BottomSheet from "../_components/vtuModal";
import { useDataVariations } from "../../../../hooks/useDataVariations";
import { usePurchaseData } from "../../../../hooks/usePurchaseData";
import AlertModal from "../_components/alertModal";

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-white/10 rounded ${className}`} />;
}

const NETWORKS = [
  { id: "mtn", name: "MTN", accent: "from-yellow-400 to-yellow-500", text: "text-black", logo: "/images/mtn.png" },
  { id: "airtel", name: "Airtel", accent: "from-red-500 to-red-600", text: "text-white", logo: "/images/airtel.png" },
  { id: "glo", name: "Glo", accent: "from-green-500 to-green-700", text: "text-white", logo: "/images/glo.png" },
  { id: "t2mobile", name: "T2mobile", accent: "from-orange-500 to-orange-700", text: "text-white", logo: "/images/t2.png" },
];

const SERVICE_MAP = {
  mtn: "mtn-data",
  airtel: "airtel-data",
  glo: "glo-data",
  t2mobile: "etisalat-data",
};

const GROUP_LABELS = {
  social: "Social 🔥",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  biMonthly: "2 Months",
  quarterly: "3 Months+",
  router: "Router",
  mifi: "MiFi",
  odu: "ODU",
  other: "Other",
};

const GROUP_ORDER = [
  "social","daily","weekly","monthly","biMonthly","quarterly","router","mifi","odu","other"
];

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  });

// FIX: Safe key using index as fallback
const getPlanKey = (serviceID, plan, index) =>
  `${serviceID}-${plan?.code || "no-code"}-${plan?.amount || 0}-${index}`;

const detectNetwork = (phone) => {
  if (!phone || phone.length < 4) return null;

  const prefix = phone.substring(0, 4);

  const map = {
    mtn: ["0803","0806","0703","0706","0813","0816","0810","0814","0903","0906","0913","0916"],
    airtel: ["0802","0808","0708","0812","0902","0907","0901","0912"],
    glo: ["0805","0807","0705","0811","0815","0905"],
    t2mobile: ["0809","0817","0818","0909","0908"],
  };

  for (const net in map) {
    if (map[net].includes(prefix)) return net;
  }

  return null;
};

export default function DataPurchaseForm() {
  const router = useRouter();

  const [manualNetwork, setManualNetwork] = useState(false);
  const [network, setNetwork] = useState("mtn");
  const [phone, setPhone] = useState("");
  const [plan, setPlan] = useState(null);
  const [activeGroup, setActiveGroup] = useState("social");
  const [showSummary, setShowSummary] = useState(false);

  const [alert, setAlert] = useState({ message: "" });

  const selectedNetwork = useMemo(
    () => NETWORKS.find((n) => n.id === network),
    [network]
  );

  const serviceID = SERVICE_MAP[network];

  const { groupedPlans, plans, error, loading, refetch } =
    useDataVariations(serviceID);

  const {
    handlePurchaseData,
    loading: purchasing,
    error: purchaseError,
    success,
    response,
    reset,
  } = usePurchaseData();

  useEffect(() => {
    if (!plan && plans?.length > 0) {
      setPlan(plans[0]);
    }
  }, [plans, plan]);

  useEffect(() => {
    if (manualNetwork) return;

    const detected = detectNetwork(phone);

    if (detected && detected !== network) {
      setNetwork(detected);
      setPlan(null);
    }
  }, [phone, manualNetwork, network]);

  useEffect(() => {
    if (!phone) setManualNetwork(false);
  }, [phone]);

  useEffect(() => {
    if (!groupedPlans) return;

    const firstGroup = GROUP_ORDER.find((g) => groupedPlans[g]?.length > 0);

    if (firstGroup) setActiveGroup(firstGroup);
  }, [groupedPlans]);

  useEffect(() => {
    if (purchaseError) {
      setAlert({ message: purchaseError });
      setShowSummary(false);
    }
  }, [purchaseError]);

  const currentPlans = groupedPlans?.[activeGroup] ?? [];
  const total = useMemo(() => plan?.amount || 0, [plan]);
  const validPhone = /^0\d{10}$/.test(phone);
  const formValid = !loading && network && validPhone && plan;


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formValid) return;
    setShowSummary(true);
  };

  const handlePayment = async () => {
    if (!selectedNetwork || !plan || !validPhone || purchasing) return;

    const res = await handlePurchaseData({
      request_id: `${serviceID}-${phone}-${Date.now()}`,
      serviceID,
      billersCode: phone,
      variation_code: plan.code,
      amount: plan.amount,
      phone,
    });

    if (!res?.success) return;
  };

  const handleRetry = () => {
    if (typeof refetch === "function") {
      refetch();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen pb-28 text-white p-4 max-w-3xl mx-auto">
      <h1 className="text-base font-bold mb-1">Buy Data</h1>
      <p className="text-slate-400 text-sm mb-6">Choose network and bundle</p>

      <div className="flex gap-2 mb-6 bg-white/5 rounded-lg p-3">
        {NETWORKS.map((net) => (
          <button
            key={net.id}
            type="button"
            onClick={() => {
              setNetwork(net.id);
              setPlan(null);
              setManualNetwork(true);
            }}
            className={`flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold ${
              network === net.id
                ? `bg-linear-to-br ${net.accent} ${net.text}`
                : "bg-white/10 text-slate-300"
            }`}
          >
            {net.name}
          </button>
        ))}
      </div>

      {/* FORM */}
      <form
        className="bg-white/5 border border-slate-800 rounded-3xl p-5 space-y-5"
        onSubmit={handleSubmit}
      >
        {/* PHONE */}
        <div className="space-y-2">
          <label className="text-sm text-slate-400">Phone Number</label>
          <div className="flex items-center bg-white/10 gap-3 rounded-xl px-4 py-3">
            {selectedNetwork ? (
              <img
                src={selectedNetwork.logo}
                className="w-5 h-5 rounded-full"
              />
            ) : (
              <Smartphone size={18} />
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

        <div className="flex gap-2 overflow-x-auto pb-1">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))
            : GROUP_ORDER.map((group) => {
                if (!groupedPlans[group]?.length) return null;

                return (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setActiveGroup(group)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap ${
                      activeGroup === group
                        ? "bg-primary-500 text-white"
                        : "bg-white/10 text-slate-300"
                    }`}
                  >
                    {GROUP_LABELS[group]}
                  </button>
                );
              })}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="p-3 rounded-xl border border-white/10 bg-white/5 space-y-3"
              >
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))
          ) : error ? (
            <div className="col-span-3 bg-white/5 border border-red-500/20 rounded-xl p-5 text-center space-y-3">
              <WifiOff size={20} className="text-red-400 opacity-80" />
              <p className="text-sm font-semibold text-red-400">
                Unable to load data plans
              </p>
              <button onClick={handleRetry}>Retry</button>
            </div>
          ) : (
            currentPlans.map((p, index) => (
              <button
                key={getPlanKey(serviceID, p, index)}
                type="button"
                onClick={() => setPlan(p)}
                className={`relative p-3 rounded-xl border text-center ${
                  plan?.code === p.code
                    ? "border-primary-400 bg-primary-500/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <p className="text-sm">{p.size || p.name}</p>
                <p className="text-xs">{p.duration}</p>
                <p className="text-sm text-yellow-300">
                  {formatCurrency(p.amount)}
                </p>
              </button>
            ))
          )}
        </div>

        <button
          type="submit"
          disabled={!formValid}
          className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold ${
            formValid ? "bg-primary-500" : "bg-secondary-700"
          }`}
        >
          Continue <ArrowRight size={18} />
        </button>
      </form>

           <BottomSheet
        open={showSummary}
        onClose={() => !purchasing && setShowSummary(false)}
        title={purchasing ? "Processing Payment" : success ? "Payment Successful" : "Confirm Data Purchase"}
      >
        {purchasing ? (
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
 
            <h2 className="text-base font-semibold text-white mb-1">
              Payment Successful
            </h2>
 
            <p className="text-sm text-slate-400 max-w-xs">
              Your data bundle has been activated successfully.
            </p>
 
            <div className="mt-4 text-xl font-bold text-emerald-400">
              {formatCurrency(total)}
            </div>
 
            <div className="w-full mt-6 bg-white/5 border border-slate-800 rounded-2xl p-4 space-y-2 text-sm">
              <Row label="Network" value={selectedNetwork?.name} />
              <Row label="Phone" value={phone} />
              <Row label="Plan" value={plan?.name || plan?.size} />
              {response?.reference && (
                <Row label="Transaction ID" value={response.reference} />
              )}
            </div>
 
            <button
              onClick={() => {
                setShowSummary(false);
                reset();
                setPlan(null);
                setPhone("");
              }}
              className="w-full mt-6 py-3 rounded-xl bg-primary-500 font-semibold hover:bg-primary-600 transition"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <Row label="Network" value={selectedNetwork?.name} />
            <Row label="Phone" value={phone} />
            <Row label="Plan" value={plan?.name || plan?.size} />
 
            <div className="border-t border-slate-800 pt-3 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-emerald-400">
                {formatCurrency(total)}
              </span>
            </div>
 
            <button
              onClick={handlePayment}
              className="w-full mt-3 py-3 rounded-xl bg-primary-500 font-semibold hover:bg-primary-600 transition"
            >
              Pay
            </button>
          </>
        )}
      </BottomSheet>

      {/* ALERT MODAL */}
      {alert.message && (
        <AlertModal
          type="error"
          message={alert.message}
          onClose={() => {
            setAlert({ message: "" });
            reset();
          }}
        />
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span>{label}</span>
      <span>{value || "-"}</span>
    </div>
  );
}