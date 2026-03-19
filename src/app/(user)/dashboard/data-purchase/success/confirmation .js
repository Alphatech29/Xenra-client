"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Home, Download, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useRef } from "react";

/* ---------------- FORMAT MONEY ---------------- */
const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  });

export default function DataSuccessPage() {
  const params = useSearchParams();

  const receiptRef = useRef(null);
  const printRef = useRef(null);

  /* -------- GET PARAMS -------- */
  const network = params.get("network") || "Mobile Network";
  const phone = params.get("phone") || "-";
  const plan = params.get("plan") || "1GB SME";
  const validity = params.get("validity") || "30 Days";
  const size = params.get("size") || "1GB";
  const paid = Number(params.get("paid") || 0);
  const ref = params.get("ref") || "TXN" + Date.now().toString().slice(-8);

  /* ---------------- PDF DOWNLOAD ---------------- */
  const downloadReceipt = async () => {
    const element = printRef.current;

    const canvas = await html2canvas(element, {
      backgroundColor: "#020617",
      scale: 3,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [460, 720],
    });

    pdf.addImage(imgData, "PNG", 0, 0, 460, 720);
    pdf.save(`data-receipt-${ref}.pdf`);
  };

  /* ---------------- SHARE ---------------- */
  const shareReceipt = async () => {
    const text = `Data Purchase Successful
Network: ${network}
Number: ${phone}
Plan: ${plan} (${size})
Validity: ${validity}
Amount: ${formatCurrency(paid)}
Ref: ${ref}`;

    if (navigator.share) {
      await navigator.share({ title: "Data Receipt", text });
    } else {
      await navigator.clipboard.writeText(text);
      alert("Receipt copied to clipboard");
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-[#000b3a] text-white flex justify-center items-center px-4 py-5">
      <div className="w-full max-w-md space-y-4">

        {/* SUCCESS ANIMATION */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <motion.svg viewBox="0 0 100 100" className="w-28 h-28">
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="#3b82f6"
                strokeWidth="6"
                fill="transparent"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8 }}
              />
              <motion.path
                d="M30 52 L45 65 L70 38"
                stroke="#60a5fa"
                strokeWidth="6"
                fill="transparent"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              />
            </motion.svg>
          </div>

          <h1 className="text-2xl font-semibold text-blue-400">
            Data Activated
          </h1>
          <p className="text-slate-400 text-sm">
            Your internet bundle is ready 🚀
          </p>
        </div>

        {/* RECEIPT PREVIEW */}
        <div
          ref={receiptRef}
          className="rounded-3xl bg-white/4 backdrop-blur-xl border border-white/10 p-6 space-y-4"
        >
          <div className="text-center">
            <p className="text-xs text-slate-400">Activated Bundle</p>
            <p className="text-4xl font-bold text-blue-400">{size}</p>
            <p className="text-sm text-slate-400 mt-1">
              Cost: {formatCurrency(paid)}
            </p>
          </div>

          <div className="border-t border-dashed border-white/10 pt-4 space-y-3 text-sm">
            <Row label="Network" value={network} />
            <Row label="Phone Number" value={phone} />
            <Row label="Data Plan" value={plan} />
            <Row label="Validity" value={validity} />
            <Row label="Transaction ID" value={ref} mono />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={downloadReceipt}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 transition"
          >
            <Download size={18}/> Download
          </button>

          <button
            onClick={shareReceipt}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            <Share2 size={18}/> Share
          </button>
        </div>

        <Link
          href="/dashboard"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition"
        >
          <Home size={18}/> Back to Dashboard
        </Link>
      </div>

      {/* ---------- PDF RECEIPT ---------- */}
      <div className="fixed -left-2499.75 top-0">
        <div
          ref={printRef}
          className="w-115 bg-[#020617] text-white rounded-[28px] overflow-hidden border border-white/10"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-7">
            <p className="text-xs uppercase tracking-widest text-blue-100/70">
              Payment Receipt
            </p>
            <h2 className="text-2xl font-bold mt-1">Data Purchase</h2>
            <p className="text-xs text-blue-100/70 mt-2">
              {new Date().toLocaleString()}
            </p>
          </div>

          <div className="p-8 text-center">
            <p className="text-sm text-slate-400">Activated Bundle</p>
            <p className="text-5xl font-bold text-blue-400">{size}</p>

            <div className="mt-3 inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
              SUCCESSFUL
            </div>

            <div className="grid grid-cols-2 gap-y-5 text-sm border-t border-white/10 pt-6 mt-6 text-left">
              <PrintItem label="Network" value={network} />
              <PrintItem label="Phone" value={phone} />
              <PrintItem label="Plan" value={plan} />
              <PrintItem label="Validity" value={validity} />
              <PrintItem label="Amount Paid" value={formatCurrency(paid)} />
              <PrintItem label="Reference" value={ref} mono />
            </div>
          </div>

          <div className="px-8 py-6 bg-white/3 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400">
              This data bundle has been activated successfully.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------- ROW COMPONENT -------- */
function Row({ label, value, mono }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-400">{label}</span>
      <span className={`${mono ? "font-mono text-xs" : "font-medium"}`}>
        {value || "-"}
      </span>
    </div>
  );
}

/* -------- PRINT ROW -------- */
function PrintItem({ label, value, mono }) {
  return (
    <div className="flex flex-col">
      <span className="text-slate-500 text-xs">{label}</span>
      <span className={`${mono ? "font-mono text-xs" : "font-semibold"}`}>
        {value || "-"}
      </span>
    </div>
  );
}
