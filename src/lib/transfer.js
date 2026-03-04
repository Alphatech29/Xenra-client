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

/* ---------------- Transfer Service ---------------- */
export const transfer = async (transferData) => {
  try {
    const response = await api.post("/api/v1/users/transfer", transferData);

    const payload = response?.data;

    if (!payload) {
      throw new Error("Invalid server response");
    }

    if (payload.success !== true) {
      throw new Error(payload.message || "Transfer failed");
    }

    return payload.data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unable to complete transfer";

      throw new Error(message);
    }

    throw new Error("Unexpected transfer error");
  }
};