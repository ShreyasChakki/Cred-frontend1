"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, CreditCard, DollarSign, Gift, BarChart3, Settings, LogOut, Bell, TrendingUp, Users } from "lucide-react"
import { useAuth } from "@/lib/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

const navItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: CreditCard, label: "My Cards", path: "/cards" },
  { icon: DollarSign, label: "Payments", path: "/payments" },
  { icon: Gift, label: "Rewards", path: "/rewards" },
  { icon: BarChart3, label: "Insights", path: "/insights" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: TrendingUp, label: "Credit Score", path: "/credit-score" },
  { icon: Users, label: "Bill Split", path: "/split-bill" },
  { icon: Settings, label: "Settings", path: "/settings" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { dispatch } = useAuth()
  const { toast } = useToast()

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" })
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
    router.push("/login")
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-violet-500">CRED</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-zinc-900 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
