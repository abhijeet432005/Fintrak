import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Transaction = lazy(() => import("../pages/Transaction"));

const PageLoader = () => (
  <div className="min-h-screen bg-zinc-100 dark:bg-[#0c0c0e] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      
      {/* Spinning ring + logo */}
      <div className="relative w-14 h-14 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full animate-spin" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="2" className="text-zinc-200 dark:text-white/[0.06]" />
          <path d="M28 4 a24 24 0 0 1 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-500 dark:text-blue-400" />
        </svg>
        <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-blue-600 dark:stroke-blue-400" fill="none" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      </div>

      {/* Brand name */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-semibold text-zinc-700 dark:text-white/70 tracking-tight">Fintrak</p>
        <p className="text-xs text-zinc-400 dark:text-white/25">Loading your finances…</p>
      </div>

    </div>
  </div>
);

const MainRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transaction" element={<Transaction />} />
      </Routes>
    </Suspense>
  );
};

export default MainRoutes;
