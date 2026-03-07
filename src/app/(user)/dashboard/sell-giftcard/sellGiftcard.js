"use client";

import { useState, useEffect } from "react";
import { ArrowRight, UploadCloud, ChevronDown } from "lucide-react";
import { useSellGiftCard } from "../../../../hooks/useGiftcards";
import ModalBottomSheet from "../_components/modal";
import SelectModal from "../_components/selectModal";

export default function SellGiftCardForm() {
 const {
  giftcards,
  mode,
  setMode,
  category,
  setCategory,
  subCategory,
  setSubCategory,
  amount,
  setAmount,
  code,
  setCode,
  preview,
  handleImageChange,
  agree,
  setAgree,
  selectedCategory,
  receive,
  fee,
  finalAmount,
  handleSubmit,
  resetForm
} = useSellGiftCard();

  const [openBrandModal, setOpenBrandModal] = useState(false);
  const [openTypeModal, setOpenTypeModal] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);

  const [brandSearch, setBrandSearch] = useState("");
  const [typeSearch, setTypeSearch] = useState("");

  const [tradeStatus, setTradeStatus] = useState("preview");

  const selectedBrand = giftcards?.find((c) => c.id == category);

  const selectedType = selectedCategory?.sub_categories?.find(
    (s) => s.id == subCategory,
  );

  const cardType = selectedType?.card_type?.toLowerCase();
  const isEcode = cardType === "ecode" || cardType === "e-code";

  useEffect(() => {
    if (!selectedType) return;

    if (
      selectedType.card_type?.toLowerCase() === "ecode" ||
      selectedType.card_type?.toLowerCase() === "e-code"
    ) {
      setMode("ecode");
    } else {
      setMode("physical");
    }
  }, [selectedType, setMode]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setOpenBrandModal(false);
        setOpenTypeModal(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      openBrandModal || openTypeModal ? "hidden" : "auto";
  }, [openBrandModal, openTypeModal]);

  const submitTrade = async () => {
    try {
      setTradeStatus("loading");

      await handleSubmit();

      setTradeStatus("success");
    } catch (err) {
      console.error(err);
      setTradeStatus("preview");
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-linear-to-b from-primary-1200 via-primary-950 to-primary-1200 text-silver-100 py-6 px-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.3fr_.7fr] gap-6">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          <div>
            <h1 className="text-xl font-bold">Sell Gift Card</h1>
            <p className="text-silver-400 text-sm mt-1">
              Trade your gift cards instantly and receive cash
            </p>
          </div>

          <form className="bg-primary-950/50 backdrop-blur border border-silver-900/40 rounded-2xl p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setOpenBrandModal(true)}
                className="flex justify-between items-center bg-primary-1200 border border-silver-900/40 rounded-xl px-4 py-3 hover:border-primary-500 transition"
              >
                <div className="flex items-center gap-2">
                  {selectedBrand?.logo && (
                    <img
                      src={selectedBrand.logo}
                      alt={selectedBrand.name}
                      className="w-6 h-6 rounded-full object-contain bg-white/80 p-0.5"
                    />
                  )}

                  <span>
                    {selectedBrand ? selectedBrand.name : "Select Brand"}
                  </span>
                </div>

                <ChevronDown size={18} />
              </button>

              <button
                type="button"
                disabled={!selectedBrand}
                onClick={() => setOpenTypeModal(true)}
                className="flex justify-between items-center bg-primary-1200 border border-silver-900/40 rounded-xl px-4 py-3 disabled:opacity-40 hover:border-primary-500 transition"
              >
                <div className="flex items-center gap-2">
                  {selectedBrand?.logo && (
                    <img
                      src={selectedBrand.logo}
                      alt={selectedBrand.name}
                      className="w-6 h-6 rounded-full object-contain bg-white/80 p-0.5"
                    />
                  )}

                  <span>
                    {selectedType
                      ? `${selectedType.name} - ${
                          selectedType.country.charAt(0).toUpperCase() +
                          selectedType.country.slice(1)
                        }`
                      : "Select Sub-category"}
                  </span>
                </div>

                <ChevronDown size={18} />
              </button>
            </div>

            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Card Amount ($)"
              className="w-full bg-primary-1200 border border-silver-900/40 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
            />

            {!isEcode ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-silver-800 rounded-xl p-8 cursor-pointer hover:border-primary-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <UploadCloud size={34} className="text-silver-400 mb-2" />

                <p className="text-sm text-silver-400">
                  Upload Gift Card Image
                </p>

                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="mt-4 max-h-40 rounded-lg shadow"
                  />
                )}
              </label>
            ) : (
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter gift card code"
                className="w-full min-h-32 bg-primary-1200 border border-silver-900/40 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500"
              />
            )}

            <label className="flex items-center gap-3 text-sm text-silver-400">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              I confirm this gift card belongs to me
            </label>

            <button
              type="button"
              disabled={!agree}
              onClick={() => {
                setTradeStatus("preview");
                setOpenPreview(true);
              }}
              className="w-full bg-primary-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-40"
            >
              Proceed
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        {/* RIGHT SIDE SUMMARY */}
        <div className="bg-primary-950/60 backdrop-blur border border-silver-900/40 rounded-2xl p-8 h-fit space-y-6 sticky top-20">
          <h3 className="text-xl font-semibold">Transaction Summary</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-silver-400">Card Value</span>
              <span>₦{receive?.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-silver-400">Processing Fee</span>
              <span>- ₦{fee?.toLocaleString()}</span>
            </div>

            <div className="border-t border-silver-900/40 pt-3 flex justify-between font-semibold text-lg">
              <span>You Receive</span>
              <span className="text-green-500">
                ₦{finalAmount?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <SelectModal
        open={openBrandModal}
        setOpen={setOpenBrandModal}
        title="Select Brand"
        data={giftcards || []}
        selectedId={category}
        search={brandSearch}
        setSearch={setBrandSearch}
        showLogo={true}
        onSelect={(item) => {
          setCategory(item.id);
          setSubCategory("");
        }}
      />

      <SelectModal
        open={openTypeModal}
        setOpen={setOpenTypeModal}
        title="Select Sub-category"
        data={selectedCategory?.sub_categories || []}
        selectedId={subCategory}
        search={typeSearch}
        setSearch={setTypeSearch}
        showLogo={true}
        brandLogo={selectedBrand?.logo}
        onSelect={(item) => {
          setSubCategory(item.id);
        }}
      />

      {/* TRADE PREVIEW */}
      <ModalBottomSheet open={openPreview} setOpen={setOpenPreview}>
        <div className="p-4 space-y-6">
          {tradeStatus === "preview" && (
            <>
              <h3 className="text-lg font-semibold">Trade Preview</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-silver-400">Brand</span>

                  <div className="flex items-center gap-2">
                    {selectedBrand?.logo && (
                      <img
                        src={selectedBrand.logo}
                        alt={selectedBrand.name}
                        className="w-6 h-6 rounded-full object-contain bg-white/80 p-0.5"
                      />
                    )}

                    <span>{selectedBrand?.name}</span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-silver-400">Sub-category</span>
                  <span>
                    {selectedType?.name} -{" "}
                    {selectedType?.country?.charAt(0).toUpperCase() +
                      selectedType?.country?.slice(1)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-silver-400">Amount</span>
                  <span>${amount}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-silver-400">Rate</span>
                  <span>
                    ₦{selectedType?.rate}/1{selectedType?.currency}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-silver-400">Processing Fee</span>
                  <span>- ₦{fee?.toLocaleString()}</span>
                </div>

                <div className="border-t border-silver-900/40 pt-3 flex justify-between font-semibold text-lg">
                  <span>You Receive</span>
                  <span className="text-green-500">
                    ₦{finalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              {code && (
                <div className="bg-primary-1200 border border-silver-900/40 rounded-xl p-4">
                  <p className="text-silver-400 text-xs mb-2">Gift Card Code</p>

                  <p className="text-sm wrap-break-word font-mono bg-primary-950 p-3 rounded-lg">
                    {code}
                  </p>
                </div>
              )}

              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="rounded-lg max-h-48 object-cover"
                />
              )}

              <button
                onClick={submitTrade}
                className="w-full bg-primary-500 py-3 rounded-xl text-white"
              >
                Confirm Trade
              </button>
            </>
          )}

          {tradeStatus === "loading" && (
            <div className="flex flex-col items-center gap-6 py-16">
              <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>

              <div className="space-y-1 flex flex-col items-center">
                <p className="text-base font-semibold text-silver-100">
                  Processing Trade
                </p>
                <p className="text-sm text-silver-400">
                  Please wait while we submit your trade
                </p>
              </div>
            </div>
          )}

          {tradeStatus === "success" && (
            <div className="py-14 flex flex-col items-center justify-center text-center gap-6">
              {/* Success Icon */}
              <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white text-xl shadow-lg">
                  ✓
                </div>
              </div>

              {/* Text */}
              <div className="space-y-1">
                <p className="text-base font-semibold text-silver-100">
                  Trade Submitted
                </p>
                <p className="text-sm text-silver-400">
                  Your gift card trade has been received and is being processed.
                </p>
              </div>

              {/* Done Button */}
             <button
  onClick={() => {
    resetForm();
    setTradeStatus("preview");
    setOpenPreview(false);
  }}
  className="mt-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:opacity-90 transition"
>
  Done
</button>
            </div>
          )}
        </div>
      </ModalBottomSheet>
    </div>
  );
}
