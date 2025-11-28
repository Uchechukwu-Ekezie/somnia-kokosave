"use client";

import { useEffect, useState, useCallback } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { toHex, type Hex } from "viem";
import { somniaDream } from "@/lib/somnia/somnia-client";
import { publishPoolActivity, type ActivityData } from "@/lib/somnia/publisher";
import { useSomniaStreams } from "@/contexts/somnia-streams-context";
import { SchemaEncoder } from "@somnia-chain/streams";
import { POOL_ACTIVITY_SCHEMA } from "@/lib/somnia/schemas";

// Hook for publishing activities to Somnia Data Streams
export function usePublishActivity() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publishActivity = useCallback(
    async (activity: ActivityData) => {
      if (!address || !publicClient || !walletClient) {
        setError("Wallet not connected");
        return null;
      }

      // Check if we're on Somnia network
      const chainId = await publicClient.getChainId();
      if (chainId !== somniaDream.id) {
        console.warn("Not on Somnia network. Activity will not be published to streams.");
        return null;
      }

      try {
        setIsPublishing(true);
        setError(null);

        // Publish using the new publisher function
        const txHash = await publishPoolActivity(
          activity,
          publicClient,
          walletClient
        );

        return txHash;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to publish activity";
        console.error("Error publishing activity to Somnia:", err);
        setError(errorMessage);
        return null;
      } finally {
        setIsPublishing(false);
      }
    },
    [address, publicClient, walletClient]
  );

  return { publishActivity, isPublishing, error };
}

// Hook for subscribing to real-time activity streams
export function useActivityStream(poolId: string | null) {
  const { subscribeToPoolActivities, isInitialized } = useSomniaStreams();
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!poolId || !isInitialized || !subscribeToPoolActivities) {
      return;
    }

    const setupSubscription = async () => {
      try {
        setIsSubscribing(true);
        setError(null);

        // Subscribe to activities for this pool
        const unsubscribe = await subscribeToPoolActivities(poolId, (data) => {
          try {
            // Decode the activity data
            const encoder = new SchemaEncoder(POOL_ACTIVITY_SCHEMA);
            const fields = data.data || data;
            
            // Convert decoded data to ActivityData format
            const activity: ActivityData = {
              timestamp: Number(
                fields.find((f: any) => f.name === "timestamp")?.value || 0
              ),
              poolId: fields.find((f: any) => f.name === "poolId")?.value?.toString() || poolId,
              activityType: fields.find((f: any) => f.name === "activityType")?.value?.toString() || "",
              userAddress: fields.find((f: any) => f.name === "userAddress")?.value?.toString() || "",
              amount: fields.find((f: any) => f.name === "amount")?.value?.toString() || "0",
              description: fields.find((f: any) => f.name === "description")?.value?.toString() || "",
              txHash: fields.find((f: any) => f.name === "txHash")?.value?.toString() || "",
              nonce: Number(fields.find((f: any) => f.name === "nonce")?.value || 0),
            };

            // Add to activities list
            setActivities((prev) => {
              // Avoid duplicates
              const exists = prev.some(
                (a) => a.txHash === activity.txHash && a.nonce === activity.nonce
              );
              if (exists) return prev;
              
              // Sort by timestamp (newest first)
              return [activity, ...prev].sort((a, b) => b.timestamp - a.timestamp);
            });
          } catch (err) {
            console.error("Error decoding activity event:", err);
          }
        });

        setIsSubscribing(false);

        // Cleanup subscription on unmount
        return unsubscribe;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to subscribe to activities";
        console.error("Error setting up activity stream:", err);
        setError(errorMessage);
        setIsSubscribing(false);
      }
    };

    setupSubscription();
  }, [poolId, isInitialized, subscribeToPoolActivities]);

  return { activities, isSubscribing, error };
}
