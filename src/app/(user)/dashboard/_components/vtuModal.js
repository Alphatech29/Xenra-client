"use client";
import { useEffect, useState } from "react";

export default function BottomSheet({
  open,
  onClose,
  children,
  title,
  maxWidth = "max-w-md",
}) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose?.();
    }, 220);
  };

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-primary-1100/60 backdrop-blur-sm z-9999 flex items-end justify-center"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${maxWidth} bg-[#00104b] rounded-t-3xl border-t border-slate-800 p-6 space-y-4
        ${closing ? "animate-slideDown" : "animate-slideUp"}`}
      >
        {/* drag indicator */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-2" />

        {title && (
          <h3 className="text-lg font-semibold text-center">{title}</h3>
        )}

        {children}
      </div>
    </div>
  );
}