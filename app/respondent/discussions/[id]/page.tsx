"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Discussion {
  id: number
  title: string
  details: string
  answers: string[]
  allowMultiple: boolean
  results: { label: string; value: number }[]
}

export default function DiscussionResponsePage() {
  const router = useRouter()
  const { id } = useParams()
  const [discussion, setDiscussion] = useState<Discussion | null>(null)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [comment, setComment] = useState("")
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const storedDiscussions = JSON.parse(localStorage.getItem("discussions") || "[]")
    const foundDiscussion = storedDiscussions.find((d: Discussion) => d.id.toString() === id)
    if (foundDiscussion) {
      setDiscussion(foundDiscussion)
    }
  }, [id])

  const handleAnswerSelect = (answer: string) => {
    if (discussion?.allowMultiple) {
      setSelectedAnswers((prev) => (prev.includes(answer) ? prev.filter((a) => a !== answer) : [...prev, answer]))
    } else {
      setSelectedAnswers([answer])
    }
  }

  const handleSubmit = () => {
    if (!discussion) return

    // Update the discussion results
    const updatedResults = discussion.results.map((result) => {
      if (selectedAnswers.includes(result.label)) {
        return { ...result, value: result.value + 1 }
      }
      return result
    })

    // Update the discussion in localStorage
    const storedDiscussions = JSON.parse(localStorage.getItem("discussions") || "[]")
    const updatedDiscussions = storedDiscussions.map((d: Discussion) =>
      d.id === discussion.id ? { ...d, results: updatedResults, responses: d.responses + 1 } : d,
    )
    localStorage.setItem("discussions", JSON.stringify(updatedDiscussions))

    // Save the respondent's response
    const respondentResponses = JSON.parse(localStorage.getItem("respondentResponses") || "[]")
    respondentResponses.push({
      discussionId: discussion.id,
      selectedAnswers,
      comment,
      date: new Date().toISOString(),
    })
    localStorage.setItem("respondentResponses", JSON.stringify(respondentResponses))

    router.push("/respondent/dashboard")
  }

  if (!discussion) {
    return <div>Loading...</div>
  }

  const images = ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"] // Replace with actual image URLs

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/respondent/dashboard" className="text-2xl font-bold text-pink-500">
            iHome
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Matthew</span>
            <span className="text-sm font-medium">Respondent score: 92%</span>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{discussion.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>{discussion.details}</p>

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

            <div className="space-y-2">
              <h3 className="font-medium">{discussion.title}</h3>
              <div className="grid grid-cols-2 gap-2">
                {discussion.answers.map((answer) => (
                  <Button
                    key={answer}
                    variant={selectedAnswers.includes(answer) ? "default" : "outline"}
                    onClick={() => handleAnswerSelect(answer)}
                    className="justify-start"
                  >
                    {answer}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Comment</h3>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add your comment here..."
                className="min-h-[100px]"
              />
            </div>

            <Button onClick={handleSubmit} className="w-full">
              Submit
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

