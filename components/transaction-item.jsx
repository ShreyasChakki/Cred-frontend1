"use client"

import { ShoppingBag, Utensils, Plane, Zap, Smartphone, Home, Car, Heart } from "lucide-react"

const iconMap = {
  ShoppingBag,
  Utensils,
  Plane,
  Zap,
  Smartphone,
  Home,
  Car,
  Heart,
}

export function TransactionItem({ transaction }) {
  const Icon = iconMap[transaction.icon] || ShoppingBag

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
      <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-6 h-6 text-violet-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-zinc-100 font-semibold truncate">{transaction.merchant}</p>
        <p className="text-zinc-400 text-sm">{transaction.category}</p>
      </div>
      <div className="text-right">
        <p className="text-zinc-100 font-bold">{formatCurrency(transaction.amount)}</p>
        <p className="text-zinc-500 text-xs">{formatDate(transaction.date)}</p>
      </div>
    </div>
  )
}
