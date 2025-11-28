# Deployment Order for Remix

## Step 1: Deploy BaseToken FIRST

### Contract: BaseToken.sol

**Constructor Arguments:**
- `name` (string): `"Base Safe Token"`
- `symbol` (string): `"BST"`
0x2A4690ec1Ef5d97A1366eB69e30C5a2a13E91773

**Settings:**
- Gas Limit: `1,000,000`
- Compiler Version: `0.8.20`

**After Deployment:**
- ✅ **SAVE THE TOKEN ADDRESS!** You'll need it for Step 2
- Example: `0x1234...5678`

---

## Step 2: Deploy BaseSafeFactory SECOND

### Contract: BaseSafeFactory.sol

**Constructor Arguments:**
- `_token` (address): `[The BaseToken address from Step 1]`
- `_treasury` (address): `0xa91D5A0a64ED5eeF11c4359C4631279695A338ef`

**Settings:**
- Gas Limit: `5,000,000`
- Compiler Version: `0.8.20`

**After Deployment:**
- ✅ **SAVE THE FACTORY ADDRESS!**
- This is your main contract address

---

## Quick Checklist

### Before Starting:
- [ ] OpenZeppelin contracts imported in Remix
- [ ] MetaMask connected to Somnia Dream (Chain ID: 50312)
- [ ] Have STT tokens for gas fees
- [ ] All contract files uploaded to Remix

### Step 1: BaseToken
- [ ] Compile BaseToken.sol
- [ ] Deploy with constructor: `"Base Safe Token"`, `"BST"`
- [ ] Set gas limit: 1,000,000
- [ ] **Copy and save the deployed address**

### Step 2: BaseSafeFactory
- [ ] Compile BaseSafeFactory.sol (ignore size warning)
- [ ] Deploy with constructor: `[token address]`, `0xa91D5A0a64ED5eeF11c4359C4631279695A338ef`
- [ ] Set gas limit: 5,000,000
- [ ] **Copy and save the deployed address**

### After Deployment:
- [ ] Update frontend `.env.local` with both addresses
- [ ] Test the contracts

---

## Why This Order?

1. **BaseToken** must be deployed first because:
   - BaseSafeFactory needs the token address in its constructor
   - The factory will use this token for all pool operations

2. **BaseSafeFactory** is deployed second because:
   - It depends on the token address
   - It's the main contract users will interact with

---

## Example Deployment

```
Step 1: Deploy BaseToken
  → Address: 0xABC123...DEF456
  ✅ Saved!

Step 2: Deploy BaseSafeFactory
  → Token: 0xABC123...DEF456 (from Step 1)
  → Treasury: 0xa91D5A0a64ED5eeF11c4359C4631279695A338ef
  → Address: 0x789ABC...123DEF
  ✅ Saved!
```

---

## Update Frontend After Deployment

Add to `frontend/.env.local`:

```env
NEXT_PUBLIC_TOKEN_ADDRESS=0xABC123...DEF456
NEXT_PUBLIC_FACTORY_ADDRESS=0x789ABC...123DEF
```

