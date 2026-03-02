import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

/* Create consistent client error */
const createClientError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  err.isApiError = true;
  return err;
};

export const resolveAccount = async (account_number, bank_code) => {
  try {
    const res = await api.post("/api/v1/users/resolve-account", {
      account_number,
      account_code: bank_code,
    });

    const payload = res.data;

    if (payload?.status !== "success" || !payload?.data) {
      throw createClientError(400, payload?.message || "Account resolution failed");
    }

    return payload.data;

  } catch (err) {

    /* Server responded */
    if (err.response) {
      const status = err.response.status;
      const message =
        err.response.data?.message ||
        "Unable to verify account details. Please try again";

      throw createClientError(status, message);
    }

    /* Request made but no response (network/server offline) */
    if (err.request) {
      throw createClientError(503, "Network error. Check connection and retry.");
    }

    /* Axios setup / unexpected error */
    throw createClientError(500, "Unexpected error occurred");
  }
};