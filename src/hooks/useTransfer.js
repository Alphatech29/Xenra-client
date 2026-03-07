"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { transfer } from "../lib/transfer";
import { useWallet } from "./useWallet";

export const useTransfer = () => {
  const { wallet } = useWallet();
  const balance = wallet?.available_balance || 0;

  const [beneficiary, setBeneficiary] = useState(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const [openPreview, setOpenPreview] = useState(false);
  const [askPin, setAskPin] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const [pin, setPin] = useState(["", "", "", ""]);
  const inputs = useRef([]);

  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const [insufficientBalance, setInsufficientBalance] = useState(false);

  /* -------- Load Recipient -------- */
  useEffect(() => {
    const saved = sessionStorage.getItem("transfer_recipient");

    if (!saved) return;

    try {
      setBeneficiary(JSON.parse(saved));
    } catch {
      sessionStorage.removeItem("transfer_recipient");
    }
  }, []);

  /* -------- Amount Handling -------- */
  const handleAmountChange = (e) => {
    let value = e.target.value;

    value = value.replace(/,/g, "");
    value = value.replace(/[^0-9.]/g, "");

    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts[1];
    }

    if (value.includes(".")) {
      const [whole, decimal] = value.split(".");
      value = whole + "." + decimal.slice(0, 2);
    }

    if (value.replace(".", "").length > 9) return;

    setAmount(value);
  };

  const numericAmount = parseFloat(amount) || 0;

  const format = (val) =>
    new Intl.NumberFormat("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val || 0);

  /* -------- Charges -------- */
  const fee = useMemo(() => {
    if (!numericAmount) return 0;

    if (numericAmount < 5000) return 10;
    if (numericAmount < 50000) return 25;

    return 50;
  }, [numericAmount]);

  const total = numericAmount + fee;

  /* -------- Auto Balance Check -------- */
  useEffect(() => {
    if (!numericAmount) {
      setInsufficientBalance(false);
      return;
    }

    setInsufficientBalance(total > balance);
  }, [numericAmount, total, balance]);

  const canContinue = numericAmount > 0 && !insufficientBalance;

  /* -------- Transfer Payload -------- */
  const transferPayload = useMemo(() => {
    if (!beneficiary) return null;

    return {
      recipient: {
        account_name: beneficiary.account_name,
        account_number: beneficiary.account_number,
        bank_name: beneficiary.bank_name,
        bank_code: beneficiary.bank_code || null,
      },
      transaction: {
        amount: numericAmount,
        fee,
        total_debit: total,
        narration: note || "",
      },
      authorization: {
        pin: pin.join(""),
      },
      metadata: {
        currency: "NGN",
        type: "bank_transfer",
        created_at: new Date().toISOString(),
      },
    };
  }, [beneficiary, numericAmount, fee, total, note, pin]);

  /* -------- PIN Handling -------- */
  const handlePinChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;

    setPin(newPin);

    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (askPin) {
      setTimeout(() => {
        inputs.current[0]?.focus();
      }, 100);
    }
  }, [askPin]);

  /* -------- Error Helper -------- */
  const getErrorMessage = (err) => {
    if (!err) return "Transfer failed";

    if (typeof err === "string") return err;

    if (err?.response?.data?.message) return err.response.data.message;

    if (err?.response?.data?.error) return err.response.data.error;

    if (err?.message) return err.message;

    if (err?.name === "TypeError")
      return "Network error. Please check your connection.";

    return "Something went wrong. Please try again.";
  };

  /* -------- Initiate Transfer -------- */
  const initiateTransfer = useCallback(async () => {
    if (insufficientBalance) {
      setError("Insufficient wallet balance");
      return null;
    }

    if (!transferPayload) {
      setError("Transfer data missing");
      return null;
    }

    setProcessing(true);
    setError(null);

    try {
      const response = await transfer(transferPayload);

      setData(response);
      setSuccess(true);

      return response;
    } catch (err) {
      const message = getErrorMessage(err);

      console.error("Transfer Error:", err);

      setError(message);
      setSuccess(false);

      return null;
    } finally {
      setProcessing(false);
    }
  }, [transferPayload, insufficientBalance]);

  return {
    beneficiary,
    note,
    pin,
    setPin, // ✅ FIX ADDED
    inputs,

    amount,
    openPreview,
    askPin,
    processing,
    success,

    numericAmount,
    fee,
    total,
    balance,
    canContinue,
    insufficientBalance,

    transferPayload,
    data,
    error,

    setNote,
    setAskPin,
    setOpenPreview,
    setProcessing,
    setSuccess,

    handleAmountChange,
    handlePinChange,
    handleKeyDown,
    format,

    initiateTransfer,
  };
};