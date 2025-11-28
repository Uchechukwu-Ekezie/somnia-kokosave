# Deploying to Somnia Using Remix IDE

## Step 1: Install OpenZeppelin Contracts in Remix

### Option A: Using GitHub Import (Recommended)

1. **Open Remix IDE**: https://remix.ethereum.org

2. **Go to File Explorer** (left sidebar)

3. **Click the GitHub icon** (or use File → Load from GitHub)

4. **Import OpenZeppelin Contracts**:
   - Repository: `OpenZeppelin/openzeppelin-contracts`
   - Path: `contracts/`
   - Click "OK"

   This will import all OpenZeppelin contracts into your Remix workspace.

### Option B: Using npm Package Manager

1. In Remix, go to **File Explorer**
2. Right-click and select **"New Folder"** → name it `node_modules`
3. Inside `node_modules`, create folder `@openzeppelin`
4. Import from GitHub: `OpenZeppelin/openzeppelin-contracts` into `node_modules/@openzeppelin/contracts`

### Option C: Manual Copy (If GitHub doesn't work)

1. Go to: https://github.com/OpenZeppelin/openzeppelin-contracts
2. Download ZIP or clone the repository
3. In Remix, create folder structure:
   - `@openzeppelin/contracts/`
4. Copy the needed files:
   - `contracts/token/ERC20/IERC20.sol`
   - `contracts/token/ERC20/ERC20.sol`
   - `contracts/access/Ownable.sol`
   - And their dependencies (utils, interfaces, etc.)

## Step 2: Upload Your Contracts

1. **Create a folder** in Remix (e.g., `contracts`)

2. **Upload your contract files**:
   - `BaseToken.sol`
   - `BaseSafeRotational.sol`
   - `BaseSafeTarget.sol`
   - `BaseSafeFlexible.sol`
   - `BaseSafeFactory.sol`

3. **Fix import paths** if needed:
   - Change `@openzeppelin/` to match your folder structure
   - Or use relative paths if OpenZeppelin is in a different location

## Step 3: Compile

1. Go to **Solidity Compiler** tab
2. Select compiler version: **0.8.20**
3. Click **"Compile BaseSafeFactory.sol"**
4. Ensure no errors

## Step 4: Deploy

1. Go to **"Deploy & Run Transactions"** tab
2. Select **"Injected Provider - MetaMask"**
3. Ensure you're on **Somnia Dream** network (Chain ID: 50312)
4. Deploy in this order:

### Deploy BaseToken First:
- Contract: `BaseToken`
- Constructor args:
  - `name`: `Base Safe Token`
  - `symbol`: `BST`
- **Gas Limit**: Set to `1,000,000`
- Click "Deploy"
- **Save the token address!**

### Deploy BaseSafeFactory:
- Contract: `BaseSafeFactory`
- Constructor args:
  - `_token`: `[Your BaseToken address]`
  - `_treasury`: `0xa91D5A0a64ED5eeF11c4359C4631279695A338ef`
- **Gas Limit**: Set to `5,000,000`
- Click "Deploy"
- **Save the factory address!**

## Troubleshooting

### "File not found" errors:
- Make sure OpenZeppelin contracts are imported correctly
- Check import paths match your folder structure
- Try using `@openzeppelin/` prefix or adjust paths

### Compilation errors:
- Ensure Solidity version is 0.8.20
- Check all imports resolve
- Verify OpenZeppelin contracts are in the workspace

### Deployment errors:
- Increase gas limit if transaction fails
- Ensure you have STT tokens for gas
- Verify you're on Somnia Dream network

## Quick Import Path Reference

If OpenZeppelin is in `@openzeppelin/contracts/`:
```solidity
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
```

If OpenZeppelin is in root `contracts/` folder:
```solidity
import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";
```

