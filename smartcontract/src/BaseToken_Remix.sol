// SPDX-License-Identifier: MIT
// Remix-compatible version - adjust import path as needed
pragma solidity ^0.8.20;

// For Remix: Use one of these import paths depending on how you installed OpenZeppelin:
// Option 1: If using @openzeppelin/contracts folder
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// Option 2: If using openzeppelin-contracts folder
// import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
// Option 3: If OpenZeppelin is in root contracts folder
// import "contracts/token/ERC20/ERC20.sol";

contract BaseToken is ERC20 {
    address public owner;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner is zero address");
        owner = newOwner;
    }
}

