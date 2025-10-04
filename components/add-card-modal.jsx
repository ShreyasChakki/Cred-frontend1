"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AddCardModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    bankName: "",
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
    creditLimit: "",
  })

  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}

    if (formData.bankName.length < 2) newErrors.bankName = "Bank name is required"
    if (formData.cardNumber.length < 16) newErrors.cardNumber = "Invalid card number"
    if (formData.cardholderName.length < 2) newErrors.cardholderName = "Cardholder name is required"
    if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) newErrors.expiryDate = "Format: MM/YY"
    if (formData.cvv.length !== 3) newErrors.cvv = "CVV must be 3 digits"
    if (!formData.creditLimit || formData.creditLimit < 1000) newErrors.creditLimit = "Invalid credit limit"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const colors = [
      "from-purple-600 to-blue-600",
      "from-green-600 to-teal-600",
      "from-yellow-600 to-orange-600",
      "from-pink-600 to-rose-600",
    ]

    const newCard = {
      id: "card" + Date.now(),
      bankName: formData.bankName,
      cardNumber: "**** **** **** " + formData.cardNumber.slice(-4),
      cardholderName: formData.cardholderName.toUpperCase(),
      expiryDate: formData.expiryDate,
      cvv: "***",
      creditLimit: Number.parseInt(formData.creditLimit),
      outstanding: 0,
      available: Number.parseInt(formData.creditLimit),
      status: "active",
      color: colors[Math.floor(Math.random() * colors.length)],
      lastUsed: new Date().toISOString().split("T")[0],
    }

    onAdd(newCard)
    setFormData({
      bankName: "",
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      cvv: "",
      creditLimit: "",
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-zinc-100">Add New Card</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-100 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="bankName" className="text-zinc-100">
              Bank Name
            </Label>
            <Input
              id="bankName"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
              placeholder="HDFC Bank"
            />
            {errors.bankName && <p className="text-red-400 text-xs mt-1">{errors.bankName}</p>}
          </div>

          <div>
            <Label htmlFor="cardNumber" className="text-zinc-100">
              Card Number
            </Label>
            <Input
              id="cardNumber"
              value={formData.cardNumber}
              onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value.replace(/\D/g, "").slice(0, 16) })}
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
              placeholder="1234567890123456"
              maxLength={16}
            />
            {errors.cardNumber && <p className="text-red-400 text-xs mt-1">{errors.cardNumber}</p>}
          </div>

          <div>
            <Label htmlFor="cardholderName" className="text-zinc-100">
              Cardholder Name
            </Label>
            <Input
              id="cardholderName"
              value={formData.cardholderName}
              onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
              placeholder="John Doe"
            />
            {errors.cardholderName && <p className="text-red-400 text-xs mt-1">{errors.cardholderName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate" className="text-zinc-100">
                Expiry Date
              </Label>
              <Input
                id="expiryDate"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
                placeholder="MM/YY"
                maxLength={5}
              />
              {errors.expiryDate && <p className="text-red-400 text-xs mt-1">{errors.expiryDate}</p>}
            </div>

            <div>
              <Label htmlFor="cvv" className="text-zinc-100">
                CVV
              </Label>
              <Input
                id="cvv"
                type="password"
                value={formData.cvv}
                onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
                placeholder="123"
                maxLength={3}
              />
              {errors.cvv && <p className="text-red-400 text-xs mt-1">{errors.cvv}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="creditLimit" className="text-zinc-100">
              Credit Limit
            </Label>
            <Input
              id="creditLimit"
              type="number"
              value={formData.creditLimit}
              onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
              placeholder="100000"
            />
            {errors.creditLimit && <p className="text-red-400 text-xs mt-1">{errors.creditLimit}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-violet-600 hover:bg-violet-700">
              Add Card
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
