import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { formatAmount } from '../../utils/financeUtils'

const BarChartSkeleton = () => (
  <div className="rounded-2xl p-5 border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] animate-pulse">
    <div className="h-3 w-32 rounded-full bg-zinc-200 dark:bg-white/10 mb-6" />
    <div className="flex items-end gap-3 h-48">
      {[65, 80, 55, 90, 70, 60].map((h, i) => (
        <div key={i} className="flex-1 flex flex-col gap-1 items-center justify-end">
          <div className="w-full rounded-t bg-zinc-200 dark:bg-white/10" style={{ height: `${h}%` }} />
          <div className="h-2 w-6 rounded-full bg-zinc-100 dark:bg-white/[0.05]" />
        </div>
      ))}
    </div>
  </div>
)

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const dark = document.documentElement.classList.contains('dark')
  return (
    <div style={{
      background:    dark ? '#1a1a1f' : '#ffffff',
      border:        `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
      borderRadius:  12,
      padding:       '10px 14px',
      boxShadow:     '0 8px 32px rgba(0,0,0,0.12)',
      fontSize:      12,
    }}>
      <p style={{ color: dark ? 'rgba(255,255,255,0.7)' : '#3f3f46', fontWeight: 500, marginBottom: 8 }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.fill, flexShrink: 0 }} />
          <span style={{ color: dark ? 'rgba(255,255,255,0.4)' : '#71717a', textTransform: 'capitalize' }}>{p.name}:</span>
          <span style={{ color: dark ? 'rgba(255,255,255,0.8)' : '#18181b', fontWeight: 500 }}>{formatAmount(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

const IncomeExpenseBarChart = ({ data, isLoading }) => {

  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  }, [])

  if (isLoading) return <BarChartSkeleton />

  const gridColor  = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'
  const labelColor = dark ? 'rgba(255,255,255,0.3)'  : 'rgba(0,0,0,0.4)'
  const cursorFill = dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'

  return (
    <div className="rounded-2xl p-5 border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-white/75">Income vs Expense</h3>
          <p className="text-xs text-zinc-400 dark:text-white/25 mt-0.5">Monthly breakdown</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-zinc-500 dark:text-white/40">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />Income
          </span>
          <span className="flex items-center gap-1.5 text-zinc-500 dark:text-white/40">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-400" />Expense
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={282}>
        <BarChart data={data} barCategoryGap="28%" barGap={4}>
          <CartesianGrid vertical={false} stroke={gridColor} strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: labelColor }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 11, fill: labelColor }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v >= 1000 ? `${v / 1000}k` : v}`}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: cursorFill, radius: 6 }} />
          <Bar dataKey="income"  fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
          <Bar dataKey="expense" fill="#fb7185" radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export { BarChartSkeleton }
export default IncomeExpenseBarChart