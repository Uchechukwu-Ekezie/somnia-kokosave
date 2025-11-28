# 🚨 CRITICAL: Switch to Somnia Network Only

## ⚠️ Problem
Your wallet is trying to use **Celo Sepolia** instead of **Somnia Dream Testnet**.

## ✅ Fix Applied
I've **removed all other networks** from the config. The app now **ONLY supports Somnia Dream Testnet**.

### What Changed:
```typescript
// BEFORE (had multiple networks):
const networks = [somniaDream, celoSepolia, celoMainnet, baseSepolia, baseMainnet];

// AFTER (ONLY Somnia):
const networks = [somniaDream];
```

---

## 🔥 IMPORTANT: You MUST Do These Steps

### Step 1: Hard Refresh Your Browser
Press **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac) to clear cache

### Step 2: Disconnect Your Wallet
1. Open the wallet connection modal (click your address)
2. Click **"Disconnect"**
3. Close the modal

### Step 3: Switch to Somnia in MetaMask
1. **Open MetaMask**
2. **Click the network dropdown** (currently shows "Celo Sepolia")
3. **Select "Somnia Dream Testnet"**
   - If you don't see it, add it manually (see below)

### Step 4: Reconnect Your Wallet
1. Click "Connect Wallet" in the app
2. Select MetaMask
3. Approve the connection

### Step 5: Verify
Check that MetaMask shows:
- **Network**: Somnia Dream Testnet
- **Chain ID**: 50312
- **Currency**: STT

---

## 🛠️ If You Don't Have Somnia Network in MetaMask

### Add Manually:
1. **Open MetaMask**
2. **Click network dropdown** → **Add Network** → **Add a network manually**
3. **Enter these EXACT details**:

```
Network Name: Somnia Dream Testnet
RPC URL: https://dream-rpc.somnia.network
Chain ID: 50312
Currency Symbol: STT
Block Explorer: https://dream-explorer.somnia.network
```

4. **Click "Save"**
5. **Switch to "Somnia Dream Testnet"**

---

## 🎯 After Switching to Somnia

### Test the Connection:
1. Go to any pool page
2. Open browser console (F12)
3. You should see:
   ```
   🌐 Web3Provider Initialized: {
     defaultNetwork: "Somnia Dream",
     defaultChainId: 50312
   }
   ```

### Try a Transaction:
1. Try to deposit
2. MetaMask should now show:
   - **Network**: Somnia Dream Testnet (NOT Celo!)
   - **Currency**: STT (NOT CELO!)
   - **Network fee**: in STT

---

## ❌ If Still Showing Celo

### Nuclear Option - Clear Everything:
1. **Close all browser tabs** with the app
2. **In MetaMask**: Settings → Advanced → Clear activity tab data
3. **Close and reopen MetaMask**
4. **Switch to Somnia Dream Testnet** in MetaMask
5. **Reopen the app** in a new tab
6. **Connect wallet**

---

## 🔍 How to Know It's Working

### ✅ CORRECT (Somnia):
```
Network: Somnia Dream Testnet
Chain ID: 50312
Currency: STT
RPC: dream-rpc.somnia.network
```

### ❌ WRONG (Celo):
```
Network: Celo Sepolia Testnet
Chain ID: 11142220
Currency: CELO
RPC: forno.celo-sepolia.celo-testnet.org
```

---

## 📞 Still Having Issues?

If you're still seeing Celo after all these steps:

1. **Take a screenshot** of:
   - MetaMask showing the current network
   - The transaction request popup
   - Browser console (F12)

2. **Check browser console** for:
   - `🌐 Web3Provider Initialized` log
   - Any `🔴` red error logs

3. **Share the logs** so I can help debug further

---

## 🚀 Summary

**The app now ONLY works with Somnia Dream Testnet (Chain ID: 50312).**

**You MUST**:
1. ✅ Hard refresh browser (Ctrl+Shift+R)
2. ✅ Disconnect wallet
3. ✅ Switch MetaMask to Somnia
4. ✅ Reconnect wallet

**Then try your transaction again!**

