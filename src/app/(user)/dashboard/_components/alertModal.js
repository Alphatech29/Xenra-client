"use client";
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from "lucide-react";

export default function AlertModal({
  type,
  title,
  message,
  onClose,
}) {
  const config = {
    success: {
      icon: <CheckCircle2 className="w-12 h-12 text-green-500" />,
      button: "bg-green-600 hover:bg-green-700",
    },
    error: {
      icon: <XCircle className="w-12 h-12 text-red-500" />,
      button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      icon: <AlertTriangle className="w-12 h-12 text-yellow-500" />,
      button: "bg-yellow-500 hover:bg-yellow-600",
    },
    confirm: {
      icon: <HelpCircle className="w-12 h-12 text-blue-500" />,
      button: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const ui = config[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-zinc-900 text-white w-[90%] max-w-md rounded-2xl p-6 animate-scaleIn shadow-xl">
        
        <div className="flex flex-col items-center text-center gap-4">
          {ui.icon}

          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-gray-300">{message}</p>

          {type === "confirm" ? (
            <div className="flex gap-3 mt-4 w-full">
              <button
                onClick={() => onClose(false)}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => onClose(true)}
                className={`flex-1 ${ui.button} py-2 rounded-lg`}
              >
                Yes
              </button>
            </div>
          ) : (
            <button
              onClick={() => onClose(true)}
              className={`mt-4 w-full ${ui.button} py-2 rounded-lg`}
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}