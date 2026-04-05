import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  formatDate,
  formatAmount,
  getCategoryConfig,
} from "../../utils/financeUtils";
import TransactionForm from "./TransactionForm";
import { editTransaction } from "../../store/reducer/TransactionSlice";

const TrashIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-3.5 h-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const PencilIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-3.5 h-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DeleteButton = ({ onDelete }) => {
  const [confirming, setConfirming] = useState(false);
  if (confirming) {
    return (
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setConfirming(false)}
          className="px-2 py-1 rounded-lg text-[11px] font-medium text-zinc-500 dark:text-white/35 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-colors duration-150"
        >
          No
        </button>
        <button
          onClick={onDelete}
          className="px-2 py-1 rounded-lg text-[11px] font-medium bg-rose-500 text-white hover:bg-rose-600 transition-colors duration-150"
        >
          Yes, delete
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={() => setConfirming(true)}
      title="Delete transaction"
      className="shrink-0 overflow-hidden rounded-lg flex items-center justify-center w-0 h-7 group-hover:w-7 opacity-0 group-hover:opacity-100 text-zinc-300 dark:text-white/20 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400 transition-all duration-200"
    >
      <TrashIcon />
    </button>
  );
};

const TransactionRow = ({ item, index, isAdmin = false, onDelete }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const cfg = getCategoryConfig(item.category);
  const isIncome = item.type?.toLowerCase() === "income";

  return (
    <>
      <div
        className="group flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 border-b border-gray-200 dark:border-white/[0.04] hover:bg-gray-100 dark:hover:bg-white/[0.03] transition-colors duration-150 cursor-default"
        style={{
          animation: "rowIn 0.3s ease both",
          animationDelay: `${index * 35}ms`,
        }}
      >
        {/* Avatar */}
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-lg shrink-0 ${cfg.bg} group-hover:scale-105 transition-transform duration-200`}
        >
          {cfg.icon}
        </div>

        {/* Title + date */}
        <div className="flex-1 min-w-0">
          <p className="text-gray-800 dark:text-white/85 text-sm font-medium leading-snug truncate">
            {item.description || item.category || "Untitled transaction"}
          </p>
          <p className="text-gray-400 dark:text-white/30 text-xs mt-0.5 tabular-nums">
            {formatDate(item.date)}
          </p>
        </div>

        {/* Category badge */}
        <div
          className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${cfg.bg} ${cfg.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {item.category || "Other"}
        </div>

        {/* Type badge */}
        <div
          className={`hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${
            isIncome
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
          }`}
        >
          {isIncome ? "↑ Income" : "↓ Expense"}
        </div>

        {/* Amount */}
        <p
          className={`text-sm font-semibold tabular-nums shrink-0 ${
            isIncome
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-gray-700 dark:text-white/75"
          }`}
        >
          {isIncome ? "+" : "−"}
          {formatAmount(item.amount)}
        </p>

        {/* Admin actions */}
        {isAdmin && (
          <div className="flex items-center gap-1 shrink-0">
            {/* Edit button */}
            <button
              onClick={() => setEditing(true)}
              title="Edit transaction"
              className="shrink-0 overflow-hidden rounded-lg flex items-center justify-center w-0 h-7 group-hover:w-7 opacity-0 group-hover:opacity-100 text-zinc-300 dark:text-white/20 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-200"
            >
              <PencilIcon />
            </button>
            <DeleteButton onDelete={() => onDelete(item.id)} />
          </div>
        )}
      </div>
      {/* Edit modal */}
      {editing && (
        <TransactionForm
          initial={item}
          onClose={() => setEditing(false)}
          onSubmit={(updated) => dispatch(editTransaction(updated))}
        />
      )}
    </>
  );
};

export default TransactionRow;
