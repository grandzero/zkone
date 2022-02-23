// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract MultipleStoringTest {
    address[] public first;
    mapping(address => bool) public second;
    mapping(address => bool) public third;


    function f1_storeAddr(address[] memory newList) external {
        
        first = newList;
    }

    function f2_saveWithLoop (address[] memory voters) external{
       
        for(uint256 i = 0; i<voters.length; i++){
            second[voters[i]] = true;
        }
    }

    
     function saveWithAssembly(address _user) internal
    {
        assembly {
            mstore(0, _user)
            mstore(32, third.slot)
            let hash := keccak256(0, 64)
            sstore(hash, true)
        }     
    }

     function f3_loopWithInlineAssembly(address[] memory _voters) external{
       
        for(uint256 i = 0; i<_voters.length; i++){
            saveWithAssembly(_voters[i]);
        }
    }

}
