import { createServerFn } from "@tanstack/react-start"
import { createServerFileRoute } from "@tanstack/react-start/server"
import z from "zod"
import { auth } from "~/lib/auth/auth"
import { formatDate } from "~/lib/date"
import { getCommunities } from "~/services/community.api"
import { getEvents } from "~/services/event.api"

// MCP Protocol Types
interface MCPRequest {
  jsonrpc: "2.0"
  id?: string | number
  method: string
  params?: any
}

interface MCPResponse {
  jsonrpc: "2.0"
  id?: string | number
  result?: any
  error?: {
    code: number
    message: string
    data?: any
  }
}

interface Tool {
  name: string
  description: string
  inputSchema: {
    type: "object"
    properties?: Record<string, any>
    required?: string[]
  }
}

// Define our time tool
const tools: Tool[] = [
  {
    name: "get_current_time",
    description: "Get the current date and time",
    inputSchema: {
      type: "object",
      properties: {
        timezone: {
          type: "string",
          description:
            "Optional timezone (e.g., 'America/New_York', 'Europe/London'). Defaults to UTC.",
        },
        format: {
          type: "string",
          description:
            "Optional format for the time display. Options: 'iso' (default), 'readable', 'timestamp'",
        },
      },
      required: [],
    },
  },
  {
    name: "get_next_event",
    description:
      "Get the next upcoming tech event, you can filter by tags or topics",
    inputSchema: {
      type: "object",
      properties: {
        tags: {
          type: "array",
          items: {
            type: "string",
          },
          description:
            "Optional array of tags to filter events by. Tags should be lowercase.",
        },
      },
      required: [],
    },
  },
  {
    name: "get_user_upcoming_events",
    description:
      "Get upcoming events for the authenticated user based on their communities",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Optional number of events to return. Defaults to 3.",
          minimum: 1,
          maximum: 10,
        },
      },
      required: [],
    },
  },
]

// Helper function to format time based on requested format
function formatTime(
  date: Date,
  format: string = "iso",
  timezone?: string,
): string {
  const options: Intl.DateTimeFormatOptions = timezone
    ? { timeZone: timezone }
    : {}

  switch (format) {
    case "readable":
      return date.toLocaleString("en-US", {
        ...options,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZoneName: "short",
      })
    case "timestamp":
      return Math.floor(date.getTime() / 1000).toString()
    case "iso":
    default:
      return timezone
        ? new Date(
            date.toLocaleString("en-US", { timeZone: timezone }),
          ).toISOString()
        : date.toISOString()
  }
}

// MCP Request Handlers
function handleListTools(): MCPResponse {
  return {
    jsonrpc: "2.0",
    result: {
      tools: tools,
    },
  }
}

async function handleCallTool(
  params: any,
  headers: Headers,
): Promise<MCPResponse> {
  const { name, arguments: args = {} } = params

  if (name === "get_current_time") {
    const { timezone, format } = args

    const formattedTime = formatTime(new Date(), format, timezone)

    return {
      jsonrpc: "2.0",
      result: {
        content: [
          {
            type: "text",
            text: `Current time: ${formattedTime}${timezone ? ` (${timezone})` : " (UTC)"}`,
          },
        ],
      },
    }
  }

  if (name === "get_next_event") {
    const { tags } = args

    const validTags = z.array(z.string().trim()).optional().safeParse(tags).data

    const upcomingEvents = await getEvents({
      data: {
        startDate: formatDate(new Date()),
        limit: 1,
        tags: validTags,
      },
    })

    if (upcomingEvents.length === 0) {
      const tagsText =
        validTags && validTags.length > 0
          ? ` with tags: ${validTags.join(", ")}`
          : ""
      return {
        jsonrpc: "2.0",
        result: {
          content: [
            {
              type: "text",
              text: `No upcoming events found${tagsText}.`,
            },
          ],
        },
      }
    }

    const event = upcomingEvents[0]
    const tagsText =
      validTags && validTags.length > 0
        ? ` matching tags: ${validTags.join(", ")}`
        : ""
    return {
      jsonrpc: "2.0",
      result: {
        content: [
          {
            type: "text",
            text: `The next event${tagsText} will be ${JSON.stringify(event)}`,
          },
        ],
      },
    }
  }

  if (name === "get_user_upcoming_events") {
    const { limit = 3 } = args

    const session = await auth.api.getMcpSession({
      headers: headers,
    })

    if (!session) {
      throw new Response(null, {
        status: 401,
      })
    }

    const communities = await getCommunities({
      data: { userId: session.userId, ownCommunitiesOnly: true },
    })

    const communityIds = communities.map((c) => c.id)
    const communityNames = communities.map((c) => c.name)

    const upcomingEvents = await getEvents({
      data: {
        communityId: communityIds,
        startDate: formatDate(new Date()),
        limit: Math.min(Math.max(1, limit), 10),
      },
    })

    return {
      jsonrpc: "2.0",
      result: {
        content: [
          {
            type: "text",
            text: `You are part of these communities: ${communityNames.join(", ")}.
These are the upcoming events for the communities you are part of: ${JSON.stringify(upcomingEvents)}`,
          },
        ],
      },
    }
  }

  return {
    jsonrpc: "2.0",
    error: {
      code: -32601,
      message: "Method not found",
      data: { availableTools: tools.map((t) => t.name) },
    },
  }
}

function handleInitialize(): MCPResponse {
  return {
    jsonrpc: "2.0",
    result: {
      protocolVersion: "2024-11-05",
      capabilities: {
        tools: {
          listChanged: false,
        },
      },
      serverInfo: {
        name: "confhub-time-server",
        version: "1.0.0",
      },
    },
  }
}

export const ServerRoute = createServerFileRoute("/api/mcp").methods({
  GET: () => {
    // For GET requests, return server information
    return Response.json({
      name: "ConfHub MCP Time Server",
      version: "1.0.0",
      description: "An MCP server that provides current time information",
      capabilities: ["tools"],
      tools: tools,
    })
  },

  POST: async ({ request }) => {
    try {
      const body: MCPRequest = await request.json()

      // Validate MCP request format
      if (body.jsonrpc !== "2.0") {
        return Response.json({
          jsonrpc: "2.0",
          id: body.id,
          error: {
            code: -32600,
            message: "Invalid Request - jsonrpc must be '2.0'",
          },
        })
      }

      let response: MCPResponse

      // Handle different MCP methods
      switch (body.method) {
        case "initialize":
          response = handleInitialize()
          break
        case "tools/list":
          response = handleListTools()
          break
        case "tools/call":
          response = await handleCallTool(body.params, request.headers)
          break
        default:
          response = {
            jsonrpc: "2.0",
            error: {
              code: -32601,
              message: "Method not found",
              data: {
                availableMethods: ["initialize", "tools/list", "tools/call"],
              },
            },
          }
      }

      // Include request ID in response if provided
      if (body.id !== undefined) {
        response.id = body.id
      }

      return Response.json(response)
    } catch (error) {
      if (error instanceof Response) {
        return error
      }

      return Response.json({
        jsonrpc: "2.0",
        error: {
          code: -32700,
          message: "Parse error",
          data: {
            error: error instanceof Error ? error.message : "Invalid JSON",
          },
        },
      })
    }
  },
})
