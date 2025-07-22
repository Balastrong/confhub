import { createServerFileRoute } from "@tanstack/react-start/server"
import { OAuthAccessToken } from "better-auth/plugins"
import { eq } from "drizzle-orm/sql/expressions/conditions"
import { auth } from "~/lib/auth/auth"
import { db } from "~/lib/db"
import { userTable } from "~/lib/db/schema"

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
const timeTools: Tool[] = [
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
      tools: timeTools,
    },
  }
}

async function handleCallTool(
  params: any,
  session: OAuthAccessToken,
): Promise<MCPResponse> {
  const { name, arguments: args = {} } = params

  if (name === "get_current_time") {
    try {
      const now = new Date()
      const { timezone, format } = args

      const formattedTime = formatTime(now, format, timezone)

      const [user] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, session.userId))

      return {
        jsonrpc: "2.0",
        result: {
          content: [
            {
              type: "text",
              text: `Hey ${user.name}, Current time: ${formattedTime}${timezone ? ` (${timezone})` : " (UTC)"}`,
            },
          ],
        },
      }
    } catch (error) {
      return {
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal error",
          data: {
            error: error instanceof Error ? error.message : "Unknown error",
          },
        },
      }
    }
  }

  return {
    jsonrpc: "2.0",
    error: {
      code: -32601,
      message: "Method not found",
      data: { availableTools: timeTools.map((t) => t.name) },
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

export const ServerRoute = createServerFileRoute("/api/mcp2").methods({
  GET: ({ request }) => {
    // For GET requests, return server information
    return Response.json({
      name: "ConfHub MCP Time Server",
      version: "1.0.0",
      description: "An MCP server that provides current time information",
      capabilities: ["tools"],
      tools: timeTools,
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
          // session contains the access token record with scopes and user ID
          const session = await auth.api.getMcpSession({
            headers: request.headers,
          })
          if (!session) {
            //this is important and you must return 401
            return new Response(null, {
              status: 401,
            })
          }

          response = await handleCallTool(body.params, session)
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
