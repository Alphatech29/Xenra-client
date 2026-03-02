import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

// protect against undefined env
if (!API_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not set");
}

const api = axios.create({
  baseURL: API_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// always return clean array
export const fetchBanks = async () => {
  try {
    const res = await api.get("/api/v1/users/banks");

    const payload = res?.data;

    if (!payload || payload.success !== true) {
      throw new Error(payload?.message || "Bank request failed");
    }

    if (!Array.isArray(payload.data)) {
      throw new Error("Invalid bank list format");
    }

    return payload.data;

  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
      error.message ||
      "Unable to fetch banks"
    );
  }
};