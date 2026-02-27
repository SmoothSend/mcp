# @smoothsend/mcp

MCP (Model Context Protocol) server for SmoothSend. Enables AI assistants in Cursor, Claude Desktop, Windsurf, and other MCP-compatible tools to help developers integrate gasless transactions on Aptos.

## What it does

Once configured, AI assistants in your editor can:
- Answer questions about the SmoothSend SDK and API
- Generate integration code for any use case
- Estimate monthly credit costs based on your transaction volume
- Look up Aptos mainnet token addresses (USDC, USDT, WBTC, USDe, USD1)
- Pull up full documentation for any section (installation, quickstart, examples, billing)

## Install

```bash
npm install -g @smoothsend/mcp
```

Or run directly with npx (no install needed):

```bash
npx @smoothsend/mcp
```

## Configure

### Cursor

Add to `~/.cursor/mcp.json` (or your project's `.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "smoothsend": {
      "command": "npx",
      "args": ["@smoothsend/mcp"]
    }
  }
}
```

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

```json
{
  "mcpServers": {
    "smoothsend": {
      "command": "npx",
      "args": ["@smoothsend/mcp"]
    }
  }
}
```

### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "smoothsend": {
      "command": "npx",
      "args": ["@smoothsend/mcp"]
    }
  }
}
```

## Tools

| Tool | Description |
|------|-------------|
| `get_docs` | Get documentation for a section: `overview`, `installation`, `quickstart`, `api-reference`, `examples`, `billing` |
| `estimate_credits` | Estimate monthly credits given `gas_used`, `gas_unit_price`, `apt_price_usd`, and `volume` |
| `get_token_address` | Get Aptos mainnet asset address for `USDC`, `USDT`, `WBTC`, `USDe`, `USD1` |
| `get_code_snippet` | Get a code snippet: `wallet-adapter-setup`, `script-composer-usdc`, `fee-preview`, `error-handling`, `testnet-setup` |

## Resources

Resources are doc pages that AI assistants can read directly:

| URI | Content |
|-----|---------|
| `smoothsend://docs/overview` | Overview, quick start, pricing |
| `smoothsend://docs/installation` | Installation guide |
| `smoothsend://docs/quickstart` | Step-by-step quickstart |
| `smoothsend://docs/api-reference` | Full API reference |
| `smoothsend://docs/examples` | Real-world code examples |
| `smoothsend://docs/billing` | Pricing and credit details |

## Example prompts

Once configured, try asking your AI assistant:

- *"How do I add SmoothSend to my Next.js app?"*
- *"Show me how to send USDC without the user needing APT"*
- *"My dApp does ~5000 contract calls per month at 200 gas each. How much will SmoothSend cost?"*
- *"What's the USDC asset address on Aptos mainnet?"*
- *"How do I handle SmoothSend errors when credits run out?"*

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Type check
npm run typecheck

# Run locally
node dist/index.js
```

## Links

- Dashboard: https://dashboard.smoothsend.xyz
- Docs: https://docs.smoothsend.xyz
- npm: https://www.npmjs.com/package/@smoothsend/sdk