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

/* ---------------- Data Purchase Service ---------------- */
export const purchaseData = async (dataPayload) => {
  try {
    const response = await api.post(
      "/api/v1/users/purchaseData",
      dataPayload
    );

    const payload = response?.data;

    console.log("PURCHASE RESPONSE:", payload); // 🔥 debug

    if (!payload) {
      throw new Error("Invalid server response");
    }

    // ✅ HANDLE SUCCESS + PENDING
    if (payload.success === true) {
      return payload.data;
    }

    // fallback (should rarely happen now)
    throw new Error(payload.message || "Data purchase failed");

  } catch (error) {

    // ✅ HANDLE AXIOS ERROR PROPERLY
    if (axios.isAxiosError(error)) {

      const resData = error.response?.data;

      console.log("AXIOS ERROR RESPONSE:", resData); // 🔥 debug

      // ✅ VERY IMPORTANT FIX
      if (resData?.success === true) {
        return resData.data;
      }

      const message =
        resData?.message ||
        resData?.error ||
        error.message ||
        "Unable to purchase data";

      throw new Error(message);
    }

    throw new Error("Unexpected data purchase error");
  }
};