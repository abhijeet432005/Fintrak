import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { formatAmount } from '../../utils/financeUtils'

const PieChartSkeleton = () => (
  <div className="rounded-2xl p-5 border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03] animate-pulse">
    <div className="h-3 w-28 rounded-full bg-zinc-200 dark:bg-white/10 mb-6" />
    <div className="flex flex-col items-center gap-4">
      <div className="w-36 h-36 rounded-full bg-zinc-200 dark:bg-white/10" />
      <div className="w-full space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-zinc-200 dark:bg-white/10" />
              <div className="h-2.5 w-16 rounded-full bg-zinc-200 dark:bg-white/10" />
            </div>
            <div className="h-2.5 w-14 rounded-full bg-zinc-100 dark:bg-white/[0.05]" />
          </div>
        ))}
      </div>
    </div>
  </div>
)

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const dark = document.documentElement.classList.contains('dark')
  const d = payload[0]
  return (
    <div style={{
      background: dark ? '#1a1a1f' : '#ffffff',
      border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
      borderRadius: 12,
      padding: '10px 12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      fontSize: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.payload.color }} />
        <span style={{ color: dark ? 'rgba(255,255,255,0.7)' : '#3f3f46', fontWeight: 500 }}>{d.name}</span>
      </div>
      <p style={{ color: dark ? 'rgba(255,255,255,0.8)' : '#18181b', fontWeight: 600 }}>{formatAmount(d.value)}</p>
      <p style={{ color: dark ? 'rgba(255,255,255,0.3)' : '#a1a1aa' }}>{d.payload.percent}% of total</p>
    </div>
  )
}

const SpendingPieChart = ({ data, isLoading }) => {
  if (isLoading) return <PieChartSkeleton />

  const total = data.reduce((s, d) => s + d.value, 0)
  const enriched = data.map((d) => ({ ...d, percent: ((d.value / total) * 100).toFixed(1) }))

  return (
    <div className="rounded-2xl p-5 border border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-white/[0.03]">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-zinc-700 dark:text-white/75">Spending breakdown</h3>
        <p className="text-xs text-zinc-400 dark:text-white/25 mt-0.5">This month</p>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={enriched}
            cx="50%"
            cy="50%"
            innerRadius={48}
            outerRadius={72}
            paddingAngle={3}
            dataKey="value"
            nameKey="label"
            strokeWidth={0}
          >
            {enriched.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-3 space-y-2">
        {enriched.map((d) => (
          <div key={d.label} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
              <span className="text-zinc-500 dark:text-white/40">{d.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 dark:text-white/25 tabular-nums">{d.percent}%</span>
              <span className="font-medium text-zinc-700 dark:text-white/65 tabular-nums w-20 text-right">{formatAmount(d.value)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { PieChartSkeleton }
export default SpendingPieChart