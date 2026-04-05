import { useMemo } from 'react'
import { useSelector } from 'react-redux'

export const useDashboardData = () => {
  const transactions = useSelector((s) => s.transaction?.transactions) ?? []
  const isLoading = useSelector((s) => s.transaction?.loading) ?? false
  const error = useSelector((s) => s.transaction?.error) ?? null

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() =>
    transactions.reduce(
      (acc, t) => {
        const v = parseFloat(t.amount) || 0
        if (t.type?.toLowerCase() === 'income') acc.income += v
        else acc.expense += v
        return acc
      },
      { income: 0, expense: 0, get balance() { return this.income - this.expense } }
    ),
    [transactions]
  )

  // ── Bar chart — income vs expense by month ────────────────────────────────
  const barData = useMemo(() => {
    const monthMap = {}
    transactions.forEach((t) => {
      if (!t.date) return
      const d = new Date(t.date)
      if (isNaN(d)) return
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const label = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
      if (!monthMap[key]) monthMap[key] = { month: label, income: 0, expense: 0 }
      const v = parseFloat(t.amount) || 0
      if (t.type?.toLowerCase() === 'income') monthMap[key].income += v
      else monthMap[key].expense += v
    })
    return Object.keys(monthMap).sort().map((k) => monthMap[k])
  }, [transactions])

  // ── Pie chart — expense by category ──────────────────────────────────────
  const CATEGORY_COLORS = {
    Food: '#f97316', Rent: '#8b5cf6', Shopping: '#ec4899',
    Transport: '#06b6d4', Entertainment: '#eab308', Health: '#f43f5e',
    Utilities: '#0ea5e9', Bills: '#64748b', Salary: '#10b981',
    Freelance: '#14b8a6', Bonus: '#3b82f6', Other: '#94a3b8',
  }

  const pieData = useMemo(() => {
    const catMap = {}
    transactions
      .filter((t) => t.type?.toLowerCase() === 'expense')
      .forEach((t) => {
        const cat = t.category || 'Other'
        catMap[cat] = (catMap[cat] || 0) + (parseFloat(t.amount) || 0)
      })
    return Object.entries(catMap)
      .map(([label, value]) => ({ label, value, color: CATEGORY_COLORS[label] ?? CATEGORY_COLORS.Other }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  // ── Latest 7 by date desc ─────────────────────────────────────────────────
  const latest = useMemo(() =>
    [...transactions]
      .filter((t) => t.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 7),
    [transactions]
  )

  return {
    stats,
    barData,
    pieData,
    latest,
    isLoading,
    error,
    total: transactions.length,
  }
}