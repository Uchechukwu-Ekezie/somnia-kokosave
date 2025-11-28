/**
 * Backward compatibility exports
 * This file re-exports from the new modular structure
 */

export { somniaDream } from "./somnia/somnia-client";
export { 
  POOL_ACTIVITY_SCHEMA,
  ACTIVITY_TYPES,
  EVENT_SCHEMA_IDS,
  SCHEMA_NAMES
} from "./somnia/schemas";
export { publishPoolActivity, type ActivityData } from "./somnia/publisher";
export { 
  initSomniaSDKPublic,
  initSomniaSDKWithWallet,
  initSomniaSDKWithClients,
  getSomniaSDK,
  createSchemaEncoder,
  registerKokoSaveSchemas
} from "./somnia/somnia-client";

// Legacy exports for backward compatibility
import { SchemaEncoder } from "@somnia-chain/streams";
import { POOL_ACTIVITY_SCHEMA } from "./somnia/schemas";
import { toHex, type Hex } from "viem";

export const schemaEncoder = new SchemaEncoder(POOL_ACTIVITY_SCHEMA);
export const poolActivitySchema = POOL_ACTIVITY_SCHEMA;

export function createSomniaSDK(publicClient: any, walletClient: any) {
  const { initSomniaSDKWithClients } = require("./somnia/somnia-client");
  return initSomniaSDKWithClients(publicClient, walletClient);
}

export async function computeSchemaId(sdk: any): Promise<Hex> {
  return await sdk.streams.computeSchemaId(POOL_ACTIVITY_SCHEMA);
}

export function encodeActivity(data: {
  timestamp: number;
  poolId: string;
  activityType: string;
  userAddress: string;
  amount: string;
  description: string;
  txHash: string;
  nonce: number;
}): Hex {
  return schemaEncoder.encodeData([
    { name: "timestamp", value: data.timestamp.toString(), type: "uint64" },
    { name: "poolId", value: toHex(data.poolId, { size: 32 }), type: "bytes32" },
    { name: "activityType", value: toHex(data.activityType, { size: 32 }), type: "bytes32" },
    { name: "userAddress", value: data.userAddress, type: "address" },
    { name: "amount", value: data.amount, type: "uint256" },
    { name: "description", value: data.description, type: "string" },
    { name: "txHash", value: toHex(data.txHash, { size: 32 }), type: "bytes32" },
    { name: "nonce", value: data.nonce.toString(), type: "uint256" },
  ]);
}

export function decodeActivity(encodedData: Hex) {
  return schemaEncoder.decode(encodedData);
}
