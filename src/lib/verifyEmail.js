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

export const verifyOtp = async (email, otp) => {
  try {
    const res = await api.post("/api/v1/auth/verify-otp", {
      email,
      otp,
    });

    const payload = res.data;

    if (!payload?.success) {
      throw createClientError(
        400,
        payload?.message || "OTP verification failed"
      );
    }

    return payload;

  } catch (err) {

    if (err.response) {
      const status = err.response.status;
      const message =
        err.response.data?.message ||
        "OTP verification failed. Please try again.";

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

export const getOtpExpireTime = async (email) => {
  try {
    const res = await api.get("/api/v1/auth/get-expire-time", {
      params: { email },
    });

    const payload = res.data;

    if (!payload?.success) {
      throw createClientError(
        400,
        payload?.message || "Failed to fetch OTP expiry time"
      );
    }

    return payload;

  } catch (err) {

    if (err.response) {
      const status = err.response.status;
      const message =
        err.response.data?.message ||
        "Could not retrieve OTP expiry time.";

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


export const resendOtp = async (email) => {
  try {
    const res = await api.post("/api/v1/auth/resend-otp", {
      email,
    });

    const payload = res.data;

    if (!payload?.success) {
      throw createClientError(
        400,
        payload?.message || "Failed to resend OTP"
      );
    }

    return payload;

  } catch (err) {

    if (err.response) {
      const status = err.response.status;
      const message =
        err.response.data?.message ||
        "Failed to resend OTP. Please try again.";

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