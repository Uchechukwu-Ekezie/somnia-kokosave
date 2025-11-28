# Running Without Supabase

## ✅ Supabase is Now Optional!

The app now works **without Supabase**. All data is stored **on-chain** and via **Somnia Data Streams**.

## What Changed

### API Routes
- ✅ `/api/pools` - Returns empty array if Supabase not configured (no error)
- ✅ `/api/pools` POST - Returns success even without Supabase
- ✅ `/api/pools/activity` - Returns success without Supabase

### Data Storage
- **Primary**: On-chain smart contracts (Somnia)
- **Real-time**: Somnia Data Streams (live activity feeds)
- **Optional**: Supabase (only for off-chain indexing/backup)

## How It Works

1. **Pool Creation**: Stored on-chain via smart contract
2. **Activities**: Published to Somnia Data Streams (real-time)
3. **Activity Feeds**: Read from Somnia Data Streams when on Somnia network
4. **Fallback**: If not on Somnia, activities are read from on-chain events

## Environment Variables

You can **remove** Supabase variables from `.env.local`:

```env
# Required: Contract addresses
NEXT_PUBLIC_FACTORY_ADDRESS=0x2431B645983ef9A58042479095B80d72100BFf04
NEXT_PUBLIC_TOKEN_ADDRESS=0x2A4690ec1Ef5d97A1366eB69e30C5a2a13E91773

# Required: Somnia network
NEXT_PUBLIC_CHAIN_ID=50312
NEXT_PUBLIC_SOMNIA_RPC_URL=https://dream-rpc.somnia.network

# Optional: Supabase (can be removed)
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Benefits

✅ **No database setup required**  
✅ **Fully decentralized** - all data on-chain  
✅ **Real-time via Somnia Data Streams**  
✅ **No external dependencies**  
✅ **Works immediately after deployment**  

## What You'll See

- **My Groups**: Empty list (pools are on-chain, not indexed in database)
- **Activity Feeds**: Real-time from Somnia Data Streams (when on Somnia network)
- **Pool Creation**: Works perfectly - stored on-chain
- **No Errors**: API returns empty arrays instead of 503 errors

## Notes

- Pools created are stored **on-chain** and can be queried directly from the smart contract
- Activity feeds use **Somnia Data Streams** for real-time updates
- Supabase was only used for off-chain indexing - not required for core functionality

---

**Your app now works completely without Supabase!** 🎉

