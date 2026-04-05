import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Toolbar from "./FilterBar";

import { ITEMS_PER_PAGE } from "../../utils/financeUtils";
import SkeletonRow from "./SkeletonRow";
import EmptyState from "./EmptyState";
import TransactionRow from "./TransactionRow";
import Pagination from "./Pagination";
import SummaryStrip from "./SummaryStripe";
import ErrorState from "./ErrorState";
import { deleteTransaction } from "../../store/reducer/TransactionSlice"; // adjust path if needed

const TransactionList = () => {
  const dispatch = useDispatch();
  const rawTransactions = useSelector((s) => s.transaction?.transactions) ?? [];
  const role = useSelector((s) => s.transaction?.role) ?? "viewer";
  const isLoading = useSelector((s) => s.transaction?.loading) ?? false;
  const error = useSelector((s) => s.transaction?.error) ?? null;

  const isAdmin = role === "admin";

  // ── Sort latest first ──────────────────────────────────────────────────────
  const transactions = useMemo(
    () =>
      [...rawTransactions].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [rawTransactions],
  );

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () =>
      [...new Set(transactions.map((t) => t.category).filter(Boolean))].sort(),
    [transactions],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return transactions.filter((t) => {
      if (
        q &&
        !(
          t.description?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q) ||
          String(t.amount).includes(q)
        )
      )
        return false;
      if (typeFilter !== "all" && t.type?.toLowerCase() !== typeFilter)
        return false;
      if (catFilter !== "all" && t.category !== catFilter) return false;
      return true;
    });
  }, [transactions, search, typeFilter, catFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );
  const hasFilters = search || typeFilter !== "all" || catFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setCatFilter("all");
  };

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, catFilter]);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const totals = useMemo(
    () =>
      filtered.reduce(
        (acc, t) => {
          const v = parseFloat(t.amount) || 0;
          if (t.type?.toLowerCase() === "income") acc.income += v;
          else acc.expense += v;
          return acc;
        },
        { income: 0, expense: 0 },
      ),
    [filtered],
  );

  return (
    <>
      <style>{`
        @keyframes rowIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="min-h-screen bg-zinc-100 dark:bg-[#0c0c0e] p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight text-gray-800 dark:text-white/90">
              Transactions
            </h1>
            <p className="text-xs text-gray-500 dark:text-white/30 mt-0.5">
              {isLoading
                ? "Loading your records…"
                : `${filtered.length} of ${transactions.length} record${transactions.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl bg-white dark:bg-white/[0.025] border border-gray-200 dark:border-white/[0.07]">
            <Toolbar
              search={search}
              onSearchChange={setSearch}
              typeFilter={typeFilter}
              onTypeChange={setTypeFilter}
              catFilter={catFilter}
              onCatChange={setCatFilter}
              categories={categories}
            />

            {!isLoading && filtered.length > 0 && (
              <SummaryStrip totals={totals} />
            )}

            {/* Body */}
            {error && !isLoading ? (
              <ErrorState error={error} />
            ) : isLoading ? (
              <div>
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <SkeletonRow key={i} delay={i * 55} />
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <EmptyState hasFilters={!!hasFilters} onClear={clearFilters} />
            ) : (
              <div key={`${page}-${typeFilter}-${catFilter}-${search}`}>
                {paginated.map((item, i) => (
                  <TransactionRow
                    key={item.id ?? `${item.date}-${i}`}
                    item={item}
                    index={i}
                    isAdmin={isAdmin}
                    onDelete={(id) => dispatch(deleteTransaction(id))}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && !error && filtered.length > ITEMS_PER_PAGE && (
              <div className="border-t border-gray-200 dark:border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-1 px-5 py-2">
                <p className="text-xs text-gray-500 dark:text-white/20 order-2 sm:order-1">
                  {(page - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of{" "}
                  {filtered.length}
                </p>
                <div className="order-1 sm:order-2">
                  <Pagination
                    current={page}
                    total={totalPages}
                    onChange={setPage}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionList;
