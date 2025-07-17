import { db } from "./index"
import {
  userTable,
  communityTable,
  eventTable,
  usersInCommunityTable,
} from "./schema"
import { eq } from "drizzle-orm"

async function seed() {
  console.log("🌱 Starting database seed...")

  try {
    // Clear existing data (optional - comment out if you want to preserve existing data)
    // await db.delete(usersInCommunityTable)
    // await db.delete(eventTable)
    // await db.delete(communityTable)
    // await db.delete(userTable)
    // console.log("🧹 Cleared existing data")

    // Insert sample users
    const users = await db
      .insert(userTable)
      .values([
        {
          id: "user_1",
          name: "John Doe",
          email: "john@example.com",
          emailVerified: true,
          image:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-01-15"),
        },
        {
          id: "user_2",
          name: "Jane Smith",
          email: "jane@example.com",
          emailVerified: true,
          image:
            "https://images.unsplash.com/photo-1494790108755-2616b9a0b1be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
          createdAt: new Date("2024-01-20"),
          updatedAt: new Date("2024-01-20"),
        },
        {
          id: "user_3",
          name: "Mike Johnson",
          email: "mike@example.com",
          emailVerified: true,
          image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
          createdAt: new Date("2024-02-01"),
          updatedAt: new Date("2024-02-01"),
        },
        {
          id: "user_4",
          name: "Sarah Wilson",
          email: "sarah@example.com",
          emailVerified: true,
          image:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
          createdAt: new Date("2024-02-05"),
          updatedAt: new Date("2024-02-05"),
        },
      ])
      .returning()

    console.log(`✅ Created ${users.length} users`)

    // Insert sample communities
    const communities = await db
      .insert(communityTable)
      .values([
        {
          name: "React Developers",
          slug: "react-developers",
          description:
            "A community for React developers to share knowledge and collaborate",
          logoUrl:
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
          homeUrl: "https://reactjs.org",
          verified: true,
        },
        {
          name: "JavaScript Enthusiasts",
          slug: "javascript-enthusiasts",
          description:
            "Everything JavaScript - from vanilla JS to modern frameworks",
          logoUrl:
            "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
          homeUrl: "https://javascript.com",
          verified: true,
        },
        {
          name: "DevOps Community",
          slug: "devops-community",
          description:
            "Best practices for DevOps, CI/CD, and cloud infrastructure",
          logoUrl:
            "https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
          homeUrl: "https://devops.com",
          verified: false,
        },
        {
          name: "Web3 Builders",
          slug: "web3-builders",
          description:
            "Building the decentralized future with blockchain and Web3 technologies",
          logoUrl:
            "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
          homeUrl: "https://web3.foundation",
          verified: false,
        },
        {
          name: "Python Developers",
          slug: "python-developers",
          description: "Python programming community for all skill levels",
          logoUrl:
            "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
          homeUrl: "https://python.org",
          verified: true,
        },
      ])
      .returning()

    console.log(`✅ Created ${communities.length} communities`)

    // Insert sample events
    const events = await db
      .insert(eventTable)
      .values([
        {
          name: "React Conference 2025",
          description:
            "The biggest React conference of the year featuring talks from core team members and industry leaders",
          date: "2025-09-15",
          dateEnd: "2025-09-17",
          eventUrl: "https://reactconf.com",
          cfpUrl: "https://reactconf.com/cfp",
          cfpClosingDate: "2025-06-01",
          mode: "hybrid",
          city: "San Francisco",
          country: "USA",
          tags: ["React", "Frontend", "JavaScript", "Web Development"],
          draft: false,
          communityId: communities[0].id,
        },
        {
          name: "JS Nation 2025",
          description:
            "Two days of JavaScript talks, workshops, and networking with the community",
          date: "2025-06-01",
          dateEnd: "2025-06-02",
          eventUrl: "https://jsnation.com",
          cfpUrl: "https://jsnation.com/cfp",
          cfpClosingDate: "2025-03-15",
          mode: "in-person",
          city: "Amsterdam",
          country: "Netherlands",
          tags: ["JavaScript", "Node.js", "Frontend", "Backend"],
          draft: false,
          communityId: communities[1].id,
        },
        {
          name: "DevOps Days Berlin",
          description:
            "Learn about the latest DevOps practices and tools from industry experts",
          date: "2025-10-20",
          dateEnd: "2025-10-21",
          eventUrl: "https://devopsdays.org/events/2025-berlin",
          cfpUrl: "https://devopsdays.org/events/2025-berlin/propose",
          cfpClosingDate: "2025-08-01",
          mode: "in-person",
          city: "Berlin",
          country: "Germany",
          tags: ["DevOps", "CI/CD", "Cloud", "Infrastructure"],
          draft: false,
          communityId: communities[2].id,
        },
        {
          name: "Web3 Summit",
          description:
            "Exploring the future of decentralized web and blockchain technologies",
          date: "2025-11-10",
          dateEnd: "2025-11-12",
          eventUrl: "https://web3summit.com",
          cfpUrl: "https://web3summit.com/speakers",
          cfpClosingDate: "2025-09-01",
          mode: "hybrid",
          city: "Lisbon",
          country: "Portugal",
          tags: ["Blockchain", "DeFi", "NFT", "Crypto", "Web3"],
          draft: false,
          communityId: communities[3].id,
        },
        {
          name: "PyCon 2025",
          description:
            "The largest annual gathering for the Python programming community",
          date: "2025-05-15",
          dateEnd: "2025-05-23",
          eventUrl: "https://pycon.org",
          cfpUrl: "https://pycon.org/2025/speaking",
          cfpClosingDate: "2025-02-01",
          mode: "in-person",
          city: "Pittsburgh",
          country: "USA",
          tags: ["Python", "Machine Learning", "Data Science", "Backend"],
          draft: false,
          communityId: communities[4].id,
        },
        {
          name: "React Native EU",
          description:
            "European React Native conference focusing on mobile development",
          date: "2025-09-01",
          dateEnd: "2025-09-02",
          eventUrl: "https://react-native.eu",
          cfpUrl: "https://react-native.eu/cfp",
          cfpClosingDate: "2025-06-15",
          mode: "in-person",
          city: "Warsaw",
          country: "Poland",
          tags: ["React Native", "Mobile", "iOS", "Android"],
          draft: false,
          communityId: communities[0].id,
        },
        {
          name: "TypeScript Congress",
          description:
            "Online conference dedicated to TypeScript and type-safe development",
          date: "2025-04-10",
          dateEnd: "2025-04-11",
          eventUrl: "https://typescriptcongress.com",
          cfpUrl: "https://typescriptcongress.com/cfp",
          cfpClosingDate: "2025-01-31",
          mode: "online",
          city: null,
          country: null,
          tags: ["TypeScript", "JavaScript", "Types", "Development"],
          draft: false,
          communityId: communities[1].id,
        },
        {
          name: "Kubernetes Community Days",
          description:
            "Community-driven event focused on Kubernetes and container orchestration",
          date: "2025-08-15",
          dateEnd: "2025-08-16",
          eventUrl: "https://kubernetescommunitydays.org",
          cfpUrl: "https://kubernetescommunitydays.org/cfp",
          cfpClosingDate: "2025-06-01",
          mode: "in-person",
          city: "London",
          country: "UK",
          tags: ["Kubernetes", "Docker", "Containers", "DevOps"],
          draft: false,
          communityId: communities[2].id,
        },
        {
          name: "DeFi Innovation Summit",
          description:
            "Exploring the latest innovations in decentralized finance",
          date: "2025-12-05",
          dateEnd: "2025-12-06",
          eventUrl: "https://defiinnovation.com",
          cfpUrl: "https://defiinnovation.com/speak",
          cfpClosingDate: "2025-10-01",
          mode: "hybrid",
          city: "Dubai",
          country: "UAE",
          tags: ["DeFi", "Blockchain", "Finance", "Cryptocurrency"],
          draft: true,
          communityId: communities[3].id,
        },
        {
          name: "AI & Python Workshop",
          description:
            "Hands-on workshop on AI and machine learning with Python",
          date: "2025-07-20",
          dateEnd: "2025-07-21",
          eventUrl: "https://aipython.workshop",
          cfpUrl: null,
          cfpClosingDate: null,
          mode: "online",
          city: null,
          country: null,
          tags: ["Python", "AI", "Machine Learning", "Workshop"],
          draft: false,
          communityId: communities[4].id,
        },
      ])
      .returning()

    console.log(`✅ Created ${events.length} events`)

    // Create user-community relationships
    await db.insert(usersInCommunityTable).values([
      // John Doe (user_1) memberships
      { userId: "user_1", communityId: communities[0].id, role: "admin" },
      { userId: "user_1", communityId: communities[1].id, role: "member" },
      { userId: "user_1", communityId: communities[2].id, role: "member" },

      // Jane Smith (user_2) memberships
      { userId: "user_2", communityId: communities[0].id, role: "member" },
      { userId: "user_2", communityId: communities[1].id, role: "admin" },
      { userId: "user_2", communityId: communities[4].id, role: "member" },

      // Mike Johnson (user_3) memberships
      { userId: "user_3", communityId: communities[2].id, role: "admin" },
      { userId: "user_3", communityId: communities[3].id, role: "member" },

      // Sarah Wilson (user_4) memberships
      { userId: "user_4", communityId: communities[3].id, role: "admin" },
      { userId: "user_4", communityId: communities[4].id, role: "admin" },
      { userId: "user_4", communityId: communities[0].id, role: "member" },
    ])

    console.log("✅ Created user-community relationships")

    console.log("🎉 Database seeding completed successfully!")
    console.log("\nSeeded data summary:")
    console.log(`- ${users.length} users`)
    console.log(`- ${communities.length} communities`)
    console.log(`- ${events.length} events`)
    console.log("- User-community relationships established")
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
