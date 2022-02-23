const { expect } = require("chai");
const { ethers } = require("hardhat");
const keccak256 = require("keccak256");
const { MerkleTree } = require('merkletreejs')
describe("Merkle Proof Contract", function () {
  let mpc; // MerkleProofCost
  let addresses; // Address array 
  let leaves; // Will be used in tests 
  let tree; // Tree object
  let root; // Root hash
  let gasUsage = {};
  beforeEach(async function(){
    const MerkleProofCost = await ethers.getContractFactory("MerkleProofCost");
    mpc = await MerkleProofCost.deploy();
    await mpc.deployed();


    let [owner, ...addrObjects] = await ethers.getSigners();
    addresses = addrObjects.map(x => x.address);
    leaves = addresses.map(x => keccak256(x));
    tree = new MerkleTree(leaves, keccak256, { sort: true })
    root = tree.getHexRoot()
  });

  it("Should set the root with hash", async function () {
    
    let tx = await mpc.setHashRoot(root);
    //let proof = tree.getHexProof(keccak256(addresses[0]));
    let receipt = await tx.wait();
    const gasUsed = receipt.cumulativeGasUsed.toString();
    gasUsage.setHashRoot = gasUsed;
    
    // Get saved hashRoot
    let hashRoot = await mpc.votersRootHash();
    expect(hashRoot).to.equal(root);
    //.to.equal("Hola, mundo!");
  });

  it("Should verify address with root", async function () {
    
    let setRootTx = await mpc.setHashRoot(root);
    await setRootTx.wait();
    let proof = tree.getHexProof(keccak256(addresses[0]));

    let tx = await mpc.verifyVoter(addresses[0], proof);
    console.log(tx);
    //let receipt = await tx.wait();
    const gasEstimation = await mpc.estimateGas.verifyVoter(addresses[0], proof);
    gasUsage.verifyVoter = gasEstimation.toString();
    
    // Get saved hashRoot
    //let hashRoot = await mpc.votersRootHash();
    expect(tx).to.equal(true);
    //.to.equal("Hola, mundo!");
  });

  it("Compare all gas usages", function(){
    console.table(gasUsage);
});

});
