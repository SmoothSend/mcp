import { DOCS } from './docs.js'

// Token addresses on Aptos Mainnet
const TOKENS: Record<string, { decimals: number; address: string }> = {
  USDC: {
    decimals: 6,
    address: '0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b',
  },
  USDT: {
    decimals: 6,
    address: '0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b',
  },
  WBTC: {
    decimals: 8,
    address: '0x68c2185f5e2023f2e4401ba56b66c8ae2cfcf8a27852e70eb78b03f59a652a3d',
  },
  USDe: {
    decimals: 6,
    address: '0xf37a4a75f89b79985c1fcb42d0a87f4bde28cc2b46c4dd01d9a8428e7726e2e9',
  },
  USD1: {
    decimals: 6,
    address: '0x05fa02d0fa44a90ad59fb90adb08e24c4efbc98eb9e9f2d0d9c0ad18d7fc9d2',
  },
}

// Code snippets indexed by use case
const SNIPPETS: Record<string, { title: string; language: string; code: string }> = {
  'wallet-adapter-setup': {
    title: 'Wallet Adapter Setup (providers.tsx)',
    language: 'typescript',
    code: `'use client';

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
}`,
  },
  'script-composer-usdc': {
    title: 'USDC Transfer via Script Composer',
    language: 'typescript',
    code: `import { ScriptComposerClient } from '@smoothsend/sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

const client = new ScriptComposerClient({
  apiKey: process.env.NEXT_PUBLIC_SMOOTHSEND_API_KEY!,
  network: 'mainnet',
});

// USDC on Aptos Mainnet
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
    console.log('Transfer hash:', result.hash);
  }

  return <button onClick={handleSend}>Send 10 USDC</button>;
}`,
  },
  'fee-preview': {
    title: 'Fee Estimation Before Signing',
    language: 'typescript',
    code: `import { ScriptComposerClient } from '@smoothsend/sdk';

const client = new ScriptComposerClient({
  apiKey: process.env.NEXT_PUBLIC_SMOOTHSEND_API_KEY!,
  network: 'mainnet',
});

async function previewFee(senderAddress: string, amountUsdc: string) {
  const fee = await client.estimateFee({
    sender: senderAddress,
    recipient: '0xRecipient',
    amount: amountUsdc,
    assetType: '0xbae207659db88bea0cbead6da0ed00aac12edcdda169e591cd41c94180b46f3b',
    decimals: 6,
    symbol: 'USDC',
  });

  // Show to user before they sign
  console.log(\`Relay fee: \${fee.feeAmount} \${fee.symbol}\`);
  return fee;
}`,
  },
  'error-handling': {
    title: 'Error Handling',
    language: 'typescript',
    code: `import { SmoothSendError } from '@smoothsend/sdk';
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
            console.error('Invalid API key');
            break;
          case 402:
            console.error('Insufficient credits — top up at dashboard.smoothsend.xyz');
            break;
          case 429:
            console.error('Rate limit exceeded');
            break;
        }
      }
    }
  }

  return <button onClick={handleTransfer}>Transfer</button>;
}`,
  },
  'use-smooth-send': {
    title: 'useSmoothSend Hook — Per-Function Gasless Routing',
    language: 'typescript',
    code: `import { useSmoothSend, SmoothSendTransactionSubmitter } from '@smoothsend/sdk';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

// Create once at MODULE SCOPE (not inside the component)
const submitter = new SmoothSendTransactionSubmitter({
  apiKey: process.env.NEXT_PUBLIC_SMOOTHSEND_API_KEY!,
  network: 'mainnet', // or 'testnet'
});

// Do NOT set transactionSubmitter in AptosWalletAdapterProvider when using this hook

function TodoList() {
  const { account } = useWallet();

  // Drop-in for useWallet().signAndSubmitTransaction
  // Routes automatically: allowlisted functions → gasless, others → user pays
  const { signAndSubmitTransaction } = useSmoothSend(submitter);

  const handleDelete = async (id: number) => {
    // 'delete_todo' whitelisted in Sponsorship Rules → gasless (relayer pays gas)
    const result = await signAndSubmitTransaction({
      data: {
        function: \`\${MODULE_ADDRESS}::todolist::delete_todo\`,
        functionArguments: [id],
      },
    });
    console.log('Tx hash:', result.hash);
  };

  const handleCreate = async (content: string) => {
    // 'create_todo' NOT in allowlist → user pays gas normally
    const result = await signAndSubmitTransaction({
      data: {
        function: \`\${MODULE_ADDRESS}::todolist::create_todo\`,
        functionArguments: [content],
      },
    });
    console.log('Tx hash:', result.hash);
  };
}`,
  },
  'testnet-setup': {
    title: 'Testnet Setup (Free)',
    language: 'typescript',
    code: `import { SmoothSendTransactionSubmitter } from '@smoothsend/sdk';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { Network } from '@aptos-labs/ts-sdk';

// Testnet is always free — no credits deducted
const smoothSend = new SmoothSendTransactionSubmitter({
  apiKey: process.env.NEXT_PUBLIC_SMOOTHSEND_API_KEY!,
  network: 'testnet',
});

export function DevProviders({ children }: { children: React.ReactNode }) {
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
}`,
  },
}

// Tool definitions (used in ListTools response)
export const TOOL_DEFINITIONS = [
  {
    name: 'get_docs',
    description:
      'Get SmoothSend documentation for a specific topic. Use this to answer questions about installation, integration, API methods, examples, or billing.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        topic: {
          type: 'string',
          enum: ['overview', 'installation', 'quickstart', 'api-reference', 'examples', 'billing'],
          description:
            'The documentation section to retrieve. Use "overview" for general info and pricing, "api-reference" for method signatures and parameters.',
        },
      },
      required: ['topic'],
    },
  },
  {
    name: 'estimate_credits',
    description:
      'Estimate the monthly SmoothSend credit cost for a dApp based on transaction volume and type. Returns per-transaction fee and monthly total.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        gas_used: {
          type: 'number',
          description:
            'Gas units used per transaction (from Aptos Explorer "Gas Used" field). Typical values: APT transfer ~7, token transfer ~24, contract call ~200, DeFi ~1000.',
        },
        gas_unit_price: {
          type: 'number',
          description:
            'Gas unit price in octas (from Aptos Explorer). Default is 100 octas if unsure.',
        },
        apt_price_usd: {
          type: 'number',
          description: 'Current APT price in USD. Used to calculate USD cost. Default is 8.0 if unsure.',
        },
        volume: {
          type: 'number',
          description: 'Expected number of transactions per month.',
        },
      },
      required: ['gas_used', 'volume'],
    },
  },
  {
    name: 'get_token_address',
    description:
      'Get the Aptos Mainnet fungible asset address for a supported token (USDC, USDT, WBTC, USDe, USD1). Required when using ScriptComposerClient.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        symbol: {
          type: 'string',
          enum: ['USDC', 'USDT', 'WBTC', 'USDe', 'USD1'],
          description: 'The token symbol to look up.',
        },
      },
      required: ['symbol'],
    },
  },
  {
    name: 'get_code_snippet',
    description:
      'Get a ready-to-use code snippet for a specific SmoothSend integration pattern.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        use_case: {
          type: 'string',
          enum: [
            'wallet-adapter-setup',
            'use-smooth-send',
            'script-composer-usdc',
            'fee-preview',
            'error-handling',
            'testnet-setup',
          ],
          description:
            'The integration pattern to get code for. "wallet-adapter-setup" makes all transactions gasless. "use-smooth-send" is for per-function routing (some functions gasless, others not).',
        },
      },
      required: ['use_case'],
    },
  },
]

// Tool handlers
export function handleGetDocs(args: { topic: string }): string {
  const doc = DOCS[args.topic]
  if (!doc) {
    return `Unknown topic "${args.topic}". Available topics: ${Object.keys(DOCS).join(', ')}`
  }
  return doc.content
}

async function fetchAptPrice(): Promise<{ price: number; live: boolean }> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=aptos&vs_currencies=usd',
      { signal: AbortSignal.timeout(5000) }
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as { aptos?: { usd?: number } }
    const price = data?.aptos?.usd
    if (typeof price !== 'number' || price <= 0) throw new Error('Invalid price')
    return { price, live: true }
  } catch {
    return { price: 2.0, live: false }
  }
}

export async function handleEstimateCredits(args: {
  gas_used: number
  gas_unit_price?: number
  apt_price_usd?: number
  volume: number
}): Promise<string> {
  const gasUsed = args.gas_used
  const gasUnitPrice = args.gas_unit_price ?? 100
  const volume = args.volume

  // Use caller-supplied price if given, otherwise fetch live from CoinGecko
  let aptPriceUsd: number
  let priceSource: string
  if (typeof args.apt_price_usd === 'number' && args.apt_price_usd > 0) {
    aptPriceUsd = args.apt_price_usd
    priceSource = 'provided'
  } else {
    const { price, live } = await fetchAptPrice()
    aptPriceUsd = price
    priceSource = live ? 'live (CoinGecko)' : 'fallback $2.00 (CoinGecko unavailable)'
  }

  // fee_octas = gas_used * gas_unit_price
  // fee_apt  = fee_octas / 10^8
  const feeOctas = gasUsed * gasUnitPrice
  const feeApt = feeOctas / 1e8
  const feeUsd = feeApt * aptPriceUsd

  // SmoothSend fee: MAX(gas_usd * 1.5, $0.01)
  const smoothSendFeeUsd = Math.max(feeUsd * 1.5, 0.01)

  const monthlyTotalUsd = smoothSendFeeUsd * volume
  const monthlyGasSavedUsd = feeUsd * volume

  const lines = [
    `## Credit Estimate`,
    ``,
    `**Inputs:**`,
    `- Gas used: ${gasUsed.toLocaleString()} units`,
    `- Gas unit price: ${gasUnitPrice} octas`,
    `- APT price: $${aptPriceUsd.toFixed(2)} (${priceSource})`,
    `- Volume: ${volume.toLocaleString()} tx/month`,
    ``,
    `**Per Transaction:**`,
    `- Raw gas cost: ${feeOctas.toLocaleString()} octas = ${feeApt.toFixed(8)} APT = $${feeUsd.toFixed(6)}`,
    `- SmoothSend fee: $${smoothSendFeeUsd.toFixed(4)} (MAX(gas × 1.5, $0.01))`,
    ``,
    `**Monthly at ${volume.toLocaleString()} transactions:**`,
    `- SmoothSend credits needed: $${monthlyTotalUsd.toFixed(2)}/month`,
    `- Gas your users save: $${monthlyGasSavedUsd.toFixed(4)}/month`,
    ``,
    `**Notes:**`,
    `- Testnet is always free — no credits needed for development`,
    `- Credits are pre-loaded via https://dashboard.smoothsend.xyz`,
    `- API returns 402 if credits run out (transactions will fail)`,
  ]

  return lines.join('\n')
}

export function handleGetTokenAddress(args: { symbol: string }): string {
  const token = TOKENS[args.symbol]
  if (!token) {
    return `Unknown token "${args.symbol}". Supported tokens: ${Object.keys(TOKENS).join(', ')}`
  }

  return [
    `## ${args.symbol} on Aptos Mainnet`,
    ``,
    `**Asset Address:**`,
    `\`${token.address}\``,
    ``,
    `**Decimals:** ${token.decimals}`,
    ``,
    `**Usage in ScriptComposerClient:**`,
    `\`\`\`typescript`,
    `const build = await client.buildTransfer({`,
    `  sender: walletAddress,`,
    `  recipient: '0xRecipient',`,
    `  amount: '1${'0'.repeat(token.decimals)}', // 1 ${args.symbol} (${token.decimals} decimals)`,
    `  assetType: '${token.address}',`,
    `  decimals: ${token.decimals},`,
    `  symbol: '${args.symbol}',`,
    `});`,
    `\`\`\``,
  ].join('\n')
}

export function handleGetCodeSnippet(args: { use_case: string }): string {
  const snippet = SNIPPETS[args.use_case]
  if (!snippet) {
    return `Unknown use case "${args.use_case}". Available: ${Object.keys(SNIPPETS).join(', ')}`
  }

  return [
    `## ${snippet.title}`,
    ``,
    `\`\`\`${snippet.language}`,
    snippet.code,
    `\`\`\``,
  ].join('\n')
}
