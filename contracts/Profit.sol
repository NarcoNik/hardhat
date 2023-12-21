// SPDX-License-Identifier: MIT
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

    uint256 public allLP;
    uint256 public allLPt;

    struct UserInfo {
        uint256 t;
        uint256 LP;
        uint256 LPt;
    }

    mapping(address => UserInfo) userInfo;

    function deposit(uint256 LP) external {
        uint256 t = block.timestamp;
        uint256 LPt = LP * t;
        userInfo[msg.sender] = UserInfo(t, LP, LPt); // Initialize weight to 0
        allLP += LP;
        allLPt += LPt;
    }

    function withdraw(uint256 LP) external {
        UserInfo storage user = userInfo[msg.sender];
        require(user.LP >= LP, "Insufficient LP amount");

        uint256 t = block.timestamp;
        user.LP -= LP;
        uint256 newUserLPt = user.LP.mul(user.t);

        user.LPt = newUserLPt.mul(t);
        if (LP >= user.LP) {
            delete userInfo[msg.sender];
        }
    }

    function getPrivateLP(address user) external view returns (uint256) {
        UserInfo storage users = userInfo[user];
        uint256 privateLP = (users.LPt * allLP) / allLPt;
        return privateLP;
    }

    function getUserInfo(address user) external view returns (UserInfo memory) {
        return userInfo[user];
    }
}
