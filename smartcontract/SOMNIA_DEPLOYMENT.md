# Somnia Dream Testnet Deployment

## ✅ Successfully Deployed Contracts

**Network:** Somnia Dream Testnet  
**Chain ID:** 50312  
**Deployment Date:** [Current Date]

---

## Contract Addresses

### BaseToken (BST)
- **Address:** `0x2A4690ec1Ef5d97A1366eB69e30C5a2a13E91773`
- **Name:** Base Safe Token
- **Symbol:** BST
- **Explorer:** https://dream-explorer.somnia.network/address/0x2A4690ec1Ef5d97A1366eB69e30C5a2a13E91773

### BaseSafeFactory
- **Address:** `0x2431B645983ef9A58042479095B80d72100BFf04`
- **Explorer:** https://dream-explorer.somnia.network/address/0x2431B645983ef9A58042479095B80d72100BFf04

### Treasury
- **Address:** `0xa91D5A0a64ED5eeF11c4359C4631279695A338ef`

---

## Frontend Configuration

Update `frontend/.env.local` with:

```env
# Somnia Dream Testnet
NEXT_PUBLIC_CHAIN_ID=50312
NEXT_PUBLIC_TOKEN_ADDRESS=0x2A4690ec1Ef5d97A1366eB69e30C5a2a13E91773
NEXT_PUBLIC_FACTORY_ADDRESS=0x2431B645983ef9A58042479095B80d72100BFf04
NEXT_PUBLIC_SOMNIA_RPC_URL=https://dream-rpc.somnia.network
```

---

## Next Steps

1. ✅ Contracts deployed on Somnia
2. ⬜ Update frontend environment variables
3. ⬜ Test contract interactions
4. ⬜ Test Somnia Data Streams integration
5. ⬜ Verify real-time activity feeds

---

## Verification

You can verify the contracts on Somnia Explorer:
- Token: https://dream-explorer.somnia.network/address/0x2A4690ec1Ef5d97A1366eB69e30C5a2a13E91773
- Factory: https://dream-explorer.somnia.network/address/0x2431B645983ef9A58042479095B80d72100BFf04

---

## Deployment Summary

✅ **BaseToken** deployed successfully  
✅ **BaseSafeFactory** deployed successfully  
✅ **All contracts verified on Somnia Dream Testnet**

The contracts are now live and ready to use!

