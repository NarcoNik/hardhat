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
    address[] public usersAddr;
    bool public started;

    uint256[] public percents;
    uint256 public startTime;
    uint256 public totalLP;
    uint256 public totalWeight;
    uint256 public lastUpdateTime;

    event SendTransaction(uint256 typeF, UserInfo userInfo);
    event UpdatePercents(uint256[] percents);

    function sendTransaction(uint256 typeF, uint256 amountLP) public {
        // typeF 0-deposit, 1-withdraw, 2-reinvest
        address user = msg.sender;

        uint256 time = block.timestamp;
        uint256 curAmountLP = userInfo[user].amountLP;

        if (typeF == 0) {
            if (curAmountLP <= 0) {
                userInfo[user] = UserInfo(amountLP, 0, 0);
                usersAddr.push(user);
            }
        }

        if (typeF == 1) {
            require(curAmountLP > 0, "You dont using this pool");
            require(curAmountLP >= amountLP, "Insufficient LP amount");
        }

        if (_updateInfo(user, typeF, curAmountLP, amountLP, time)) {
            emit SendTransaction(typeF, userInfo[user]);
        } else {
            revert("hz tut potom uzhe dumat");
        }
    }

    function _updateInfo(address user, uint256 typeF, uint256 curAmountLP, uint256 amountLP, uint256 time)
        internal
        returns (bool)
    {
        if (!started) {
            startTime = time;
            started = true;
        }

        uint256 dTime = time - lastUpdateTime;
        if (dTime != 0 && totalLP != 0) {
            totalWeight += dTime.div(totalLP);
            lastUpdateTime = time;
        }

        uint256 weight = userInfo[user].weight.add(curAmountLP.mul(totalWeight.sub(userInfo[user].lastTotalWeight)));

        if (typeF == 0) {
            curAmountLP += amountLP;
            totalLP += amountLP;
        }

        if (typeF == 1) {
            curAmountLP -= amountLP;
            totalLP -= amountLP;
        }

        userInfo[user] = UserInfo(curAmountLP, weight, totalWeight);

        return true;
    }

    function updatePercents() external {
        uint256 time = block.timestamp;
        uint256 dTimeAll = time - startTime;
        uint256 dTime = time - lastUpdateTime;
        uint256 totalWeights = totalWeight.add(dTime.div(totalLP));

        for (uint256 i = 0; i < usersAddr.length; i++) {
            address user = usersAddr[i];
            percents[i] = userInfo[user].weight.add(
                userInfo[user].amountLP.mul(totalWeights.sub(userInfo[user].lastTotalWeight))
            ).div(dTimeAll);
        }
        emit UpdatePercents(percents);
    }

    function getPercentForUser(address user) external view returns (uint256) {
        uint256 time = block.timestamp;
        uint256 dTimeAll = time - startTime;
        uint256 dTime = time - lastUpdateTime;
        uint256 totalWeights = totalWeight.add(dTime.div(totalLP));

        uint256 percent = userInfo[user].weight.add(
            userInfo[user].amountLP.mul(totalWeights.sub(userInfo[user].lastTotalWeight))
        ).div(dTimeAll);

        return percent;
    }

    function getPercents() external view returns (uint256[] memory) {
        return percents;
    }
}
