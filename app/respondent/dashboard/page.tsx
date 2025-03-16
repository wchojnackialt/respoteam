"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Discussion {
  id: number
  title: string
  date: string
  responses: number
  results: { label: string; value: number }[]
}

export default function RespondentDashboardPage() {
  const [todoDiscussions, setTodoDiscussions] = useState<Discussion[]>([])
  const [ongoingDiscussions, setOngoingDiscussions] = useState<Discussion[]>([])
  const [points, setPoints] = useState(0)

  useEffect(() => {
    const storedDiscussions = JSON.parse(localStorage.getItem("discussions") || "[]")
    const respondentResponses = JSON.parse(localStorage.getItem("respondentResponses") || "[]")

    const todo = storedDiscussions.filter(
      (d: Discussion) => !respondentResponses.some((r: { discussionId: number }) => r.discussionId === d.id),
    )
    const ongoing = storedDiscussions.filter((d: Discussion) =>
      respondentResponses.some((r: { discussionId: number }) => r.discussionId === d.id),
    )

    setTodoDiscussions(todo)
    setOngoingDiscussions(ongoing)
    setPoints(respondentResponses.length) // 1 point per response
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/respondent/dashboard" className="text-2xl font-bold text-pink-500">
            iHome
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Matthew</span>
            <span className="text-sm font-medium">Respondent score: {points}</span>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded">
          <p className="font-bold">You received a reward!</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>To do</CardTitle>
          </CardHeader>
          <CardContent>
            {todoDiscussions.map((discussion) => (
              <Link href={`/respondent/discussions/${discussion.id}`} key={discussion.id}>
                <div className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <p className="text-sm text-muted-foreground">iHome main screen redesign</p>
                    <p className="font-medium">{discussion.title}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-muted-foreground mr-2">{discussion.date}</span>
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">New!</span>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ongoing discussions</CardTitle>
          </CardHeader>
          <CardContent>
            {ongoingDiscussions.map((discussion) => (
              <Link href={`/respondent/discussions/${discussion.id}`} key={discussion.id}>
                <div className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <p className="text-sm text-muted-foreground">iHome main screen redesign</p>
                    <p className="font-medium">{discussion.title}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">{discussion.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

