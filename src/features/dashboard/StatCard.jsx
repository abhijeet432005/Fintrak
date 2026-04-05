import { formatAmount } from "../../utils/financeUtils";
import { MagicCard } from "../../components/magicCard/MagicCard";

const StatCardSkeleton = () => (
  <div className="rounded-2xl p-5 border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03]">
    <div className="flex items-center justify-between mb-4">
      <div className="h-3 w-20 rounded-full bg-zinc-200 dark:bg-white/10 animate-pulse" />
      <div className="w-9 h-9 rounded-xl bg-zinc-200 dark:bg-white/10 animate-pulse" />
    </div>
    <div className="h-7 w-32 rounded-full bg-zinc-200 dark:bg-white/10 animate-pulse mb-2" />
    <div className="h-3 w-16 rounded-full bg-zinc-100 dark:bg-white/[0.05] animate-pulse" />
  </div>
);

const StatCard = ({ label, amount, icon, accent, isLoading }) => {
  if (isLoading) return <StatCardSkeleton />;

  const isNegative = amount < 0;

  return (
    <MagicCard>
      <div className="rounded-2xl p-5 border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] hover:border-zinc-300 dark:hover:border-white/[0.14] transition-all duration-200">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-medium text-zinc-500 dark:text-white/35 tracking-wide uppercase">
            {label}
          </p>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${accent}`}
          >
            {icon}
          </div>
        </div>

        <p
          className={`text-2xl font-semibold tabular-nums ${isNegative ? "text-rose-600 dark:text-rose-400" : "text-zinc-800 dark:text-white/85"}`}
        >
          {isNegative ? "−" : ""}
          {formatAmount(Math.abs(amount))}
        </p>

        <p className="text-xs text-zinc-400 dark:text-white/25 mt-1.5">
          {label === "Total Balance" &&
            "Net balance reflecting income and expenses"}
          {label === "Total Income" && "Aggregate income from all sources"}
          {label === "Total Expenditure" &&
            "Cumulative spending across categories"}
        </p>
      </div>
    </MagicCard>
  );
};

export { StatCardSkeleton };
export default StatCard;
