const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Multiple Storing Tests Contract", function () {
  let mst;
  let addressList;
  let gasResults=[];

  beforeEach(async function(){
    const MST = await ethers.getContractFactory("MultipleStoringTest");
    mst = await MST.deploy();
    const deploymentData = mst.interface.encodeDeploy();
    const estimatedGas = await ethers.provider.estimateGas({ data: deploymentData });
    
    gasResults.deploy = estimatedGas.toString();
    // Signer address objects
    let [owner,...addrObjects] = await ethers.getSigners();
    
    // We only need the public addresses 
    addressList = addrObjects.map(addr => addr.address);

  });

  it("Should save address array directly to storage", async function () {
    // This operation calls SSTORE opcode
    // Which is pretty expensive
    let storeArrayTx = await mst.f1_storeAddr(addressList);

    // Wait for TX resolve
    const receipt = await storeArrayTx.wait();
    const gasUsed = receipt.cumulativeGasUsed.toString() ;
    gasResults.f1_storeAddr = gasUsed;

    // Test wheter addresses saved
    let savedAddr = await mst.first(0);
    expect(savedAddr).to.equal(addressList[0]);

  });

  it("Should save addresses to mapping by looping", async function () {
    
    // This function simply iterates through all addresses
    // And saves all addresses to a mapping
    let storeMapping = await mst.f2_saveWithLoop(addressList);

    // Wait for TX resolve
    const receipt = await storeMapping.wait();
    const gasUsed = receipt.cumulativeGasUsed.toString() ;
    gasResults.f2_saveWithLoop = gasUsed;

    // Test wheter addresses saved
    let boolValue = await mst.second(addressList[0]);
    expect(boolValue).to.equal(true);

  });

  it("Should save addresses to mapping by looping with inline assembly", async function () {
    
    // This function simply iterates through all addresses
    // And saves all addresses to a mapping
    let storeMapping = await mst.f3_loopWithInlineAssembly(addressList);

    // Wait for TX resolve
    const receipt = await storeMapping.wait();
    const gasUsed = receipt.cumulativeGasUsed.toString() ;
    gasResults.f3_loopWithInlineAssembly = gasUsed;

    // Test wheter addresses saved
    let boolValue = await mst.third(addressList[0]);
    expect(boolValue).to.equal(true);

  });

  it("Compare all gas usages", function(){
        console.table(gasResults);
  });

});
