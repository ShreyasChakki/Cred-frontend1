"use client"

import { Sidebar } from "@/components/sidebar"
import { useAuth } from "@/lib/contexts/auth-context"
import { useApp } from "@/lib/contexts/app-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, CreditCard, Moon, Sun } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { state: authState, dispatch: authDispatch } = useAuth()
  const { state: appState, dispatch: appDispatch } = useApp()
  const { toast } = useToast()

  const [name, setName] = useState(authState.user?.name || "")
  const [email, setEmail] = useState(authState.user?.email || "")
  const [phone, setPhone] = useState(authState.user?.phone || "")
  const [notifications, setNotifications] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)

  const handleSaveProfile = () => {
    authDispatch({
      type: "UPDATE_USER",
      payload: { name, email, phone },
    })
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    })
  }

  const handleToggleTheme = () => {
    appDispatch({ type: "TOGGLE_THEME" })
    toast({
      title: appState.theme === "dark" ? "Light mode enabled" : "Dark mode enabled",
      description: "Theme preference saved",
    })
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <main className="ml-64 flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-zinc-300">Manage your account settings and preferences</p>
        </div>

        <div className="space-y-6 max-w-3xl">
          {/* Profile Settings */}
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                <User className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                <p className="text-sm text-zinc-300">Update your personal details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-white">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-white">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <Button onClick={handleSaveProfile} className="bg-violet-600 hover:bg-violet-700 text-white">
                Save Changes
              </Button>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Bell className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Notifications</h2>
                <p className="text-sm text-zinc-300">Manage your notification preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Payment Reminders</p>
                  <p className="text-sm text-zinc-300">Get notified before bill due dates</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <Separator className="bg-zinc-800" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Transaction Alerts</p>
                  <p className="text-sm text-zinc-300">Receive alerts for every transaction</p>
                </div>
                <Switch checked={true} />
              </div>
              <Separator className="bg-zinc-800" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Rewards Updates</p>
                  <p className="text-sm text-zinc-300">Get notified about new rewards</p>
                </div>
                <Switch checked={true} />
              </div>
            </div>
          </Card>

          {/* Security */}
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Security</h2>
                <p className="text-sm text-zinc-300">Manage your security settings</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-zinc-300">Add an extra layer of security</p>
                </div>
                <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
              </div>
              <Separator className="bg-zinc-800" />
              <div>
                <Button variant="outline" className="border-zinc-700 bg-transparent text-white hover:bg-zinc-800">
                  Change Password
                </Button>
              </div>
            </div>
          </Card>

          {/* Appearance */}
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                {appState.theme === "dark" ? (
                  <Moon className="h-5 w-5 text-amber-400" />
                ) : (
                  <Sun className="h-5 w-5 text-amber-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Appearance</h2>
                <p className="text-sm text-zinc-300">Customize how the app looks</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Dark Mode</p>
                <p className="text-sm text-zinc-300">Toggle between light and dark theme</p>
              </div>
              <Switch checked={appState.theme === "dark"} onCheckedChange={handleToggleTheme} />
            </div>
          </Card>

          {/* Card Management */}
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Card Management</h2>
                <p className="text-sm text-zinc-300">Manage your linked cards</p>
              </div>
            </div>

            <div className="space-y-3">
              {appState.cards.map((card) => (
                <div key={card.id} className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/50">
                  <div>
                    <p className="font-medium text-white">{card.bankName}</p>
                    <p className="text-sm text-zinc-300">{card.cardNumber}</p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      card.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-700 text-zinc-400"
                    }`}
                  >
                    {card.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
