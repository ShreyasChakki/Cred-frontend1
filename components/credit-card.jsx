"use client"

import { CreditCardIcon, Lock, Unlock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CreditCard({ card, onFreeze, onSelect }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const usagePercent = ((card.outstanding / card.creditLimit) * 100).toFixed(1)

  return (
    <div
      onClick={() => onSelect && onSelect(card)}
      className={`relative bg-gradient-to-br ${card.color} rounded-2xl p-6 text-white shadow-2xl cursor-pointer transition-all hover:scale-105 hover:shadow-violet-500/20 ${
        card.status === "frozen" ? "opacity-60" : ""
      }`}
    >
      {card.status === "frozen" && (
        <div className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <Lock className="w-3 h-3" />
          Frozen
        </div>
      )}

      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-white/80 text-sm mb-1">{card.bankName}</p>
          <p className="text-2xl font-bold tracking-wider">{card.cardNumber}</p>
        </div>
        <CreditCardIcon className="w-10 h-10 text-white/80" />
      </div>

      <div className="mb-6">
        <p className="text-white/80 text-xs mb-1">Cardholder Name</p>
        <p className="text-lg font-semibold">{card.cardholderName}</p>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <p className="text-white/80 text-xs mb-1">Outstanding</p>
          <p className="text-xl font-bold">{formatCurrency(card.outstanding)}</p>
          <p className="text-white/70 text-xs mt-1">{usagePercent}% of limit</p>
        </div>
        <div className="text-right">
          <p className="text-white/80 text-xs mb-1">Available</p>
          <p className="text-lg font-semibold">{formatCurrency(card.available)}</p>
        </div>
      </div>

      {onFreeze && (
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onFreeze(card.id)
          }}
          variant="ghost"
          size="sm"
          className="absolute bottom-4 right-4 text-white hover:bg-white/20"
        >
          {card.status === "frozen" ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
        </Button>
      )}
    </div>
  )
}
