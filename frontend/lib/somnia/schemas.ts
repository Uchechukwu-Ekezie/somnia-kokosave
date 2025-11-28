/**
 * Somnia Data Streams Schemas for KokoSave
 *
 * These schemas define the structure of data published to Somnia Data Streams
 * for real-time updates across the platform.
 */

import { toHex } from "viem";

// Pool Activity Schema - Published when pool activities occur
export const POOL_ACTIVITY_SCHEMA =
  "uint64 timestamp, bytes32 poolId, bytes32 activityType, address userAddress, uint256 amount, string description, bytes32 txHash, uint256 nonce";

// Schema names for registration
export const SCHEMA_NAMES = {
  POOL_ACTIVITY: "kokosave_pool_activity",
} as const;

// Event schema IDs for subscriptions
export const EVENT_SCHEMA_IDS = {
  POOL_CREATED: "PoolCreated",
  DEPOSIT: "Deposit",
  PAYOUT: "Payout",
  MEMBER_JOINED: "MemberJoined",
  WITHDRAWAL: "Withdrawal",
} as const;

// Activity types as bytes32
export const ACTIVITY_TYPES = {
  POOL_CREATED: toHex("pool_created", { size: 32 }),
  DEPOSIT: toHex("deposit", { size: 32 }),
  PAYOUT: toHex("payout", { size: 32 }),
  MEMBER_JOINED: toHex("member_joined", { size: 32 }),
  WITHDRAWAL: toHex("withdrawal", { size: 32 }),
} as const;


