// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../libs/SafeMathUint.sol";

contract DynamicWeightedLP {
    using SafeMath for uint256;
    using SafeMathUint for uint256;

    struct UserInfo {
        uint256 index;
        address user;
        uint256 amountLP;
        uint256 weight;
        uint256 lastTotalWeight;
    }

    mapping(address => UserInfo) userInfo;
    address[] private usersAddr;

    bool private started;

    uint256[] private percents;
    uint256 private startTime;
    uint256 private totalLP;
    uint256 private totalWeight;
    uint256 private lastUpdateTime;

    event SendTransaction(uint256 typeF, UserInfo userInfo);
    event UpdatePercents(uint256[] percents);

    function sendTransaction(uint256 typeF, uint256 amountLP) public {
        UserInfo storage usersInfo = userInfo[msg.sender];

        uint256 time = block.timestamp;
        uint256 curAmountLP = usersInfo.amountLP;

        if (typeF == 0) {
            if (curAmountLP <= 0) {
                usersInfo.user = msg.sender;
                usersInfo.amountLP = amountLP;
                usersInfo.weight = 0;
                usersInfo.lastTotalWeight = 0;
                usersAddr.push(msg.sender);
            }
        }

        if (typeF == 1) {
            if (curAmountLP <= 0) revert("You dont using this pool");
            if (curAmountLP < amountLP) revert("Insufficient LP amount");
        }
        if (_updateInfo(msg.sender, typeF, curAmountLP, amountLP, time)) {
            //tranfer
            // console.log('Done\n');
            emit SendTransaction(typeF, usersInfo);
        } else {
            revert("hz tut potom uzhe dumat");
        }
    }

    function _updateInfo(address user, uint256 typeF, uint256 curAmountLP, uint256 amountLP, uint256 time)
        internal
        returns (bool)
    {
        // typeF 0-deposit, 1-withdraw, 2-reinvest
        UserInfo storage usersInfo = userInfo[user];
        if (!started) {
            startTime = time;
            started = true;
        }
        uint256 dTime = time - lastUpdateTime;
        if (dTime != 0 && totalLP != 0) totalWeight += dTime / totalLP;

        uint256 weight = usersInfo.weight + curAmountLP * (totalWeight - usersInfo.lastTotalWeight);

        if (typeF == 0) {
            curAmountLP += amountLP;
            totalLP += amountLP;
        }
        if (typeF == 1) {
            curAmountLP -= amountLP;
            totalLP -= amountLP;
        }

        usersInfo.amountLP = curAmountLP;
        usersInfo.weight = weight;
        usersInfo.lastTotalWeight = totalWeight;

        lastUpdateTime = time;

        return true;
    }

    function updatePercents() public {
        for (uint256 i = 0; i < usersAddr.length; i++) {
            percents[i] = _updatePercentForOneUser(userInfo[usersAddr[i]].user);
        }
        // emit UpdatePercents(percents);
    }

    function _updatePercentForOneUser(address user) internal returns (uint256 percent) {
        UserInfo memory usersInfo = userInfo[user];
        uint256 time = block.timestamp;
        uint256 dTimeAll = time - startTime;
        uint256 dTime = time - lastUpdateTime;
        if (dTime != 0 && totalLP != 0) totalWeight += dTime / totalLP;

        percent = (usersInfo.weight + usersInfo.amountLP * (totalWeight - usersInfo.lastTotalWeight)) / dTimeAll;
        return percent;
        // emit UpdatePercents(percents);
    }

    function getPercents() external view returns (uint256[] memory) {
        return percents;
    }

    function getUserInfo(address user) external view returns (UserInfo memory) {
        return userInfo[user];
    }
}
