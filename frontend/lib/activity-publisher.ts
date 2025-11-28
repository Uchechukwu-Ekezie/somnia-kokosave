import { publishPoolActivity as publishToSomnia, type ActivityData } from "@/lib/somnia/publisher";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { somniaDream } from "@/lib/somnia/somnia-client";
import { isSupabaseConfigured } from "@/lib/supabase";

/**
 * Helper function to publish activity to both Somnia (if on Somnia network) and Supabase
 * This ensures activities are available in real-time via Somnia streams and persisted in Supabase
 * 
 * Note: This function should be called from a React component with wallet context.
 * For server-side or non-React contexts, use publishToSomnia directly.
 */
export async function publishPoolActivity(
  poolId: string,
  activityType: "pool_created" | "deposit" | "payout" | "member_joined" | "withdrawal",
  userAddress: string,
  amount: string,
  description: string,
  txHash: string,
  nonce: number = Date.now(),
  publicClient?: any,
  walletClient?: any
) {
  // Publish to Supabase (optional fallback - only if configured)
  // Skip entirely if Supabase is not configured - all data goes to Somnia Data Streams
  if (isSupabaseConfigured) {
    try {
      const response = await fetch("/api/pools/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pool_id: poolId,
          activity_type: activityType,
          user_address: userAddress,
          amount: amount ? parseFloat(amount) : null,
          description,
          tx_hash: txHash,
        }),
      });

      if (!response.ok) {
        // Silently fail - Supabase is optional
        const errorText = await response.text().catch(() => '');
        if (!errorText.includes('Supabase') && !errorText.includes('configured')) {
          console.warn("Activity API response:", errorText);
        }
      }
    } catch (err) {
      // Silently fail - Supabase is optional, activities are on-chain
      console.debug("Supabase activity publishing skipped (optional)");
    }
  }

  // Primary storage: Somnia Data Streams (on-chain, real-time)
  if (publicClient && walletClient) {
    try {
      const activity: ActivityData = {
        timestamp: Date.now(),
        poolId,
        activityType,
        userAddress,
        amount,
        description,
        txHash,
        nonce,
      };

      const somniaTxHash = await publishToSomnia(activity, publicClient, walletClient);
      if (somniaTxHash) {
        console.log("✅ Activity published to Somnia Data Streams:", somniaTxHash);
      }
    } catch (err) {
      console.error("Error publishing to Somnia Data Streams:", err);
      // Continue - Supabase fallback is still available
    }
  }

  return { success: true };
}

