import { formatAmount } from "../../utils/financeUtils";

const SummaryStrip = ({ totals }) => {
  const net = totals.income - totals.expense;

  return (
    <div className="flex items-center gap-3 px-5 py-2 
      bg-gray-100 dark:bg-white/[0.015] 
      border-b border-gray-200 dark:border-white/[0.04] 
      text-xs"
    >
      <span className="text-emerald-600 dark:text-emerald-400/60 tabular-nums">
        ↑ {formatAmount(totals.income)}
      </span>

      <span className="text-gray-300 dark:text-white/10">·</span>

      <span className="text-rose-600 dark:text-rose-400/60 tabular-nums">
        ↓ {formatAmount(totals.expense)}
      </span>

      <span className="text-gray-300 dark:text-white/10">·</span>

      <span className="text-gray-600 dark:text-white/30">
        Net{" "}
        <span
          className={`tabular-nums ${
            net >= 0
              ? "text-emerald-600 dark:text-emerald-400/60"
              : "text-rose-600 dark:text-rose-400/60"
          }`}
        >
          {net >= 0 ? "+" : "−"}
          {formatAmount(Math.abs(net))}
        </span>
      </span>
    </div>
  );
};

export default SummaryStrip;