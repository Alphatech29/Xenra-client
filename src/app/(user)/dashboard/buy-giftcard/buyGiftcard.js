"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                                DATA SOURCE                                 */
/* -------------------------------------------------------------------------- */

const GIFT_CARDS = [
  { id: 1, name: "Amazon", img: "https://img.icons8.com/color/200/amazon.png" },
  { id: 2, name: "Apple", img: "https://img.icons8.com/color/200/apple-logo.png" },
  { id: 3, name: "Steam", img: "https://img.icons8.com/color/200/steam.png" },
  { id: 4, name: "Google Play", img: "https://img.icons8.com/color/200/google-play.png" },
  { id: 5, name: "Razer Gold", img: "https://img.icons8.com/color/200/razer.png" },
  { id: 6, name: "Xbox", img: "https://img.icons8.com/color/200/xbox.png" },
  { id: 7, name: "PlayStation", img: "https://img.icons8.com/color/200/play-station.png" },
  { id: 8, name: "Netflix", img: "https://img.icons8.com/color/200/netflix.png" },
];

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function GiftCardList({ onSelect }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const router = useRouter();

  const handleSelect = (card) => {
    setSelectedCard(card.id);
    onSelect?.(card);

    // navigate using id
    setTimeout(() => {
      router.push(`/dashboard/buy-giftcard/${card.id}`);
    }, 200);
  };

  return (
    <div className="w-full px-3 py-5 pb-32">
      {/* Header */}
      <header className="mb-5">
        <h2 className="text-xl font-bold tracking-tight">
          Choose Gift Card
        </h2>
        <p className="mt-1 text-silver-500">
          Select the brand you want to purchase
        </p>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-2">
        {GIFT_CARDS.map((card) => {
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
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              CARD COMPONENT                                */
/* -------------------------------------------------------------------------- */

function CardItem({ card, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        relative group rounded-2xl p-5 text-center
        backdrop-blur-xl transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-black/40
        ${active ? activeStyles : inactiveStyles}
      `}
    >
      {active && (
        <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-black shadow">
          ✓
        </div>
      )}

      <div className="mb-4 flex justify-center">
        <div className="relative h-20 w-20">
          <Image
            src={card.img}
            alt={card.name}
            fill
            unoptimized
            sizes="80px"
            className={`object-contain transition-transform duration-300 ${
              !active ? "group-hover:scale-110" : ""
            }`}
          />
        </div>
      </div>

      <h4
        className={`text-lg font-semibold ${
          active ? "text-white" : "text-gray-900 dark:text-gray-100"
        }`}
      >
        {card.name}
      </h4>

      <p
        className={`mt-1 text-sm ${
          active ? "text-gray-300" : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {active ? "Selected" : "Tap to choose"}
      </p>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  STYLES                                    */
/* -------------------------------------------------------------------------- */

const activeStyles =
  "bg-linear-to-br from-primary-500 to-primary-900 text-white scale-[1.04]";

const inactiveStyles = "bg-white/5";