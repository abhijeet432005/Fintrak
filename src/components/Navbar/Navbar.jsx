import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTransaction, setRole } from "../../store/reducer/TransactionSlice";
import TransactionForm from "../../features/transaction/TransactionForm";
import AnimatedThemeToggler from "../../features/theme/AnimatedThemeToggler";

// ── Icons ─────────────────────────────────────────────────────────────────────
const SunIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const MoonIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const ChevronDown = ({ open }) => (
  <svg
    viewBox="0 0 24 24"
    className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-3.5 h-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const MenuIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── Role config ───────────────────────────────────────────────────────────────
const ROLES = {
  admin: {
    label: "Admin",
    initials: "AD",
    dotColor: "bg-rose-400",
    avatarBgLight: "bg-rose-100",
    avatarTextLight: "text-rose-700",
    avatarBgDark: "bg-rose-500/10",
    avatarTextDark: "text-rose-400",
  },
  viewer: {
    label: "Viewer",
    initials: "VI",
    dotColor: "bg-blue-400",
    avatarBgLight: "bg-blue-100",
    avatarTextLight: "text-blue-700",
    avatarBgDark: "bg-blue-500/10",
    avatarTextDark: "text-blue-400",
  },
};

// ── Derive balance from redux transactions ────────────────────────────────────
const useBalance = () => {
  const transactions = useSelector((s) => s.transaction?.transactions) ?? [];
  return transactions.reduce((acc, t) => {
    const v = parseFloat(t.amount) || 0;
    return t.type?.toLowerCase() === "income" ? acc + v : acc - v;
  }, 0);
};

// ── Balance Chip ──────────────────────────────────────────────────────────────
const BalanceChip = ({ amount }) => {
  const positive = amount >= 0;
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.08]">
      <div>
        <p className="text-[10px] text-zinc-400 dark:text-white/35 tracking-wide leading-none mb-0.5">
          Balance
        </p>
        <p
          className={`text-sm font-semibold tabular-nums leading-none ${positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
        >
          {positive ? "" : "−"}
          {formatted}
        </p>
      </div>
    </div>
  );
};

// ── Role Dropdown ─────────────────────────────────────────────────────────────
const RoleDropdown = ({ dark, onAddClick }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const role = useSelector((s) => s.transaction?.role);
  const ref = useRef(null);
  const cfg = ROLES[role];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const avatarBg = dark ? cfg.avatarBgDark : cfg.avatarBgLight;
  const avatarText = dark ? cfg.avatarTextDark : cfg.avatarTextLight;

  return (
    <div ref={ref} className="relative flex gap-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-lg border border-zinc-200 dark:border-white/[0.08] bg-transparent hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-all duration-150"
      >
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0 ${avatarBg} ${avatarText}`}
        >
          {cfg.initials}
        </div>

        <div className="hidden xs:block text-left">
          <p className="text-[13px] font-medium text-zinc-700 dark:text-white/85 leading-snug whitespace-nowrap">
            Alex D.
          </p>
          <p className="text-[11px] text-zinc-400 dark:text-white/35">
            {cfg.label}
          </p>
        </div>

        <span className="text-zinc-400 dark:text-white/30 ml-0.5">
          <ChevronDown open={open} />
        </span>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] right-0 w-52 bg-white dark:bg-[#131316] border border-zinc-200 dark:border-white/[0.08] rounded-xl overflow-hidden z-50 shadow-xl shadow-black/10 dark:shadow-black/60">
          <div className="px-3.5 py-3 border-b border-zinc-100 dark:border-white/[0.06]">
            <p className="text-[13px] font-medium text-zinc-700 dark:text-white/80">
              Alex Davidson
            </p>
            <p className="text-[11px] text-zinc-400 dark:text-white/30 mt-0.5">
              alex@fintrak.io
            </p>
          </div>

          <div className="p-1.5">
            <p className="text-[10px] text-zinc-400 dark:text-white/25 px-2 py-1 tracking-widest uppercase">
              Switch role
            </p>

            {Object.entries(ROLES).map(([key, rc]) => (
              <button
                key={key}
                onClick={() => {
                  dispatch(setRole(key));
                  localStorage.setItem("role", key);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors duration-100 ${
                  role === key
                    ? "bg-zinc-100 dark:bg-white/[0.07]"
                    : "hover:bg-zinc-50 dark:hover:bg-white/[0.04]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${rc.dotColor}`}
                />
                <span
                  className={`text-[13px] flex-1 ${
                    role === key
                      ? "text-zinc-800 dark:text-white/85 font-medium"
                      : "text-zinc-500 dark:text-white/50"
                  }`}
                >
                  {rc.label}
                </span>

                {role === key && (
                  <span className="text-zinc-400 dark:text-white/40">
                    <CheckIcon />
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="h-px bg-zinc-100 dark:bg-white/[0.06] mx-1.5" />

          <div className="p-1.5">
            <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-white/[0.04] transition-colors">
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 stroke-zinc-400 dark:stroke-white/30"
                fill="none"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              <span className="text-[13px] text-zinc-500 dark:text-white/50">
                Profile settings
              </span>
            </button>

            <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors group">
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 stroke-zinc-400 dark:stroke-white/30 group-hover:stroke-rose-500 dark:group-hover:stroke-rose-400 transition-colors"
                fill="none"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="text-[13px] text-zinc-500 dark:text-white/40 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                Sign out
              </span>
            </button>
          </div>
        </div>
      )}

      {role === "admin" && (
        <button
          onClick={onAddClick}
          className="hidden sm:flex items-center px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"
        >
          + Add
        </button>
      )}
    </div>
  );
};

// ── Mobile Menu ───────────────────────────────────────────────────────────────
const MobileMenu = ({
  currentPage,
  onNavigate,
  onClose,
  balance,
  role,
  onAddClick,
}) => {
  const navLinks = [
    { key: "dashboard", label: "Dashboard" },
    { key: "transactions", label: "Transactions" },
  ];

  return (
    <div className="sm:hidden border-t border-zinc-200 dark:border-white/[0.06] bg-white dark:bg-[#0c0c0e] px-4 py-3 space-y-1">
      {/* Balance summary on mobile */}
      <div className="flex items-center justify-between px-3 py-2.5 mb-2 rounded-xl bg-zinc-50 dark:bg-white/[0.03] border border-zinc-100 dark:border-white/[0.05]">
        <span className="text-xs text-zinc-400 dark:text-white/30">
          Net Balance
        </span>
        <span
          className={`text-sm font-semibold tabular-nums ${balance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
        >
          {balance >= 0 ? "" : "−"}
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }).format(Math.abs(balance))}
        </span>
      </div>

      {navLinks.map((l) => (
        <button
          key={l.key}
          onClick={() => {
            onNavigate(l.key);
            onClose();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
            currentPage === l.key
              ? "bg-zinc-100 dark:bg-white/[0.08] text-zinc-800 dark:text-white/85"
              : "text-zinc-500 dark:text-white/40 hover:bg-zinc-50 dark:hover:bg-white/[0.04] hover:text-zinc-700 dark:hover:text-white/65"
          }`}
        >
          {l.label}
          {currentPage === l.key && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-white/30" />
          )}
        </button>
      ))}

      {role === "admin" && (
        <button
          onClick={onAddClick}
          className="md:hidden items-center px-3 py-1.5 text-xs font-medium rounded-lg 
      bg-emerald-500 text-white hover:bg-emerald-600 transition"
        >
          + Add
        </button>
      )}
    </div>
  );
};

// ── Navbar ────────────────────────────────────────────────────────────────────
const Navbar = ({ dark, currentPage, onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const role = useSelector((s) => s.transaction?.role);
  const balance = useBalance();
  const dispatch = useDispatch();

  // Close mobile menu on page change
  useEffect(() => {
    setMobileOpen(false);
  }, [currentPage]);

  const navLinks = [
    { key: "dashboard", label: "Dashboard" },
    { key: "transactions", label: "Transactions" },
  ];

  return (
    <header className="sticky top-0 z-30 transition-colors duration-300">
      {/* ── Main bar ── */}
      <nav className="h-14 px-4 sm:px-5 flex items-center justify-between bg-white dark:bg-[#0c0c0e] border-b border-zinc-200 dark:border-white/[0.06]">
        {/* Left: brand + desktop nav */}
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          {/* Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 stroke-blue-600 dark:stroke-blue-400"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-zinc-800 dark:text-white/85 tracking-tight">
              Fintrak
            </span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden sm:flex items-center gap-1">
            {navLinks.map((l) => (
              <button
                key={l.key}
                onClick={() => onNavigate?.(l.key)}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                  currentPage === l.key
                    ? "bg-zinc-100 dark:bg-white/[0.08] text-zinc-800 dark:text-white/85"
                    : "text-zinc-500 dark:text-white/35 hover:text-zinc-700 dark:hover:text-white/65 hover:bg-zinc-50 dark:hover:bg-white/[0.04]"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Balance chip — hide on xs, show from sm */}
          <div className="hidden sm:block">
            <BalanceChip amount={balance} />
          </div>

          <div className="hidden sm:block w-px h-5 bg-zinc-200 dark:bg-white/[0.07]" />

          {/* Theme toggle */}

          <AnimatedThemeToggler
            className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-white/[0.08] 
              flex items-center justify-center text-zinc-500 dark:text-white/40 
              hover:text-zinc-800 dark:hover:text-white/75 
              hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-all duration-150"
          />

          <div className="w-px h-5 bg-zinc-200 dark:bg-white/[0.07]" />

          {/* Role dropdown */}
          <RoleDropdown dark={dark} onAddClick={() => setShowForm(true)} />

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="sm:hidden w-8 h-8 rounded-lg border border-zinc-200 dark:border-white/[0.08] flex items-center justify-center text-zinc-500 dark:text-white/40 hover:bg-zinc-100 dark:hover:bg-white/[0.06] transition-all duration-150 ml-1"
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* ── Mobile dropdown menu ── */}
      {mobileOpen && (
        <MobileMenu
          currentPage={currentPage}
          onNavigate={onNavigate}
          onClose={() => setMobileOpen(false)}
          balance={balance}
          role={role}
          onAddClick={() => setShowForm(true)}
        />
      )}

      {showForm && (
        <TransactionForm
          onClose={() => setShowForm(false)}
          onSubmit={(data) => {
            dispatch(addTransaction(data));
          }}
        />
      )}
    </header>
  );
};

export default Navbar;
