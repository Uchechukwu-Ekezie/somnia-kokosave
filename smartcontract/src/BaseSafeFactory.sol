// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BaseSafeRotational.sol";
import "./BaseSafeTarget.sol";
import "./BaseSafeFlexible.sol";

contract BaseSafeFactory {
    address public immutable token;
    address public treasury;
    address[] public allRotational;
    address[] public allTarget;
    address[] public allFlexible;
    address public owner;

    event RotationalCreated(address indexed pool, address indexed creator);
    event TargetCreated(address indexed pool, address indexed creator);
    event FlexibleCreated(address indexed pool, address indexed creator);

    constructor(address _token, address _treasury) {
        require(_token != address(0), "token 0");
        require(_treasury != address(0), "treasury 0");
        token = _token;
        treasury = _treasury;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    function createRotational(
        address[] calldata members,
        uint256 depositAmount,
        uint256 roundDuration,
        uint256 treasuryFeeBps,
        uint256 relayerFeeBps
    ) external returns (address) {
        BaseSafeRotational pool = new BaseSafeRotational(
            token, members, depositAmount, roundDuration, treasuryFeeBps, relayerFeeBps, treasury
        );
        pool.transferOwnership(msg.sender);
        allRotational.push(address(pool));
        emit RotationalCreated(address(pool), msg.sender);
        return address(pool);
    }

    function createTarget(address[] calldata members, uint256 targetAmount, uint256 deadline, uint256 treasuryFeeBps)
        external
        returns (address)
    {
        BaseSafeTarget pool = new BaseSafeTarget(token, members, targetAmount, deadline, treasuryFeeBps, treasury);
        pool.transferOwnership(msg.sender);
        allTarget.push(address(pool));
        emit TargetCreated(address(pool), msg.sender);
        return address(pool);
    }

    function createFlexible(
        address[] calldata members,
        uint256 minimumDeposit,
        uint256 withdrawalFeeBps,
        bool yieldEnabled,
        uint256 treasuryFeeBps
    ) external returns (address) {
        BaseSafeFlexible pool = new BaseSafeFlexible(
            token, members, minimumDeposit, withdrawalFeeBps, yieldEnabled, treasury, treasuryFeeBps
        );
        pool.transferOwnership(msg.sender);
        allFlexible.push(address(pool));
        emit FlexibleCreated(address(pool), msg.sender);
        return address(pool);
    }

    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "treasury 0");
        treasury = _treasury;
    }
}
