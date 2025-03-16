import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  // Create research rooms
  const iHomeRoom = await prisma.researchRoom.create({
    data: {
      name: "iHome Research",
      description: "Research for iHome main screen redesign",
    },
  })

  const techRoom = await prisma.researchRoom.create({
    data: {
      name: "Tech Innovations",
      description: "Research for upcoming tech products",
    },
  })

  // Create moderators
  const moderator1 = await prisma.moderator.create({
    data: {
      email: "moderator1@example.com",
      name: "John Moderator",
      password: await bcrypt.hash("password123", 10),
      roomId: iHomeRoom.id,
    },
  })

  const moderator2 = await prisma.moderator.create({
    data: {
      email: "moderator2@example.com",
      name: "Jane Moderator",
      password: await bcrypt.hash("password123", 10),
      roomId: techRoom.id,
    },
  })

  // Create respondents
  const respondent1 = await prisma.respondent.create({
    data: {
      email: "paul@example.com",
      name: "Paul T. Anderson",
      password: await bcrypt.hash("password123", 10),
      roomId: iHomeRoom.id,
    },
  })

  const respondent2 = await prisma.respondent.create({
    data: {
      email: "mark@example.com",
      name: "Mark Hamill",
      password: await bcrypt.hash("password123", 10),
      roomId: iHomeRoom.id,
    },
  })

  const respondent3 = await prisma.respondent.create({
    data: {
      email: "rashida@example.com",
      name: "Rashida Nahamapesapelon",
      password: await bcrypt.hash("password123", 10),
      roomId: iHomeRoom.id,
    },
  })

  // Create discussions
  const discussion1 = await prisma.discussion.create({
    data: {
      title: "What do you forget the most when leaving the house?",
      details:
        "We aren't the best about remembering to shut lights off, and our apartment's utility bill shows that. It's not that we don't care about it—conserving global energy and saving money on our bills are both at the top of our priorities—but we're just not good at it.",
      type: "close-ended",
      allowMultiple: false,
      askForComments: true,
      showOtherResponses: true,
      roomId: iHomeRoom.id,
      answers: {
        create: [
          { text: "close windows" },
          { text: "turn off the light" },
          { text: "take the keys" },
          { text: "turn off media devices" },
        ],
      },
    },
  })

  const discussion2 = await prisma.discussion.create({
    data: {
      title: "How do you operate your climate control?",
      details: "We want to understand how users interact with their climate control systems.",
      type: "close-ended",
      allowMultiple: true,
      askForComments: true,
      showOtherResponses: false,
      roomId: iHomeRoom.id,
      answers: {
        create: [
          { text: "serious mistakes" },
          { text: "knobs" },
          { text: "difficult" },
          { text: "cold" },
          { text: "buttons" },
        ],
      },
    },
  })

  // Create responses
  const answers1 = await prisma.answer.findMany({
    where: {
      discussionId: discussion1.id,
    },
  })

  const response1 = await prisma.response.create({
    data: {
      discussionId: discussion1.id,
      respondentId: respondent1.id,
      comment: "I can never remember",
      answers: {
        connect: [{ id: answers1[2].id }], // take the keys
      },
    },
  })

  const response2 = await prisma.response.create({
    data: {
      discussionId: discussion1.id,
      respondentId: respondent2.id,
      comment: "No comment given",
      answers: {
        connect: [{ id: answers1[3].id }], // turn off media devices
      },
    },
  })

  // Update respondent points
  await prisma.respondent.update({
    where: { id: respondent1.id },
    data: { points: 1 },
  })

  await prisma.respondent.update({
    where: { id: respondent2.id },
    data: { points: 1 },
  })

  console.log("Database has been seeded!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

