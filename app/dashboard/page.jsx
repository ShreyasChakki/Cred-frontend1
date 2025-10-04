"use client"

import { Sidebar } from "@/components/sidebar"
import { useApp } from "@/lib/contexts/app-context"
import { useAuth } from "@/lib/contexts/auth-context"
import { CreditCard, Wallet, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const spendingData = [
  { month: "Jul", amount: 38500 },
  { month: "Aug", amount: 42200 },
  { month: "Sep", amount: 39800 },
  { month: "Oct", amount: 45280 },
]

const categoryData = [
  { name: "Food & Dining", value: 12450, color: "#8b5cf6" },
  { name: "Shopping", value: 18200, color: "#ec4899" },
  { name: "Travel", value: 8900, color: "#3b82f6" },
  { name: "Utilities", value: 5730, color: "#10b981" },
]

export default function DashboardPage() {
  const { state } = useApp()
  const { state: authState } = useAuth()
  const router = useRouter()

  const totalOutstanding = state.cards.reduce((sum, card) => sum + card.outstanding, 0)
  const totalLimit = state.cards.reduce((sum, card) => sum + card.creditLimit, 0)
  const totalAvailable = state.cards.reduce((sum, card) => sum + card.available, 0)
  const utilization = Math.round((totalOutstanding / totalLimit) * 100)

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <main className="ml-64 flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {authState.user?.name || "Guest"}!</h1>
          <p className="text-zinc-300">Here's your financial overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card
            className="p-6 bg-zinc-900 border-zinc-800 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => router.push("/payments")}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-red-400" />
              </div>
            </div>
            <p className="text-zinc-300 text-sm mb-1">Total Outstanding</p>
            <p className="text-3xl font-bold text-red-400 mb-2">₹{totalOutstanding.toLocaleString()}</p>
            <p className="text-zinc-400 text-xs">Across {state.cards.length} cards</p>
          </Card>

          <Card
            className="p-6 bg-zinc-900 border-zinc-800 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => router.push("/cards")}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
            <p className="text-zinc-300 text-sm mb-1">Available Credit</p>
            <p className="text-3xl font-bold text-emerald-400 mb-2">₹{totalAvailable.toLocaleString()}</p>
            <p className="text-zinc-400 text-xs">Total limit ₹{totalLimit.toLocaleString()}</p>
          </Card>

          <Card
            className="p-6 bg-zinc-900 border-zinc-800 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => router.push("/insights")}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-amber-400" />
              </div>
            </div>
            <p className="text-zinc-300 text-sm mb-1">Credit Utilization</p>
            <p className="text-3xl font-bold text-amber-400 mb-2">{utilization}%</p>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500" style={{ width: `${utilization}%` }} />
            </div>
          </Card>
        </div>

        {/* Bill Due Section */}
        <Card className="p-6 bg-zinc-900 border-2 border-violet-500 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-white mb-1">Next Bill Due</p>
              <p className="text-2xl font-bold text-white mb-1">October 18, 2025</p>
              <p className="text-violet-400">14 days left</p>
            </div>
            <Button onClick={() => router.push("/payments")} className="bg-violet-600 hover:bg-violet-700">
              Pay Now
            </Button>
          </div>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-4">Monthly Spending</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={spendingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="amount" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <h3 className="text-lg font-semibold text-white mb-4">Spending by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="p-6 bg-zinc-900 border-zinc-800">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {state.transactions.slice(0, 5).map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <span className="text-violet-400">🛍️</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{txn.merchant}</p>
                    <p className="text-sm text-zinc-300">
                      {new Date(txn.date).toLocaleDateString()} • {txn.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">₹{txn.amount.toLocaleString()}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-violet-500/20 text-violet-400">
                    {txn.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4" onClick={() => router.push("/payments")}>
            View All Transactions
          </Button>
        </Card>
      </main>
    </div>
  )
}
