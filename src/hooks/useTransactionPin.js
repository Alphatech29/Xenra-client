"use client";

import { useState, useRef, useEffect } from "react";
import { createTransactionPin, changeTransactionPin } from "../lib/transactionPin";

export const useTransactionPin = (mode = "create") => {

  const [pin, setPin] = useState("");
  const [step, setStep] = useState(mode === "change" ? "current" : "create");
  const [firstPin, setFirstPin] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [error, setError] = useState("");

  const inputRef = useRef(null);

  /* focus input */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* update step when mode changes */
  useEffect(() => {
    setStep(mode === "change" ? "current" : "create");
  }, [mode]);

  const resetPin = () => {
    setPin("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const resetAll = () => {
    setPin("");
    setFirstPin("");
    setCurrentPin("");
    setError("");
    setStep(mode === "change" ? "current" : "create");
  };

  const getTitle = () => {
    switch (step) {
      case "current":
        return "Enter Current PIN";
      case "create":
        return "Create Transaction PIN";
      case "confirm":
        return "Confirm Transaction PIN";
      case "new":
        return "Enter New PIN";
      case "confirmNew":
        return "Confirm New PIN";
      default:
        return "Transaction PIN";
    }
  };

  const handleChange = (e) => {

    const value = e.target.value.replace(/\D/g, "");

    if (value.length > 4) {
      return;
    }

    setPin(value);
  };

  const handleSubmit = async () => {

    if (pin.length !== 4) {
      setError("Enter your 4-digit PIN");
      return;
    }

    setError("");

    /* ---------------- CREATE FLOW ---------------- */

    if (step === "create") {

      setFirstPin(pin);
      setStep("confirm");
      resetPin();
      return;
    }

    if (step === "confirm") {

      if (pin !== firstPin) {
        setError("PINs do not match");
        resetPin();
        return;
      }

      try {

        const response = await createTransactionPin({ pin });

        resetAll();
        return "success";

      } catch (err) {

        setError(err.message || "Failed to create PIN");
        resetPin();
      }
    }

    /* ---------------- CHANGE FLOW ---------------- */

    if (step === "current") {

      setCurrentPin(pin);
      setStep("new");
      resetPin();
      return;
    }

    if (step === "new") {

      setFirstPin(pin);
      setStep("confirmNew");
      resetPin();
      return;
    }

    if (step === "confirmNew") {

      if (pin !== firstPin) {
        setError("PINs do not match");
        resetPin();
        return;
      }

      try {

        const response = await changeTransactionPin({
          oldPin: currentPin,
          newPin: pin,
        });

        resetAll();
        return "success";

      } catch (err) {

        setError(err.message || "Failed to change PIN");
        resetPin();
      }
    }
  };

  return {
    pin,
    error,
    inputRef,
    handleChange,
    handleSubmit,
    getTitle,
  };
};