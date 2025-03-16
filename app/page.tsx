"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserRound, Users } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const { signIn, isLoading, profile } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("respondent")

  // Redirect if already logged in
  if (profile) {
    if (profile.role === "respondent") {
      router.push("/respondent/dashboard")
    } else {
      router.push("/dashboard")
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await signIn(email, password)
    } catch (error) {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-pink-500">iHome Research Platform</CardTitle>
            <CardDescription>Log in to access the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="respondent" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="respondent" className="flex items-center gap-2">
                  <UserRound className="h-4 w-4" />
                  Respondent
                </TabsTrigger>
                <TabsTrigger value="moderator" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Moderator
                </TabsTrigger>
              </TabsList>

              <TabsContent value="respondent">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-respondent">Email</Label>
                    <Input
                      id="email-respondent"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-respondent">Password</Label>
                    <Input
                      id="password-respondent"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Log in as Respondent"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="moderator">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-moderator">Email</Label>
                    <Input
                      id="email-moderator"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-moderator">Password</Label>
                    <Input
                      id="password-moderator"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Log in as Moderator"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

