// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../libs/SafeMathInt.sol";
import "../libs/SafeMathUint.sol";

pragma solidity ^0.8.22;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../libs/SafeMathInt.sol";
import "../libs/SafeMathUint.sol";

contract DynamicWeightedLP {
    using Address for address payable;
    using SafeMath for uint256;
    using SafeMathUint for uint256;
    using SafeMathInt for int256;

    struct UserInfo {
        uint256 lastUpdateTime;
        uint256 LP;
        uint256 LPt;
    }

    mapping(address => UserInfo) userInfo;

    uint256 private totalLPs;

    function deposit(uint256 LP) external {
        UserInfo storage users = userInfo[msg.sender];
        uint256 t = block.timestamp;

        users.LP += LP;
        users.lastUpdateTime = t;
        totalLPs += LP;
    }

    function withdraw(uint256 LP) external {
        UserInfo storage users = userInfo[msg.sender];
        require(LP > 0, "Amount must be greater than 0");
        require(users.LP >= LP, "Insufficient LP amount");

        users.LP -= LP;
        users.lastUpdateTime = block.timestamp;
        totalLPs -= LP;

        if (LP >= users.LP) {
            delete userInfo[msg.sender];
        }
    }

    function calculateUserShare(address userAddress) external view returns (uint256) {
        UserInfo storage user = userInfo[userAddress];
        uint256 elapsedTime = block.timestamp - user.lastUpdateTime;
        uint256 userWeight = user.LP * elapsedTime;
        uint256 totalWeight = totalLPs * elapsedTime;

        return (userWeight * 100) / totalWeight; // Возвращаем долю пользователя в процентах
    }
    // function getPrivateLP(address user) external view returns (uint256) {
    //     UserInfo storage users = userInfo[user];
    //     uint256 privateLP = (users.LPt * totalLPs) / totalLPts;
    //     return privateLP;
    // }

    // function getPrivateNumber(address user) external view returns (uint256) {
    //     // Calculate the user's weight in the pool based on the time intervals
    //     uint256 elapsedTime = block.timestamp.sub(userInfo[user].lastUpdateTime);
    //     uint256 userWeight = userInfo[user].LP.mul(elapsedTime);

    //     // Calculate the private number of LPs relative to the total number of LPs
    //     uint256 privateNumber = userWeight.mul(totalLPs).div(totalLPs);

    //     return privateNumber;
    // }

    function getUserInfo(address user) external view returns (UserInfo memory) {
        return userInfo[user];
    }
}
