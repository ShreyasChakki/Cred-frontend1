"use client"

export function StatCard({ title, value, subtitle, icon: Icon, trend }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-violet-400" />
        </div>
        {trend && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              trend > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
            }`}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
      <h3 className="text-zinc-400 text-sm mb-2">{title}</h3>
      <p className="text-3xl font-bold text-zinc-100 mb-1">{value}</p>
      {subtitle && <p className="text-zinc-500 text-sm">{subtitle}</p>}
    </div>
  )
}
