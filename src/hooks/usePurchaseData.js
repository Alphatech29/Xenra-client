import { useState } from "react";
import { purchaseData } from "../lib/data";

export const usePurchaseData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState(null);

  const handlePurchaseData = async (dataPayload) => {
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccess(false);
    setResponse(null);

    try {
      const {
        request_id,
        serviceID,
        billersCode,
        variation_code,
        phone,
      } = dataPayload || {};

      if (
        !request_id ||
        !serviceID ||
        !billersCode ||
        !variation_code ||
        !phone
      ) {
        throw new Error("Invalid request. Please try again.");
      }

      /* 🚀 API CALL */
      const result = await purchaseData(dataPayload);

      /* ✅ SUCCESS (IMPORTANT FIX) */
      if (result) {
        setSuccess(true);
        setResponse(result);
        return { success: true, data: result };
      }

      /* ❌ SHOULD RARELY HAPPEN */
      throw new Error("Transaction failed. Please try again.");

    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Network error. Please try again.";

      setError(message);
      setSuccess(false);

      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
    setResponse(null);
    setLoading(false);
  };

  return {
    handlePurchaseData,
    loading,
    error,
    success,
    response,
    reset,
  };
};