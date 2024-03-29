// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Auth.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title Universal store of current contract time for testing environments.
 */
contract Timer is Auth {
    using SafeMath for uint256;
    uint256 private _currentTime;

    bool public enabled = false;

    constructor() Auth(msg.sender) {}

    /**
     * @notice Sets the current time.
     * @dev Will revert if not running in test mode.
     * @param time timestamp to set `currentTime` to.
     */
    function setCurrentTime(uint256 time) external authorized {
        require(time >= _currentTime, "Return to the future Doc!");
        _currentTime = time;
    }

    function enable(bool _enabled) external authorized {
        require(enabled == false, "Can not be disabled");
        enabled = _enabled;
    }

    function increaseDays(uint256 _days) external authorized {
        _currentTime = getCurrentTime().add(uint256(1 days).mul(_days));
    }

    function increaseMinutes(uint256 _minutes) external authorized {
        _currentTime = getCurrentTime().add(uint256(1 minutes).mul(_minutes));
    }

    function increaseSeconds(uint256 _seconds) external authorized {
        _currentTime = getCurrentTime().add(uint256(1 seconds).mul(_seconds));
    }

    /**
     * @notice Gets the current time. Will return the last time set in `setCurrentTime` if running in test mode.
     * Otherwise, it will return the block timestamp.
     * @return currentTime for the current Testable timestamp.
     */
    function getCurrentTime() public view returns (uint256 currentTime) {
        if (enabled) return _currentTime;
        else return block.timestamp;
    }
}
