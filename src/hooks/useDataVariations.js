import { useState, useEffect } from "react";
import { getDataVariations } from "../lib/dataVariations";

const normalizeAirtelPlans = (plans = []) => {
  return plans.map((plan) => {
    let name = plan.name;

    name = name.replace(/airtel data\s*-\s*/i, "");
    name = name.replace(/-\s*\d+(\.\d+)?\s?(mb|gb)\b/gi, "");
    name = name.replace(/-\s*\d+\s*day/gi, "");
    name = name.replace(/(\d[\d,]*)\s*naira/gi, "N$1");
    name = name.replace(/-\s*-/g, "-");
    name = name.replace(/\s+/g, " ").trim();

    return { ...plan, name };
  });
};

const normalizeEtisalatPlans = (plans = []) => {
  return plans.map((plan) => {
    let name = plan.name;

    name = name.replace(/t2\s*/i, "");
    name = name.replace(/9mobile\s*/i, "");
    name = name.replace(/(\d+(\.\d+)?)\s?g\b/i, "$1GB");
    name = name.replace(/(\d[\d,]*)\s*naira/gi, "N$1");

    const sizeMatch = name.match(/(\d+(\.\d+)?\s?(mb|gb))/i);
    const size = sizeMatch ? sizeMatch[0].toUpperCase() : "";

    const dayMatch = name.match(/(\d+)\s*day/i);
    const duration = dayMatch
      ? `${dayMatch[1]} Day${dayMatch[1] > 1 ? "s" : ""}`
      : "";

    return {
      ...plan,
      name: `${size} - ${duration} - N${plan.amount}`
        .replace(/\s+/g, " ")
        .trim(),
    };
  });
};

const extractDetails = (plan) => {
  const name = plan.name || "";
  const lower = name.toLowerCase();

  const sizeMatch = name.match(/(\d+(\.\d+)?)(\s?)(gb|mb|tb)/i);
  const speedMatch = name.match(/(\d+)\s*mbps/i);

  const size = sizeMatch
    ? `${sizeMatch[1]}${sizeMatch[4]}`.toUpperCase()
    : null;

  const speed = speedMatch ? `${speedMatch[1]}MBPS` : null;

  let days = null;
  let duration = null;

  const bracket = name.match(/\((\d+)\s*day/i);
  const direct = name.match(/(\d+)\s*day/i);
  const month = name.match(/(\d+)[-\s]?month/i);

  if (bracket) {
    days = parseInt(bracket[1]);
    duration = `${days} Day${days > 1 ? "s" : ""}`;
  } else if (direct) {
    days = parseInt(direct[1]);
    duration = `${days} Day${days > 1 ? "s" : ""}`;
  } else if (month) {
    const m = parseInt(month[1]);
    days = m * 30;
    duration = `${m} Month${m > 1 ? "s" : ""}`;
  } else if (lower.includes("daily")) {
    days = 1;
    duration = "1 Day";
  } else if (lower.includes("weekly")) {
    days = 7;
    duration = "7 Days";
  } else if (lower.includes("monthly")) {
    days = 30;
    duration = "30 Days";
  } else if (lower.includes("year")) {
    days = 365;
    duration = "365 Days";
  }

  const isUnlimitedDisplay = lower.includes("unlimited");

  const hasBonus =
    lower.includes("+") &&
    (lower.includes("youtube") ||
      lower.includes("stream") ||
      lower.includes("night"));

  let category = "other";

  if (lower.includes("router")) category = "router";
  else if (lower.includes("mifi")) category = "mifi";
  else if (lower.includes("odu")) category = "odu";
  else if (
    lower.includes("social plan") &&
    !lower.includes("+") &&
    !lower.includes("youtube")
  ) {
    category = "social";
  } else if (days !== null) {
    if (days <= 2) category = "daily";
    else if (days <= 7) category = "weekly";
    else if (days <= 31) category = "monthly";
    else if (days <= 62) category = "biMonthly";
    else category = "quarterly";
  }

  return {
    ...plan,
    size,
    speed,
    duration,
    category,
    isUnlimitedDisplay,
    hasBonus,
  };
};

const dedupePlans = (plans = []) => {
  const map = new Map();

  plans.forEach((plan) => {
    const key = plan.code;

    if (!map.has(key)) {
      map.set(key, plan);
    } else {
      const existing = map.get(key);
      if (Number(plan.amount) < Number(existing.amount)) {
        map.set(key, plan);
      }
    }
  });

  return Array.from(map.values());
};

const groupPlans = (plans = []) => {
  const groups = {
    social: [],
    daily: [],
    weekly: [],
    monthly: [],
    biMonthly: [],
    quarterly: [],
    router: [],
    mifi: [],
    odu: [],
    other: [],
  };

  plans.forEach((plan) => {
    const enriched = extractDetails(plan);
    groups[enriched.category]?.push(enriched);
  });

  Object.keys(groups).forEach((key) => {
    groups[key].sort((a, b) => a.amount - b.amount);
  });

  return groups;
};

export const useDataVariations = (serviceID) => {
  const [plans, setPlans] = useState([]);
  const [groupedPlans, setGroupedPlans] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serviceID) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setPlans([]);
        setGroupedPlans({});

        let result = await getDataVariations(serviceID);

        if (!isMounted) return;

        if (serviceID === "airtel-data") {
          result = normalizeAirtelPlans(result);
        }

        if (serviceID === "etisalat-data") {
          result = normalizeEtisalatPlans(result);
        }

        const unique = dedupePlans(result);
        const grouped = groupPlans(unique);

        setPlans(unique);
        setGroupedPlans(grouped);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to fetch data plans");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [serviceID]);

  return { plans, groupedPlans, error, loading };
};