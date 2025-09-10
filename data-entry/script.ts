import { generateSlug } from "~/lib/utils"
import { db } from "../src/lib/db/index"
import { eventTable } from "../src/lib/db/schema"
import fs from "fs"
import path from "path"
import { CreateEvent, CreateEventSchema } from "~/services/event.schema"

async function loadDataFromJson(): Promise<CreateEvent[]> {
  try {
    const dataPath = path.join(
      path.dirname(new URL(import.meta.url).pathname),
      "data.json",
    )
    const parsedData = JSON.parse(fs.readFileSync(dataPath, "utf8"))
    return CreateEventSchema.array().parse(parsedData)
  } catch (error) {
    console.error("❌ Error loading data from data.json:", error)
    return []
  }
}

async function seed() {
  console.log("🌱 Starting database seed for events...")

  const events = await loadDataFromJson()

  try {
    if (events.length) {
      const insertedEvents = await db
        .insert(eventTable)
        .values(events.map((e) => ({ ...e, slug: generateSlug(e.name, true) })))
        .returning()

      console.log(`✅ Created ${insertedEvents.length} events`)
    } else {
      console.log("⚠️ No events found in data.json")
    }

    console.log("🎉 Database seeding completed successfully!")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log("✅ Seeding process completed")
    process.exit(0)
  })
  .catch((error) => {
    console.error("❌ Seeding process failed:", error)
    process.exit(1)
  })
