import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import * as bcrypt from "bcrypt"

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json()

    if (!email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let user

    if (role === "moderator") {
      user = await prisma.moderator.findUnique({
        where: { email },
        include: { researchRoom: true },
      })
    } else if (role === "respondent") {
      user = await prisma.respondent.findUnique({
        where: { email },
        include: { researchRoom: true },
      })
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Don't send the password back to the client
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      role,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

