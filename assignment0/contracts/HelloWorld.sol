// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract HelloWorld {
    uint256 public test = 9;

    /**
     * @dev Set storage variable test value
     * @param _test uint256 value of new test
     */
    function setTest(uint256 _test) external {
        test = _test;
    }

    /**
     * @dev Get the value of test
     * @return uint256 value of current test
     */
    function getTest() external view returns (uint256) {
        return test;
    }
}
