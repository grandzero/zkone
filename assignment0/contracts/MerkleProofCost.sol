// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleProofCost {
    bytes32 public votersRootHash;

    /**
     * @dev Verify if voter is part of tree
     * @param voter address of voter which will be converted to leaf
     * @param proof hash values to prove voter in tree
     * @return bool value which indicated if voter in this hash tree
     */
    function verifyVoter(address voter, bytes32[] memory proof)
        external
        view
        returns (bool)
    {
        return
            MerkleProof.verify(
                proof,
                votersRootHash,
                keccak256(abi.encodePacked(voter))
            );
    }

    /**
     * @dev Save merkle tree root
     * @param root hash root of merkle tree
     */
    function setHashRoot(bytes32 root) external {
        votersRootHash = root;
    }
}
