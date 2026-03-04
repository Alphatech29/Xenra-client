import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
  withCredentials: true,
});

/* Create consistent client error */
const createClientError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  err.isApiError = true;
  return err;
};

/* ---------------- CREATE TRANSACTION PIN ---------------- */
export const createTransactionPin = async (pin) => {
  try {
    if (!pin) {
      throw createClientError(400, "Transaction PIN is required");
    }

    // Send PIN directly
    const res = await api.post("/api/v1/users/create-pin", pin);

    const payload = res.data;

    if (!payload?.success) {
      throw createClientError(
        400,
        payload?.message || "Failed to create transaction PIN"
      );
    }

    return payload;

  } catch (err) {
    if (err.response) {
      const status = err.response.status;
      const message =
        err.response.data?.message || "Unable to create transaction PIN.";

      throw createClientError(status, message);
    }

    if (err.request) {
      throw createClientError(
        503,
        "Network error. Check your connection and retry."
      );
    }

    throw createClientError(500, "Unexpected error occurred");
  }
};