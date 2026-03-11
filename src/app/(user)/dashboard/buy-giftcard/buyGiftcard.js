"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useProducts } from "../../../../hooks/useProducts";
import Pagination from "../_components/layout/pagination";
import SelectModal from "../_components/selectModal";

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function GiftCardList({ onSelect }) {
  const router = useRouter();
  const { products, error } = useProducts();

  const [selectedCard, setSelectedCard] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [category, setCategory] = useState("all");
  const [country, setCountry] = useState("all");

  const [openCategory, setOpenCategory] = useState(false);
  const [openCountry, setOpenCountry] = useState(false);

  const [categorySearch, setCategorySearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");

  const ITEMS_PER_PAGE = 100;

  /* -------------------------------------------------------------------------- */
  /*                           CATEGORY LIST                                    */
  /* -------------------------------------------------------------------------- */

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((p) => p.category))];

    return [
      { id: "all", name: "All Categories" },
      ...unique.map((c) => ({
        id: c,
        name: c,
      })),
    ];
  }, [products]);

  /* -------------------------------------------------------------------------- */
  /*                           COUNTRY LIST (FLAG + NAME)                      */
  /* -------------------------------------------------------------------------- */

  const countries = useMemo(() => {
    const map = new Map();

    products.forEach((p) => {
      if (!map.has(p.country)) {
        map.set(p.country, {
          id: p.country,
          name: p.countryName,
          logo: p.flag,
        });
      }
    });

    return [
      { id: "all", name: "All Countries", logo: null },
      ...Array.from(map.values()),
    ];
  }, [products]);

  /* -------------------------------------------------------------------------- */
  /*                            FILTER PRODUCTS                                 */
  /* -------------------------------------------------------------------------- */

  const filteredCards = useMemo(() => {
    return products.filter((card) => {
      const matchesSearch = card.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "all" || card.category === category;

      const matchesCountry =
        country === "all" || card.country === country;

      return matchesSearch && matchesCategory && matchesCountry;
    });
  }, [products, search, category, country]);

  /* -------------------------------------------------------------------------- */
  /*                             PAGINATION                                     */
  /* -------------------------------------------------------------------------- */

  const totalPages = Math.ceil(filteredCards.length / ITEMS_PER_PAGE);

  const paginatedCards = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    return filteredCards.slice(start, end);
  }, [filteredCards, page]);

  /* -------------------------------------------------------------------------- */
  /*                              SELECT CARD                                   */
  /* -------------------------------------------------------------------------- */

  const handleSelect = (card) => {
    setSelectedCard(card.id);

    onSelect?.(card);

    setTimeout(() => {
      router.push(`/dashboard/buy-giftcard/${card.id}`);
    }, 200);
  };

  if (error) {
    return (
      <div className="text-center py-10 text-red-400">
        {error}
      </div>
    );
  }

  const isLoading = products.length === 0;

  const selectedCategory =
    categories.find((c) => c.id === category)?.name || "Category";

  const selectedCountryData =
    countries.find((c) => c.id === country) || {};

  const selectedCountry = selectedCountryData.name || "Country";
  const selectedFlag = selectedCountryData.logo || null;

  return (
    <div className="w-full px-4 py-5 pb-32">

      {/* HEADER */}
      <header className="mb-6">
        <h2 className="text-xl font-bold tracking-tight">
          Choose Gift Card
        </h2>

        <p className="mt-1 text-silver-300">
          Select the brand you want to purchase
        </p>
      </header>

      {/* FILTERS */}
      <div className="flex gap-3 flex-wrap">

        {/* SEARCH */}
        <div className="flex-1 min-w-full">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
          />
        </div>

        {/* CATEGORY */}
        <button
          onClick={() => setOpenCategory(true)}
          className="px-4 py-3 rounded-xl bg-white/5 w-43.25 border border-white/10 text-sm flex items-center gap-2 hover:bg-white/10"
        >
          {selectedCategory}
        </button>

        {/* COUNTRY */}
        <button
          onClick={() => setOpenCountry(true)}
          className="px-4 py-3 rounded-xl bg-white/5 border w-43.25 border-white/10 text-sm flex items-center gap-2 hover:bg-white/10"
        >
          {selectedFlag && (
            <img
              src={selectedFlag}
              alt="flag"
              className="w-5 h-5 rounded-sm"
            />
          )}

          {selectedCountry}
        </button>

      </div>

      {/* LOADING */}
      {isLoading ? (
        <SkeletonGrid />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mt-5">

            {paginatedCards.length === 0 && <EmptyState />}

            {paginatedCards.map((card) => {
              const isActive = selectedCard === card.id;

              return (
                <CardItem
                  key={card.id}
                  card={card}
                  active={isActive}
                  onClick={() => handleSelect(card)}
                />
              );
            })}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {/* CATEGORY MODAL */}
      <SelectModal
        open={openCategory}
        setOpen={setOpenCategory}
        title="Category"
        data={categories}
        selectedId={category}
        onSelect={(item) => {
          setCategory(item.id);
          setPage(1);
        }}
        search={categorySearch}
        setSearch={setCategorySearch}
      />

      {/* COUNTRY MODAL */}
      <SelectModal
        open={openCountry}
        setOpen={setOpenCountry}
        title="Country"
        data={countries}
        selectedId={country}
        onSelect={(item) => {
          setCountry(item.id);
          setPage(1);
        }}
        search={countrySearch}
        setSearch={setCountrySearch}
        showLogo
      />

    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               SEARCH INPUT                                 */
/* -------------------------------------------------------------------------- */

function SearchInput({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search gift card..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-primary-500 transition"
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                              CARD COMPONENT                                */
/* -------------------------------------------------------------------------- */

function CardItem({ card, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative group flex flex-col items-center justify-center
      rounded-2xl border p-3 transition-all duration-300
      ${
        active
          ? "border-primary-500 bg-primary-500/10 scale-[1.03]"
          : "border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >

      {active && (
        <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-white text-xs">
          ✓
        </div>
      )}

      <div
        className={`relative flex items-center justify-center
        h-20 w-20 rounded-xl mb-3 transition-all
        ${
          active
            ? "bg-white/20"
            : "bg-white/10 group-hover:bg-white/20"
        }`}
      >
        <Image
          src={card.img}
          alt={card.name}
          fill
          unoptimized
          sizes="80px"
          className="object-contain p-2"
        />
      </div>

      <h4
        className={`text-sm font-semibold text-center leading-tight
        ${active ? "text-white" : "text-gray-200"}`}
      >
        {card.name}
      </h4>

    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                               SKELETON GRID                                */
/* -------------------------------------------------------------------------- */

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 mt-5">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl p-4 bg-white/5 animate-pulse flex flex-col items-center"
        >
          <div className="w-20 h-20 rounded-xl bg-gray-300/20 mb-3"></div>
          <div className="h-4 bg-gray-300/20 rounded w-24 mb-2"></div>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               EMPTY STATE                                  */
/* -------------------------------------------------------------------------- */

function EmptyState() {
  return (
    <div className="col-span-2 text-center py-10 text-gray-400">
      No gift card found
    </div>
  );
}