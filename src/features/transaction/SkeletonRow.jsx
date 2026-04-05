const SkeletonRow = ({ delay }) => (
  <div className="flex items-center gap-4 px-5 py-4 
    border-b border-gray-200 dark:border-white/[0.04]"
  >
    {/* Avatar */}
    <div
      className="w-10 h-10 rounded-xl 
      bg-gray-200 dark:bg-white/[0.06] 
      animate-pulse shrink-0"
      style={{ animationDelay: `${delay}ms` }}
    />

    {/* Text */}
    <div className="flex-1 flex flex-col gap-2">
      <div
        className="h-3 w-2/5 rounded-full 
        bg-gray-200 dark:bg-white/[0.06] 
        animate-pulse"
        style={{ animationDelay: `${delay + 80}ms` }}
      />
      <div
        className="h-2.5 w-1/4 rounded-full 
        bg-gray-300 dark:bg-white/[0.04] 
        animate-pulse"
        style={{ animationDelay: `${delay + 160}ms` }}
      />
    </div>

    {/* Category */}
    <div
      className="hidden sm:block w-24 h-6 rounded-full 
      bg-gray-200 dark:bg-white/[0.05] 
      animate-pulse"
      style={{ animationDelay: `${delay + 120}ms` }}
    />

    {/* Type */}
    <div
      className="hidden md:block w-20 h-6 rounded-full 
      bg-gray-300 dark:bg-white/[0.04] 
      animate-pulse"
      style={{ animationDelay: `${delay + 180}ms` }}
    />

    {/* Amount */}
    <div
      className="w-20 h-5 rounded-full 
      bg-gray-200 dark:bg-white/[0.06] 
      animate-pulse ml-auto"
      style={{ animationDelay: `${delay + 60}ms` }}
    />
  </div>
)

export default SkeletonRow