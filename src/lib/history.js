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

/* ---------------- Get Transaction History ---------------- */
export const getTransactionHistory = async () => {
  try {
    const response = await api.get("/api/v1/users/history");

    const payload = response?.data;

    if (!payload || payload.success !== true) {
      throw new Error(payload?.message || "Failed to fetch transaction history");
    }

    return payload.data.transactions;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unable to fetch transaction history";

      throw new Error(message);
    }

    throw new Error("Unexpected transaction history error");
  }
};