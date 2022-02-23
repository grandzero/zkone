const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Hello World Contract", function () {
  let hw;
  beforeEach(async function(){
    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    hw = await HelloWorld.deploy();
    await hw.deployed();
  });

  it("Should set the test value 10", async function () {
    
    const setTestTx = await hw.setTest(10);

    // wait until the transaction is mined
    expect(await setTestTx.wait());
    //.to.equal("Hola, mundo!");
  });

  it("Should retrieve the test value as 10", async function () {
    // Get the value
    const getTestTx = await hw.getTest();
    // Since this function is "view", no need to wait for tx

    expect(getTestTx).to.equal(9);
  });

  it("Should set test value to 111 and retrieve as 111", async function () {
    
    // Set the value first
    const setTestTx = await hw.setTest(111);

    // wait until the transaction is mined
    expect(await setTestTx.wait());

    // Get the value
    const getTestTx = await hw.getTest();
    // Since this function is "view", no need to wait for tx

    expect(getTestTx).to.equal(111);
  });
});
