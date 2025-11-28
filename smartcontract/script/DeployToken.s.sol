// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {BaseToken} from "../src/BaseToken.sol";

contract DeployToken is Script {
    string constant TOKEN_NAME = "Base Safe Token";
    string constant TOKEN_SYMBOL = "BST";

    function run() external returns (address tokenAddress) {
        vm.startBroadcast();

        console.log("Deploying BaseToken...");
        BaseToken token = new BaseToken(TOKEN_NAME, TOKEN_SYMBOL);
        tokenAddress = address(token);
        console.log("BaseToken deployed at:", tokenAddress);

        vm.stopBroadcast();

        return tokenAddress;
    }
}

