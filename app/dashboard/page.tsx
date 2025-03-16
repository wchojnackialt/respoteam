"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserRound, LogOut } from "lucide-react"

interface Discussion {
  id: number
  title: string
  date: string
  responses: number
  results?: { label: string; value: number }[]
}

export default function DashboardPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>([])

  useEffect(() => {
    const storedDiscussions = localStorage.getItem("discussions")
    if (storedDiscussions) {
      setDiscussions(JSON.parse(storedDiscussions))
    }
  }, [])

  const respondents = [
    { id: 1, name: "Paul T. Anderson" },
    { id: 2, name: "Mark Hamill" },
    { id: 3, name: "Rashida N." },
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-2xl font-bold text-pink-500">
            iHome
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/respondents" className="text-sm font-medium">
              Respondents
            </Link>
          </nav>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <UserRound className="mr-2 h-4 w-4" />
              <span>Edit account details</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Main Content */}
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Discussions</h1>
          <Button asChild>
            <Link href="/discussions/new">
              <Plus className="mr-2 h-4 w-4" />
              Start new discussion
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-[1fr,300px] gap-6">
          {/* Discussions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Discussions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {discussions.map((discussion) => (
                  <Link href={`/discussions/${discussion.id}`} key={discussion.id} className="block">
                    <div className="space-y-4 border-b pb-4 last:border-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{discussion.title}</h3>
                          <div className="text-sm text-muted-foreground">
                            {discussion.date} · {discussion.responses} responses
                          </div>
                        </div>
                        <BarChart3 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      {discussion.results && (
                        <div className="space-y-2">
                          {discussion.results.map((result, index) => (
                            <div key={index} className="space-y-1">
                              <div className="text-sm">{result.label}</div>
                              <div className="h-2 rounded-full bg-pink-100">
                                <div className="h-2 rounded-full bg-pink-500" style={{ width: `${result.value}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Respondents */}
          <Card>
            <CardHeader>
              <CardTitle>Respondents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  {respondents.map((respondent) => (
                    <div key={respondent.id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" alt={respondent.name} />
                        <AvatarFallback>
                          {respondent.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-sm font-medium">{respondent.name}</div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  Invite Respondents
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

