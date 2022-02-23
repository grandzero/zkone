const { expect } = require("chai");
const { ethers } = require("hardhat");
const keccak256 = require("keccak256");
const { MerkleTree } = require('merkletreejs')
describe("Extended Ballot Contract", function () {
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


    let [owner, addr1, addr2, addr3, addr4, addr5, addr6, ...addrObjects] = await ethers.getSigners();
    addresses = addrObjects.map(x => x.address);
    leaves = addresses.map(x => keccak256(x));
    tree = new MerkleTree(leaves, keccak256, { sort: true })
    root = tree.getHexRoot()
  });

  it("Should store users by storing merkle root hash", async function () {

  });

  
  it("Should give vote right to one address", async function () {

  });

  
  it("Should give batch vote right and should two address use vote successfully", async function () {

  });

  
  it("Should give one user vote right and user should be able to vote successfully", async function () {

  });

  
  it("Should no one able to vote", async function () {

  });

  
  it("Should give batch vote right, two address vote successfully and try to give voteright again (revert)", async function () {

  });

  
  it("Should give one vote right, address vote successfully and give batch vote right and try vote again (revert)", async function () {

  });

  it("Compare all gas usages", function(){
    console.table(gasUsage);
});

});
