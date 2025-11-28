# Quick Start: Remix Deployment

## Fastest Method - Use GitHub Import

1. **Open Remix**: https://remix.ethereum.org

2. **Import OpenZeppelin**:
   - Click **File Explorer** (left sidebar)
   - Click **GitHub icon** (or File → Load from GitHub)
   - Enter: `OpenZeppelin/openzeppelin-contracts`
   - Path: `contracts/`
   - Click **OK**

3. **Upload Your Contracts**:
   - Create folder: `mycontracts`
   - Upload all `.sol` files from `smartcontract/src/`

4. **Fix Import Paths**:
   - In Remix, OpenZeppelin will be at: `contracts/token/ERC20/...`
   - Update imports to: `import "contracts/token/ERC20/IERC20.sol";`
   - Or use: `import "@openzeppelin/contracts/token/ERC20/IERC20.sol";` if you created that structure

5. **Compile & Deploy**:
   - Compiler: 0.8.20
   - Deploy BaseToken first (gas: 1M)
   - Then deploy BaseSafeFactory (gas: 5M)

## Alternative: Use Remix's npm Package Manager

1. In Remix, go to **Plugin Manager**
2. Enable **"Solidity Compiler"** and **"Deploy & Run"**
3. Some versions of Remix support npm imports directly
4. Try: `import "@openzeppelin/contracts/token/ERC20/ERC20.sol";`

## If GitHub Import Fails

1. Download OpenZeppelin: https://github.com/OpenZeppelin/openzeppelin-contracts/archive/refs/heads/master.zip
2. Extract to your computer
3. In Remix, create folder structure matching the extracted folders
4. Upload the OpenZeppelin contract files you need

