"use client"

import { Sidebar } from "@/components/sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, CreditCard, Gift, TrendingUp, CheckCircle, AlertCircle } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "payment",
    icon: CreditCard,
    title: "Payment Due Soon",
    message: "Your HDFC Bank credit card payment of ₹12,450 is due in 3 days",
    time: "2 hours ago",
    read: false,
    color: "red",
  },
  {
    id: 2,
    type: "reward",
    icon: Gift,
    title: "New Reward Unlocked!",
    message: "You've earned 250 points! Redeem them for exciting rewards",
    time: "5 hours ago",
    read: false,
    color: "violet",
  },
  {
    id: 3,
    type: "transaction",
    icon: CheckCircle,
    title: "Transaction Successful",
    message: "₹2,450 spent at Amazon India",
    time: "1 day ago",
    read: true,
    color: "emerald",
  },
  {
    id: 4,
    type: "credit",
    icon: TrendingUp,
    title: "Credit Score Updated",
    message: "Your credit score increased to 750. Great job!",
    time: "2 days ago",
    read: true,
    color: "blue",
  },
  {
    id: 5,
    type: "alert",
    icon: AlertCircle,
    title: "High Credit Utilization",
    message: "You're using 92% of your credit limit on ICICI Bank card",
    time: "3 days ago",
    read: true,
    color: "amber",
  },
]

export default function NotificationsPage() {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <main className="ml-64 flex-1 p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
            <p className="text-zinc-300">Stay updated with your financial activity</p>
          </div>
          <Button variant="outline" className="border-zinc-700 bg-transparent">
            Mark All as Read
          </Button>
        </div>

        <div className="max-w-3xl space-y-4">
          {notifications.map((notification) => {
            const Icon = notification.icon
            const colorClasses = {
              red: "bg-red-500/20 text-red-400",
              violet: "bg-violet-500/20 text-violet-400",
              emerald: "bg-emerald-500/20 text-emerald-400",
              blue: "bg-blue-500/20 text-blue-400",
              amber: "bg-amber-500/20 text-amber-400",
            }

            return (
              <Card
                key={notification.id}
                className={`p-6 bg-zinc-900 border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer ${
                  !notification.read ? "border-l-4 border-l-violet-500" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[notification.color]}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white">{notification.title}</h3>
                      {!notification.read && <span className="w-2 h-2 rounded-full bg-violet-500" />}
                    </div>
                    <p className="text-zinc-300 text-sm mb-2">{notification.message}</p>
                    <p className="text-zinc-400 text-xs">{notification.time}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {notifications.length === 0 && (
          <Card className="p-12 bg-zinc-900 border-zinc-800 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
            <p className="text-zinc-300">You're all caught up!</p>
          </Card>
        )}
      </main>
    </div>
  )
}
