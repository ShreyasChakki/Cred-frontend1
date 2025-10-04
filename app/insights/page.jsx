"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/auth-context"
import { useApp } from "@/lib/contexts/app-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from "lucide-react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export default function InsightsPage() {
  const router = useRouter()
  const { state: authState } = useAuth()
  const { state: appState } = useApp()

  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.push("/login")
    }
  }, [authState.isAuthenticated, router])

  if (!authState.isAuthenticated) {
    return null
  }

  // Calculate spending by category
  const categorySpending = appState.transactions.reduce((acc, txn) => {
    acc[txn.category] = (acc[txn.category] || 0) + txn.amount
    return acc
  }, {})

  const categoryData = Object.entries(categorySpending).map(([name, value]) => ({
    name,
    value,
  }))

  // Monthly spending trend
  const monthlyData = [
    { month: "Jan", spending: 45000, budget: 50000 },
    { month: "Feb", spending: 52000, budget: 50000 },
    { month: "Mar", spending: 48000, budget: 50000 },
    { month: "Apr", spending: 55000, budget: 50000 },
    { month: "May", spending: 47000, budget: 50000 },
    { month: "Jun", spending: 51000, budget: 50000 },
  ]

  // Top merchants
  const merchantSpending = appState.transactions.reduce((acc, txn) => {
    acc[txn.merchant] = (acc[txn.merchant] || 0) + txn.amount
    return acc
  }, {})

  const topMerchants = Object.entries(merchantSpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, amount]) => ({ name, amount }))

  const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Insights and recommendations
  const insights = [
    {
      type: "warning",
      title: "High Spending Alert",
      description: "Your spending this month is 10% higher than last month",
      icon: AlertCircle,
      color: "text-amber-400",
    },
    {
      type: "success",
      title: "Payment Streak",
      description: "You've paid on time for 3 consecutive months!",
      icon: CheckCircle,
      color: "text-emerald-400",
    },
    {
      type: "info",
      title: "Category Insight",
      description: "Food & Dining is your highest spending category",
      icon: TrendingUp,
      color: "text-blue-400",
    },
    {
      type: "tip",
      title: "Savings Opportunity",
      description: "You could save ₹5,000/month by reducing dining out",
      icon: TrendingDown,
      color: "text-violet-400",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </Button>
            <h1 className="text-2xl font-bold text-white">Insights & Analytics</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {insights.map((insight, index) => {
            const Icon = insight.icon
            return (
              <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <Icon className={`w-8 h-8 ${insight.color} mb-4`} />
                <h3 className="text-white font-semibold mb-2">{insight.title}</h3>
                <p className="text-zinc-300 text-sm">{insight.description}</p>
              </div>
            )
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Spending Trend */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Monthly Spending Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    color: "#fafafa",
                  }}
                  labelStyle={{ color: "#fafafa" }}
                  itemStyle={{ color: "#fafafa" }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Legend />
                <Line type="monotone" dataKey="spending" stroke="#8b5cf6" strokeWidth={2} name="Spending" />
                <Line
                  type="monotone"
                  dataKey="budget"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Budget"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Spending by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    color: "#fafafa",
                  }}
                  labelStyle={{ color: "#fafafa" }}
                  itemStyle={{ color: "#fafafa" }}
                  formatter={(value) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Merchants */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Top Merchants</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topMerchants}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="name" stroke="#71717a" />
              <YAxis stroke="#71717a" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  color: "#fafafa",
                }}
                labelStyle={{ color: "#fafafa" }}
                itemStyle={{ color: "#fafafa" }}
                formatter={(value) => formatCurrency(value)}
              />
              <Bar dataKey="amount" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Spending Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-300 text-sm mb-2">Average Monthly Spend</p>
            <p className="text-3xl font-bold text-white mb-1">{formatCurrency(49667)}</p>
            <div className="flex items-center gap-1 text-emerald-400 text-sm">
              <TrendingDown className="w-4 h-4" />
              <span>5% vs last month</span>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-300 text-sm mb-2">Highest Category</p>
            <p className="text-3xl font-bold text-white mb-1">Food & Dining</p>
            <p className="text-zinc-300 text-sm">{formatCurrency(18500)} this month</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-300 text-sm mb-2">Savings Potential</p>
            <p className="text-3xl font-bold text-violet-400 mb-1">{formatCurrency(5000)}</p>
            <p className="text-zinc-300 text-sm">Based on spending patterns</p>
          </div>
        </div>
      </main>
    </div>
  )
}
