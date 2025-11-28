# Deposit Transaction Failing - Troubleshooting Guide

## Error: "Gas limit is less than 21000"

This error means the transaction will revert, so gas estimation fails. Here are the common causes and fixes:

## 1. Token Not Approved ✅ MOST COMMON

**Problem**: The pool contract doesn't have permission to spend your tokens.

**Solution**: 
1. Click "Approve & Deposit" button (not just "Deposit")
2. This will:
   - First: Approve the pool to spend your tokens
   - Then: Automatically trigger the deposit

**How to check**: Look for an "Approve" button or "Approve & Deposit" button in the UI.

## 2. Insufficient Token Balance

**Problem**: You don't have enough STT tokens in your wallet.

**Solution**:
1. Check your STT balance in MetaMask
2. Make sure you have enough tokens for the deposit
3. Get more STT tokens if needed

**Token Address**: `0x24642ffABF43D4bd33e1E883A23E10DdFde186c6`

## 3. Not a Pool Member

**Problem**: You're trying to deposit to a pool where you're not a member.

**Solution**:
- You can only deposit to pools where your address was added as a member during creation
- Check if your address (`0xa91D5A0a64ED5eeF11c4359C4631279695A338ef`) is in the pool's member list

## 4. Wrong Round (Rotational Pools Only)

**Problem**: For rotational pools, you can only deposit during your designated round.

**Solution**:
- Wait for your turn in the rotation
- Check which round the pool is currently in
- Check which member should deposit in the current round

## 5. Pool Not Active

**Problem**: The pool might be paused or completed.

**Solution**:
- Check the pool status
- Only active pools accept deposits

## 6. Amount Issues (Flexible/Target Pools)

**Problem**: 
- Amount is 0 or negative
- Amount exceeds your balance
- Amount is below minimum deposit (flexible pools)

**Solution**:
- Enter a valid deposit amount
- Make sure it's greater than 0
- Check minimum deposit requirements

## How to Debug

### Step 1: Check Token Approval
```
1. Go to the pool page
2. Look for "Approve & Deposit" button
3. Click it and approve the transaction
4. Wait for approval to complete
5. Deposit will auto-trigger after approval
```

### Step 2: Check Token Balance
```
1. Open MetaMask
2. Add STT token if not visible:
   - Click "Import tokens"
   - Token address: 0x24642ffABF43D4bd33e1E883A23E10DdFde186c6
3. Check your balance
```

### Step 3: Check Pool Membership
```
1. Go to pool page
2. Look at "Members" section
3. Verify your address is listed
```

### Step 4: Check Pool Type and Requirements
```
Rotational Pool:
- Must be your turn to deposit
- Fixed deposit amount
- No amount input needed

Target Pool:
- Can deposit any amount
- Must enter amount
- Pool must not be at target yet

Flexible Pool:
- Can deposit any amount above minimum
- Must enter amount
- Check minimum deposit requirement
```

## Quick Fix Checklist

- [ ] Token approved for pool contract?
- [ ] Sufficient STT balance?
- [ ] You're a pool member?
- [ ] Pool is active?
- [ ] (Rotational) Is it your turn?
- [ ] (Target/Flexible) Valid deposit amount entered?
- [ ] Connected to Somnia Testnet?
- [ ] Correct pool address?

## Still Not Working?

If you've checked all the above and it still fails, the issue might be:

1. **Contract Bug**: The pool contract might have an issue
2. **Network Issues**: Try refreshing and reconnecting wallet
3. **Wrong Pool Type**: The pool might not be the type you think it is

### Get More Info

Check the pool contract on the explorer:
```
https://dream-explorer.somnia.network/address/[POOL_ADDRESS]
```

Look for:
- Pool members list
- Current round (if rotational)
- Pool status
- Recent transactions


