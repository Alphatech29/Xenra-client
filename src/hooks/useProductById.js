import { useState, useEffect, useCallback } from "react";
import { fetchProductById, createCardOrder } from "../lib/cardProducts";

export const useProductById = (productId) => {

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [ordering, setOrdering] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ---------- Fetch Product ---------- */

  const getProduct = useCallback(async () => {

    if (!productId) return;

    setLoading(true);
    setError(null);

    try {

      const response = await fetchProductById(productId);

      console.log("Product API Response:", response);

      if (!response) {
        throw new Error("Failed to fetch product");
      }

      const productData =
        response?.success !== undefined
          ? response.data
          : response;

      if (!productData) {
        throw new Error("Invalid product response");
      }

      setProduct({
        ...productData,
        senderFee: Number(productData.senderFee ?? 0),
        senderFeePercentage: Number(productData.senderFeePercentage ?? 0),
        minRecipientDenomination: Number(productData.minRecipientDenomination ?? 0),
        maxRecipientDenomination: Number(productData.maxRecipientDenomination ?? 0),
        fixedRecipientDenominations: productData.fixedRecipientDenominations || [],
        fixedRecipientToSenderDenominationsMap:
          productData.fixedRecipientToSenderDenominationsMap || {},
      });

    } catch (err) {

      console.error("Product fetch failed:", err);

      setError(err?.message || "Failed to fetch product");
      setProduct(null);

    } finally {

      setLoading(false);

    }

  }, [productId]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  /* ---------- Build Payload ---------- */

  const createPayload = ({ qty, amount, email }) => {

    if (!product) return null;

    return {
      productId: Number(product.productId),
      quantity: Number(qty),
      amount: Number(amount),
      recipientEmail: email,
    };
  };

  /* ---------- Create Order ---------- */

  const createOrder = async ({ qty, amount, email }) => {

    setOrdering(true);

    try {

      const payload = createPayload({ qty, amount, email });

      if (!payload) {
        return {
          success: false,
          message: "Invalid order payload",
          code: "INVALID_PAYLOAD"
        };
      }

      const response = await createCardOrder(payload);

      if (!response?.success) {
        return {
          success: false,
          message: response?.message || "Order failed",
          code: response?.code || "ORDER_FAILED"
        };
      }

      return response;

    } catch (err) {

      console.error("Order creation failed:", err);

      return {
        success: false,
        message: err?.message || "Failed to create order",
        code: "ORDER_EXCEPTION"
      };

    } finally {

      setOrdering(false);

    }
  };

  return {
    product,
    error,      // only for product loading errors
    loading,
    ordering,
    refetch: getProduct,
    createOrder,
  };
};