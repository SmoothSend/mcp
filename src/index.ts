#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { ALL_RESOURCES } from './docs.js'
import {
  TOOL_DEFINITIONS,
  handleGetDocs,
  handleEstimateCredits,
  handleGetTokenAddress,
  handleGetCodeSnippet,
} from './tools.js'

const server = new Server(
  {
    name: 'smoothsend-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
)

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOL_DEFINITIONS,
}))

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  try {
    let text: string

    switch (name) {
      case 'get_docs':
        text = handleGetDocs(args as { topic: string })
        break

      case 'estimate_credits':
        text = await handleEstimateCredits(
          args as {
            gas_used: number
            gas_unit_price?: number
            apt_price_usd?: number
            volume: number
          }
        )
        break

      case 'get_token_address':
        text = handleGetTokenAddress(args as { symbol: string })
        break

      case 'get_code_snippet':
        text = handleGetCodeSnippet(args as { use_case: string })
        break

      default:
        return {
          content: [{ type: 'text' as const, text: `Unknown tool: ${name}` }],
          isError: true,
        }
    }

    return {
      content: [{ type: 'text' as const, text }],
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text' as const,
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    }
  }
})

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: ALL_RESOURCES.map((r) => ({
    uri: r.uri,
    name: r.name,
    description: r.description,
    mimeType: r.mimeType,
  })),
}))

// Read a resource by URI
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params

  const resource = ALL_RESOURCES.find((r) => r.uri === uri)
  if (!resource) {
    throw new Error(`Resource not found: ${uri}`)
  }

  return {
    contents: [
      {
        uri: resource.uri,
        mimeType: resource.mimeType,
        text: resource.content,
      },
    ],
  }
})

// Start the server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  // MCP servers communicate via stdio — no console.log here
}

main().catch((error) => {
  process.stderr.write(`Fatal error: ${error instanceof Error ? error.message : String(error)}\n`)
  process.exit(1)
})
