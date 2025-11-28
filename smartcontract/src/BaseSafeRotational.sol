// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BaseSafeRotational is Ownable(msg.sender) {
    address[] public members;
    mapping(address => bool) public hasDeposited;
    uint256 public totalMembers;
    uint256 public depositAmount;
    uint256 public currentRound;
    uint256 public treasuryFeeBps;
    uint256 public relayerFeeBps;
    address public treasury;
    uint256 public nextPayoutTime;
    uint256 public roundDuration;
    bool public active;
    IERC20 public immutable token;

    event Deposit(address indexed user, uint256 amount);
    event Payout(address indexed beneficiary, uint256 amount, uint256 treasuryCut, uint256 relayerCut);
    event Slashed(address indexed offender, uint256 penalty);
    event PoolCompleted();

    uint256 private constant BPS = 10000;

    constructor(
        address _token,
        address[] memory _members,
        uint256 _depositAmount,
        uint256 _roundDuration,
        uint256 _treasuryFeeBps,
        uint256 _relayerFeeBps,
        address _treasury
    ) {
        require(_token != address(0), "token 0");
        require(_members.length >= 2, "need >=2 members");
        require(_depositAmount > 0, "deposit 0");
        require(_roundDuration > 0, "roundDuration 0");
        require(_treasury != address(0), "treasury 0");

        token = IERC20(_token);
        members = _members;
        totalMembers = _members.length;
        depositAmount = _depositAmount;
        roundDuration = _roundDuration;
        treasuryFeeBps = _treasuryFeeBps;
        relayerFeeBps = _relayerFeeBps;
        treasury = _treasury;

        currentRound = 0;
        nextPayoutTime = block.timestamp + roundDuration;
        active = true;
    }

    function deposit() external {
        require(active, "pool inactive");
        require(isMember(msg.sender), "not member");
        require(!hasDeposited[msg.sender], "already deposited");

        bool ok = token.transferFrom(msg.sender, address(this), depositAmount);
        require(ok, "transferFrom failed");

        hasDeposited[msg.sender] = true;
        emit Deposit(msg.sender, depositAmount);
    }

    function triggerPayout() external {
        require(active, "pool inactive");
        require(block.timestamp >= nextPayoutTime, "too early");

        uint256 depositCount = 0;
        for (uint256 i = 0; i < totalMembers; i++) {
            if (hasDeposited[members[i]]) depositCount++;
        }

        if (depositCount < totalMembers) {
            uint256 penalty = (depositAmount * 10) / 100;
            for (uint256 i = 0; i < totalMembers; i++) {
                address candidate = members[i];
                if (!hasDeposited[candidate]) {
                    try IERC20(token).transferFrom(candidate, address(this), penalty) returns (bool success) {
                        if (success) {
                            uint256 toTreasury = penalty / 2;
                            if (toTreasury > 0) {
                                IERC20(token).transfer(treasury, toTreasury);
                            }
                            emit Slashed(candidate, penalty);
                        }
                    } catch {}
                }
            }

            depositCount = 0;
            for (uint256 i = 0; i < totalMembers; i++) {
                if (hasDeposited[members[i]]) depositCount++;
            }
            require(depositCount > 0, "no deposits");
        }

        uint256 totalCollected = depositAmount * depositCount;
        uint256 treasuryCut = (totalCollected * treasuryFeeBps) / BPS;
        uint256 relayerCut = (totalCollected * relayerFeeBps) / BPS;
        uint256 payoutAmount = totalCollected - treasuryCut - relayerCut;

        address beneficiary = members[currentRound % totalMembers];
        require(hasDeposited[beneficiary], "beneficiary not paid");

        hasDeposited[beneficiary] = false;
        currentRound++;

        if (treasuryCut > 0) {
            bool ok1 = token.transfer(treasury, treasuryCut);
            require(ok1, "treasury transfer failed");
        }

        if (relayerCut > 0 && msg.sender != address(0)) {
            bool ok2 = token.transfer(msg.sender, relayerCut);
            require(ok2, "relayer transfer failed");
        }

        bool ok3 = token.transfer(beneficiary, payoutAmount);
        require(ok3, "payout transfer failed");

        emit Payout(beneficiary, payoutAmount, treasuryCut, relayerCut);

        if (currentRound >= totalMembers) {
            active = false;
            emit PoolCompleted();
        } else {
            nextPayoutTime = block.timestamp + roundDuration;
            for (uint256 i = 0; i < totalMembers; i++) {
                hasDeposited[members[i]] = false;
            }
        }
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

