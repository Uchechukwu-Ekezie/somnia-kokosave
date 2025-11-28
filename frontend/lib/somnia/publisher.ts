/**
 * Somnia Data Streams Publisher
 * 
 * Functions to publish data to Somnia Data Streams for real-time updates.
 * These functions should be called from client-side wallet contexts.
 */

import { SDK, SchemaEncoder } from "@somnia-chain/streams";
import { toHex, type Hex } from "viem";
import {
  POOL_ACTIVITY_SCHEMA,
  EVENT_SCHEMA_IDS,
  ACTIVITY_TYPES,
} from "./schemas";
import { getSomniaSDK, initSomniaSDKWithClients } from "./somnia-client";

export interface ActivityData {
  timestamp: number;
  poolId: string;
  activityType: string;
  userAddress: string;
  amount: string;
  description: string;
  txHash: string;
  nonce: number;
}

/**
 * Publish a pool activity to Somnia Data Streams
 */
export async function publishPoolActivity(
  activity: ActivityData,
  publicClient?: any,
  walletClient?: any
): Promise<Hex | null> {
  const sdk = publicClient && walletClient
    ? initSomniaSDKWithClients(publicClient, walletClient)
    : getSomniaSDK();

  const schemaId = await sdk.streams.computeSchemaId(POOL_ACTIVITY_SCHEMA);
  const encoder = new SchemaEncoder(POOL_ACTIVITY_SCHEMA);

  const encodedData = encoder.encodeData([
    { name: "timestamp", value: activity.timestamp.toString(), type: "uint64" },
    { name: "poolId", value: toHex(activity.poolId, { size: 32 }), type: "bytes32" },
    { name: "activityType", value: toHex(activity.activityType, { size: 32 }), type: "bytes32" },
    { name: "userAddress", value: activity.userAddress, type: "address" },
    { name: "amount", value: activity.amount, type: "uint256" },
    { name: "description", value: activity.description, type: "string" },
    { name: "txHash", value: toHex(activity.txHash, { size: 32 }), type: "bytes32" },
    { name: "nonce", value: activity.nonce.toString(), type: "uint256" },
  ]);

  const dataId = toHex(`${activity.poolId}-${activity.nonce}`, { size: 32 });

  // Map activity type to event schema ID
  const eventSchemaId = getEventSchemaId(activity.activityType);

  try {
    // Publish data and emit event for subscribers
    const result = (await sdk.streams.setAndEmitEvents(
      [{ id: dataId, schemaId, data: encodedData }],
      [
        {
          id: eventSchemaId,
          argumentTopics: [toHex(activity.poolId, { size: 32 })],
          data: "0x",
        },
      ]
    )) as unknown as Hex | Error;

    // Check if result is an Error
    if (result instanceof Error) {
      console.error("Error publishing pool activity:", result);
      return null;
    }

    return result as Hex;
  } catch (error) {
    console.error("Error publishing pool activity:", error);
    return null;
  }
}

/**
 * Get event schema ID from activity type
 */
function getEventSchemaId(activityType: string): string {
  const typeLower = activityType.toLowerCase();
  if (typeLower === "pool_created") return EVENT_SCHEMA_IDS.POOL_CREATED;
  if (typeLower === "deposit") return EVENT_SCHEMA_IDS.DEPOSIT;
  if (typeLower === "payout") return EVENT_SCHEMA_IDS.PAYOUT;
  if (typeLower === "member_joined") return EVENT_SCHEMA_IDS.MEMBER_JOINED;
  if (typeLower === "withdrawal") return EVENT_SCHEMA_IDS.WITHDRAWAL;
  return EVENT_SCHEMA_IDS.DEPOSIT; // Default
}

