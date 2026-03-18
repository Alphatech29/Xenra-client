import { useState, useEffect, useMemo } from "react";
import { getUserReferrals } from "../lib/referral";

export const useUserReferrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const response = await getUserReferrals();

        setReferrals(response?.data || []);
        setTotal(response?.total || 0);

      } catch (err) {
        setError(err?.message || "Failed to load referrals");
      }
    };

    fetchReferrals();
  }, []);

  const { paidCount, pendingCount, totalEarned } = useMemo(() => {
    let paidCount = 0;
    let pendingCount = 0;
    let totalEarned = 0;

    referrals.forEach((ref) => {
      const amount = Number(ref.reward_amount || 0);

      if (ref.reward_status === "paid") {
        paidCount += 1;
        totalEarned += amount;
      }

      if (ref.reward_status === "pending") {
        pendingCount += 1;
      }
    });

    return { paidCount, pendingCount, totalEarned };
  }, [referrals]);

  return {
    referrals,
    total,
    paidCount,
    pendingCount,
    totalEarned,
    error,
  };
};