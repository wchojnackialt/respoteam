import { BarChart3 } from "lucide-react"

export function DiscussionList() {
  const discussions = [
    {
      id: 1,
      title: "How do you operate your climate control?",
      date: "23.05.2016",
      responses: 18,
      status: "Closed",
      results: [
        { label: "serious mistakes", value: 20 },
        { label: "knobs", value: 35 },
        { label: "difficult", value: 60 },
        { label: "cold", value: 40 },
      ],
    },
    {
      id: 2,
      title: "What do you forget the most when leaving the house?",
      date: "23.05.2016",
      responses: 18,
      status: "Closed",
      results: [
        { label: "close windows", value: 25 },
        { label: "turn off lights", value: 30 },
        { label: "take keys", value: 45 },
        { label: "turn off media", value: 35 },
      ],
    },
  ]

  return (
    <div className="space-y-4">
      {discussions.map((discussion) => (
        <div key={discussion.id} className="flex flex-col gap-4 border-b pb-4 last:border-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{discussion.title}</h3>
              <div className="text-sm text-muted-foreground">
                {discussion.date} · {discussion.responses} responses · {discussion.status}
              </div>
            </div>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            {discussion.results.map((result) => (
              <div key={result.label} className="space-y-1">
                <div className="text-sm">{result.label}</div>
                <div className="h-2 rounded-full bg-pink-100">
                  <div className="h-2 rounded-full bg-pink-500" style={{ width: `${result.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

