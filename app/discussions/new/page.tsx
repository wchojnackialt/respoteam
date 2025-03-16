"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserRound, LogOut } from "lucide-react"

export default function NewDiscussionPage() {
  const router = useRouter()
  const [question, setQuestion] = useState("")
  const [details, setDetails] = useState("")
  const [answers, setAnswers] = useState("")
  const [allowMultiple, setAllowMultiple] = useState(false)
  const [askForComments, setAskForComments] = useState(true)
  const [showOtherResponses, setShowOtherResponses] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newDiscussion = {
      id: Date.now(),
      title: question,
      details: details,
      answers: answers.split("\n").filter((answer) => answer.trim() !== ""),
      allowMultiple: allowMultiple,
      askForComments: askForComments,
      showOtherResponses: showOtherResponses,
      date: new Date().toLocaleDateString(),
      responses: 0,
      results: answers
        .split("\n")
        .filter((answer) => answer.trim() !== "")
        .map((answer) => ({ label: answer.trim(), value: 0 })),
    }

    const existingDiscussions = JSON.parse(localStorage.getItem("discussions") || "[]")
    existingDiscussions.unshift(newDiscussion)
    localStorage.setItem("discussions", JSON.stringify(existingDiscussions))

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="bg-white border-b">
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
        <h1 className="text-3xl font-bold mb-6">Start new discussion</h1>

        <Tabs defaultValue="close-ended" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="open-ended">Open-ended question</TabsTrigger>
            <TabsTrigger value="close-ended">Close-ended question</TabsTrigger>
            <TabsTrigger value="concept-rating">Concept rating</TabsTrigger>
          </TabsList>

          <TabsContent value="close-ended" className="mt-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="question">Question (discussion title)</Label>
                  <Input
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Enter your question here"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="details">Question details</Label>
                  <Textarea
                    id="details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Add more context or instructions here"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="answers">Available answers</Label>
                  <Textarea
                    id="answers"
                    value={answers}
                    onChange={(e) => setAnswers(e.target.value)}
                    placeholder="Enter each answer on a new line"
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allowMultiple"
                      checked={allowMultiple}
                      onCheckedChange={(checked) => setAllowMultiple(checked as boolean)}
                    />
                    <Label htmlFor="allowMultiple">Allow multiple choice</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="askForComments"
                      checked={askForComments}
                      onCheckedChange={(checked) => setAskForComments(checked as boolean)}
                    />
                    <Label htmlFor="askForComments">Ask for comments</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showOtherResponses"
                      checked={showOtherResponses}
                      onCheckedChange={(checked) => setShowOtherResponses(checked as boolean)}
                    />
                    <Label htmlFor="showOtherResponses">
                      Let respondents see and comment others' responses after they answer.
                    </Label>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Start discussion
                </Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="open-ended">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-center text-muted-foreground">Open-ended question form will be implemented soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="concept-rating">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-center text-muted-foreground">Concept rating form will be implemented soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

