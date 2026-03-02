"use client";
import { useEffect, useState } from "react";

export default function HydrationProvider({ children }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Do NOT render a placeholder element
  // Returning null keeps server & client DOM identical
  if (!hydrated) return null;

  return <>{children}</>;
}