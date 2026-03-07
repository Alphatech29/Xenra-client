"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { countries } from "../../utils/countries";

const detectCountryFromNumber = (input, list) => {
  if (!input.startsWith("+")) return null;
  const sorted = [...list].sort((a, b) => b.dial.length - a.dial.length);
  return sorted.find((c) => input.startsWith(c.dial)) || null;
};

const isNigerianLocal = (num) => /^(070|080|081|090|091)\d{8}$/.test(num);

export default function FormInput({
  label,
  type = "text",
  placeholder,
  showToggle = false,
  name,
  value,
  onChange,
}) {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState(null);

  /* Default country = Nigeria */
  useEffect(() => {
    const nigeria = countries.find((c) => c.iso === "NG") || countries[0];
    setCountry(nigeria);
  }, []);

  /* Lock scroll when modal open */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  const inputType = showToggle ? (show ? "text" : "password") : type;

  const handleChange = (e) => {
    if (!onChange || !country) return;

    let raw = e.target.value.trim();

    if (type === "phone") {
      const detected = detectCountryFromNumber(raw, countries);
      if (detected) {
        setCountry(detected);
        raw = raw.slice(detected.dial.length);
      }

      raw = raw.replace(/\D/g, "");

      if (isNigerianLocal(raw)) {
        const nigeria = countries.find((c) => c.iso === "NG");
        if (nigeria) {
          setCountry(nigeria);
          raw = raw.replace(/^0/, "");
          onChange(name, `${nigeria.dial}${raw}`);
          return;
        }
      }

      onChange(name, `${country.dial}${raw}`);
    } else {
      onChange(name, raw);
    }
  };

  const selectCountry = (c) => {
    setCountry(c);
    setOpen(false);
  };

  return (
    <div className="space-y-2 relative">
      {label && (
        <label className="text-xs uppercase tracking-wider text-white/50">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          name={name}
          type={type === "phone" ? "tel" : inputType}
          value={value ?? ""}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm outline-none transition
          focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30
          ${type === "phone" ? "pl-16 pr-4" : "px-4 pr-12"}`}
        />

        {/* COUNTRY SELECTOR BUTTON */}
        {type === "phone" && country && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-white/10 active:scale-95 transition"
          >
            <Image
              src={country.flag}
              alt={country.iso}
              width={26}
              height={18}
              className="rounded-sm object-cover"
              unoptimized
            />
            <svg className="h-3 w-3 text-white/50" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 7l5 5 5-5H5z" />
            </svg>
          </button>
        )}

        {/* PASSWORD TOGGLE */}
        {showToggle && type !== "phone" && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/60 hover:text-white"
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {/* CENTER MODAL COUNTRY PICKER */}
      {open && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 "
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="relative w-[92%] max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#00104b] shadow-[0_20px_80px_rgba(0,0,0,0.9)] animate-in fade-in zoom-in-95 duration-150">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <span className="text-sm font-medium text-white/80">
                Select Country
              </span>

              <button
                onClick={() => setOpen(false)}
                className="text-white/50 hover:text-white text-lg leading-none"
              >
                ×
              </button>
            </div>

            {/* Country list */}
            <div className="max-h-[60vh] overflow-y-auto py-2">
              {countries.map((c) => {
                const active = country?.iso === c.iso;

                return (
                  <button
                    key={c.iso}
                    type="button"
                    onClick={() => selectCountry(c)}
                    className={`group flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition
                    ${active ? "bg-cyan-500/10" : "hover:bg-white/5 active:scale-[0.99]"}`}
                  >
                    <div className="flex h-7 w-9 items-center justify-center rounded-md bg-white/5">
                      <Image
                        src={c.flag}
                        alt={c.iso}
                        width={26}
                        height={18}
                        className="rounded-sm object-cover"
                        unoptimized
                      />
                    </div>

                    <span className={`flex-1 truncate ${active ? "text-cyan-300" : "text-white/90"}`}>
                      {c.name}
                    </span>

                    <span className={`tabular-nums ${active ? "text-cyan-400" : "text-white/40 group-hover:text-white/70"}`}>
                      {c.dial}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}