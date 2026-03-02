"use client";

import { useState, useMemo } from "react";
import { ArrowRight } from "lucide-react";

const DATA = [
  { id: 1, name: "Amazon", sub: [
      { id: "us", name: "Amazon USA", rate: 780 },
      { id: "uk", name: "Amazon UK", rate: 760 },
      { id: "ca", name: "Amazon Canada", rate: 750 },
  ]},
  { id: 2, name: "Apple", sub: [
      { id: "itunes", name: "iTunes", rate: 800 },
      { id: "apple_store", name: "Apple Store", rate: 790 },
  ]},
  { id: 3, name: "Google Play", sub: [
      { id: "us", name: "Google Play USA", rate: 770 },
      { id: "uk", name: "Google Play UK", rate: 760 },
  ]},
];

export default function SellGiftCardForm() {
  const [mode, setMode] = useState("physical");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [code, setCode] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [agree, setAgree] = useState(false);

  const selectedCategory = DATA.find((c) => c.id === Number(category));
  const selectedSub = selectedCategory?.sub.find((s) => s.id === subCategory);

  const receive = useMemo(() => selectedSub && amount ? Number(amount) * selectedSub.rate : 0, [amount, selectedSub]);
  const fee = Math.round(receive * 0.015);
  const finalAmount = Math.max(receive - fee, 0);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "physical" && !image) return alert("Upload card image");
    if (mode === "ecode" && !code.trim()) return alert("Enter gift card code");
    if (!agree) return alert("Accept terms");
    alert("Trade submitted");
  };

  return (
    <div className="min-h-screen pb-32 bg-linear-to-b from-primary-1200 via-primary-950 to-primary-1200 text-silver-100 p-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.2fr_.8fr] gap-8">

        <div className="space-y-5">
           {/* PAGE TITLE */}
          <div>
            <h1 className="text-xl font-bold">Sell Gift Card</h1>
            <p className="text-sm text-silver-400">Fill the form below to complete your trade</p>
          </div>

          {/* MODE SWITCH */}
          <div className="grid grid-cols-2 bg-primary-950/40 border border-silver-900/40 rounded-2xl p-1">
            <button onClick={()=>setMode("physical")} className={`py-3 rounded-xl ${mode==="physical"?"bg-white/10 text-silver-100":"text-silver-400"}`}>Physical Card</button>
            <button onClick={()=>setMode("ecode")} className={`py-3 rounded-xl ${mode==="ecode"?"bg-white/10 text-silver-100":"text-silver-400"}`}>E‑Code</button>
          </div>

          {/* SUMMARY */}
          <div className="border border-silver-900/40 rounded-2xl p-6 h-fit bg-primary-950/40 space-y-4">
            <h3 className="text-lg font-semibold">Transaction Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-silver-400">Card value</span><span>₦{receive.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-silver-400">Fee (1.5%)</span><span>- ₦{fee.toLocaleString()}</span></div>
              <div className="border-t border-silver-900/40 pt-2 flex justify-between font-semibold"><span>You receive</span><span className="text-green-500">₦{finalAmount.toLocaleString()}</span></div>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="border border-silver-900/40 rounded-2xl p-6 bg-primary-950/40 space-y-5">

            <div className="grid md:grid-cols-2 gap-4">
              <select value={category} onChange={(e)=>{setCategory(e.target.value);setSubCategory("")}} className="bg-primary-1200 border border-silver-900/40 rounded-xl px-4 py-3 focus:outline-none">
                <option value="">Select brand</option>
                {DATA.map(c=> <option key={c.id} value={c.id} className="text-black">{c.name}</option>)}
              </select>

              <select value={subCategory} onChange={(e)=>setSubCategory(e.target.value)} disabled={!selectedCategory} className="bg-primary-1200 border border-silver-900/40 rounded-xl px-4 py-3 focus:outline-none disabled:opacity-40">
                <option value="">Card type</option>
                {selectedCategory?.sub.map(s=> (<option key={s.id} value={s.id} className="text-black">{s.name}</option>))}
              </select>
            </div>

            <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Amount ($)" className="w-full bg-primary-1200 border border-silver-900/40 rounded-xl px-4 py-3 text-lg focus:outline-none" />

            {/* CONDITIONAL INPUT */}
            {mode === "physical" ? (
              <label className="block border border-dashed border-silver-800 rounded-xl p-6 text-center cursor-pointer hover:bg-primary-1200/40">
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <p className="text-sm text-silver-400">Upload gift card image</p>
                {preview && <img src={preview} className="mt-4 max-h-40 mx-auto rounded-lg" />}
              </label>
            ) : (
              <textarea value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Enter gift card code" className="w-full min-h-30 bg-primary-1200 border border-silver-900/40 rounded-xl px-4 py-3 focus:outline-none" />
            )}

            <label className="flex gap-3 text-sm text-silver-400">
              <input type="checkbox" checked={agree} onChange={(e)=>setAgree(e.target.checked)} />
              I confirm this card belongs to me
            </label>

            <button className="w-full bg-primary-500 text-silver-100 font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90">
               Trade Now <ArrowRight size={18}/>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}