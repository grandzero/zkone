const { expect } = require("chai");
const { ethers } = require("hardhat");
const keccak256 = require("keccak256");
const { MerkleTree } = require('merkletreejs')
describe("Extended Ballot Contract", function () {
  let ballot; // MerkleProofCost
  let addresses; // Address array 
  let leaves; // Will be used in tests 
  let tree; // Tree object
  let root; // Root hash
  let gasUsage = {};
  let owner,addr1,addr2,addr3,addr4,addr5,addr6,addrObjects;
  beforeEach(async function(){
    const BallotExtended = await ethers.getContractFactory("BallotExtended");
    //let bytes32 = ethers.utils.formatBytes32String(text)
    ballot = await BallotExtended.deploy([
      ethers.utils.formatBytes32String("Proposal 1"),
      ethers.utils.formatBytes32String("Proposal 2"),
      ethers.utils.formatBytes32String("Proposal 3")
    ]);
    await ballot.deployed();


    [owner, addr1, addr2, addr3, addr4, addr5, addr6, ...addrObjects] = await ethers.getSigners();
    addresses = addrObjects.map(x => x.address);
    leaves = addresses.map(x => keccak256(x));
    tree = new MerkleTree(leaves, keccak256, { sort: true })
    root = tree.getHexRoot()
  });

  it("Should store users by storing merkle root hash", async function () {
    let tx = await ballot.setVerifiedHashRoot(root);
    
    let receipt = await tx.wait();
    const gasUsed = receipt.cumulativeGasUsed.toString();
    gasUsage.setVerifiedHashRoot = gasUsed;
    
    // Get saved hashRoot
    let hashRoot = await ballot.verifiedHashRoot();
    expect(hashRoot).to.equal(root);
  });

  
  it("Should give vote right to one address", async function () {
    let tx = await ballot.giveRightToVote(addr1.address);
    
    let receipt = await tx.wait();
    const gasUsed = receipt.cumulativeGasUsed.toString();
    gasUsage.giveRightToVote = gasUsed;

    let seeChangeTx = await ballot.voters(addr1.address);
    expect(seeChangeTx.weight).to.equal(1);
  });

  
  it("Should give batch vote right and should two address use vote successfully", async function () {
    let tx = await ballot.setVerifiedHashRoot(root);
    let proof1 = tree.getHexProof(keccak256(addresses[0]));
    let proof2 = tree.getHexProof(keccak256(addresses[1]));
    await tx.wait();
    // let receipt = await tx.wait();
    // const gasUsed = receipt.cumulativeGasUsed.toString();
    // gasUsage.setVerifiedHashRoot = gasUsed;

    tx = await ballot.connect(addrObjects[0]).vote(1,proof1);
    let receipt = await tx.wait();
    let gasUsed = receipt.cumulativeGasUsed.toString();
    gasUsage.vote_1 = gasUsed;

    tx = await ballot.connect(addrObjects[1]).vote(1,proof2);
    receipt = await tx.wait();
    gasUsed = receipt.cumulativeGasUsed.toString();
    gasUsage.vote_2 = gasUsed;

    let result = await ballot.proposals(1);
    expect(result.voteCount).to.equal(2);

  });

  
  it("Should give one user vote right and user should be able to vote successfully", async function () {
    let tx = await ballot.giveRightToVote(addr1.address);
    await tx.wait();

    tx = await ballot.connect(addr1).vote(1,[]);
    receipt = await tx.wait();
    gasUsed = receipt.cumulativeGasUsed.toString();
    gasUsage.vote_particular_user = gasUsed;

    let result = await ballot.proposals(1);
    expect(result.voteCount).to.equal(1);
  });

  
  it("Should no one able to vote", async function () {
    await expect(ballot.connect(addr1).vote(1,[])).to.be.revertedWith("Has no right to vote");
  });

  
  it("Should give batch vote right, two address vote successfully and try to give voteright again (revert)", async function () {
    let tx = await ballot.setVerifiedHashRoot(root);
    let proof1 = tree.getHexProof(keccak256(addresses[0]));
    let proof2 = tree.getHexProof(keccak256(addresses[1]));
    await tx.wait();

    tx = await ballot.connect(addrObjects[0]).vote(1,proof1);
    let receipt = await tx.wait();
    let gasUsed = receipt.cumulativeGasUsed.toString();
    gasUsage.vote_1_again = gasUsed;

    tx = await ballot.connect(addrObjects[1]).vote(1,proof2);
    receipt = await tx.wait();
    gasUsed = receipt.cumulativeGasUsed.toString();
    gasUsage.vote_2_again = gasUsed;

    await expect(ballot.giveRightToVote(addresses[0])).to.be.revertedWith("The voter already voted.");
  });


  it("Compare all gas usages", function(){
    console.table(gasUsage);
});

});
