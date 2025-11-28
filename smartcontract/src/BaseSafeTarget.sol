// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BaseSafeTarget is Ownable(msg.sender) {
    address[] public members;
    mapping(address => uint256) public contributions;
    uint256 public totalMembers;
    uint256 public targetAmount;
    uint256 public deadline;
    uint256 public totalContributed;
    bool public completed;
    bool public active;
    address public treasury;
    uint256 public treasuryFeeBps;
    IERC20 public immutable token;

    event Contributed(address indexed user, uint256 amount);
    event TargetReached();
    event Withdrawal(address indexed user, uint256 amount);

    uint256 private constant BPS = 10000;

    constructor(
        address _token,
        address[] memory _members,
        uint256 _targetAmount,
        uint256 _deadline,
        uint256 _treasuryFeeBps,
        address _treasury
    ) {
        require(_token != address(0), "token 0");
        require(_members.length >= 2, "need >=2 members");
        require(_targetAmount > 0, "target 0");
        require(_deadline > block.timestamp, "deadline past");
        require(_treasury != address(0), "treasury 0");

        token = IERC20(_token);
        members = _members;
        totalMembers = _members.length;
        targetAmount = _targetAmount;
        deadline = _deadline;
        treasuryFeeBps = _treasuryFeeBps;
        treasury = _treasury;
        active = true;
    }

    function contribute(uint256 amount) external {
        require(active, "pool inactive");
        require(isMember(msg.sender), "not member");
        require(block.timestamp <= deadline, "deadline passed");
        require(amount > 0, "amount 0");

        bool ok = token.transferFrom(msg.sender, address(this), amount);
        require(ok, "transferFrom failed");

        contributions[msg.sender] += amount;
        totalContributed += amount;

        emit Contributed(msg.sender, amount);

        if (totalContributed >= targetAmount) {
            completed = true;
            active = false;
            emit TargetReached();
        }
    }

    function withdraw() external {
        require(completed || block.timestamp > deadline, "not ready");
        require(contributions[msg.sender] > 0, "no contribution");

        uint256 share = contributions[msg.sender];
        uint256 totalFees = (totalContributed * treasuryFeeBps) / BPS;
        uint256 netAmount = totalContributed - totalFees;
        uint256 userShare = (share * netAmount) / totalContributed;

        contributions[msg.sender] = 0;

        bool ok = token.transfer(msg.sender, userShare);
        require(ok, "transfer failed");

        emit Withdrawal(msg.sender, userShare);
    }

    function treasuryWithdraw() external onlyOwner {
        require(completed || block.timestamp > deadline, "not ready");

        uint256 totalFees = (totalContributed * treasuryFeeBps) / BPS;
        require(totalFees > 0, "no fees");

        bool ok = token.transfer(treasury, totalFees);
        require(ok, "transfer failed");
    }

    function isMember(address who) public view returns (bool) {
        for (uint256 i = 0; i < totalMembers; i++) {
            if (members[i] == who) return true;
        }
        return false;
    }

    function membersList() external view returns (address[] memory) {
        return members;
    }
}

