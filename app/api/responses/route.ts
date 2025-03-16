import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const discussionId = searchParams.get("discussionId")

    if (!discussionId) {
      return NextResponse.json({ error: "Discussion ID is required" }, { status: 400 })
    }

    const responses = await prisma.response.findMany({
      where: {
        discussionId: Number.parseInt(discussionId),
      },
      include: {
        respondent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        answers: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(responses)
  } catch (error) {
    console.error("Error fetching responses:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { discussionId, respondentId, answerIds, comment } = await request.json()

    if (!discussionId || !respondentId || !answerIds || !answerIds.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if respondent has already responded to this discussion
    const existingResponse = await prisma.response.findFirst({
      where: {
        discussionId: Number.parseInt(discussionId),
        respondentId: Number.parseInt(respondentId),
      },
    })

    if (existingResponse) {
      return NextResponse.json({ error: "You have already responded to this discussion" }, { status: 400 })
    }

    // Create the response
    const response = await prisma.response.create({
      data: {
        discussionId: Number.parseInt(discussionId),
        respondentId: Number.parseInt(respondentId),
        comment,
        answers: {
          connect: answerIds.map((id: number) => ({ id })),
        },
      },
      include: {
        answers: true,
        respondent: true,
      },
    })

    // Increment respondent's points
    await prisma.respondent.update({
      where: {
        id: Number.parseInt(respondentId),
      },
      data: {
        points: {
          increment: 1,
        },
      },
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error creating response:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

