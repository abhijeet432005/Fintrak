const EmptyState = ({ hasFilters, onClear }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">

    {/* Icon */}
    <div className="w-16 h-16 rounded-2xl 
      bg-gray-100 dark:bg-white/[0.04] 
      border border-gray-200 dark:border-white/[0.08] 
      flex items-center justify-center text-2xl mb-5"
    >
      {hasFilters ? "🔍" : "📭"}
    </div>

    {/* Title */}
    <p className="text-gray-700 dark:text-white/80 font-medium text-sm mb-1.5">
      {hasFilters ? "No results found" : "No transactions yet"}
    </p>

    {/* Description */}
    <p className="text-gray-500 dark:text-white/30 text-xs max-w-xs leading-relaxed">
      {hasFilters
        ? "Try adjusting your search or clearing the filters."
        : "Your transaction history will appear here once you start tracking activity."}
    </p>

    {/* Button */}
    {hasFilters && (
      <button
        onClick={onClear}
        className="mt-5 px-4 py-2 rounded-xl text-xs font-medium 
        bg-gray-200 text-gray-700 border border-gray-300 
        hover:bg-gray-300 
        dark:bg-white/[0.06] dark:text-white/50 dark:border-white/[0.08] 
        dark:hover:bg-white/[0.10] dark:hover:text-white/80 
        transition-all duration-200"
      >
        Clear filters
      </button>
    )}
  </div>
);

export default EmptyState;