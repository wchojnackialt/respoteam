import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get("roomId")

    if (!roomId) {
      return NextResponse.json({ error: "Research room ID is required" }, { status: 400 })
    }

    const discussions = await prisma.discussion.findMany({
      where: {
        roomId: Number.parseInt(roomId),
      },
      include: {
        answers: true,
        _count: {
          select: {
            responses: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(discussions)
  } catch (error) {
    console.error("Error fetching discussions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { title, details, type, allowMultiple, askForComments, showOtherResponses, roomId, answers } =
      await request.json()

    if (!title || !roomId || !answers || !answers.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const discussion = await prisma.discussion.create({
      data: {
        title,
        details,
        type: type || "close-ended",
        allowMultiple: allowMultiple || false,
        askForComments: askForComments || true,
        showOtherResponses: showOtherResponses || false,
        roomId: Number.parseInt(roomId),
        answers: {
          create: answers.map((answer: string) => ({
            text: answer,
          })),
        },
      },
      include: {
        answers: true,
      },
    })

    return NextResponse.json(discussion)
  } catch (error) {
    console.error("Error creating discussion:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

