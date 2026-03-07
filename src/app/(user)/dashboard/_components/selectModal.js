"use client";

import { Search } from "lucide-react";

export default function SelectModal({
  open,
  setOpen,
  title,
  data = [],
  selectedId,
  onSelect,
  search,
  setSearch,
  showLogo,
  brandLogo,
}) {
  if (!open) return null;

  const filtered = data?.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 bg-primary-1100/70 backdrop-blur-sm flex items-center justify-center z-9999 p-4"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-primary-950 w-full max-w-md min-h-60 max-h-[80vh] rounded-2xl border border-silver-900/40 shadow-xl flex flex-col"
      >
        {/* HEADER */}
        <div className="p-5 border-b border-silver-900/40">
          <h3 className="font-semibold mb-3">{title}</h3>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-silver-400" size={16} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
              className="w-full pl-9 bg-primary-1200 border border-silver-900/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* LIST */}
        <div className="overflow-y-auto p-3 space-y-1">
          {filtered?.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSelect(item);
                setSearch("");
                setOpen(false);
              }}
              className="w-full flex justify-between items-start px-4 py-3 rounded-lg hover:bg-primary-900/40 transition"
            >
              <div className="flex items-start gap-3">
                {showLogo && (item.logo || brandLogo) && (
                  <img
                    src={item.logo || brandLogo}
                    alt={item.name}
                    className="w-8 h-8 rounded-full object-contain bg-white/80 p-1"
                  />
                )}

                <div className="flex flex-col text-left">
                  <span className="font-medium">
                    {item.name}
                    {item.country &&
                      ` - ${
                        item.country.charAt(0).toUpperCase() +
                        item.country.slice(1)
                      }`}
                  </span>

                  {item.rate && (
                    <span className="text-sm text-silver-400 mt-1">
                      {item.card_type} • {item.country} • Rate: ₦{item.rate}/1
                      {item.currency}
                    </span>
                  )}
                </div>
              </div>

              {selectedId === item.id && (
                <span className="text-primary-300 text-xs">Selected</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}