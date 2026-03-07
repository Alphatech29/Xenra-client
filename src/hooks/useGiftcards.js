"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { getGiftcards, tradeCard } from "../lib/sellGiftcard";

export const useSellGiftCard = () => {

  /* ---------------- Giftcards ---------------- */
  const [giftcards, setGiftcards] = useState([]);
  const [error, setError] = useState(null);

  const fetchGiftcards = useCallback(async () => {
    try {
      setError(null);
      const data = await getGiftcards();
      setGiftcards(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load giftcards");
    }
  }, []);

  useEffect(() => {
    fetchGiftcards();
  }, [fetchGiftcards]);

  /* ---------------- Sell States ---------------- */
  const [mode, setMode] = useState("physical");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [code, setCode] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [agree, setAgree] = useState(false);

  /* ---------------- Selected Brand ---------------- */
  const selectedCategory = useMemo(() => {
    return giftcards?.find((c) => String(c.id) === String(category));
  }, [giftcards, category]);

  /* ---------------- Selected Variant ---------------- */
  const selectedSub = useMemo(() => {
    return selectedCategory?.sub_categories?.find(
      (s) => String(s.id) === String(subCategory)
    );
  }, [selectedCategory, subCategory]);

  /* ---------------- Calculate Rate ---------------- */
  const receive = useMemo(() => {
    const amt = Number(amount);
    const rate = Number(selectedSub?.rate);

    if (!amt || !rate) return 0;

    return amt * rate;
  }, [amount, selectedSub]);

  const fee = useMemo(() => Math.round(receive * 0.015), [receive]);

  const finalAmount = useMemo(() => {
    return Math.max(receive - fee, 0);
  }, [receive, fee]);

  /* ---------------- Image Upload ---------------- */
  const handleImageChange = (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    if (preview) URL.revokeObjectURL(preview);

    const imageUrl = URL.createObjectURL(file);

    setImage(file);
    setPreview(imageUrl);
  };

  /* Cleanup preview memory */
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  /* ---------------- Reset Form ---------------- */
  const resetForm = () => {
    setCategory("");
    setSubCategory("");
    setAmount("");
    setCode("");
    setImage(null);
    setPreview(null);
    setAgree(false);
    setMode("physical");
  };

  /* ---------------- Submit ---------------- */
const handleSubmit = async (e) => {
  e?.preventDefault();

  if (!category) {
    alert("Select gift card brand");
    throw new Error("Brand required");
  }

  if (!subCategory) {
    alert("Select sub-category");
    throw new Error("Sub-category required");
  }

  if (!amount) {
    alert("Enter card amount");
    throw new Error("Amount required");
  }

  if (mode === "physical" && !image) {
    alert("Upload card image");
    throw new Error("Image required");
  }

  if (mode === "ecode" && !code.trim()) {
    alert("Enter gift card code");
    throw new Error("Code required");
  }

  if (!agree) {
    alert("Accept terms");
    throw new Error("Terms not accepted");
  }

  try {
    const formData = new FormData();

    formData.append("mode", mode);
    formData.append("brand_id", category);
    formData.append("sub_category_id", subCategory);
    formData.append("amount", amount);

    if (mode === "ecode") {
      formData.append("code", code);
    }

    if (mode === "physical" && image) {
      formData.append("image", image);
    }

    const result = await tradeCard(formData);

    return {
      success: true,
      message: "Trade submitted",
      data: result
    };

  } catch (error) {
    throw new Error(error?.message || "Trade failed");
  }
};

  return {
    giftcards,
    error,
    refetch: fetchGiftcards,

    mode,
    setMode,

    category,
    setCategory,

    subCategory,
    setSubCategory,

    amount,
    setAmount,

    code,
    setCode,

    image,
    preview,
    handleImageChange,

    agree,
    setAgree,

    selectedCategory,
    selectedSub,

    receive,
    fee,
    finalAmount,

    handleSubmit,
    resetForm
  };
};