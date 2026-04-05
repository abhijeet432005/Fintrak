const PaginationButton = ({ children, active, disabled, onClick }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-150
      ${
        active
          ? "bg-gray-800 text-white dark:bg-white/[0.12] dark:text-white"
          : "text-gray-500 hover:text-gray-800 hover:bg-gray-200 dark:text-white/35 dark:hover:text-white/75 dark:hover:bg-white/[0.06]"
      }
      ${disabled ? "opacity-25 cursor-not-allowed pointer-events-none" : ""}`}
  >
    {children}
  </button>
);

const getPageNumbers = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3)
    return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
};

const Pagination = ({ current, total, onChange }) => {
  if (total <= 1) return null;

  const pages = getPageNumbers(current, total);

  return (
    <div className="flex items-center gap-0.5">
      <PaginationButton
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
      >
        ‹
      </PaginationButton>

      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="w-8 h-8 flex items-center justify-center 
            text-gray-300 dark:text-white/15 text-xs"
          >
            ···
          </span>
        ) : (
          <PaginationButton
            key={p}
            active={p === current}
            onClick={() => onChange(p)}
          >
            {p}
          </PaginationButton>
        ),
      )}

      <PaginationButton
        disabled={current === total}
        onClick={() => onChange(current + 1)}
      >
        ›
      </PaginationButton>
    </div>
  );
};

export default Pagination;