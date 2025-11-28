# Step-by-Step: Fix OpenZeppelin Error in Remix

## Quick Fix (2 minutes)

### Step 1: Import OpenZeppelin Contracts

1. Open Remix IDE: https://remix.ethereum.org
2. Look at the **left sidebar** → Click **"File Explorer"**
3. You'll see a **GitHub icon** (or go to **File** → **Load from GitHub**)
4. Enter this:
   ```
   GitHub URL: OpenZeppelin/openzeppelin-contracts
   Path: contracts/
   ```
5. Click **"OK"** or **"Load"**

✅ OpenZeppelin contracts will now be in your Remix workspace!

### Step 2: Update Your Contract Imports

After importing, OpenZeppelin is at: `contracts/token/ERC20/...`

**In Remix, edit your contracts and change the imports:**

#### BaseToken.sol:
```solidity
// Change this:
import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

// To this:
import "contracts/token/ERC20/ERC20.sol";
```

#### BaseSafeRotational.sol, BaseSafeTarget.sol, BaseSafeFlexible.sol:
```solidity
// Change this:
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// To this:
import "contracts/token/ERC20/IERC20.sol";
import "contracts/access/Ownable.sol";
```

### Step 3: Compile

1. Go to **"Solidity Compiler"** tab
2. Select version: **0.8.20**
3. Click **"Compile BaseToken.sol"**
4. Should compile successfully! ✅

### Step 4: Deploy

1. Go to **"Deploy & Run Transactions"** tab
2. Connect MetaMask (Injected Provider)
3. Switch to **Somnia Dream** network (Chain ID: 50312)
4. Deploy **BaseToken** first:
   - Constructor: `"Base Safe Token"`, `"BST"`
   - Gas Limit: `1,000,000`
5. Then deploy **BaseSafeFactory**:
   - Constructor: `[token address]`, `0xa91D5A0a64ED5eeF11c4359C4631279695A338ef`
   - Gas Limit: `5,000,000`

## If GitHub Import Doesn't Work

### Manual Method:

1. Go to: https://github.com/OpenZeppelin/openzeppelin-contracts
2. Click **"Code"** → **"Download ZIP"**
3. Extract the ZIP
4. In Remix, create folder: `contracts`
5. Upload these files from the extracted folder:
   - `contracts/token/ERC20/IERC20.sol`
   - `contracts/token/ERC20/ERC20.sol`
   - `contracts/access/Ownable.sol`
   - `contracts/utils/Context.sol` (dependency)
   - `contracts/interfaces/IERC20.sol` (if exists)

Then use: `import "contracts/token/ERC20/ERC20.sol";`

## Still Having Issues?

Check:
- ✅ Solidity version is 0.8.20
- ✅ OpenZeppelin contracts are in `contracts/` folder
- ✅ Import paths use `"contracts/..."` not `"@openzeppelin/..."`
- ✅ All dependencies are uploaded

