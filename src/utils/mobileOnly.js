"use client";
import { useEffect, useState } from "react";

export function blockLargeDevices(maxWidth = 768) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);

    const check = () => setIsBlocked(window.innerWidth > maxWidth);

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [maxWidth]);

  // IMPORTANT:
  // During SSR + first hydration → always behave as NOT blocked
  // so markup matches server HTML
  if (!hydrated) return false;

  return isBlocked;
}