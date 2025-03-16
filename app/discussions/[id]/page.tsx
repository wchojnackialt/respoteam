"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, UserRound, LogOut } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Discussion {
  id: number
  title: string
  details: string
  date: string
  responses: number
  results: { label: string; value: number }[]
}

interface Response {
  id: number
  user: {
    name: string
    avatar: string
  }
  answer: string
  comment: string
  date: string
}

export default function DiscussionDetailsPage() {
  const { id } = useParams()
  const [discussion, setDiscussion] = useState<Discussion | null>(null)
  const [responses, setResponses] = useState<Response[]>([])
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const storedDiscussions = JSON.parse(localStorage.getItem("discussions") || "[]")
    const foundDiscussion = storedDiscussions.find((d: Discussion) => d.id.toString() === id)
    if (foundDiscussion) {
      setDiscussion(foundDiscussion)
      // In a real app, you'd fetch actual responses here
      setResponses([
        {
          id: 1,
          user: { name: "Paul T. Anderson", avatar: "/placeholder.svg" },
          answer: "take the keys",
          comment: "I can never remember",
          date: "23.05.2016",
        },
        {
          id: 2,
          user: { name: "Mark Hamill", avatar: "/placeholder.svg" },
          answer: "turn off media devices",
          comment: "No comment given",
          date: "23.05.2016",
        },
        {
          id: 3,
          user: { name: "Rashida Nahamapesapelon", avatar: "/placeholder.svg" },
          answer: "turn off media devices",
          comment:
            "I've always just hit the switch on the way out the door. It bothers me, too, to leave lights on in another room and I'll get up to shut them off",
          date: "23.05.2016",
        },
      ])
    }
  }, [id])

  const images = ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"] // Replace with actual image URLs

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="text-2xl font-bold text-pink-500">
            iHome
          </Link>
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
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{discussion?.title ?? "Loading..."}</h1>
        <p className="text-sm text-muted-foreground mb-6">Started {discussion?.date}</p>

        <div className="mb-8">
          <p className="mb-4">{discussion?.details}</p>
          <div className="relative">
            <img
              src={images[currentImage] || "/placeholder.svg"}
              alt={`Discussion image ${currentImage + 1}`}
              className="w-full h-64 object-cover rounded-lg"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-2 transform -translate-y-1/2"
              onClick={() => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-2 transform -translate-y-1/2"
              onClick={() => setCurrentImage((prev) => (prev + 1) % images.length)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <div className="space-y-2">
              {discussion?.results.map((result, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-32 text-sm">{result.label}</div>
                  <div className="flex-1 h-4 bg-pink-100 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500" style={{ width: `${result.value}%` }} />
                  </div>
                  <div className="w-12 text-right text-sm">{result.value}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <h2 className="text-xl font-semibold mb-4">Responses</h2>
        <div className="space-y-4">
          {responses.map((response) => (
            <Card key={response.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={response.user.avatar} alt={response.user.name} />
                    <AvatarFallback>
                      {response.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{response.user.name}</h3>
                      <span className="text-sm text-muted-foreground">{response.date}</span>
                    </div>
                    <p className="text-sm mb-2">{response.answer}</p>
                    <p className="text-sm text-muted-foreground">{response.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

