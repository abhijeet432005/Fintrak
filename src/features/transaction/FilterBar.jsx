const Toolbar = ({
  search,
  onSearchChange,
  typeFilter,
  onTypeChange,
  catFilter,
  onCatChange,
  categories,
}) => (
  <div className="px-4 sm:px-5 py-4 
    border-b border-gray-200 dark:border-white/[0.06] 
    flex flex-col sm:flex-row gap-2.5"
  >
    {/* Search */}
    <div className="relative flex-1">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 
        text-gray-400 dark:text-white/25 pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>

      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by name, category, amount…"
        className="w-full pl-8 pr-8 py-2 
        bg-gray-100 dark:bg-white/[0.05] 
        border border-gray-300 dark:border-white/[0.08] 
        rounded-xl text-sm 
        text-gray-700 dark:text-white/75 
        placeholder-gray-400 dark:placeholder-white/20 
        outline-none 
        focus:border-gray-400 dark:focus:border-white/20 
        focus:bg-gray-200 dark:focus:bg-white/[0.07] 
        transition-all duration-200"
      />

      {search && (
        <button
          onClick={() => onSearchChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 
          text-gray-400 hover:text-gray-700 
          dark:text-white/30 dark:hover:text-white/60 
          transition-colors text-base leading-none"
        >
          ×
        </button>
      )}
    </div>

    {/* Filters */}
    <div className="flex gap-2">
      <select
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value)}
        className="px-3 py-2 
        bg-gray-100 dark:bg-white/[0.05] 
        border border-gray-300 dark:border-white/[0.08] 
        rounded-xl text-xs 
        text-gray-700 dark:text-white/50 
        outline-none 
        focus:border-gray-400 dark:focus:border-white/20 
        transition-all duration-200 cursor-pointer"
      >
        <option value="all">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {categories.length > 0 && (
        <select
          value={catFilter}
          onChange={(e) => onCatChange(e.target.value)}
          className="px-3 py-2 
          bg-gray-100 dark:bg-white/[0.05] 
          border border-gray-300 dark:border-white/[0.08] 
          rounded-xl text-xs 
          text-gray-700 dark:text-white/50 
          outline-none 
          focus:border-gray-400 dark:focus:border-white/20 
          transition-all duration-200 cursor-pointer"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      )}
    </div>
  </div>
);

export default Toolbar;