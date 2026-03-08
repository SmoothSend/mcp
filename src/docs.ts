export interface DocResource {
  uri: string
  name: string
  description: string
  mimeType: string
  content: string
}

export const DOCS: Record<string, DocResource> = {
  overview: {
    uri: 'smoothsend://docs/overview',
    name: 'SmoothSend Overview',
    description: 'Overview of SmoothSend, quick start, and pricing',
    mimeType: 'text/markdown',
    content: `# SmoothSend Overview

SmoothSend is a gasless transaction infrastructure platform for Aptos. It lets dApp developers sponsor gas fees for their users — users sign transactions normally but never pay gas. Live on Aptos Mainnet.

## What is SmoothSend?

SmoothSend acts as a relayer: when a user submits a transaction through your dApp, SmoothSend's infrastructure pays the gas fee on their behalf, then deducts that cost (plus a small markup) from your pre-loaded credit balance.

Users get a completely gas-free experience. You pay a small fee per transaction instead of asking users to hold APT.

## Quick Start (3 lines)

\`\`\`typescript
import { SmoothSendTransactionSubmitter } from '@smoothsend/sdk';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';

const smoothSend = new SmoothSendTransactionSubmitter({
  apiKey: process.env.NEXT_PUBLIC_SMOOTHSEND_API_KEY!,
  network: 'mainnet', // or 'testnet' (always free)
});

export function Providers({ children }) {
  return (
    <AptosWalletAdapterProvider
      dappConfig={{ network: Network.MAINNET, transactionSubmitter: smoothSend }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
\`\`\`

After this, every \`signAndSubmitTransaction\` call in your app is automatically gasless — no other code changes needed.

## Key Facts

- 3-line integration using the \`@smoothsend/sdk\` npm package
- Works as a drop-in \`transactionSubmitter\` for \`@aptos-labs/wallet-adapter-react\`
- Testnet is always free — no credits required
- Mainnet fee: MAX(gas_cost_usd × 1.5, $0.01) per transaction
- Secure by default: API key auth, rate limiting, gateway-level validation on every request
- Multi-chain roadmap: Aptos live now, EVM and Stellar coming soon

## Three Integration Methods

### Method 1 — Wallet Adapter (All gasless)
Pass \`SmoothSendTransactionSubmitter\` as the \`transactionSubmitter\` to \`AptosWalletAdapterProvider\`. Every \`signAndSubmitTransaction\` call becomes gasless automatically. Works for any transaction type. Credits deducted from your dashboard balance.

### Method 1b — useSmoothSend Hook (Per-function routing)
Use \`useSmoothSend(submitter)\` when only specific functions should be sponsored. The hook automatically routes each transaction: functions in your Sponsorship Rules allowlist → gasless; others → user pays gas normally. Do NOT use \`transactionSubmitter\` in the provider when using this hook.

### Method 2 — Script Composer (Fee-in-Token)
Use \`ScriptComposerClient\` for stablecoin transfers (USDC, USDT, WBTC, USDe, USD1). The relayer fee (~$0.01) is deducted directly from the token being sent. No APT or SmoothSend credits required.

## Pricing

- Testnet: Always free, no credits required
- Mainnet (Wallet Adapter): MAX(gas_cost_usd × 1.5, $0.01) per transaction
- Mainnet (Script Composer): ~$0.01 deducted from token being sent

## Links

- Dashboard: https://dashboard.smoothsend.xyz
- Docs: https://docs.smoothsend.xyz
- npm: https://www.npmjs.com/package/@smoothsend/sdk
`,
  },

  installation: {
    uri: 'smoothsend://docs/installation',
    name: 'Installation Guide',
    description: 'How to install @smoothsend/sdk and configure it',
    mimeType: 'text/markdown',
    content: `# Installation

## Install the SDK

\`\`\`bash
npm install @smoothsend/sdk
\`\`\`

Or with other package managers:

\`\`\`bash
yarn add @smoothsend/sdk
pnpm add @smoothsend/sdk
bun add @smoothsend/sdk
\`\`\`

## Prerequisites

- Node.js >= 16
- \`@aptos-labs/wallet-adapter-react\` installed (peer dependency for Wallet Adapter method)
- A SmoothSend API key from https://dashboard.smoothsend.xyz

## Get an API Key

1. Go to https://dashboard.smoothsend.xyz
2. Sign in with GitHub
3. Create a new project
4. Copy your API key

## Environment Setup

Add to your \`.env.local\` (or equivalent):

\`\`\`bash
NEXT_PUBLIC_SMOOTHSEND_API_KEY=sk_live_your_key_here
# Use sk_test_ prefix for testnet keys
\`\`\`

> WARNING: Only expose your API key as NEXT_PUBLIC_ if you're building a client-side dApp and are okay with it being visible. For server-side use, keep it as a private env var.

## Verify Installation

\`\`\`typescript
import { SmoothSendTransactionSubmitter } from '@smoothsend/sdk';

const submitter = new SmoothSendTransactionSubmitter({
  apiKey: 'sk_test_your_key',
  network: 'testnet',
});

console.log('SmoothSend SDK ready');
\`\`\`
`,
  },

  quickstart: {
    uri: 'smoothsend://docs/quickstart',
    name: 'Quick Start Guide',
    description: 'Step-by-step guide to go gasless in minutes',
    mimeType: 'text/markdown',
    content: `# Quick Start

Go from zero to gasless in under 5 minutes.

## Step 1 — Install the SDK

\`\`\`bash
npm install @smoothsend/sdk
\`\`\`

## Step 2 — Get an API Key

Sign in at https://dashboard.smoothsend.xyz, create a project, and copy your API key.

## Step 3 — Create the Submitter

In your providers/wallet setup file (\`providers.tsx\` or similar):

\`\`\`typescript
import { SmoothSendTransactionSubmitter } from '@smoothsend/sdk';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { Network } from '@aptos-labs/ts-sdk';

const smoothSend = new SmoothSendTransactionSubmitter({
  apiKey: process.env.NEXT_PUBLIC_SMOOTHSEND_API_KEY!,
  network: 'mainnet',
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AptosWalletAdapterProvider
      dappConfig={{
        network: Network.MAINNET,
        transactionSubmitter: smoothSend,
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
\`\`\`

## Step 4 — Wrap Your App

In your \`app/layout.tsx\` or \`_app.tsx\`:

\`\`\`typescript
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
\`\`\`

## Step 5 — Use Normally

All existing \`signAndSubmitTransaction\` calls are now automatically gasless:

\`\`\`typescript
import { useWallet } from '@aptos-labs/wallet-adapter-react';

function MyComponent() {
  const { signAndSubmitTransaction } = useWallet();

  async function handleTransfer() {
    // This is gasless — no code change needed here
    const response = await signAndSubmitTransaction({
      data: {
        function: '0x1::aptos_account::transfer',
        functionArguments: ['0xRecipient', 100000000],
      },
    });
    console.log('tx hash:', response.hash);
  }
}
\`\`\`

## Testnet (Always Free)

For development, use \`network: 'testnet'\` — no credits required, no billing:

\`\`\`typescript
const smoothSend = new SmoothSendTransactionSubmitter({
  apiKey: process.env.NEXT_PUBLIC_SMOOTHSEND_API_KEY!,
  network: 'testnet',
});
\`\`\`

## Advanced: useSmoothSend Hook (Per-Function Routing)

Use \`useSmoothSend\` when only **specific functions** should be gasless. The hook fetches your project's Sponsorship Rules allowlist and auto-routes each transaction.

**Important:** Do NOT set \`transactionSubmitter\` in \`AptosWalletAdapterProvider\` when using this hook:

\`\`\`typescript
import { useSmoothSend, SmoothSendTransactionSubmitter } from '@smoothsend/sdk';

// Create once at MODULE SCOPE, not inside a component
const submitter = new SmoothSendTransactionSubmitter({
  apiKey: process.env.NEXT_PUBLIC_SMOOTHSEND_API_KEY!,
  network: 'mainnet',
});

function TodoList() {
  const { signAndSubmitTransaction } = useSmoothSend(submitter);

  const handleDelete = async (id: number) => {
    // 'delete_todo' in allowlist → gasless
    // 'create_todo' not in allowlist → user pays gas
    const result = await signAndSubmitTransaction({
      data: {
        function: \`\${MODULE_ADDRESS}::todolist::delete_todo\`,
        functionArguments: [id],
      },
    });
    console.log('Tx hash:', result.hash);
  };
}
\`\`\`
`,
  },

  'api-reference': {
    uri: 'smoothsend://docs/api-reference',
    name: 'API Reference',
    description: 'Full API reference for SmoothSendTransactionSubmitter and ScriptComposerClient',
    mimeType: 'text/markdown',
    content: `# API Reference

## SmoothSendTransactionSubmitter

The main class for wallet adapter integration. Implements Aptos wallet adapter's \`TransactionSubmitter\` interface.

### Constructor

\`\`\`typescript
new SmoothSendTransactionSubmitter(config: SmoothSendConfig)
\`\`\`

**Config options:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| \`apiKey\` | string | Yes | Your SmoothSend API key from dashboard.smoothsend.xyz |
| \`network\` | 'mainnet' \\| 'testnet' | Yes | Aptos network. Testnet is always free |
| \`gatewayUrl\` | string | No | Custom gateway URL (default: https://proxy.smoothsend.xyz) |

### Usage

\`\`\`typescript
import { SmoothSendTransactionSubmitter } from '@smoothsend/sdk';

const submitter = new SmoothSendTransactionSubmitter({
  apiKey: process.env.NEXT_PUBLIC_SMOOTHSEND_API_KEY!,
  network: 'mainnet',
});

// Pass to AptosWalletAdapterProvider as transactionSubmitter
\`\`\`

---

## useSmoothSend Hook

React hook for per-function gasless routing. Sponsored functions (in your Sponsorship Rules allowlist) go gasless; others fall back to user-pays-gas. Drop-in replacement for \`useWallet().signAndSubmitTransaction\`.

### Signature

\`\`\`typescript
import { useSmoothSend } from '@smoothsend/sdk';

const { signAndSubmitTransaction } = useSmoothSend(submitter);
\`\`\`

**Parameter:** \`submitter\` — a \`SmoothSendTransactionSubmitter\` instance. Create it once at module scope (outside the component).

**Returns:** \`{ signAndSubmitTransaction }\` — same call signature as \`useWallet().signAndSubmitTransaction\`. Auto-routes based on Sponsorship Rules.

### Usage

\`\`\`typescript
import { useSmoothSend, SmoothSendTransactionSubmitter } from '@smoothsend/sdk';

const submitter = new SmoothSendTransactionSubmitter({
  apiKey: process.env.NEXT_PUBLIC_SMOOTHSEND_API_KEY!,
  network: 'mainnet',
});

function MyComponent() {
  const { signAndSubmitTransaction } = useSmoothSend(submitter);

  const handleDelete = async (id: number) => {
    // If 'delete_todo' is in Sponsorship Rules → gasless
    // If not in allowlist → user pays gas normally
    const result = await signAndSubmitTransaction({
      data: {
        function: \`\${MODULE_ADDRESS}::todolist::delete_todo\`,
        functionArguments: [id],
      },
    });
    console.log('Tx hash:', result.hash);
  };
}
\`\`\`

**Note:** Do NOT set \`transactionSubmitter\` in \`AptosWalletAdapterProvider\` when using \`useSmoothSend\` — they conflict.

### submitter.getSponsoredFunctions()

\`\`\`typescript
const functions: string[] = await submitter.getSponsoredFunctions();
// e.g. ['0xAbc::todolist::delete_todo', '0xAbc::nft::mint']
\`\`\`

Fetches sponsored functions from the gateway. Results cached in memory — safe to call repeatedly.

### submitter.isSponsored(functionName)

\`\`\`typescript
const sponsored: boolean = await submitter.isSponsored('0xAbc::todolist::delete_todo');
\`\`\`

Returns \`true\` if the function identifier is in the project's sponsorship allowlist.

---

## ScriptComposerClient

Client for fee-in-token stablecoin transfers. The relayer fee (~$0.01) is deducted from the token amount.

### Constructor

\`\`\`typescript
new ScriptComposerClient(config: SmoothSendConfig)
\`\`\`

Same config as \`SmoothSendTransactionSubmitter\`.

### client.buildTransfer(params)

Builds a transfer transaction payload.

\`\`\`typescript
const build = await client.buildTransfer({
  sender: '0xYourAddress',
  recipient: '0xRecipientAddress',
  amount: '1000000',   // in token base units (USDC has 6 decimals, so 1000000 = 1 USDC)
  assetType: '0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b',
  decimals: 6,
  symbol: 'USDC',
});
\`\`\`

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| \`sender\` | string | Sender's Aptos address |
| \`recipient\` | string | Recipient's Aptos address |
| \`amount\` | string | Amount in token base units |
| \`assetType\` | string | Aptos mainnet asset address |
| \`decimals\` | number | Token decimals |
| \`symbol\` | string | Token symbol (USDC, USDT, etc.) |

Returns: \`BuildTransferResult\` with \`payload\` and \`estimatedFee\`.

### client.estimateFee(params)

Estimate the fee before signing. Same parameters as \`buildTransfer\`.

\`\`\`typescript
const fee = await client.estimateFee({
  sender: '0xYourAddress',
  recipient: '0xRecipient',
  amount: '5000000',
  assetType: '0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b',
  decimals: 6,
  symbol: 'USDC',
});

console.log(\`Fee: \${fee.feeAmount} \${fee.symbol}\`);
// e.g. "Fee: 10000 USDC" (0.01 USDC)
\`\`\`

---

## Supported Tokens (Script Composer, Mainnet)

| Symbol | Decimals | Aptos Mainnet Asset Address |
|--------|----------|------------------------------|
| USDC | 6 | \`0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b\` |
| USDT | 6 | \`0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b\` |
| WBTC | 8 | \`0x68c2185f5e2023f2e4401ba56b66c8ae2cfcf8a27852e70eb78b03f59a652a3d\` |
| USDe | 6 | \`0xf37a4a75f89b79985c1fcb42d0a87f4bde28cc2b46c4dd01d9a8428e7726e2e9\` |
| USD1 | 6 | \`0x05fa02d0fa44a90ad59fb90adb08e24c4efbc98eb9e9f2d0d9c0ad18d7fc9d2\` |

---

## SmoothSendError

All SDK errors extend \`SmoothSendError\` and include:
- \`message\` — human-readable error description
- \`statusCode\` — HTTP status code
- \`code\` — string error code

**Common status codes:**

| Status | Meaning |
|--------|---------|
| 401 | Invalid API key |
| 402 | Insufficient credits — top up at dashboard.smoothsend.xyz |
| 429 | Rate limit exceeded |

\`\`\`typescript
import { SmoothSendError } from '@smoothsend/sdk';

try {
  await signAndSubmitTransaction({ data: { ... } });
} catch (error) {
  if (error instanceof SmoothSendError) {
    if (error.statusCode === 402) {
      alert('Please top up your SmoothSend credits');
    }
  }
}
\`\`\`
`,
  },

  examples: {
    uri: 'smoothsend://docs/examples',
    name: 'Examples',
    description: 'Real-world code examples for common SmoothSend use cases',
    mimeType: 'text/markdown',
    content: `# Examples

## Example 1 — Wallet Adapter Setup (Full providers.tsx)

Complete \`providers.tsx\` for a Next.js app with gasless transactions:

\`\`\`typescript
'use client';

import { SmoothSendTransactionSubmitter } from '@smoothsend/sdk';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { Network } from '@aptos-labs/ts-sdk';
import { ReactNode } from 'react';

const smoothSend = new SmoothSendTransactionSubmitter({
  apiKey: process.env.NEXT_PUBLIC_SMOOTHSEND_API_KEY!,
  network: 'mainnet',
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AptosWalletAdapterProvider
      dappConfig={{
        network: Network.MAINNET,
        transactionSubmitter: smoothSend,
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
\`\`\`

## Example 2 — USDC Transfer (Script Composer)

Send USDC without the user needing APT. Fee (~$0.01) is deducted from the USDC amount.

\`\`\`typescript
import { ScriptComposerClient } from '@smoothsend/sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

const client = new ScriptComposerClient({
  apiKey: process.env.NEXT_PUBLIC_SMOOTHSEND_API_KEY!,
  network: 'mainnet',
});

// USDC mainnet asset address
const USDC_ADDRESS = '0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b';

function SendUSDC() {
  const { account, signAndSubmitTransaction } = useWallet();

  async function handleSend() {
    const build = await client.buildTransfer({
      sender: account!.address,
      recipient: '0xRecipientAddress',
      amount: '10000000', // 10 USDC (6 decimals)
      assetType: USDC_ADDRESS,
      decimals: 6,
      symbol: 'USDC',
    });

    const result = await signAndSubmitTransaction(build.payload);
    console.log('Transfer tx hash:', result.hash);
  }

  return <button onClick={handleSend}>Send 10 USDC</button>;
}
\`\`\`

## Example 3 — Fee Preview Before Signing

Show users the fee before they sign:

\`\`\`typescript
import { ScriptComposerClient } from '@smoothsend/sdk';

const client = new ScriptComposerClient({
  apiKey: process.env.NEXT_PUBLIC_SMOOTHSEND_API_KEY!,
  network: 'mainnet',
});

async function previewFee(senderAddress: string, amount: string) {
  const fee = await client.estimateFee({
    sender: senderAddress,
    recipient: '0xRecipient',
    amount,
    assetType: '0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b',
    decimals: 6,
    symbol: 'USDC',
  });

  console.log(\`Estimated fee: \${fee.feeAmount} \${fee.symbol}\`);
  // Display to user before they sign
  return fee;
}
\`\`\`

## Example 4 — Error Handling

\`\`\`typescript
import { SmoothSendError } from '@smoothsend/sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

function TransferButton() {
  const { signAndSubmitTransaction } = useWallet();

  async function handleTransfer() {
    try {
      const result = await signAndSubmitTransaction({
        data: {
          function: '0x1::aptos_account::transfer',
          functionArguments: ['0xRecipient', 100000000],
        },
      });
      console.log('Success:', result.hash);
    } catch (error) {
      if (error instanceof SmoothSendError) {
        switch (error.statusCode) {
          case 401:
            console.error('Invalid API key — check your configuration');
            break;
          case 402:
            console.error('Insufficient SmoothSend credits — top up at dashboard.smoothsend.xyz');
            break;
          case 429:
            console.error('Rate limit exceeded — slow down requests');
            break;
          default:
            console.error('SmoothSend error:', error.message);
        }
      } else {
        console.error('Wallet or network error:', error);
      }
    }
  }

  return <button onClick={handleTransfer}>Transfer APT</button>;
}
\`\`\`

## Example 5 — Testnet Setup (Free)

For development and testing — always free, no credits needed:

\`\`\`typescript
import { SmoothSendTransactionSubmitter } from '@smoothsend/sdk';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { Network } from '@aptos-labs/ts-sdk';

const smoothSend = new SmoothSendTransactionSubmitter({
  apiKey: process.env.NEXT_PUBLIC_SMOOTHSEND_API_KEY!,
  network: 'testnet', // Free — no credits deducted
});

export function DevProviders({ children }) {
  return (
    <AptosWalletAdapterProvider
      dappConfig={{
        network: Network.TESTNET,
        transactionSubmitter: smoothSend,
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}
\`\`\`

## Example 6 — useSmoothSend Per-Function Routing

Some functions sponsored (gasless), others not (user pays gas). Use \`useSmoothSend\` hook:

\`\`\`typescript
import { useSmoothSend, SmoothSendTransactionSubmitter } from '@smoothsend/sdk';

const MODULE = '0xYourModuleAddress';

// Create once at module scope, NOT inside the component
const submitter = new SmoothSendTransactionSubmitter({
  apiKey: process.env.NEXT_PUBLIC_SMOOTHSEND_API_KEY!,
  network: 'mainnet',
});

function TodoList() {
  const { signAndSubmitTransaction } = useSmoothSend(submitter);

  // 'create_todo' NOT in Sponsorship Rules → user pays gas
  const handleCreate = async (content: string) => {
    const result = await signAndSubmitTransaction({
      data: {
        function: \`\${MODULE}::todolist::create_todo\`,
        functionArguments: [content],
      },
    });
    console.log('Created:', result.hash);
  };

  // 'delete_todo' IS in Sponsorship Rules → gasless
  const handleDelete = async (id: number) => {
    const result = await signAndSubmitTransaction({
      data: {
        function: \`\${MODULE}::todolist::delete_todo\`,
        functionArguments: [id],
      },
    });
    console.log('Deleted:', result.hash);
  };

  return (
    <div>
      <button onClick={() => handleCreate('New task')}>Create (pays gas)</button>
      <button onClick={() => handleDelete(1)}>Delete (gasless)</button>
    </div>
  );
}
\`\`\`
`,
  },

  billing: {
    uri: 'smoothsend://docs/billing',
    name: 'Billing & Pricing',
    description: 'Credit-based pricing details for SmoothSend',
    mimeType: 'text/markdown',
    content: `# Billing & Pricing

## Overview

SmoothSend uses a credit-based system. You pre-load credits via the dashboard, and each mainnet transaction deducts from your balance.

## Pricing Formula

\`\`\`
fee_usd = MAX(gas_cost_usd × 1.5, $0.01)
\`\`\`

- **Testnet**: Always free — no credits required
- **Mainnet**: \`MAX(actual_gas_usd × 1.5, $0.01)\` per transaction
  - The 1.5× covers gas volatility and operational costs
  - The $0.01 minimum applies for very cheap transactions

## Typical Fees

| Transaction Type | Typical Gas (units) | Approx SmoothSend Fee |
|-----------------|--------------------|-----------------------|
| APT Transfer    | ~7 units            | ~$0.01               |
| Token Transfer  | ~24 units           | ~$0.01               |
| Contract Call   | ~200 units          | ~$0.01–$0.05         |
| DeFi / Complex  | ~1,000+ units       | ~$0.05+              |

Most transactions hit the $0.01 minimum.

## Script Composer Pricing

For stablecoin transfers (USDC, USDT, WBTC, USDe, USD1) via \`ScriptComposerClient\`:
- Fee is ~$0.01 deducted directly from the token being sent
- No SmoothSend credits needed
- No APT needed by the user

## Managing Credits

- Top up at https://dashboard.smoothsend.xyz
- Payment via credit card (Razorpay) or crypto
- Low balance alerts available in dashboard settings
- API returns 402 status when credits run out

## Rate Limits

Rate limits are abuse-protection only — they don't affect billing. Your tier determines request limits, but you're billed per transaction regardless of tier.

## Cost Calculator

Use the interactive gas calculator at https://docs.smoothsend.xyz/billing to estimate your monthly costs based on your transaction volume and type.
`,
  },
}

export const ALL_RESOURCES = Object.values(DOCS)
