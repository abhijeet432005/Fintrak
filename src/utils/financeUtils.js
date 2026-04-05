export const ITEMS_PER_PAGE = 8;

// ── Currency Formatter ─────────────────────────────
export const formatAmount = (n) => {
  const v = parseFloat(n);
  return isNaN(v)
    ? "—"
    : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(Math.abs(v));
};

// ── Date Formatter ─────────────────────────────────
export const formatDate = (d) => {
  if (!d) return "—";
  try {
    const dt = new Date(d);
    return isNaN(dt)
      ? String(d)
      : dt.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  } catch {
    return String(d);
  }
};

// ── Category Config (Light + Dark) ─────────────────
const CATEGORY_MAP = {
  Food: {
    icon: "🍽",
    light: "bg-orange-100 text-orange-700",
    dark: "bg-orange-500/10 text-orange-400",
    dot: "bg-orange-400",
  },
  Rent: {
    icon: "🏠",
    light: "bg-violet-100 text-violet-700",
    dark: "bg-violet-500/10 text-violet-400",
    dot: "bg-violet-400",
  },
  Shopping: {
    icon: "🛍",
    light: "bg-pink-100 text-pink-700",
    dark: "bg-pink-500/10 text-pink-400",
    dot: "bg-pink-400",
  },
  Transport: {
    icon: "🚗",
    light: "bg-cyan-100 text-cyan-700",
    dark: "bg-cyan-500/10 text-cyan-400",
    dot: "bg-cyan-400",
  },
  Entertainment: {
    icon: "🎬",
    light: "bg-yellow-100 text-yellow-700",
    dark: "bg-yellow-500/10 text-yellow-400",
    dot: "bg-yellow-400",
  },
  Health: {
    icon: "❤️",
    light: "bg-rose-100 text-rose-700",
    dark: "bg-rose-500/10 text-rose-400",
    dot: "bg-rose-400",
  },
  Utilities: {
    icon: "⚡",
    light: "bg-sky-100 text-sky-700",
    dark: "bg-sky-500/10 text-sky-400",
    dot: "bg-sky-400",
  },
  Salary: {
    icon: "💼",
    light: "bg-emerald-100 text-emerald-700",
    dark: "bg-emerald-500/10 text-emerald-400",
    dot: "bg-emerald-400",
  },
  Freelance: {
    icon: "💻",
    light: "bg-teal-100 text-teal-700",
    dark: "bg-teal-500/10 text-teal-400",
    dot: "bg-teal-400",
  },
  Other: {
    icon: "📦",
    light: "bg-slate-100 text-slate-700",
    dark: "bg-slate-500/10 text-slate-400",
    dot: "bg-slate-400",
  },
};

// ── Get Category Config ────────────────────────────
export const getCategoryConfig = (cat, isDark) => {
  const cfg = CATEGORY_MAP[cat] ?? CATEGORY_MAP.Other;

  return {
    icon: cfg.icon,
    bg: isDark ? cfg.dark : cfg.light,
    text: isDark ? cfg.dark.split(" ")[1] : cfg.light.split(" ")[1],
    dot: cfg.dot,
  };
};