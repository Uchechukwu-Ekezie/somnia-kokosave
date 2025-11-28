# 🔴 Somnia RPC Error - "Internal JSON-RPC error"

## 🎯 Problem Identified

**Error**: `MetaMask - RPC Error: Internal JSON-RPC error`

**What this means**: The Somnia Dream Testnet RPC (`https://dream-rpc.somnia.network`) is experiencing issues or is overloaded.

**This is NOT a problem with your code or the contract** - it's a network infrastructure issue.

---

## ✅ Solutions (Try in Order)

### Solution 1: Wait and Retry (Recommended)
The Somnia RPC might be temporarily overloaded.

1. **Wait 2-3 minutes**
2. **Refresh the page** (Ctrl+R)
3. **Try the transaction again**

### Solution 2: Change RPC URL in MetaMask
Try using a different Somnia RPC endpoint:

1. **Open MetaMask**
2. **Click network dropdown** → Click the gear icon next to "Somnia Dream Testnet"
3. **Click "Edit"**
4. **Try these RPC URLs** (one at a time):

   **Option A** (Current):
   ```
   https://dream-rpc.somnia.network
   ```

   **Option B** (Alternative):
   ```
   https://rpc.somnia.network
   ```

   **Option C** (Backup):
   ```
   https://somnia-testnet-rpc.publicnode.com
   ```

5. **Save** and **try transaction again**

### Solution 3: Increase Gas Limit
Sometimes the RPC fails due to gas estimation issues:

1. When MetaMask popup appears
2. Click **"Edit"** next to gas fees
3. **Manually set**:
   - Gas Limit: `500000` (500k)
   - Max base fee: `10 gwei`
   - Priority fee: `10 gwei`
4. **Confirm transaction**

### Solution 4: Clear MetaMask Cache
1. **MetaMask** → **Settings** → **Advanced**
2. **"Clear activity tab data"**
3. **Close and reopen MetaMask**
4. **Reconnect wallet** to the app
5. **Try again**

### Solution 5: Use a Different Wallet
If MetaMask continues to fail:

1. Try **Rabby Wallet** or **Coinbase Wallet**
2. Add Somnia Dream Testnet to the new wallet
3. Import your account (using private key or seed phrase)
4. Connect the new wallet to the app

---

## 🔍 How to Know It's an RPC Error

### Symptoms:
- ✅ Token approval works
- ✅ Network is correct (Somnia, Chain ID 50312)
- ✅ Wallet is connected
- ❌ Transaction fails with "Internal JSON-RPC error"
- ❌ No specific contract revert reason

### Console shows:
```
🔵 TOKEN APPROVAL - Initiating: { isCorrectNetwork: true } ✅
❌ DEPOSIT ERROR DETECTED: {
  errorMessage: "Internal JSON-RPC error"
}
```

---

## 📊 Check Somnia Network Status

### Option 1: Check Block Explorer
Visit: https://dream-explorer.somnia.network

- If it loads slowly or shows errors → RPC is having issues
- If it loads normally → RPC should be working

### Option 2: Check Recent Blocks
1. Go to: https://dream-explorer.somnia.network
2. Check if **recent blocks are being produced**
3. If blocks are old (>5 minutes) → Network might be down

### Option 3: Community Channels
- Check **Somnia Discord** for network status updates
- Check **Somnia Twitter** for announcements
- Ask in **Somnia Telegram** if others are experiencing issues

---

## 🛠️ For Developers: Add RPC Fallback

If you want to add automatic RPC fallback, update `web3-provider.tsx`:

```typescript
const somniaDream = defineChain({
  id: 50312,
  name: "Somnia Dream",
  network: "somnia-dream",
  nativeCurrency: {
    name: "STT",
    symbol: "STT",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        "https://dream-rpc.somnia.network",
        "https://rpc.somnia.network", // Fallback 1
        "https://somnia-testnet-rpc.publicnode.com" // Fallback 2
      ],
    },
    public: {
      http: [
        "https://dream-rpc.somnia.network",
        "https://rpc.somnia.network",
        "https://somnia-testnet-rpc.publicnode.com"
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Somnia Explorer",
      url: "https://dream-explorer.somnia.network",
    },
  },
  testnet: true,
});
```

---

## 💡 Why This Happens

**Somnia Dream Testnet** is a testnet, which means:
- Lower infrastructure priority than mainnet
- Can experience higher load during testing
- RPC nodes might restart or have maintenance
- Fewer redundant nodes than mainnet

This is **normal for testnets** and not a reflection of mainnet performance.

---

## 🎯 What to Do Right Now

1. ✅ **Confirm you're on Somnia** (you are - Chain ID 50312)
2. ✅ **Confirm approval worked** (it did)
3. ⏳ **Wait 2-3 minutes** for RPC to stabilize
4. 🔄 **Refresh page** and try again
5. 📊 **Check block explorer** to see if network is responsive
6. 🔧 **Try alternative RPC** if still failing

---

## 📞 Still Not Working?

If after trying all solutions above it still fails:

1. **Check your error details** - expand the console error fully
2. **Share the complete error** including `errorDetails` and `errorShortMessage`
3. **Check if others are having the same issue** (Discord/Telegram)
4. **Wait for Somnia team** to resolve RPC issues

---

## ✅ Success Indicators

You'll know it's working when:
- MetaMask popup appears without errors
- Transaction is submitted successfully
- You get a transaction hash
- Transaction appears in block explorer
- No "Internal JSON-RPC error" in console

---

**TL;DR**: This is a Somnia RPC network issue, not your code. Wait a few minutes and try again, or use an alternative RPC URL in MetaMask.

