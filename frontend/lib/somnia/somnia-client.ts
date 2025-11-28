/**
 * Somnia Data Streams Client
 *
 * Handles initialization and management of Somnia Data Streams SDK
 * for publishing and subscribing to real-time data.
 */

import { SDK, SchemaEncoder, zeroBytes32 } from "@somnia-chain/streams";
import {
  createPublicClient,
  createWalletClient,
  http,
  type Address,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { defineChain } from "viem";

// Define Somnia Dream Testnet
export const somniaDream = defineChain({
  id: 50312,
  name: "Somnia Dream",
  network: "somnia-dream",
  nativeCurrency: { name: "STT", symbol: "STT", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://dream-rpc.somnia.network"] },
    public: { http: ["https://dream-rpc.somnia.network"] },
  },
  blockExplorers: {
    default: {
      name: "Somnia Explorer",
      url: "https://dream-explorer.somnia.network",
    },
  },
  testnet: true,
});

let sdkInstance: SDK | null = null;
let publicClientInstance: ReturnType<typeof createPublicClient> | null = null;
let walletClientInstance: ReturnType<typeof createWalletClient> | null = null;

/**
 * Initialize Somnia SDK with public client (for reading/subscribing)
 */
export function initSomniaSDKPublic(rpcUrl?: string): SDK {
  if (sdkInstance && publicClientInstance) {
    return sdkInstance;
  }

  const rpc = rpcUrl || "https://dream-rpc.somnia.network";
  publicClientInstance = createPublicClient({
    chain: somniaDream,
    transport: http(rpc),
  });

  sdkInstance = new SDK({
    public: publicClientInstance,
  });

  return sdkInstance;
}

/**
 * Initialize Somnia SDK with wallet client (for writing)
 * Note: Only use in server-side or secure environments
 */
export function initSomniaSDKWithWallet(
  privateKey: `0x${string}`,
  rpcUrl?: string
): SDK {
  const rpc = rpcUrl || "https://dream-rpc.somnia.network";
  const account = privateKeyToAccount(privateKey);

  walletClientInstance = createWalletClient({
    account,
    chain: somniaDream,
    transport: http(rpc),
  });

  publicClientInstance = createPublicClient({
    chain: somniaDream,
    transport: http(rpc),
  });

  sdkInstance = new SDK({
    public: publicClientInstance,
    wallet: walletClientInstance,
  });

  return sdkInstance;
}

/**
 * Initialize Somnia SDK with viem clients (for use with wagmi)
 * For subscriptions (read-only), only pass publicClient
 * For publishing, pass both publicClient and walletClient
 */
export function initSomniaSDKWithClients(
  publicClient: any,
  walletClient?: any
): SDK {
  const config: any = {
    public: publicClient,
  };
  
  // Only add wallet if provided (for publishing)
  if (walletClient) {
    config.wallet = walletClient;
  }

  sdkInstance = new SDK(config);

  return sdkInstance;
}

/**
 * Get the current SDK instance
 */
export function getSomniaSDK(): SDK {
  if (!sdkInstance) {
    return initSomniaSDKPublic();
  }
  return sdkInstance;
}

/**
 * Create a schema encoder for a given schema string
 */
export function createSchemaEncoder(schema: string): SchemaEncoder {
  return new SchemaEncoder(schema);
}

/**
 * Register all KokoSave schemas on-chain
 * This should be called once during setup
 */
export async function registerKokoSaveSchemas(
  privateKey?: `0x${string}`,
  rpcUrl?: string
): Promise<void> {
  const sdk = privateKey
    ? initSomniaSDKWithWallet(privateKey, rpcUrl)
    : getSomniaSDK();

  // Import schemas statically
  const schemasModule = await import("./schemas");
  const { POOL_ACTIVITY_SCHEMA, SCHEMA_NAMES } = schemasModule;

  const schemas = [
    {
      schemaName: SCHEMA_NAMES.POOL_ACTIVITY,
      schema: POOL_ACTIVITY_SCHEMA,
      parentSchemaId: zeroBytes32,
    },
  ];

  try {
    const txHash = await sdk.streams.registerDataSchemas(schemas, true);
    if (txHash) {
      console.log("✅ KokoSave schemas registered:", txHash);
    } else {
      console.log("ℹ️ Schemas already registered");
    }
  } catch (error) {
    console.error("Error registering schemas:", error);
    throw error;
  }
}

