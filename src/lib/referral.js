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

/* ---------------- Get User Referrals ---------------- */
export const getUserReferrals = async () => {
  try {
    const response = await api.get("/api/v1/users/referral");

    const payload = response?.data;

    if (!payload) {
      throw new Error("Invalid server response");
    }

    if (!payload.success) {
      throw new Error(payload.message || "Failed to fetch referrals");
    }

    return {
      total: payload.total || 0,
      data: payload.data || [],
    };

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Unable to fetch referrals";

      throw new Error(message);
    }

    throw new Error("Unexpected referral fetch error");
  }
};