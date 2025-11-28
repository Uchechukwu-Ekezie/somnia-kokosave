// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BaseSafeFlexible is Ownable(msg.sender) {
    address[] public members;
    mapping(address => uint256) public balances;
    uint256 public totalMembers;
    uint256 public minimumDeposit;
    uint256 public withdrawalFeeBps;
    uint256 public totalBalance;
    bool public active;
    address public treasury;
    uint256 public treasuryFeeBps;
    bool public yieldEnabled;
    IERC20 public immutable token;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount, uint256 fee);
    event YieldDistributed(uint256 amount);

    uint256 private constant BPS = 10000;

    constructor(
        address _token,
        address[] memory _members,
        uint256 _minimumDeposit,
        uint256 _withdrawalFeeBps,
        bool _yieldEnabled,
        address _treasury,
        uint256 _treasuryFeeBps
    ) {
        require(_token != address(0), "token 0");
        require(_members.length >= 2, "need >=2 members");
        require(_minimumDeposit > 0, "minimum 0");
        require(_treasury != address(0), "treasury 0");

        token = IERC20(_token);
        members = _members;
        totalMembers = _members.length;
        minimumDeposit = _minimumDeposit;
        withdrawalFeeBps = _withdrawalFeeBps;
        yieldEnabled = _yieldEnabled;
        treasury = _treasury;
        treasuryFeeBps = _treasuryFeeBps;
        active = true;
    }

    function deposit(uint256 amount) external {
        require(active, "pool inactive");
        require(isMember(msg.sender), "not member");
        require(amount >= minimumDeposit, "below minimum");

        bool ok = token.transferFrom(msg.sender, address(this), amount);
        require(ok, "transferFrom failed");

        balances[msg.sender] += amount;
        totalBalance += amount;

        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(amount > 0, "amount 0");
        require(balances[msg.sender] >= amount, "insufficient balance");

        uint256 fee = (amount * withdrawalFeeBps) / BPS;
        uint256 netAmount = amount - fee;

        balances[msg.sender] -= amount;
        totalBalance -= amount;

        if (fee > 0) {
            bool feeOk = token.transfer(treasury, fee);
            require(feeOk, "fee transfer failed");
        }

        bool ok = token.transfer(msg.sender, netAmount);
        require(ok, "withdraw transfer failed");

        emit Withdrawn(msg.sender, netAmount, fee);
    }

    function distributeYield(uint256 yieldAmount) external onlyOwner {
        require(yieldEnabled, "yield disabled");
        require(yieldAmount > 0, "yield 0");
        require(totalBalance > 0, "no balance");

        for (uint256 i = 0; i < totalMembers; i++) {
            address member = members[i];
            if (balances[member] > 0) {
                uint256 memberYield = (yieldAmount * balances[member]) / totalBalance;
                balances[member] += memberYield;
            }
        }

        emit YieldDistributed(yieldAmount);
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

    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }
}

