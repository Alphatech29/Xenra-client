"use client";

import { useState, useRef, useEffect } from "react";
import { createTransactionPin } from "../lib/transactionPin";

export const useTransactionPin = (mode = "create") => {

  const [pin, setPin] = useState("");
  const [step, setStep] = useState(mode === "change" ? "current" : "create");
  const [firstPin, setFirstPin] = useState("");
  const [error, setError] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const resetPin = () => {
    setPin("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const resetAll = () => {
    setPin("");
    setFirstPin("");
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
    if (value.length > 4) return;
    setPin(value);
  };

  const handleSubmit = async () => {

    if (pin.length !== 4) {
      setError("Enter your 4-digit PIN");
      return;
    }

    setError("");

    /* CREATE FLOW */

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

        // FIX: send valid JSON
        await createTransactionPin({ pin });

        console.log("PIN created successfully");

        resetAll();
        return "success";

      } catch (err) {

        setError(err.message || "Failed to create PIN");
        resetPin();
      }
    }

    /* CHANGE FLOW */

    if (step === "current") {
      console.log("Current PIN:", pin);
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

      console.log("New PIN:", pin);

      resetAll();
      return "success";
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