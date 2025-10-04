"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/auth-context"
import { useApp } from "@/lib/contexts/app-context"
import { CreditCard } from "@/components/credit-card"
import { AddCardModal } from "@/components/add-card-modal"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft, Lock, Unlock, Trash2 } from "lucide-react"
import { useToast } from "@/components/toast-provider"

export default function CardsPage() {
  const router = useRouter()
  const { state: authState } = useAuth()
  const { state: appState, addCard, freezeCard, removeCard } = useApp()
  const { showToast } = useToast()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState(null)

  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.push("/login")
    }
  }, [authState.isAuthenticated, router])

  if (!authState.isAuthenticated) {
    return null
  }

  const handleAddCard = (card) => {
    addCard(card)
    showToast("Card added successfully!", "success")
  }

  const handleFreezeCard = (cardId) => {
    freezeCard(cardId)
    const card = appState.cards.find((c) => c.id === cardId)
    showToast(card.status === "active" ? "Card frozen" : "Card unfrozen", "success")
  }

  const handleRemoveCard = (cardId) => {
    if (confirm("Are you sure you want to remove this card?")) {
      removeCard(cardId)
      setSelectedCard(null)
      showToast("Card removed successfully", "success")
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="w-5 h-5 text-zinc-400" />
              </Button>
              <h1 className="text-2xl font-bold text-white">My Cards</h1>
            </div>
            <Button className="bg-violet-600 hover:bg-violet-700" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {appState.cards.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-12 h-12 text-zinc-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No cards yet</h2>
            <p className="text-zinc-300 mb-6">Add your first credit card to get started</p>
            <Button className="bg-violet-600 hover:bg-violet-700" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Card
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cards Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {appState.cards.map((card) => (
                  <div key={card.id} onClick={() => setSelectedCard(card)} className="cursor-pointer">
                    <CreditCard card={card} />
                  </div>
                ))}
              </div>
            </div>

            {/* Card Details Sidebar */}
            <div className="lg:col-span-1">
              {selectedCard ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sticky top-24">
                  <h3 className="text-xl font-bold text-white mb-6">Card Details</h3>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-zinc-300 text-sm mb-1">Bank Name</p>
                      <p className="text-white font-semibold">{selectedCard.bankName}</p>
                    </div>

                    <div>
                      <p className="text-zinc-300 text-sm mb-1">Card Number</p>
                      <p className="text-white font-semibold">{selectedCard.cardNumber}</p>
                    </div>

                    <div>
                      <p className="text-zinc-300 text-sm mb-1">Cardholder</p>
                      <p className="text-white font-semibold">{selectedCard.cardholderName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-zinc-300 text-sm mb-1">Expiry</p>
                        <p className="text-white font-semibold">{selectedCard.expiryDate}</p>
                      </div>
                      <div>
                        <p className="text-zinc-300 text-sm mb-1">Status</p>
                        <p
                          className={`font-semibold ${
                            selectedCard.status === "active" ? "text-emerald-400" : "text-amber-400"
                          }`}
                        >
                          {selectedCard.status === "active" ? "Active" : "Frozen"}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-800">
                      <div className="flex justify-between mb-2">
                        <p className="text-zinc-300 text-sm">Credit Limit</p>
                        <p className="text-white font-semibold">{formatCurrency(selectedCard.creditLimit)}</p>
                      </div>
                      <div className="flex justify-between mb-2">
                        <p className="text-zinc-300 text-sm">Outstanding</p>
                        <p className="text-red-400 font-semibold">{formatCurrency(selectedCard.outstanding)}</p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-zinc-300 text-sm">Available</p>
                        <p className="text-emerald-400 font-semibold">{formatCurrency(selectedCard.available)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => handleFreezeCard(selectedCard.id)}
                    >
                      {selectedCard.status === "active" ? (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Freeze Card
                        </>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4 mr-2" />
                          Unfreeze Card
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full text-red-400 border-red-500/20 hover:bg-red-500/10 bg-transparent"
                      onClick={() => handleRemoveCard(selectedCard.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Card
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
                  <p className="text-zinc-300">Select a card to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <AddCardModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddCard} />
    </div>
  )
}
