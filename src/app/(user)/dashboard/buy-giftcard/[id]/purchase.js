"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, CircleCheck } from "lucide-react";

import { useProductById } from "../../../../../hooks/useProductById";
import ModalBottomSheet from "../../_components/modal";
import AlertModal from "../../_components/alertModal";

/* -----------------------------------------------------------
   Safe Image Component
----------------------------------------------------------- */

function SafeImage({ src, alt, ...props }) {
  const validSrc = src && src.trim() !== "" ? src : null;
  if (!validSrc) return null;

  return <Image src={validSrc} alt={alt || ""} {...props} unoptimized />;
}

/* -----------------------------------------------------------
   Giftcard Purchase Page
----------------------------------------------------------- */

export default function GiftcardPurchasePage() {
  const { id } = useParams();
  const router = useRouter();

  const { product, error, createOrder } = useProductById(id);

  const [qty, setQty] = useState(1);
  const [email, setEmail] = useState("");

  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [amountError, setAmountError] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /* -----------------------------------------------------------
     Initialize Default Amount
  ----------------------------------------------------------- */

  useEffect(() => {
    if (product?.fixedRecipientDenominations?.length) {
      setSelectedAmount(product.fixedRecipientDenominations[0]);
    }
  }, [product]);

  /* -----------------------------------------------------------
     Loading & Error State
  ----------------------------------------------------------- */

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center text-red-400">
        {error}
      </div>
    );
  }

  if (!product || typeof product !== "object") {
    return (
      <div className="max-w-xl mx-auto p-3 pb-32 space-y-5 animate-pulse">
        <div className="h-16 bg-white/10 rounded-xl" />
        <div className="h-16 bg-white/10 rounded-xl" />
        <div className="h-16 bg-white/10 rounded-xl" />
      </div>
    );
  }

  /* -----------------------------------------------------------
     Helpers
  ----------------------------------------------------------- */

  const currency = product?.recipientCurrencyCode;

  const formatMoney = (value) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(Number(value || 0));

  const isFixed = product?.denominationType === "FIXED";
  const isRange = product?.denominationType === "RANGE";

  const denominations = product?.fixedRecipientDenominations || [];
  const denominationMap = product?.fixedRecipientToSenderDenominationsMap || {};

  const amount = isFixed
    ? (selectedAmount ?? denominations[0] ?? 0)
    : Number(customAmount || 0);

  const senderPrice = isFixed ? (denominationMap?.[amount] ?? amount) : amount;

  const feeFixed = Number(product?.senderFee ?? 0);

  const feePercent =
    (senderPrice * Number(product?.senderFeePercentage ?? 0)) / 100;

  const feePerCard = feeFixed + feePercent;

  const subtotal = senderPrice * qty;
  const totalFee = feePerCard * qty;
  const total = subtotal + totalFee;

  const min = Number(product?.minRecipientDenomination ?? 0);
  const max = Number(product?.maxRecipientDenomination ?? 0);

  const invalidRange = isRange && (amount < min || amount > max);

  /* -----------------------------------------------------------
     Purchase Logic
  ----------------------------------------------------------- */

  const handleBuy = () => {
    if (!email) {
      setErrorMessage("Please enter recipient email");
      setErrorOpen(true);
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setErrorMessage("Please select amount");
      setErrorOpen(true);
      return;
    }

    if (invalidRange) {
      setErrorMessage(
        `Amount must be between ${formatMoney(min)} and ${formatMoney(max)}`,
      );
      setErrorOpen(true);
      return;
    }

    setConfirmOpen(true);
  };

  const confirmPurchase = async () => {
    if (processing) return;

    setProcessing(true);

    try {
      const result = await createOrder({
        qty,
        amount,
        email,
      });

      if (!result?.success) {
        setErrorMessage(result?.message || "Failed to complete purchase");
        setErrorOpen(true);
        setConfirmOpen(false);
        return;
      }

      setSuccess(true);
    } finally {
      setProcessing(false);
    }
  };

  /* -----------------------------------------------------------
     UI
  ----------------------------------------------------------- */

  return (
    <>
      <div className="max-w-xl mx-auto p-3 pb-32 space-y-5">
        {/* Header */}

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              if (window.history.length > 1) router.back();
              else router.push("/dashboard/buy-giftcard");
            }}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20"
          >
            <ArrowLeft size={20} />
          </button>

          <h2 className="text-base font-bold">Purchase</h2>

          <div className="w-8" />
        </div>

        {/* Product Card */}

        <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4">
          <div className="relative w-16 h-16">
            <SafeImage
              src={product?.brandLogoUrl}
              alt={product?.productName}
              fill
              className="object-contain"
            />
          </div>

          <div>
            <h1 className="text-lg font-bold">{product?.productName}</h1>

            <p className="text-sm text-gray-400">{product?.countryName}</p>
          </div>
        </div>

        {/* Amount */}

        <div className="space-y-2">
          <label className="text-sm font-semibold">Amount</label>

          {isFixed && (
            <div className="grid grid-cols-3 text-sm gap-2">
              {denominations.map((value) => (
                <button
                  key={value}
                  onClick={() => setSelectedAmount(value)}
                  className={`p-3 rounded-xl ${
                    amount === value
                      ? "bg-primary-500 text-white"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  {formatMoney(value)}
                </button>
              ))}
            </div>
          )}

          {isRange && (
            <>
              <input
                type="number"
                value={customAmount}
                min={min}
                max={max}
                placeholder={`Min ${formatMoney(min)} - Max ${formatMoney(max)}`}
                onChange={(e) => {
                  const value = Number(e.target.value);

                  setCustomAmount(value);

                  if (value < min) {
                    setAmountError(`Minimum amount is ${formatMoney(min)}`);
                  } else if (value > max) {
                    setAmountError(`Maximum amount is ${formatMoney(max)}`);
                  } else {
                    setAmountError("");
                  }
                }}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 placeholder:text-gray-400 placeholder:text-sm"
              />

              <p className="text-xs text-gray-400">
                Min: {formatMoney(min)} • Max: {formatMoney(max)}
              </p>

              {amountError && (
                <p className="text-xs text-red-400">{amountError}</p>
              )}
            </>
          )}
        </div>

        {/* Quantity */}

        <div className="flex items-center gap-3">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-10 h-10 rounded-lg bg-white/10"
          >
            −
          </button>

          <span className="text-lg font-semibold w-10 text-center">{qty}</span>

          <button
            onClick={() => setQty(Math.min(10, qty + 1))}
            className="w-10 h-10 rounded-lg bg-white/10"
          >
            +
          </button>
        </div>

        {/* Email */}

        <input
          type="email"
          placeholder="Recipient Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-xl text-sm bg-white/5 border border-white/10"
        />

        {/* Price Breakdown */}

        <div className="bg-white/5 rounded-2xl p-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span>Price</span>
            <span>{formatMoney(senderPrice)}</span>
          </div>

          <div className="flex justify-between">
            <span>Quantity</span>
            <span>x{qty}</span>
          </div>

          {totalFee > 0 && (
            <div className="flex justify-between">
              <span>Processing Fee</span>
              <span>{formatMoney(totalFee)}</span>
            </div>
          )}

          <div className="flex justify-between font-bold text-base border-t pt-2">
            <span>Total</span>
            <span>{formatMoney(total)}</span>
          </div>
        </div>

        {/* Buy Button */}

        <button
          onClick={handleBuy}
          disabled={invalidRange}
          className="w-full py-2 rounded-2xl bg-primary-500 text-white disabled:opacity-50"
        >
          Buy Now
        </button>

        <div>
          {/* Redeem Instructions */}

          {(product?.redeemInstructionConcise ||
            product?.redeemInstructionVerbose) && (
            <div className="bg-white/5 rounded-2xl p-5 space-y-4">
              {product?.redeemInstructionConcise && (
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-silver-200">
                    Redeem Instructions
                  </h3>

                  <p className="text-sm text-silver-300 leading-relaxed whitespace-pre-line">
                    {product.redeemInstructionConcise}
                  </p>
                </div>
              )}

              {product?.redeemInstructionVerbose && (
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-silver-200">
                    Detailed Instructions
                  </h3>

                  <p className="text-sm text-silver-300 leading-relaxed whitespace-pre-line">
                    {product.redeemInstructionVerbose}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Modal */}

      <ModalBottomSheet
        open={confirmOpen}
        onClose={() => !processing && setConfirmOpen(false)}
      >
        {success ? (
          <div className="flex flex-col items-center text-center py-8 space-y-4">
            <CircleCheck className="text-green-500" size={48} />

            <h3 className="text-lg font-semibold">
              Gift Card Purchased Successfully
            </h3>

            <button
              onClick={() => router.push("/dashboard/buy-giftcard")}
              className="px-5 py-2 rounded-xl bg-primary-500 text-white"
            >
              Done
            </button>
          </div>
        ) : processing ? (
          <div className="flex flex-col items-center py-10 space-y-4">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />

            <p className="text-sm text-gray-400">Processing your purchase...</p>
          </div>
        ) : (
          <div className="space-y-4 text-sm">
            <div className="flex justify-center text-xl font-semibold mb-5">
              Confirm Purchase
            </div>

            <div className="flex justify-between">
              <span>Gift Card</span>
              <span>{product?.productName}</span>
            </div>

            <div className="flex justify-between">
              <span>Amount</span>
              <span>{formatMoney(senderPrice)}</span>
            </div>

            <div className="flex justify-between">
              <span>Quantity</span>
              <span>x{qty}</span>
            </div>

            {totalFee > 0 && (
              <div className="flex justify-between">
                <span>Processing Fee</span>
                <span>{formatMoney(totalFee)}</span>
              </div>
            )}

            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>

            <button
              onClick={confirmPurchase}
              disabled={processing}
              className="w-full py-3 rounded-xl bg-primary-500 text-white disabled:opacity-50"
            >
              Confirm Purchase
            </button>
          </div>
        )}
      </ModalBottomSheet>

      {/* Error Modal */}

      {errorOpen && (
        <AlertModal
          type="error"
          title="Purchase Failed"
          message={errorMessage}
          onClose={() => setErrorOpen(false)}
        />
      )}
    </>
  );
}
