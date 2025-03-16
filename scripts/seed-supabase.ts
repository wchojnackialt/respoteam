import { createClient } from "@supabase/supabase-js"

// Replace with your Supabase URL and service role key
const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedDatabase() {
  console.log("Starting database seeding...")

  // Create research rooms
  const { data: iHomeRoom, error: roomError } = await supabase
    .from("research_rooms")
    .insert([
      {
        name: "iHome Research",
        description: "Research for iHome main screen redesign",
      },
    ])
    .select()
    .single()

  if (roomError) {
    console.error("Error creating research room:", roomError)
    return
  }

  console.log("Created research room:", iHomeRoom)

  // Create users
  const users = [
    {
      email: "moderator@example.com",
      password: "password123",
      name: "John Moderator",
      role: "moderator",
      research_room_id: iHomeRoom.id,
    },
    {
      email: "paul@example.com",
      password: "password123",
      name: "Paul T. Anderson",
      role: "respondent",
      research_room_id: iHomeRoom.id,
    },
    {
      email: "mark@example.com",
      password: "password123",
      name: "Mark Hamill",
      role: "respondent",
      research_room_id: iHomeRoom.id,
    },
    {
      email: "rashida@example.com",
      password: "password123",
      name: "Rashida Nahamapesapelon",
      role: "respondent",
      research_room_id: iHomeRoom.id,
    },
  ]

  for (const user of users) {
    // Create user in auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        name: user.name,
        role: user.role,
      },
    })

    if (authError) {
      console.error(`Error creating user ${user.email}:`, authError)
      continue
    }

    // Update profile with research room
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ research_room_id: user.research_room_id })
      .eq("id", authUser.user.id)

    if (profileError) {
      console.error(`Error updating profile for ${user.email}:`, profileError)
    } else {
      console.log(`Created user: ${user.email} (${user.role})`)
    }
  }

  // Create discussions
  const { data: discussion, error: discussionError } = await supabase
    .from("discussions")
    .insert([
      {
        title: "What do you forget the most when leaving the house?",
        details:
          "We aren't the best about remembering to shut lights off, and our apartment's utility bill shows that. It's not that we don't care about it—conserving global energy and saving money on our bills are both at the top of our priorities—but we're just not good at it.",
        type: "close-ended",
        allow_multiple: false,
        ask_for_comments: true,
        show_other_responses: true,
        research_room_id: iHomeRoom.id,
      },
    ])
    .select()
    .single()

  if (discussionError) {
    console.error("Error creating discussion:", discussionError)
    return
  }

  console.log("Created discussion:", discussion)

  // Create answers
  const answers = ["close windows", "turn off the light", "take the keys", "turn off media devices"]

  const { data: createdAnswers, error: answersError } = await supabase
    .from("answers")
    .insert(
      answers.map((text) => ({
        text,
        discussion_id: discussion.id,
      })),
    )
    .select()

  if (answersError) {
    console.error("Error creating answers:", answersError)
    return
  }

  console.log("Created answers:", createdAnswers)

  console.log("Database seeding completed successfully!")
}

seedDatabase().catch((err) => {
  console.error("Error seeding database:", err)
  process.exit(1)
})

