"use client";

import { useState } from "react";
import { Copy, CheckCircle } from "lucide-react";
import useToast from "../../../../hooks/useToast";
import { useWallet } from "../../../../hooks/useWallet";

/* ------------------ BANK DETAILS ------------------ */
const BANK = {
  bank: "Providus Bank",
  account_name: "Paysparq Technologies Ltd",
  account_number: "9127056701",
};

/* ------------------ CRYPTO DATA ------------------ */
const CRYPTO = {
  usdt: {
    name: "USDT",
    networks: [
      {
        id: "trc20",
        label: "TRC20",
        address: "TG3sX4gHcXXXXXXXXXXXX",
        min: 10,
      },
    ],
  },
  btc: {
    name: "Bitcoin",
    networks: [
      {
        id: "btc",
        label: "BTC Network",
        address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        min: 0.0001,
      },
    ],
  },
};

/* ------------------ MONEY FORMAT ------------------ */
const formatMoney = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(Number(amount || 0));
};

export default function AddFundPage() {
  const toast = useToast();
  const { wallet } = useWallet();

  const [method, setMethod] = useState("bank");
  const [asset, setAsset] = useState("usdt");
  const [network, setNetwork] = useState("trc20");
  const [copied, setCopied] = useState("");

  const selectedAsset = CRYPTO[asset];
  const selectedNetwork =
    selectedAsset.networks.find((n) => n.id === network) ||
    selectedAsset.networks[0];

  /* ------------------ COPY FUNCTION ------------------ */
  const copy = async (text, key, label) => {
    try {
      if (!navigator?.clipboard) throw new Error("Clipboard not supported");

      await navigator.clipboard.writeText(text);
      setCopied(key);

      toast.success(`${label} copied successfully`);

      setTimeout(() => setCopied(""), 1500);
    } catch {
      toast.error("Unable to copy. Please copy manually.");
    }
  };

  return (
    <div className="min-h-screen text-white p-3 pb-32">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-xl font-bold">Add Funds</h1>
          <p className="text-gray-400 text-sm">
            Deposit money into your wallet securely
          </p>
        </div>

        {/* BALANCE CARD */}
        <div className="relative overflow-hidden rounded-3xl p-6 bg-linear-to-br from-indigo-600/30 to-purple-600/20 border border-white/10 backdrop-blur-xl">
          <div className="absolute right-0 top-0 h-32 w-32 bg-indigo-500/20 blur-3xl rounded-full" />
          <div className="absolute left-0 bottom-0 h-32 w-32 bg-purple-500/20 blur-3xl rounded-full" />

          <p className="text-gray-300 text-sm">Wallet Balance</p>

          <h2 className="text-2xl font-bold mt-2">
            {formatMoney(wallet?.available_balance)}
          </h2>
        </div>

        {/* METHOD SWITCH */}
        <div className="bg-white/5 p-1 rounded-2xl flex gap-2 backdrop-blur-xl border border-white/10">
          {["bank", "crypto"].map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition ${
                method === m
                  ? "bg-primary-400 text-silver-200 shadow-lg"
                  : "text-silver-400 hover:text-white"
              }`}
            >
              {m === "bank" ? "Bank Transfer" : "Crypto Deposit"}
            </button>
          ))}
        </div>

        {/* ------------------ BANK UI ------------------ */}
        {method === "bank" && (
          <>
            <div className="rounded-3xl p-6 bg-linear-to-br from-primary-950 to-secondary-800 border border-white/10 space-y-5">

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm">Account Number</p>
                  <h3 className="text-base font-bold tracking-widest">
                    {BANK.account_number}
                  </h3>
                </div>

                <button
                  onClick={() =>
                    copy(BANK.account_number, "acc", "Account number")
                  }
                  className="text-sm bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20 flex gap-2 items-center"
                >
                  {copied === "acc" ? (
                    <CheckCircle size={16} />
                  ) : (
                    <Copy size={16} />
                  )}
                  Copy
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Bank</p>
                  <p className="font-semibold">{BANK.bank}</p>
                </div>

                <div>
                  <p className="text-gray-400">Account Name</p>
                  <p className="font-semibold text-sm">{BANK.account_name}</p>
                </div>
              </div>
            </div>

            {/* STEPS */}
            <div className="space-y-3 text-sm">
              {[
                "Open your banking app",
                "Transfer to the account above",
                "Funds will be detected automatically",
                "Wallet will be credited instantly",
              ].map((step, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <p className="text-gray-300">{step}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ------------------ CRYPTO UI ------------------ */}
        {method === "crypto" && (
          <>
            {/* ASSET SELECT */}
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(CRYPTO).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => {
                    setAsset(key);
                    setNetwork(value.networks[0].id);
                  }}
                  className={`p-3 rounded-xl border ${
                    asset === key
                      ? "bg-indigo-500/20 border-indigo-500"
                      : "border-white/10"
                  }`}
                >
                  {value.name}
                </button>
              ))}
            </div>

            {/* QR + ADDRESS */}
            <div className="rounded-3xl bg-primary-900/20 border border-white/10 p-4 space-y-5">

              <h3 className="text-base font-semibold">
                Send {selectedAsset.name} ({selectedNetwork.label})
              </h3>

              <div className="bg-white p-4 rounded-2xl w-fit mx-auto">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedNetwork.address}`}
                  className="w-36 h-36"
                  alt="QR Code"
                />
              </div>

              <div className="bg-primary-400/20 rounded-xl p-4 text-xs break-all text-center">
                {selectedNetwork.address}
              </div>

              <button
                onClick={() =>
                  copy(selectedNetwork.address, "addr", "Wallet address")
                }
                className="w-full py-3 text-sm rounded-xl bg-primary-400 hover:bg-primary-300 font-medium flex justify-center gap-2"
              >
                {copied === "addr" ? (
                  <CheckCircle size={18} />
                ) : (
                  <Copy size={18} />
                )}
                Copy Wallet Address
              </button>

            </div>

            {/* WARNING */}
            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-300 space-y-1">
              <p className="font-semibold">Network Warning</p>
              <p>
                Send only <b>{selectedAsset.name}</b> using{" "}
                <b>{selectedNetwork.label}</b>.
              </p>
              <p>Minimum deposit: ${selectedNetwork.min}</p>
              <p>Wrong network may permanently lose funds.</p>
            </div>

            <div className="text-xs text-gray-400 text-center">
              Deposits are credited after blockchain confirmation (1 – 15 minutes)
            </div>
          </>
        )}

      </div>
    </div>
  );
}