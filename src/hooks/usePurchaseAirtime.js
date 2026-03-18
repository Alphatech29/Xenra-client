import { useState } from "react";
import { purchaseAirtime } from "../lib/airtime";

/**
 * Nigerian network prefixes
 */
const NETWORK_PREFIXES = {
  mtn: [
    "0803","0806","0703","0706","0813","0816","0810","0814",
    "0903","0906","0913","0916"
  ],

  airtel: [
    "0802","0808","0708","0812","0902","0907","0901","0912"
  ],

  glo: [
    "0805","0807","0705","0815","0811","0905","0915"
  ],

  t2mobile: [
    "0809","0817","0818","0909","0908","0918"
  ]
};

/**
 * Normalize phone numbers
 */
const normalizePhone = (phone) => {
  if (!phone) return "";

  if (phone.startsWith("+234")) {
    return "0" + phone.slice(4);
  }

  if (phone.startsWith("234")) {
    return "0" + phone.slice(3);
  }

  return phone;
};

/**
 * Detect network from phone number
 */
const detectNetworkFromPhone = (phone) => {
  const normalized = normalizePhone(phone);

  if (!normalized || normalized.length < 4) return null;

  const prefix = normalized.slice(0, 4);

  for (const network in NETWORK_PREFIXES) {
    if (NETWORK_PREFIXES[network].includes(prefix)) {
      return network;
    }
  }

  return null;
};

export const usePurchaseAirtime = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transaction, setTransaction] = useState(null);

  const buyAirtime = async (airtimeData) => {
    setLoading(true);
    setError(null);
    setTransaction(null);

    try {
      const payload = {
        ...airtimeData,
        number: normalizePhone(airtimeData.number)
      };

      const data = await purchaseAirtime(payload);

      setTransaction(data);

      return data;

    } catch (err) {

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to process airtime purchase";

      setError(message);

      throw new Error(message);

    } finally {
      setLoading(false);
    }
  };

  return {
    buyAirtime,
    loading,
    error,
    transaction,
    detectNetworkFromPhone,
    normalizePhone
  };
};