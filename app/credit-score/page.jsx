"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, TrendingUp, CheckCircle, AlertCircle } from "lucide-react"

export default function CreditScorePage() {
  const router = useRouter()
  const { state: authState } = useAuth()
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.push("/login")
    }
  }, [authState.isAuthenticated, router])

  useEffect(() => {
    // Animate score on mount
    const targetScore = 750
    const duration = 2000
    const steps = 60
    const increment = targetScore / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= targetScore) {
        setScore(targetScore)
        clearInterval(timer)
      } else {
        setScore(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [])

  if (!authState.isAuthenticated) {
    return null
  }

  const getScoreColor = (score) => {
    if (score >= 750) return "text-emerald-400"
    if (score >= 650) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreRating = (score) => {
    if (score >= 750) return "Excellent"
    if (score >= 650) return "Good"
    if (score >= 550) return "Fair"
    return "Poor"
  }

  const factors = [
    {
      title: "Payment History",
      impact: "High Impact",
      status: "good",
      description: "You've made all payments on time",
      icon: CheckCircle,
    },
    {
      title: "Credit Utilization",
      impact: "High Impact",
      status: "good",
      description: "Using 35% of available credit",
      icon: CheckCircle,
    },
    {
      title: "Credit Age",
      impact: "Medium Impact",
      status: "warning",
      description: "Average age: 2.5 years",
      icon: AlertCircle,
    },
    {
      title: "Credit Mix",
      impact: "Low Impact",
      status: "good",
      description: "Good variety of credit types",
      icon: CheckCircle,
    },
  ]

  const recommendations = [
    "Keep your credit utilization below 30%",
    "Continue making on-time payments",
    "Avoid opening too many new accounts",
    "Monitor your credit report regularly",
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
            <h1 className="text-2xl font-bold text-white">Credit Score</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Score Display */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-8 mb-8">
              <div className="text-center">
                <p className="text-white/80 mb-4">Your Credit Score</p>
                <div className={`text-8xl font-bold mb-4 ${getScoreColor(score)}`}>{score}</div>
                <p className="text-2xl font-semibold text-white mb-2">{getScoreRating(score)}</p>
                <p className="text-white/80">Last updated: Today</p>
              </div>

              <div className="mt-8 bg-white/10 rounded-lg p-4">
                <div className="flex justify-between text-white text-sm mb-2">
                  <span>300</span>
                  <span>500</span>
                  <span>700</span>
                  <span>900</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-1000"
                    style={{ width: `${((score - 300) / 600) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Factors Affecting Score */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Factors Affecting Your Score</h2>
              <div className="space-y-4">
                {factors.map((factor, index) => {
                  const Icon = factor.icon
                  return (
                    <div key={index} className="flex items-start gap-4 p-4 bg-zinc-800 rounded-lg">
                      <Icon
                        className={`w-6 h-6 flex-shrink-0 ${
                          factor.status === "good"
                            ? "text-emerald-400"
                            : factor.status === "warning"
                              ? "text-amber-400"
                              : "text-red-400"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-white font-semibold">{factor.title}</h3>
                          <span className="text-zinc-300 text-sm">{factor.impact}</span>
                        </div>
                        <p className="text-zinc-300 text-sm">{factor.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Recommendations Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-violet-400" />
                <h2 className="text-xl font-bold text-white">Improve Your Score</h2>
              </div>

              <div className="space-y-4 mb-6">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-violet-400 text-sm font-semibold">{index + 1}</span>
                    </div>
                    <p className="text-zinc-200 text-sm">{rec}</p>
                  </div>
                ))}
              </div>

              <Button className="w-full bg-violet-600 hover:bg-violet-700">Get Detailed Report</Button>

              <div className="mt-6 pt-6 border-t border-zinc-800">
                <h3 className="text-white font-semibold mb-3">Score Range</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">300-549</span>
                    <span className="text-red-400 font-semibold">Poor</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">550-649</span>
                    <span className="text-yellow-400 font-semibold">Fair</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">650-749</span>
                    <span className="text-blue-400 font-semibold">Good</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">750-900</span>
                    <span className="text-emerald-400 font-semibold">Excellent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
