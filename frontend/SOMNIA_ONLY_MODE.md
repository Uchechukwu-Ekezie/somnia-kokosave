# Using Somnia Data Streams Only (No Supabase)

This application now supports running with **only Somnia Data Streams** for data storage and real-time updates, without requiring Supabase.

## Setup

### 1. Remove Supabase Configuration

In your `.env.local` file, either remove or set these to empty:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### 2. Verify Configuration

When you start the dev server, you should see:

```
🔧 Supabase Configuration: {
  configured: false,
  hasUrl: false,
  hasKey: false,
  urlValid: false,
  keyValid: false
}
```

If `configured: false`, you're running in Somnia-only mode! ✅

### 3. What Works in Somnia-Only Mode

- ✅ **Pool Creation**: Pools are created on-chain via smart contracts
- ✅ **Pool Listing**: "My Groups" fetches your pools directly from blockchain events
- ✅ **Real-time Activities**: All activities are published to and subscribed from Somnia Data Streams
- ✅ **Deposits & Payouts**: All transactions are on-chain
- ✅ **Activity History**: Real-time activity feed via Somnia subscriptions
- ✅ **Group Activities**: Pool-specific activity streams

### 4. Current Limitations

- ⚠️ **Historical Data**: Only real-time activities from the moment you subscribe
  - Previous activities won't show unless we implement historical event querying
- ⚠️ **Pool Details**: Basic pool info is fetched from blockchain, but some details (like names and descriptions) are not stored on-chain
  - Pools show as "Rotational Pool", "Target Pool", or "Flexible Pool"
  - Full details require on-chain storage or IPFS integration

## How It Works

### Data Flow

1. **Pool Creation**:
   - Smart contract deploys pool
   - Activity published to Somnia Data Stream
   - No database storage

2. **Activities** (Deposits, Payouts, etc.):
   - Transaction executed on-chain
   - Activity published to Somnia Data Stream with `publishPoolActivity()`
   - Real-time subscribers receive updates instantly

3. **Real-time Subscriptions**:
   - `SomniaStreamsProvider` initializes SDK in read-only mode
   - Components subscribe to specific pools or all activities
   - Updates appear in real-time without page refresh

### Key Files

- `lib/somnia/somnia-client.ts` - SDK initialization
- `lib/somnia/publisher.ts` - Publishing activities to streams
- `lib/somnia/schemas.ts` - Data stream schema definitions
- `contexts/somnia-streams-context.tsx` - React context for subscriptions
- `hooks/useSomniaActivity.ts` - Hooks for publishing and subscribing

## How Pool Fetching Works

The app now fetches your pools directly from the blockchain:

1. **Event Listening**: The `useUserPools` hook queries `PoolCreated` events from the factory contract
2. **User Filtering**: Events are filtered by your wallet address as the creator
3. **Block Range**: 
   - Queries in chunks of 1000 blocks (RPC limit)
   - By default, queries the last 10,000 blocks
   - Set `NEXT_PUBLIC_FACTORY_DEPLOYMENT_BLOCK` in `.env.local` to query from factory deployment
4. **Real-time Updates**: Pools appear automatically after creation

### Optimizing Block Queries

To avoid querying unnecessary blocks, set the factory deployment block in `.env.local`:

```env
NEXT_PUBLIC_FACTORY_DEPLOYMENT_BLOCK=240000000
```

This will query from the deployment block to the current block, ensuring all pools are found without querying blocks before the factory existed.

## Next Steps

To further enhance Somnia-only mode:

1. **Add historical activity querying**: Fetch past activities from Somnia Data Streams
2. **Store pool metadata on-chain or IPFS**: Include names, descriptions, and other details
3. **Implement pool search**: Allow users to find and join pools by contract address
4. **Add pagination**: For users with many pools

## Troubleshooting

### Still seeing "Supabase not available" messages?

Check your `.env.local` file. If you have placeholder values like:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
```

These will be detected as invalid and ignored. Set them to empty strings instead:
```
NEXT_PUBLIC_SUPABASE_URL=
```

### MetaMask signature requests on page load?

This was fixed! The SDK now initializes in read-only mode for subscriptions. You'll only be prompted to sign when publishing activities (deposits, payouts, etc.).

### Activities not appearing?

Make sure:
1. You're connected to Somnia Testnet
2. The SDK is initialized (check console for "✅ Somnia Data Streams SDK initialized (read-only)")
3. You're publishing activities correctly after transactions

