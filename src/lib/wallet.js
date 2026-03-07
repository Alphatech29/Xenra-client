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

/* ---------------- Get User Wallet ---------------- */
export const getUserWallet = async () => {
  try {
    const response = await api.get("/api/v1/users/wallet");

    const payload = response?.data;

    if (!payload) {
      throw new Error("Invalid server response");
    }

    if (payload.success !== true) {
      throw new Error(payload.message || "Failed to fetch wallet");
    }

    return payload.data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unable to fetch wallet";

      throw new Error(message);
    }

    throw new Error("Unexpected wallet fetch error");
  }
};