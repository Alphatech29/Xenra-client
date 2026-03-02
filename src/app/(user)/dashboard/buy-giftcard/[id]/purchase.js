"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                          SAFE IMAGE (FIXES ERROR)                          */
/* -------------------------------------------------------------------------- */

function SafeImage(props) {
  return <Image {...props} unoptimized />;
}

/* -------------------------------------------------------------------------- */
/*                               DEMO DATABASE                                */
/* -------------------------------------------------------------------------- */

const CARDS = [
  { id: 1, name: "Amazon", img: "https://img.icons8.com/color/200/amazon.png" },
  { id: 2, name: "Apple", img: "https://img.icons8.com/color/200/apple-logo.png" },
  { id: 3, name: "Steam", img: "https://img.icons8.com/color/200/steam.png" },
  { id: 4, name: "Google Play", img: "https://img.icons8.com/color/200/google-play.png" },
  { id: 5, name: "Razer Gold", img: "https://img.icons8.com/color/200/razer.png" },
  { id: 6, name: "Xbox", img: "https://img.icons8.com/color/200/xbox.png" },
  { id: 7, name: "PlayStation", img: "https://img.icons8.com/color/200/play-station.png" },
  { id: 8, name: "Netflix", img: "https://img.icons8.com/color/200/netflix.png" },
];

const AMOUNTS = [10, 25, 50, 100, 200];

const REGIONS = [
  { code: "US", name: "United States", desc: "Most compatible", flag: "https://flagcdn.com/w80/us.png" },
  { code: "UK", name: "United Kingdom", desc: "Works for UK accounts", flag: "https://flagcdn.com/w80/gb.png" },
  { code: "CA", name: "Canada", desc: "Canadian stores only", flag: "https://flagcdn.com/w80/ca.png" },
  { code: "AU", name: "Australia", desc: "Australia region locked", flag: "https://flagcdn.com/w80/au.png" },
];

/* -------------------------------------------------------------------------- */
/*                                  PAGE                                      */
/* -------------------------------------------------------------------------- */

export default function GiftcardPurchasePage() {
  const { id } = useParams();
  const card = CARDS.find((c) => c.id === Number(id));

  const [region, setRegion] = useState(REGIONS[0]);
  const [openRegion, setOpenRegion] = useState(false);

  const [amount, setAmount] = useState(50);
  const [qty, setQty] = useState(1);
  const [email, setEmail] = useState("");

  if (!card) return <div className="p-6">Card not found</div>;

  const total = amount * qty;

  return (
    <div className="max-w-xl mx-auto p-3 pb-32 space-y-5">
      {/* Card Header */}
      <div className="flex items-center justify-center">
      <h2 className="text-xl font-bold text-center">Purchase</h2>
      </div>

      {/* Card Header */}
      <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 backdrop-blur-xl">
        <div className="relative w-16 h-16">
          <SafeImage src={card.img} alt={card.name} fill sizes="64px" className="object-contain" />
        </div>

        <div>
          <h1 className="text-xl font-bold">{card.name} Gift Card</h1>
          <p className="text-sm text-gray-400">Instant digital delivery</p>
        </div>
      </div>

      {/* Region Selector */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">Region</label>

        <button
          onClick={() => setOpenRegion(true)}
          className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
        >
          <div className="flex items-center gap-3">
            <SafeImage src={region.flag} alt={region.name} width={32} height={32} className="rounded-full" />
            <div className="text-left">
              <p className="font-semibold">{region.name}</p>
            </div>
          </div>

          <span className="text-gray-400">›</span>
        </button>
      </div>

      {/* Amount */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">Amount ($)</label>
        <div className="grid grid-cols-3 gap-2">
          {AMOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              className={`p-3 rounded-xl transition ${
                amount === a
                  ? "bg-primary-500/50 text-white"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              ${a}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">Quantity</label>
        <div className="flex items-center gap-3">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-lg bg-white/10">−</button>
          <span className="text-lg font-semibold w-10 text-center">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="w-10 h-10 rounded-lg bg-white/10">+</button>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">Recipient Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@gmail.com"
          className="w-full p-3 rounded-xl bg-white/5 border border-white/10"
        />
      </div>

      {/* Summary */}
      <div className="bg-white/5 rounded-2xl p-4 space-y-2">
        <div className="flex justify-between">
          <span>Amount</span>
          <span>${amount}</span>
        </div>
        <div className="flex justify-between">
          <span>Quantity</span>
          <span>x{qty}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      {/* Buy Button */}
      <button className="w-full py-2 rounded-2xl font-semibold bg-primary-500 text-white hover:opacity-90 transition">
        Buy Now
      </button>

      {/* REGION MODAL */}
      {openRegion && (
        <div className="fixed inset-0 z-9999 flex items-end bg-primary-1100/60 backdrop-blur-sm">
          <div className="w-full bg-[#00104b] rounded-t-3xl p-4 space-y-3 animate-slideUp">
            <h2 className="text-lg font-bold mb-2">Select Region</h2>

            {REGIONS.map((r) => (
              <button
                key={r.code}
                onClick={() => {
                  setRegion(r);
                  setOpenRegion(false);
                }}
                className={`w-full flex items-center gap-4 p-3 rounded-2xl transition border ${
                  region.code === r.code
                    ? "bg-primary-600/20 border-primary-600"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <SafeImage src={r.flag} alt={r.name} width={40} height={40} className="rounded-full" />

                <div className="flex-1 text-left">
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.desc}</p>
                </div>

                {region.code === r.code && <div className="w-5 h-5 rounded-full bg-primary-600" />}
              </button>
            ))}

            <button onClick={() => setOpenRegion(false)} className="w-full py-3 rounded-xl bg-white/10 mt-3">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}