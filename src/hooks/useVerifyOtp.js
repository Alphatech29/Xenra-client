"use client";

import { useState, useCallback } from "react";
import { verifyOtp, getOtpExpireTime, resendOtp } from "../lib/verifyEmail";

export const useVerifyOtp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState(null);

  const verify = useCallback(async (email, otp) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);

    try {
      const res = await verifyOtp(email, otp);

      setSuccess(true);
      setMessage(res.message);

      return res;
    } catch (err) {
      setError(err.message || "OTP verification failed");
      setSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    verify,
    loading,
    error,
    success,
    message,
  };
};

export const useOtpExpireTime = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expireData, setExpireData] = useState(null);

  const fetchExpireTime = useCallback(async (email) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getOtpExpireTime(email);

      setExpireData(res);
      return res;

    } catch (err) {
      setError(err.message || "Failed to fetch OTP expiry time");
      throw err;

    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchExpireTime,
    loading,
    error,
    expireData,
  };
};

export const useResendOtp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState(null);

  const resend = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setMessage(null);

    try {
      const res = await resendOtp(email);

      setSuccess(true);
      setMessage(res.message);

      return res;

    } catch (err) {
      setError(err.message || "Failed to resend OTP");
      setSuccess(false);
      throw err;

    } finally {
      setLoading(false);
    }
  }, []);

  return {
    resend,
    loading,
    error,
    success,
    message,
  };
};