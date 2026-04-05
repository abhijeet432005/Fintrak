import { lazy, Suspense } from "react";
import { useDashboardData } from "../features/dashboard/useDashboardStats";
import StatCard, { StatCardSkeleton } from "../features/dashboard/StatCard";
import { MagicCard } from "../components/magicCard/MagicCard";
import Insights from "../features/insights/Insights";
import { useSelector } from "react-redux";
import { exportToCSV } from "../utils/exportCSV";
import { Button } from "../components/Buttons/Button";

const SpendingPieChart = lazy(
  () => import("../features/dashboard/PieChartCard"),
);
const IncomeExpenseBarChart = lazy(
  () => import("../features/dashboard/BarChartCard"),
);
const LatestTransactions = lazy(
  () => import("../features/dashboard/LatestTransactions"),
);


const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const EmptyDashboard = ({ onNavigateToTransactions }) => (
  <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
    <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-white/[0.05] flex items-center justify-center text-3xl mb-5 select-none">
      🪙
    </div>
    <h2 className="text-lg font-semibold text-zinc-700 dark:text-white/70 mb-2">
      No transactions yet
    </h2>
    <p className="text-sm text-zinc-400 dark:text-white/30 max-w-xs mb-6">
      Add your first income or expense to start seeing your financial overview
      here.
    </p>
    {onNavigateToTransactions && (
      <button
        onClick={onNavigateToTransactions}
        className="px-4 py-2 rounded-xl text-sm font-medium bg-zinc-800 dark:bg-white/10 text-white dark:text-white/80 hover:bg-zinc-700 dark:hover:bg-white/[0.15] transition-colors duration-200"
      >
        Add a transaction
      </button>
    )}
  </div>
);

const ErrorBanner = ({ message }) => (
  <div className="rounded-2xl px-5 py-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-sm text-rose-600 dark:text-rose-400 mb-6">
    ⚠️{" "}
    {message ??
      "Something went wrong loading your dashboard. Please try again."}
  </div>
);

const ChartEmpty = ({ label }) => (
  <div className="h-full min-h-[220px] rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] flex flex-col items-center justify-center gap-2 text-zinc-400 dark:text-white/20 select-none">
    <span className="text-2xl">📊</span>
    <span className="text-xs">{label}</span>
  </div>
);

const ChartSkeleton = ({ className }) => (
  <div
    className={`rounded-2xl animate-pulse bg-zinc-200 dark:bg-white/[0.05] ${className}`}
  />
);

const Dashboard = ({ dark, onNavigateToTransactions }) => {
  const { stats, barData, pieData, latest, isLoading, total, error } =
    useDashboardData();

  const isEmpty = !isLoading && !error && total === 0;
  const safeBar = Array.isArray(barData) ? barData : [];
  const safePie = Array.isArray(pieData) ? pieData : [];
  const safeLatest = Array.isArray(latest) ? latest : [];
  const transactions = useSelector((s) => s.transaction?.transactions);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-[#0c0c0e]">
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
        .dash-section { animation: fadeUp 0.4s ease both; }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 dash-section" style={{ animationDelay: "0ms" }}>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-800 dark:text-white/85 tracking-tight">
                {getGreeting()} 👋
              </h1>
              <p className="text-sm text-zinc-400 dark:text-white/30 mt-1">
                {isLoading && "Loading your finances…"}
                {!isLoading && error && "Could not load your data."}
                {!isLoading && !error && total === 0 && "No transactions yet."}
                {!isLoading &&
                  !error &&
                  total > 0 &&
                  `You have ${total} transaction${total !== 1 ? "s" : ""} on record.`}
              </p>
            </div>

            {!isEmpty && (
              <Button
                className="w-fit"
                onClick={() => exportToCSV(transactions)}
              >
                Export CSV
              </Button>
            )}
          </div>
          <div
            className="dash-section mb-6 mt-6"
            style={{ animationDelay: "90ms" }}
          >
            <Insights />
          </div>
        </div>

        {error && <ErrorBanner message={error?.message} />}

        {isEmpty ? (
          <EmptyDashboard onNavigateToTransactions={onNavigateToTransactions} />
        ) : (
          <>
            {/* Stat cards — one Suspense wraps all three; isLoading handles per-card skeleton */}
            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                </div>
              }
            >
              <div
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3 dash-section"
                style={{ animationDelay: "60ms" }}
              >
                <StatCard
                  label="Total Balance"
                  amount={stats?.balance ?? 0}
                  icon="💰"
                  accent="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                  isLoading={isLoading}
                />
                <StatCard
                  label="Total Income"
                  amount={stats?.income ?? 0}
                  icon="📈"
                  accent="bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                  isLoading={isLoading}
                />
                <StatCard
                  label="Total Expenditure"
                  amount={stats?.expense ?? 0}
                  icon="📉"
                  accent="bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                  isLoading={isLoading}
                />
              </div>
            </Suspense>

            {/* Charts */}
            <div
              className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3 dash-section"
              style={{ animationDelay: "120ms" }}
            >
              <div className="lg:col-span-2">
                {isLoading || safeBar.length > 0 ? (
                  <Suspense fallback={<ChartSkeleton className="h-[220px]" />}>
                    <IncomeExpenseBarChart
                      data={safeBar}
                      isLoading={isLoading}
                      dark={dark}
                    />
                  </Suspense>
                ) : (
                  <ChartEmpty label="No income or expense data to chart" />
                )}
              </div>
              <div>
                {isLoading || safePie.length > 0 ? (
                  <MagicCard>
                    <Suspense
                      fallback={<ChartSkeleton className="h-[220px]" />}
                    >
                      <SpendingPieChart data={safePie} isLoading={isLoading} />
                    </Suspense>
                  </MagicCard>
                ) : (
                  <ChartEmpty label="No spending categories yet" />
                )}
              </div>
            </div>

            {/* Latest transactions */}
            <div className="dash-section" style={{ animationDelay: "180ms" }}>
              <Suspense fallback={<ChartSkeleton className="h-40" />}>
                <LatestTransactions
                  transactions={safeLatest}
                  isLoading={isLoading}
                  onViewAll={onNavigateToTransactions}
                />
              </Suspense>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
