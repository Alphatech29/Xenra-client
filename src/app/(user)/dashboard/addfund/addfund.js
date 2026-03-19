"use client";

import { useState } from "react";
import { Copy, CheckCircle } from "lucide-react";
import useToast from "../../../../hooks/useToast";
import { useWallet } from "../../../../hooks/useWallet";
import { useDedicatedAccount } from "../../../../hooks/useDedicatedAccount";

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

const formatMoney = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(Number(amount || 0));
};

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-white/10 ${className}`} />
);

export default function AddFundPage() {
  const toast = useToast();
  const { wallet } = useWallet();
  const { account } = useDedicatedAccount();

  const [method, setMethod] = useState("bank");
  const [asset, setAsset] = useState("usdt");
  const [network, setNetwork] = useState("trc20");
  const [copied, setCopied] = useState("");

  const selectedAsset = CRYPTO[asset];
  const selectedNetwork =
    selectedAsset.networks.find((n) => n.id === network) ||
    selectedAsset.networks[0];

  const copy = async (text, key, label) => {
    try {
      if (!navigator?.clipboard) throw new Error();

      await navigator.clipboard.writeText(text);
      setCopied(key);
      toast.success(`${label} copied successfully`);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      toast.error("Unable to copy. Please copy manually.");
    }
  };

  const loadingWallet = !wallet;
  const loadingAccount = !account;

  return (
    <div className="min-h-screen text-white p-3 pb-32">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold">Add Funds</h1>
          <p className="text-gray-400 text-sm">
            Deposit money into your wallet securely
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl p-6 bg-linear-to-br from-indigo-600/30 to-purple-600/20 border border-white/10 backdrop-blur-xl">
          <div className="absolute right-0 top-0 h-32 w-32 bg-indigo-500/20 blur-3xl rounded-full" />
          <div className="absolute left-0 bottom-0 h-32 w-32 bg-purple-500/20 blur-3xl rounded-full" />

          <p className="text-gray-300 text-sm">Wallet Balance</p>

          {loadingWallet ? (
            <Skeleton className="h-8 w-40 mt-2 rounded-lg" />
          ) : (
            <h2 className="text-2xl font-bold mt-2">
              {formatMoney(wallet?.available_balance)}
            </h2>
          )}
        </div>

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

        {method === "bank" && (
          <>
            {loadingAccount ? (
              <div className="rounded-3xl p-4 bg-white/5 border border-white/10 space-y-4">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-6 w-48 rounded" />
                <Skeleton className="h-10 w-full rounded" />
                <Skeleton className="h-4 w-40 rounded" />
              </div>
            ) : (
              <div className="relative rounded-3xl p-4 bg-linear-to-br from-primary-950 via-primary-1200 to-white/15 border border-white/10 shadow-xl overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,white,transparent_60%)]"></div>

                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                      Virtual Account
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {account.bank_name}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      copy(account.account_number, "acc", "Account number")
                    }
                    className="text-xs bg-white/10 px-3 py-1 rounded-lg hover:bg-white/20 flex gap-2 items-center backdrop-blur"
                  >
                    {copied === "acc" ? (
                      <CheckCircle size={14} />
                    ) : (
                      <Copy size={14} />
                    )}
                    Copy
                  </button>
                </div>

                <div className="mt-6 mb-4 w-10 h-7 rounded-md bg-linear-to-br from-yellow-400 to-yellow-600"></div>

                <h3 className="text-xl font-bold tracking-[0.25em] text-white mb-6">
                  {account.account_number}
                </h3>

                <div className="flex justify-between items-end text-sm text-white/90">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Account Name</p>
                    <p className="font-semibold text-sm uppercase">
                      {account.account_name}
                    </p>
                  </div>
                </div>
              </div>
            )}

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

        {method === "crypto" && (
          <>
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
              Deposits are credited after blockchain confirmation (1 – 15
              minutes)
            </div>
          </>
        )}
      </div>
    </div>
  );
}