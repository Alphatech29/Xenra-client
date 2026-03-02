"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import ModalBottomSheet from "../_components/modal";
import { useBanks } from "../../../../hooks/useBanks";
import { useResolveAccount } from "../../../../hooks/useResolveAccount";

/* ---------------- Helpers ---------------- */
const formatBankName = (name = "") =>
  name
    .replace(/(microfinance|bank|limited|ltd)/gi, "")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

const BankAvatar = ({ name }) => {
  const formatted = formatBankName(name);
  if (!formatted) return null;

  const words = formatted.split(" ");
  const initials = `${words[0]?.[0] || ""}${words[1]?.[0] || ""}`.toUpperCase();

  const colors = [
    "bg-red-500/20 text-red-300",
    "bg-blue-500/20 text-blue-300",
    "bg-green-500/20 text-green-300",
    "bg-purple-500/20 text-purple-300",
    "bg-yellow-500/20 text-yellow-300",
    "bg-pink-500/20 text-pink-300",
    "bg-indigo-500/20 text-indigo-300",
    "bg-orange-500/20 text-orange-300",
  ];

  const index =
    formatted.split("").reduce((a, c) => a + c.charCodeAt(0), 0) %
    colors.length;

  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${colors[index]}`}
    >
      {initials}
    </div>
  );
};

export default function SendFundPage() {
  const { banks } = useBanks();
  const { accountName, loading, error, resolve, reset } = useResolveAccount();

  const [bankSheetOpen, setBankSheetOpen] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const autoOpenedRef = useRef(false);

  const [bankForm, setBankForm] = useState({
    account_number: "",
    bank_code: "",
    bank_name: "",
    account_name: "",
  });

  const [verifiedKey, setVerifiedKey] = useState("");

  /* ---------------- Recent Beneficiaries ---------------- */
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("recent_beneficiaries") || "[]",
      );
      setRecent(saved);
    } catch {
      setRecent([]);
    }
  }, []);

  const selectRecent = (b) => {
    setBankForm({
      account_number: b.account_number,
      bank_code: b.bank_code,
      bank_name: b.bank_name,
      account_name: b.account_name,
    });

    setVerifiedKey(`${b.account_number}-${b.bank_code}`);
  };

  /* ---------------- Filter banks ---------------- */
  const filteredBanks = useMemo(() => {
    if (!banks) return [];
    if (!bankSearch) return banks;
    return banks.filter((b) =>
      b.name.toLowerCase().includes(bankSearch.toLowerCase()),
    );
  }, [banks, bankSearch]);

  /* ---------------- Auto open picker ---------------- */
  useEffect(() => {
    if (
      bankForm.account_number.length === 10 &&
      !bankForm.bank_code &&
      !autoOpenedRef.current
    ) {
      setBankSheetOpen(true);
      autoOpenedRef.current = true;
    }
    if (bankForm.account_number.length < 10) autoOpenedRef.current = false;
  }, [bankForm.account_number, bankForm.bank_code]);

  /* ---------------- Resolve account ---------------- */
  useEffect(() => {
    if (bankForm.account_number.length === 10 && bankForm.bank_code) {
      resolve(bankForm.account_number, bankForm.bank_code);
    }
  }, [bankForm.account_number, bankForm.bank_code]);

  /* ---------------- Apply verification + Save recent ---------------- */
  useEffect(() => {
    if (!accountName) return;

    const key = `${bankForm.account_number}-${bankForm.bank_code}`;
    setVerifiedKey(key);

    setBankForm((prev) => ({
      ...prev,
      account_name: accountName,
    }));

    const newBeneficiary = {
      account_number: bankForm.account_number,
      bank_code: bankForm.bank_code,
      bank_name: bankForm.bank_name,
      account_name: accountName,
    };

    setRecent((prev) => {
      const filtered = prev.filter(
        (b) =>
          !(
            b.account_number === newBeneficiary.account_number &&
            b.bank_code === newBeneficiary.bank_code
          ),
      );

      const updated = [newBeneficiary, ...filtered].slice(0, 6);
      localStorage.setItem("recent_beneficiaries", JSON.stringify(updated));
      return updated;
    });
  }, [accountName]);

  const isVerified =
    verifiedKey === `${bankForm.account_number}-${bankForm.bank_code}`;

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-white">Send Money</h1>
        <p className="text-sm text-gray-400">Enter recipient account details</p>
      </div>

      {/* FORM */}
      <div className="rounded-2xl border border-white/10 bg-linear-to-b from-white/5 to-white/2 backdrop-blur-xl p-4 space-y-5">
        <input
          value={bankForm.account_number}
          placeholder="Enter account number"
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 10);
            setBankForm((prev) => ({
              ...prev,
              account_number: value,
              account_name: "",
              bank_code: value.length < 10 ? "" : prev.bank_code,
              bank_name: value.length < 10 ? "" : prev.bank_name,
            }));
            setVerifiedKey("");
            reset();
          }}
          className="w-full focus:outline-0 rounded-xl placeholder:text-sm bg-white/10 border border-white/10 px-4 py-3 text-white  text-base"
        />

        <button
          onClick={() => setBankSheetOpen(true)}
          className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {bankForm.bank_name ? (
              <>
                <BankAvatar name={bankForm.bank_name} />
                <span className="text-white">{bankForm.bank_name}</span>
              </>
            ) : (
              <span className="text-gray-400">Select bank</span>
            )}
          </div>
          <span className="text-xs text-gray-400">Change</span>
        </button>

        {(loading || isVerified || error) && (
          <div className="rounded-xl border border-white/10 bg-black/30 p-3 flex items-center gap-3">
            {loading && (
              <Loader2 size={18} className="animate-spin text-yellow-400" />
            )}
            {!loading && isVerified && (
              <CheckCircle2 size={20} className="text-green-400" />
            )}
            {!loading && error && (
              <AlertCircle size={20} className="text-red-400" />
            )}
            <span className="text-sm">
              {loading
                ? "Verifying..."
                : isVerified
                  ? bankForm.account_name
                  : error}
            </span>
          </div>
        )}

        <button
          disabled={!isVerified || loading}
          className={`w-full rounded-xl py-3 font-semibold ${
            isVerified
              ? "bg-orange-500 text-white"
              : "bg-gray-700 text-gray-400"
          }`}
        >
          proceed
        </button>
      </div>

      {/* RECENT BENEFICIARIES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Recent</h2>
          <span className="text-xs text-silver-400">{recent.length} saved</span>
        </div>

        {recent.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-5 text-center h-40 flex flex-col items-center justify-center gap-2">
            <p className="text-sm text-silver-400">No recent beneficiaries yet</p>
            <p className="text-xs text-silver-500 mt-1">
              Accounts you send money to will appear here
            </p>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {recent.map((b, i) => (
              <button
                key={i}
                onClick={() => selectRecent(b)}
                className="min-w-52.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-3 hover:bg-white/10 transition-all active:scale-[0.97]"
              >
                <div className="flex items-center gap-3">
                  <BankAvatar name={b.bank_name} />
                  <div className="flex flex-col text-left">
                    <span className="text-white text-sm font-medium truncate max-w-32.5">
                      {b.account_name}
                    </span>
                    <span className="text-xs text-gray-400">{b.bank_name}</span>
                    <span className="text-[11px] text-gray-500 tracking-widest">
                      {b.account_number}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <ModalBottomSheet
        open={bankSheetOpen}
        onClose={() => setBankSheetOpen(false)}
        title="Select Bank"
      >
        <input
          placeholder="Search bank..."
          value={bankSearch}
          onChange={(e) => setBankSearch(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 mb-3"
        />

        <div className="max-h-[60vh] overflow-y-auto space-y-1">
          {filteredBanks.map((bank) => (
            <button
              key={`${bank.code}-${bank.name}`}
              onClick={() => {
                setBankForm((prev) => ({
                  ...prev,
                  bank_code: bank.code,
                  bank_name: formatBankName(bank.name),
                  account_name: "",
                }));
                setVerifiedKey("");
                setBankSheetOpen(false);
              }}
              className="w-full flex justify-between items-center px-4 py-3 rounded-xl hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <BankAvatar name={bank.name} />
                <span>{formatBankName(bank.name)}</span>
              </div>
              {bank.code === bankForm.bank_code && (
                <CheckCircle2 size={18} className="text-green-400" />
              )}
            </button>
          ))}
        </div>
      </ModalBottomSheet>
    </div>
  );
}
