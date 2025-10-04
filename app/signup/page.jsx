"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/lib/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { dispatch } = useAuth()
  const { toast } = useToast()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      dispatch({
        type: "LOGIN",
        payload: {
          id: "user123",
          name: name,
          email: email,
          phone: phone,
          rewardPoints: 0,
          tier: "Silver",
          creditScore: 700,
          createdAt: new Date().toISOString(),
        },
      })

      toast({
        title: "Account created!",
        description: "Welcome to CRED",
      })

      router.push("/dashboard")
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-zinc-900 border-zinc-800">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-violet-500 mb-2">CRED</h1>
          <h2 className="text-2xl font-bold mb-2 text-white">Create Account</h2>
          <p className="text-zinc-400">Join CRED and manage your credit cards</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-zinc-200">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="mt-2 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-zinc-200">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="mt-2 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-zinc-200">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
              className="mt-2 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-zinc-200">
              Password
            </Label>
            <div className="relative mt-2">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-zinc-800 border-zinc-700 pr-10 text-white placeholder:text-zinc-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-400 hover:text-violet-300">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  )
}
