# Network Error Debugging Guide

## 🔍 Problem Identified

The error `forno.celo-sepolia.celo-testnet.org/:1 Failed to load resource: the server responded with a status of 400` indicates your wallet was trying to connect to **Celo Sepolia** network instead of **Somnia Dream Testnet**.

## ✅ Fixes Applied

### 1. **Set Somnia as Default Network**
- **File**: `components/web3-provider.tsx`
- **Change**: Moved `somniaDream` to the **first position** in the networks array
- **Result**: Somnia is now the default network when connecting your wallet

### 2. **Added Network Checker Component**
- **File**: `components/network-checker.tsx`
- **Purpose**: Shows a prominent warning if you're on the wrong network
- **Features**:
  - Detects current network
  - Shows clear error message
  - Provides "Switch to Somnia" button
  - Auto-adds Somnia network to MetaMask if not present

### 3. **Added Comprehensive Logging**
- **Files**: 
  - `hooks/useBaseSafeContracts.ts`
  - `components/group/group-actions.tsx`
- **Logs**:
  - 🔵 Transaction initiation (blue)
  - 🔴 Errors (red)
  - Network information (chain ID, name)
  - Contract addresses
  - Full error details

### 4. **Added Network Validation**
- Before any transaction, the app now checks:
  - Current chain ID
  - Expected chain ID (50312 for Somnia)
  - Shows alert if on wrong network

## 🚀 How to Test

1. **Refresh the page** (to load new config):
   ```bash
   Ctrl+Shift+R (or Cmd+Shift+R on Mac)
   ```

2. **Open Browser Console** (F12 or Right-click → Inspect → Console)

3. **Check the logs**:
   - You should see: `🌐 Web3Provider Initialized`
   - Default network should be: `Somnia Dream (50312)`

4. **Connect your wallet**:
   - If you're on the wrong network, you'll see a red warning banner
   - Click "Switch to Somnia Testnet" button

5. **Try a transaction**:
   - Go to a pool
   - Try to deposit
   - Watch the console for detailed logs

## 📊 Console Logs to Watch For

### ✅ Good Logs (Everything Working)
```
🌐 Web3Provider Initialized: {
  defaultNetwork: "Somnia Dream",
  defaultChainId: 50312
}

🔵 TOKEN APPROVAL - Initiating: {
  currentChainId: 50312,
  isCorrectNetwork: true
}

🔵 ROTATIONAL DEPOSIT - Initiating: {
  currentChainId: 50312,
  isCorrectNetwork: true
}
```

### ❌ Bad Logs (Wrong Network)
```
🔴 WRONG NETWORK! Expected Somnia (50312), got: 11142220 Celo Sepolia
```

### 🔴 Error Logs (Transaction Failed)
```
🔴 ROTATIONAL DEPOSIT - Write Contract Error: {
  error: { ... },
  errorMessage: "..."
}
```

## 🛠️ Manual Network Switch (If Auto-Switch Fails)

If the "Switch to Somnia" button doesn't work, add manually:

1. **Open MetaMask**
2. **Click network dropdown** → **Add Network** → **Add a network manually**
3. **Enter these details**:
   - **Network Name**: `Somnia Dream Testnet`
   - **RPC URL**: `https://dream-rpc.somnia.network`
   - **Chain ID**: `50312`
   - **Currency Symbol**: `STT`
   - **Block Explorer**: `https://dream-explorer.somnia.network`
4. **Click Save**
5. **Switch to Somnia Dream Testnet**

## 🔧 Common Issues

### Issue 1: Still seeing Celo errors
**Solution**: Hard refresh the page (Ctrl+Shift+R) and reconnect your wallet

### Issue 2: MetaMask not prompting to switch
**Solution**: Manually switch in MetaMask before trying transaction

### Issue 3: Transaction still failing
**Solution**: Check console logs for specific error details and share them

## 📝 What Changed in the Code

### Before:
```typescript
const networks = [celoSepolia, celoMainnet, baseSepolia, baseMainnet, somniaDream];
```

### After:
```typescript
const networks = [somniaDream, celoSepolia, celoMainnet, baseSepolia, baseMainnet];
```

This simple change makes Somnia the **default network** instead of Celo.

## 🎯 Next Steps

1. **Refresh your browser** (hard refresh: Ctrl+Shift+R)
2. **Reconnect your wallet**
3. **Check if you're on Somnia** (should see "Somnia Dream" in MetaMask)
4. **Try the transaction again**
5. **Check console logs** for any errors
6. **Share the logs** if you still see errors

## 📞 If Still Having Issues

Share these details:
1. Current network shown in MetaMask
2. Console logs (especially 🔴 red errors)
3. Screenshot of any error messages
4. Transaction hash (if transaction was submitted)

---

**Remember**: All transactions MUST be on **Somnia Dream Testnet (Chain ID: 50312)**. Any other network will fail.

