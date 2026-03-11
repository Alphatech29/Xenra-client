import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_API_URL is not set");
}

/**
 * Axios instance
 */
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/**
 * Handle API response
 */
const handleResponse = (res) => {
  const payload = res?.data;

  if (!payload || payload.success !== true) {
    throw new Error(payload?.message || "Request failed");
  }

  return payload.data;
};

/**
 * Handle API errors safely
 */
const handleError = (error, fallbackMessage) => {
  const status = error?.response?.status;

  // safe logging (avoid leaking tokens or headers)
  console.error("API Request Failed:", {
    status,
    url: error?.config?.url,
    method: error?.config?.method,
    message: error?.message,
  });

  if (status === 401) {
    throw new Error("Your session has expired. Please login again.");
  }

  if (status === 403) {
    throw new Error("You are not allowed to perform this action.");
  }

  if (status === 404) {
    throw new Error("Requested resource was not found.");
  }

  if (status >= 500) {
    throw new Error("Server error. Please try again later.");
  }

  throw new Error(
    error?.response?.data?.message ||
      fallbackMessage ||
      "Something went wrong. Please try again."
  );
};

/**
 * Fetch all products
 */
export const fetchAllProducts = async () => {
  try {
    const res = await api.get("/api/v1/users/all-products");

    const data = handleResponse(res);

    if (!Array.isArray(data)) {
      throw new Error("Invalid product list format");
    }

    return data;
  } catch (error) {
    return handleError(error, "Unable to fetch products");
  }
};

/**
 * Fetch product by ID
 */
export const fetchProductById = async (productId) => {
  try {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    const res = await api.get(`/api/v1/users/products/${productId}`);

    return handleResponse(res);
  } catch (error) {
    return handleError(error, "Unable to fetch product");
  }
};

/**
 * Create gift card order
 */
export const createCardOrder = async (orderData) => {

  if (!orderData) {
    return {
      success: false,
      code: "INVALID_ORDER_DATA",
      message: "Order data is required",
      data: null
    };
  }

  try {

    const res = await api.post(
      "/api/v1/users/card-order",
      orderData,
      {
        validateStatus: () => true
      }
    );

    const payload = res?.data;

    if (!payload) {
      return {
        success: false,
        code: "EMPTY_RESPONSE",
        message: "Empty server response",
        data: null
      };
    }

    return payload;

  } catch (error) {

    return {
      success: false,
      code: "NETWORK_ERROR",
      message: error?.message || "Unable to create card order",
      data: null
    };

  }
};