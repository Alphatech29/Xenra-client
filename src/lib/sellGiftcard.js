import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not set");
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/* ---------------- Get Giftcard Brands ---------------- */
export const getGiftcards = async () => {
  try {
    const response = await api.get("/api/v1/users/get-giftcard");

    const payload = response?.data;

    if (!payload) {
      throw new Error("Invalid server response");
    }

    if (payload.success !== true) {
      throw new Error(payload.message || "Failed to fetch giftcards");
    }

    return payload.data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unable to fetch giftcards";

      throw new Error(message);
    }

    throw new Error("Unexpected giftcard fetch error");
  }
};

/* ---------------- Trade Giftcard ---------------- */
export const tradeCard = async (formData) => {
  try {
    const response = await api.post(
      "/api/v1/users/trade-card",
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    const resPayload = response?.data;

    if (!resPayload) {
      throw new Error("Invalid server response");
    }

    if (resPayload.success !== true) {
      throw new Error(resPayload.message || "Giftcard trade failed");
    }

    return resPayload.payload;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unable to trade giftcard";

      throw new Error(message);
    }

    throw new Error("Unexpected trade giftcard error");
  }
};