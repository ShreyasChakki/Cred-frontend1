"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/auth-context"
import { useApp } from "@/lib/contexts/app-context"
import { TransactionItem } from "@/components/transaction-item"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CreditCardIcon, Search } from "lucide-react"
import { useToast } from "@/components/toast-provider"

export default function PaymentsPage() {
  const router = useRouter()
  const { state: authState } = useAuth()
  const { state: appState, makePayment } = useApp()
  const { showToast } = useToast()
  const [selectedCard, setSelectedCard] = useState(null)
  const [amount, setAmount] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.push("/login")
    }
  }, [authState.isAuthenticated, router])

  useEffect(() => {
    if (appState.cards.length > 0 && !selectedCard) {
      setSelectedCard(appState.cards[0])
    }
  }, [appState.cards, selectedCard])

  if (!authState.isAuthenticated) {
    return null
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handlePayment = (e) => {
    e.preventDefault()

    if (!selectedCard) {
      showToast("Please select a card", "error")
      return
    }

    const paymentAmount = Number.parseFloat(amount)

    if (!paymentAmount || paymentAmount <= 0) {
      showToast("Please enter a valid amount", "error")
      return
    }

    if (paymentAmount > selectedCard.outstanding) {
      showToast("Amount exceeds outstanding balance", "error")
      return
    }

    makePayment(selectedCard.id, paymentAmount)
    showToast(`Payment of ${formatCurrency(paymentAmount)} successful!`, "success")
    setAmount("")
  }

  const categories = ["all", "Shopping", "Food & Dining", "Travel", "Utilities"]

  const filteredTransactions = appState.transactions.filter((txn) => {
    const matchesSearch = txn.merchant.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || txn.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </Button>
            <h1 className="text-2xl font-bold text-white">Payments</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Make Payment</h2>

              <form onSubmit={handlePayment} className="space-y-6">
                <div>
                  <Label className="text-white mb-3 block">Select Card</Label>
                  <div className="space-y-2">
                    {appState.cards.map((card) => (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => setSelectedCard(card)}
                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                          selectedCard?.id === card.id
                            ? "border-violet-500 bg-violet-500/10"
                            : "border-zinc-800 bg-zinc-800/50 hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-white font-semibold">{card.bankName}</p>
                          <CreditCardIcon className="w-5 h-5 text-zinc-400" />
                        </div>
                        <p className="text-zinc-300 text-sm mb-1">{card.cardNumber}</p>
                        <p className="text-red-400 text-sm font-semibold">
                          Outstanding: {formatCurrency(card.outstanding)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedCard && (
                  <>
                    <div>
                      <Label htmlFor="amount" className="text-white">
                        Payment Amount
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                        placeholder="Enter amount"
                        min="1"
                        max={selectedCard.outstanding}
                      />
                      <div className="flex gap-2 mt-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent text-white border-zinc-700 hover:bg-zinc-800 text-xs"
                          onClick={() => setAmount(String(selectedCard.outstanding * 0.25))}
                        >
                          25%
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent text-white border-zinc-700 hover:bg-zinc-800 text-xs"
                          onClick={() => setAmount(String(selectedCard.outstanding * 0.5))}
                        >
                          50%
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent text-white border-zinc-700 hover:bg-zinc-800 text-xs"
                          onClick={() => setAmount(String(selectedCard.outstanding))}
                        >
                          Full
                        </Button>
                      </div>
                    </div>

                    <div className="bg-zinc-800 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-300">Current Outstanding</span>
                        <span className="text-white font-semibold">{formatCurrency(selectedCard.outstanding)}</span>
                      </div>
                      {amount && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-300">Payment Amount</span>
                            <span className="text-emerald-400 font-semibold">
                              -{formatCurrency(Number.parseFloat(amount) || 0)}
                            </span>
                          </div>
                          <div className="border-t border-zinc-700 pt-2 flex justify-between">
                            <span className="text-white font-semibold">New Outstanding</span>
                            <span className="text-white font-bold">
                              {formatCurrency(selectedCard.outstanding - (Number.parseFloat(amount) || 0))}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white">
                      Pay Now
                    </Button>
                  </>
                )}
              </form>
            </div>
          </div>

          {/* Transactions List */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Transaction History</h2>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 pl-10"
                    placeholder="Search transactions..."
                  />
                </div>
                <div className="flex gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      size="sm"
                      variant={filterCategory === cat ? "default" : "outline"}
                      className={
                        filterCategory === cat
                          ? "bg-violet-600 hover:bg-violet-700 text-white"
                          : "bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
                      }
                      onClick={() => setFilterCategory(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Transactions */}
              <div className="space-y-3">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TransactionItem key={transaction.id} transaction={transaction} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-zinc-300">No transactions found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
