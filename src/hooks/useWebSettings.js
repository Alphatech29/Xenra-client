import { useState, useEffect } from "react";
import { getWebSettings } from "../lib/settings";

export const useWebSettings = () => {
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    try {
      const data = await getWebSettings();
      setSettings(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load settings");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    error,
    refetch: fetchSettings,
  };
};