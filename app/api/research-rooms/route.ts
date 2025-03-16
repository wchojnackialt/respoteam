import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const researchRooms = await prisma.researchRoom.findMany({
      include: {
        _count: {
          select: {
            moderators: true,
            respondents: true,
            discussions: true,
          },
        },
      },
    })

    return NextResponse.json(researchRooms)
  } catch (error) {
    console.error("Error fetching research rooms:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const researchRoom = await prisma.researchRoom.create({
      data: {
        name,
        description,
      },
    })

    return NextResponse.json(researchRoom)
  } catch (error) {
    console.error("Error creating research room:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

