"use client";
import { createContext, useContext, useState } from "react";
import AlertModal from "../app/(user)/dashboard/_components/alertModal";

const AlertContext = createContext(null);

export const useAlert = () => useContext(AlertContext);

export default function AlertProvider({ children }) {
  const [alertState, setAlertState] = useState(null);

  const show = (options) =>
    new Promise((resolve) => {
      setAlertState({ ...options, resolve });
    });

  const close = (result = false) => {
    alertState?.resolve(result);
    setAlertState(null);
  };

  const api = {
    success: (message, title = "Success") =>
      show({ type: "success", title, message }),

    error: (message, title = "Error") =>
      show({ type: "error", title, message }),

    warning: (message, title = "Warning") =>
      show({ type: "warning", title, message }),

    confirm: (message, title = "Are you sure?") =>
      show({ type: "confirm", title, message }),
  };

  return (
    <AlertContext.Provider value={api}>
      {children}
      {alertState && <AlertModal {...alertState} onClose={close} />}
    </AlertContext.Provider>
  );
}