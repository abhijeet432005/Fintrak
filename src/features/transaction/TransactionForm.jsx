import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = {
  expense: [
    { label: "Food", icon: "🍽" },
    { label: "Rent", icon: "🏠" },
    { label: "Shopping", icon: "🛍" },
    { label: "Transport", icon: "🚗" },
    { label: "Entertainment", icon: "🎬" },
    { label: "Health", icon: "❤️" },
    { label: "Bills", icon: "⚡" },
    { label: "Other", icon: "📦" },
  ],
  income: [
    { label: "Salary", icon: "💼" },
    { label: "Freelance", icon: "💻" },
    { label: "Bonus", icon: "🎁" },
    { label: "Other", icon: "📦" },
  ],
};

const Field = ({ label, children, error }) => (
  <div className="space-y-1.5">
    <label className="block text-[11px] font-medium tracking-wider uppercase text-zinc-400 dark:text-white/30">
      {label}
    </label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="text-[11px] text-rose-500 dark:text-rose-400"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl text-sm text-zinc-800 dark:text-white/85 " +
  "bg-zinc-50 dark:bg-white/[0.04] " +
  "border border-zinc-200 dark:border-white/[0.08] " +
  "placeholder-zinc-400 dark:placeholder-white/20 " +
  "outline-none focus:border-zinc-400 dark:focus:border-white/25 " +
  "focus:bg-white dark:focus:bg-white/[0.06] " +
  "transition-all duration-150";

const TransactionForm = ({ onClose, onSubmit, initial = null }) => {
  const isEdit = !!initial;

  const [form, setForm] = useState({
    type: initial?.type ?? "expense",
    amount: initial?.amount ?? "",
    category: initial?.category ?? "",
    description: initial?.description ?? "",
    date: initial?.date ?? new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState({});
  const [customCat, setCustomCat] = useState(false);

  // On edit, detect if the prefilled category is a custom one
  useEffect(() => {
    if (isEdit && initial.category) {
      const presets = [...CATEGORIES.expense, ...CATEGORIES.income].map(
        (c) => c.label,
      );
      if (!presets.includes(initial.category)) setCustomCat(true);
    }
  }, []);

  useEffect(() => {
    if (!isEdit) {
      setForm((f) => ({ ...f, category: "" }));
      setCustomCat(false);
    }
  }, [form.type]);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      e.amount = "Enter a valid amount";
    if (!form.category.trim()) e.category = "Select or enter a category";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit({
      ...(isEdit ? initial : {}),
      ...form,
      id: initial?.id ?? String(Date.now()),
      amount: Number(form.amount),
    });
    onClose();
  };

  const cats = CATEGORIES[form.type];
  const isIncome = form.type === "income";

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-2xl bg-white dark:bg-[#111114] border border-zinc-200 dark:border-white/[0.08] shadow-2xl shadow-black/20 dark:shadow-black/60 overflow-hidden"
        >
          {/* Accent bar */}
          <div
            className={`h-0.5 w-full transition-colors duration-300 ${
              isIncome
                ? "bg-gradient-to-r from-emerald-400 to-teal-400"
                : "bg-gradient-to-r from-rose-400 to-orange-400"
            }`}
          />

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-[17px] font-semibold text-zinc-800 dark:text-white/88 tracking-tight">
                  {isEdit ? "Edit Transaction" : "Add Transaction"}
                </h2>
                <p className="text-xs text-zinc-400 dark:text-white/30 mt-0.5">
                  {isEdit
                    ? "Update the details below"
                    : "Fill in the details below"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 dark:text-white/30 hover:text-zinc-700 dark:hover:text-white/70 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-all duration-150 text-base leading-none mt-0.5"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Type toggle */}
              <Field label="Type">
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.06]">
                  {["expense", "income"].map((t) => (
                    <motion.button
                      key={t}
                      type="button"
                      onClick={() => set("type", t)}
                      whileTap={{ scale: 0.97 }}
                      className={`relative py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        form.type === t
                          ? t === "income"
                            ? "bg-emerald-500 text-white shadow-sm"
                            : "bg-rose-500 text-white shadow-sm"
                          : "text-zinc-500 dark:text-white/35 hover:text-zinc-700 dark:hover:text-white/60"
                      }`}
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        {t === "income" ? (
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="12" y1="19" x2="12" y2="5" />
                            <polyline points="5 12 12 5 19 12" />
                          </svg>
                        ) : (
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <polyline points="19 12 12 19 5 12" />
                          </svg>
                        )}
                        {t === "income" ? "Income" : "Expense"}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </Field>

              {/* Amount */}
              <Field label="Amount" error={errors.amount}>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-400 dark:text-white/30">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="amount"
                    placeholder="0"
                    min="1"
                    value={form.amount}
                    onChange={(e) => set("amount", e.target.value)}
                    className={`${inputCls} pl-8 tabular-nums ${errors.amount ? "border-rose-400 dark:border-rose-500/60" : ""}`}
                  />
                </div>
              </Field>

              {/* Category */}
              <Field label="Category" error={errors.category}>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {cats.map((c) => (
                    <motion.button
                      key={c.label}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        set("category", c.label);
                        setCustomCat(false);
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${
                        form.category === c.label && !customCat
                          ? isIncome
                            ? "bg-emerald-500/10 border-emerald-400/40 text-emerald-600 dark:text-emerald-400"
                            : "bg-rose-500/10 border-rose-400/40 text-rose-600 dark:text-rose-400"
                          : "bg-zinc-50 dark:bg-white/[0.04] border-zinc-200 dark:border-white/[0.07] text-zinc-500 dark:text-white/40 hover:border-zinc-300 dark:hover:border-white/20 hover:text-zinc-700 dark:hover:text-white/65"
                      }`}
                    >
                      <span style={{ fontSize: 12 }}>{c.icon}</span>
                      {c.label}
                    </motion.button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setCustomCat(true);
                      set("category", "");
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${
                      customCat
                        ? "bg-zinc-200 dark:bg-white/[0.10] border-zinc-400 dark:border-white/25 text-zinc-700 dark:text-white/70"
                        : "bg-zinc-50 dark:bg-white/[0.04] border-zinc-200 dark:border-white/[0.07] text-zinc-400 dark:text-white/30 hover:border-zinc-300 dark:hover:border-white/20"
                    }`}
                  >
                    + Custom
                  </button>
                </div>
                <AnimatePresence>
                  {customCat && (
                    <motion.input
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      type="text"
                      placeholder="Type your category…"
                      value={form.category}
                      onChange={(e) => set("category", e.target.value)}
                      className={inputCls}
                      autoFocus
                    />
                  )}
                </AnimatePresence>
              </Field>

              {/* Description */}
              <Field label="Description">
                <input
                  type="text"
                  name="description"
                  placeholder="What was this for? (optional)"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className={inputCls}
                />
              </Field>

              {/* Date */}
              <Field label="Date">
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  className={`${inputCls} dark:[color-scheme:dark]`}
                />
              </Field>

              {/* Actions */}
              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-zinc-500 dark:text-white/40 bg-zinc-100 dark:bg-white/[0.05] hover:bg-zinc-200 dark:hover:bg-white/[0.09] border border-zinc-200 dark:border-white/[0.07] transition-all duration-150"
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 ${
                    isIncome
                      ? "bg-emerald-500 hover:bg-emerald-600 shadow-sm shadow-emerald-500/25"
                      : "bg-rose-500 hover:bg-rose-600 shadow-sm shadow-rose-500/25"
                  }`}
                >
                  {isEdit
                    ? "Save Changes"
                    : `Add ${isIncome ? "Income" : "Expense"}`}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TransactionForm;
