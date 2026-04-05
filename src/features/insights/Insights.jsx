import { useMemo } from "react";
import { useSelector } from "react-redux";

const icons = {
  savings: "🏦",
  topSpend: "🛍️",
  streak: "🔥",
  bigIncome: "💸",
  dailyBurn: "📅",
  ratio: "⚖️",
  topIncome: "📊",
  warning: "⚠️",
  celebrate: "🎉",
  trend: "📈",
};

const useInsights = (transactions) =>
  useMemo(() => {
    if (!transactions?.length) return [];

    const expenses = transactions.filter((t) => t.type === "expense");
    const incomes = transactions.filter((t) => t.type === "income");

    if (!expenses.length || !incomes.length) return [];

    const totalIncome = incomes.reduce((s, t) => s + t.amount, 0);
    const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
    const balance = totalIncome - totalExpense;
    const savingsRate =
      totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(0) : 0;

    // Top expense category
    const categoryTotals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    const topCategory = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1],
    )[0];
    const topCategoryPct =
      totalExpense > 0 ? ((topCategory[1] / totalExpense) * 100).toFixed(0) : 0;

    // Top income category
    const incomeCatTotals = incomes.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    const topIncomeSource = Object.entries(incomeCatTotals).sort(
      (a, b) => b[1] - a[1],
    )[0];

    // Biggest single transaction
    const biggestIncome = incomes.reduce(
      (max, t) => (t.amount > max.amount ? t : max),
      incomes[0],
    );

    // Daily average spend
    const dates = expenses.map((t) => t.date).sort();
    const firstDay = new Date(dates[0]);
    const lastDay = new Date(dates[dates.length - 1]);
    const daySpan = Math.max(
      1,
      Math.round((lastDay - firstDay) / 86400000) + 1,
    );
    const dailyAvg = (totalExpense / daySpan).toFixed(0);

    // Expense-to-income ratio
    const ratio =
      totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(0) : 100;

    // Consecutive days with expense (streak)
    const uniqueDays = [...new Set(expenses.map((t) => t.date))].sort();
    let streak = 1,
      maxStreak = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      const diff =
        (new Date(uniqueDays[i]) - new Date(uniqueDays[i - 1])) / 86400000;
      streak = diff === 1 ? streak + 1 : 1;
      maxStreak = Math.max(maxStreak, streak);
    }

    const insights = [
      {
        key: "savings",
        icon: Number(savingsRate) >= 20 ? icons.celebrate : icons.savings,
        text: `You're saving ${savingsRate}% of your income — ${Number(savingsRate) >= 30 ? "excellent discipline!" : Number(savingsRate) >= 15 ? "decent, aim for 30%." : "try to cut expenses."}`,
        color:
          Number(savingsRate) >= 20
            ? "emerald"
            : Number(savingsRate) >= 10
              ? "amber"
              : "rose",
      },
      {
        key: "topSpend",
        icon: icons.topSpend,
        text: `${topCategory[0]} is your biggest spend at ${topCategoryPct}% of total expenses — ₹${topCategory[1].toLocaleString()}.`,
        color: "blue",
      },
      {
        key: "topIncome",
        icon: icons.topIncome,
        text: `${topIncomeSource[0]} is your primary income source, contributing ₹${topIncomeSource[1].toLocaleString()}.`,
        color: "emerald",
      },
      {
        key: "dailyBurn",
        icon: icons.dailyBurn,
        text: `You spend ₹${Number(dailyAvg).toLocaleString()} per day on average — ₹${(Number(dailyAvg) * 30).toLocaleString()} projected monthly.`,
        color: "violet",
      },
      {
        key: "ratio",
        icon: Number(ratio) > 80 ? icons.warning : icons.ratio,
        text: `Your expense ratio is ${ratio}% of income — ${Number(ratio) > 90 ? "dangerously high!" : Number(ratio) > 70 ? "leave more buffer." : "well balanced."}`,
        color:
          Number(ratio) > 80
            ? "rose"
            : Number(ratio) > 60
              ? "amber"
              : "emerald",
      },
      {
        key: "bigIncome",
        icon: icons.bigIncome,
        text: `Biggest payday was ₹${biggestIncome.amount.toLocaleString()} from ${biggestIncome.category} — "${biggestIncome.description}".`,
        color: "blue",
      },
      {
        key: "streak",
        icon: icons.streak,
        text: `You had a ${maxStreak}-day spending streak — ${maxStreak >= 5 ? "watch those daily habits!" : "spending is well spread out."}`,
        color: maxStreak >= 5 ? "amber" : "emerald",
      },
    ];

    return insights;
  }, [transactions]);

const colorMap = {
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-500/[0.08]",
    dot: "bg-emerald-400 dark:bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-500/20",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-500/[0.08]",
    dot: "bg-rose-400 dark:bg-rose-500",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-100 dark:border-rose-500/20",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-500/[0.08]",
    dot: "bg-amber-400 dark:bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-100 dark:border-amber-500/20",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-500/[0.08]",
    dot: "bg-blue-400 dark:bg-blue-500",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-100 dark:border-blue-500/20",
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-500/[0.08]",
    dot: "bg-violet-400 dark:bg-violet-500",
    text: "text-violet-700 dark:text-violet-400",
    border: "border-violet-100 dark:border-violet-500/20",
  },
};

const InsightItem = ({ insight, index }) => {
  const c = colorMap[insight.color] ?? colorMap.blue;
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${c.bg} ${c.border} transition-all duration-200 hover:scale-[1.01]`}
      style={{
        animation: `insightIn 0.4s ease both`,
        animationDelay: `${index * 60}ms`,
      }}
    >
      <span className="text-base mt-0.5 shrink-0 select-none">
        {insight.icon}
      </span>
      <p className={`text-xs leading-relaxed font-medium ${c.text}`}>
        {insight.text}
      </p>
    </div>
  );
};

const InsightsSkeleton = () => (
  <div className="rounded-2xl p-5 border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03]">
    <div className="h-3 w-24 rounded-full bg-zinc-200 dark:bg-white/10 animate-pulse mb-4" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-12 rounded-xl bg-zinc-100 dark:bg-white/[0.04] animate-pulse"
        />
      ))}
    </div>
  </div>
);

const Insights = () => {
  const transactions = useSelector((s) => s.transaction.transactions);
  const insights = useInsights(transactions);

  if (!transactions?.length) return null;
  if (!insights.length) return <InsightsSkeleton />;

  return (
    <div className="rounded-2xl p-5 border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03]">
      <style>{`
        @keyframes insightIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-white/75">
            Smart Insights
          </h3>
          <p className="text-xs text-zinc-400 dark:text-white/25 mt-0.5">
            Based on your transactions
          </p>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-white/[0.06] text-zinc-500 dark:text-white/35">
          {insights.length} insights
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {insights.map((insight, i) => (
          <InsightItem key={insight.key} insight={insight} index={i} />
        ))}
      </div>
    </div>
  );
};

export default Insights;
