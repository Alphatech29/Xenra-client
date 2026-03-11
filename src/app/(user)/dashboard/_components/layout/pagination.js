"use client";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const delta = 1;

    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push("...");

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pages = getPages();

  const changePage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    onPageChange(page);

    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full mt-8 flex items-center justify-center gap-2">

      {/* Prev */}
      <button
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-white/10 bg-white/5 hover:bg-primary-300/50 disabled:opacity-40"
      >
        Prev
      </button>

      {/* Scrollable page numbers */}
      <div className="flex items-center gap-2 overflow-x-auto max-w-[60vw] px-1">
        {pages.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="shrink-0 px-2 text-gray-400 text-sm"
            >
              ...
            </span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => changePage(page)}
              className={`shrink-0 px-3 py-2 text-xs sm:text-sm rounded-lg transition
                ${
                  page === currentPage
                    ? "bg-primary-400 text-white"
                    : "bg-white/5 border border-white/10 hover:bg-primary-300/50"
                }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next */}
      <button
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-white/10 bg-white/5 hover:bg-primary-300/50 disabled:opacity-40"
      >
        Next
      </button>

    </div>
  );
}