"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/auth-context"
import { useApp } from "@/lib/contexts/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, X, Users, DollarSign, CheckCircle2, Eye } from "lucide-react"
import { useToast } from "@/components/toast-provider"

export default function SplitBillPage() {
  const router = useRouter()
  const { state: authState } = useAuth()
  const { state: appState, dispatch } = useApp()
  const { showToast } = useToast()
  const [billAmount, setBillAmount] = useState("")
  const [billTitle, setBillTitle] = useState("")
  const [participants, setParticipants] = useState([{ name: "", amount: "" }])
  const [splitType, setSplitType] = useState("equal")
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastSplit, setLastSplit] = useState(null)
  const [selectedSplit, setSelectedSplit] = useState(null)

  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.push("/login")
    }
  }, [authState.isAuthenticated, router])

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

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  }

  const addParticipant = () => {
    setParticipants([...participants, { name: "", amount: "" }])
  }

  const removeParticipant = (index) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index))
    }
  }

  const updateParticipant = (index, field, value) => {
    const updated = [...participants]
    updated[index][field] = value
    setParticipants(updated)
  }

  const calculateSplit = () => {
    const amount = Number.parseFloat(billAmount)
    if (!amount || amount <= 0) {
      showToast("Please enter a valid bill amount", "error")
      return
    }

    if (!billTitle.trim()) {
      showToast("Please enter a bill title", "error")
      return
    }

    if (participants.some((p) => !p.name.trim())) {
      showToast("Please enter names for all participants", "error")
      return
    }

    let finalParticipants = []

    if (splitType === "equal") {
      const perPerson = amount / participants.length
      finalParticipants = participants.map((p) => ({ name: p.name, amount: perPerson }))
    } else {
      const total = participants.reduce((sum, p) => sum + (Number.parseFloat(p.amount) || 0), 0)
      if (Math.abs(total - amount) > 0.01) {
        showToast(`Custom amounts must total ${formatCurrency(amount)}`, "error")
        return
      }
      finalParticipants = participants.map((p) => ({ name: p.name, amount: Number.parseFloat(p.amount) }))
    }

    const newSplit = {
      id: `split${Date.now()}`,
      title: billTitle,
      amount: amount,
      date: new Date().toISOString(),
      splitType: splitType,
      participants: finalParticipants,
    }

    dispatch({ type: "ADD_SPLIT_BILL", payload: newSplit })
    setLastSplit(newSplit)
    setShowSuccess(true)
    showToast("Bill split successfully!", "success")
  }

  const resetForm = () => {
    setBillAmount("")
    setBillTitle("")
    setParticipants([{ name: "", amount: "" }])
    setSplitType("equal")
    setShowSuccess(false)
    setLastSplit(null)
  }

  const totalAssigned = participants.reduce((sum, p) => sum + (Number.parseFloat(p.amount) || 0), 0)
  const remaining = Number.parseFloat(billAmount) - totalAssigned

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </Button>
            <h1 className="text-2xl font-bold text-white">Split Bill</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showSuccess && lastSplit ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Bill Split Successfully!</h2>
              <p className="text-zinc-300">Here's the breakdown for everyone</p>
            </div>

            <div className="bg-zinc-800 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{lastSplit.title}</h3>
                  <p className="text-zinc-300 text-sm">{formatDate(lastSplit.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-violet-400">{formatCurrency(lastSplit.amount)}</p>
                  <p className="text-zinc-300 text-sm">
                    {lastSplit.splitType === "equal" ? "Split Equally" : "Custom Split"}
                  </p>
                </div>
              </div>

              <div className="border-t border-zinc-700 pt-4 space-y-3">
                <p className="text-zinc-300 text-sm font-semibold mb-3">Participant Breakdown:</p>
                {lastSplit.participants.map((participant, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-zinc-900 rounded-lg border border-zinc-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-500/20 rounded-full flex items-center justify-center">
                        <span className="text-violet-400 font-bold text-sm">
                          {participant.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-white font-semibold">{participant.name}</span>
                    </div>
                    <span className="text-white font-bold">{formatCurrency(participant.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 bg-violet-600 hover:bg-violet-700 text-white" onClick={resetForm}>
                Split Another Bill
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent text-white border-zinc-700 hover:bg-zinc-800"
                onClick={() => router.push("/dashboard")}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
            <div className="space-y-6">
              {/* Bill Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="billTitle" className="text-white">
                    Bill Title
                  </Label>
                  <Input
                    id="billTitle"
                    value={billTitle}
                    onChange={(e) => setBillTitle(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    placeholder="Dinner at Restaurant"
                  />
                </div>

                <div>
                  <Label htmlFor="billAmount" className="text-white">
                    Total Amount
                  </Label>
                  <Input
                    id="billAmount"
                    type="number"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    placeholder="5000"
                  />
                </div>
              </div>

              {/* Split Type */}
              <div>
                <Label className="text-white mb-3 block">Split Type</Label>
                <div className="flex gap-4">
                  <Button
                    variant={splitType === "equal" ? "default" : "outline"}
                    className={
                      splitType === "equal"
                        ? "flex-1 bg-violet-600 hover:bg-violet-700 text-white"
                        : "flex-1 bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
                    }
                    onClick={() => setSplitType("equal")}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Equal Split
                  </Button>
                  <Button
                    variant={splitType === "custom" ? "default" : "outline"}
                    className={
                      splitType === "custom"
                        ? "flex-1 bg-violet-600 hover:bg-violet-700 text-white"
                        : "flex-1 bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
                    }
                    onClick={() => setSplitType("custom")}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Custom Split
                  </Button>
                </div>
              </div>

              {/* Participants */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-white">Participants</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addParticipant}
                    className="bg-transparent text-white border-zinc-700 hover:bg-zinc-800"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Person
                  </Button>
                </div>

                <div className="space-y-3">
                  {participants.map((participant, index) => (
                    <div key={index} className="flex gap-3">
                      <Input
                        value={participant.name}
                        onChange={(e) => updateParticipant(index, "name", e.target.value)}
                        className="flex-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                        placeholder="Name"
                      />
                      {splitType === "custom" && (
                        <Input
                          type="number"
                          value={participant.amount}
                          onChange={(e) => updateParticipant(index, "amount", e.target.value)}
                          className="w-32 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                          placeholder="Amount"
                        />
                      )}
                      {splitType === "equal" && participant.amount && (
                        <div className="w-32 flex items-center justify-center bg-zinc-800 border border-zinc-700 rounded-md px-3">
                          <span className="text-white font-semibold">{formatCurrency(participant.amount)}</span>
                        </div>
                      )}
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => removeParticipant(index)}
                        disabled={participants.length === 1}
                        className="bg-transparent border-zinc-700 text-red-400 hover:bg-red-500/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              {billAmount && (
                <div className="bg-zinc-800 rounded-lg p-6 space-y-3">
                  <div className="flex justify-between text-lg">
                    <span className="text-zinc-300">Total Bill</span>
                    <span className="text-white font-bold">{formatCurrency(billAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-300">Participants</span>
                    <span className="text-white font-semibold">{participants.length}</span>
                  </div>
                  {splitType === "equal" && (
                    <div className="flex justify-between">
                      <span className="text-zinc-300">Per Person</span>
                      <span className="text-violet-400 font-bold">
                        {formatCurrency(Number.parseFloat(billAmount) / participants.length)}
                      </span>
                    </div>
                  )}
                  {splitType === "custom" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-zinc-300">Assigned</span>
                        <span className="text-white font-semibold">{formatCurrency(totalAssigned)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-300">Remaining</span>
                        <span
                          className={`font-semibold ${remaining > 0 ? "text-amber-400" : remaining < 0 ? "text-red-400" : "text-emerald-400"}`}
                        >
                          {formatCurrency(Math.abs(remaining))}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Action Button */}
              <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white" onClick={calculateSplit}>
                Calculate Split
              </Button>
            </div>
          </div>
        )}

        {/* Recent Splits */}
        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Splits</h2>
          {appState.splitBills.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zinc-300">No split bills yet. Create your first split above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appState.splitBills.map((split) => (
                <div
                  key={split.id}
                  className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg hover:bg-zinc-750 transition-colors cursor-pointer"
                  onClick={() => setSelectedSplit(split)}
                >
                  <div className="flex-1">
                    <p className="text-white font-semibold mb-1">{split.title}</p>
                    <p className="text-zinc-300 text-sm">
                      {split.participants.length} people • {formatDate(split.date)}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="text-white font-bold">{formatCurrency(split.amount)}</p>
                      <p className="text-zinc-300 text-sm">
                        {formatCurrency(split.amount / split.participants.length)}/person
                      </p>
                    </div>
                    <Eye className="w-5 h-5 text-zinc-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detailed View Modal for Selected Split */}
        {selectedSplit && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSplit(null)}
          >
            <div
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{selectedSplit.title}</h3>
                  <p className="text-zinc-300">{formatDate(selectedSplit.date)}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedSplit(null)}>
                  <X className="w-5 h-5 text-zinc-400" />
                </Button>
              </div>

              <div className="bg-zinc-800 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-zinc-300 text-sm mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-violet-400">{formatCurrency(selectedSplit.amount)}</p>
                  </div>
                  <div>
                    <p className="text-zinc-300 text-sm mb-1">Per Person</p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(selectedSplit.amount / selectedSplit.participants.length)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-zinc-700 rounded-full text-zinc-300">
                    {selectedSplit.splitType === "equal" ? "Equal Split" : "Custom Split"}
                  </span>
                  <span className="px-3 py-1 bg-zinc-700 rounded-full text-zinc-300">
                    {selectedSplit.participants.length} Participants
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-zinc-300 text-sm font-semibold">Participant Details:</p>
                {selectedSplit.participants.map((participant, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-zinc-800 rounded-lg border border-zinc-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-violet-500/20 rounded-full flex items-center justify-center">
                        <span className="text-violet-400 font-bold">{participant.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{participant.name}</p>
                        <p className="text-zinc-300 text-sm">
                          {((participant.amount / selectedSplit.amount) * 100).toFixed(1)}% of total
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-lg">{formatCurrency(participant.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                className="w-full mt-6 bg-violet-600 hover:bg-violet-700 text-white"
                onClick={() => setSelectedSplit(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
