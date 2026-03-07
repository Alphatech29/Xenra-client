"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from "lucide-react";

export default function AlertModal({
  type = "success",
  title = "Notification",
  message = "",
  onClose = () => {},
}) {

  const config = {
    success: {
      icon: <CheckCircle2 className="w-12 h-12 text-green-500" />,
      button: "bg-primary-500 hover:bg-primary-700 focus:ring-primary-400",
    },
    error: {
      icon: <XCircle className="w-12 h-12 text-red-500" />,
      button: "bg-red-600 hover:bg-red-700 focus:ring-red-400",
    },
    warning: {
      icon: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
      button: "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400",
    },
    confirm: {
      icon: <HelpCircle className="w-12 h-12 text-blue-500" />,
      button: "bg-primary-600 hover:bg-primary-700 focus:ring-blue-400",
    },
  };

  const ui = config[type] || config.success;

  // Close with ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose(false);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-primary-950/45 backdrop-blur-sm px-4"
      onClick={() => onClose(false)}
    >
      <div
        className="bg-[#001252] text-white w-full max-w-md rounded-2xl p-6 shadow-xl transform transition-all duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center gap-4">

          {ui.icon}

          <h2 className="text-xl font-semibold">
            {title}
          </h2>

          {message && (
            <p className="text-gray-300 text-sm leading-relaxed">
              {message}
            </p>
          )}

          {type === "confirm" ? (
            <div className="flex gap-3 mt-4 w-full">
              <button
                onClick={() => onClose(false)}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 py-2.5 rounded-lg transition"
              >
                Cancel
              </button>

              <button
                onClick={() => onClose(true)}
                className={`flex-1 ${ui.button} py-2.5 rounded-lg transition focus:ring-2`}
              >
                Yes
              </button>
            </div>
          ) : (
            <button
              onClick={() => onClose(true)}
              className={`mt-4 w-full ${ui.button} py-2.5 rounded-lg transition focus:ring-2`}
            >
              OK
            </button>
          )}

        </div>
      </div>
    </div>
  );
}