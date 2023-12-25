// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../libs/SafeMathUint.sol";

contract DynamicWeightedLP {
    using SafeMath for uint256;
    using SafeMathUint for uint256;

    struct UserInfo {
        uint256 amountLP;
        uint256 weight;
        uint256 lastTotalWeight;
    }

    mapping(address => UserInfo) public userInfo;

    address[] public allUsers;
    bool private started;

    uint256[] private percents;
    uint256 private startTime;
    uint256 private totalLP;
    uint256 private totalWeight;
    uint256 private totalWeightForAll;
    uint256 private lastUpdateTime;

    event SendTransaction(uint256 typeF, UserInfo userInfo);
    event UpdatePercents(uint256[] percents);

    function sendTransaction(uint256 typeF, uint256 amountLP) public {
        UserInfo storage users = userInfo[msg.sender];
        uint256 time = block.timestamp;
        uint256 curAmountLP = users.amountLP;

        if (typeF == 0) {
            if (curAmountLP <= 0) {
                users.amountLP = amountLP;
                users.weight = 0;
                users.lastTotalWeight = 0;
                allUsers.push(msg.sender);
            }
        }

        if (typeF == 1) {
            if (curAmountLP <= 0) revert("You dont using this pool");
            if (curAmountLP < amountLP) revert("Insufficient LP amount");
        }
        if (_updateInfo(msg.sender, typeF, curAmountLP, amountLP, time)) {
            //tranfer
            // console.log('Done\n');
            emit SendTransaction(typeF, userInfo[msg.sender]);
        } else {
            revert("hz tut potom uzhe dumat");
        }
    }

    function _updateInfo(address user, uint256 typeF, uint256 curAmountLP, uint256 amountLP, uint256 time)
        internal
        returns (bool)
    {
        // typeF 0-deposit, 1-withdraw, 2-reinvest
        UserInfo storage users = userInfo[user];
        if (!started) {
            startTime = time;
            started = true;
        }
        uint256 dTime = time - lastUpdateTime;
        if (dTime != 0 && totalLP != 0) totalWeight += dTime / totalLP;

        totalWeightForAll -= users.weight;
        uint256 weight = users.weight + curAmountLP * (totalWeight - users.lastTotalWeight);
        totalWeightForAll += weight;

        if (typeF == 0) {
            curAmountLP += amountLP;
            totalLP += amountLP;
        }
        if (typeF == 1) {
            curAmountLP -= amountLP;
            totalLP -= amountLP;
        }

        users.amountLP = curAmountLP;
        users.weight = weight;
        users.lastTotalWeight = totalWeight;

        lastUpdateTime = time;

        return true;
    }

    function updatePercents() public {
        for (uint256 i = 0; i < allUsers.length; i++) {
            if (userInfo[allUsers[i]].amountLP > 0) {
                _updateInfo(allUsers[i], 2, userInfo[allUsers[i]].amountLP, 0, block.timestamp);
            }
        }
        uint256 j = 0;
        while (j < allUsers.length) {
            percents[j] = userInfo[allUsers[j]].weight / totalWeightForAll;
            j++;
        }
        // for (uint256 a = 0; a < allUsers.length; a++) {
        //     percents[a] = userInfo[allUsers[a]].weight / totalWeightForAll;
        // }
        emit UpdatePercents(percents);
    }

    function getPercents() external view returns (uint256[] memory) {
        return percents;
    }

    function getUserInfo(address user) external view returns (UserInfo memory) {
        return userInfo[user];
    }
}
