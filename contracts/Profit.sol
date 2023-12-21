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
    uint256 private totalLPts;

    function deposit(uint256 LP) external {
        UserInfo storage users = userInfo[msg.sender];
        uint256 t = block.timestamp;
        uint256 LPt = LP * t;
        if (users.LP <= 0) {
            userInfo[msg.sender] = UserInfo(t, LP, LPt); // Initialize weight to 0
        }
        users.LP += LP;
        users.LPt += LPt;
        users.lastUpdateTime = t;
        totalLPs += LP;
        totalLPts += LPt;
    }

    function withdraw(uint256 LP) external {
        UserInfo storage users = userInfo[msg.sender];
        require(users.LP >= LP, "Insufficient LP amount");

        uint256 t = block.timestamp;
        users.LP -= LP;
        uint256 oldUserLPt = users.LP.mul(t);
        users.LPt -= LP;

        users.LPt = (oldUserLPt + LP.mul(t)).div(2);
        users.lastUpdateTime = t;

        if (LP >= users.LP) {
            delete userInfo[msg.sender];
        }
    }

    function getPrivateLP(address user) external view returns (uint256) {
        UserInfo storage users = userInfo[user];
        uint256 privateLP = (users.LPt * totalLPs) / totalLPts;
        return privateLP;
    }

    function getPrivateNumber(address user) external view returns (uint256) {
        // Calculate the user's weight in the pool based on the time intervals
        uint256 elapsedTime = block.timestamp.sub(userInfo[user].lastUpdateTime);
        uint256 userWeight = userInfo[user].LP.mul(elapsedTime);

        // Calculate the private number of LPs relative to the total number of LPs
        uint256 privateNumber = userWeight.mul(totalLPs).div(totalLPs);

        return privateNumber;
    }

    function getUserInfo(address user) external view returns (UserInfo memory) {
        return userInfo[user];
    }
}
