"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { countries } from "../../utils/countries";

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
  const [search, setSearch] = useState("");

  /* Default country = Nigeria */
  const [country, setCountry] = useState(() => {
    return countries?.find((c) => c.iso === "NG") || countries?.[0] || null;
  });

  /* Lock body scroll when modal opens */
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = open ? "hidden" : "";
    }

    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, [open]);

  /* Filter countries */
  const filteredCountries = useMemo(() => {
    if (!search) return countries;

    const q = search.toLowerCase();

    return countries.filter((c) => {
      return (
        c?.name?.toLowerCase().includes(q) ||
        c?.iso?.toLowerCase().includes(q) ||
        c?.dial?.includes(q)
      );
    });
  }, [search]);

  const inputType = showToggle ? (show ? "text" : "password") : type;

  /* Strip dial code from display */
  const displayValue = useMemo(() => {
    if (type !== "phone" || !country) return value ?? "";

    const dialPrefix = country?.dial;

    if (typeof value === "string" && dialPrefix && value.startsWith(dialPrefix)) {
      return value.slice(dialPrefix.length);
    }

    return value ?? "";
  }, [type, value, country]);

  const handleChange = (e) => {
    if (!onChange) return;

    let raw = e.target.value;

    if (type === "phone") {
      if (!country?.dial) return;

      /* Keep only digits */
      raw = raw.replace(/\D/g, "");

      if (!raw) {
        onChange(name, "");
        return;
      }

      onChange(name, `${country.dial}${raw}`);
    } else {
      onChange(name, raw);
    }
  };

  const selectCountry = (c) => {
    setCountry(c);
    setOpen(false);
    setSearch("");

    /* Clear phone value when country changes */
    if (type === "phone" && onChange) {
      onChange(name, "");
    }
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
          inputMode={type === "phone" ? "numeric" : undefined}
          pattern={type === "phone" ? "[0-9]*" : undefined}
          maxLength={type === "phone" ? 12 : undefined}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm outline-none transition
          focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30
          ${type === "phone" ? "pl-20 pr-4" : "px-4 pr-12"}`}
        />

        {/* Country selector */}
        {type === "phone" && country && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-white/10"
          >
            <Image
              src={country.flag}
              alt={country.iso}
              width={26}
              height={18}
              className="rounded-sm object-cover"
              unoptimized
            />

            <svg
              className="h-3 w-3 text-white/50"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 7l5 5 5-5H5z" />
            </svg>
          </button>
        )}

        {/* Password toggle */}
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

      {/* Country picker modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-[92%] max-w-md rounded-2xl border border-white/10 bg-[#00104b] shadow-[0_20px_80px_rgba(0,0,0,0.9)]">

            {/* Header */}
            <div className="border-b border-white/10 p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-white/80">
                  Select Country
                </span>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-white/60 hover:text-white"
                >
                  ×
                </button>
              </div>

              <input
                placeholder="Search country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan-400"
              />
            </div>

            {/* Country list */}
            <div className="max-h-[60vh] overflow-y-auto">
              {filteredCountries.map((c) => {
                const active = country?.iso === c.iso;

                return (
                  <button
                    key={c.iso}
                    type="button"
                    onClick={() => selectCountry(c)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition
                    ${active ? "bg-cyan-500/10" : "hover:bg-white/5"}`}
                  >
                    <Image
                      src={c.flag}
                      alt={c.iso}
                      width={26}
                      height={18}
                      className="rounded-sm"
                      unoptimized
                    />

                    <span className="flex-1 text-left text-white/90">
                      {c.name}
                    </span>

                    <span className="text-white/50">
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