// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import '@openzeppelin/contracts/utils/Address.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Token is Ownable, ERC20 {
    uint256 private _totalSupply = 100000 * 10 ** 18;

    constructor() ERC20('Base Mars', 'Base Mars') {
        _mint(msg.sender, _totalSupply);
    }

    receive() external payable {
        revert();
    }

    function recover() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
