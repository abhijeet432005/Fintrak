const ErrorState = ({ error }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
    
    {/* Icon */}
    <div className="w-14 h-14 rounded-2xl 
      bg-rose-100 dark:bg-rose-500/10 
      border border-rose-300 dark:border-rose-500/20 
      flex items-center justify-center text-2xl"
    >
      ⚠️
    </div>

    {/* Title */}
    <p className="text-gray-700 dark:text-white/60 text-sm font-medium">
      Failed to load transactions
    </p>

    {/* Message */}
    <p className="text-gray-500 dark:text-white/25 text-xs">
      {typeof error === "string"
        ? error
        : "Something went wrong. Please try again."}
    </p>

  </div>
);

export default ErrorState;