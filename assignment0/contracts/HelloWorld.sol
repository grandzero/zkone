// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract HelloWorld {
    uint256 public test = 9;

    function setTest(uint256 _test) external {
        test = _test;
    }

    function getTest() external view returns (uint256) {
        return test;
    }
}
