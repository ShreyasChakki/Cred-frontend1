"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy, Star, Crown, Medal, Zap } from "lucide-react"
import { useToast } from "@/components/toast-provider"

const mockRewards = [
  {
    id: 1,
    title: "Amazon Gift Card",
    points: 500,
    value: "₹500",
    image: "/amazon-gift-card.png",
    category: "Shopping",
  },
  {
    id: 2,
    title: "Swiggy Voucher",
    points: 300,
    value: "₹300",
    image: "/food-voucher.jpg",
    category: "Food",
  },
  {
    id: 3,
    title: "Flipkart Voucher",
    points: 750,
    value: "₹1000",
    image: "/shopping-voucher.png",
    category: "Shopping",
  },
  {
    id: 4,
    title: "BookMyShow",
    points: 200,
    value: "₹250",
    image: "/movie-ticket.png",
    category: "Entertainment",
  },
  {
    id: 5,
    title: "Uber Credits",
    points: 400,
    value: "₹500",
    image: "/uber-ride.jpg",
    category: "Travel",
  },
  {
    id: 6,
    title: "Zomato Gold",
    points: 600,
    value: "3 Months",
    image: "/zomato-gold.jpg",
    category: "Food",
  },
]

const leaderboard = [
  { rank: 1, name: "Rahul Sharma", points: 8450, tier: "Platinum" },
  { rank: 2, name: "Priya Patel", points: 7230, tier: "Platinum" },
  { rank: 3, name: "Amit Kumar", points: 6890, tier: "Gold" },
  { rank: 4, name: "Sneha Reddy", points: 5670, tier: "Gold" },
  { rank: 5, name: "You", points: 1240, tier: "Gold" },
  { rank: 6, name: "Vikram Singh", points: 980, tier: "Silver" },
  { rank: 7, name: "Ananya Iyer", points: 750, tier: "Silver" },
]

const tiers = [
  { name: "Bronze", minPoints: 0, color: "from-amber-700 to-amber-900", icon: Medal },
  { name: "Silver", minPoints: 500, color: "from-zinc-400 to-zinc-600", icon: Star },
  { name: "Gold", minPoints: 1000, color: "from-yellow-500 to-yellow-700", icon: Crown },
  { name: "Platinum", minPoints: 5000, color: "from-violet-500 to-purple-700", icon: Trophy },
]

export default function RewardsPage() {
  const router = useRouter()
  const { state: authState, updateUser } = useAuth()
  const { showToast } = useToast()
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.push("/login")
    }
  }, [authState.isAuthenticated, router])

  if (!authState.isAuthenticated) {
    return null
  }

  const userPoints = authState.user?.rewardPoints || 0
  const userTier = authState.user?.tier || "Bronze"

  const currentTierIndex = tiers.findIndex((t) => t.name === userTier)
  const nextTier = tiers[currentTierIndex + 1]
  const progressToNextTier = nextTier
    ? ((userPoints - tiers[currentTierIndex].minPoints) / (nextTier.minPoints - tiers[currentTierIndex].minPoints)) *
      100
    : 100

  const handleRedeem = (reward) => {
    if (userPoints >= reward.points) {
      updateUser({ rewardPoints: userPoints - reward.points })
      showToast(`Successfully redeemed ${reward.title}!`, "success")
    } else {
      showToast(`You need ${reward.points - userPoints} more points`, "error")
    }
  }

  const categories = ["all", "Shopping", "Food", "Entertainment", "Travel"]
  const filteredRewards =
    selectedCategory === "all" ? mockRewards : mockRewards.filter((r) => r.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </Button>
            <h1 className="text-2xl font-bold text-zinc-100">Rewards</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Points Overview */}
        <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white/80 mb-2">Your Reward Points</p>
              <p className="text-5xl font-bold mb-4">{userPoints.toLocaleString()}</p>
              <div className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${tiers[currentTierIndex].color} flex items-center justify-center`}
                >
                  {(() => {
                    const Icon = tiers[currentTierIndex].icon
                    return <Icon className="w-5 h-5 text-white" />
                  })()}
                </div>
                <div>
                  <p className="font-semibold">{userTier} Member</p>
                  {nextTier && (
                    <p className="text-sm text-white/80">
                      {nextTier.minPoints - userPoints} points to {nextTier.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {nextTier && (
              <div className="w-full md:w-64">
                <p className="text-sm text-white/80 mb-2">Progress to {nextTier.name}</p>
                <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progressToNextTier, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-white/80 mt-1">{Math.round(progressToNextTier)}% complete</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rewards Catalog */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-zinc-100">Redeem Rewards</h2>
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    size="sm"
                    variant={selectedCategory === cat ? "default" : "outline"}
                    className={
                      selectedCategory === cat
                        ? "bg-violet-600 hover:bg-violet-700"
                        : "bg-transparent border-zinc-700 text-zinc-400"
                    }
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRewards.map((reward) => (
                <div
                  key={reward.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors"
                >
                  <img
                    src={reward.image || "/placeholder.svg"}
                    alt={reward.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-zinc-100 font-semibold mb-1">{reward.title}</h3>
                        <p className="text-zinc-400 text-sm">{reward.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-violet-400 font-bold">{reward.points}</p>
                        <p className="text-zinc-500 text-xs">points</p>
                      </div>
                    </div>
                    <p className="text-zinc-300 text-lg font-semibold mb-4">Worth {reward.value}</p>
                    <Button
                      className="w-full bg-violet-600 hover:bg-violet-700"
                      disabled={userPoints < reward.points}
                      onClick={() => handleRedeem(reward)}
                    >
                      {userPoints >= reward.points ? "Redeem Now" : `Need ${reward.points - userPoints} more`}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-zinc-100">Leaderboard</h2>
              </div>

              <div className="space-y-3">
                {leaderboard.map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center gap-4 p-3 rounded-lg ${
                      user.name === "You" ? "bg-violet-500/20 border border-violet-500/30" : "bg-zinc-800"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        user.rank === 1
                          ? "bg-yellow-500 text-zinc-900"
                          : user.rank === 2
                            ? "bg-zinc-400 text-zinc-900"
                            : user.rank === 3
                              ? "bg-amber-700 text-white"
                              : "bg-zinc-700 text-zinc-300"
                      }`}
                    >
                      {user.rank}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${user.name === "You" ? "text-violet-400" : "text-zinc-100"}`}>
                        {user.name}
                      </p>
                      <p className="text-zinc-500 text-xs">{user.tier}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-zinc-100 font-bold">{user.points.toLocaleString()}</p>
                      <p className="text-zinc-500 text-xs">points</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-800">
                <h3 className="text-zinc-100 font-semibold mb-3">Earn More Points</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Zap className="w-4 h-4 text-violet-400" />
                    <span>Pay bills on time: +50 pts</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Zap className="w-4 h-4 text-violet-400" />
                    <span>Refer a friend: +200 pts</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Zap className="w-4 h-4 text-violet-400" />
                    <span>Complete profile: +100 pts</span>
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
