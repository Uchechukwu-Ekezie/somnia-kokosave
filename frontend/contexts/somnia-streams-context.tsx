"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { SDK, SchemaEncoder } from "@somnia-chain/streams";
import { usePublicClient, useWalletClient } from "wagmi";
import { somniaDream, initSomniaSDKWithClients } from "@/lib/somnia/somnia-client";
import {
  POOL_ACTIVITY_SCHEMA,
  EVENT_SCHEMA_IDS,
} from "@/lib/somnia/schemas";

interface SomniaStreamsContextType {
  sdk: SDK | null;
  isInitialized: boolean;
  subscribeToPoolActivities: (
    poolId: string,
    onData: (data: any) => void
  ) => Promise<() => void>;
  subscribeToAllActivities: (
    onData: (data: any) => void
  ) => Promise<() => void>;
}

const SomniaStreamsContext = createContext<
  SomniaStreamsContextType | undefined
>(undefined);

export function SomniaStreamsProvider({ children }: { children: ReactNode }) {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [sdk, setSdk] = useState<SDK | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [subscriptions, setSubscriptions] = useState<
    Map<string, { unsubscribe: () => void }>
  >(new Map());

  // Initialize SDK when clients are available
  useEffect(() => {
    const initSDK = async () => {
      try {
        if (publicClient) {
          // Check if connected to Somnia network
          const chainId = await publicClient.getChainId();
          const isSomniaNetwork =
            chainId === somniaDream.id ||
            chainId.toString() === "50312";

          if (isSomniaNetwork) {
            // Initialize with ONLY public client for reading/subscribing
            // Don't use wallet client to avoid signature requests
            const initializedSDK = initSomniaSDKWithClients(
              publicClient,
              undefined // No wallet client - we only need to read/subscribe
            );
            setSdk(initializedSDK);
            setIsInitialized(true);
            console.log("✅ Somnia Data Streams SDK initialized (read-only)");
          } else {
            console.warn("Not on Somnia network. Real-time streams unavailable.");
            setIsInitialized(false);
            setSdk(null);
          }
        }
      } catch (error) {
        console.error("Error initializing Somnia SDK:", error);
        setIsInitialized(false);
        setSdk(null);
      }
    };

    initSDK();
  }, [publicClient]); // Only depend on publicClient, not walletClient

  // Cleanup subscriptions on unmount
  useEffect(() => {
    return () => {
      subscriptions.forEach((sub) => {
        try {
          sub.unsubscribe();
        } catch (error) {
          console.error("Error unsubscribing:", error);
        }
      });
      subscriptions.clear();
    };
  }, []);

  const subscribeToPoolActivities = useCallback(
    async (poolId: string, onData: (data: any) => void) => {
      if (!sdk) {
        throw new Error("Somnia SDK not initialized");
      }

      try {
        // Subscribe to all activity events and filter by poolId
        const subscription = await sdk.streams.subscribe({
          somniaStreamsEventId: EVENT_SCHEMA_IDS.DEPOSIT, // Subscribe to deposit events as example
          ethCalls: [],
          context: "topic1", // poolId in event
          onData: (data) => {
            // Filter by poolId
            const encoder = new SchemaEncoder(POOL_ACTIVITY_SCHEMA);
            const decoded = Array.isArray(data) ? data : [data];
            decoded.forEach((item) => {
              const fields = item.data || item;
              const poolIdField = fields.find(
                (f: any) => f.name === "poolId"
              );
              if (poolIdField?.value === poolId) {
                onData(item);
              }
            });
          },
          onError: (error) => console.error("Subscription error:", error),
          onlyPushChanges: true,
        });

        if (subscription && !(subscription instanceof Error)) {
          const key = `pool_activities_${poolId}_${Date.now()}`;
          setSubscriptions((prev) => new Map(prev.set(key, subscription)));
          return subscription.unsubscribe;
        }
      } catch (error) {
        console.error("Error subscribing to pool activities:", error);
      }

      return () => {};
    },
    [sdk]
  );

  const subscribeToAllActivities = useCallback(
    async (onData: (data: any) => void) => {
      if (!sdk) {
        throw new Error("Somnia SDK not initialized");
      }

      try {
        // Subscribe to all activity event types
        const eventIds = [
          EVENT_SCHEMA_IDS.POOL_CREATED,
          EVENT_SCHEMA_IDS.DEPOSIT,
          EVENT_SCHEMA_IDS.PAYOUT,
          EVENT_SCHEMA_IDS.MEMBER_JOINED,
          EVENT_SCHEMA_IDS.WITHDRAWAL,
        ];

        const unsubscribeFunctions: (() => void)[] = [];

        for (const eventId of eventIds) {
          const subscription = await sdk.streams.subscribe({
            somniaStreamsEventId: eventId,
            ethCalls: [],
            onData,
            onError: (error) => console.error("Subscription error:", error),
            onlyPushChanges: true,
          });

          if (subscription && !(subscription instanceof Error)) {
            const key = `all_activities_${eventId}_${Date.now()}`;
            setSubscriptions((prev) => new Map(prev.set(key, subscription)));
            unsubscribeFunctions.push(subscription.unsubscribe);
          }
        }

        // Return combined unsubscribe function
        return () => {
          unsubscribeFunctions.forEach((unsub) => unsub());
        };
      } catch (error) {
        console.error("Error subscribing to all activities:", error);
      }

      return () => {};
    },
    [sdk]
  );

  return (
    <SomniaStreamsContext.Provider
      value={{
        sdk,
        isInitialized,
        subscribeToPoolActivities,
        subscribeToAllActivities,
      }}
    >
      {children}
    </SomniaStreamsContext.Provider>
  );
}

export function useSomniaStreams() {
  const context = useContext(SomniaStreamsContext);
  if (context === undefined) {
    throw new Error(
      "useSomniaStreams must be used within a SomniaStreamsProvider"
    );
  }
  return context;
}

