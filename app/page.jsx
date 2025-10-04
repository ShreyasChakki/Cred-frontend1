"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { CreditCard, Shield, Zap, TrendingUp, Users, Award, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const router = useRouter()
  const { state } = useAuth()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (state.isAuthenticated) {
      router.push("/dashboard")
    }
  }, [state.isAuthenticated, router])

  if (state.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <CreditCard className="h-8 w-8 text-violet-500" />
              <span className="text-2xl font-bold text-white">CRED</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-zinc-800">
                  Log in
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-violet-600 hover:bg-violet-700 text-white">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 rounded-full text-violet-400 text-sm font-medium border border-violet-500/20">
                <Sparkles className="h-4 w-4" />
                <span>Trusted by 10M+ users</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Manage your credit cards <span className="text-violet-500">smarter</span>
              </h1>
              <p className="text-xl text-zinc-400 leading-relaxed">
                Track spending, earn rewards, and take control of your finances with India's most trusted credit card
                management platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white text-lg px-8 py-6 group">
                    Start Free Today
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className={`relative ${isVisible ? "animate-scale-in" : "opacity-0"} delay-200`}>
              <div className="relative">
                <div className="bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-2xl p-8 border border-violet-500/20 backdrop-blur-sm">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
                      <div className="h-16 w-16 rounded-full bg-violet-500/20 flex items-center justify-center">
                        <CreditCard className="h-8 w-8 text-violet-400" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-400">Total Balance</p>
                        <p className="text-3xl font-bold text-white">₹1,24,500</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
                        <TrendingUp className="h-6 w-6 text-green-400 mb-2" />
                        <p className="text-sm text-zinc-400">Saved</p>
                        <p className="text-xl font-bold text-white">₹12,450</p>
                      </div>
                      <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800">
                        <Award className="h-6 w-6 text-yellow-400 mb-2" />
                        <p className="text-sm text-zinc-400">Rewards</p>
                        <p className="text-xl font-bold text-white">2,340 pts</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Active Users", value: "10M+", icon: Users },
              { label: "Cards Managed", value: "25M+", icon: CreditCard },
              { label: "Rewards Earned", value: "₹500Cr+", icon: Award },
              { label: "Trust Score", value: "4.8/5", icon: Shield },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-zinc-900 rounded-xl border border-zinc-800 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <stat.icon className="h-8 w-8 text-violet-500 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Everything you need to manage credit</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Powerful features designed to help you make the most of your credit cards
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CreditCard,
                title: "Multi-Card Management",
                description: "Manage all your credit cards in one place with real-time tracking and insights.",
              },
              {
                icon: Shield,
                title: "Bank-Level Security",
                description: "Your data is protected with 256-bit encryption and multi-factor authentication.",
              },
              {
                icon: Zap,
                title: "Instant Payments",
                description: "Pay bills instantly with UPI, net banking, or wallet integration.",
              },
              {
                icon: TrendingUp,
                title: "Smart Analytics",
                description: "Get detailed insights into your spending patterns and save more.",
              },
              {
                icon: Award,
                title: "Rewards Tracking",
                description: "Never miss out on rewards points, cashback, or exclusive offers.",
              },
              {
                icon: Users,
                title: "Bill Splitting",
                description: "Split bills with friends and track who owes what effortlessly.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-zinc-900 rounded-2xl border border-zinc-800 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 hover:-translate-y-2 hover:border-violet-500/30"
              >
                <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors border border-violet-500/20">
                  <feature.icon className="h-6 w-6 text-violet-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-violet-600/10 to-purple-600/10 border-y border-violet-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Ready to take control of your finances?</h2>
          <p className="text-xl text-zinc-400 mb-8">
            Join millions of users who trust CRED for smarter credit card management
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white text-lg px-12 py-6 group">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-violet-500" />
              <span className="text-xl font-bold text-white">CRED</span>
            </div>
            <p className="text-zinc-400 text-sm">© 2025 CRED. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
