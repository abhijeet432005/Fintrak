import { ArrowRight } from "lucide-react"

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`group text-sm bg-white dark:text-white text-black dark:bg-zinc-900 relative w-auto cursor-pointer overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-700 py-3 px-6 text-center font-semibold ${className}`}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        <div className="bg-zinc-900 dark:bg-white h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-[100.8]" />
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="text-white dark:text-zinc-900 absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
        <span>{children}</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </button>
  )
}