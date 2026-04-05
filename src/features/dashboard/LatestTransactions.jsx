import { formatDate, getCategoryConfig, formatAmount } from '../../utils/financeUtils'

const RowSkeleton = ({ delay }) => (
  <div
    className="flex items-center gap-3 py-3 border-b border-zinc-100 dark:border-white/[0.04] animate-pulse"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-9 h-9 rounded-xl bg-zinc-200 dark:bg-white/[0.07] shrink-0" />
    <div className="flex-1 space-y-1.5">
      <div className="h-3 w-2/5 rounded-full bg-zinc-200 dark:bg-white/[0.07]" />
      <div className="h-2.5 w-1/4 rounded-full bg-zinc-100 dark:bg-white/[0.04]" />
    </div>
    <div className="h-3 w-16 rounded-full bg-zinc-200 dark:bg-white/[0.07]" />
  </div>
)

const LatestTransactions = ({ transactions, isLoading, dark, onViewAll }) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl p-5 border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03]">
        <div className="flex items-center justify-between mb-4">
          <div className="h-3 w-32 rounded-full bg-zinc-200 dark:bg-white/10 animate-pulse" />
          <div className="h-3 w-14 rounded-full bg-zinc-100 dark:bg-white/[0.05] animate-pulse" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} delay={i * 60} />)}
      </div>
    )
  }

  return (
    <div className="rounded-2xl p-5 border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-white/75">Latest transactions</h3>
          <p className="text-xs text-zinc-400 dark:text-white/25 mt-0.5">Recent activity</p>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs text-zinc-400 dark:text-white/30 hover:text-zinc-700 dark:hover:text-white/70 transition-colors font-medium"
        >
          View all →
        </button>
      </div>

      <div>
        {transactions.map((t, i) => {
          const cfg = getCategoryConfig(t.category)
          const isIncome = t.type?.toLowerCase() === 'income'

          return (
            <div
              key={t.id ?? i}
              className="flex items-center gap-3 py-3 border-b border-zinc-100 dark:border-white/[0.04] last:border-0 hover:bg-zinc-50 dark:hover:bg-white/[0.02] -mx-2 px-2 rounded-xl transition-colors duration-150 cursor-default"
              style={{ animation: 'txIn 0.3s ease both', animationDelay: `${i * 40}ms` }}
            >
              {/* Icon */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${cfg.light} dark:hidden`}>
                {cfg.icon}
              </div>
              <div className={`w-9 h-9 rounded-xl items-center justify-center text-base shrink-0 ${cfg.dark} hidden dark:flex`}>
                {cfg.icon}
              </div>

              {/* Meta */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-700 dark:text-white/80 truncate leading-snug">
                  {t.description || t.category || 'Untitled'}
                </p>
                <p className="text-xs text-zinc-400 dark:text-white/25 mt-0.5 tabular-nums">{formatDate(t.date)}</p>
              </div>

              {/* Amount */}
              <p className={`text-sm font-semibold tabular-nums shrink-0 ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-700 dark:text-white/70'}`}>
                {isIncome ? '+' : '−'}{formatAmount(t.amount)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LatestTransactions