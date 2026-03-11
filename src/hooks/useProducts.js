"use client";

import { useEffect, useState, useCallback } from "react";
import { fetchAllProducts } from "../lib/cardProducts";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const getProducts = useCallback(async () => {
    try {
      setError(null);

      const data = await fetchAllProducts();

      const formattedProducts = data.map((product) => ({
        id: product.productId,

        name: product.productName,

        img:
          product?.metadata?.brand?.logoUrl ||
          product?.metadata?.logoUrls?.[0] ||
          "/placeholder.png",

        category: product?.metadata?.category?.name || "Other",

        country: product?.metadata?.country?.isoName || "",

        countryName: product?.metadata?.country?.name || "",

        flag: product?.metadata?.country?.flagUrl || null,
      }));

      setProducts(formattedProducts);
    } catch (err) {
      setError(err.message || "Failed to load products");
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return {
    products,
    error,
    refetch: getProducts,
  };
};