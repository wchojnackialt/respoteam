import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function RespondentList() {
  const respondents = [
    {
      id: 1,
      name: "Paul T. Anderson",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Mark Hamill",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Rashida Nahamapesapelon",
      image: "/placeholder.svg",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        {respondents.map((respondent) => (
          <div key={respondent.id} className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={respondent.image} alt={respondent.name} />
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
  )
}

